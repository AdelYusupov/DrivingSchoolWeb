package models

import "time"

type Lesson struct {
	ID              uint      `gorm:"primary_key"`
	GroupID         uint      `gorm:"not null"`
	LessonType      string    `gorm:"size:20;not null"` // theory/practice
	Title           string    `gorm:"size:100;not null"`
	Description     string    `gorm:"type:text"`
	DateTime        time.Time `gorm:"not null"`
	DurationMinutes uint      `gorm:"not null"`
	Location        string    `gorm:"size:100"`
	CarID           uint
	Status          string `gorm:"size:20;default:'planned'"`
	Group           Group  `gorm:"foreignKey:GroupID"`
	Car             Car    `gorm:"foreignKey:CarID"`
}
