package service

import (
	"context"
	gbvar "ghostbb.io/gb/container/gb_var"
	"ghostbb.io/gb/frame/g"
	gbctx "ghostbb.io/gb/os/gb_ctx"
	gbstr "ghostbb.io/gb/text/gb_str"
	"hrms/backend/types"
	"runtime"
	"sync"
)

var system *systemService
var onceSystem sync.Once
var githubURL = "https://api.github.com/repos/GIAJIU/HR/releases/latest"
var githubToken = "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"

func System() *systemService {
	if system == nil {
		onceSystem.Do(func() {
			system = &systemService{
				appVersion: "v0.0.0",
			}
		})
	}
	return system
}

type systemService struct {
	ctx        context.Context
	appVersion string
}

func (s *systemService) Start(ctx context.Context, version string) {
	if !gbstr.HasPrefix(version, "v") {
		version = "v" + version
	}
	s.ctx = gbctx.WithCtx(ctx)
	s.appVersion = version
}

// Info app資訊
func (s *systemService) Info() (resp types.JSResp) {
	resp.Success = true
	resp.Data = struct {
		OS      string `json:"os"`
		Arch    string `json:"arch"`
		Version string `json:"version"`
	}{
		OS:      runtime.GOOS,
		Arch:    runtime.GOARCH,
		Version: s.appVersion,
	}
	return
}

// Latest 獲取最新版本資訊
func (s *systemService) Latest() (resp types.JSResp) {
	headerMap := g.MapStrStr{"Authorization": "Bearer " + githubToken}
	githubRes, err := g.Client().Header(headerMap).Get(s.ctx, githubURL)
	if err != nil {
		resp.Success = false
		resp.Msg = err.Error()
		return resp
	}
	defer func() {
		if githubRes != nil && githubRes.Body != nil {
			githubRes.Body.Close()
		}
	}()

	// 解析
	var repository types.Repository
	if err = gbvar.New(githubRes.ReadAll()).Scan(&repository); err != nil {
		resp.Success = false
		resp.Msg = err.Error()
		return resp
	}

	resp.Success = true
	resp.Data = repository
	return
}
