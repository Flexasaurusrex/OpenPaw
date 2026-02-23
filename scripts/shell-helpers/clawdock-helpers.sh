#!/usr/bin/env bash
# ClawDock - Docker helpers for OpenPaw
# Inspired by Simon Willison's "Running OpenPaw in Docker"
# https://til.simonwillison.net/llms/openpaw-docker
#
# Installation:
#   mkdir -p ~/.pawock && curl -sL https://raw.githubusercontent.com/openpaw/openpaw/main/scripts/shell-helpers/pawock-helpers.sh -o ~/.pawock/pawock-helpers.sh
#   echo 'source ~/.pawock/pawock-helpers.sh' >> ~/.zshrc
#
# Usage:
#   pawock-help    # Show all available commands

# =============================================================================
# Colors
# =============================================================================
_CLR_RESET='\033[0m'
_CLR_BOLD='\033[1m'
_CLR_DIM='\033[2m'
_CLR_GREEN='\033[0;32m'
_CLR_YELLOW='\033[1;33m'
_CLR_BLUE='\033[0;34m'
_CLR_MAGENTA='\033[0;35m'
_CLR_CYAN='\033[0;36m'
_CLR_RED='\033[0;31m'

# Styled command output (green + bold)
_clr_cmd() {
  echo -e "${_CLR_GREEN}${_CLR_BOLD}$1${_CLR_RESET}"
}

# Inline command for use in sentences
_cmd() {
  echo "${_CLR_GREEN}${_CLR_BOLD}$1${_CLR_RESET}"
}

# =============================================================================
# Config
# =============================================================================
PAWOCK_CONFIG="${HOME}/.pawock/config"

# Common paths to check for OpenPaw
PAWOCK_COMMON_PATHS=(
  "${HOME}/openpaw"
  "${HOME}/workspace/openpaw"
  "${HOME}/projects/openpaw"
  "${HOME}/dev/openpaw"
  "${HOME}/code/openpaw"
  "${HOME}/src/openpaw"
)

_pawock_filter_warnings() {
  grep -v "^WARN\|^time="
}

_pawock_trim_quotes() {
  local value="$1"
  value="${value#\"}"
  value="${value%\"}"
  printf "%s" "$value"
}

_pawock_read_config_dir() {
  if [[ ! -f "$PAWOCK_CONFIG" ]]; then
    return 1
  fi
  local raw
  raw=$(sed -n 's/^PAWOCK_DIR=//p' "$PAWOCK_CONFIG" | head -n 1)
  if [[ -z "$raw" ]]; then
    return 1
  fi
  _pawock_trim_quotes "$raw"
}

# Ensure PAWOCK_DIR is set and valid
_pawock_ensure_dir() {
  # Already set and valid?
  if [[ -n "$PAWOCK_DIR" && -f "${PAWOCK_DIR}/docker-compose.yml" ]]; then
    return 0
  fi

  # Try loading from config
  local config_dir
  config_dir=$(_pawock_read_config_dir)
  if [[ -n "$config_dir" && -f "${config_dir}/docker-compose.yml" ]]; then
    PAWOCK_DIR="$config_dir"
    return 0
  fi

  # Auto-detect from common paths
  local found_path=""
  for path in "${PAWOCK_COMMON_PATHS[@]}"; do
    if [[ -f "${path}/docker-compose.yml" ]]; then
      found_path="$path"
      break
    fi
  done

  if [[ -n "$found_path" ]]; then
    echo ""
    echo "🐾 Found OpenPaw at: $found_path"
    echo -n "   Use this location? [Y/n] "
    read -r response
    if [[ "$response" =~ ^[Nn] ]]; then
      echo ""
      echo "Set PAWOCK_DIR manually:"
      echo "  export PAWOCK_DIR=/path/to/openpaw"
      return 1
    fi
    PAWOCK_DIR="$found_path"
  else
    echo ""
    echo "❌ OpenPaw not found in common locations."
    echo ""
    echo "Clone it first:"
    echo ""
    echo "  git clone https://github.com/openpaw/openpaw.git ~/openpaw"
    echo "  cd ~/openpaw && ./docker-setup.sh"
    echo ""
    echo "Or set PAWOCK_DIR if it's elsewhere:"
    echo ""
    echo "  export PAWOCK_DIR=/path/to/openpaw"
    echo ""
    return 1
  fi

  # Save to config
  if [[ ! -d "${HOME}/.pawock" ]]; then
    /bin/mkdir -p "${HOME}/.pawock"
  fi
  echo "PAWOCK_DIR=\"$PAWOCK_DIR\"" > "$PAWOCK_CONFIG"
  echo "✅ Saved to $PAWOCK_CONFIG"
  echo ""
  return 0
}

