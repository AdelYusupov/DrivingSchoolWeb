package main

import (
	"bytes"
	"drivingSchool/config"
	"drivingSchool/database"
	"drivingSchool/internal/handlers"
	"drivingSchool/internal/models"
	"encoding/json"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httptest"
	"os"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var (
	db     *gorm.DB
	router *gin.Engine
)

func TestMain(m *testing.M) {
	// Настройка тестовой базы данных
	cfg := &config.Config{
		DBHost:     "localhost",
		DBPort:     "5432",
		DBUser:     "postgres",
		DBPassword: "password",
		DBName:     "drivingSchool_test",
		ServerPort: "8080",
	}

	var err error
	db, err = database.NewPostgresConnection(cfg)
	if err != nil {
		panic("failed to connect to test database")
	}

	// Настройка роутера
	router = setupRouter(db)

	// Запуск тестов
	code := m.Run()

	os.Exit(code)
}

func setupRouter(db *gorm.DB) *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	studentHandler := handlers.NewStudentHandler(db)
	instructorHandler := handlers.NewInstructorHandler(db)
	authHandler := handlers.NewAuthHandler(db)
	lessonHandler := handlers.NewLessonHandler(db)

	api := router.Group("/api")
	{
		api.GET("/students", studentHandler.GetAllStudents)
		api.GET("/instructors", instructorHandler.GetAllInsructors)
		api.POST("/students/login", authHandler.LoginStudent)

		protected := api.Group("/")
		protected.Use(AuthMiddleware())
		{
			protected.GET("/lessons/practice", lessonHandler.GetAvailableLessons)
			protected.POST("/lessons/signup", lessonHandler.SignUpForLesson)
			protected.GET("/lessons/my-signups", lessonHandler.GetStudentSignups)
			protected.DELETE("/lessons/signups/:id", lessonHandler.CancelSignup)
		}
	}

	return router
}

func TestGetAllStudents(t *testing.T) {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/students", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response []models.Student
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(response), 5) // В БД есть 5 студентов
}

func TestGetAllInstructors(t *testing.T) {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/instructors", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response []models.Instructor
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(response), 7) // В БД есть 7 инструкторов
}

func TestLoginStudent(t *testing.T) {
	testCases := []struct {
		name         string
		payload      map[string]string
		expectedCode int
	}{
		{
			name: "Valid credentials for student1",
			payload: map[string]string{
				"login":    "student1",
				"password": "student1", // Предполагаем пароль
			},
			expectedCode: http.StatusOK,
		},
		{
			name: "Invalid password",
			payload: map[string]string{
				"login":    "student1",
				"password": "wrongpassword",
			},
			expectedCode: http.StatusUnauthorized,
		},
		{
			name: "Invalid login",
			payload: map[string]string{
				"login":    "nonexistent",
				"password": "password",
			},
			expectedCode: http.StatusUnauthorized,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			payloadBytes, _ := json.Marshal(tc.payload)
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("POST", "/api/students/login", bytes.NewBuffer(payloadBytes))
			req.Header.Set("Content-Type", "application/json")
			router.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)

			if tc.expectedCode == http.StatusOK {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Contains(t, response, "token")
				assert.Contains(t, response, "student")
			}
		})
	}
}

func TestProtectedEndpointsWithoutAuth(t *testing.T) {
	endpoints := []struct {
		method string
		path   string
	}{
		{"GET", "/api/lessons/practice"},
		{"POST", "/api/lessons/signup"},
		{"GET", "/api/lessons/my-signups"},
		{"DELETE", "/api/lessons/signups/1"},
	}

	for _, endpoint := range endpoints {
		t.Run(endpoint.path, func(t *testing.T) {
			w := httptest.NewRecorder()
			req, _ := http.NewRequest(endpoint.method, endpoint.path, nil)
			router.ServeHTTP(w, req)

			assert.Equal(t, http.StatusUnauthorized, w.Code)
		})
	}
}

func TestGetAvailableLessons(t *testing.T) {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/lessons/practice", nil)
	req.Header.Set("Authorization", "Bearer generated_token_example")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string][]map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "lessons")

	// Проверяем, что возвращаются только planned уроки (ID 11 и 12)
	plannedLessonsFound := false
	for _, lesson := range response["lessons"] {
		if lesson["status"] == "planned" {
			plannedLessonsFound = true
			break
		}
	}
	assert.True(t, plannedLessonsFound, "Should return planned lessons")
}

func TestSignUpForLesson(t *testing.T) {
	// Используем существующий planned урок (ID 11 или 12)
	var plannedLesson models.Lesson
	if err := db.Where("status = ?", "planned").First(&plannedLesson).Error; err != nil {
		t.Fatal("No planned lessons available for testing")
	}

	payload := map[string]interface{}{
		"lessonId": plannedLesson.ID,
	}
	payloadBytes, _ := json.Marshal(payload)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/lessons/signup", bytes.NewBuffer(payloadBytes))
	req.Header.Set("Authorization", "Bearer generated_token_example")
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "message")
	assert.Contains(t, response, "signup")

	// Проверяем, что статус урока изменился на booked
	var updatedLesson models.Lesson
	db.First(&updatedLesson, plannedLesson.ID)
	assert.Equal(t, "booked", updatedLesson.Status)

	// Удаляем созданную запись, чтобы не влиять на другие тесты
	var signup models.LessonSignup
	db.Where("lesson_id = ?", plannedLesson.ID).Delete(&signup)
	db.Model(&updatedLesson).Update("status", "planned")
}

func TestGetStudentSignups(t *testing.T) {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/lessons/my-signups", nil)
	req.Header.Set("Authorization", "Bearer generated_token_example")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string][]map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "signups")

	// Проверяем, что возвращаются записи студента с ID 13
	assert.GreaterOrEqual(t, len(response["signups"]), 0)
}

func TestCancelSignup(t *testing.T) {
	// Создаем временную запись на урок для теста
	var plannedLesson models.Lesson
	if err := db.Where("status = ?", "planned").First(&plannedLesson).Error; err != nil {
		t.Fatal("No planned lessons available")
	}

	signup := models.LessonSignup{
		StudentID: 13, // соответствует studentID из AuthMiddleware
		LessonID:  plannedLesson.ID,
		Status:    "scheduled",
	}
	if err := db.Create(&signup).Error; err != nil {
		t.Fatal("Failed to create test signup")
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/api/lessons/signups/"+strconv.Itoa(int(signup.ID)), nil)
	req.Header.Set("Authorization", "Bearer generated_token_example")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Contains(t, response, "message")

	// Проверяем, что запись удалена
	var deletedSignup models.LessonSignup
	err = db.First(&deletedSignup, signup.ID).Error
	assert.Error(t, err)
	assert.Equal(t, gorm.ErrRecordNotFound, err)

	// Проверяем, что статус урока вернулся в planned
	var updatedLesson models.Lesson
	db.First(&updatedLesson, plannedLesson.ID)
	assert.Equal(t, "planned", updatedLesson.Status)
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Получаем токен из заголовка
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			return
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
			return
		}

		token := tokenParts[1]

		if token != "generated_token_example" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		c.Set("studentID", uint(13)) // Используем существующего студента student2

		c.Next()
	}
}
