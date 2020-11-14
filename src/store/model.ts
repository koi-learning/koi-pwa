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
import { Model, ModelId } from "./interface";

export const modelKey = (id: ModelId) => id.model_uuid;

const crud = CRUD<Model, ModelId>(
  "model",
  modelKey,
  () => `model`,
  (o) => `model/${o.model_uuid}`
);

export const modelReducer = crud.slice.reducer;
export type ModelEntityState = CRUDEntityState<Model>;
export const getModel = crud.get;
export const getModelPage = crud.getPage;
export const addModel = crud.add;
export const changeModel = crud.change;
export const delModel = crud.del;
