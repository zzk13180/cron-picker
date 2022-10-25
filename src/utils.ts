/**
 * Cron Picker 工具函数
 */

import type { CronFieldType, CronFieldState, CronStates, CronFieldConfig } from './types'
import { CRON_FIELDS, WEEKDAY_LABELS, MONTH_LABELS } from './constants'

/**
 * 创建初始字段状态
 */
export function createInitialStates(): CronStates {
  return {
    second: { mode: 'every', values: [], rangeStart: 0, rangeEnd: 59, intervalStart: 0, intervalStep: 1 },
    minute: { mode: 'every', values: [], rangeStart: 0, rangeEnd: 59, intervalStart: 0, intervalStep: 1 },
    hour: { mode: 'every', values: [], rangeStart: 0, rangeEnd: 23, intervalStart: 0, intervalStep: 1 },
    day: { mode: 'every', values: [], rangeStart: 1, rangeEnd: 31, intervalStart: 1, intervalStep: 1 },
    month: { mode: 'every', values: [], rangeStart: 1, rangeEnd: 12, intervalStart: 1, intervalStep: 1 },
    weekday: { mode: 'every', values: [], rangeStart: 0, rangeEnd: 6, intervalStart: 0, intervalStep: 1 },
  }
}

/**
 * 解析 Cron 表达式为状态对象
 */
export function parseCronExpression(cron: string, currentStates: CronStates): CronStates {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 6) return currentStates

  const fields: CronFieldType[] = ['second', 'minute', 'hour', 'day', 'month', 'weekday']
  const newStates = { ...currentStates }

  for (let i = 0; i < 6; i++) {
    const part = parts[i] as string
    const field = fields[i] as CronFieldType
    const config = CRON_FIELDS[i] as CronFieldConfig
    const state: CronFieldState = { ...newStates[field] }

    if (part === '*') {
      state.mode = 'every'
      state.values = []
    } else if (part.includes('/')) {
      state.mode = 'interval'
      const [startPart, stepPart] = part.split('/')
      state.intervalStart = startPart === '*' ? config.min : parseInt(startPart || '0', 10)
      state.intervalStep = parseInt(stepPart || '1', 10) || 1
    } else if (part.includes('-') && !part.includes(',')) {
      state.mode = 'range'
      const [startPart, endPart] = part.split('-')
      state.rangeStart = parseInt(startPart || String(config.min), 10)
      state.rangeEnd = parseInt(endPart || String(config.max), 10)
    } else {
      state.mode = 'specific'
      state.values = part.split(',').map(v => parseInt(v, 10)).filter(v => !isNaN(v))
    }

    newStates[field] = state
  }

  return newStates
}

/**
 * 从状态生成 Cron 表达式
 */
export function generateCronExpression(states: CronStates): string {
  const fields: CronFieldType[] = ['second', 'minute', 'hour', 'day', 'month', 'weekday']

  return fields.map((field, i) => {
    const state = states[field]
    const config = CRON_FIELDS[i] as CronFieldConfig

    switch (state.mode) {
      case 'every':
        return '*'
      case 'specific':
        return state.values.length > 0
          ? [...state.values].sort((a, b) => a - b).join(',')
          : '*'
      case 'range':
        return `${state.rangeStart}-${state.rangeEnd}`
      case 'interval':
        return state.intervalStart === config.min
          ? `*/${state.intervalStep}`
          : `${state.intervalStart}/${state.intervalStep}`
      default:
        return '*'
    }
  }).join(' ')
}

/**
 * 获取字段值的显示标签
 */
export function getValueLabel(field: CronFieldType, value: number): string {
  if (field === 'weekday') return WEEKDAY_LABELS[value] || String(value)
  if (field === 'month') return MONTH_LABELS[value - 1] || String(value)
  return String(value).padStart(2, '0')
}

/**
 * 获取字段的网格列数类名
 */
export function getGridColsClass(field: CronFieldType): string {
  switch (field) {
    case 'weekday': return 'cols-7'
    case 'month': return 'cols-6'
    case 'hour': return 'cols-6'
    case 'day': return 'cols-7'
    default: return 'cols-10'
  }
}

/**
 * 获取字段配置
 */
export function getFieldConfig(field: CronFieldType): CronFieldConfig {
  return CRON_FIELDS.find(f => f.type === field)!
}

/**
 * 生成数值范围数组
 */
export function generateRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// ==================== 时间转换工具 ====================

/**
 * 24小时制转12小时制显示值
 */
export function to12Hour(hour24: number): number {
  if (hour24 === 0) return 12
  if (hour24 > 12) return hour24 - 12
  return hour24
}

/**
 * 判断是否为下午
 */
export function isPM(hour24: number): boolean {
  return hour24 >= 12
}

/**
 * 12小时制转24小时制
 */
export function to24Hour(hour12: number, isPM: boolean): number {
  if (hour12 === 12) {
    return isPM ? 12 : 0
  }
  return isPM ? hour12 + 12 : hour12
}

/**
 * 解析时间字符串 "HH:mm"
 */
export function parseTimeString(time: string): { hour: number; minute: number } {
  const [hourStr, minuteStr] = time.split(':')
  return {
    hour: parseInt(hourStr || '0', 10),
    minute: parseInt(minuteStr || '0', 10),
  }
}

/**
 * 格式化时间为字符串 "HH:mm"
 */
export function formatTimeString(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}
