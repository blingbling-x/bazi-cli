#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { getBaziDetail, getSolarTimes, getChineseCalendar } from './index.js';

const HELP = `八字排盘命令行工具

用法:
  bazi paipan   --solar <公历时间> --gender <性别>   排盘（公历）
  bazi paipan   --lunar <农历时间> --gender <性别>   排盘（农历）
  bazi fan      --bazi <八字>                        根据八字反查公历时间
  bazi calendar [--solar <公历时间>]                  查看黄历（默认今天）

子命令:
  paipan    八字排盘
  fan       根据八字反查公历时间
  calendar  黄历查询

公共参数:
  -o, --output <string>  输出格式，md=Markdown（默认），json=JSON

paipan 参数:
  -s, --solar <string>   公历时间（ISO格式），例如 "2008-03-01T13:00:00+08:00"
  -l, --lunar <string>   农历时间，例如 "2000-5-5 12:00:00"
  -g, --gender <number>  性别，0=女，1=男（默认 1）
      --sect <number>    早晚子时，1=23:00-23:59日干支为明天，2=当天（默认 2）

fan 参数:
  -b, --bazi <string>    八字，四柱用空格分隔，例如 "戊寅 己未 己卯 辛未"

calendar 参数:
  -s, --solar <string>   公历时间（ISO格式，可选，默认今天）

示例:
  bazi paipan -s "2008-03-01T13:00:00+08:00" -g 1
  bazi paipan --lunar "2000-5-5 12:00:00" --gender 0 -o json
  bazi fan -b "戊寅 己未 己卯 辛未"
  bazi calendar
  bazi calendar -s "2024-02-10T00:00:00+08:00" -o json`;

type OutputFormat = 'json' | 'md';

const outputOption = { type: 'string' as const, short: 'o' };

function getOutputFormat(value: string | undefined): OutputFormat {
  if (!value) return 'md';
  if (value === 'json' || value === 'md') return value;
  console.error('错误：--output 只能为 md 或 json。');
  process.exit(1);
}

// ── Markdown formatters ──

function formatPillar(name: string, pillar: any): string {
  const t = pillar.天干;
  const d = pillar.地支;
  const canggan = d.藏干;
  const lines: string[] = [];
  lines.push(`### ${name}：${t.天干}${d.地支}`);
  lines.push('');
  lines.push(`| 项目 | 值 |`);
  lines.push(`| --- | --- |`);
  lines.push(`| 天干 | ${t.天干}（${t.五行}${t.阴阳}） ${t.十神 ?? '日主'} |`);
  lines.push(`| 地支 | ${d.地支}（${d.五行}${d.阴阳}） |`);
  const parts: string[] = [];
  if (canggan.主气) parts.push(`主气${canggan.主气.天干}(${canggan.主气.十神})`);
  if (canggan.中气) parts.push(`中气${canggan.中气.天干}(${canggan.中气.十神})`);
  if (canggan.余气) parts.push(`余气${canggan.余气.天干}(${canggan.余气.十神})`);
  lines.push(`| 藏干 | ${parts.join(' ')} |`);
  lines.push(`| 纳音 | ${pillar.纳音} |`);
  lines.push(`| 旬/空亡 | ${pillar.旬} 空亡${pillar.空亡} |`);
  lines.push(`| 星运 | ${pillar.星运} |`);
  lines.push(`| 自坐 | ${pillar.自坐} |`);
  return lines.join('\n');
}

