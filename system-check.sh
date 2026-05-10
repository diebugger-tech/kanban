#!/usr/bin/env bash

# system-check.sh - Surreal-Board & Dev Environment Diagnostic
# Part of the PI Agent / antigravity toolchain

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== surreal-board System Check ===${NC}"

# 1. Project Directory & Git Status
echo -n "Checking Project Repo: "
if gh repo view diebugger-tech/kanban &>/dev/null; then
    echo -e "${GREEN}OK (Public: diebugger-tech/kanban)${NC}"
else
    echo -e "${RED}FAILED (Repo not found or private)${NC}"
fi

# 2. Issues & PRs
echo -n "Checking Issues/PRs: "
ISSUE_COUNT=$(gh issue list --repo diebugger-tech/kanban --json number --jq 'length')
PR_STATUS=$(gh pr view 115 --repo surrealdb/awesome-surreal --json state --jq '.state' 2>/dev/null)
if [[ $ISSUE_COUNT -ge 4 ]] && [[ "$PR_STATUS" == "OPEN" ]]; then
    echo -e "${GREEN}OK ($ISSUE_COUNT Issues, PR #115 Open)${NC}"
else
    echo -e "${RED}WARNING (Issues: $ISSUE_COUNT, PR: $PR_STATUS)${NC}"
fi

# 3. NixOS Aliases
echo -n "Checking nix-up alias: "
if grep -q "nix-up" /etc/nixos/home.nix 2>/dev/null; then
    echo -e "${GREEN}OK (Found in /etc/nixos/home.nix)${NC}"
else
    echo -e "${RED}FAILED (Alias not found)${NC}"
fi

# 4. pi Agent Config
echo -n "Checking pi agent (qwen2.5-coder:7b): "
if grep -q "qwen2.5-coder:7b" ~/.pi/agent/models.json 2>/dev/null; then
    echo -e "${GREEN}OK (Configured)${NC}"
else
    echo -e "${RED}FAILED (Model missing in models.json)${NC}"
fi

# 5. SurrealDB Health
echo -n "Checking SurrealDB: "
SURREAL_VERSION=$(surreal version 2>/dev/null | head -n 1)
if [[ -n "$SURREAL_VERSION" ]]; then
    echo -e "${GREEN}OK ($SURREAL_VERSION)${NC}"
else
    echo -e "${RED}FAILED (Not running or not in PATH)${NC}"
fi

# 6. Vite Dev Server
echo -n "Checking Vite: "
if pgrep -f "vite" >/dev/null; then
    echo -e "${GREEN}OK (Running)${NC}"
else
    echo -e "${RED}FAILED (Not running)${NC}"
fi

echo -e "${BLUE}==================================${NC}"
echo "System check complete."
