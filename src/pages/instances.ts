import { html, customElement, css } from "lit-element";
import { BasePage } from "./base";

@customElement("koi-instances")
export class KoiInstances extends BasePage {
  isSubPage = false;
  head() {
    return html`Instances`;
  }

  actions() {
    return html``;
  }

  content() {
    return html` <paper-card>
      <instance-list .scrollTarget=${this.scrollTarget}></instance-list>
    </paper-card>`;
  }

  static get styles() {
    return super.styles.concat(
      css`
        paper-card {
          max-width: var(--std-width);
          width: 100%;
        }
      `
    );
  }
}
