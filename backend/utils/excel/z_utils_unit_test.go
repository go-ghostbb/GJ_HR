package excel_test

import (
	gbtest "ghostbb.io/gb/test/gb_test"
	"hrms/backend/utils/excel"
	"testing"
)

func TestConvertNumToChar(t *testing.T) {
	gbtest.C(t, func(t *gbtest.T) {
		t.Assert(excel.ConvertNumToChar(7), "G")
		t.Assert(excel.ConvertNumToChar(27), "AA")
		t.Assert(excel.ConvertNumToChar(278), "JR")
	})
}
