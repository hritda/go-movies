package models

import (
	"errors"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        int       `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

func (u *User) MatchPassword(plainText string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(plainText))
	fmt.Println(err)
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			{
				fmt.Println("the passwords did not match")
				return false, nil
			}

		default:
			return false, err
		}
	}
	return true, nil
}

func (u *User) ConvertPasswordToHash() (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(u.Password), 10)
	return string(bytes), err
}
