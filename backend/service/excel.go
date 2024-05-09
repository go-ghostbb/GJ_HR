package service

import (
	"context"
	"ghostbb.io/gb/frame/g"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"hrms/backend/types"
	excelTmp "hrms/backend/utils/excel"
	"path/filepath"
	"sync"
)

var excel *excelService
var onceExcel sync.Once

func Excel() *excelService {
	if excel == nil {
		onceExcel.Do(func() {
			excel = &excelService{}
		})
	}
	return excel
}

type excelService struct {
	ctx context.Context
}

func (e *excelService) Start(ctx context.Context) {
	e.ctx = ctx
}

// CheckInExcel 出勤狀態excel模板
func (e *excelService) CheckInExcel(filename string, data []*excelTmp.CheckInData, locale string) (resp types.JSResp) {
	// save as
	path, err := runtime.OpenDirectoryDialog(e.ctx, runtime.OpenDialogOptions{
		Title: "選擇資料夾",
	})
	if err != nil {
		return resp.Fail(err.Error())
	}
	if path == "" {
		return resp.Fail("close")
	}

	// excel proc
	f, err := excelTmp.NewCheckInTmp(locale)
	if err != nil {
		g.Log().Errorf(e.ctx, "create checkin excel tmp fail: %v", err)
		return resp.Fail(err.Error())
	}
	defer f.Close()

	if err = f.Write(data); err != nil {
		g.Log().Errorf(e.ctx, "write data fail: %v", err)
		return resp.Fail(err.Error())
	}

	if err = f.SaveAs(filepath.Join(path, filename)); err != nil {
		g.Log().Errorf(e.ctx, "save excel fail: %v", err)
		return resp.Fail(err.Error())
	}

	return resp.Ok()
}
