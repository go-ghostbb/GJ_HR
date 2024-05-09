package types

type JSResp struct {
	Success bool   `json:"success"`
	Msg     string `json:"msg"`
	Data    any    `json:"data,omitempty"`
}

func (j *JSResp) Ok() JSResp {
	j.Success = true
	return *j
}

func (j *JSResp) OkWithData(data any) JSResp {
	j.Success = true
	j.Data = data
	return *j
}

func (j *JSResp) Fail(msg string) JSResp {
	j.Success = false
	j.Msg = msg
	return *j
}
