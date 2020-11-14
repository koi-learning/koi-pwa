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
import { InstanceAccess, InstanceAccessId, InstanceId } from "./interface";

const crud = CRUD<InstanceAccess, InstanceAccessId, InstanceId>(
  "instanceAccess",
  (o) => o.access_uuid,
  (o) => `model/${o.model_uuid}/instance/${o.instance_uuid}/access`,
  (o) =>
    `model/${o.model_uuid}/instance/${o.instance_uuid}/access/${o.access_uuid}`
);

export const instanceAccessReducer = crud.slice.reducer;
export type InstanceAccessEntityState = CRUDEntityState<InstanceAccess>;
export const getInstanceAccess = crud.get;
export const getInstanceAccessPage = crud.getPage;
export const getAllInstanceAccess = crud.getAll;
export const addInstanceAccess = crud.add;
export const changeInstanceAccess = crud.change;
export const delInstanceAccess = crud.del;
