#!/usr/bin/env python3
"""PreToolUse hook: block edits to secrets, the bundled prototype and applied migrations."""
import json, os, re, sys

data = json.load(sys.stdin)
path = (data.get("tool_input") or {}).get("file_path") or ""
name = os.path.basename(path)

if re.match(r"^\.env(\..+)?$", name) and name != ".env.example":
    reason = "Secrets file; edit it yourself and keep it out of git."
elif name == "resource_management_v2.html":
    reason = "Generated prototype bundle; it is the spec, not source. Don't edit it."
elif "/prisma/migrations/" in path and name == "migration.sql" and os.path.exists(path):
    reason = "Applied migrations are immutable. Create a new migration instead."
else:
    sys.exit(0)

print(f"Blocked: {path}\n{reason}", file=sys.stderr)
sys.exit(2)
