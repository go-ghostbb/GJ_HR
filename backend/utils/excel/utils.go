package excel

var excelChar = []string{"", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"}

// ConvertNumToChar 將數字轉為Excel列
func ConvertNumToChar(num int) string {
	if num < 27 {
		// 如果小於27，直接回傳
		return excelChar[num]
	}

	// 使用餘數除法，找出對應字母
	k := num % 26
	if k == 0 {
		// 如果能整除代表為Z
		k = 26
	}

	// 遞迴，將剩下數字轉字母
	return ConvertNumToChar((num-k)/26) + excelChar[k]
}
