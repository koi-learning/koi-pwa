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
  LitElement,
  property,
  query,
  html,
  css,
} from "lit-element";
import { connect } from "pwa-helpers";
import { store, RootState } from "@src/store/store";
import {
  Model,
  ModelId,
  Instance,
  ModelRole,
  User,
  ModelAccess,
} from "@src/store/interface";
import { ModelEntityState, getModelPage } from "@src/store/model";
import {
  InstanceEntityState,
  getInstancePage,
  changeInstance,
} from "@src/store/instance";
import { InfinityScroll } from "./infinity-scroll";
import { entityFilter, entityFind, entityMap, templateJoin } from "@src/util";
import { AccessCards } from "./accessCards";
import {
  getAllInstanceAccess,
  addInstanceAccess,
  delInstanceAccess,
} from "@src/store/instanceAccess";
import { getAllInstanceRole } from "@src/store/instanceRole";
import { Router } from "@vaadin/router";
import { ListBase, ListItemBase } from "./list";

@customElement("instance-details")
export class InstanceDetails extends LitElement {
  @property({ attribute: false }) instance: Instance;
  @property() editable: boolean;

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
          class="${this.instance.has_requests
            ? "state-icon active"
            : "state-icon"}"
        >
          <mwc-icon>quickreply</mwc-icon>
          Requests
        </span>
        <span
          class="${this.instance.has_inference
            ? "state-icon active"
            : "state-icon"}"
        >
          <mwc-icon>label_important</mwc-icon>
          Inference Data
        </span>
        <span
          class="${this.instance.has_training
            ? "state-icon active"
            : "state-icon"}"
        >
          <mwc-icon>model_training</mwc-icon>
          Training Data
        </span>
        <span
          class="${this.instance.finalized
            ? "state-icon active"
            : "state-icon"}"
        >
          <mwc-icon>check_circle</mwc-icon>
          Finalized
        </span>
      </span>
    `;
  }

  renderNaming() {
    if (this.editable && !this.instance.finalized) {
      return html`
        ${this.renderStates()}
        <mwc-textfield
          label="Name"
          value=${this.instance.instance_name}
          @change=${(e) =>
            this.updateInstance({ instance_name: e.composedPath()[0].value })}
        >
        </mwc-textfield>
        <mwc-textarea
          label="Description"
          charCounter
          maxLength="500"
          value=${this.instance.instance_description}
          @change=${(e) =>
            this.updateInstance({
              instance_description: e.composedPath()[0].value,
            })}
        >
        </mwc-textarea>
      `;
    } else {
      return html`<div>
        <h2>${this.instance.instance_name}</h2>
        ${this.renderStates()}
        <p>${this.instance.instance_description}</p>
      </div>`;
    }
  }

  renderParameters() {
    return html`<h3>Parameters</h3>
      <parameter-list .instance=${this.instance}></parameter-list>`;
  }

  render() {
    if (this.instance) {
      return html`
        <div>${this.renderNaming()}${this.renderParameters()}</div>
      `;
    }
  }

  updateInstance(changes: Partial<Instance>) {
    store.dispatch(changeInstance({ id: this.instance, data: changes }));
  }
}

@customElement("instance-list-item")
export class InstanceListItem extends ListItemBase {
  @property({ attribute: false }) instance: Instance;

  action() {
    Router.go(
      `/model/${this.instance.model_uuid}/instance/${this.instance.instance_uuid}`
    );
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("instance")) {
      this.selected = false;
    }
  }

  protected primaryText() {
    return html`${this.instance.instance_name}`;
  }

  protected secondaryText() {
    return html`${this.instance.instance_description.substring(0, 60)}`;
  }

  protected meta() {
    return html`
      <mwc-icon
        class="${this.instance.has_requests
          ? "state-icon active"
          : "state-icon"}"
        >quickreply</mwc-icon
      >
      <mwc-icon
        class="${this.instance.has_inference
          ? "state-icon active"
          : "state-icon"}"
        >label_important</mwc-icon
      >
      <mwc-icon
        class="${this.instance.has_training
          ? "state-icon active"
          : "state-icon"}"
        >model_training</mwc-icon
      >
      <mwc-icon
        class="${this.instance.finalized ? "state-icon active" : "state-icon"}"
        >check_circle</mwc-icon
      >
    `;
  }

  protected icon() {
    return html`<mwc-icon slot="graphic">text_snippet</mwc-icon>`;
  }
}

@customElement("instance-list")
export class InstanceList extends connect(store)(ListBase) {
  @property() model: Model;
  @property() models: ModelEntityState;
  @property() instances: InstanceEntityState;

  @property({ attribute: false }) scrollTarget;

  @query("infinity-scroll")
  infinity_scroll: InfinityScroll;

  selection: InstanceListItem[];

  stateChanged(state: RootState) {
    this.models = state.models;
    this.instances = state.instances;
  }

  instancesForModel = (m: Model) => {
    const modelInstances = entityFilter(
      this.instances,
      (i) => i.model_uuid == m.model_uuid
    );
    return entityMap(
      modelInstances,
      (i) => html`<instance-list-item .instance=${i}></instance-list-item>`
    );
  };

  modelSection = (m: Model) => {
    return [
      html`<mwc-list-item noninteractive
        ><span>${m.model_name}</span></mwc-list-item
      >`,
    ].concat(this.instancesForModel(m));
  };

  render() {
    if (this.model) {
      return html`
        <mwc-list multi> ${this.instancesForModel(this.model)} </mwc-list>
        <paper-spinner ?active=${this.models.loading}></paper-spinner>
        <infinity-scroll
          .scrollTarget=${this.scrollTarget}
          @loadPage=${(e) =>
            store.dispatch(getInstancePage({ id: this.model, ...e.detail }))}
        ></infinity-scroll>
      `;
    } else {
      return html`
        <mwc-list multi>
          ${templateJoin(
            entityMap(
              entityFilter(
                this.models,
                (m) =>
                  entityFind(
                    this.instances,
                    (i) => i.model_uuid == m.model_uuid
                  ) != null
              ),
              this.modelSection
            ),
            html`<li divider padded role="separator"></li>`
          )}
        </mwc-list>
        <paper-spinner ?active=${this.models.loading}></paper-spinner>
        <infinity-scroll
          .scrollTarget=${this.scrollTarget}
          subPages="1"
          @loadPage=${this.loadPage}
        ></infinity-scroll>
      `;
    }
  }

  loadPage = (e) => {
    switch (e.detail.subpage) {
      case 0:
        store.dispatch(getModelPage(e.detail));
        break;
      case 1:
        if (e.detail.count[0] < this.models.ids.length) {
          const id: ModelId = {
            model_uuid: this.models.ids[e.detail.count[0]] as string,
          };
          store.dispatch(getInstancePage({ id: id, ...e.detail }));
        } else {
          e.detail.noparent();
        }
    }
  };
}

@customElement("instance-access-cards")
export class ModelAccessCards extends AccessCards {
  @property({ attribute: false }) instance: Instance;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(getAllInstanceRole({}));
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("instance")) {
      store.dispatch(getAllInstanceAccess({ id: this.instance }));
    }
  }

  stateChanged(state: RootState) {
    super.stateChanged(state);
    this.roles = state.instanceRoles;
    this.access = entityFilter(
      state.instanceAccess,
      (a) => a.instance_uuid == this.instance.instance_uuid
    );
  }

  addAccess(role: ModelRole, user: User) {
    store.dispatch(
      addInstanceAccess({ id: this.instance, data: { ...role, ...user } })
    );
  }

  removeAccess(access: ModelAccess) {
    store.dispatch(delInstanceAccess({ id: { ...this.instance, ...access } }));
  }
}
