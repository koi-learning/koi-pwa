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
import { InstanceId, LabelRequestId, LabelRequest } from "./interface";

const crud = CRUD<LabelRequest, LabelRequestId, InstanceId>(
  "label_request",
  (o) => o.label_request_uuid,
  (o) => `model/${o.model_uuid}/instance/${o.instance_uuid}/label_request`,
  (o) =>
    `model/${o.model_uuid}/instance/${o.instance_uuid}/label_request/${o.label_request_uuid}`,
  1
);

export const labelRequestReducer = crud.slice.reducer;
export type LabelRequestEntityState = CRUDEntityState<LabelRequest>;
export const getLabelRequestPage = crud.getPage;
export const delLabelRequest = crud.del;
export const changeLabelRequest = crud.change;
