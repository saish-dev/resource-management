#!/usr/bin/env bash
# PostToolUse hook: format the edited file with the repo's Prettier, if installed.
f=$(python3 -c 'import json,sys; print((json.load(sys.stdin).get("tool_input") or {}).get("file_path",""))')
root="${CLAUDE_PROJECT_DIR:-.}"
case "$f" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md) ;;
  *) exit 0 ;;
esac
[ -x "$root/node_modules/.bin/prettier" ] && "$root/node_modules/.bin/prettier" --write "$f" >/dev/null 2>&1
exit 0
