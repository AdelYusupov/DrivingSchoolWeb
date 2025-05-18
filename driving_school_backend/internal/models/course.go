package models

type Course struct {
	ID           uint   `gorm:"primary_key"`
	Name         string `gorm:"size:100;not null"`
	Category     string `gorm:"size:10;not null"`
	Description  string `gorm:"type:text"`
	Price        float64
	Hours        uint
	Requirements string `gorm:"type:text"`
	Status       string `gorm:"size:20;default:'active'"`
}
