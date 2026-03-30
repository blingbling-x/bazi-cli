# Bazi (八字) Cli

Unlock precise Bazi insights with **Bazi**, the first AI-powered Bazi calculator. Built to address inaccuracies in existing AI fortune-telling tools like GPT and DeepSeek, it delivers reliable Bazi data for personality analysis, destiny forecasting, and more.

### Why Bazi?

- **Accurate Bazi Calculations**: Provide insightful Bazi information.
- **AI Agent Integration**: Empowers AI agents with precise Bazi data.

## 中文

**八字**是参天 AI 推出的首个面向玄学领域的精准八字计算工具，针对 GPT 和 DeepSeek 等算命工具常出现的排盘错误，提供精准的八字数据，助力性格分析、命运预测等应用。

### 八字亮点

- **精准排盘**：提供全面的八字排盘信息。
- **AI 赋能**：为 AI 智能体提供可靠八字服务。

## 前置需求 ｜ Prerequisite

Node.js 22 版本或以上。

Node.js 22 or above.

## 命令行工具 | CLI

全局安装后可直接在终端使用 `bazi` 命令进行排盘、反查、黄历查询。

Install globally to use the `bazi` command for Bazi calculation, reverse lookup, and Chinese calendar.

```bash
npm install -g github:blingbling-x/bazi-cli
```

```bash
# 排盘（公历）
bazi paipan -s "2008-03-01T13:00:00+08:00" -g 1

# 排盘（农历）
bazi paipan --lunar "2000-5-5 12:00:00" --gender 0

# 八字反查公历时间
bazi fan -b "戊寅 己未 己卯 辛未"

# 黄历
bazi calendar
bazi calendar -s "2024-02-10T00:00:00+08:00"

# 输出 JSON 格式（默认 md）
bazi paipan -s "2008-03-01T13:00:00+08:00" -g 1 -o json
```

## 命令行详情 | CLI Details

### paipan（排盘）

> 根据给定的公历或农历时间计算八字信息。
> Calculate the Bazi results based on the solar/lunar datetime.

#### 参数 | Arguments

- `-s, --solar`：ISO 格式的阳历时间。例如：`2000-05-15T12:00:00+08:00`
- `--lunar`：农历时间。例如：`2000-5-15 12:00:00`
- `-g, --gender`：性别。可选。`0` - 女，`1` - 男。默认 `1`
- `-o, --output`：输出格式。`md`（默认）或 `json`

#### 结果示例 ｜ Result example

`bazi paipan -s "1998-07-31T14:10:00+08:00" -g 1`

```markdown
# 八字排盘

| 项目 | 值 |
| --- | --- |
| 性别 | 男 |
| 阳历 | 1998年7月31日 14:10:00 |
| 农历 | 农历戊寅年六月初九辛未时 |
| 八字 | **戊寅 己未 己卯 辛未** |
| 生肖 | 虎 |
| 日主 | 己 |
| 胎元 | 庚戌 |
| 胎息 | 甲戌 |
| 命宫 | 乙卯 |
| 身宫 | 乙卯 |

## 四柱

### 年柱：戊寅

| 项目 | 值 |
| --- | --- |
| 天干 | 戊（土阳） 劫财 |
| 地支 | 寅（木阳） |
| 藏干 | 主气甲(正官) 中气丙(正印) 余气戊(劫财) |
| 纳音 | 城头土 |
| 旬/空亡 | 甲戌 空亡申酉 |
| 星运 | 死 |
| 自坐 | 长生 |

### 月柱：己未

| 项目 | 值 |
| --- | --- |
| 天干 | 己（土阴） 比肩 |
| 地支 | 未（土阴） |
| 藏干 | 主气己(比肩) 中气丁(偏印) 余气乙(七杀) |
| 纳音 | 天上火 |
| 旬/空亡 | 甲寅 空亡子丑 |
| 星运 | 冠带 |
| 自坐 | 冠带 |

...（省略日柱、时柱、神煞、大运、刑冲合会等）
```

### fan（反查）

> 根据给定的八字返回可能的公历时间列表。
> Return a list of possible solar calendar datetime based on the given Bazi.

#### 参数 | Arguments

- `-b, --bazi`：八字，各柱用空格隔开
- `-o, --output`：输出格式。`md`（默认）或 `json`

#### 结果示例 ｜ Result example

`bazi fan -b "戊寅 己未 己卯 辛未"`

```markdown
# 八字反查：戊寅 己未 己卯 辛未

共找到 3 个匹配时间：

- 1758-07-29 14:00:00
- 1818-07-15 14:00:00
- 1998-07-31 14:00:00
```

### calendar（黄历）

> 获取指定公历时间（默认今天）的黄历信息。
> Get chinese calendar information for the specified solar calendar date (default is today).

#### 参数 | Arguments

- `-s, --solar`：ISO 格式的阳历时间。例如：`2024-02-10T00:00:00+08:00`。可选，默认今天
- `-o, --output`：输出格式。`md`（默认）或 `json`

#### 结果示例 ｜ Result example

`bazi calendar`

```markdown
# 黄历 2026年3月30日 星期一

| 项目 | 值 |
| --- | --- |
| 农历 | 农历丙午年二月十二 |
| 干支 | 丙午 辛卯 癸卯 |
| 生肖 | 马 |
| 纳音 | 金箔金 |
| 节气 | 春分 |
| 二十八宿 | 张月鹿吉 |
| 彭祖百忌 | 癸不词讼理弱敌强 卯不穿井水泉不香 |
| 冲煞 | 冲鸡(酉)煞西 |

## 方位

| 方位 | 值 |
| --- | --- |
| 喜神 | 东南 |
| 阳贵神 | 东南 |
| 阴贵神 | 东 |
| 福神 | 西 |
| 财神 | 南 |

## 宜忌

- **宜**：祭祀,会亲友,出行,立券,交易,冠笄,纳财
- **忌**：嫁娶,动土,掘井,起基,定磉,破土
```

**Keywords**: Bazi, Bazi AI Agent, Fengshui AI Agent, Bazi Calculator, Bazi Calculator AI, Cantian AI
