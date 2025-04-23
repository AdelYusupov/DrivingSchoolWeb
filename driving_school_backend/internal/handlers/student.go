package handlers

import (
	"drivingSchool/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type StudentHandler struct {
	DB *gorm.DB
}

func NewStudentHandler(db *gorm.DB) *StudentHandler {
	return &StudentHandler{DB: db}
}

func (h *StudentHandler) GetAllStudents(c *gin.Context) {
	var students []models.Student
	if err := h.DB.Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, students)
}

func (h *StudentHandler) GetStudentProfile(c *gin.Context) {
	studentID := 1

	var student models.Student
	if err := h.DB.First(&student, studentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Студент не найден"})
		return
	}

	response := gin.H{
		"id":       student.ID,
		"login":    student.Login,
		"fullName": student.FullName,
		"email":    student.Email,
		"phone":    student.Phone,
		"status":   student.Status,
	}

	c.JSON(http.StatusOK, gin.H{"student": response})
}
