serve:
	wails dev -s -debounce 1000 -frontenddevserverurl "http://localhost:5173/"
serve-skipbindings:
	wails dev -s -debounce 1000 -skipbindings -frontenddevserverurl "http://localhost:5173/"
wails-build:
	wails build -nsis -clean -platform windows/amd64
pack:
	@echo "打包靜態文件..."
	@echo y| gb pack resource backend/packed/data.go -n=packed