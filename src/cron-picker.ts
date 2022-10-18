import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('cron-picker')
export class CronPicker extends LitElement {
  override render() {
    return html` <p>cron-picker</p> `
  }
}
