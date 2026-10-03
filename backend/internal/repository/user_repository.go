package repository

import "snswindowtinting/backend/internal/domain"

type UserRepository interface {
	GetByEmail(email string) (*domain.User, error)
	GetByID(id string) (*domain.User, error)
	List() ([]domain.User, error)
	Create(user *domain.User) error
	Update(user *domain.User) error
	SetActive(id string, active bool) error
	Count() (total int, active int, err error)
}

type RefreshTokenRepository interface {
	Save(token *domain.RefreshToken) error
	GetByHash(hash string) (*domain.RefreshToken, error)
	RevokeByHash(hash string) error
	CountActive() (int, error)
	PurgeExpired() (int64, error)
}

type SiteConfigRepository interface {
	Get() (*domain.SiteConfig, error)
	Update(update domain.SiteConfigUpdate) (*domain.SiteConfig, error)
}

type LeadRepository interface {
	List() ([]domain.Lead, error)
	GetByID(id string) (*domain.Lead, error)
	Create(lead *domain.Lead) error
	Update(lead *domain.Lead) error
}

type GalleryRepository interface {
	List(visibleOnly bool) ([]domain.GalleryImage, error)
	GetByID(id string) (*domain.GalleryImage, error)
	Create(image *domain.GalleryImage) error
	Update(image *domain.GalleryImage) error
	Delete(id string) error
	NextSortOrder() (int, error)
	Reorder(orderedIDs []string) error
}
