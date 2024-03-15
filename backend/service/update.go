package service

import (
	"bytes"
	"context"
	"fmt"
	gberror "ghostbb.io/gb/errors/gb_error"
	"ghostbb.io/gb/frame/g"
	gbctx "ghostbb.io/gb/os/gb_ctx"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"hrms/backend/types"
	selfupdate "hrms/backend/utils/go-update"
	"hrms/backend/utils/progress"
	"io"
	"net"
	"sync"
)

var update *updateService
var onceUpdate sync.Once
var updateEventName = "updateProgress"

func Update() *updateService {
	if update == nil {
		onceUpdate.Do(func() {
			update = &updateService{}
		})
	}
	return update
}

type updateService struct {
	ctx    context.Context
	bytes  []byte
	reader *progress.Reader
	url    string
	size   int64
	state  *progress.State
	pause  bool
}

func (u *updateService) Start(ctx context.Context) {
	u.ctx = gbctx.WithCtx(ctx)
}

// DoUpdate 開始更新
func (u *updateService) DoUpdate() (resp types.JSResp) {
	var (
		softwareName = "HRMS.exe"
		err          error
	)

	if !u.pause {
		// 如果不是暫停狀態下
		// 獲取文件資訊(url & size)
		for _, asset := range system.Latest().Data.(types.Repository).Assets {
			if asset.Name == softwareName {
				u.url = asset.Url
				u.size = int64(asset.Size)
				break
			}
		}

		// 初始化更新資訊
		u.bytes = make([]byte, 0)
		u.pause = false
		u.state = nil
	}

	if u.url == "" {
		resp.Success = false
		resp.Msg = "not found"
		return
	}

	// fetch
	headerMap := g.MapStrStr{
		"Authorization": "Bearer " + githubToken,
		"Accept":        "application/octet-stream",
		"Range":         fmt.Sprintf("bytes=%d-", len(u.bytes)), // 支持斷點下載
	}
	githubRes, err := g.Client().Header(headerMap).Get(u.ctx, u.url)
	if err != nil {
		resp.Success = false
		resp.Msg = err.Error()
		return
	}
	defer func() {
		if githubRes != nil && githubRes.Body != nil {
			githubRes.Body.Close()
		}
	}()

	// 建立progress，監控下載資訊
	u.reader = progress.NewReader(githubRes.Body, u.size, func(info progress.Info) {
		// 這裡會回傳每次下載資訊
		// 回傳事件, 前端應有對應事件開啟
		runtime.EventsEmit(u.ctx, updateEventName, info)
	})

	if u.pause {
		// 如果是暫停狀態下
		// 繼續下載
		u.reader.SetState(u.state) // 上次更新的狀態
		u.pause = false            // 取消暫停
	}

	// download
	newBytes, err := io.ReadAll(u.reader)
	u.bytes = append(u.bytes, newBytes...)
	if err != nil {
		// http2: response body closed
		if gberror.Is(err, net.ErrClosed) {
			resp.Success = true
			resp.Msg = "update stop"
			return
		}
		resp.Success = false
		resp.Msg = "update error:" + err.Error()
		return
	}

	// update
	if int64(len(u.bytes)) == u.size {
		if err = selfupdate.Apply(bytes.NewReader(u.bytes), selfupdate.Options{TargetPath: softwareName}); err != nil {
			resp.Success = false
			resp.Msg = "update error:" + err.Error()
			return
		}
	} else {
		resp.Success = false
		resp.Msg = "file damage"
		return
	}

	// 成功
	resp.Success = true
	return
}

// Stop 停止更新
func (u *updateService) Stop() {
	u.reader.Stop()
	u.pause = false
}

// Pause 暫停更新
func (u *updateService) Pause() {
	state, _ := u.reader.Stop()
	// 保存狀態
	if state != nil {
		u.state = state
		u.pause = true
	}
}
