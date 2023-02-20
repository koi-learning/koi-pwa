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
  LitElement,
  css,
  property,
  query,
  html,
  TemplateResult,
  customElement,
} from "lit-element";
import {
  GeneralRole,
  ModelRole,
  InstanceRole,
  User,
  GeneralAccess,
  ModelAccess,
  InstanceAccess,
  AbstractRole,
  AbstractAccess,
} from "@src/store/interface";
import { Select } from "@material/mwc-select";
import { UserEntityState, getAllUser } from "@src/store/users";
import { EntityState } from "@reduxjs/toolkit";
import { connect } from "pwa-helpers";
import { store, RootState } from "@src/store/store";
import { entityMap } from "@src/util";
import { CRUDEntityState } from "@src/store/crud";

@customElement("access-card")
export class AccessCard extends LitElement {
  @property() aRole: GeneralRole | ModelRole | InstanceRole; // Todo Unify Type
  @property() users: UserEntityState;
  @property() access:
    | EntityState<GeneralAccess>
    | EntityState<ModelAccess>
    | EntityState<InstanceAccess>;

  @property({ attribute: false }) not_associated_users: Array<User> = [];
  @property({ attribute: false }) associated_users: Array<User> = [];

  @query("mwc-select") user_select: Select;

  update(changedProperties) {
    super.update(changedProperties);

    if (
      this.users &&
      this.access &&
      (changedProperties.has("aRole") ||
        changedProperties.has("users") ||
        changedProperties.has("access"))
    ) {
      this.associated_users = this.users.ids
        .filter(
          (user) =>
            this.access.ids.find(
              (id) =>
                this.access.entities[id].user_uuid == user &&
                this.access.entities[id].role_uuid == this.aRole.role_uuid
            ) != null
        )
        .map((id) => this.users.entities[id]);
      this.not_associated_users = this.users.ids
        .filter(
          (user) =>
            this.access.ids.find(
              (id) =>
                this.access.entities[id].user_uuid == user &&
                this.access.entities[id].role_uuid == this.aRole.role_uuid
            ) == null
        )
        .map((id) => this.users.entities[id]);
    }
  }

  removeAccess(user: User) {
    const selectedAccessId = this.access.ids.find(
      (id) => this.access.entities[id].user_uuid == user.user_uuid
    );
    const selectedAccess = this.access.entities[selectedAccessId];
    const event = new CustomEvent("removeAccess", {
      detail: {
        user: user,
        access: selectedAccess,
      },
    });
    this.dispatchEvent(event);
  }

  addAccess() {
    const selectedUser = this.users.entities[this.user_select.value];
    const event = new CustomEvent("addAccess", {
      detail: {
        user: selectedUser,
      },
    });
    this.dispatchEvent(event);
    this.user_select.value = "";
  }

  renderSelectUser = (user: User) => {
    return html`<mwc-list-item value=${user.user_uuid}
      >${user.user_name}</mwc-list-item
    >`;
  };

  renderListUser = (user: User) => {
    return html`<li class="list-item">
      <span>${user.user_name}</span>
      <mwc-icon-button
        icon="delete"
        @click="${() => this.removeAccess(user)}}"
      ></mwc-icon-button>
    </li>`;
  };

  render(): TemplateResult {
    return html`
      <paper-card style="width:300px;">
        <ul class="card-content">
          <li class="list-item header">
            <mwc-icon class="inverted">people</mwc-icon>
            <span>${this.aRole.role_name}</span>
          </li>
          <li class="divider"></li>
          <li class="list-item add-section">
            <mwc-select label="user to add">
              ${this.not_associated_users.map(this.renderSelectUser)}
            </mwc-select>
            <mwc-icon-button
              icon="add"
              @click=${this.addAccess}
            ></mwc-icon-button>
          </li>
          <li class="divider"></li>
          ${this.associated_users.map(this.renderListUser)}
        </ul>
      </paper-card>
    `;
  }

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

      .list-item {
        -webkit-font-smoothing: antialiased;
        font-family: var(
          --mdc-typography-subtitle1-font-family,
          var(--mdc-typography-font-family, Roboto, sans-serif)
        );
        font-size: var(--mdc-typography-subtitle1-font-size, 1rem);
        font-weight: var(--mdc-typography-subtitle1-font-weight, 400);
        letter-spacing: var(
          --mdc-typography-subtitle1-letter-spacing,
          0.009375em
        );
        text-transform: var(--mdc-typography-subtitle1-text-transform, inherit);
        line-height: 1.5rem;
        list-style-type: none;
        color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));
        margin: 0px;

        display: flex;
        align-items: center;
      }

      .divider {
        height: 0px;
        border-top-width: initial;
        border-right-width: initial;
        border-left-width: initial;
        border-top-color: initial;
        border-right-color: initial;
        border-left-color: initial;
        border-bottom-width: 1px;
        border-bottom-color: rgba(0, 0, 0, 0.12);
        margin: 0px;
        border-style: none none solid;
        border-image: initial;
        list-style-type: none;
      }

      .header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }

      .header > mwc-icon {
        font-size: 32px;
        margin-right: 10px;
      }

      .header > span {
        font-family: var(--mdc-typography-title-font-family);
      }

      .header > span::after {
        content: " Role";
      }

      .list-item > mwc-icon-button {
        margin-left: auto;
      }

      .card-content {
        margin: 0;
        padding-bottom: 6px;
      }

      .add-section {
        --mdc-select-fill-color: white;
      }
    `;
  }
}

export abstract class AccessCards extends connect(store)(LitElement) {
  @property({ attribute: false }) roles: CRUDEntityState<AbstractRole>;
  @property({ attribute: false }) access: EntityState<AbstractAccess>;
  @property({ attribute: false }) users: UserEntityState;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(getAllUser({}));
  }

  stateChanged(state: RootState) {
    this.users = state.users;
  }

  render() {
    return html`<div class="grid">
      ${entityMap(
        this.roles,
        (role) =>
          html`<access-card
            .aRole=${role}
            .access=${this.access}
            .users=${this.users}
            @addAccess=${(e) => this.addAccess(role, e.detail.user)}
            @removeAccess=${(e) => this.removeAccess(e.detail.access)}
          ></access-card>`
      )}
    </div>`;
  }

  abstract addAccess(role: AbstractRole, user: User);

  abstract removeAccess(access: AbstractAccess);
}
