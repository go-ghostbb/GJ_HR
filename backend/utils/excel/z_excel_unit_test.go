package excel_test

import (
	_ "hrms/backend/packed"

	gbtest "ghostbb.io/gb/test/gb_test"
	"hrms/backend/utils/excel"
	"testing"
)

func TestCheckIn(t *testing.T) {
	gbtest.C(t, func(t *gbtest.T) {
		f, err := excel.NewCheckInTmp("zh_TW")
		t.AssertNil(err)
		t.AssertNil(f.Close())
	})
}
