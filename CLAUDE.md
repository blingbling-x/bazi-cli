# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bazi (八字) is a TypeScript library and CLI tool for Chinese Bazi (八字/Four Pillars) fortune-telling calculations. It provides accurate Bazi data as a library and command-line interface. Built by Cantian AI.

## Build & Run Commands

- **Build**: `npm run tsc` — clears `dist/` and compiles TypeScript

There are no tests or lint scripts configured.

## Architecture

### Core Logic (`src/lib/`)
- `bazi.ts` — builds the full Bazi object (四柱, 十神, 大运, 神煞, 刑冲合会, etc.)
- `date.ts` — date/time conversion between solar and lunar using `tyme4ts`
- `chineseCalendar.ts` — Chinese calendar information assembly

### Public API (`src/index.ts`)
Exports `getBaziDetail()`, `getSolarTimes()`, `getChineseCalendar()` — used by CLI and consumers of the library.

### CLI (`src/cli.ts`)
Binary `bazi` with subcommands: `paipan`, `fan`, `calendar`. Supports `--output markdown|json`.

## Key Libraries

- **tyme4ts** — lunar/solar calendar conversion and Chinese calendar calculations
- **cantian-tymext** — extended Bazi calculation utilities (十神, 神煞, etc.)
- **zod** — schema validation

## Code Conventions

- ESM modules (`"type": "module"`) — use `.js` extensions in imports even for TypeScript files
- Prettier: single quotes, 128 char width, trailing commas
- Domain terms use Chinese characters (天干, 地支, 十神, 八字, 大运, etc.)
- Bilingual documentation (English + Chinese)
- Node.js 22+ required
