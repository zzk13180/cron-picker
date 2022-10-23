import { LitElement, TemplateResult } from 'lit'

// ==================== 类型定义 ====================

/** 字段类型 */
export type CronFieldType = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'weekday'

/** 模式类型 */
export type CronMode = 'every' | 'specific' | 'range' | 'interval'

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
  /** 当前 Cron 表达式 */
  value: string
  /** 当前激活的字段 */
  field: CronFieldType
  /** 所有字段状态 */
  states: Record<CronFieldType, CronFieldState>
}

// ==================== 常量导出 ====================

/** 字段配置列表 */
export declare const CRON_FIELDS: CronFieldConfig[]

/** 星期标签 */
export declare const WEEKDAY_LABELS: string[]

/** 月份标签 */
export declare const MONTH_LABELS: string[]

/** 模式标签 */
export declare const MODE_LABELS: Record<CronMode, string>

// ==================== 组件定义 ====================

/**
 * CronPicker - Cron 表达式选择器
 *
 * 一个用于生成 Cron 表达式的 Web Component，支持无头模式。
 *
 * @element cron-picker
 *
 * @prop {string} value - Cron 表达式（6段式：秒 分 时 日 月 周）
 * @prop {boolean} headless - 无头模式，禁用默认样式
 * @prop {boolean} hide-expression - 隐藏表达式展示区
 * @prop {boolean} hide-tabs - 隐藏标签页
 * @prop {boolean} hide-actions - 隐藏快捷操作按钮
 * @prop {boolean} disabled - 禁用状态
 *
 * @fires {CustomEvent<CronChangeEventDetail>} change - 表达式变化时触发
 * @fires {CustomEvent<{field: CronFieldType}>} field-change - 切换字段时触发
 *
 * @csspart container - 容器
 * @csspart expression - 表达式展示区
 * @csspart segment - 表达式段
 * @csspart tabs - 标签页容器
 * @csspart tab - 标签页按钮
 * @csspart panel - 面板区域
 * @csspart modes - 模式选择容器
 * @csspart mode-btn - 模式按钮
 * @csspart options - 选项容器
 * @csspart input - 输入框
 * @csspart grid - 值选择网格
 * @csspart cell - 值选择单元格
 * @csspart cell-label - 值选择标签
 * @csspart actions - 快捷操作容器
 * @csspart action-btn - 快捷操作按钮
 *
 * @cssprop --cron-primary - 主题色
 * @cssprop --cron-primary-hover - 主题色悬停
 * @cssprop --cron-primary-bg - 主题色背景
 * @cssprop --cron-text - 文本色
 * @cssprop --cron-text-secondary - 次要文本色
 * @cssprop --cron-text-muted - 弱化文本色
 * @cssprop --cron-bg - 背景色
 * @cssprop --cron-bg-secondary - 次要背景色
 * @cssprop --cron-bg-active - 激活背景色
 * @cssprop --cron-border - 边框色
 * @cssprop --cron-border-active - 激活边框色
 * @cssprop --cron-radius - 圆角
 * @cssprop --cron-radius-sm - 小圆角
 * @cssprop --cron-gap - 间距
 * @cssprop --cron-padding - 内边距
 * @cssprop --cron-transition - 过渡动画
 *
 * @example
 * ```html
 * <!-- 基础用法 -->
 * <cron-picker value="0 0 12 * * *"></cron-picker>
 *
 * <!-- 无头模式 -->
 * <cron-picker headless value="* * * * * *"></cron-picker>
 *
 * <!-- 自定义样式 -->
 * <style>
 *   cron-picker {
 *     --cron-primary: #10b981;
 *   }
 *   cron-picker::part(container) {
 *     border-radius: 16px;
 *   }
 * </style>
 *
 * <!-- 监听事件 -->
 * <script>
 *   document.querySelector('cron-picker').addEventListener('change', (e) => {
 *     console.log('表达式:', e.detail.value);
 *     console.log('字段:', e.detail.field);
 *     console.log('状态:', e.detail.states);
 *   });
 * </script>
 * ```
 */
export declare class CronPicker extends LitElement {
  /** Cron 表达式（6段式：秒 分 时 日 月 周） */
  value: string

  /** 无头模式，禁用默认样式 */
  headless: boolean

  /** 隐藏表达式展示区 */
  hideExpression: boolean

  /** 隐藏标签页 */
  hideTabs: boolean

  /** 隐藏快捷操作按钮 */
  hideActions: boolean

  /** 禁用状态 */
  disabled: boolean

  /** 当前激活的字段 */
  activeField: CronFieldType

  /** 所有字段状态（只读） */
  readonly states: Record<CronFieldType, CronFieldState>

  /** 字段配置（只读） */
  readonly fields: CronFieldConfig[]

  /** 设置字段模式 */
  setFieldMode(field: CronFieldType, mode: CronMode): void

  /** 设置字段值 */
  setFieldValues(field: CronFieldType, values: number[]): void

  /** 设置字段范围 */
  setFieldRange(field: CronFieldType, start: number, end: number): void

  /** 设置字段间隔 */
  setFieldInterval(field: CronFieldType, start: number, step: number): void

  /** 重置为默认值 */
  reset(): void

  /** 解析表达式 */
  parse(expression: string): void

  /** 生成表达式 */
  generate(): string

  /** 获取值标签 */
  getValueLabel(field: CronFieldType, value: number): string

  render(): TemplateResult<1>
}

declare global {
  interface HTMLElementTagNameMap {
    'cron-picker': CronPicker
  }
}
