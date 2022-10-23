import { LitElement, html, css, PropertyValues, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

// ==================== 类型导出 ====================
export type CronFieldType = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'weekday'
export type CronMode = 'every' | 'specific' | 'range' | 'interval'

export interface CronFieldConfig {
  label: string
  min: number
  max: number
  type: CronFieldType
}

export interface CronFieldState {
  mode: CronMode
  values: number[]
  rangeStart: number
  rangeEnd: number
  intervalStart: number
  intervalStep: number
}

export interface CronChangeEventDetail {
  value: string
  field: CronFieldType
  states: Record<CronFieldType, CronFieldState>
}

// ==================== 常量配置 ====================
export const CRON_FIELDS: CronFieldConfig[] = [
  { label: '秒', min: 0, max: 59, type: 'second' },
  { label: '分', min: 0, max: 59, type: 'minute' },
  { label: '时', min: 0, max: 23, type: 'hour' },
  { label: '日', min: 1, max: 31, type: 'day' },
  { label: '月', min: 1, max: 12, type: 'month' },
  { label: '周', min: 0, max: 6, type: 'weekday' },
]

export const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']
export const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

export const MODE_LABELS: Record<CronMode, string> = {
  every: '每个',
  interval: '间隔',
  range: '范围',
  specific: '指定',
}

// ==================== 默认样式 ====================
const defaultStyles = css`
  :host {
    /* 主题色 */
    --cron-primary: #6366f1;
    --cron-primary-hover: #4f46e5;
    --cron-primary-bg: rgba(99, 102, 241, 0.1);

    /* 文本色 */
    --cron-text: #1e293b;
    --cron-text-secondary: #64748b;
    --cron-text-muted: #94a3b8;

    /* 背景色 */
    --cron-bg: #ffffff;
    --cron-bg-secondary: #f8fafc;
    --cron-bg-active: #f1f5f9;

    /* 边框 */
    --cron-border: #e2e8f0;
    --cron-border-active: #6366f1;

    /* 圆角 */
    --cron-radius: 8px;
    --cron-radius-sm: 4px;

    /* 间距 */
    --cron-gap: 8px;
    --cron-padding: 16px;

    /* 过渡 */
    --cron-transition: 150ms ease;

    display: block;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    color: var(--cron-text);
  }

  :host([headless]) {
    all: initial;
    display: block;
  }

  * { box-sizing: border-box; }

  .container {
    background: var(--cron-bg);
    border: 1px solid var(--cron-border);
    border-radius: var(--cron-radius);
    overflow: hidden;
  }

  :host([headless]) .container {
    background: none;
    border: none;
    border-radius: 0;
  }

  /* 表达式展示 */
  .expression {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: var(--cron-padding);
    background: var(--cron-bg-secondary);
    border-bottom: 1px solid var(--cron-border);
    font-family: ui-monospace, monospace;
    font-size: 16px;
    font-weight: 600;
  }

  :host([headless]) .expression {
    background: none;
    border: none;
    padding: 0;
  }

  .segment {
    padding: 6px 10px;
    background: var(--cron-bg);
    border: 1px solid var(--cron-border);
    border-radius: var(--cron-radius-sm);
    cursor: pointer;
    transition: all var(--cron-transition);
    min-width: 36px;
    text-align: center;
  }

  .segment:hover { border-color: var(--cron-primary); }
  .segment.active {
    background: var(--cron-primary);
    border-color: var(--cron-primary);
    color: white;
  }

  /* 标签页 */
  .tabs {
    display: flex;
    gap: 2px;
    padding: var(--cron-gap);
    background: var(--cron-bg-secondary);
  }

  :host([headless]) .tabs {
    background: none;
    padding: 0;
  }

  .tab {
    flex: 1;
    padding: 10px 8px;
    border: none;
    background: transparent;
    border-radius: var(--cron-radius-sm);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--cron-text-secondary);
    transition: all var(--cron-transition);
  }

  .tab:hover { background: var(--cron-bg-active); color: var(--cron-text); }
  .tab.active { background: var(--cron-bg); color: var(--cron-primary); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

  /* 面板 */
  .panel { padding: var(--cron-padding); }
  :host([headless]) .panel { padding: 0; }

  /* 模式选择 */
  .modes {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--cron-gap);
    margin-bottom: var(--cron-padding);
  }

  .mode-btn {
    padding: 12px 8px;
    border: 1px solid var(--cron-border);
    background: var(--cron-bg);
    border-radius: var(--cron-radius-sm);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--cron-text-secondary);
    transition: all var(--cron-transition);
  }

  .mode-btn:hover { border-color: var(--cron-primary); color: var(--cron-primary); }
  .mode-btn.active {
    border-color: var(--cron-primary);
    background: var(--cron-primary-bg);
    color: var(--cron-primary);
  }

  /* 选项区域 */
  .options {
    background: var(--cron-bg-secondary);
    border-radius: var(--cron-radius-sm);
    padding: var(--cron-padding);
  }

  :host([headless]) .options {
    background: none;
    padding: 0;
  }

  .option-row {
    display: flex;
    align-items: center;
    gap: var(--cron-gap);
    flex-wrap: wrap;
    color: var(--cron-text-secondary);
    font-size: 13px;
  }

  /* 输入框 */
  .input {
    width: 64px;
    padding: 8px;
    border: 1px solid var(--cron-border);
    border-radius: var(--cron-radius-sm);
    font-size: 14px;
    text-align: center;
    background: var(--cron-bg);
    color: var(--cron-text);
    transition: border-color var(--cron-transition);
  }

  .input:focus {
    outline: none;
    border-color: var(--cron-primary);
  }

  /* 值选择网格 */
  .grid {
    display: grid;
    gap: 4px;
    margin-top: 12px;
  }

  .grid.cols-10 { grid-template-columns: repeat(10, 1fr); }
  .grid.cols-7 { grid-template-columns: repeat(7, 1fr); }
  .grid.cols-6 { grid-template-columns: repeat(6, 1fr); }
  .grid.cols-4 { grid-template-columns: repeat(4, 1fr); }

  .cell {
    position: relative;
  }

  .cell input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .cell label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 4px;
    border: 1px solid var(--cron-border);
    border-radius: var(--cron-radius-sm);
    font-size: 12px;
    color: var(--cron-text-secondary);
    background: var(--cron-bg);
    cursor: pointer;
    transition: all var(--cron-transition);
    user-select: none;
  }

  .cell label:hover {
    border-color: var(--cron-primary);
  }

  .cell input:checked + label {
    background: var(--cron-primary);
    border-color: var(--cron-primary);
    color: white;
  }

  /* 快捷操作 */
  .actions {
    display: flex;
    gap: var(--cron-gap);
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--cron-border);
  }

  :host([headless]) .actions {
    border: none;
    padding: 0;
    margin: 0;
  }

  .action-btn {
    padding: 6px 12px;
    border: 1px solid var(--cron-border);
    border-radius: 9999px;
    background: var(--cron-bg);
    color: var(--cron-text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: all var(--cron-transition);
  }

  .action-btn:hover {
    border-color: var(--cron-primary);
    color: var(--cron-primary);
  }

  /* 隐藏元素 */
  [hidden] { display: none !important; }
`

// ==================== 组件定义 ====================
@customElement('cron-picker')
export class CronPicker extends LitElement {
  static override styles = defaultStyles

  // ====== 属性 ======
  /** Cron 表达式（6段式：秒 分 时 日 月 周） */
  @property({ type: String, reflect: true })
  value = '* * * * * *'

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

  // ====== 内部状态 ======
  @state()
  private _activeField: CronFieldType = 'second'

  @state()
  private _states: Record<CronFieldType, CronFieldState> = this._createInitialStates()

  // ====== 公开属性 ======
  /** 当前激活的字段 */
  get activeField(): CronFieldType {
    return this._activeField
  }
  set activeField(field: CronFieldType) {
    this._activeField = field
    this.requestUpdate()
  }

  /** 所有字段状态 */
  get states(): Record<CronFieldType, CronFieldState> {
    return { ...this._states }
  }

  /** 字段配置 */
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

  // ====== 公开方法 ======
  /** 设置字段模式 */
  setFieldMode(field: CronFieldType, mode: CronMode): void {
    this._states = {
      ...this._states,
      [field]: { ...this._states[field], mode },
    }
    this._emitChange()
  }

  /** 设置字段值 */
  setFieldValues(field: CronFieldType, values: number[]): void {
    this._states = {
      ...this._states,
      [field]: { ...this._states[field], values: [...values] },
    }
    this._emitChange()
  }

  /** 设置字段范围 */
  setFieldRange(field: CronFieldType, start: number, end: number): void {
    this._states = {
      ...this._states,
      [field]: { ...this._states[field], rangeStart: start, rangeEnd: end },
    }
    this._emitChange()
  }

  /** 设置字段间隔 */
  setFieldInterval(field: CronFieldType, start: number, step: number): void {
    this._states = {
      ...this._states,
      [field]: { ...this._states[field], intervalStart: start, intervalStep: step },
    }
    this._emitChange()
  }

  /** 重置为默认值 */
  reset(): void {
    this._states = this._createInitialStates()
    this.value = '* * * * * *'
    this._emitChange()
  }

  /** 解析表达式 */
  parse(expression: string): void {
    this._parseExpression(expression)
    this.value = expression
  }

  /** 生成表达式 */
  generate(): string {
    return this._generateExpression()
  }

  /** 获取值标签 */
  getValueLabel(field: CronFieldType, value: number): string {
    if (field === 'weekday') return WEEKDAY_LABELS[value] || String(value)
    if (field === 'month') return MONTH_LABELS[value - 1] || String(value)
    return String(value).padStart(2, '0')
  }

  // ====== 内部方法 ======
  private _createInitialStates(): Record<CronFieldType, CronFieldState> {
    return {
      second: { mode: 'every', values: [], rangeStart: 0, rangeEnd: 59, intervalStart: 0, intervalStep: 1 },
      minute: { mode: 'every', values: [], rangeStart: 0, rangeEnd: 59, intervalStart: 0, intervalStep: 1 },
      hour: { mode: 'every', values: [], rangeStart: 0, rangeEnd: 23, intervalStart: 0, intervalStep: 1 },
      day: { mode: 'every', values: [], rangeStart: 1, rangeEnd: 31, intervalStart: 1, intervalStep: 1 },
      month: { mode: 'every', values: [], rangeStart: 1, rangeEnd: 12, intervalStart: 1, intervalStep: 1 },
      weekday: { mode: 'every', values: [], rangeStart: 0, rangeEnd: 6, intervalStart: 0, intervalStep: 1 },
    }
  }

  private _parseExpression(cron: string) {
    const parts = cron.trim().split(/\s+/)
    if (parts.length !== 6) return

    const fields: CronFieldType[] = ['second', 'minute', 'hour', 'day', 'month', 'weekday']
    const newStates = { ...this._states }

    for (let i = 0; i < 6; i++) {
      const part = parts[i] as string
      const field = fields[i] as CronFieldType
      const config = CRON_FIELDS[i] as CronFieldConfig
      const state = { ...newStates[field] }

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

    this._states = newStates
  }

  private _generateExpression(): string {
    const fields: CronFieldType[] = ['second', 'minute', 'hour', 'day', 'month', 'weekday']

    return fields.map((field, i) => {
      const state = this._states[field]
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

  private _emitChange() {
    const newValue = this._generateExpression()
    if (newValue !== this.value) {
      this.value = newValue
    }
    this.dispatchEvent(new CustomEvent<CronChangeEventDetail>('change', {
      detail: {
        value: this.value,
        field: this._activeField,
        states: { ...this._states },
      },
      bubbles: true,
      composed: true,
    }))
  }

  // ====== 事件处理 ======
  private _onFieldClick(field: CronFieldType) {
    if (this.disabled) return
    this._activeField = field
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { field },
      bubbles: true,
      composed: true,
    }))
  }

  private _onModeChange(mode: CronMode) {
    if (this.disabled) return
    this.setFieldMode(this._activeField, mode)
  }

  private _onValueToggle(value: number) {
    if (this.disabled) return
    const state = this._states[this._activeField]
    const values = state.values.includes(value)
      ? state.values.filter(v => v !== value)
      : [...state.values, value]
    this.setFieldValues(this._activeField, values)
  }

  private _onRangeInput(type: 'start' | 'end', e: Event) {
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

  private _onIntervalInput(type: 'start' | 'step', e: Event) {
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

  private _onSelectAll() {
    if (this.disabled) return
    const config = CRON_FIELDS.find(f => f.type === this._activeField)!
    const values = Array.from({ length: config.max - config.min + 1 }, (_, i) => config.min + i)
    this.setFieldValues(this._activeField, values)
  }

  private _onClearAll() {
    if (this.disabled) return
    this.setFieldValues(this._activeField, [])
  }

  // ====== 渲染方法 ======
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
              @click=${() => field && this._onFieldClick(field)}
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
            @click=${() => this._onFieldClick(f.type)}
          >${f.label}</button>
        `)}
      </div>
    `
  }

  private _renderModes() {
    const currentMode = this._states[this._activeField].mode
    const modes: CronMode[] = ['every', 'interval', 'range', 'specific']

    return html`
      <div class="modes" part="modes">
        ${modes.map(mode => html`
          <button
            class=${classMap({ 'mode-btn': true, active: currentMode === mode })}
            part="mode-btn"
            ?disabled=${this.disabled}
            @click=${() => this._onModeChange(mode)}
          >${MODE_LABELS[mode]}</button>
        `)}
      </div>
    `
  }

  private _renderEveryOptions() {
    const config = CRON_FIELDS.find(f => f.type === this._activeField)!
    return html`
      <div class="options" part="options">
        <div class="option-row">每${config.label}执行</div>
      </div>
    `
  }

  private _renderIntervalOptions() {
    const config = CRON_FIELDS.find(f => f.type === this._activeField)!
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
            @input=${(e: Event) => this._onIntervalInput('start', e)}
          />
          <span>${config.label}开始，每</span>
          <input
            type="number"
            class="input"
            part="input"
            .value=${String(state.intervalStep)}
            min="1"
            ?disabled=${this.disabled}
            @input=${(e: Event) => this._onIntervalInput('step', e)}
          />
          <span>${config.label}执行</span>
        </div>
      </div>
    `
  }

  private _renderRangeOptions() {
    const config = CRON_FIELDS.find(f => f.type === this._activeField)!
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
            @input=${(e: Event) => this._onRangeInput('start', e)}
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
            @input=${(e: Event) => this._onRangeInput('end', e)}
          />
          <span>${config.label}</span>
        </div>
      </div>
    `
  }

  private _renderSpecificOptions() {
    const config = CRON_FIELDS.find(f => f.type === this._activeField)!
    const state = this._states[this._activeField]
    const count = config.max - config.min + 1
    const values = Array.from({ length: count }, (_, i) => config.min + i)

    let gridCols = 'cols-10'
    if (this._activeField === 'weekday') gridCols = 'cols-7'
    else if (this._activeField === 'month') gridCols = 'cols-6'
    else if (this._activeField === 'hour') gridCols = 'cols-6'
    else if (this._activeField === 'day') gridCols = 'cols-7'

    return html`
      <div class="options" part="options">
        <div class="option-row">选择${config.label}</div>
        <div class="grid ${gridCols}" part="grid">
          ${values.map(v => {
            const label = this.getValueLabel(this._activeField, v)
            const id = `${this._activeField}-${v}-${Date.now()}`
            return html`
              <div class="cell" part="cell">
                <input
                  type="checkbox"
                  id=${id}
                  .checked=${state.values.includes(v)}
                  ?disabled=${this.disabled}
                  @change=${() => this._onValueToggle(v)}
                />
                <label for=${id} part="cell-label">${label}</label>
              </div>
            `
          })}
        </div>
        ${this.hideActions ? nothing : html`
          <div class="actions" part="actions">
            <button class="action-btn" part="action-btn" ?disabled=${this.disabled} @click=${this._onSelectAll}>全选</button>
            <button class="action-btn" part="action-btn" ?disabled=${this.disabled} @click=${this._onClearAll}>清空</button>
          </div>
        `}
      </div>
    `
  }

  private _renderModeContent() {
    const mode = this._states[this._activeField].mode
    switch (mode) {
      case 'every': return this._renderEveryOptions()
      case 'interval': return this._renderIntervalOptions()
      case 'range': return this._renderRangeOptions()
      case 'specific': return this._renderSpecificOptions()
      default: return nothing
    }
  }

  override render() {
    return html`
      <div class="container" part="container">
        ${this._renderExpression()}
        ${this._renderTabs()}
        <div class="panel" part="panel">
          ${this._renderModes()}
          ${this._renderModeContent()}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cron-picker': CronPicker
  }
}
