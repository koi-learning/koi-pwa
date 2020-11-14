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
import { GeneralAccess, GeneralAccessId } from "./interface";

const crud = CRUD<GeneralAccess, GeneralAccessId>(
  "generalAccess",
  (o) => o.access_uuid,
  () => `access`,
  (o) => `access/${o.access_uuid}`
);

export const generalAccessReducer = crud.slice.reducer;
export type GeneralAccessEntityState = CRUDEntityState<GeneralAccess>;
export const getGeneralAccess = crud.get;
export const getGeneralAccessPage = crud.getPage;
export const addGeneralAccess = crud.add;
export const changeGeneralAccess = crud.change;
export const delGeneralAccess = crud.del;

export const getAllGeneralAccess = crud.getAll;
