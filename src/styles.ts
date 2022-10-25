/**
 * Cron Picker 样式定义
 */

import { css } from 'lit'

/** 组件默认样式 */
export const cronPickerStyles = css`
  :host {
    /* Modern Color Palette (Tailwind-inspired) */
    --cron-primary: #3b82f6;
    --cron-primary-hover: #2563eb;
    --cron-primary-light: #eff6ff;
    
    --cron-text-main: #1e293b;
    --cron-text-secondary: #64748b;
    --cron-text-muted: #94a3b8;
    
    --cron-bg-surface: #ffffff;
    --cron-bg-background: #f8fafc;
    --cron-bg-hover: #f1f5f9;
    
    --cron-border: #e2e8f0;
    --cron-border-focus: #3b82f6;
    
    --cron-radius-lg: 16px;
    --cron-radius-md: 12px;
    --cron-radius-sm: 8px;
    --cron-radius-full: 9999px;
    
    --cron-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --cron-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --cron-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

    --cron-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    display: block;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: var(--cron-text-main);
    box-sizing: border-box;
  }

  * { box-sizing: border-box; }

  /* Container */
  .container {
    background: var(--cron-bg-surface);
    border-radius: var(--cron-radius-lg);
    box-shadow: var(--cron-shadow);
    border: 1px solid var(--cron-border);
    overflow: hidden;
    max-width: 100%;
    margin: 0 auto;
  }
`

/** 简易模式样式 */
export const simpleModeStyles = css`
  .simple-mode {
    display: flex;
    flex-direction: column;
  }

  /* Header */
  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--cron-border);
    background: var(--cron-bg-background);
  }

  .status-info {
    display: flex;
    flex-direction: column;
  }

  .status-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--cron-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-value {
    font-family: 'SF Mono', Monaco, Consolas, monospace;
    font-size: 14px;
    color: var(--cron-primary);
    font-weight: 600;
    margin-top: 2px;
  }

  .mode-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--cron-bg-surface);
    border: 1px solid var(--cron-border);
    border-radius: var(--cron-radius-full);
    color: var(--cron-text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--cron-transition);
  }

  .mode-toggle:hover {
    border-color: var(--cron-primary);
    color: var(--cron-primary);
    background: var(--cron-primary-light);
  }

  .mode-toggle svg {
    width: 16px;
    height: 16px;
  }

  /* Content */
  .simple-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* Live Preview */
  .live-preview {
    text-align: center;
  }

  .preview-description {
    font-size: 18px;
    color: var(--cron-text-main);
    margin: 0;
    line-height: 1.6;
  }

  .preview-description strong {
    color: var(--cron-primary);
    font-weight: 600;
  }
`

/** 时间选择器样式 */
export const timePickerStyles = css`
  .time-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .time-picker-container {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 28px;
    background: var(--cron-bg-background);
    border-radius: var(--cron-radius-lg);
    border: 1px solid var(--cron-border);
  }

  .time-select-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .time-select-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--cron-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .time-select {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .time-select select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 72px;
    padding: 12px 8px;
    font-size: 28px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    text-align: center;
    color: var(--cron-text-main);
    background: var(--cron-bg-surface);
    border: 2px solid var(--cron-border);
    border-radius: var(--cron-radius-md);
    cursor: pointer;
    transition: var(--cron-transition);
    outline: none;
  }

  .time-select select:hover {
    border-color: var(--cron-primary);
    background: var(--cron-primary-light);
  }

  .time-select select:focus {
    border-color: var(--cron-primary);
    box-shadow: 0 0 0 3px var(--cron-primary-light);
  }

  .time-select select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .time-select.period select {
    width: 68px;
    font-size: 16px;
    font-weight: 600;
    padding: 14px 8px;
  }

  .time-separator {
    font-size: 32px;
    font-weight: 700;
    color: var(--cron-text-muted);
    margin: 16px 4px 0;
    line-height: 1;
  }

  .time-edit-hint {
    font-size: 12px;
    color: var(--cron-text-muted);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .time-edit-hint svg {
    width: 14px;
    height: 14px;
  }
`

/** 预设和星期选择器样式 */
export const presetStyles = css`
  .preset-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--cron-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .preset-chips {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (min-width: 480px) {
    .preset-chips {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .preset-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    background: var(--cron-bg-surface);
    border: 1px solid var(--cron-border);
    border-radius: var(--cron-radius-md);
    color: var(--cron-text-secondary);
    cursor: pointer;
    transition: var(--cron-transition);
  }

  .preset-chip svg {
    width: 24px;
    height: 24px;
    color: var(--cron-text-muted);
    transition: var(--cron-transition);
  }

  .preset-chip:hover {
    border-color: var(--cron-primary);
    background: var(--cron-bg-hover);
  }

  .preset-chip.active {
    background: var(--cron-primary-light);
    border-color: var(--cron-primary);
    color: var(--cron-primary);
  }

  .preset-chip.active svg {
    color: var(--cron-primary);
  }

  /* Weekday Selector */
  .weekday-section {
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .weekday-grid {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 12px;
  }

  .weekday-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 48px;
    border-radius: var(--cron-radius-md);
    background: var(--cron-bg-surface);
    border: 1px solid var(--cron-border);
    cursor: pointer;
    transition: var(--cron-transition);
    position: relative;
  }

  .weekday-item input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .weekday-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--cron-text-secondary);
  }

  .weekday-sub {
    display: none;
  }

  .weekday-item:hover {
    border-color: var(--cron-primary);
    background: var(--cron-bg-hover);
  }

  .weekday-item.selected {
    background: var(--cron-primary);
    border-color: var(--cron-primary);
  }

  .weekday-item.selected .weekday-name {
    color: white;
  }
`

