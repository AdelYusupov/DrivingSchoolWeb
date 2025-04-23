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

	token := "generated_token_example"

	student.Password = ""
	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"student": gin.H{
			"id":       student.ID,
			"login":    student.Login,
			"fullName": student.FullName,
			"email":    student.Email,
		},
	})
}
