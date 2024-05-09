package excel

import (
	"bytes"
	"fmt"
	gbres "ghostbb.io/gb/os/gb_res"
	gbstr "ghostbb.io/gb/text/gb_str"
	"github.com/xuri/excelize/v2"
)

func NewCheckInTmp(locale string) (*checkInTmp, error) {
	content := gbres.GetContent(fmt.Sprintf("resource/template/%s/checkIn.xlsx", gbstr.ToLower(locale)))

	excel, err := excelize.OpenReader(bytes.NewReader(content))
	if err != nil {
		return nil, err
	}

	return &checkInTmp{excel}, nil
}

type checkInTmp struct {
	*excelize.File
}

type CheckInData struct {
	Code                    string  `json:"code"`
	RealName                string  `json:"realName"`
	DepartmentCode          string  `json:"departmentCode"`
	DepartmentName          string  `json:"departmentName"`
	Date                    string  `json:"date"`
	WorkShiftCode           string  `json:"workShiftCode"`
	Time                    string  `json:"time"`
	CardNum                 string  `json:"cardNum"`
	WorkCheckIn             string  `json:"workCheckIn"`
	WorkAttendStatus        string  `json:"workAttendStatus"`
	WorkAttendProcStatus    string  `json:"workAttendProcStatus"`
	OffWorkCheckIn          string  `json:"offWorkCheckIn"`
	OffWorkAttendStatus     string  `json:"offWorkAttendStatus"`
	OffWorkAttendProcStatus string  `json:"offWorkAttendProcStatus"`
	AbsenceHours            float32 `json:"absenceHours"`
	LeaveHours              float32 `json:"leaveHours"`
	SignLeaveHours          float32 `json:"signLeaveHours"`
	OvertimeHours           float32 `json:"overtimeHours"`
	SignOvertimeHours       float32 `json:"signOvertimeHours"`
}

func (c *checkInTmp) Write(data []*CheckInData) error {
	for i, d := range data {
		for j, value := range d.convertInterfaces() {
			cell, err := excelize.CoordinatesToCellName(j+1, i+3)
			if err != nil {
				return err
			}

			if err = c.SetCellValue("data", cell, value); err != nil {
				return err
			}
		}
	}

	return nil
}

func (c *CheckInData) convertInterfaces() []interface{} {
	return []interface{}{
		c.Code,
		c.RealName,
		c.DepartmentCode,
		c.DepartmentName,
		c.Date,
		c.WorkShiftCode,
		c.Time,
		c.CardNum,
		c.WorkCheckIn,
		c.WorkAttendStatus,
		c.WorkAttendProcStatus,
		c.OffWorkCheckIn,
		c.OffWorkAttendStatus,
		c.OffWorkAttendProcStatus,
		c.AbsenceHours,
		c.LeaveHours,
		c.SignLeaveHours,
		c.OvertimeHours,
		c.SignOvertimeHours,
	}
}
