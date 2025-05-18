package handlers

import (
	"drivingSchool/internal/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"log"
	"net/http"
)

type AuthHandler struct {
	DB *gorm.DB
}

func NewAuthHandler(db *gorm.DB) *AuthHandler {
	return &AuthHandler{DB: db}
}

func (h *AuthHandler) LoginStudent(c *gin.Context) {
	var credentials struct {
		Login    string `json:"login" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}

	var student models.Student
	if err := h.DB.Where("login = ?", credentials.Login).First(&student).Error; err != nil {
		log.Printf("Ошибка поиска студента: %v", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный логин или пароль"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(student.Password), []byte(credentials.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный логин или пароль"})
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

	if student.GroupID != 0 {
		var group models.Group
		if err := h.DB.Preload("Course").Preload("Instructor").
			First(&group, student.GroupID).Error; err == nil {

			groupInfo := gin.H{
				"id":       group.ID,
				"name":     group.Name,
				"schedule": group.Schedule,
				"status":   group.Status,
			}

			if group.CourseID != 0 {
				groupInfo["course"] = gin.H{
					"name":     group.Course.Name,
					"category": group.Course.Category,
					"hours":    group.Course.Hours,
				}
			}

			if group.InstructorID != 0 {
				groupInfo["instructor"] = gin.H{
					"fullName": group.Instructor.FullName,
					"phone":    group.Instructor.Phone,
				}
			}

			response["group"] = groupInfo
		}
	}

	token := "generated_token_example"
	c.JSON(http.StatusOK, gin.H{
		"token":   token,
		"student": response,
	})
}
