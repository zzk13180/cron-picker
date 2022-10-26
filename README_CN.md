# Cron Picker

[English](./README.md)

基于 [Lit](https://lit.dev) 构建的 Cron 表达式生成器组件。

## 特性

- **标准 6 段式 Cron**：支持秒、分、时、日、月、周的完整配置。
- **双重模式**：
  - **简易模式**：直观的自然语言配置（如“每天”、“每周五”）。
  - **高级模式**：支持每个字段的精确控制（间隔、范围、枚举）。
- **响应式布局**：自动适配容器大小，支持 **紧凑模式 (Compact)**，在 360px 宽度下依然完美展示。
- **零依赖**：基于 Web Component 标准，兼容 React, Vue, Angular 或原生项目。
- **类型安全**：完整的 TypeScript 类型定义。

## 安装

```bash
npm install cron-picker
# 或
pnpm add cron-picker
```

## 快速开始

### 基础用法

```html
<script type="module" src="cron-picker/cron-picker.js"></script>

<cron-picker value="0 0 8 * * *"></cron-picker>

<script>
  const picker = document.querySelector('cron-picker');
  picker.addEventListener('change', (e) => {
    console.log('Cron 表达式:', e.detail.value);
  });
</script>
```

### 紧凑模式

在侧边栏或弹窗等狭窄容器中使用时，可开启紧凑模式：

```html
<cron-picker mode="advanced" compact style="width: 360px;"></cron-picker>
```

## API 参考

### 属性 (Properties)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | `* * * * * *` | 6 段式 Cron 表达式 |
| `mode` | `'simple' \| 'advanced'` | `'simple'` | UI 模式 |
| `compact` | `boolean` | `false` | 开启紧凑布局模式（适合宽度 < 600px） |
| `headless` | `boolean` | `false` | 无头模式，禁用 Shadow DOM 默认样式 |
| `disabled` | `boolean` | `false` | 禁用所有交互 |
| `hide-expression` | `boolean` | `false` | 隐藏表达式预览区域 |
| `hide-tabs` | `boolean` | `false` | 隐藏高级模式的字段标签页 |
| `hide-actions` | `boolean` | `false` | 隐藏底部操作栏 |

### 事件 (Events)

| 事件名 | 类型 | 说明 |
|--------|------|------|
| `change` | `CustomEvent` | 表达式更新时触发，`e.detail.value` 为新表达式 |

### 方法 (Methods)

可直接在 DOM 元素实例上调用：

| 方法名 | 说明 |
|--------|------|
| `reset()` | 重置为默认值 |
| `parse(cron)` | 解析并应用一个新的 Cron 表达式 |
| `generate()` | 根据当前状态生成 Cron 表达式 |
| `getDescription()` | 获取当前表达式的人类可读描述 |

## 样式定制

组件采用 CSS 变量与 Shadow Parts 进行样式隔离与定制。

### CSS 变量

```css
cron-picker {
  /* 基础色板 */
  --cron-primary: #3b82f6;
  --cron-bg-surface: #ffffff;
  
  /* 布局尺寸（在紧凑模式下会自动调整，也可手动覆盖） */
  --cron-padding-base: 24px;
  --cron-radius-lg: 16px;
}
```

### Shadow Parts

使用 `::part()` 伪元素穿透 Shadow DOM 修改内部样式：

```css
/* 示例：修改面板背景 */
cron-picker::part(panel) {
  background-color: #f8fafc;
}
```

支持的 Parts: `container`, `expression`, `tabs`, `tab`, `panel`, `grid`, `cell`, `action-btn` 等。

## Cron 格式说明

组件生成的表达式遵循标准的 6 段式格式：

```
┌────────────── 秒 (0-59)
│ ┌──────────── 分 (0-59)
│ │ ┌────────── 时 (0-23)
│ │ │ ┌──────── 日 (1-31)
│ │ │ │ ┌────── 月 (1-12)
│ │ │ │ │ ┌──── 周 (0-6, 周日=0)
│ │ │ │ │ │
* * * * * *
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```
