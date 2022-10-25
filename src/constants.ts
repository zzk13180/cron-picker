/**
 * Cron Picker 常量配置
 */

import type { CronFieldConfig, CronFieldType, CronMode } from './types'

/** 字段配置列表 */
export const CRON_FIELDS: CronFieldConfig[] = [
  { label: '秒', min: 0, max: 59, type: 'second' },
  { label: '分', min: 0, max: 59, type: 'minute' },
  { label: '时', min: 0, max: 23, type: 'hour' },
  { label: '日', min: 1, max: 31, type: 'day' },
  { label: '月', min: 1, max: 12, type: 'month' },
  { label: '周', min: 0, max: 6, type: 'weekday' },
]

/** 星期标签 */
export const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const

/** 月份标签 */
export const MONTH_LABELS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
] as const

/** 模式基础标签 */
export const MODE_LABELS: Record<CronMode, string> = {
  every: '每',
  interval: '间隔',
  range: '范围',
  specific: '指定',
}

/** 字段对应的「每」模式标签 */
export const EVERY_MODE_LABELS: Record<CronFieldType, string> = {
  second: '每秒',
  minute: '每分',
  hour: '每时',
  day: '每日',
  month: '每月',
  weekday: '每周',
}

/** 获取模式标签（根据字段类型动态显示） */
export const getModeLabel = (mode: CronMode, fieldType: CronFieldType): string => {
  if (mode === 'every') {
    return EVERY_MODE_LABELS[fieldType]
  }
  return MODE_LABELS[mode]
}

/** 所有可用模式 */
export const AVAILABLE_MODES: CronMode[] = ['every', 'interval', 'range', 'specific']

/** 默认 Cron 表达式 */
export const DEFAULT_CRON_EXPRESSION = '* * * * * *'

/** 默认简易模式时间 */
export const DEFAULT_SIMPLE_TIME = '08:00'