# Wrapper to run docker compose commands
_pawock_compose() {
  _pawock_ensure_dir || return 1
  local compose_args=(-f "${PAWOCK_DIR}/docker-compose.yml")
  if [[ -f "${PAWOCK_DIR}/docker-compose.extra.yml" ]]; then
    compose_args+=(-f "${PAWOCK_DIR}/docker-compose.extra.yml")
  fi
  command docker compose "${compose_args[@]}" "$@"
}

_pawock_read_env_token() {
  _pawock_ensure_dir || return 1
  if [[ ! -f "${PAWOCK_DIR}/.env" ]]; then
    return 1
  fi
  local raw
  raw=$(sed -n 's/^OPENPAW_GATEWAY_TOKEN=//p' "${PAWOCK_DIR}/.env" | head -n 1)
  if [[ -z "$raw" ]]; then
    return 1
  fi
  _pawock_trim_quotes "$raw"
}

# Basic Operations
pawock-start() {
  _pawock_compose up -d openpaw-gateway
}

pawock-stop() {
  _pawock_compose down
}

pawock-restart() {
  _pawock_compose restart openpaw-gateway
}

pawock-logs() {
  _pawock_compose logs -f openpaw-gateway
}

pawock-status() {
  _pawock_compose ps
}

# Navigation
pawock-cd() {
  _pawock_ensure_dir || return 1
  cd "${PAWOCK_DIR}"
}

pawock-config() {
  cd ~/.openpaw
}

pawock-workspace() {
  cd ~/.openpaw/workspace
}

# Container Access
pawock-shell() {
  _pawock_compose exec openpaw-gateway \
    bash -c 'echo "alias openpaw=\"./openpaw.mjs\"" > /tmp/.bashrc_openpaw && bash --rcfile /tmp/.bashrc_openpaw'
}

pawock-exec() {
  _pawock_compose exec openpaw-gateway "$@"
}

pawock-cli() {
  _pawock_compose run --rm openpaw-cli "$@"
}

# Maintenance
pawock-rebuild() {
  _pawock_compose build openpaw-gateway
}

pawock-clean() {
  _pawock_compose down -v --remove-orphans
}

# Health check
pawock-health() {
  _pawock_ensure_dir || return 1
  local token
  token=$(_pawock_read_env_token)
  if [[ -z "$token" ]]; then
    echo "❌ Error: Could not find gateway token"
    echo "   Check: ${PAWOCK_DIR}/.env"
    return 1
  fi
  _pawock_compose exec -e "OPENPAW_GATEWAY_TOKEN=$token" openpaw-gateway \
    node dist/index.js health
}

# Show gateway token
pawock-token() {
  _pawock_read_env_token
}

# Fix token configuration (run this once after setup)
pawock-fix-token() {
  _pawock_ensure_dir || return 1

  echo "🔧 Configuring gateway token..."
  local token
  token=$(pawock-token)
  if [[ -z "$token" ]]; then
    echo "❌ Error: Could not find gateway token"
    echo "   Check: ${PAWOCK_DIR}/.env"
    return 1
  fi

  echo "📝 Setting token: ${token:0:20}..."

  _pawock_compose exec -e "TOKEN=$token" openpaw-gateway \
    bash -c './openpaw.mjs config set gateway.remote.token "$TOKEN" && ./openpaw.mjs config set gateway.auth.token "$TOKEN"' 2>&1 | _pawock_filter_warnings

  echo "🔍 Verifying token was saved..."
  local saved_token
  saved_token=$(_pawock_compose exec openpaw-gateway \
    bash -c "./openpaw.mjs config get gateway.remote.token 2>/dev/null" 2>&1 | _pawock_filter_warnings | tr -d '\r\n' | head -c 64)

  if [[ "$saved_token" == "$token" ]]; then
    echo "✅ Token saved correctly!"
  else
    echo "⚠️  Token mismatch detected"
    echo "   Expected: ${token:0:20}..."
    echo "   Got: ${saved_token:0:20}..."
  fi

  echo "🔄 Restarting gateway..."
  _pawock_compose restart openpaw-gateway 2>&1 | _pawock_filter_warnings

  echo "⏳ Waiting for gateway to start..."
  sleep 5

  echo "✅ Configuration complete!"
  echo -e "   Try: $(_cmd pawock-devices)"
}

