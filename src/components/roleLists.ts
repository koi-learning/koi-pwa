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

import { html, customElement, property } from "lit-element";
import { LightLitElement } from "./light-element";

interface AbstractAccess {
  role_uuid: string;
  user_uuid: string;
}

interface AbstractRole {
  role_uuid: string;
  role_name: string;
  role_description: string;
}

@customElement("koi-role-lists")
export class RoleLists extends LightLitElement {
  @property() roles: Array<AbstractRole>;
  @property() access: Array<AbstractAccess>;

  roleList() {
    return html` <mwc-list>
      <mwc-list-item>Models</mwc-list-item>
    </mwc-list>`;
  }

  render() {
    return html` <div>
      <mwc-list>
        <mwc-list-item twoline graphic="avatar" noninteractive>
          <span>User Name</span>
          <span slot="secondary">user@domain.tld</span>
          <mwc-icon slot="graphic" class="inverted">tag_faces</mwc-icon>
        </mwc-list-item>
        <li divider role="separator" style="margin: 10px 1px;"></li>
        <a href="/model">
          <mwc-list-item>Models</mwc-list-item>
        </a>
        <a href="/instance">
          <mwc-list-item>Instances</mwc-list-item>
        </a>
        <li divider role="separator" style="margin: 10px 1px;"></li>
        <a href="/user">
          <mwc-list-item>Users</mwc-list-item>
        </a>
        <a href="/access">
          <mwc-list-item>Access</mwc-list-item>
        </a>
        <a href="/role">
          <mwc-list-item>Roles</mwc-list-item>
        </a>
      </mwc-list>
    </div>`;
  }
}
