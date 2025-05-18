package models

type Car struct {
	ID           uint   `gorm:"primary_key"`
	Model        string `gorm:"size:50;not null"`
	LicensePlate string `gorm:"size:15;unique;not null"`
	Transmission string `gorm:"size:10;not null"` // manual/automatic
	Year         uint
	Color        string `gorm:"size:30"`
	Status       string `gorm:"size:20;default:'available'"`
}
