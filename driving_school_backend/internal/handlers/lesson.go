package handlers

import (
	"drivingSchool/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"time"
)

type LessonHandler struct {
	DB *gorm.DB
}

func NewLessonHandler(db *gorm.DB) *LessonHandler {
	return &LessonHandler{DB: db}
}

func (h *LessonHandler) GetAvailableLessons(c *gin.Context) {
	studentID, exists := c.Get("studentID")
	if !exists {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "не удалось идентифицировать студента"})
		return
	}
	var student models.Student
	if err := h.DB.First(&student, studentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Студент не найден"})
		return
	}
	if student.GroupID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Студент не принадлежит ни к одной группе"})
		return
	}
	var lessons []models.Lesson
	err := h.DB.Preload("Car").Where("group_id = ? AND lesson_type = ? AND status = ?",
		student.GroupID, "practice", "planned").
		Find(&lessons).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении занятий"})
		return
	}
	var response []gin.H
	for _, lesson := range lessons {
		response = append(response, gin.H{
			"id":          lesson.ID,
			"title":       lesson.Title,
			"description": lesson.Description,
			"dataTime":    lesson.DateTime.Format("2006-01-02 15:04:04"),
			"duration":    lesson.DurationMinutes,
			"location":    lesson.Location,
			"car": gin.H{
				"model":        lesson.Car.Model,
				"licensePlate": lesson.Car.LicensePlate,
			},
			"status": lesson.Status,
		})
	}
	c.JSON(http.StatusOK, gin.H{"lessons": response})
}

func (h *LessonHandler) SignUpForLesson(c *gin.Context) {
	studentID, exists := c.Get("studentID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Не удалось идентифицировать пользователя"})
		return
	}
	var request struct {
		LessonID uint `json:"lessonId" binding:"required"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}
	var lesson models.Lesson
	if err := h.DB.First(&lesson, request.LessonID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Занятие не найдено"})
		return
	}
	if lesson.Status != "planned" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Занятие не доступно для записи"})
		return
	}
	var existingSignup models.LessonSignup
	if err := h.DB.Where("student_id = ? AND lesson_id = ?", studentID, request.LessonID).
		First(&existingSignup).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Вы уже записаны на это занятие"})
		return
	}

	signup := models.LessonSignup{
		StudentID: studentID.(uint),
		LessonID:  request.LessonID,
		Status:    "scheduled",
	}
	if err := h.DB.Create(&signup).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при записи на занятие"})
		return
	}
	h.DB.Model(&lesson).Update("status", "booked")

	c.JSON(http.StatusOK, gin.H{
		"message": "Вы успешно записаны на занятие",
		"signup": gin.H{
			"id":        signup.ID,
			"lessonId":  signup.LessonID,
			"status":    signup.Status,
			"createdAt": signup.CreatedAt.Format(time.RFC3339),
		},
	})

}
func (h *LessonHandler) GetStudentSignups(c *gin.Context) {
	studentID, exists := c.Get("studentID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Не удалось идентифицировать студента"})
		return
	}

	var signups []models.LessonSignup
	if err := h.DB.Preload("Lesson").Preload("Lesson.Car").
		Where("student_id = ?", studentID).
		Find(&signups).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении записей"})
		return
	}

	var response []gin.H
	for _, signup := range signups {
		lesson := signup.Lesson
		response = append(response, gin.H{
			"id":       signup.ID,
			"lessonId": lesson.ID,
			"title":    lesson.Title,
			"dateTime": lesson.DateTime.Format("2006-01-02 15:04"),
			"duration": lesson.DurationMinutes,
			"location": lesson.Location,
			"status":   signup.Status,
			"car": gin.H{
				"model":        lesson.Car.Model,
				"licensePlate": lesson.Car.LicensePlate,
			},
			"createdAt": signup.CreatedAt.Format("2006-01-02 15:04"),
		})
	}

	c.JSON(http.StatusOK, gin.H{"signups": response})
}

func (h *LessonHandler) CancelSignup(c *gin.Context) {
	studentID, exists := c.Get("studentID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Не удалось идентифицировать студента"})
		return
	}

	signupID := c.Param("id")

	var signup models.LessonSignup
	if err := h.DB.Where("id = ? AND student_id = ?", signupID, studentID).
		First(&signup).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Запись не найдена"})
		return
	}

	if err := h.DB.Delete(&signup).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при отмене записи"})
		return
	}

	h.DB.Model(&models.Lesson{ID: signup.LessonID}).Update("status", "planned")

	c.JSON(http.StatusOK, gin.H{"message": "Запись успешно отменена"})
}
