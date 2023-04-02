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

import { html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { store, RootState } from "@src/store/store";
import { BasePage } from "./base";
import { addModel, delModel, ModelEntityState } from "@src/store/model";
import { ConfirmDialog } from "@src/components/dialogs";
import { ModelList } from "@src/components/model";

@customElement("koi-models")
export class ModelsPage extends BasePage {
  isSubPage = false;
  @property() models: ModelEntityState;

  @property()
  private selectionMode = false;

  @query("#deleteDialog")
  deleteDialog: ConfirmDialog;

  @query("model-list")
  list: ModelList;

  stateChanged(state: RootState) {
    this.models = state.models;
  }

  head() {
    return html`Models`;
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
        <model-list
          .scrollTarget=${this.scrollTarget}
          @selectionMode=${(event) => {
            this.selectionMode = event.detail.selectionModeActive;
          }}
        ></model-list>
      </paper-card>
      <mwc-fab
        icon="add"
        @click=${() => store.dispatch(addModel({}))}
      ></mwc-fab>
      <wait-dialog ?open=${this.models.adding}>Adding Model</wait-dialog>
      <confirm-dialog id="deleteDialog" @confirm=${this.delete}>
        Are you sure you want to delete the selected models?
      </confirm-dialog>`;
  }

  delete() {
    for (const listItem of this.list.selection) {
      store.dispatch(delModel({ id: listItem.model }));
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
