import {
  customElement,
  TemplateResult,
  property,
  html,
  query,
  css,
} from "lit-element";
import { BasePage } from "./base";
import { Router, RouterLocation } from "@vaadin/router";
import { Model, ModelId } from "@src/store/interface";
import { RootState, store } from "@src/store/store";
import { modelKey, delModel, getModel, changeModel } from "@src/store/model";
import { router } from "..";
import { ConfirmDialog, InfoDialog } from "@src/components/dialogs";
import { addInstance } from "@src/store/instance";
import { hasModelRight, loadModelRights } from "@src/rightsHelper";

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
  @query("#finalizeDialog")
  finalizeDialog: ConfirmDialog;
  @query("#infoDialog")
  infoDialog: InfoDialog;

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
    if (this.right.edit) {
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

      <confirm-dialog id="finalizeDialog" @confirm=${this.finalize}>
        Are you sure you want to finalize this model?
      </confirm-dialog>

      <info-dialog id="infoDialog" @confirm=${this.finalize}>
        ${this.info}
      </info-dialog>
    `;
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
