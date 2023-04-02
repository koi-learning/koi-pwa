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

import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BasePage } from "./base";
import { RootState, store } from "@src/store/store";
import { addGeneralRole } from "@src/store/generalRole";
import { addModelRole } from "@src/store/modelRole";
import { addInstanceRole } from "@src/store/instanceRole";

@customElement("page-roles")
export class RolesPage extends BasePage {
  isSubPage = false;
  @property() adding = false;

  constructor() {
    super();
    this.availableTabs = [
      { name: "general", label: "General" },
      { name: "model", label: "Model" },
      { name: "instance", label: "Instance" },
    ];
  }

  stateChanged(state: RootState) {
    this.adding =
      state.generalRoles.adding ||
      state.modelRoles.adding ||
      state.instanceRoles.adding;
  }

  head(): TemplateResult {
    return html`Roles`;
  }

  actions(): TemplateResult {
    return html``;
  }

  content() {
    return html`
      ${this.tabs()}
      <wait-dialog .open=${this.adding}>Adding Role</wait-dialog>
    `;
  }

  tabs() {
    switch (this.activeTab) {
      case "general":
        return html`<general-role-cards></general-role-cards>
          <mwc-fab
            icon="add"
            @click=${() => store.dispatch(addGeneralRole({}))}
          ></mwc-fab> `;
      case "model":
        return html`<model-role-cards></model-role-cards>
          <mwc-fab
            icon="add"
            @click=${() => store.dispatch(addModelRole({}))}
          ></mwc-fab> `;
      case "instance":
        return html`<instance-role-cards></instance-role-cards>
          <mwc-fab
            icon="add"
            @click=${() => store.dispatch(addInstanceRole({}))}
          ></mwc-fab> `;
    }
  }
}
