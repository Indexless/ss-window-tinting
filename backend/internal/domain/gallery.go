package domain

import "time"

type GalleryImage struct {
	ID        string    `json:"id"`
	URL       string    `json:"url"`
	Alt       string    `json:"alt"`
	SortOrder int       `json:"sortOrder"`
	IsVisible bool      `json:"isVisible"`
	CreatedAt time.Time `json:"createdAt"`
}

type UpdateGalleryImageInput struct {
	Alt       *string `json:"alt"`
	SortOrder *int    `json:"sortOrder"`
	IsVisible *bool   `json:"isVisible"`
}

type ReorderGalleryInput struct {
	OrderedIDs []string `json:"orderedIds"`
}
