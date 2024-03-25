package main

import (
	"context"
	"embed"
	gbjson "ghostbb.io/gb/encoding/gb_json"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"hrms/backend/service"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed wails.json
var wailsStr string

func main() {
	// wails info
	wailsJSON, err := gbjson.LoadContent(wailsStr)
	if err != nil {
		panic(err)
	}

	// Create an instance of the app structure
	sysSvc := service.System()
	updateSvc := service.Update()
	checkInSvc := service.CheckIn()

	// Create application with options
	err = wails.Run(&options.App{
		Title: "hr",
		//Width:            1024,
		//Height:           768,
		WindowStartState: options.Maximised, // 最大化視窗
		DisableResize:    false,             // 固定大小
		Frameless:        true,              // 無邊框
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		Windows: &windows.Options{
			DisableWindowIcon: true, // 禁用左上角圖標
		},
		Mac: &mac.Options{
			TitleBar: mac.TitleBarHidden(),
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: func(ctx context.Context) {
			// app打開時初始化以下service
			sysSvc.Start(ctx, wailsJSON.Get("info.productVersion").String())
			updateSvc.Start(ctx)
			checkInSvc.Start(ctx)
		},
		Bind: []interface{}{
			// 解析service方法
			sysSvc,
			updateSvc,
			checkInSvc,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
