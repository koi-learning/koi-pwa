import { LitElement, html, customElement, property, css } from "lit-element";
import { store, RootState } from "@src/store/store";
import { connect } from "pwa-helpers";
import { login } from "@src/store/api";
import { TextField } from "@material/mwc-textfield";

const logo = html` <svg
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
    <text
      id="text817"
      y="124.34388"
      x="83.388092"
      style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"
      xml:space="preserve"
    >
      <tspan
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:Verdana;-inkscape-font-specification:Verdana;stroke-width:0.26458332"
        y="124.34388"
        x="83.388092"
        id="tspan815"
      >
        KOI
      </tspan>
    </text>
    <g
      style="stroke-width:1.35561824"
      transform="matrix(0.73977845,0.05004713,-0.04953565,0.73221801,30.803972,28.639036)"
      id="g841"
    >
      <path
        style="fill:#29588c;fill-opacity:1;stroke:none;stroke-width:0.35867396px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="m 83.287374,129.42347 c 1.983644,2.03031 8.755318,3.49648 16.941186,-2.97271 3.55902,-2.81265 6.76833,2.11523 1.45525,4.38943 -9.384862,4.09886 -10.950695,1.132 -17.149249,-5.54257 l 1.569216,3.76256 z"
        id="path819"
      />
      <path
        style="fill:#29588c;fill-opacity:1;stroke:none;stroke-width:0.35867396px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="m 101.89797,130.20839 c 0.31693,1.25886 0.29136,2.50465 -1.04127,3.70061 0.41399,-2.10956 0.17754,-2.67945 -0.16486,-2.99853"
        id="path821"
      />
      <path
        style="fill:#29588c;fill-opacity:1;stroke:none;stroke-width:0.35867396px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
        d="m 99.49777,127.42301 c -0.980873,-0.85031 -2.104433,-1.38907 -3.772716,-0.73854 2.069697,0.58136 2.471853,1.04927 2.602346,1.49873"
        id="path821-8"
      />
    </g>
    <text
      id="text845"
      y="121.4773"
      x="64.161461"
      style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10.58333302px;line-height:1.25;font-family:'Segoe Print';-inkscape-font-specification:'Segoe Print';letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"
      xml:space="preserve"
    >
      <tspan
        style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-family:'Segoe Print';-inkscape-font-specification:'Segoe Print';stroke-width:0.26458332"
        y="130.55632"
        x="64.161461"
        id="tspan843"
      />
    </text>
  </g>
</svg>`;

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
        height: 100vh;
        display: block;
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
    `;
  }

  render() {
    return html`
      <mwc-dialog scrimClickAction escapeKeyAction defaultAction open>
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
        <div class="actionWrapper" slot="primaryAction">
          ${this.isLoggingIn
            ? html`<paper-spinner active></paper-spinner>`
            : html`<mwc-button @click=${this.login}>Login</mwc-button>`}
        </div>
      </mwc-dialog>
    `;
  }

  login() {
    const user = (this.renderRoot.querySelector("#user") as TextField).value;
    const password = (this.renderRoot.querySelector("#password") as TextField)
      .value;

    store.dispatch(login(user, password));
  }
}
