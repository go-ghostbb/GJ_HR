serve:
	wails dev -s -debounce 1000 -frontenddevserverurl "http://localhost:5173/"
serve-skipbindings:
	wails dev -s -debounce 1000 -skipbindings -frontenddevserverurl "http://localhost:5173/"
wails-build:
	wails build -nsis -clean