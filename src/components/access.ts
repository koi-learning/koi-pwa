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

import { customElement } from "lit-element";
import { AccessCards } from "./accessCards";
import { store, RootState } from "@src/store/store";
import { getAllGeneralRole } from "@src/store/generalRole";
import { ModelRole, User, ModelAccess } from "@src/store/interface";
import {
  addGeneralAccess,
  delGeneralAccess,
  getAllGeneralAccess,
} from "@src/store/generalAccess";

@customElement("general-access-cards")
export class GeneralAccessCards extends AccessCards {
  connectedCallback() {
    super.connectedCallback();
    store.dispatch(getAllGeneralRole({}));
    store.dispatch(getAllGeneralAccess({}));
  }

  stateChanged(state: RootState) {
    super.stateChanged(state);
    this.roles = state.generalRoles;
    this.access = state.generalAccess;
  }

  addAccess(role: ModelRole, user: User) {
    store.dispatch(addGeneralAccess({ data: { ...role, ...user } }));
  }

  removeAccess(access: ModelAccess) {
    store.dispatch(delGeneralAccess({ id: { ...access } }));
  }
}
