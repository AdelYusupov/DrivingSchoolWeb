package models

import (
	"time"
)

type Student struct {
	ID               uint   `gorm:"primary_key"`
	Login            string `gorm:"size:50;unique;not null"`
	Password         string `gorm:"size:100;not null"`
	FullName         string `gorm:"size:100;not null"`
	Email            string `gorm:"size:100;unique;not null"`
	Phone            string `gorm:"size:20;not null"`
	Address          string `gorm:"type:text"`
	BirthDate        *time.Time
	RegistrationDate time.Time `gorm:"not null;default:CURRENT_TIMESTAMP"`
	Status           string    `gorm:"size:20;default:'active'"`
	GroupID          uint
	Group            Group `gorm:"foreignKey:GroupID"`
}
