; Define the path to your Python executable within the virtual environment
pythonPath := "C:\Users\morge\OneDrive\Projects\Python\ObsidianCanvasAutoLayout\venv\Scripts\python.exe"

; Define the path to your Python script
scriptPath := "C:\Users\morge\OneDrive\Projects\Python\ObsidianCanvasAutoLayout\main.py"

; Run the Python script silently (hidden)
Run, %ComSpec% /c ""%pythonPath%" "%scriptPath%"", , Hide
