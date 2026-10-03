package usecase

import (
	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/repository"
)

type SiteConfigUseCase struct {
	repo repository.SiteConfigRepository
}

func NewSiteConfigUseCase(repo repository.SiteConfigRepository) *SiteConfigUseCase {
	return &SiteConfigUseCase{repo: repo}
}

func (uc *SiteConfigUseCase) Get() (*domain.SiteConfig, error) {
	return uc.repo.Get()
}

func (uc *SiteConfigUseCase) Update(update domain.SiteConfigUpdate) (*domain.SiteConfig, error) {
	return uc.repo.Update(update)
}
