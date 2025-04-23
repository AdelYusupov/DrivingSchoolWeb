package models

type Instructor struct {
	ID              uint   `gorm:"primary_key"`
	Login           string `gorm:"unique;not null"`
	Password        string `gorm:"not null"`
	FullName        string `gorm:"not null"`
	Email           string `gorm:"unique;not null"`
	Phone           string `gorm:"not null"`
	CarID           uint
	LicenceNumber   string `gorm:"not null"`
	ExperienceYears string `gorm:"not null"`
	HireDate        string `gorm:"type:date"`
	Status          string `gorm:"default:'active'"`
}
