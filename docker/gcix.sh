#!/bin/sh

# This script checks for the presence of specific files with extensions
# .gitlab-ci.py, .gitlab-ci.ts, or .gitlab-ci.js in the current directory
# or executes a given file based on its extension using the appropriate tool.

# Check if a filename is provided as an argument.
if [ $# -eq 0 ]; then
  # If no filename is provided, check for the presence of specific files in the current directory.
  if [ -e .gitlab-ci.py ]; then
    filename=".gitlab-ci.py"
  elif [ -e .gitlab-ci.ts ]; then
    filename=".gitlab-ci.ts"
  elif [ -e .gitlab-ci.js ]; then
    filename=".gitlab-ci.js"
  else
    echo "No filename provided, and no .gitlab-ci.py, .gitlab-ci.ts, or .gitlab-ci.js files found in the current directory."
    exit 1
  fi
else
  filename="$1"
fi

# Check if the specified or found file exists.
if [ ! -f "$filename" ]; then
  echo "File '$filename' not found."
  exit 1
fi

# Extract the file extension.
extension=$(echo "$filename" | awk -F'.' '{print $NF}')

# Use a case statement to render the file with the appropriate tool based on the file extension.
case "$extension" in
"py")
  echo "Rendering $filename with python3..."
  # shellcheck source=/dev/null
  . "${HOME}/venv/bin/activate" && python3 "$filename"
  ;;
"ts")
  echo "Rendering $filename with ts-node..."
  ts-node "$filename"
  ;;
"js")
  echo "Rendering $filename with node..."
  node "$filename"
  ;;
*)
  echo "Unsupported language. Supported languages are python3, ts-node, and node."
  ;;
esac
