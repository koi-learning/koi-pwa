// Copyright (c) individual contributors.
// All rights reserved.
//
// This is free software; you can redistribute it and/or modify it
// under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 3 of
// the License, or any later version.
//
// This software is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details. A copy of the
// GNU Lesser General Public License is distributed along with this
// software and can be found at http://www.gnu.org/licenses/lgpl.html

import {
  customElement,
  property,
  html,
  css,
  LitElement,
  query,
} from "lit-element";
import { Model, User, ModelRole, ModelAccess } from "@src/store/interface";
import { store, RootState } from "@src/store/store";
import {
  changeModel,
  ModelEntityState,
  getModelPage,
  getModel,
} from "@src/store/model";
import { connect } from "pwa-helpers";
import { InfinityScroll } from "./infinity-scroll";
import { entityMap, entityFilter } from "@src/util";
import { getAllModelRole } from "@src/store/modelRole";
import {
  addModelAccess,
  getAllModelAccess,
  delModelAccess,
} from "@src/store/modelAccess";
import { AccessCards } from "./accessCards";
import { Router } from "@vaadin/router";
import { ListBase, ListItemBase } from "./list";
import { GraphicType } from "@material/mwc-list/mwc-list-item-base";

@customElement("model-details")
export class ModelDetails extends LitElement {
  @property() editable: boolean;
  @property() download: boolean;
  @property({ attribute: false }) model: Model;

  static get styles() {
    return css`
      mwc-textfield,
      mwc-textarea,
      koi-file-upload {
        width: 100%;
        margin: 10px 0px;
      }

      div {
        padding: 10px 10px;
      }

      div > div {
        padding: 0px 40px;
        text-align: left;
      }

      .state-icon {
        width: 100%;
        text-align: center;
        color: var(--mdc-theme-text-disabled-on-background);
        --mdc-icon-size: 24px;
      }

      .state-icon.active {
        color: var(--mdc-theme-secondary);
      }
    `;
  }

  renderStates() {
    return html`
      <span style="display: flex">
        <span
          class="${this.model.finalized ? "state-icon active" : "state-icon"}"
        >
          <mwc-icon>check_circle</mwc-icon>
          Finalized
        </span>
      </span>
    `;
  }

  renderNaming() {
    if (this.editable && !this.model.finalized) {
      return html`
        ${this.renderStates()}
        <mwc-textfield
          label="Name"
          value=${this.model.model_name}
          @change=${(e) => this.updateModel({ model_name: e.composedPath()[0].value })}
        ></mwc-textfield>
        <mwc-textarea
          label="Description"
          charCounter
          maxLength="500"
          value=${this.model.model_description}
          @change=${(e) =>
            this.updateModel({ model_description: e.composedPath()[0].value })}
        ></mwc-textarea>
      `;
    } else {
      return html`<div>
        <h2>${this.model.model_name}</h2>
        ${this.renderStates()}
        <p>${this.model.model_description}</p>
      </div>`;
    }
  }

  renderUpload() {
    if (this.editable && !this.model.finalized) {
      return html`<koi-file-upload
        label="Code"
        showUpload
        ?showDownload=${this.model.has_code && this.download}
        location=${`model/${this.model.model_uuid}/code`}
        filename=${`koi_model_code_${this.model.model_uuid}.zip`}
        @uploaded=${() => store.dispatch(getModel({ id: this.model }))}
      ></koi-file-upload>`;
    } else if (this.model.has_code || this.download) {
      return html`<koi-file-upload
        label="Code"
        showDownload
        location=${`model/${this.model.model_uuid}/code`}
        filename=${`koi_model_code_${this.model.model_uuid}.zip`}
      ></koi-file-upload>`;
    }
  }