/** 高级模式样式 */
export const advancedModeStyles = css`
  .advanced-header {
    padding: 20px 24px;
    background: var(--cron-bg-background);
    border-bottom: 1px solid var(--cron-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .simple-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--cron-text-main);
    margin: 0;
  }

  .expression {
    padding: 16px 24px;
    background: var(--cron-bg-surface);
    border-bottom: 1px solid var(--cron-border);
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }

  .segment {
    padding: 6px 10px;
    background: var(--cron-bg-background);
    border-radius: var(--cron-radius-sm);
    font-family: 'SF Mono', Monaco, Consolas, monospace;
    font-size: 14px;
    color: var(--cron-text-main);
    cursor: pointer;
    transition: var(--cron-transition);
    border: 1px solid transparent;
  }

  .segment:hover {
    background: var(--cron-primary-light);
  }

  .segment.active {
    background: var(--cron-primary);
    color: white;
    box-shadow: var(--cron-shadow-sm);
  }

  /* Tabs */
  .tabs {
    display: flex;
    padding: 0 24px;
    border-bottom: 1px solid var(--cron-border);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tabs::-webkit-scrollbar { display: none; }

  .tab {
    padding: 16px 4px;
    margin-right: 24px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 14px;
    font-weight: 500;
    color: var(--cron-text-secondary);
    cursor: pointer;
    transition: var(--cron-transition);
    white-space: nowrap;
  }

  .tab:hover {
    color: var(--cron-primary);
  }

  .tab.active {
    color: var(--cron-primary);
    border-bottom-color: var(--cron-primary);
  }

  /* Panel */
  .panel {
    padding: 24px;
  }

  /* Modes */
  .modes {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    padding: 4px;
    background: var(--cron-bg-background);
    border-radius: var(--cron-radius-md);
  }

  .mode-btn {
    flex: 1;
    padding: 8px;
    border: none;
    background: none;
    border-radius: var(--cron-radius-sm);
    font-size: 13px;
    font-weight: 500;
    color: var(--cron-text-secondary);
    cursor: pointer;
    transition: var(--cron-transition);
  }

  .mode-btn:hover {
    color: var(--cron-text-main);
  }

  .mode-btn.active {
    background: var(--cron-bg-surface);
    color: var(--cron-primary);
    box-shadow: var(--cron-shadow-sm);
  }
`

/** 选项和网格样式 */
export const optionsStyles = css`
  .options {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .option-row {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--cron-text-main);
    font-size: 14px;
  }

  .input {
    width: 80px;
    padding: 8px 12px;
    border: 1px solid var(--cron-border);
    border-radius: var(--cron-radius-sm);
    font-size: 14px;
    color: var(--cron-text-main);
    transition: var(--cron-transition);
  }

  .input:focus {
    outline: none;
    border-color: var(--cron-primary);
    box-shadow: 0 0 0 3px var(--cron-primary-light);
  }

  /* Grid */
  .grid {
    display: grid;
    gap: 8px;
    margin-top: 16px;
  }

  .cols-6 { grid-template-columns: repeat(6, 1fr); }
  .cols-7 { grid-template-columns: repeat(7, 1fr); }
  .cols-10 { grid-template-columns: repeat(5, 1fr); }

  @media (min-width: 640px) {
    .cols-10 { grid-template-columns: repeat(10, 1fr); }
  }

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
    height: 36px;
    border: 1px solid var(--cron-border);
    border-radius: var(--cron-radius-sm);
    font-size: 13px;
    color: var(--cron-text-secondary);
    cursor: pointer;
    transition: var(--cron-transition);
    background: var(--cron-bg-surface);
  }

  .cell label:hover {
    border-color: var(--cron-primary);
    background: var(--cron-bg-hover);
  }

  .cell input:checked + label {
    background: var(--cron-primary);
    border-color: var(--cron-primary);
    color: white;
  }

  /* Actions */
  .actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--cron-border);
  }

  .action-btn {
    padding: 8px 16px;
    background: var(--cron-bg-surface);
    border: 1px solid var(--cron-border);
    border-radius: var(--cron-radius-sm);
    color: var(--cron-text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--cron-transition);
  }

  .action-btn:hover {
    border-color: var(--cron-text-muted);
    color: var(--cron-text-main);
  }
`

/** 所有样式合集 */
export const allStyles = [
  cronPickerStyles,
  simpleModeStyles,
  timePickerStyles,
  presetStyles,
  advancedModeStyles,
  optionsStyles,
]
