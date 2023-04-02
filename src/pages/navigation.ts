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

import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LightLitElement } from "../components/light-element";
import { connect } from "pwa-helpers";
import { store, RootState } from "@src/store/store";
import { Router } from "@vaadin/router";
import { router } from "..";
import { User } from "@src/store/interface";
import { getUser } from "@src/store/users";
import { logout } from "@src/store/api";
import { loadGeneralRights, hasGeneralRight } from "@src/rightsHelper";

@customElement("koi-navigation")
export class Navigation extends connect(store)(LightLitElement) {
  @property({ attribute: false }) user: User;

  @property({ attribute: false }) right: { grant; user; role };

  connectedCallback() {
    super.connectedCallback();
    loadGeneralRights(store.dispatch);
  }

  private oldUser: string = undefined;
  stateChanged(state: RootState) {
    if (state.users.ids.includes(state.api.user_id)) {
      this.user = state.users.entities[state.api.user_id];
    } else if (this.oldUser != state.api.user_id) {
      store.dispatch(getUser({ id: { user_uuid: state.api.user_id } }));
      this.oldUser = state.api.user_id;
    }
    this.right = {
      grant: hasGeneralRight("grant_access", state),
      user: hasGeneralRight("edit_users", state),
      role: hasGeneralRight("edit_roles", state),
    };
  }

  render() {
    return html` <div>
      <mwc-list>
        <mwc-list-item graphic="avatar" noninteractive>
          <span>${this.user.user_name}</span>
          <mwc-icon slot="graphic" class="inverted">person</mwc-icon>
        </mwc-list-item>
        <mwc-list-item
          graphic="icon"
          @request-selected=${() => store.dispatch(logout({}))}
        >
          <span>Logout</span>
          <mwc-icon slot="graphic" class="inverted">logout</mwc-icon>
        </mwc-list-item>
        <li divider role="separator" style="margin: 10px 1px;"></li>
        <mwc-list-item
          graphic="icon"
          ?activated=${router.location.pathname.startsWith("/model")}
          @request-selected=${() => Router.go("/model")}
        >
          <span>Models</span>
          <mwc-icon slot="graphic" class="inverted">topic</mwc-icon>
        </mwc-list-item>
        <mwc-list-item
          graphic="icon"
          ?activated=${router.location.pathname.startsWith("/instance")}
          @request-selected=${() => Router.go("/instance")}
        >
          <span>Instances</span>
          <mwc-icon slot="graphic" class="inverted">text_snippet</mwc-icon>
        </mwc-list-item>
        <li divider role="separator" style="margin: 10px 1px;"></li>
        ${this.right.user
          ? html`<mwc-list-item
              graphic="icon"
              ?activated=${router.location.pathname.startsWith("/user")}
              @request-selected=${() => Router.go("/user")}
            >
              <span>Users</span>
              <mwc-icon slot="graphic" class="inverted">person</mwc-icon>
            </mwc-list-item>`
          : null}
        ${this.right.grant
          ? html`<mwc-list-item
              graphic="icon"
              ?activated=${router.location.pathname.startsWith("/access")}
              @request-selected=${() => Router.go("/access")}
            >
              <span>Access</span>
              <mwc-icon slot="graphic" class="inverted">security</mwc-icon>
            </mwc-list-item>`
          : null}
        ${this.right.role
          ? html`<mwc-list-item
              graphic="icon"
              ?activated=${router.location.pathname.startsWith("/role")}
              @request-selected=${() => Router.go("/role")}
            >
              <span>Roles</span>
              <mwc-icon slot="graphic" class="inverted">people</mwc-icon>
            </mwc-list-item>`
          : null}
      </mwc-list>
    </div>`;
  }
}
