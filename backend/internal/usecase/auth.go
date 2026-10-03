package usecase

import (
	"errors"
	"strings"
	"time"

	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/pkg/password"
	"snswindowtinting/backend/internal/pkg/token"
	"snswindowtinting/backend/internal/repository"
)

type AuthUseCase struct {
	users    repository.UserRepository
	refresh  repository.RefreshTokenRepository
	tokens   *token.Manager
}

func NewAuthUseCase(users repository.UserRepository, refresh repository.RefreshTokenRepository, tokens *token.Manager) *AuthUseCase {
	return &AuthUseCase{users: users, refresh: refresh, tokens: tokens}
}

func (uc *AuthUseCase) Login(email, plainPassword string) (*domain.AuthResult, *domain.UserProfile, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	user, err := uc.users.GetByEmail(email)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			return nil, nil, domain.ErrInvalidCredentials
		}
		return nil, nil, err
	}

	if !password.Compare(user.PasswordHash, plainPassword) {
		return nil, nil, domain.ErrInvalidCredentials
	}
	if !user.IsActive {
		return nil, nil, domain.ErrAccountInactive
	}

	auth, err := uc.issue(user)
	if err != nil {
		return nil, nil, err
	}

	return auth, profileOf(user), nil
}

func (uc *AuthUseCase) Refresh(refreshToken string) (*domain.AuthResult, error) {
	if refreshToken == "" {
		return nil, domain.ErrInvalidRefresh
	}

	stored, err := uc.refresh.GetByHash(token.Hash(refreshToken))
	if err != nil {
		return nil, domain.ErrInvalidRefresh
	}
	if stored.RevokedAt != nil || stored.ExpiresAt.Before(time.Now().UTC()) {
		return nil, domain.ErrInvalidRefresh
	}

	_ = uc.refresh.RevokeByHash(stored.TokenHash)

	user, err := uc.users.GetByID(stored.UserID)
	if err != nil {
		return nil, domain.ErrInvalidRefresh
	}
	if !user.IsActive {
		return nil, domain.ErrAccountInactive
	}

	return uc.issue(user)
}

func (uc *AuthUseCase) Logout(refreshToken string) {
	if refreshToken == "" {
		return
	}
	_ = uc.refresh.RevokeByHash(token.Hash(refreshToken))
}

func (uc *AuthUseCase) Me(userID string) (*domain.UserProfile, error) {
	user, err := uc.users.GetByID(userID)
	if err != nil {
		return nil, err
	}
	return profileOf(user), nil
}

func (uc *AuthUseCase) ParseAccess(accessToken string) (*token.Claims, error) {
	return uc.tokens.ParseAccess(accessToken)
}

func (uc *AuthUseCase) AccessTTL() time.Duration  { return uc.tokens.AccessTTL() }
func (uc *AuthUseCase) RefreshTTL() time.Duration { return uc.tokens.RefreshTTL() }

func (uc *AuthUseCase) issue(user *domain.User) (*domain.AuthResult, error) {
	access, expiresAt, err := uc.tokens.IssueAccess(user.ID, user.Email, user.Role, user.Name)
	if err != nil {
		return nil, err
	}
	refreshPlain, err := uc.tokens.NewRefreshToken()
	if err != nil {
		return nil, err
	}
	if err := uc.refresh.Save(&domain.RefreshToken{
		UserID:    user.ID,
		TokenHash: token.Hash(refreshPlain),
		ExpiresAt: time.Now().UTC().Add(uc.tokens.RefreshTTL()),
	}); err != nil {
		return nil, err
	}

	return &domain.AuthResult{
		AccessToken:  access,
		RefreshToken: refreshPlain,
		ExpiresAt:    expiresAt,
	}, nil
}

func profileOf(user *domain.User) *domain.UserProfile {
	return &domain.UserProfile{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		Role:      user.Role,
		IsActive:  user.IsActive,
		CreatedAt: user.CreatedAt,
	}
}
