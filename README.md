# Cron Picker

[中文](./README_CN.md)

A Cron expression generator Web Component based on [Lit](https://lit.dev).

## Features

- **Standard 6-Segment Cron**: Supports full configuration for second, minute, hour, day, month, and weekday.
- **Dual Modes**:
  - **Simple Mode**: Intuitive natural language configuration (e.g., "Daily", "Every Friday").
  - **Advanced Mode**: Precise control for each field (intervals, ranges, specific values).
- **Responsive Layout**: Automatically adapts to container size, supports **Compact Mode**, displaying perfectly even at 360px width.
- **Zero Dependencies**: Based on Web Component standards, compatible with React, Vue, Angular, or vanilla JS projects.
- **Type Safe**: Complete TypeScript type definitions.

## Installation

```bash
npm install cron-picker
# or
pnpm add cron-picker
```

## Quick Start

### Basic Usage

```html
<script type="module" src="cron-picker/cron-picker.js"></script>

<cron-picker value="0 0 8 * * *"></cron-picker>

<script>
  const picker = document.querySelector('cron-picker');
  picker.addEventListener('change', (e) => {
    console.log('Cron Expression:', e.detail.value);
  });
</script>
```

### Compact Mode

When used in narrow containers like sidebars or dialogs, enable compact mode:

```html
<cron-picker mode="advanced" compact style="width: 360px;"></cron-picker>
```

## API Reference

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | `* * * * * *` | 6-segment Cron expression |
| `mode` | `'simple' \| 'advanced'` | `'simple'` | UI mode |
| `compact` | `boolean` | `false` | Enable compact layout mode (suitable for width < 600px) |
| `headless` | `boolean` | `false` | Headless mode, disables Shadow DOM default styles |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `hide-expression` | `boolean` | `false` | Hide expression preview area |
| `hide-tabs` | `boolean` | `false` | Hide field tabs in advanced mode |
| `hide-actions` | `boolean` | `false` | Hide bottom action bar |

### Events

| Event Name | Type | Description |
|------------|------|-------------|
| `change` | `CustomEvent` | Triggered when expression updates. `e.detail.value` is the new expression. |

### Methods

Can be called directly on the DOM element instance:

| Method Name | Description |
|-------------|-------------|
| `reset()` | Reset to default value |
| `parse(cron)` | Parse and apply a new Cron expression |
| `generate()` | Generate Cron expression based on current state |
| `getDescription()` | Get human-readable description of current expression |

## Styling Customization

The component uses CSS variables and Shadow Parts for style isolation and customization.

### CSS Variables

```css
cron-picker {
  /* Base Palette */
  --cron-primary: #3b82f6;
  --cron-bg-surface: #ffffff;
  
  /* Layout Dimensions (automatically adjusted in compact mode, can be manually overridden) */
  --cron-padding-base: 24px;
  --cron-radius-lg: 16px;
}
```

### Shadow Parts

Use the `::part()` pseudo-element to modify internal styles piercing Shadow DOM:

```css
/* Example: Modify panel background */
cron-picker::part(panel) {
  background-color: #f8fafc;
}
```

Supported Parts: `container`, `expression`, `tabs`, `tab`, `panel`, `grid`, `cell`, `action-btn`, etc.

## Cron Format Description

The component generates expressions following the standard 6-segment format:

```
┌────────────── Second (0-59)
│ ┌──────────── Minute (0-59)
│ │ ┌────────── Hour (0-23)
│ │ │ ┌──────── Day of Month (1-31)
│ │ │ │ ┌────── Month (1-12)
│ │ │ │ │ ┌──── Day of Week (0-6, Sunday=0)
│ │ │ │ │ │
* * * * * *
```

## Development

```bash
# Install dependencies
pnpm install

# Dev mode
pnpm dev

# Build
pnpm build
```