  renderVisual() {
    if (this.editable) {
      return html`<koi-file-upload
        label="Visual Plugin"
        showUpload
        ?showDownload=${this.model.has_visual_plugin && this.download}
        location=${`model/${this.model.model_uuid}/visualplugin`}
        filename=${`koi_model_visual_${this.model.model_uuid}.js`}
        @uploaded=${() => store.dispatch(getModel({ id: this.model }))}
      >
      </koi-file-upload>`;
    } else if (this.model.has_visual_plugin && this.download) {
      return html`<koi-file-upload
        label="Visual Plugin"
        showDownload
        location=${`model/${this.model.model_uuid}/visualplugin`}
        filename=${`koi_model_visual_${this.model.model_uuid}.js`}
      >
      </koi-file-upload>`;
    }
  }

  renderLabel() {
    if (this.editable) {
      return html`<koi-file-upload
        label="Request Plugin"
        showUpload
        ?showDownload=${this.model.has_label_plugin && this.download}
        location=${`model/${this.model.model_uuid}/requestplugin`}
        filename=${`koi_model_request_${this.model.model_uuid}.js`}
        @uploaded=${() => store.dispatch(getModel({ id: this.model }))}
      >
      </koi-file-upload>`;
    } else if (this.model.has_label_plugin || this.download) {
      return html`<koi-file-upload
        label="Request Plugin"
        showDownload
        location=${`model/${this.model.model_uuid}/requestplugin`}
        filename=${`koi_model_request_${this.model.model_uuid}.js`}
      >
      </koi-file-upload>`;
    }
  }

  renderParameters() {
    return html`<h3>Parameters</h3>
      <parameter-list .model=${this.model} editable="False"></parameter-list>`;
  }

  render() {
    if (this.model) {
      return html`
        <div>
          ${this.renderNaming()} ${this.renderUpload()} ${this.renderVisual()}
          ${this.renderLabel()} ${this.renderParameters()}
        </div>
      `;
    }
  }

  updateModel(changes: Partial<Model>) {
    store.dispatch(changeModel({ id: this.model, data: changes }));
  }
}

@customElement("model-list-item")
export class ModelListItem extends ListItemBase {
  @property({ attribute: false }) model: Model;
  graphic: GraphicType = "control";

  action() {
    Router.go(`/model/${this.model.model_uuid}`);
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("model")) {
      this.selected = false;
    }
  }

  protected primaryText() {
    return html`${this.model.model_name}`;
  }

  protected secondaryText() {
    return html`${this.model.model_description.substring(0, 60)}`;
  }

  protected meta() {
    return html`
      <mwc-icon
        class="${this.model.finalized ? "state-icon active" : "state-icon"}"
        >check_circle</mwc-icon
      >
    `;
  }

  protected icon() {
    return html``;
  }
}

@customElement("model-list")
export class ModelList extends connect(store)(ListBase) {
  @property() models: ModelEntityState;

  @property({ attribute: false }) scrollTarget;

  @query("infinity-scroll")
  infinity_scroll: InfinityScroll;

  selection: ModelListItem[];

  stateChanged(state: RootState) {
    this.models = state.models;
  }

  render() {
    return html`
      <mwc-list multi>
        ${entityMap(
          this.models,
          (m) => html`<model-list-item .model=${m}></model-list-item>`
        )}
      </mwc-list>
      <paper-spinner ?active=${this.models.loading}></paper-spinner>
      <infinity-scroll
        .scrollTarget=${this.scrollTarget}
        @loadPage=${(e) => {
          store.dispatch(getModelPage(e.detail));
        }}
      ></infinity-scroll>
    `;
  }
}

@customElement("model-access-cards")
export class ModelAccessCards extends AccessCards {
  @property({ attribute: false }) model: Model;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(getAllModelRole({}));
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("model")) {
      store.dispatch(getAllModelAccess({ id: this.model }));
    }
  }

  stateChanged(state: RootState) {
    super.stateChanged(state);
    this.roles = state.modelRoles;
    this.access = entityFilter(
      state.modelAccess,
      (a) => a.model_uuid == this.model.model_uuid
    );
  }

  addAccess(role: ModelRole, user: User) {
    store.dispatch(
      addModelAccess({ id: this.model, data: { ...role, ...user } })
    );
  }

  removeAccess(access: ModelAccess) {
    store.dispatch(delModelAccess({ id: { ...this.model, ...access } }));
  }
}
