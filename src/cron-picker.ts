/**
 * Cron Picker Web Component
 * 基于 Lit 的 Cron 表达式选择器
 */

import { LitElement, html, PropertyValues, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

// 类型导入
import type {
  CronFieldType,
  CronMode,
  UIMode,
  RepeatType,
  CronFieldConfig,
  CronChangeEventDetail,
  CronStates,
} from './types'

// 常量导入
import {
  CRON_FIELDS,
  WEEKDAY_LABELS,
  MONTH_LABELS,
  AVAILABLE_MODES,
  DEFAULT_CRON_EXPRESSION,
  DEFAULT_SIMPLE_TIME,
  getModeLabel,
} from './constants'

// 样式导入
import { allStyles } from './styles'

// 工具函数导入
import {
  createInitialStates,
  parseCronExpression,
  generateCronExpression,
  getValueLabel,
  getGridColsClass,
  getFieldConfig,
  generateRange,
  to12Hour,
  isPM,
  to24Hour,
  parseTimeString,
  formatTimeString,
} from './utils'

// ==================== 图标模板 ====================

const icons = {
  settings: html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>`,
  clock: html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`,
  daily: html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`,
  work: html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>`,
  weekend: html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
  calendar: html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5z"/></svg>`,
}

// ==================== 组件定义 ====================

@customElement('cron-picker')
export class CronPicker extends LitElement {
  static override styles = allStyles

  // ====== 公开属性 ======

  /** Cron 表达式（6段式：秒 分 时 日 月 周） */
  @property({ type: String, reflect: true })
  value = DEFAULT_CRON_EXPRESSION

  /** 无头模式：禁用默认样式 */
  @property({ type: Boolean, reflect: true })
  headless = false

  /** 隐藏表达式展示区 */
  @property({ type: Boolean, attribute: 'hide-expression' })
  hideExpression = false

  /** 隐藏标签页 */
  @property({ type: Boolean, attribute: 'hide-tabs' })
  hideTabs = false

  /** 隐藏快捷操作按钮 */
  @property({ type: Boolean, attribute: 'hide-actions' })
  hideActions = false

  /** 禁用状态 */
  @property({ type: Boolean, reflect: true })
  disabled = false

  /** UI 模式：简易或高级 */
  @property({ type: String, reflect: true })
  mode: UIMode = 'simple'

  // ====== 内部状态 ======

  @state() private _activeField: CronFieldType = 'second'
  @state() private _states: CronStates = createInitialStates()
  @state() private _simpleTime = DEFAULT_SIMPLE_TIME
  @state() private _repeatType: RepeatType = 'daily'
  @state() private _customWeekdays: number[] = []

  // ====== 公开访问器 ======

  get activeField(): CronFieldType {
    return this._activeField
  }

  set activeField(field: CronFieldType) {
    this._activeField = field
    this.requestUpdate()
  }

  get states(): CronStates {
    return { ...this._states }
  }

  get fields(): CronFieldConfig[] {
    return [...CRON_FIELDS]
  }

  // ====== 生命周期 ======

  override connectedCallback() {
    super.connectedCallback()
    this._parseExpression(this.value)
  }

  override updated(changed: PropertyValues) {
    if (changed.has('value') && changed.get('value') !== undefined) {
      this._parseExpression(this.value)
    }
  }

  // ====== 公开 API 方法 ======

  /** 设置字段模式 */
  setFieldMode(field: CronFieldType, mode: CronMode): void {
    this._states = { ...this._states, [field]: { ...this._states[field], mode } }
    this._emitChange()
  }

  /** 设置字段值 */
  setFieldValues(field: CronFieldType, values: number[]): void {
    this._states = { ...this._states, [field]: { ...this._states[field], values: [...values] } }
    this._emitChange()
  }

  /** 设置字段范围 */
  setFieldRange(field: CronFieldType, start: number, end: number): void {
    this._states = { ...this._states, [field]: { ...this._states[field], rangeStart: start, rangeEnd: end } }
    this._emitChange()
  }

  /** 设置字段间隔 */
  setFieldInterval(field: CronFieldType, start: number, step: number): void {
    this._states = { ...this._states, [field]: { ...this._states[field], intervalStart: start, intervalStep: step } }
    this._emitChange()
  }

  /** 重置为默认值 */
  reset(): void {
    this._states = createInitialStates()
    this.value = DEFAULT_CRON_EXPRESSION
    this._emitChange()
  }

  /** 解析表达式 */
  parse(expression: string): void {
    this._parseExpression(expression)
    this.value = expression
  }

  /** 生成表达式 */
  generate(): string {
    return generateCronExpression(this._states)
  }

  /** 获取值标签 */
  getValueLabel(field: CronFieldType, value: number): string {
    return getValueLabel(field, value)
  }

  /** 获取描述文本 */
  getDescription(): string {
    return this._buildDescription()
  }

  // ====== 私有方法 ======

  private _parseExpression(cron: string): void {
    this._states = parseCronExpression(cron, this._states)
  }

  private _emitChange(): void {
    const newValue = generateCronExpression(this._states)
    if (newValue !== this.value) {
      this.value = newValue
    }
    this.dispatchEvent(new CustomEvent<CronChangeEventDetail>('change', {
      detail: { value: this.value, field: this._activeField, states: { ...this._states } },
      bubbles: true,
      composed: true,
    }))
  }

  private _buildDescription(): string {
    const parts = this.value.split(' ')
    if (parts.length !== 6) return '无效的 Cron 表达式'

    if (this.mode === 'simple') {
      return this._buildSimpleDescription()
    }

    return this._buildAdvancedDescription(parts)
  }

  private _buildSimpleDescription(): string {
    const { hour, minute } = parseTimeString(this._simpleTime)
    const hour12 = to12Hour(hour)
    const period = isPM(hour) ? 'PM' : 'AM'
    const timeStr = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`

    switch (this._repeatType) {
      case 'once': return `仅执行一次，时间：${timeStr}`
      case 'daily': return `每天 ${timeStr} 触发`
      case 'weekdays': return `工作日（周一至周五）${timeStr} 触发`
      case 'weekends': return `周末（周六、周日）${timeStr} 触发`
      case 'custom':
        if (this._customWeekdays.length === 0) return `每天 ${timeStr} 触发`
        const days = this._customWeekdays.map(d => `周${WEEKDAY_LABELS[d]}`).join('、')
        return `每周 ${days} 的 ${timeStr} 触发`
      default: return `每天 ${timeStr} 触发`
    }
  }

  private _buildAdvancedDescription(parts: string[]): string {
    const [second = '*', minute = '*', hour = '*', day = '*', month = '*', weekday = '*'] = parts
    let desc = ''

    // 时间部分
    if (hour === '*' && minute === '*' && second === '*') {
      desc = '每秒触发'
    } else if (hour === '*' && minute === '*') {
      desc = `每分钟的第 ${second} 秒触发`
    } else if (hour === '*') {
      desc = `每小时的 ${minute} 分 ${second !== '0' ? second + ' 秒' : ''} 触发`.trim()
    } else {
      const hourStr = hour === '*' ? '每小时' : hour.includes(',') ? `${hour} 时` : `${hour} 点`
      const minStr = minute === '*' ? '每分' : `${minute} 分`
      const secStr = second === '0' || second === '*' ? '' : ` ${second} 秒`
      desc = `${hourStr} ${minStr}${secStr}`.trim()
    }

    // 日期部分
    if (weekday !== '*') {
      const days = weekday.split(',').map(d => `周${WEEKDAY_LABELS[parseInt(d)]}`).join('、')
      desc = `每周 ${days} 的 ${desc}`
    } else if (day !== '*') {
      desc = `每月第 ${day} 天的 ${desc}`
    } else {
      desc = `每天 ${desc}`
    }

    // 月份部分
    if (month !== '*') {
      const months = month.split(',').map((m: string) => MONTH_LABELS[parseInt(m) - 1]).join('、')
      desc = `${months}的 ${desc}`
    }

    return desc
  }

  // ====== 事件处理器 ======

  private _handleFieldClick(field: CronFieldType): void {
    if (this.disabled) return
    this._activeField = field
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { field },
      bubbles: true,
      composed: true,
    }))
  }

  private _handleModeChange(mode: CronMode): void {
    if (this.disabled) return
    this.setFieldMode(this._activeField, mode)
  }

  private _handleValueToggle(value: number): void {
    if (this.disabled) return
    const state = this._states[this._activeField]
    const values = state.values.includes(value)
      ? state.values.filter(v => v !== value)
      : [...state.values, value]
    this.setFieldValues(this._activeField, values)
  }

  private _handleRangeInput(type: 'start' | 'end', e: Event): void {
    if (this.disabled) return
    const val = parseInt((e.target as HTMLInputElement).value, 10)
    if (isNaN(val)) return
    const state = this._states[this._activeField]
    if (type === 'start') {
      this.setFieldRange(this._activeField, val, state.rangeEnd)
    } else {
      this.setFieldRange(this._activeField, state.rangeStart, val)
    }
  }

  private _handleIntervalInput(type: 'start' | 'step', e: Event): void {
    if (this.disabled) return
    const val = parseInt((e.target as HTMLInputElement).value, 10)
    if (isNaN(val)) return
    const state = this._states[this._activeField]
    if (type === 'start') {
      this.setFieldInterval(this._activeField, val, state.intervalStep)
    } else if (val > 0) {
      this.setFieldInterval(this._activeField, state.intervalStart, val)
    }
  }

  private _handleSelectAll(): void {
    if (this.disabled) return
    const config = getFieldConfig(this._activeField)
    const values = generateRange(config.min, config.max)
    this.setFieldValues(this._activeField, values)
  }

  private _handleClearAll(): void {
    if (this.disabled) return
    this.setFieldValues(this._activeField, [])
  }

  private _handleHourChange(e: Event): void {
    if (this.disabled) return
    const hour12 = parseInt((e.target as HTMLSelectElement).value, 10)
    const { hour, minute } = parseTimeString(this._simpleTime)
    const hour24 = to24Hour(hour12, isPM(hour))
    this._simpleTime = formatTimeString(hour24, minute)
    this._updateFromSimpleMode()
  }

  private _handleMinuteChange(e: Event): void {
    if (this.disabled) return
    const minute = parseInt((e.target as HTMLSelectElement).value, 10)
    const { hour } = parseTimeString(this._simpleTime)
    this._simpleTime = formatTimeString(hour, minute)
    this._updateFromSimpleMode()
  }

  private _handlePeriodChange(e: Event): void {
    if (this.disabled) return
    const newIsPM = (e.target as HTMLSelectElement).value === 'PM'
    const { hour, minute } = parseTimeString(this._simpleTime)
    const currentIsPM = isPM(hour)

    if (newIsPM !== currentIsPM) {
      const newHour = newIsPM ? (hour < 12 ? hour + 12 : hour) : (hour >= 12 ? hour - 12 : hour)
      this._simpleTime = formatTimeString(newHour, minute)
      this._updateFromSimpleMode()
    }
  }

  private _handleWeekdayToggle(day: number): void {
    if (this.disabled) return
    this._customWeekdays = this._customWeekdays.includes(day)
      ? this._customWeekdays.filter(d => d !== day)
      : [...this._customWeekdays, day]
    this._updateFromSimpleMode()
  }

  private _handlePresetChange(type: RepeatType): void {
    if (this.disabled) return
    this._repeatType = type
    if (type === 'custom' && this._customWeekdays.length === 0) {
      this._customWeekdays = [1, 2, 3, 4, 5]
    }
    this._updateFromSimpleMode()
  }

  private _updateFromSimpleMode(): void {
    const { hour, minute } = parseTimeString(this._simpleTime)
    const baseStates = createInitialStates()

    // 设置时间字段
    baseStates.second = { ...baseStates.second, mode: 'specific', values: [0] }
    baseStates.minute = { ...baseStates.minute, mode: 'specific', values: [minute] }
    baseStates.hour = { ...baseStates.hour, mode: 'specific', values: [hour] }

    // 根据重复类型设置周字段
    const weekdayMap: Record<RepeatType, number[]> = {
      once: [],
      daily: [],
      weekdays: [1, 2, 3, 4, 5],
      weekends: [0, 6],
      custom: this._customWeekdays,
    }
    const weekdayValues = weekdayMap[this._repeatType]
    if (weekdayValues.length > 0) {
      baseStates.weekday = { ...baseStates.weekday, mode: 'specific', values: weekdayValues }
    }

    this._states = baseStates
    this._emitChange()
  }

  // ====== 渲染方法 ======

  override render() {
    return html`
      <div class="container" part="container">
        ${this.mode === 'simple' ? this._renderSimpleMode() : this._renderAdvancedMode()}
      </div>
    `
  }

  private _renderSimpleMode() {
    return html`
      <div class="simple-mode" part="simple-mode">
        ${this._renderStatusBar()}
        <div class="simple-content" part="simple-content">
          ${this._renderLivePreview()}
          ${this._renderTimePicker()}
          ${this._renderPresets()}
          ${this._repeatType === 'custom' ? this._renderWeekdaySelector() : nothing}
        </div>
      </div>
    `
  }

  private _renderStatusBar() {
    return html`
      <div class="status-bar" part="status-bar">
        <div class="status-info">
          <span class="status-label">Cron 表达式</span>
          <span class="status-value">${this.value}</span>
        </div>
        <button
          class="mode-toggle"
          part="mode-toggle"
          ?disabled=${this.disabled}
          @click=${() => this.mode = 'advanced'}
        >
          ${icons.settings}
          高级模式
        </button>
      </div>
    `
  }

  private _renderLivePreview() {
    return html`
      <div class="live-preview" part="live-preview">
        <p class="preview-description">${this._getFormattedDescription()}</p>
      </div>
    `
  }

  private _getFormattedDescription() {
    const { hour, minute } = parseTimeString(this._simpleTime)
    const hour12 = to12Hour(hour)
    const period = isPM(hour) ? 'PM' : 'AM'
    const timeStr = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`

    switch (this._repeatType) {
      case 'once':
        return html`将在 <strong>${timeStr}</strong> 执行一次`
      case 'daily':
        return html`每天 <strong>${timeStr}</strong> 自动执行`
      case 'weekdays':
        return html`工作日 <strong>${timeStr}</strong> 自动执行`
      case 'weekends':
        return html`周末 <strong>${timeStr}</strong> 自动执行`
      case 'custom':
        if (this._customWeekdays.length === 0) {
          return html`请选择要执行的星期`
        }
        const sortedDays = [...this._customWeekdays].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b))
        const days = sortedDays.map(d => `周${WEEKDAY_LABELS[d]}`).join('、')
        return html`每周 <strong>${days}</strong> 的 <strong>${timeStr}</strong> 执行`
      default:
        return html`每天 <strong>${timeStr}</strong> 自动执行`
    }
  }

  private _renderTimePicker() {
    const { hour, minute } = parseTimeString(this._simpleTime)
    const currentHour12 = to12Hour(hour)
    const currentIsPM = isPM(hour)

    return html`
      <div class="time-section" part="time-section">
        <div class="time-picker-container" part="time-picker-container">
          <!-- 时 -->
          <div class="time-select-group">
            <span class="time-select-label">时</span>
            <div class="time-select">
              <select ?disabled=${this.disabled} @change=${this._handleHourChange}>
                ${generateRange(1, 12).map(h => html`
                  <option value="${h}" ?selected=${currentHour12 === h}>${h.toString().padStart(2, '0')}</option>
                `)}
              </select>
            </div>
          </div>
          
          <span class="time-separator">:</span>
          
          <!-- 分 -->
          <div class="time-select-group">
            <span class="time-select-label">分</span>
            <div class="time-select">
              <select ?disabled=${this.disabled} @change=${this._handleMinuteChange}>
                ${generateRange(0, 59).map(m => html`
                  <option value="${m}" ?selected=${minute === m}>${m.toString().padStart(2, '0')}</option>
                `)}
              </select>
            </div>
          </div>
          
          <!-- AM/PM -->
          <div class="time-select-group">
            <span class="time-select-label">时段</span>
            <div class="time-select period">
              <select ?disabled=${this.disabled} @change=${this._handlePeriodChange}>
                <option value="AM" ?selected=${!currentIsPM}>AM</option>
                <option value="PM" ?selected=${currentIsPM}>PM</option>
              </select>
            </div>
          </div>
        </div>
        <div class="time-edit-hint">
          ${icons.clock}
          选择执行时间
        </div>
      </div>
    `
  }

  private _renderPresets() {
    const presets: Array<{ type: RepeatType; label: string; icon: ReturnType<typeof html> }> = [
      { type: 'daily', label: '每天', icon: icons.daily },
      { type: 'weekdays', label: '工作日', icon: icons.work },
      { type: 'weekends', label: '周末', icon: icons.weekend },
      { type: 'custom', label: '自定义', icon: icons.calendar },
    ]

    return html`
      <div class="preset-section" part="preset-section">
        <span class="section-label">重复频率</span>
        <div class="preset-chips" part="preset-chips">
          ${presets.map(({ type, label, icon }) => html`
            <button
              class=${classMap({ 'preset-chip': true, active: this._repeatType === type })}
              ?disabled=${this.disabled}
              @click=${() => this._handlePresetChange(type)}
            >
              ${icon}
              ${label}
            </button>
          `)}
        </div>
      </div>
    `
  }

  private _renderWeekdaySelector() {
    const weekdayOrder = [1, 2, 3, 4, 5, 6, 0] // 周一到周日

    return html`
      <div class="weekday-section" part="weekday-section">
        <span class="section-label">选择星期</span>
        <div class="weekday-grid" part="weekday-grid">
          ${weekdayOrder.map(day => {
            const isSelected = this._customWeekdays.includes(day)
            return html`
              <div
                class=${classMap({ 'weekday-item': true, selected: isSelected })}
                part="weekday-item"
                @click=${() => this._handleWeekdayToggle(day)}
              >
                <input
                  type="checkbox"
                  .checked=${isSelected}
                  ?disabled=${this.disabled}
                  @change=${(e: Event) => e.stopPropagation()}
                />
                <span class="weekday-name">${WEEKDAY_LABELS[day]}</span>
              </div>
            `
          })}
        </div>
      </div>
    `
  }

  private _renderAdvancedMode() {
    return html`
      ${this._renderAdvancedHeader()}
      ${this._renderExpression()}
      ${this._renderTabs()}
      <div class="panel" part="panel">
        ${this._renderModes()}
        ${this._renderModeContent()}
      </div>
    `
  }

  private _renderAdvancedHeader() {
    return html`
      <div class="advanced-header" part="advanced-header">
        <h2 class="simple-title">高级配置</h2>
        <button
          class="mode-toggle"
          part="mode-toggle"
          ?disabled=${this.disabled}
          @click=${() => this.mode = 'simple'}
        >
          ${icons.clock}
          返回简易模式
        </button>
      </div>
    `
  }

  private _renderExpression() {
    if (this.hideExpression) return nothing

    const fields: CronFieldType[] = ['second', 'minute', 'hour', 'day', 'month', 'weekday']
    const parts = this.value.split(' ')

    return html`
      <div class="expression" part="expression">
        ${parts.map((part, i) => {
          const field = fields[i]
          const config = CRON_FIELDS[i]
          return html`
            <span
              class=${classMap({ segment: true, active: this._activeField === field })}
              part="segment"
              title=${config?.label || ''}
              @click=${() => field && this._handleFieldClick(field)}
            >${part}</span>
          `
        })}
      </div>
    `
  }

  private _renderTabs() {
    if (this.hideTabs) return nothing

    return html`
      <div class="tabs" part="tabs">
        ${CRON_FIELDS.map(f => html`
          <button
            class=${classMap({ tab: true, active: this._activeField === f.type })}
            part="tab"
            ?disabled=${this.disabled}
            @click=${() => this._handleFieldClick(f.type)}
          >${f.label}</button>
        `)}
      </div>
    `
  }

  private _renderModes() {
    const currentMode = this._states[this._activeField].mode

    return html`
      <div class="modes" part="modes">
        ${AVAILABLE_MODES.map(mode => html`
          <button
            class=${classMap({ 'mode-btn': true, active: currentMode === mode })}
            part="mode-btn"
            ?disabled=${this.disabled}
            @click=${() => this._handleModeChange(mode)}
          >${getModeLabel(mode, this._activeField)}</button>
        `)}
      </div>
    `
  }

  private _renderModeContent() {
    const mode = this._states[this._activeField].mode
    const renderers: Record<CronMode, () => ReturnType<typeof html>> = {
      every: () => this._renderEveryOptions(),
      interval: () => this._renderIntervalOptions(),
      range: () => this._renderRangeOptions(),
      specific: () => this._renderSpecificOptions(),
    }
    return renderers[mode]?.() ?? nothing
  }

  private _renderEveryOptions() {
    const config = getFieldConfig(this._activeField)
    return html`
      <div class="options" part="options">
        <div class="option-row">每${config.label}执行</div>
      </div>
    `
  }

  private _renderIntervalOptions() {
    const config = getFieldConfig(this._activeField)
    const state = this._states[this._activeField]

    return html`
      <div class="options" part="options">
        <div class="option-row">
          <span>从</span>
          <input
            type="number"
            class="input"
            part="input"
            .value=${String(state.intervalStart)}
            min=${config.min}
            max=${config.max}
            ?disabled=${this.disabled}
            @input=${(e: Event) => this._handleIntervalInput('start', e)}
          />
          <span>${config.label}开始，每</span>
          <input
            type="number"
            class="input"
            part="input"
            .value=${String(state.intervalStep)}
            min="1"
            ?disabled=${this.disabled}
            @input=${(e: Event) => this._handleIntervalInput('step', e)}
          />
          <span>${config.label}执行</span>
        </div>
      </div>
    `
  }

  private _renderRangeOptions() {
    const config = getFieldConfig(this._activeField)
    const state = this._states[this._activeField]

    return html`
      <div class="options" part="options">
        <div class="option-row">
          <span>从</span>
          <input
            type="number"
            class="input"
            part="input"
            .value=${String(state.rangeStart)}
            min=${config.min}
            max=${config.max}
            ?disabled=${this.disabled}
            @input=${(e: Event) => this._handleRangeInput('start', e)}
          />
          <span>到</span>
          <input
            type="number"
            class="input"
            part="input"
            .value=${String(state.rangeEnd)}
            min=${config.min}
            max=${config.max}
            ?disabled=${this.disabled}
            @input=${(e: Event) => this._handleRangeInput('end', e)}
          />
          <span>${config.label}</span>
        </div>
      </div>
    `
  }

  private _renderSpecificOptions() {
    const config = getFieldConfig(this._activeField)
    const state = this._states[this._activeField]
    const values = generateRange(config.min, config.max)
    const gridCols = getGridColsClass(this._activeField)

    return html`
      <div class="options" part="options">
        <div class="option-row">选择${config.label}</div>
        <div class="grid ${gridCols}" part="grid">
          ${values.map(v => {
            const label = getValueLabel(this._activeField, v)
            const id = `${this._activeField}-${v}-${Date.now()}`
            return html`
              <div class="cell" part="cell">
                <input
                  type="checkbox"
                  id=${id}
                  .checked=${state.values.includes(v)}
                  ?disabled=${this.disabled}
                  @change=${() => this._handleValueToggle(v)}
                />
                <label for=${id} part="cell-label">${label}</label>
              </div>
            `
          })}
        </div>
        ${this.hideActions ? nothing : html`
          <div class="actions" part="actions">
            <button class="action-btn" part="action-btn" ?disabled=${this.disabled} @click=${this._handleSelectAll}>全选</button>
            <button class="action-btn" part="action-btn" ?disabled=${this.disabled} @click=${this._handleClearAll}>清空</button>
          </div>
        `}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cron-picker': CronPicker
  }
}
