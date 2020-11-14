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

import { LitElement, property, html, customElement, css } from "lit-element";
import { AbstractRole } from "@src/store/interface";
import { connect } from "pwa-helpers";
import { store, RootState } from "@src/store/store";
import {
  getAllGeneralRole,
  changeGeneralRole,
  delGeneralRole,
} from "@src/store/generalRole";
import {
  getAllModelRole,
  changeModelRole,
  delModelRole,
} from "@src/store/modelRole";
import {
  getAllInstanceRole,
  changeInstanceRole,
  delInstanceRole,
} from "@src/store/instanceRole";
("@src/store/users");
import { entityMap } from "@src/util";
import { CRUDEntityState } from "@src/store/crud";

@customElement("role-card")
export class GeneralAccessCards extends LitElement {
  @property() role: AbstractRole;

  static get styles() {
    return css`
      .grid {
        margin: 10px;
        text-align: center;
      }

      paper-card {
        width: var(--card-width);
        margin: 10px;
        text-align: left;
      }

      .card-actions {
        text-align: right;
      }

      mwc-textfield,
      koi-file-upload,
      mwc-textarea {
        width: 100%;
        margin-bottom: 10px;
      }
    `;
  }

  getRoleOptions() {
    type AbstractKeysEnum = { [P in keyof Required<AbstractRole>]: true };
    const abstractKeys: AbstractKeysEnum = {
      role_name: true,
      role_uuid: true,
      role_description: true,
      page: true,
      loading: true,
    };
    return Object.keys(this.role).filter((key) => !abstractKeys[key]);
  }

  renderOption = (option: string) => {
    const changeOption = (e) => {
      if (e.detail.source == "interaction") {
        const change = {};
        change[option] = e.detail.selected;
        this.dispatchEvent(new CustomEvent("change", { detail: change }));
      }
    };
    return html`
      <mwc-check-list-item
        ?selected=${this.role[option]}
        @request-selected=${changeOption}
      >
        ${option}
      </mwc-check-list-item>
    `;
  };

  render() {
    const options = this.getRoleOptions();
    const deleteRole = () => {
      this.dispatchEvent(new CustomEvent("del"));
    };
    const changeName = (e) => {
      this.dispatchEvent(
        new CustomEvent("change", { detail: { role_name: e.path[0].value } })
      );
    };
    const changeDescription = (e) => {
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { role_description: e.path[0].value },
        })
      );
    };
    return html`
      <paper-card>
        <div class="card-content">
          <mwc-textfield
            label="Name"
            value=${this.role.role_name}
            @change=${changeName}
          >
          </mwc-textfield>
          <mwc-textarea
            label="Description"
            charCounter
            maxLength="500"
            value=${this.role.role_description}
            @change=${changeDescription}
          ></mwc-textarea>
          <mwc-list multi> ${options.map(this.renderOption)} </mwc-list>
        </div>
        <div class="card-actions">
          <mwc-button @click=${deleteRole}>delete</mwc-button>
        </div>
      </paper-card>
    `;
  }
}

abstract class RoleCards extends connect(store)(LitElement) {
  @property({ attribute: false }) roles: CRUDEntityState<AbstractRole>;
  abstract changeRole;
  abstract delRole;

  render() {
    return html`<div class="grid">
      ${entityMap(
        this.roles,
        (role) =>
          html`<role-card
            .role=${role}
            @change=${(e) =>
              store.dispatch(this.changeRole({ id: role, data: e.detail }))}
            @del=${() => store.dispatch(this.delRole({ id: role }))}
          ></role-card>`
      )}
    </div>`;
  }
}

@customElement("general-role-cards")
export class GeneralRoleCards extends RoleCards {
  changeRole = changeGeneralRole;
  delRole = delGeneralRole;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(getAllGeneralRole({}));
  }

  stateChanged(state: RootState) {
    this.roles = state.generalRoles;
  }
}

@customElement("model-role-cards")
export class ModelRoleCards extends RoleCards {
  changeRole = changeModelRole;
  delRole = delModelRole;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(getAllModelRole({}));
  }

  stateChanged(state: RootState) {
    this.roles = state.modelRoles;
  }
}

@customElement("instance-role-cards")
export class InstanceRoleCards extends RoleCards {
  changeRole = changeInstanceRole;
  delRole = delInstanceRole;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(getAllInstanceRole({}));
  }

  stateChanged(state: RootState) {
    this.roles = state.instanceRoles;
  }
}
