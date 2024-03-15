package service_test

import (
	"changeme/backend/service"
	"context"
	gbjson "ghostbb.io/gb/encoding/gb_json"
	gbtest "ghostbb.io/gb/test/gb_test"
	"testing"
)

func TestSystemLatest(t *testing.T) {
	gbtest.C(t, func(t *gbtest.T) {
		wailsPath := gbtest.DataPath("wails.json")
		wailsJSON, err := gbjson.Load(wailsPath)
		t.AssertNil(err)

		sysSvc := service.System()
		sysSvc.Start(context.Background(), wailsJSON.Get("info.productVersion").String())

		sysSvc.Latest()
	})
}

func TestSystemInfo(t *testing.T) {
	gbtest.C(t, func(t *gbtest.T) {
		wailsPath := gbtest.DataPath("wails.json")
		wailsJSON, err := gbjson.Load(wailsPath)
		t.AssertNil(err)

		sysSvc := service.System()
		sysSvc.Start(context.Background(), wailsJSON.Get("info.productVersion").String())

		version := sysSvc.Info().Data.(struct {
			OS      string `json:"os"`
			Arch    string `json:"arch"`
			Version string `json:"version"`
		}).Version

		t.Assert(version, "v0.0.1")
	})
}
