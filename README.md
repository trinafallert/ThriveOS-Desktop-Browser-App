<div align="center">
  <img src="packages/browseros/resources/icons/product_logo.svg" alt="ThriveOS Logo" width="120" />
  <h1>ThriveOS Desktop Browser App</h1>
  <p>Your AI-powered browser — built for the life and business you're building.</p>
</div>

## What is ThriveOS Desktop?

ThriveOS Desktop is an AI-powered Chromium browser that combines the full ThriveOS experience — your goals, your AI assistant, your business tools — directly into your desktop browser. Built on top of the open-source BrowserOS foundation.

**Key features:**
- 🌀 Full ThriveOS branding & pastel swirl logo
- 🤖 AI agent built into the browser sidebar
- 🎯 ThriveOS onboarding (Vision, Goals, Work Style, AI Personality)
- 🔑 **Shared login** — use your existing ThriveOS website account
- 📊 Dashboard-first home page
- 🔧 MCP (Model Context Protocol) tool integrations

## Shared Login with ThriveOS Website

If you already have a ThriveOS account from the website, you can sign in with the **same email or Google account** in the desktop app. Set `VITE_PUBLIC_BROWSEROS_API` in your `.env` to point to the ThriveOS API.

## Building the Desktop App

GitHub Actions automatically builds Mac, Windows, and Linux installers on every release. No setup needed — just tag a release and GitHub will produce downloadable `.dmg`, `.exe`, and `.AppImage` files for free.

To build locally:
```bash
cd packages/browseros-agent
bun install
bun run build
```

## Development

```bash
# Clone the repo
git clone https://github.com/trinafallert/ThriveOS-Desktop-Browser-App

# Install dependencies
cd packages/browseros-agent
bun install

# Copy and configure env
cp .env.thriveos.example .env
# Edit .env with your ThriveOS API URL

# Start dev server
bun run dev
```

## Credits

Built on top of [BrowserOS](https://github.com/browseros-ai/BrowserOS) (AGPL-3.0).  
ThriveOS branding, onboarding, and integrations by [ThriveOS](https://thriveos.app).