# Open dashboard in browser
pawock-dashboard() {
  _pawock_ensure_dir || return 1

  echo "🐾 Getting dashboard URL..."
  local output exit_status url
  output=$(_pawock_compose run --rm openpaw-cli dashboard --no-open 2>&1)
  exit_status=$?
  url=$(printf "%s\n" "$output" | _pawock_filter_warnings | grep -o 'http[s]\?://[^[:space:]]*' | head -n 1)
  if [[ $exit_status -ne 0 ]]; then
    echo "❌ Failed to get dashboard URL"
    echo -e "   Try restarting: $(_cmd pawock-restart)"
    return 1
  fi

  if [[ -n "$url" ]]; then
    echo "✅ Opening: $url"
    open "$url" 2>/dev/null || xdg-open "$url" 2>/dev/null || echo "   Please open manually: $url"
    echo ""
    echo -e "${_CLR_CYAN}💡 If you see 'pairing required' error:${_CLR_RESET}"
    echo -e "   1. Run: $(_cmd pawock-devices)"
    echo "   2. Copy the Request ID from the Pending table"
    echo -e "   3. Run: $(_cmd 'pawock-approve <request-id>')"
  else
    echo "❌ Failed to get dashboard URL"
    echo -e "   Try restarting: $(_cmd pawock-restart)"
  fi
}

# List device pairings
pawock-devices() {
  _pawock_ensure_dir || return 1

  echo "🔍 Checking device pairings..."
  local output exit_status
  output=$(_pawock_compose exec openpaw-gateway node dist/index.js devices list 2>&1)
  exit_status=$?
  printf "%s\n" "$output" | _pawock_filter_warnings
  if [ $exit_status -ne 0 ]; then
    echo ""
    echo -e "${_CLR_CYAN}💡 If you see token errors above:${_CLR_RESET}"
    echo -e "   1. Verify token is set: $(_cmd pawock-token)"
    echo "   2. Try manual config inside container:"
    echo -e "      $(_cmd pawock-shell)"
    echo -e "      $(_cmd 'openpaw config get gateway.remote.token')"
    return 1
  fi

  echo ""
  echo -e "${_CLR_CYAN}💡 To approve a pairing request:${_CLR_RESET}"
  echo -e "   $(_cmd 'pawock-approve <request-id>')"
}

# Approve device pairing request
pawock-approve() {
  _pawock_ensure_dir || return 1

  if [[ -z "$1" ]]; then
    echo -e "❌ Usage: $(_cmd 'pawock-approve <request-id>')"
    echo ""
    echo -e "${_CLR_CYAN}💡 How to approve a device:${_CLR_RESET}"
    echo -e "   1. Run: $(_cmd pawock-devices)"
    echo "   2. Find the Request ID in the Pending table (long UUID)"
    echo -e "   3. Run: $(_cmd 'pawock-approve <that-request-id>')"
    echo ""
    echo "Example:"
    echo -e "   $(_cmd 'pawock-approve 6f9db1bd-a1cc-4d3f-b643-2c195262464e')"
    return 1
  fi

  echo "✅ Approving device: $1"
  _pawock_compose exec openpaw-gateway \
    node dist/index.js devices approve "$1" 2>&1 | _pawock_filter_warnings

  echo ""
  echo "✅ Device approved! Refresh your browser."
}

