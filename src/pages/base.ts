import { connect } from "pwa-helpers";
import { store } from "@src/store/store";
import { LitElement, html, TemplateResult, css } from "lit";
import { property, query } from "lit/decorators.js";
import { installMediaQueryWatcher } from "pwa-helpers/media-query.js";
import { Drawer } from "@material/mwc-drawer";
import { TopAppBar } from "@material/mwc-top-app-bar";

export abstract class BasePage extends connect(store)(LitElement) {
  @property({ attribute: false }) smallScreen: boolean;
  @property({ attribute: false }) scrollTarget: HTMLElement;
  @property() activeTab = "details";

  @query("mwc-drawer")
  drawer: Drawer;

  @query("mwc-top-app-bar")
  appBar: TopAppBar;

  @query('[slot="appContent"]')
  appContent: HTMLElement;

  @query("main")
  main: HTMLElement;

  protected abstract isSubPage: boolean;
  protected availableTabs: Array<{ name: string; label: string }> = [];

  static get styles() {
    return [
      css`
        [slot="appContent"] {
          height: 100%;
          overflow: auto;
          display: flex;
          flex-direction: column;

          --std-width: 600px;
          --card-width: 300px;

          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none;
        }

        [slot="appContent"]::-webkit-scrollbar {
          display: none;
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;

          text-align: center;
          align-items: center;

          background: #e1e2e1;
        }

        mwc-fab {
          position: fixed;
          bottom: 20px;
          right: 30px;
        }

        mwc-tab-bar {
          width: 100%;
        }
        mwc-tab {
          --mdc-tab-text-label-color-default: var(--dark-theme-text-color);
          --mdc-theme-primary: var(--mdc-theme-secondary);
        }
      `,
    ];
  }

  constructor() {
    super();
    installMediaQueryWatcher(`(min-width: 800px)`, (matches) => {
      this.smallScreen = !matches;
    });
  }

  toggleDrawer() {
    this.drawer.open = !this.drawer.open;
  }

  goBack() {
    history.back();
  }

  render() {
    let navigationIcon = this.smallScreen
      ? html`<mwc-icon-button
          icon="menu"
          slot="navigationIcon"
          @click=${this.toggleDrawer}
        ></mwc-icon-button>`
      : html``;
    if (this.isSubPage) {
      navigationIcon = html`<mwc-icon-button
        icon="arrow_back"
        slot="navigationIcon"
        @click=${this.goBack}
      ></mwc-icon-button>`;
    }
    return html`
      <mwc-drawer type=${this.smallScreen ? "modal" : ""}>
        <koi-navigation></koi-navigation>
        <div slot="appContent">
          <mwc-top-app-bar>
            ${navigationIcon}
            <div slot="title">${this.head()}</div>
            ${this.actions()}
            ${this.availableTabs.length == 0
              ? null
              : html`
                  <mwc-tab-bar
                    slot="tabs"
                    @MDCTabBar:activated=${(e) =>
                      (this.activeTab =
                        this.availableTabs[e.detail.index].name)}
                  >
                    ${this.availableTabs.map(
                      (t) => html`<mwc-tab label="${t.label}"></mwc-tab>`
                    )}
                  </mwc-tab-bar>
                `}
          </mwc-top-app-bar>
          <main>${this.content()}</main>
        </div>
      </mwc-drawer>
    `;
  }

  firstUpdated() {
    this.appBar.scrollTarget = this.appContent;
    this.scrollTarget = this.appContent;

    if (this.availableTabs.length > 0) {
      const observer = new MutationObserver(() => {
        const div = document.createElement("div");
        div.className = "mdc-top-app-bar__row";
        div.style.height = "48px";
        const slot = document.createElement("slot");
        slot.name = "tabs";
        div.appendChild(slot);
        (
          this.appBar.shadowRoot.lastElementChild as HTMLElement
        ).style.paddingTop = "112px";
        this.appBar.shadowRoot.firstElementChild.appendChild(div);
        observer.disconnect();
      });
      observer.observe(this.appBar.shadowRoot, { childList: true });
    }
  }

  abstract head(): TemplateResult;
  abstract actions(): TemplateResult;
  abstract content(): TemplateResult;
}
