#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

echo "==> ArchSmith startup"

# ── Backend setup ─────────────────────────────────────────────────────────────
if [ ! -d "$BACKEND/.venv" ]; then
  echo "--> Creating Python venv..."
  python3 -m venv "$BACKEND/.venv"
fi

echo "--> Installing backend dependencies..."
"$BACKEND/.venv/bin/pip" install -q -r "$BACKEND/requirements.txt"

echo "--> Starting backend on :8002..."
cd "$BACKEND"
PYTHONPATH=src .venv/bin/uvicorn archsmith.main:app --reload --port 8002 &
BACKEND_PID=$!
echo "    Backend PID: $BACKEND_PID"

# ── Frontend setup ────────────────────────────────────────────────────────────
if [ ! -d "$FRONTEND/node_modules" ]; then
  echo "--> Installing frontend dependencies..."
  cd "$FRONTEND" && npm install
fi

echo "--> Starting frontend on :5175..."
cd "$FRONTEND"
npm run dev &
FRONTEND_PID=$!
echo "    Frontend PID: $FRONTEND_PID"

echo ""
echo "  ArchSmith is running:"
echo "    Frontend  → http://localhost:5175"
echo "    Backend   → http://localhost:8002"
echo "    API docs  → http://localhost:8002/docs"
echo ""
echo "  Press Ctrl+C to stop both servers."
echo ""

# Wait and clean up on exit
trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
