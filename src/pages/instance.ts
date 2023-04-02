import { TemplateResult, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { BasePage } from "./base";
("./base");
import { RouterLocation } from "@vaadin/router";
import { Instance, InstanceId } from "@src/store/interface";
import { RootState, store } from "@src/store/store";
import { router } from "..";
import { ConfirmDialog } from "@src/components/dialogs";
import {
  instanceKey,
  changeInstance,
  delInstance,
  getInstance,
} from "@src/store/instance";
import { hasInstanceRight, loadInstanceRights } from "@src/rightsHelper";

@customElement("koi-instance")
export class InstancePage extends BasePage {
  isSubPage = true;
  @property() location: RouterLocation = router.location;

  @property({ attribute: false }) instance: Instance;
  @property({ attribute: false }) scrollTarget: HTMLElement;

  @property({ attribute: false }) right: {
    edit: boolean;
    request: boolean;
    grant: boolean;
  } = {
    edit: false,
    request: false,
    grant: false,
  };

  private _instanceId: InstanceId;

  @query("#deleteDialog")
  deleteDialog: ConfirmDialog;
  @query("#finalizeDialog")
  finalizeDialog: ConfirmDialog;

  constructor() {
    super();
    this.availableTabs = [
      { name: "details", label: "Details" },
      { name: "rights", label: "Rights" },
      { name: "samples", label: "Samples" },
      { name: "requests", label: "Requests" },
    ];
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("location")) {
      this._instanceId = {
        model_uuid: this.location.params.model_id as string,
        instance_uuid: this.location.params.instance_id as string,
      };
      loadInstanceRights(this._instanceId, store.dispatch);
      this.instance =
        store.getState().instances.entities[instanceKey(this._instanceId)];
      store.dispatch(getInstance({ id: this._instanceId }));
    }
  }

  stateChanged(state: RootState) {
    if (this._instanceId)
      this.instance = state.instances.entities[instanceKey(this._instanceId)];
    this.right = {
      edit: hasInstanceRight(this.instance, "edit_instance", state),
      request: hasInstanceRight(this.instance, "response_labels", state),
      grant: hasInstanceRight(this.instance, "grant_access_instance", state),
    };

    this.availableTabs = [{ name: "details", label: "Details" }];
    if (this.right.grant)
      this.availableTabs.push({ name: "rights", label: "Rights" });
    this.availableTabs.push({ name: "samples", label: "Samples" });
    if (this.right.request)
      this.availableTabs.push({ name: "requests", label: "Requests" });
  }

  head(): TemplateResult {
    if (this.instance) {
      return html`Instance ${this.instance.instance_name}`;
    } else if (this._instanceId) {
      return html`Instance ${this._instanceId.instance_uuid} loading...`;
    } else {
      return html`Instance loading...`;
    }
  }

  actions(): TemplateResult {
    return html` ${this.instance && !this.instance.finalized
        ? html`
            <mwc-icon-button
              icon="check_circle"
              slot="actionItems"
              @click=${() => this.finalizeDialog.show()}
            ></mwc-icon-button>
          `
        : ""}
      <mwc-icon-button
        icon="delete"
        slot="actionItems"
        @click=${() => this.deleteDialog.show()}
      ></mwc-icon-button>`;
  }

  content() {
    return html`
      ${this.tabs()}

      <confirm-dialog id="deleteDialog" @confirm=${this.delete}>
        Are you sure you want to delete this instance?
      </confirm-dialog>

      <confirm-dialog id="finalizeDialog" @confirm=${this.finalize}>
        Are you sure you want to finalize this instance?
      </confirm-dialog>
    `;
  }

  static get styles() {
    return super.styles.concat(
      css`
        paper-card {
          max-width: var(--std-width);
          width: 100%;
        }

        mwc-icon {
          padding: 12px;
        }
      `
    );
  }

  tabs() {
    switch (this.activeTab) {
      case "details":
        return html`<paper-card
          ><instance-details
            .instance=${this.instance}
            .scrollTarget=${this.scrollTarget}
            .editable="${this.right.edit}"
          ></instance-details
        ></paper-card>`;
      case "rights":
        return html`<instance-access-cards
          .instance=${this.instance}
          .scrollTarget=${this.scrollTarget}
        ></instance-access-cards>`;
      case "samples":
        return html`<sample-cards
          .instance=${this.instance}
          .scrollTarget=${this.scrollTarget}
        ></sample-cards>`;
      case "requests":
        return html`<request-card
          .instance=${this.instance}
          .scrollTarget=${this.scrollTarget}
        ></request-card>`;
    }
  }

  delete() {
    store.dispatch(delInstance({ id: this.instance }));
  }

  finalize() {
    store.dispatch(
      changeInstance({ id: this.instance, data: { finalized: true } })
    );
  }
}
