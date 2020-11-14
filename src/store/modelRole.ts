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
import { RoleId, ModelRole } from "./interface";

const crud = CRUD<ModelRole, RoleId>(
  "userroles/model",
  (o) => o.role_uuid,
  () => `userroles/model`,
  (o) => `userroles/model/${o.role_uuid}`
);

export const modelRoleReducer = crud.slice.reducer;
export type ModelRoleEntityState = CRUDEntityState<ModelRole>;

export const addModelRole = crud.add;
export const changeModelRole = crud.change;
export const delModelRole = crud.del;
export const getAllModelRole = crud.getAll;
