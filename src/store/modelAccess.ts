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
import { ModelId, ModelAccess, ModelAccessId } from "./interface";

const crud = CRUD<ModelAccess, ModelAccessId, ModelId>(
  "modelAccess",
  (o) => o.access_uuid,
  (o) => `model/${o.model_uuid}/access`,
  (o) => `model/${o.model_uuid}/access/${o.access_uuid}`
);

export const modelAccessReducer = crud.slice.reducer;
export type ModelAccessEntityState = CRUDEntityState<ModelAccess>;
export const getModelAccess = crud.get;
export const getModelAccessPage = crud.getPage;
export const getAllModelAccess = crud.getAll;
export const addModelAccess = crud.add;
export const changeModelAccess = crud.change;
export const delModelAccess = crud.del;
