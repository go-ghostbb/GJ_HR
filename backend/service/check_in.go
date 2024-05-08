package service

import (
	"bufio"
	"context"
	gbjson "ghostbb.io/gb/encoding/gb_json"
	gberror "ghostbb.io/gb/errors/gb_error"
	"ghostbb.io/gb/frame/g"
	gbstr "ghostbb.io/gb/text/gb_str"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"github.com/xuri/excelize/v2"
	"hrms/backend/global"
	"hrms/backend/types"
	"os"
	"path/filepath"
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
		cardNum int = iota
		dateTime
		checkInType
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
			"cardNumber":  row[cardNum],
			"dateTime":    row[dateTime],
			"checkInType": row[checkInType],
		})
	}

	if err = c.postData(data); err != nil {
		g.Log().Error(c.ctx, "post data err:", err)
		resp.Success = false
		resp.Msg = err.Error()
		return
	}

	resp.Success = true
	return resp
}

// UploadTxtData 上傳資料 txt版本
func (c *checkInService) UploadTxtData() (resp types.JSResp) {
	// 選擇文件
	path, err := runtime.OpenFileDialog(c.ctx, runtime.OpenDialogOptions{
		Title: "選擇文件",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Txt文件 (*.txt)|*.txt",
				Pattern:     "*.txt",
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

	// 打開文件
	txtFile, err := os.Open(path)
	if err != nil {
		g.Log().Error(c.ctx, "open txt err:", err)
		resp.Success = false
		resp.Msg = err.Error()
		return
	}
	defer txtFile.Close()

	txtScan := bufio.NewScanner(txtFile)
	txtScan.Split(bufio.ScanLines)

	var (
		data = make([]g.Map, 0)
	)

	const (
		date int = iota
		time
		cardNumber
		checkInType
	)

	// 逐行遍歷
	for txtScan.Scan() {
		sp := gbstr.Split(txtScan.Text(), " ")
		data = append(data, g.Map{
			"cardNumber":  sp[cardNumber],
			"dateTime":    sp[date] + " " + sp[time],
			"checkInType": sp[checkInType],
		})
	}

	if err = c.postData(data); err != nil {
		g.Log().Error(c.ctx, "post data err:", err)
		resp.Success = false
		resp.Msg = err.Error()
		return
	}

	resp.Success = true
	return resp
}

// UploadTxtDataDir 上傳資料 資料夾內所有txt
func (c *checkInService) UploadTxtDataDir() (resp types.JSResp) {
	// 選擇資料夾
	path, err := runtime.OpenDirectoryDialog(c.ctx, runtime.OpenDialogOptions{
		Title: "選擇資料夾",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Txt文件 (*.txt)|*.txt",
				Pattern:     "*.txt",
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

	dir, err := os.ReadDir(path)
	if err != nil {
		g.Log().Error(c.ctx, "open dir err:", err)
		resp.Success = false
		resp.Msg = err.Error()
		return
	}

	for _, file := range dir {
		tmpFile, err := os.Open(filepath.Join(path, file.Name()))
		if err != nil {
			g.Log().Error(c.ctx, "open txt err:", err)
			resp.Success = false
			resp.Msg = err.Error()
			return
		}

		txtScan := bufio.NewScanner(tmpFile)
		txtScan.Split(bufio.ScanLines)

		var (
			data = make([]g.Map, 0)
		)

		const (
			date int = iota
			time
			cardNumber
			checkInType
		)

		// 逐行遍歷
		for txtScan.Scan() {
			sp := gbstr.Split(txtScan.Text(), " ")
			data = append(data, g.Map{
				"cardNumber":  sp[cardNumber],
				"dateTime":    sp[date] + " " + sp[time],
				"checkInType": sp[checkInType],
			})
		}

		if err = c.postData(data); err != nil {
			g.Log().Error(c.ctx, "post data err:", err)
			resp.Success = false
			resp.Msg = err.Error()
			tmpFile.Close()
			return
		}

		tmpFile.Close()
	}

	resp.Success = true
	return resp
}

// post data
func (c *checkInService) postData(data []g.Map) error {
	jsonStr, _ := gbjson.EncodeString(data)
	result, err := g.Client().Header(g.MapStrStr{"Authorization": "Bearer " + global.Token}).Post(c.ctx, global.APIUrl+"/api/v1/checkInStatus/upload", jsonStr)
	if err != nil {
		return err
	}
	if value := result.Header.Get("x-token"); value != "" {
		global.Token = value
		// 呼叫setToken事件
		// 告訴前端需換token
		runtime.EventsEmit(c.ctx, "setToken", value)
	}

	resultJSON, err := gbjson.DecodeToJson(result.ReadAllString())
	if err != nil {
		return err
	}

	// 只要狀態碼不為0, 代表錯誤
	if resultJSON.Get("code").String() != "0" {
		return gberror.New(resultJSON.Get("msg").String())
	}

	return nil
}
