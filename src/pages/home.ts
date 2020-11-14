import { html, customElement, css } from "lit-element";
import { BasePage } from "./base";

@customElement("page-home")
export class Home extends BasePage {
  isSubPage = false;

  static get styles() {
    return super.styles.concat(css`
      paper-card {
        margin: auto;
      }
    `);
  }

  head() {
    return html`Welcome`;
  }
  actions() {
    return html``;
  }
  content() {
    return html`<paper-card>
      <div class="card-content">
        <h1>Welcome to the KOI PWA</h1>
      </div>
    </paper-card>`;
  }
}
