package logger

import (
	"context"
	"ghostbb.io/gb/frame/g"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"os"
)

type Logger struct{}

func New() logger.Logger {
	return &Logger{}
}

func (l *Logger) Print(message string) {
	println(message)
}

func (l *Logger) Trace(message string) {
	println("TRA | " + message)
}

func (l *Logger) Debug(message string) {
	g.Log().Debug(context.Background(), message)
}

func (l *Logger) Info(message string) {
	g.Log().Info(context.Background(), message)
}

// Warning level logging. Works like Sprintf.
func (l *Logger) Warning(message string) {
	g.Log().Warning(context.Background(), message)
}

// Error level logging. Works like Sprintf.
func (l *Logger) Error(message string) {
	g.Log().Error(context.Background(), message)
}

// Fatal level logging. Works like Sprintf.
func (l *Logger) Fatal(message string) {
	g.Log().Fatal(context.Background(), message)
	os.Exit(1)
}
