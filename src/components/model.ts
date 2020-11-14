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
import { changeModel, ModelEntityState, getModelPage } from "@src/store/model";
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
        width: 100%;
        text-align: left;
      }
    `;
  }

  renderNaming() {
    if (this.editable && !this.model.finalized) {
      return html`<mwc-textfield
          label="Name"
          value=${this.model.model_name}
          @change=${(e) => this.updateModel({ model_name: e.path[0].value })}
        ></mwc-textfield>
        <mwc-textarea
          label="Description"
          charCounter
          maxLength="500"
          value=${this.model.model_description}
          @change=${(e) =>
            this.updateModel({ model_description: e.path[0].value })}
        ></mwc-textarea> `;
    } else {
      return html`<div>
        <h2>${this.model.model_name}</h2>
        <p>${this.model.model_description}</p>
      </div>`;
    }
  }

  renderUpload() {
    if (this.editable && !this.model.finalized) {
      return html`<koi-file-upload
        label="Code"
        showUpload
        ?showDownload=${this.model.has_code || this.download}
        location=${`model/${this.model.model_uuid}/code`}
        filename=${`koi_model_code_${this.model.model_uuid}.zip`}
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
        ?showDownload=${this.model.has_visual_plugin || this.download}
        location=${`model/${this.model.model_uuid}/visualplugin`}
        filename=${`koi_model_visual_${this.model.model_uuid}.js`}
      >
      </koi-file-upload>`;
    } else if (this.model.has_visual_plugin || this.download) {
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
        ?showDownload=${this.model.has_label_plugin || this.download}
        location=${`model/${this.model.model_uuid}/requestplugin`}
        filename=${`koi_model_request_${this.model.model_uuid}.js`}
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

  render() {
    if (this.model) {
      return html`
        <div>
          ${this.renderNaming()} ${this.renderUpload()} ${this.renderVisual()}
          ${this.renderLabel()}
        </div>
      `;
    }
  }

  updateModel(changes: Partial<Model>) {
    store.dispatch(changeModel({ id: this.model, data: changes }));
  }
}

@customElement("model-list-item")
export class ModelListItem extends LitElement {
  @property({ attribute: false }) model: Model;
  render() {
    return html`
      <mwc-list-item
        ?hasMeta=${this.model.finalized}
        twoline
        @request-selected=${() => Router.go(`/model/${this.model.model_uuid}`)}
        style="text-align: left;"
      >
        <span>${this.model.model_name}</span>
        <span slot="secondary"
          >${this.model.model_description.substring(0, 60)}</span
        >
        <mwc-icon slot="meta" style="color: var(--mdc-theme-secondary);"
          >check_circle</mwc-icon
        >
      </mwc-list-item>
    `;
  }
}

@customElement("model-list")
export class ModelList extends connect(store)(LitElement) {
  @property() models: ModelEntityState;

  @property({ attribute: false }) scrollTarget;

  @query("infinity-scroll")
  infinity_scroll: InfinityScroll;

  stateChanged(state: RootState) {
    this.models = state.models;
  }

  render() {
    return html`
      <mwc-list>
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
