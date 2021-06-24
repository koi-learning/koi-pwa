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
  TemplateResult,
} from "lit-element";
import { connect } from "pwa-helpers";
import { store, RootState } from "@src/store/store";
import {
  Instance,
  InstanceParam,
  Model,
  ModelId,
  ModelParam,
} from "@src/store/interface";
import { InfinityScroll } from "./infinity-scroll";
import { entityFilter, entityMap } from "@src/util";
import { ListItem } from "@material/mwc-list/mwc-list-item";
import { getModelParams, ModelParamEntityState } from "@src/store/modelParam";
import { ConfirmDialog } from "./dialogs";
import {
  changeInstanceParam,
  getInstanceParams,
  InstanceParamEntityState,
} from "@src/store/instanceParam";
import { EntityState } from "@reduxjs/toolkit";
import { TextField } from "@material/mwc-textfield";

@customElement("parameter-list-item")
export class ParameterListItem extends LitElement {
  @property({ attribute: false }) parameter: ModelParam | InstanceParam;

  @query("confirm-dialog")
  confirmDialog: ConfirmDialog;

  @query("mwc-textfield")
  value_field: TextField;

  @query("mwc-list-item")
  listItem: ListItem;

  static get styles() {
    return css`
      .meta {
        color: var(--mdc-theme-text-primary-on-background, black);
        font-size: 18px;
      }
    `;
  }

  change() {
    store.dispatch(
      changeInstanceParam({
        id: this.parameter as InstanceParam,
        data: { value: this.value_field.value },
      })
    );
  }

  render() {
    return html`
      <confirm-dialog @confirm=${this.change}>
        <div>
          <p>Parameter: ${this.parameter.name}</p>
          <p>Description: ${this.parameter.description}</p>
          <mwc-textfield
            label="Value"
            value=${(this.parameter as InstanceParam).value}
          ></mwc-textfield>
        </div>
      </confirm-dialog>
      <mwc-list-item
        hasMeta
        twoline
        @request-selected=${() => this.confirmDialog.show()}
        style="text-align: left;"
        graphic="avatar"
      >
        <mwc-icon slot="graphic">settings</mwc-icon>
        <span>${this.parameter.name}</span>
        <span slot="secondary"
          >${this.parameter.description.substring(0, 60)}</span
        >
        <span slot="meta" class="meta"> ${this.value()} </span>
      </mwc-list-item>
    `;
  }
  value() {
    return (this.parameter as InstanceParam).value;
  }

  firstUpdated() {
    const observer = new MutationObserver(() => {
      const meta = this.listItem.shadowRoot.querySelector(
        ".mdc-deprecated-list-item__meta"
      ) as HTMLSpanElement;
      meta.style.width = "80px";
      observer.disconnect();
    });
    observer.observe(this.listItem.shadowRoot, { childList: true });
  }
}

@customElement("parameter-list")
export class InstanceParameterList extends connect(store)(LitElement) {
  @property() editable: boolean;
  @property() instance: Instance;
  @property() model: Model;
  @property() parameters: ModelParamEntityState | InstanceParamEntityState;

  @query("infinity-scroll")
  infinity_scroll: InfinityScroll;

  lastModel: ModelId = null;

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("model")) {
      store.dispatch(getModelParams({ id: this.model }));
    }
    if (changedProperties.has("instance")) {
      store.dispatch(getInstanceParams({ id: this.instance }));
    }
  }

  stateChanged(state: RootState) {
    if (!!this.instance) {
      this.parameters = state.instanceParam;
    } else if (!!this.model) {
      this.parameters = state.modelParam;
    } else {
      this.parameters = null;
    }
  }

  Parameters = () => {
    let modelParameters: EntityState<ModelParam> | EntityState<InstanceParam>;
    if (!!this.instance) {
      modelParameters = entityFilter<InstanceParam>(
        this.parameters as EntityState<InstanceParam>,
        (i) => i.instance_uuid == this.instance.instance_uuid
      );
    } else if (!!this.model) {
      modelParameters = entityFilter<ModelParam>(
        this.parameters as EntityState<ModelParam>,
        (i) => i.model_uuid == this.model.model_uuid
      );
    } else {
      this.parameters = null;
    }
    return entityMap<ModelParam | InstanceParam, TemplateResult>(
      modelParameters,
      (i) => html`<Parameter-list-item .parameter=${i}></Parameter-list-item>`
    );
  };

  render() {
    if (this.model || this.instance) {
      return html`
        <mwc-list ?noninteractive=${this.editable}>
          ${this.Parameters()}
        </mwc-list>
      `;
    } else {
      return html`<mwc-list></mwc-list>`;
    }
  }
}
