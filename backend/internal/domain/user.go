package domain

import "time"

type User struct {
	ID           string
	Email        string
	PasswordHash string
	Name         string
	Role         string
	IsActive     bool
	CreatedAt    time.Time
}

type AuthResult struct {
	AccessToken  string    `json:"accessToken"`
	RefreshToken string    `json:"refreshToken"`
	ExpiresAt    time.Time `json:"expiresAt"`
}

type UserProfile struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Role      string    `json:"role"`
	IsActive  bool      `json:"isActive"`
	CreatedAt time.Time `json:"createdAt"`
}

type CreateUserInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Role     string `json:"role"`
}

type DashboardStats struct {
	UserCount           int       `json:"userCount"`
	ActiveUserCount     int       `json:"activeUserCount"`
	ActiveSessionCount  int       `json:"activeSessionCount"`
	ConfigUpdatedAt     time.Time `json:"configUpdatedAt"`
	WhatsappConfigured  bool      `json:"whatsappConfigured"`
	ContactConfigured   bool      `json:"contactConfigured"`
}

type HousekeepingReport struct {
	ExpiredTokensPurged int    `json:"expiredTokensPurged"`
	Message             string `json:"message"`
}
