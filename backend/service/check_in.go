package service

import (
	"context"
	gbjson "ghostbb.io/gb/encoding/gb_json"
	"ghostbb.io/gb/frame/g"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"github.com/xuri/excelize/v2"
	"hrms/backend/global"
	"hrms/backend/types"
	"sync"
)

var checkIn *checkInService
var onceCheckIn sync.Once

func CheckIn() *checkInService {
	if checkIn == nil {
		onceCheckIn.Do(func() {
			checkIn = &checkInService{}
		})
	}
	return checkIn
}

type checkInService struct {
	ctx context.Context
}

func (c *checkInService) Start(ctx context.Context) {
	c.ctx = ctx
}

// UploadData 上傳資料
func (c *checkInService) UploadData() (resp types.JSResp) {
	// 選擇文件
	path, err := runtime.OpenFileDialog(c.ctx, runtime.OpenDialogOptions{
		Title: "選擇文件",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Excel文件 (*.xlsx)|*.xlsx",
				Pattern:     "*.xlsx",
			},
		},
	})
	if err != nil {
		resp.Success = false
		resp.Msg = err.Error()
		return
	}
	if path == "" {
		resp.Success = false
		resp.Msg = "close"
		return
	}

	// 打開excel
	excelFile, err := excelize.OpenFile(path)
	if err != nil {
		g.Log().Error(c.ctx, "open excel err:", err)
		resp.Success = false
		resp.Msg = err.Error()
		return
	}
	defer func() {
		excelFile.Close()
	}()

	// to json
	const (
		cardNum       = 0
		dateTime      = 1
		workShiftCode = 2
		checkInType   = 3
	)

	var (
		data = make([]g.Map, 0)
	)

	// 獲取data上所有儲存格
	rows, err := excelFile.GetRows("data")
	if err != nil {
		g.Log().Error(c.ctx, "get rows err:", err)
		resp.Success = false
		resp.Msg = err.Error()
		return
	}
	rows = rows[1:] // 第一列為header, 直接丟棄

	// 遍歷
	for _, row := range rows {
		data = append(data, g.Map{
			"cardNumber":    row[cardNum],
			"dateTime":      row[dateTime],
			"workShiftCode": row[workShiftCode],
			"checkInType":   row[checkInType],
		})
	}

	jsonStr, _ := gbjson.EncodeString(data)
	result, err := g.Client().Header(g.MapStrStr{"Authorization": "Bearer " + global.Token}).Post(c.ctx, global.APIUrl+"/api/v1/checkInStatus/upload", jsonStr)
	if err != nil {
		g.Log().Error(c.ctx, "post data err:", err)
		resp.Success = false
		resp.Msg = err.Error()
		return
	}
	if value := result.Header.Get("x-token"); value != "" {
		global.Token = value
		// 呼叫setToken事件
		// 告訴前端需換token
		runtime.EventsEmit(c.ctx, "setToken", value)
	}

	resultJSON, err := gbjson.DecodeToJson(result.ReadAllString())
	if err != nil {
		g.Log().Error(c.ctx, "decode json err:", err)
		resp.Success = false
		resp.Msg = err.Error()
		return
	}

	// 只要狀態碼不為0, 代表錯誤
	if resultJSON.Get("code").String() != "0" {
		resp.Success = false
		resp.Msg = resultJSON.Get("msg").String()
		return
	}

	resp.Success = true
	return resp
}
