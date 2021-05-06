import { ConfirmDialog } from "@src/components/dialogs";
import { InstanceList } from "@src/components/instance";
import { delInstance } from "@src/store/instance";
import { store } from "@src/store/store";
import { html, customElement, css, property, query } from "lit-element";
import { BasePage } from "./base";

@customElement("koi-instances")
export class KoiInstances extends BasePage {
  isSubPage = false;

  @property()
  private selectionMode = false;

  @query("#deleteDialog")
  deleteDialog: ConfirmDialog;

  @query("instance-list")
  list: InstanceList;

  head() {
    return html`Instances`;
  }

  actions() {
    return this.selectionMode
      ? html` <mwc-icon-button
          icon="delete_sweep"
          slot="actionItems"
          @click=${() => this.deleteDialog.show()}
        ></mwc-icon-button>`
      : html``;
  }

  content() {
    return html` <paper-card>
        <instance-list
          .scrollTarget=${this.scrollTarget}
          @selectionMode=${(event) => {
            this.selectionMode = event.detail.selectionModeActive;
          }}
        ></instance-list>
      </paper-card>
      <confirm-dialog id="deleteDialog" @confirm=${this.delete}>
        Are you sure you want to delete the selected instances?
      </confirm-dialog>`;
  }

  delete() {
    for (const listItem of this.list.selection) {
      store.dispatch(delInstance({ id: listItem.instance }));
    }
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
