package usecase

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"

	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/repository"
)

const MaxGalleryImageBytes = 3 << 20 // 3 MiB
const maxGalleryImageBytes = MaxGalleryImageBytes

var allowedImageExt = map[string]string{
	"image/jpeg": ".jpg",
	"image/png":  ".png",
	"image/webp": ".webp",
	"image/gif":  ".gif",
}

type GalleryUseCase struct {
	gallery       repository.GalleryRepository
	uploadDir     string
	publicBaseURL string
}

func NewGalleryUseCase(gallery repository.GalleryRepository, uploadDir, publicBaseURL string) *GalleryUseCase {
	return &GalleryUseCase{
		gallery:       gallery,
		uploadDir:     uploadDir,
		publicBaseURL: strings.TrimRight(publicBaseURL, "/"),
	}
}

func (uc *GalleryUseCase) ListPublic() ([]domain.GalleryImage, error) {
	items, err := uc.gallery.List(true)
	if err != nil {
		return nil, err
	}
	return uc.withAbsoluteURLs(items), nil
}

func (uc *GalleryUseCase) ListAdmin() ([]domain.GalleryImage, error) {
	items, err := uc.gallery.List(false)
	if err != nil {
		return nil, err
	}
	return uc.withAbsoluteURLs(items), nil
}

func (uc *GalleryUseCase) Upload(filename string, data []byte, alt string) (*domain.GalleryImage, error) {
	if len(data) == 0 {
		return nil, domain.ErrValidation
	}
	if len(data) > maxGalleryImageBytes {
		return nil, fmt.Errorf("%w: image must be 3MB or smaller", domain.ErrValidation)
	}

	contentType := http.DetectContentType(data)
	ext, ok := allowedImageExt[contentType]
	if !ok {
		ext = extFromFilename(filename)
		if ext == "" {
			return nil, fmt.Errorf("%w: only JPEG, PNG, WebP, or GIF images are allowed", domain.ErrValidation)
		}
	}

	dir := filepath.Join(uc.uploadDir, "gallery")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return nil, err
	}
	name := uuid.NewString() + ext
	destPath := filepath.Join(dir, name)
	if err := os.WriteFile(destPath, data, 0o644); err != nil {
		return nil, err
	}

	sortOrder, err := uc.gallery.NextSortOrder()
	if err != nil {
		_ = os.Remove(destPath)
		return nil, err
	}

	image := &domain.GalleryImage{
		ID:        "gal_" + uuid.NewString(),
		URL:       "/uploads/gallery/" + name,
		Alt:       strings.TrimSpace(alt),
		SortOrder: sortOrder,
		IsVisible: true,
		CreatedAt: time.Now().UTC(),
	}
	if image.Alt == "" {
		image.Alt = "S&S Window Tinting project"
	}
	if err := uc.gallery.Create(image); err != nil {
		_ = os.Remove(destPath)
		return nil, err
	}
	return uc.withAbsoluteURL(image), nil
}

func (uc *GalleryUseCase) Update(id string, input domain.UpdateGalleryImageInput) (*domain.GalleryImage, error) {
	image, err := uc.gallery.GetByID(id)
	if err != nil {
		return nil, err
	}
	if input.Alt != nil {
		image.Alt = strings.TrimSpace(*input.Alt)
	}
	if input.SortOrder != nil {
		image.SortOrder = *input.SortOrder
	}
	if input.IsVisible != nil {
		image.IsVisible = *input.IsVisible
	}
	if err := uc.gallery.Update(image); err != nil {
		return nil, err
	}
	return uc.withAbsoluteURL(image), nil
}

func (uc *GalleryUseCase) Reorder(orderedIDs []string) error {
	if len(orderedIDs) == 0 {
		return domain.ErrValidation
	}
	return uc.gallery.Reorder(orderedIDs)
}

func (uc *GalleryUseCase) Delete(id string) error {
	image, err := uc.gallery.GetByID(id)
	if err != nil {
		return err
	}
	filePath := uc.resolveUploadFile(image.URL)
	if err := uc.gallery.Delete(id); err != nil {
		return err
	}
	if filePath != "" {
		if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
			return fmt.Errorf("image removed from gallery but file cleanup failed: %w", err)
		}
	}
	return nil
}

func (uc *GalleryUseCase) resolveUploadFile(url string) string {
	rel := localUploadPath(url)
	if rel == "" {
		return ""
	}
	root, err := filepath.Abs(uc.uploadDir)
	if err != nil {
		root = uc.uploadDir
	}
	full := filepath.Join(root, filepath.FromSlash(rel))
	fullAbs, err := filepath.Abs(full)
	if err != nil {
		return ""
	}
	relToRoot, err := filepath.Rel(root, fullAbs)
	if err != nil || strings.HasPrefix(relToRoot, "..") {
		return ""
	}
	return fullAbs
}

func (uc *GalleryUseCase) withAbsoluteURLs(items []domain.GalleryImage) []domain.GalleryImage {
	out := make([]domain.GalleryImage, len(items))
	for i := range items {
		out[i] = *uc.withAbsoluteURL(&items[i])
	}
	return out
}

func (uc *GalleryUseCase) withAbsoluteURL(image *domain.GalleryImage) *domain.GalleryImage {
	cp := *image
	if strings.HasPrefix(cp.URL, "/") && uc.publicBaseURL != "" {
		cp.URL = uc.publicBaseURL + cp.URL
	}
	return &cp
}

func extFromFilename(name string) string {
	switch strings.ToLower(filepath.Ext(name)) {
	case ".jpg", ".jpeg":
		return ".jpg"
	case ".png":
		return ".png"
	case ".webp":
		return ".webp"
	case ".gif":
		return ".gif"
	default:
		return ""
	}
}

func localUploadPath(url string) string {
	path := url
	if i := strings.Index(path, "/uploads/"); i >= 0 {
		path = path[i:]
	}
	if !strings.HasPrefix(path, "/uploads/") {
		return ""
	}
	rel := strings.TrimPrefix(path, "/uploads/")
	if rel == "" || strings.Contains(rel, "..") {
		return ""
	}
	return rel
}

// ReadUploadFile is a small helper for handlers that still need the byte limit.
func ReadUploadFile(r io.Reader) ([]byte, error) {
	data, err := io.ReadAll(io.LimitReader(r, maxGalleryImageBytes+1))
	if err != nil {
		return nil, err
	}
	if len(data) > maxGalleryImageBytes {
		return nil, fmt.Errorf("%w: image must be 3MB or smaller", domain.ErrValidation)
	}
	return data, nil
}
