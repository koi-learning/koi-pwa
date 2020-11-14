import { customElement, TemplateResult, html } from "lit-element";
import { BasePage } from "./base";

@customElement("page-access")
export class AccessPage extends BasePage {
  isSubPage = false;

  head() {
    return html`Access`;
  }

  actions() {
    return html``;
  }
  content(): TemplateResult {
    return html`<general-access-cards
      .scrollTarget=${this.scrollTarget}
    ></general-access-cards>`;
  }
  /*@property() roles: RootState['generalRoles'];
    @property() users: RootState['users'];
    @property() access: RootState['access'];

    @query('mwc-select') user_select: Select;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    infinityLoad(): void {}

    connectedCallback(): void {
        super.connectedCallback();
        store.dispatch(getGeneralRoles());
        store.dispatch(getAccesss());
        store.dispatch(getUsers());
    }

    stateChanged(state: RootState): void {
        this.roles = state.generalRoles;
        this.users = state.users;
        this.access = state.access;
    }

    static get styles(): CSSResult[] {
        return super.styles.concat(css`
            .grid {
                margin: 10px;
                text-align: center;
            }

            paper-card {
                width: 400px;
                margin: 10px;
                text-align: left;
            }

            .card-actions {
                text-align: end;
            }

            mwc-textfield,
            koi-file-upload,
            mwc-textarea {
                width: 100%;
                margin: 10px 0px;
            }

            .list-item {
                -webkit-font-smoothing: antialiased;
                font-family: var(
                    --mdc-typography-subtitle1-font-family,
                    var(--mdc-typography-font-family, Roboto, sans-serif)
                );
                font-size: var(--mdc-typography-subtitle1-font-size, 1rem);
                font-weight: var(--mdc-typography-subtitle1-font-weight, 400);
                letter-spacing: var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);
                text-transform: var(--mdc-typography-subtitle1-text-transform, inherit);
                line-height: 1.5rem;
                list-style-type: none;
                color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));
                margin: 0px;

                display: flex;
                align-items: center;
            }

            .divider {
                height: 0px;
                border-top-width: initial;
                border-right-width: initial;
                border-left-width: initial;
                border-top-color: initial;
                border-right-color: initial;
                border-left-color: initial;
                border-bottom-width: 1px;
                border-bottom-color: rgba(0, 0, 0, 0.12);
                margin: 0px;
                border-style: none none solid;
                border-image: initial;
                list-style-type: none;
            }

            .header > mwc-icon {
                position: absolute;
            }

            .header > span {
                margin-left: 50px;
                font-family: var(--mdc-typography-title-font-family);
                padding-bottom: 10px;
            }

            .list-item > mwc-icon-button {
                margin-left: auto;
            }

            .card-content {
                margin: 0;
                padding: 0px 16px;
            }
        `);
    }

    head(): TemplateResult {
        return html`Access Rights`;
    }

    actions(): TemplateResult {
        return html``;
    }

    content(): TemplateResult {
        const roles = this.roles.ids.map((id) => this.roles.entities[id]);
        return html`
            <div class="grid">
                ${roles.map(
                    (role) =>
                        html`<koi-access-role-card
                            .role=${role}
                            .access=${this.access}
                            .users=${this.users}
                            @addAccess=${(e) => store.dispatch(addAccess({ ...role, ...e.detail.user }))}
                            @removeAccess=${(e) => store.dispatch(deleteAccess(e.detail.access))}
                        ></koi-access-role-card>`,
                )}
            </div>
        `;
    }*/
}