function formatBaziMd(result: any): string {
  const lines: string[] = [];

  lines.push(`# 八字排盘`);
  lines.push('');
  lines.push(`| 项目 | 值 |`);
  lines.push(`| --- | --- |`);
  lines.push(`| 性别 | ${result.性别} |`);
  lines.push(`| 阳历 | ${result.阳历} |`);
  lines.push(`| 农历 | ${result.农历} |`);
  lines.push(`| 八字 | **${result.八字}** |`);
  lines.push(`| 生肖 | ${result.生肖} |`);
  lines.push(`| 日主 | ${result.日主} |`);
  lines.push(`| 胎元 | ${result.胎元} |`);
  lines.push(`| 胎息 | ${result.胎息} |`);
  lines.push(`| 命宫 | ${result.命宫} |`);
  lines.push(`| 身宫 | ${result.身宫} |`);

  lines.push('');
  lines.push('## 四柱');
  lines.push('');
  lines.push(formatPillar('年柱', result.年柱));
  lines.push('');
  lines.push(formatPillar('月柱', result.月柱));
  lines.push('');
  lines.push(formatPillar('日柱', result.日柱));
  lines.push('');
  lines.push(formatPillar('时柱', result.时柱));

  // 神煞
  lines.push('');
  lines.push('## 神煞');
  lines.push('');
  const shensha = result.神煞;
  for (const pillarName of ['年柱', '月柱', '日柱', '时柱']) {
    const list = shensha[pillarName];
    if (list && list.length > 0) {
      lines.push(`- **${pillarName}**：${list.join('、')}`);
    }
  }

  // 大运
  const dayun = result.大运;
  lines.push('');
  lines.push('## 大运');
  lines.push('');
  lines.push(`起运日期：${dayun.起运日期}，起运年龄：${dayun.起运年龄}岁`);
  lines.push('');
  lines.push('| 大运 | 年龄 | 年份 | 天干十神 | 地支藏干 |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const d of dayun.大运) {
    lines.push(`| ${d.干支} | ${d.开始年龄}-${d.结束年龄} | ${d.开始年份}-${d.结束} | ${d.天干十神} | ${d.地支藏干.join(' ')}(${d.地支十神.join(' ')}) |`);
  }

  // 刑冲合会
  const rel = result.刑冲合会;
  if (rel && Object.keys(rel).length > 0) {
    lines.push('');
    lines.push('## 刑冲合会');
    lines.push('');
    for (const [pillar, ganZhi] of Object.entries(rel) as [string, any][]) {
      for (const [ganOrZhi, relations] of Object.entries(ganZhi) as [string, any][]) {
        if (ganOrZhi === '天干' || ganOrZhi === '地支') {
          for (const [relType, items] of Object.entries(relations) as [string, any][]) {
            if (Array.isArray(items) && items.length > 0) {
              for (const item of items) {
                lines.push(`- ${pillar}柱${ganOrZhi}${relType}${item.柱}柱：${item.知识点}${item.元素 && item.元素 !== relType && item.元素 !== '害' ? '（' + item.元素 + '）' : ''}`);
              }
            }
          }
        } else {
          // 拱等特殊关系，值为单个对象 { 柱, 知识点, ... }
          const item = relations;
          if (item && item.知识点) {
            lines.push(`- ${pillar}柱${ganOrZhi}：${item.知识点}`);
          }
        }
      }
    }
  }

  return lines.join('\n');
}

function formatSolarTimesMd(result: string[], bazi: string): string {
  const lines: string[] = [];
  lines.push(`# 八字反查：${bazi}`);
  lines.push('');
  if (result.length === 0) {
    lines.push('未找到匹配的公历时间。');
  } else {
    lines.push(`共找到 ${result.length} 个匹配时间：`);
    lines.push('');
    for (const time of result) {
      lines.push(`- ${time}`);
    }
  }
  return lines.join('\n');
}

