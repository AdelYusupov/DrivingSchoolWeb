package handlers

import (
	"drivingSchool/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

type InstructorHandler struct {
	DB *gorm.DB
}

func NewInstructorHandler(db *gorm.DB) *InstructorHandler {
	return &InstructorHandler{DB: db}
}

func (i *InstructorHandler) GetAllInsructors(c *gin.Context) {
	var instructors []models.Instructor

	if err := i.DB.Find(&instructors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, instructors)
}
