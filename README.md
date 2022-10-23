# cron-picker

一个用于生成 Cron 表达式的 Web Component，基于 [Lit](https://lit.dev) 构建，支持无头模式。

## 特性

- 🎯 **6 段式 Cron 表达式**：秒、分、时、日、月、周
- 🎨 **无头模式**：完全自定义样式
- 🔧 **丰富的 API**：编程式控制
- 📦 **零依赖**：仅依赖 Lit

## 安装

```bash
npm install cron-picker
# 或
pnpm add cron-picker
```

## 快速开始

```html
<script type="module">
  import 'cron-picker'
</script>

<cron-picker value="0 0 12 * * *"></cron-picker>

<script>
  document.querySelector('cron-picker').addEventListener('change', (e) => {
    console.log('Cron 表达式:', e.detail.value)
  })
</script>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | `* * * * * *` | Cron 表达式（6段式） |
| `headless` | `boolean` | `false` | 无头模式，禁用默认样式 |
| `hide-expression` | `boolean` | `false` | 隐藏表达式展示区 |
| `hide-tabs` | `boolean` | `false` | 隐藏标签页 |
| `hide-actions` | `boolean` | `false` | 隐藏快捷操作按钮 |
| `disabled` | `boolean` | `false` | 禁用状态 |

## 事件

| 事件 | 详情 | 说明 |
|------|------|------|
| `change` | `{ value, field, states }` | 表达式变化时触发 |
| `field-change` | `{ field }` | 切换字段时触发 |

## 方法

```javascript
const picker = document.querySelector('cron-picker')

// 设置字段模式
picker.setFieldMode('second', 'interval')

// 设置字段值
picker.setFieldValues('hour', [9, 12, 18])

// 设置字段范围
picker.setFieldRange('day', 1, 15)

// 设置字段间隔
picker.setFieldInterval('minute', 0, 5)

// 重置
picker.reset()

// 解析表达式
picker.parse('0 30 12 * * *')

// 生成表达式
const cron = picker.generate()

// 获取值标签
picker.getValueLabel('weekday', 0)  // '日'
picker.getValueLabel('month', 1)    // '1月'
```

## 自定义样式

### CSS 变量

```css
cron-picker {
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
}
```

### CSS Parts

使用 `::part()` 选择器自定义内部元素：

```css
cron-picker::part(container) {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

cron-picker::part(expression) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

cron-picker::part(tab) {
  font-weight: 600;
}

cron-picker::part(mode-btn) {
  border-radius: 999px;
}

cron-picker::part(cell-label) {
  font-size: 11px;
}
```

可用的 Parts：

- `container` - 容器
- `expression` - 表达式展示区
- `segment` - 表达式段
- `tabs` - 标签页容器
- `tab` - 标签页按钮
- `panel` - 面板区域
- `modes` - 模式选择容器
- `mode-btn` - 模式按钮
- `options` - 选项容器
- `input` - 输入框
- `grid` - 值选择网格
- `cell` - 值选择单元格
- `cell-label` - 值选择标签
- `actions` - 快捷操作容器
- `action-btn` - 快捷操作按钮

### 无头模式

启用无头模式后，所有默认样式将被禁用，你可以完全自定义：

```html
<cron-picker headless></cron-picker>

<style>
  cron-picker[headless]::part(container) {
    /* 你的样式 */
  }
</style>
```

## Cron 表达式格式

```
┌─────────── 秒 (0-59)
│ ┌───────── 分 (0-59)
│ │ ┌─────── 时 (0-23)
│ │ │ ┌───── 日 (1-31)
│ │ │ │ ┌─── 月 (1-12)
│ │ │ │ │ ┌─ 周 (0-6, 0=周日)
│ │ │ │ │ │
* * * * * *
```

### 支持的模式

| 模式 | 示例 | 说明 |
|------|------|------|
| 每个 | `*` | 每秒/分/时等 |
| 间隔 | `*/5` 或 `0/5` | 从指定值开始，每隔 N 执行 |
| 范围 | `1-10` | 在范围内执行 |
| 指定 | `1,5,10` | 在指定值执行 |

### 示例

| 表达式 | 说明 |
|--------|------|
| `0 0 12 * * *` | 每天中午 12 点 |
| `0 30 9 * * 1-5` | 工作日 9:30 |
| `0 0 */2 * * *` | 每 2 小时 |
| `0 0 0 1 * *` | 每月 1 号 |
| `0 0 0 * * 0` | 每周日 |

## 类型

```typescript
type CronFieldType = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'weekday'
type CronMode = 'every' | 'specific' | 'range' | 'interval'

interface CronFieldState {
  mode: CronMode
  values: number[]
  rangeStart: number
  rangeEnd: number
  intervalStart: number
  intervalStep: number
}

interface CronChangeEventDetail {
  value: string
  field: CronFieldType
  states: Record<CronFieldType, CronFieldState>
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 运行测试
# 在浏览器中打开 test/index.html
```
