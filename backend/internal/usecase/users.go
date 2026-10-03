package usecase

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"

	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/pkg/password"
	"snswindowtinting/backend/internal/repository"
)

type UsersUseCase struct {
	users repository.UserRepository
}

func NewUsersUseCase(users repository.UserRepository) *UsersUseCase {
	return &UsersUseCase{users: users}
}

func (uc *UsersUseCase) List() ([]domain.UserProfile, error) {
	users, err := uc.users.List()
	if err != nil {
		return nil, err
	}
	out := make([]domain.UserProfile, 0, len(users))
	for i := range users {
		out = append(out, *profileOf(&users[i]))
	}
	return out, nil
}

func (uc *UsersUseCase) Create(input domain.CreateUserInput) (*domain.UserProfile, error) {
	email := strings.ToLower(strings.TrimSpace(input.Email))
	name := strings.TrimSpace(input.Name)
	role := strings.TrimSpace(strings.ToLower(input.Role))
	if role == "" {
		role = "admin"
	}
	if email == "" || name == "" || len(input.Password) < 8 {
		return nil, domain.ErrValidation
	}
	if role != "admin" && role != "staff" {
		return nil, domain.ErrValidation
	}

	if _, err := uc.users.GetByEmail(email); err == nil {
		return nil, domain.ErrConflict
	} else if err != nil && !errors.Is(err, domain.ErrNotFound) {
		return nil, err
	}

	hash, err := password.Hash(input.Password)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:           "usr_" + uuid.NewString(),
		Email:        email,
		PasswordHash: hash,
		Name:         name,
		Role:         role,
		IsActive:     true,
		CreatedAt:    time.Now().UTC(),
	}
	if err := uc.users.Create(user); err != nil {
		return nil, err
	}
	return profileOf(user), nil
}

func (uc *UsersUseCase) SetActive(id, actorID string, active bool) (*domain.UserProfile, error) {
	if id == actorID && !active {
		return nil, domain.ErrForbidden
	}
	if err := uc.users.SetActive(id, active); err != nil {
		return nil, err
	}
	user, err := uc.users.GetByID(id)
	if err != nil {
		return nil, err
	}
	return profileOf(user), nil
}

func (uc *UsersUseCase) Update(id, actorID string, input domain.UpdateUserInput) (*domain.UserProfile, error) {
	user, err := uc.users.GetByID(id)
	if err != nil {
		return nil, err
	}

	if input.Name != nil {
		name := strings.TrimSpace(*input.Name)
		if name == "" {
			return nil, domain.ErrValidation
		}
		user.Name = name
	}
	if input.Email != nil {
		email := strings.ToLower(strings.TrimSpace(*input.Email))
		if email == "" {
			return nil, domain.ErrValidation
		}
		if email != user.Email {
			if existing, err := uc.users.GetByEmail(email); err == nil && existing.ID != id {
				return nil, domain.ErrConflict
			} else if err != nil && !errors.Is(err, domain.ErrNotFound) {
				return nil, err
			}
			user.Email = email
		}
	}
	if input.Role != nil {
		role := strings.ToLower(strings.TrimSpace(*input.Role))
		if role != "admin" && role != "staff" {
			return nil, domain.ErrValidation
		}
		user.Role = role
	}
	if input.Password != nil && *input.Password != "" {
		if len(*input.Password) < 8 {
			return nil, domain.ErrValidation
		}
		hash, err := password.Hash(*input.Password)
		if err != nil {
			return nil, err
		}
		user.PasswordHash = hash
	}
	if input.IsActive != nil {
		if id == actorID && !*input.IsActive {
			return nil, domain.ErrForbidden
		}
		user.IsActive = *input.IsActive
	}

	if err := uc.users.Update(user); err != nil {
		return nil, err
	}
	return profileOf(user), nil
}
