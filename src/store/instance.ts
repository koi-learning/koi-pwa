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
import { InstanceId, ModelId, Instance } from "./interface";

export const instanceKey = (id: InstanceId) => id.instance_uuid;

const crud = CRUD<Instance, InstanceId, ModelId>(
  "instance",
  instanceKey,
  (o) => `model/${o.model_uuid}/instance`,
  (o) => `model/${o.model_uuid}/instance/${o.instance_uuid}`
);

export const instanceReducer = crud.slice.reducer;
export type InstanceEntityState = CRUDEntityState<Instance>;
export const getInstance = crud.get;
export const getInstancePage = crud.getPage;
export const addInstance = crud.add;
export const changeInstance = crud.change;
export const delInstance = crud.del;
