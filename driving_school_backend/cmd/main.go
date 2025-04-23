package main

import (
	"drivingSchool/config"
	"drivingSchool/database"
	"drivingSchool/internal/handlers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
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

	api := router.Group("/api")
	{
		api.GET("/students", studentHandler.GetAllStudents)
		api.GET("/instructors", instructorHandler.GetAllInsructors)
		api.POST("/students/login", authHandler.LoginStudent)

		protected := api.Group("/")
		protected.Use(AuthMiddleware())
		{
			protected.GET("/students/profile", studentHandler.GetStudentProfile)
		}
	}

	log.Printf("Server starting on port %s", cfg.ServerPort)
	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatal("Server error:", err)
	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Требуется авторизация"})
			return
		}
		if token != "valid_token_example" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Неверный токен"})
			return
		}

		c.Next()
	}
}
