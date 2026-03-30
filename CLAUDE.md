# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bazi MCP (八字 MCP) is an MCP server for Chinese Bazi (八字/Four Pillars) fortune-telling calculations. It provides accurate Bazi data via the Model Context Protocol for AI agent integration. Built by Cantian AI.

## Build & Run Commands

- **Build**: `npm run tsc` — clears `dist/` and compiles TypeScript
- **Start HTTP server**: `npm start` — builds then runs Express server on port 3000
- **Smithery dev**: `npx @smithery/cli dev`

There are no tests or lint scripts configured.

## Architecture

### Transport Layer
Three entry points serve the same MCP tools over different transports:
- `src/stdio.ts` → StdioServerTransport (for Claude Desktop, `bazi-mcp` binary)
- `src/httpServer.ts` → Express + StreamableHTTPServerTransport at `/mcp` (port 3000)
- `src/smithery.ts` → Smithery marketplace integration

### MCP Server (`src/mcp.ts`)
Defines three tools using `@modelcontextprotocol/sdk`:
- **getBaziDetail** — calculate Bazi from solar or lunar datetime + gender
- **getSolarTimes** — reverse-lookup solar datetimes from a Bazi string
- **getChineseCalendar** — get Chinese calendar (黄历) info for a date

### Core Logic (`src/lib/`)
- `bazi.ts` — builds the full Bazi object (四柱, 十神, 大运, 神煞, 刑冲合会, etc.)
- `date.ts` — date/time conversion between solar and lunar using `tyme4ts`
- `chineseCalendar.ts` — Chinese calendar information assembly

### Public API (`src/index.ts`)
Exports `getBaziDetail()`, `getSolarTimes()`, `getChineseCalendar()` — used by both MCP tools and CLI.

### CLI (`src/cli.ts`)
Binary `bazi` with subcommands: `paipan`, `fan`, `calendar`. Supports `--output markdown|json`.

## Key Libraries

- **tyme4ts** — lunar/solar calendar conversion and Chinese calendar calculations
- **cantian-tymext** — extended Bazi calculation utilities (十神, 神煞, etc.)
- **@modelcontextprotocol/sdk** — MCP protocol implementation
- **zod** — tool parameter schema validation

## Code Conventions

- ESM modules (`"type": "module"`) — use `.js` extensions in imports even for TypeScript files
- Prettier: single quotes, 128 char width, trailing commas
- Domain terms use Chinese characters (天干, 地支, 十神, 八字, 大运, etc.)
- Bilingual documentation (English + Chinese)
- Node.js 22+ required
