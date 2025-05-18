package models

type Group struct {
	ID              uint   `gorm:"primary_key"`
	CourseID        uint   `gorm:"not null"`
	InstructorID    uint   `gorm:"not null"`
	Name            string `gorm:"size:50;not null"`
	Schedule        string `gorm:"type:text"`
	MaxStudents     uint
	CurrentStudents uint       `gorm:"default:0"`
	Status          string     `gorm:"size:20;default:'forming'"`
	Course          Course     `gorm:"foreignKey:CourseID"`
	Instructor      Instructor `gorm:"foreignKey:InstructorID"`
}
