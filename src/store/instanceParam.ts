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
import { InstanceId, InstanceParam, InstanceParamId } from "./interface";

export const instanceParamKey = (id: InstanceParamId) => id.value_uuid;

const crud = CRUD<InstanceParam, InstanceParamId, InstanceId>(
  "instance/parameter",
  instanceParamKey,
  (o) => `model/${o.model_uuid}/instance/${o.instance_uuid}/parameter`,
  (o) =>
    `model/${o.model_uuid}/instance/${o.instance_uuid}/parameter/${o.value_uuid}`
);

export const instanceParamReducer = crud.slice.reducer;
export type InstanceParamEntityState = CRUDEntityState<InstanceParam>;
export const getInstanceParam = crud.get;
export const getInstanceParams = crud.getUnPaged;
export const changeInstanceParam = crud.change;
