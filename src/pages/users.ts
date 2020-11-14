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
  html,
  customElement,
  property,
  css,
  TemplateResult,
  query,
} from "lit-element";
import { store, RootState } from "@src/store/store";
import { BasePage } from "./base";
import {
  UserEntityState,
  addUser,
  changeUser,
  delUser,
  getAllUser,
} from "@src/store/users";
import { entityMap } from "@src/util";
import { User } from "@src/store/interface";
import { TextField } from "@material/mwc-textfield";
import { ConfirmDialog } from "@src/components/dialogs";

@customElement("page-users")
export class UsersPage extends BasePage {
  isSubPage = false;
  @property() activeTab = "model";
  @property({ attribute: false }) users: UserEntityState;

  @query("#password")
  password: TextField;
  @query("#setPassword")
  setPassword: ConfirmDialog;
  passwordUser: User;

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(getAllUser({}));
  }

  stateChanged(state: RootState) {
    this.users = state.users;
  }

  static get styles() {
    return super.styles.concat(css`
      paper-card {
        width: var(--card-width);
        margin: 10px;
        text-align: left;
      }

      .card-actions {
        text-align: end;
      }

      .card-content > * {
        width: 100%;
        margin: 10px 0px;
      }
    `);
  }

  head(): TemplateResult {
    return html`Users`;
  }

  actions(): TemplateResult {
    return html``;
  }

  content() {
    const changePassword = () =>
      store.dispatch(
        changeUser({
          id: this.passwordUser,
          data: { password: this.password.value } as unknown,
        })
      );
    return html`
      <mwc-fab icon="add" @click=${() => store.dispatch(addUser({}))}></mwc-fab>
      <div class="grid">
        ${entityMap(this.users, (user) => this.userCard(user))}
      </div>
      <confirm-dialog id="setPassword" @confirm=${changePassword}>
        Set a new password
        <mwc-textfield id="password" type="password"></mwc-textfield>
      </confirm-dialog>
    `;
  }

  userCard(user: User) {
    const changeName = (name: string) =>
      store.dispatch(changeUser({ id: user, data: { user_name: name } }));
    return html`
      <paper-card>
        <div class="card-content">
          <mwc-textfield
            label="Name"
            value=${user.user_name}
            @change=${(e) => changeName(e.path[0].value)}
          >
          </mwc-textfield>
          <mwc-button
            label="set password"
            @click=${() => {
              this.passwordUser = user;
              this.setPassword.show();
            }}
          ></mwc-button>
        </div>
        <div class="card-actions">
          <mwc-button @click=${() => store.dispatch(delUser({ id: user }))}
            >delete</mwc-button
          >
        </div>
      </paper-card>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  infinityLoad(): void {}
}
