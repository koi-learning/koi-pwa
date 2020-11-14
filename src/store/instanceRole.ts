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

import { CRUD, CRUDEntityState } from "./crud";
import { InstanceRole, RoleId } from "./interface";

const crud = CRUD<InstanceRole, RoleId>(
  "userroles/instance",
  (o) => o.role_uuid,
  () => `userroles/instance`,
  (o) => `userroles/instance/${o.role_uuid}`
);

export const instanceRoleReducer = crud.slice.reducer;
export type InstanceRoleEntityState = CRUDEntityState<InstanceRole>;

export const addInstanceRole = crud.add;
export const changeInstanceRole = crud.change;
export const delInstanceRole = crud.del;
export const getAllInstanceRole = crud.getAll;
