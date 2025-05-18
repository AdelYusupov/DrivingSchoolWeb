package models

import "time"

type LessonSignup struct {
	ID        uint      `gorm:"primary_key;"`
	StudentID uint      `gorm:"not null"`
	LessonID  uint      `gorm:"not null"`
	Status    string    `gorm:"size:20;default:'scheduled'"`
	CreatedAt time.Time `gorm:"not null;default:CURRENT_TIMESTAMP"`
	Student   Student   `gorm:"foreignKey:StudentID"`
	Lesson    Lesson    `gorm:"foreignKey:LessonID"`
}
