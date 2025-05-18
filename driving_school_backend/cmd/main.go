package main

import (
	"drivingSchool/config"
	"drivingSchool/database"
	"drivingSchool/internal/handlers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"strings"
	"time"
)

func main() {
	cfg, err := config.LoadConfig(".")
	if err != nil {
		log.Fatal("Config load error:", err)
	}

	db, err := database.NewPostgresConnection(cfg)
	if err != nil {
		log.Fatal("Database connection error:", err)
	}

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

	log.Printf("Server starting on port %s", cfg.ServerPort)
	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatal("Server error:", err)
	}
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

		c.Set("studentID", uint(13))

		c.Next()
	}
}
