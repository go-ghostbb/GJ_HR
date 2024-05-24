package global

import "ghostbb.io/gb/frame/g"

var (
	APIUrl string
	Token  string
)

var (
	ApiURLMap = g.MapStrStr{
		"development": "http://localhost:9000",
		"it_dev":      "http://192.168.1.206:9000",
	}
)
