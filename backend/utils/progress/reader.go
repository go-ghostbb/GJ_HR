package progress

import (
	"io"
)

func NewReader(r io.ReadCloser, max int64, fn func(Info)) *Reader {
	return &Reader{ReadCloser: r, Progress: NewProgress(max, fn)}
}

type Reader struct {
	io.ReadCloser
	*Progress
}

// Read will read the data and add the number of bytes to the progressbar
func (r *Reader) Read(p []byte) (n int, err error) {
	n, err = r.ReadCloser.Read(p)
	r.Progress.Add64(int64(n))
	return
}

// Close the reader when it implements io.Closer
func (r *Reader) Close() (err error) {
	return r.ReadCloser.Close()
}

func (r *Reader) Stop() (state *State, err error) {
	if r.Progress.state.finished {
		return nil, nil
	}
	err = r.ReadCloser.Close()
	return r.Progress.state, err
}
