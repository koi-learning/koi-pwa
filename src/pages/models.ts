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

import { html, customElement, property, css } from "lit-element";
import { store, RootState } from "@src/store/store";
import { BasePage } from "./base";
import { addModel, ModelEntityState } from "@src/store/model";

@customElement("koi-models")
export class ModelsPage extends BasePage {
  isSubPage = false;
  @property() models: ModelEntityState;

  stateChanged(state: RootState) {
    this.models = state.models;
  }

  head() {
    return html`Models`;
  }

  actions() {
    return html``;
  }

  content() {
    return html`
      <paper-card>
        <model-list .scrollTarget=${this.scrollTarget}></model-list>
      </paper-card>
      <mwc-fab
        icon="add"
        @click=${() => store.dispatch(addModel({}))}
      ></mwc-fab>
      <wait-dialog ?open=${this.models.adding}>Adding Model</wait-dialog>
    `;
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
