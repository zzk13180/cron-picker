/**
 * Cron Picker 类型定义
 */

/** 字段类型 */
export type CronFieldType = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'weekday'

/** 模式类型 */
export type CronMode = 'every' | 'specific' | 'range' | 'interval'

/** UI 模式类型 */
export type UIMode = 'simple' | 'advanced'

/** 重复类型 */
export type RepeatType = 'once' | 'daily' | 'weekdays' | 'weekends' | 'custom'

/** 字段配置 */
export interface CronFieldConfig {
  label: string
  min: number
  max: number
  type: CronFieldType
}

/** 字段状态 */
export interface CronFieldState {
  mode: CronMode
  values: number[]
  rangeStart: number
  rangeEnd: number
  intervalStart: number
  intervalStep: number
}

/** change 事件详情 */
export interface CronChangeEventDetail {
  value: string
  field: CronFieldType
  states: Record<CronFieldType, CronFieldState>
}

/** 所有字段状态类型 */
export type CronStates = Record<CronFieldType, CronFieldState>
