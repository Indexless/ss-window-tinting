package domain

import "errors"

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrAccountInactive    = errors.New("account inactive")
	ErrNotFound           = errors.New("not found")
	ErrInvalidRefresh     = errors.New("invalid refresh token")
	ErrUnauthorized       = errors.New("unauthorized")
	ErrConflict           = errors.New("conflict")
	ErrValidation         = errors.New("validation failed")
	ErrForbidden          = errors.New("forbidden")
)
