---
name: bazi
description: "Use the `bazi` CLI tool to calculate Chinese Bazi (八字/Four Pillars of Destiny), reverse-lookup birth times from a Bazi string, or query the Chinese calendar (黄历). Trigger this skill whenever the user mentions 八字, 生辰, 四柱, 命理, 排盘, 算命, 黄历, 日历, 宜忌, 大运, 十神, 天干地支, birth chart calculation, Chinese astrology, or wants to know what's auspicious today — even if they don't explicitly say 'bazi'. If the user gives a birth date/time and asks about their destiny, personality, or fortune, use this skill."
---

# Bazi CLI Skill

This skill teaches you how to use the `bazi` command-line tool to provide Chinese Bazi (八字) fortune-telling calculations.

## Installation

Before using the CLI, make sure it's installed globally:

```bash
npm install -g github:blingbling-x/bazi-cli
```

This installs two commands:
- `bazi` — the CLI tool for Bazi calculations, calendar queries, etc.
- `bazi-mcp` — the MCP server (for AI agent integration via stdio)

If the command is not found after installation, you can also run it via npx:

```bash
npx bazi-mcp bazi paipan -s "1990-06-15T08:30:00+08:00" -g 1 -o json
```

## Why this matters

Bazi (八字), also known as the Four Pillars of Destiny, is a Chinese metaphysical system that maps a person's birth time to a set of heavenly stems (天干) and earthly branches (地支). Accurate Bazi calculation requires complex calendar conversions between solar and lunar calendars, and deep domain knowledge of traditional Chinese metaphysics. The `bazi` CLI handles all of this — your job is to call it with the right parameters and then interpret the results for the user.

## Available Commands

The CLI has three subcommands: `paipan`, `fan`, and `calendar`.

### 1. `bazi paipan` — Calculate Bazi from a date/time

This is the most common command. Given a birth date/time and gender, it calculates the complete Bazi chart.

```bash
# From solar (公历/阳历) date — most common case
bazi paipan -s "2008-03-01T13:00:00+08:00" -g 1 -o json

# From lunar (农历/阴历) date
bazi paipan -l "2000-5-5 12:00:00" -g 0 -o json
```

**Options:**
| Flag | Description | Values |
|------|-------------|--------|
| `-s, --solar` | Solar datetime (ISO 8601 with timezone) | e.g. `"1990-06-15T08:30:00+08:00"` |
| `-l, --lunar` | Lunar datetime | e.g. `"2000-5-5 12:00:00"` |
| `-g, --gender` | Gender | `1` = male (男), `0` = female (女). Default: `1` |
| `--sect` | How to handle 23:00–23:59 | `1` = next day's stem, `2` = today's stem (default) |
| `-o, --output` | Output format | `md` (default) or `json` |

**Rules:**
- Exactly one of `--solar` or `--lunar` is required — not both, not neither.
- Solar dates need timezone. Chinese Bazi always uses China Standard Time (`+08:00`), so append `+08:00` unless the user specifies another timezone.
- When the user gives a date in Chinese like "1990年6月15日上午8点半", convert it to ISO format: `"1990-06-15T08:30:00+08:00"`.
- When the user says "阳历" or "公历", that's solar. When they say "阴历" or "农历", that's lunar.
- If the user doesn't mention gender, default to male (`-g 1`), but it's polite to ask.
- Use `-o json` to get structured data you can work with programmatically. Use `-o md` (or omit `-o`) when you want to show formatted results directly.

**What the JSON output contains:**
- `性别` — Gender
- `阳历` / `农历` — Solar and lunar date strings
- `八字` — The four-pillar Bazi string (e.g. "戊子 甲寅 丙午 壬辰")
- `生肖` — Chinese zodiac animal
- `日主` — Day master (the core element representing the person)
- `年柱, 月柱, 日柱, 时柱` — Detailed four pillars with heavenly stems, earthly branches, hidden stems (藏干), ten gods (十神), Nayin (纳音), etc.
- `胎元, 胎息, 命宫, 身宫` — Conception, breath, destiny palace, body palace
- `神煞` — Spiritual stars and sha (per pillar)
- `大运` — Decade fortune periods with age ranges
- `刑冲合会` — Punishment, clash, combination, and association relationships between pillars

### 2. `bazi fan` — Reverse-lookup solar times from Bazi

When the user provides a Bazi string and wants to find what birth dates match it.

```bash
bazi fan -b "戊寅 己未 己卯 辛未" -o json
```

**Options:**
| Flag | Description | Values |
|------|-------------|--------|
| `-b, --bazi` | Bazi string (4 pillars separated by spaces) | e.g. `"戊寅 己未 己卯 辛未"` |
| `-o, --output` | Output format | `md` or `json` |

Returns an array of matching solar datetimes in `"YYYY-MM-DD HH:mm:ss"` format.

### 3. `bazi calendar` — Chinese calendar (黄历) query

Get Chinese calendar information for a given date, or today if no date is specified.

```bash
# Today's calendar
bazi calendar -o json

# Specific date
bazi calendar -s "2024-02-10T00:00:00+08:00" -o json
```

**Options:**
| Flag | Description | Values |
|------|-------------|--------|
| `-s, --solar` | Solar datetime (optional, defaults to today) | ISO 8601 format |
| `-o, --output` | Output format | `md` or `json` |

**What the JSON output contains:**
- `公历` / `农历` — Solar and lunar dates
- `干支` — Stem-branch for year, month, day
- `生肖` — Zodiac
- `纳音` — Nayin sound
- `农历节日` / `公历节日` — Festivals
- `节气` — Solar term
- `二十八宿` — 28 lunar mansions
- `彭祖百忌` — Peng Zu taboos
- `冲煞` — Clash and harm
- Direction gods: `喜神方位, 阳贵神方位, 阴贵神方位, 福神方位, 财神方位`
- `宜` / `忌` — Auspicious activities and taboos

## Workflow

1. **Figure out what the user needs.** Are they asking for a Bazi chart (paipan), a reverse lookup (fan), or a calendar query?
2. **Extract the parameters.** Date, time, gender, solar vs lunar. Ask the user if anything is unclear — especially the birth hour, which is critical for Bazi accuracy.
3. **Run the command** with `-o json` so you get structured data.
4. **Interpret and present the results.** Don't just dump the JSON — explain the key findings in a way the user can understand. Highlight the day master (日主), notable 十神 patterns, significant 神煞, and the current 大运 period.

## Common patterns

**User gives just a date, no time:**
Birth time (时辰) is essential for a complete Bazi — without it, the hour pillar (时柱) will be wrong. Politely ask the user for their birth hour. If they truly don't know, you can note that the hour pillar will be inaccurate.

**User asks "今天适合做什么" or "今天宜忌":**
Use `bazi calendar` to get today's Chinese calendar, then summarize the 宜 (auspicious) and 忌 (taboo) activities.

**User gives a Bazi string directly:**
Use `bazi fan` to find matching dates, or just interpret the Bazi directly if they're asking about the meaning of their chart.

**User asks about 大运 or current fortune:**
Run `bazi paipan`, then look at the 大运 array. Find the period matching the user's current age and explain what it means.
