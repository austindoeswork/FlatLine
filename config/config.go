package config

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"os/user"
	"path"
)

// Config stores server configuration
type Config struct {
	ServerAddress string // ServerAddress is ths address that this server starts up as.
	StaticDir     string // StaticDir is the address of the static directory"
}

var (
	// places to look (in order) for the config file
	configPaths = []string{
		"./config.json",
		path.Join(homeDir(), ".config/flatline/config.json"),
		"/etc/flatline/config.json",
	}
)

// homeDir gets the user's home directory
func homeDir() string {
	u, err := user.Current()
	if err != nil {
		return ""
	}
	return u.HomeDir
}

// getConfig returns a config file if found, otherwise an error
func Find() (*Config, error) {
	log.Println("Looking for config:")
	for _, p := range configPaths {
		configPath := path.Clean(p)
		log.Printf("checking: %s\n", configPath)
		b, err := ioutil.ReadFile(configPath)
		if err != nil {
			continue
		}
		c := &Config{}
		if err := json.Unmarshal(b, c); err != nil {
			continue
		}
		log.Printf("found: \n%s\n", c.String())
		return c, nil
	}
	return nil, errors.New("failed to find config")
}

// Example returns an example config
func Example() string {
	c := &Config{
		ServerAddress: "localhost:8100",
		StaticDir:     "./client",
	}
	return c.String()
}

func (c *Config) String() string {
	b, _ := json.MarshalIndent(&c, "", "  ")
	return string(b)
}