# Show all available pawock helper commands
pawock-help() {
  echo -e "\n${_CLR_BOLD}${_CLR_CYAN}🐾 ClawDock - Docker Helpers for OpenPaw${_CLR_RESET}\n"

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}⚡ Basic Operations${_CLR_RESET}"
  echo -e "  $(_cmd pawock-start)       ${_CLR_DIM}Start the gateway${_CLR_RESET}"
  echo -e "  $(_cmd pawock-stop)        ${_CLR_DIM}Stop the gateway${_CLR_RESET}"
  echo -e "  $(_cmd pawock-restart)     ${_CLR_DIM}Restart the gateway${_CLR_RESET}"
  echo -e "  $(_cmd pawock-status)      ${_CLR_DIM}Check container status${_CLR_RESET}"
  echo -e "  $(_cmd pawock-logs)        ${_CLR_DIM}View live logs (follows)${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}🐚 Container Access${_CLR_RESET}"
  echo -e "  $(_cmd pawock-shell)       ${_CLR_DIM}Shell into container (openpaw alias ready)${_CLR_RESET}"
  echo -e "  $(_cmd pawock-cli)         ${_CLR_DIM}Run CLI commands (e.g., pawock-cli status)${_CLR_RESET}"
  echo -e "  $(_cmd pawock-exec) ${_CLR_CYAN}<cmd>${_CLR_RESET}  ${_CLR_DIM}Execute command in gateway container${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}🌐 Web UI & Devices${_CLR_RESET}"
  echo -e "  $(_cmd pawock-dashboard)   ${_CLR_DIM}Open web UI in browser ${_CLR_CYAN}(auto-guides you)${_CLR_RESET}"
  echo -e "  $(_cmd pawock-devices)     ${_CLR_DIM}List device pairings ${_CLR_CYAN}(auto-guides you)${_CLR_RESET}"
  echo -e "  $(_cmd pawock-approve) ${_CLR_CYAN}<id>${_CLR_RESET} ${_CLR_DIM}Approve device pairing ${_CLR_CYAN}(with examples)${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}⚙️  Setup & Configuration${_CLR_RESET}"
  echo -e "  $(_cmd pawock-fix-token)   ${_CLR_DIM}Configure gateway token ${_CLR_CYAN}(run once)${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}🔧 Maintenance${_CLR_RESET}"
  echo -e "  $(_cmd pawock-rebuild)     ${_CLR_DIM}Rebuild Docker image${_CLR_RESET}"
  echo -e "  $(_cmd pawock-clean)       ${_CLR_RED}⚠️  Remove containers & volumes (nuclear)${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_MAGENTA}🛠️  Utilities${_CLR_RESET}"
  echo -e "  $(_cmd pawock-health)      ${_CLR_DIM}Run health check${_CLR_RESET}"
  echo -e "  $(_cmd pawock-token)       ${_CLR_DIM}Show gateway auth token${_CLR_RESET}"
  echo -e "  $(_cmd pawock-cd)          ${_CLR_DIM}Jump to openpaw project directory${_CLR_RESET}"
  echo -e "  $(_cmd pawock-config)      ${_CLR_DIM}Open config directory (~/.openpaw)${_CLR_RESET}"
  echo -e "  $(_cmd pawock-workspace)   ${_CLR_DIM}Open workspace directory${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${_CLR_RESET}"
  echo -e "${_CLR_BOLD}${_CLR_GREEN}🚀 First Time Setup${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  1.${_CLR_RESET} $(_cmd pawock-start)          ${_CLR_DIM}# Start the gateway${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  2.${_CLR_RESET} $(_cmd pawock-fix-token)      ${_CLR_DIM}# Configure token${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  3.${_CLR_RESET} $(_cmd pawock-dashboard)      ${_CLR_DIM}# Open web UI${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  4.${_CLR_RESET} $(_cmd pawock-devices)        ${_CLR_DIM}# If pairing needed${_CLR_RESET}"
  echo -e "${_CLR_CYAN}  5.${_CLR_RESET} $(_cmd pawock-approve) ${_CLR_CYAN}<id>${_CLR_RESET}   ${_CLR_DIM}# Approve pairing${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_GREEN}💬 WhatsApp Setup${_CLR_RESET}"
  echo -e "  $(_cmd pawock-shell)"
  echo -e "    ${_CLR_BLUE}>${_CLR_RESET} $(_cmd 'openpaw channels login --channel whatsapp')"
  echo -e "    ${_CLR_BLUE}>${_CLR_RESET} $(_cmd 'openpaw status')"
  echo ""

  echo -e "${_CLR_BOLD}${_CLR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${_CLR_RESET}"
  echo ""

  echo -e "${_CLR_CYAN}💡 All commands guide you through next steps!${_CLR_RESET}"
  echo -e "${_CLR_BLUE}📚 Docs: ${_CLR_RESET}${_CLR_CYAN}https://docs.openpaw.ai${_CLR_RESET}"
  echo ""
}