function formatCalendarMd(result: any): string {
  const lines: string[] = [];
  lines.push(`# 黄历 ${result.公历}`);
  lines.push('');
  lines.push(`| 项目 | 值 |`);
  lines.push(`| --- | --- |`);
  lines.push(`| 农历 | ${result.农历} |`);
  lines.push(`| 干支 | ${result.干支} |`);
  lines.push(`| 生肖 | ${result.生肖} |`);
  lines.push(`| 纳音 | ${result.纳音} |`);
  if (result.农历节日) lines.push(`| 农历节日 | ${result.农历节日} |`);
  if (result.公历节日) lines.push(`| 公历节日 | ${result.公历节日} |`);
  lines.push(`| 节气 | ${result.节气} |`);
  lines.push(`| 二十八宿 | ${result.二十八宿} |`);
  lines.push(`| 彭祖百忌 | ${result.彭祖百忌} |`);
  lines.push(`| 冲煞 | ${result.冲煞} |`);
  lines.push('');
  lines.push('## 方位');
  lines.push('');
  lines.push(`| 方位 | 值 |`);
  lines.push(`| --- | --- |`);
  lines.push(`| 喜神 | ${result.喜神方位} |`);
  lines.push(`| 阳贵神 | ${result.阳贵神方位} |`);
  lines.push(`| 阴贵神 | ${result.阴贵神方位} |`);
  lines.push(`| 福神 | ${result.福神方位} |`);
  lines.push(`| 财神 | ${result.财神方位} |`);
  lines.push('');
  lines.push(`## 宜忌`);
  lines.push('');
  lines.push(`- **宜**：${result.宜}`);
  lines.push(`- **忌**：${result.忌}`);
  return lines.join('\n');
}

function output(result: any, format: OutputFormat, mdFormatter: () => string) {
  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(mdFormatter());
  }
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  const subcommand = args[0];

  if (!subcommand || subcommand === '--help' || subcommand === '-h') {
    console.log(HELP);
    process.exit(0);
  }

  const subArgs = args.slice(1);

  switch (subcommand) {
    case 'paipan': {
      const { values } = parseArgs({
        args: subArgs,
        options: {
          solar: { type: 'string', short: 's' },
          lunar: { type: 'string', short: 'l' },
          gender: { type: 'string', short: 'g' },
          sect: { type: 'string' },
          output: outputOption,
        },
        strict: true,
      });

      const format = getOutputFormat(values.output);

      if (!values.solar && !values.lunar) {
        console.error('错误：必须指定 --solar 或 --lunar 其中一个。');
        process.exit(1);
      }
      if (values.solar && values.lunar) {
        console.error('错误：--solar 和 --lunar 只能指定其中一个。');
        process.exit(1);
      }

      const gender = values.gender !== undefined ? Number(values.gender) : 1;
      const sect = values.sect !== undefined ? Number(values.sect) : 2;

      if (![0, 1].includes(gender)) {
        console.error('错误：--gender 只能为 0（女）或 1（男）。');
        process.exit(1);
      }
      if (![1, 2].includes(sect)) {
        console.error('错误：--sect 只能为 1 或 2。');
        process.exit(1);
      }

      const result = await getBaziDetail({
        solarDatetime: values.solar,
        lunarDatetime: values.lunar,
        gender: gender as 0 | 1,
        eightCharProviderSect: sect as 1 | 2,
      });
      output(result, format, () => formatBaziMd(result));
      break;
    }

    case 'fan': {
      const { values } = parseArgs({
        args: subArgs,
        options: {
          bazi: { type: 'string', short: 'b' },
          output: outputOption,
        },
        strict: true,
      });

      const format = getOutputFormat(values.output);

      if (!values.bazi) {
        console.error('错误：必须指定 --bazi 参数。例如：--bazi "戊寅 己未 己卯 辛未"');
        process.exit(1);
      }

      const result = await getSolarTimes({ bazi: values.bazi });
      output(result, format, () => formatSolarTimesMd(result as string[], values.bazi!));
      break;
    }

    case 'calendar': {
      const { values } = parseArgs({
        args: subArgs,
        options: {
          solar: { type: 'string', short: 's' },
          output: outputOption,
        },
        strict: true,
      });

      const format = getOutputFormat(values.output);

      const result = getChineseCalendar(values.solar);
      output(result, format, () => formatCalendarMd(result));
      break;
    }

    default:
      console.error(`未知子命令: ${subcommand}`);
      console.log('\n' + HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('错误：', err.message);
  process.exit(1);
});
