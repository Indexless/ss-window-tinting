package usecase

import (
	"fmt"
	"strings"

	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/repository"
)

type PortalUseCase struct {
	users   repository.UserRepository
	refresh repository.RefreshTokenRepository
	config  repository.SiteConfigRepository
}

func NewPortalUseCase(
	users repository.UserRepository,
	refresh repository.RefreshTokenRepository,
	config repository.SiteConfigRepository,
) *PortalUseCase {
	return &PortalUseCase{users: users, refresh: refresh, config: config}
}

func (uc *PortalUseCase) Dashboard() (*domain.DashboardStats, error) {
	total, active, err := uc.users.Count()
	if err != nil {
		return nil, err
	}
	sessions, err := uc.refresh.CountActive()
	if err != nil {
		return nil, err
	}
	cfg, err := uc.config.Get()
	if err != nil {
		return nil, err
	}

	return &domain.DashboardStats{
		UserCount:          total,
		ActiveUserCount:    active,
		ActiveSessionCount: sessions,
		ConfigUpdatedAt:    cfg.UpdatedAt,
		WhatsappConfigured: strings.TrimSpace(cfg.WhatsappNumber) != "",
		ContactConfigured: strings.TrimSpace(cfg.Phone) != "" || strings.TrimSpace(cfg.Email) != "",
	}, nil
}

func (uc *PortalUseCase) PurgeSessions() (*domain.HousekeepingReport, error) {
	n, err := uc.refresh.PurgeExpired()
	if err != nil {
		return nil, err
	}
	return &domain.HousekeepingReport{
		ExpiredTokensPurged: int(n),
		Message:             fmt.Sprintf("Removed %d expired or revoked sessions.", n),
	}, nil
}
