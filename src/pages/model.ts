import { TemplateResult, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { BasePage } from "./base";
import { Router, RouterLocation } from "@vaadin/router";
import { Instance, Model, ModelId } from "@src/store/interface";
import { RootState, store } from "@src/store/store";
import { modelKey, delModel, getModel, changeModel } from "@src/store/model";
import { router } from "..";
import { ConfirmDialog, InfoDialog } from "@src/components/dialogs";
import {
  addInstance,
  delInstance,
  InstanceEntityState,
} from "@src/store/instance";
import { hasModelRight, loadModelRights } from "@src/rightsHelper";
import { InstanceList } from "@src/components/instance";
import { entityFilter, entityMap } from "@src/util";
import { authenticatedJsonPOST } from "@src/api-helper";
import { Select } from "@material/mwc-select";

@customElement("koi-model")
export class ModelPage extends BasePage {
  isSubPage = true;
  @property() location: RouterLocation = router.location;

  @property() info: TemplateResult = html``;

  @property({ attribute: false }) model: Model;
  @property({ attribute: false }) right: {
    edit: boolean;
    instantiate: boolean;
    download: boolean;
    grant: boolean;
  } = {
    edit: false,
    instantiate: false,
    download: false,
    grant: false,
  };

  private _modelId: ModelId;

  @query("#deleteDialog")
  deleteDialog: ConfirmDialog;
  @query("#deleteInstancesDialog")
  deleteInstancesDialog: ConfirmDialog;
  @query("#mergeInstancesDialog")
  mergeInstancesDialog: ConfirmDialog;
  @query("#finalizeDialog")
  finalizeDialog: ConfirmDialog;
  @query("#infoDialog")
  infoDialog: InfoDialog;
  @query("#mergeSelect") mergeSelect: Select;

  @property()
  private selectionMode = false;

  @query("instance-list")
  list: InstanceList;
  instances: InstanceEntityState;

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

  constructor() {
    super();
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("location")) {
      this._modelId = { model_uuid: this.location.params.id as string };
      loadModelRights(this._modelId, store.dispatch);

      this.model = store.getState().models.entities[modelKey(this._modelId)];
      store.dispatch(getModel({ id: this._modelId }));
    }
  }

  stateChanged(state: RootState) {
    this.instances = state.instances;
    if (this._modelId)
      this.model = state.models.entities[modelKey(this._modelId)];
    this.right = {
      edit: hasModelRight(this.model, "edit_model", state),
      download: hasModelRight(this.model, "download_model", state),
      grant: hasModelRight(this.model, "grant_access_model", state),
      instantiate: hasModelRight(this.model, "instantiate_model", state),
    };
    if (this.right.grant) {
      this.availableTabs = [
        { name: "details", label: "Details" },
        { name: "rights", label: "Rights" },
        { name: "instances", label: "Instances" },
      ];
    } else {
      this.availableTabs = [
        { name: "details", label: "Details" },
        { name: "instances", label: "Instances" },
      ];
    }
  }

  head(): TemplateResult {
    if (this.model) {
      return html`Model ${this.model.model_name}`;
    } else if (this._modelId) {
      return html`Model ${this._modelId.model_uuid} loading...`;
    } else {
      return html`Model loading...`;
    }
  }

  actions(): TemplateResult {
    if (this.selectionMode) {
      return html`
        <mwc-icon-button
          icon="mediation"
          slot="actionItems"
          @click=${() => this.mergeInstancesDialog.show()}
        ></mwc-icon-button>
        <mwc-icon-button
          icon="delete_sweep"
          slot="actionItems"
          @click=${() => this.deleteInstancesDialog.show()}
        ></mwc-icon-button>
      `;
    } else if (this.right.edit) {
      return html` ${this.model && !this.model.finalized
          ? html`<mwc-icon-button
              icon="check_circle"
              slot="actionItems"
              @click=${() => this.finalizeDialog.show()}
            ></mwc-icon-button>`
          : ""}
        <mwc-icon-button
          icon="delete"
          slot="actionItems"
          @click=${() => this.deleteDialog.show()}
        ></mwc-icon-button>`;
    } else if (this.model && this.model.finalized) {
      return html`<mwc-icon-button
        style="--mdc-theme-text-disabled-on-light: var(--mdc-theme-secondary);"
        icon="check_circle"
        slot="actionItems"
        disabled}
      ></mwc-icon-button>`;
    }
  }

  content() {
    return html`
      ${this.tabs()}

      <confirm-dialog id="deleteDialog" @confirm=${this.delete}>
        Are you sure you want to delete this model?
      </confirm-dialog>

      <confirm-dialog
        id="deleteInstancesDialog"
        @confirm=${this.deleteInstances}
      >
        Are you sure you want to delete the selected instances?
      </confirm-dialog>

      <confirm-dialog id="mergeInstancesDialog" @confirm=${this.mergeInstances}>
        Select the instance in which the selected instances will be merged.

        <mwc-select
          style="width: 100%;"
          id="mergeSelect"
          fixedMenuPosition
          label="merge into instance"
          @closing=${(e) => {
            e.stopPropagation();
          }}
          >${this.model
            ? entityMap(
                entityFilter(
                  this.instances,
                  (i) =>
                    i.finalized &&
                    i.model_uuid == this.model.model_uuid &&
                    this.list &&
                    this.list.selection &&
                    this.list.selection.find(
                      (s) => s.instance.instance_uuid == i.instance_uuid
                    ) === undefined
                ),
                this.renderInstanceOptions
              )
            : ""}</mwc-select
        >
      </confirm-dialog>

      <confirm-dialog id="finalizeDialog" @confirm=${this.finalize}>
        Are you sure you want to finalize this model?
      </confirm-dialog>

      <info-dialog id="infoDialog" @confirm=${this.finalize}>
        ${this.info}
      </info-dialog>
    `;
  }

  renderInstanceOptions(i: Instance): TemplateResult {
    return html`<mwc-list-item value=${i.instance_uuid}
      >${i.instance_name}</mwc-list-item
    >`;
  }

  tabs() {
    switch (this.activeTab) {
      case "details":
        return html`<paper-card>
          <model-details
            .model=${this.model}
            .scrollTarget=${this.scrollTarget}
            .editable=${this.right.edit}
            .download=${this.right.download}
          ></model-details>
        </paper-card>`;
      case "rights":
        return html`<model-access-cards
          .model=${this.model}
          .scrollTarget=${this.scrollTarget}
        ></model-access-cards>`;
      case "instances":
        return html`<paper-card>
            <instance-list
              .model=${this.model}
              .scrollTarget=${this.scrollTarget}
              @selectionMode=${(event) => {
                this.selectionMode = event.detail.selectionModeActive;
              }}
            ></instance-list>
          </paper-card>
          ${this.right.instantiate
            ? html` <mwc-fab
                icon="add"
                @click=${() => store.dispatch(addInstance({ id: this.model }))}
              ></mwc-fab>`
            : null}`;
    }
  }

  delete() {
    store.dispatch(
      delModel({ id: this.model, fullfilled: () => Router.go(`/model`) })
    );
  }

  deleteInstances() {
    for (const listItem of this.list.selection) {
      store.dispatch(delInstance({ id: listItem.instance }));
    }
  }

  mergeInstances() {
    authenticatedJsonPOST(
      store.dispatch,
      `model/${this.model.model_uuid}/instance/${this.mergeSelect.value}/merge`,
      {
        instance_uuid: this.list.selection.map((i) => i.instance.instance_uuid),
      }
    );
  }

  requestFinialize() {
    if (!this.model.has_code) {
      this.info = html`Model code needs to be present to finalize this Model`;
      this.infoDialog.show();
    } else {
      this.finalizeDialog.show();
    }
  }

  finalize() {
    store.dispatch(changeModel({ id: this.model, data: { finalized: true } }));
  }
}
