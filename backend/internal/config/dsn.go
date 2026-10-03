package config

import (
	"net"
	"net/url"
	"strings"

	mysqldriver "github.com/go-sql-driver/mysql"
)

func NormalizeMySQLDSN(raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return raw
	}

	if !strings.HasPrefix(raw, "mysql://") {
		return ensureDSNParams(raw)
	}

	u, err := url.Parse(raw)
	if err != nil {
		return ensureDSNParams(raw)
	}

	user := u.User.Username()
	pass, _ := u.User.Password()
	host := u.Hostname()
	port := u.Port()
	if port == "" {
		port = "3306"
	}

	dbName := strings.TrimPrefix(u.Path, "/")
	if dbName == "" {
		dbName = "ss_window_tinting"
	}

	cfg := mysqldriver.Config{
		User:                 user,
		Passwd:               pass,
		Net:                  "tcp",
		Addr:                 net.JoinHostPort(host, port),
		DBName:               dbName,
		ParseTime:            true,
		AllowNativePasswords: true,
		Params: map[string]string{
			"charset":         "utf8mb4",
			"multiStatements": "true",
		},
	}

	return cfg.FormatDSN()
}

func ensureDSNParams(dsn string) string {
	if !strings.Contains(dsn, "parseTime=") {
		if strings.Contains(dsn, "?") {
			dsn += "&parseTime=true&charset=utf8mb4"
		} else {
			dsn += "?parseTime=true&charset=utf8mb4"
		}
	}
	if !strings.Contains(dsn, "multiStatements=") {
		if strings.Contains(dsn, "?") {
			dsn += "&multiStatements=true"
		} else {
			dsn += "?multiStatements=true"
		}
	}
	return dsn
}
