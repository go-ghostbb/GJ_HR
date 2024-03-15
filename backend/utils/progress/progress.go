package progress

import (
	"sync"
	"time"
)

func NewProgress(max int64, fn func(Info)) *Progress {
	now := time.Now()
	channel := make(chan Info)

	go func() {
		for c := range channel {
			if fn != nil {
				fn(c)
			}
		}
	}()

	return &Progress{
		max:      max,
		InfoChan: channel,
		state: &State{
			counterTime: now,
		}}
}

type Progress struct {
	state    *State
	max      int64
	lock     sync.Mutex
	InfoChan chan Info
}

type State struct {
	currentPercent      int
	lastPercent         int
	counterTime         time.Time
	counterNumSinceLast int64
	counterLastTenRates []float64
	currentBytes        float64
	finished            bool
	speed               HumanizeBytes
}

type Info struct {
	Percentage int           `json:"percentage"`
	Now        HumanizeBytes `json:"now"`
	Max        HumanizeBytes `json:"max"`
	Speed      HumanizeBytes `json:"speed"`
}

type HumanizeBytes struct {
	Size   string `json:"size"`
	Suffix string `json:"suffix"`
}

func (p *Progress) SetState(state *State) {
	p.state = state
}

func (p *Progress) finish() {
	p.lock.Lock()
	p.state.currentBytes = float64(p.max)
	p.lock.Unlock()
	p.Add64(0)
}

func (p *Progress) Add64(num int64) error {
	p.lock.Lock()
	defer p.lock.Unlock()

	// 如果完成不再繼續
	if p.state.finished {
		return nil
	}

	p.state.currentBytes += float64(num)
	p.state.counterNumSinceLast += num
	percent := p.state.currentBytes / float64(p.max)
	p.state.currentPercent = int(percent * 100)

	sizeNow, suffixNow := humanizeBytes(p.state.currentBytes)
	sizeMax, suffixMax := humanizeBytes(float64(p.max))
	if p.state.currentBytes >= float64(p.max) {
		// 將完成資訊塞入通道
		p.InfoChan <- Info{
			Percentage: 100,
			Now:        HumanizeBytes{Size: sizeNow, Suffix: suffixNow},
			Max:        HumanizeBytes{Size: sizeMax, Suffix: suffixMax},
			Speed:      p.state.speed,
		}
		// 告知完成
		p.state.finished = true
		// 關閉通道
		close(p.InfoChan)
		return nil
	}

	if time.Since(p.state.counterTime).Seconds() > 0.5 {
		// 記錄每秒下載速度
		p.state.counterLastTenRates = append(p.state.counterLastTenRates, float64(p.state.counterNumSinceLast)/time.Since(p.state.counterTime).Seconds())
		// 只記錄十筆，超過將最前面刪除
		if len(p.state.counterLastTenRates) > 10 {
			p.state.counterLastTenRates = p.state.counterLastTenRates[1:]
		}
		// 重製時間
		p.state.counterTime = time.Now()
		// 重製區間計算
		p.state.counterNumSinceLast = 0

		p.state.speed.Size, p.state.speed.Suffix = humanizeBytes(average(p.state.counterLastTenRates))

		if p.state.currentBytes >= float64(p.max) {
			p.state.finished = true
			close(p.InfoChan)
		}
	}

	// 塞入通道
	p.InfoChan <- Info{
		Percentage: p.state.currentPercent,
		Now:        HumanizeBytes{Size: sizeNow, Suffix: suffixNow},
		Max:        HumanizeBytes{Size: sizeMax, Suffix: suffixMax},
		Speed:      p.state.speed,
	}

	return nil
}
