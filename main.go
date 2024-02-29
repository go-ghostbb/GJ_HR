package main

import (
	"embed"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title: "hr",
		//Width:            1024,
		//Height:           768,
		WindowStartState: options.Maximised, // 最大化視窗
		DisableResize:    false,             // 固定大小
		Frameless:        true,              // 無邊框
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Windows: &windows.Options{
			DisableWindowIcon: true, // 禁用左上角圖標
		},
		Mac: &mac.Options{
			TitleBar: mac.TitleBarHidden(),
		},
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
