import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { store, RootState } from "@src/store/store";
import { connect } from "pwa-helpers";
import { login } from "@src/store/api";
import { TextField } from "@material/mwc-textfield";

const logo = html`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    id="svg8"
    version="1.1"
    viewBox="0 0 38.252113 35.248142"
    style="display: block;"
  >
    <defs id="defs2" />
    <g transform="translate(-74.447459,-106.48906)" id="layer1">
      <g
        aria-label="KOI"
        id="text817"
        style="font-style:normal;font-weight:normal;font-size:10.5833px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.264583"
      >
        <path
          d="m 90.607267,124.34388 h -1.32808 l -3.043733,-3.42614 -0.764808,0.81649 v 2.60965 h -1.02319 v -7.6946 h 1.02319 v 4.01525 l 3.736194,-4.01525 h 1.24023 l -3.436472,3.61734 z"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Verdana;-inkscape-font-specification:Verdana;stroke-width:0.264583"
          id="path840"
        />
        <path
          d="m 97.387193,117.53295 q 0.470254,0.51676 0.7183,1.26607 0.253214,0.7493 0.253214,1.70015 0,0.95084 -0.258382,1.70531 -0.253213,0.74931 -0.713132,1.25057 -0.475422,0.52193 -1.126543,0.78548 -0.645953,0.26355 -1.477941,0.26355 -0.811317,0 -1.477941,-0.26872 -0.661456,-0.26872 -1.126543,-0.78031 -0.465086,-0.5116 -0.7183,-1.25574 -0.248046,-0.74413 -0.248046,-1.70014 0,-0.94051 0.248046,-1.68465 0.248046,-0.74931 0.723468,-1.28157 0.454751,-0.50643 1.126542,-0.77515 0.67696,-0.26871 1.472774,-0.26871 0.82682,0 1.483109,0.27388 0.661456,0.26872 1.121375,0.76998 z m -0.09302,2.96622 q 0,-1.49862 -0.671792,-2.30993 -0.671791,-0.81649 -1.834507,-0.81649 -1.173052,0 -1.844843,0.81649 -0.666624,0.81131 -0.666624,2.30993 0,1.51411 0.682127,2.32026 0.682127,0.80098 1.82934,0.80098 1.147213,0 1.824172,-0.80098 0.682127,-0.80615 0.682127,-2.32026 z"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Verdana;-inkscape-font-specification:Verdana;stroke-width:0.264583"
          id="path842"
        />
        <path
          d="m 102.69435,124.34388 h -3.038568 v -0.78548 h 1.007688 v -6.12364 h -1.007688 v -0.78548 h 3.038568 v 0.78548 h -1.00769 v 6.12364 h 1.00769 z"
          style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Verdana;-inkscape-font-specification:Verdana;stroke-width:0.264583"
          id="path844"
        />
      </g>
      <g
        style="stroke-width:1.35562"
        transform="matrix(0.73977845,0.05004713,-0.04953565,0.73221801,30.803972,28.639036)"
        id="g841"
      >
        <path
          style="fill:#29588c;fill-opacity:1;stroke:none;stroke-width:0.358674px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
          d="m 83.287374,129.42347 c 1.983644,2.03031 8.755318,3.49648 16.941186,-2.97271 3.55902,-2.81265 6.76833,2.11523 1.45525,4.38943 -9.384862,4.09886 -10.950695,1.132 -17.149249,-5.54257 l 1.569216,3.76256 z"
          id="path819"
        />
        <path
          style="fill:#29588c;fill-opacity:1;stroke:none;stroke-width:0.358674px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
          d="m 101.89797,130.20839 c 0.31693,1.25886 0.29136,2.50465 -1.04127,3.70061 0.41399,-2.10956 0.17754,-2.67945 -0.16486,-2.99853"
          id="path821"
        />
        <path
          style="fill:#29588c;fill-opacity:1;stroke:none;stroke-width:0.358674px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
          d="m 99.49777,127.42301 c -0.980873,-0.85031 -2.104433,-1.38907 -3.772716,-0.73854 2.069697,0.58136 2.471853,1.04927 2.602346,1.49873"
          id="path821-8"
        />
      </g>
    </g>
  </svg> `;

@customElement("page-login")
export class LoginPage extends connect(store)(LitElement) {
  @property({ attribute: false }) isLoggingIn: boolean;

  stateChanged(state: RootState) {
    this.isLoggingIn = state.api.isLoggingIn;
  }

  static get styles() {
    return css`
      :host {
        background: linear-gradient(90deg, #5c6bc0, #8e99f3);
        height: 100%;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 500px;
      }

      .loginBox {
        border-radius: 4px;
        background-color: var(--mdc-theme-surface, #fff);
        box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
          0px 24px 38px 3px rgba(0, 0, 0, 0.14),
          0px 9px 46px 8px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        flex-grow: 0;
        flex-shrink: 0;
        box-sizing: border-box;
        width: 280px;
      }

      .content {
        padding: 20px 24px;
      }

      mwc-dialog {
        --mdc-dialog-scrim-color: transparent;
      }

      mwc-textfield {
        width: 100%;
        margin: 5px 0px;
      }

      .actionWrapper {
        overflow: hidden;
      }

      .footer {
        display: flex;
        justify-content: flex-end;
        padding: 8px;
        height: 37px;
      }
    `;
  }

  render() {
    return html` <div class="loginBox">
      <div class="content">
        ${logo}
        <mwc-textfield
          id="user"
          label="User"
          ?disabled=${this.isLoggingIn}
        ></mwc-textfield
        ><br />
        <mwc-textfield
          id="password"
          label="Password"
          type="password"
          ?disabled=${this.isLoggingIn}
          @keyup=${(e: { keyCode: number }) => {
            if (e.keyCode === 13) this.login();
          }}
        ></mwc-textfield>
      </div>
      <div class="footer">
        <div class="actionWrapper" slot="primaryAction">
          ${this.isLoggingIn
            ? html`<paper-spinner active></paper-spinner>`
            : html`<mwc-button @click=${this.login}>Login</mwc-button>`}
        </div>
      </div>
    </div>`;
  }

  login() {
    const user = (this.renderRoot.querySelector("#user") as TextField).value;
    const password = (this.renderRoot.querySelector("#password") as TextField)
      .value;

    store.dispatch(login(user, password));
  }
}
