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
import { SampleId, Sample, InstanceId } from "./interface";

const crud = CRUD<Sample, SampleId, InstanceId>(
  "sample",
  (o) => o.sample_uuid,
  (o) => `model/${o.model_uuid}/instance/${o.instance_uuid}/sample`,
  (o) =>
    `model/${o.model_uuid}/instance/${o.instance_uuid}/sample/${o.sample_uuid}`
);

export const sampleReducer = crud.slice.reducer;
export type SampleEntityState = CRUDEntityState<Sample>;
export const getSample = crud.get;
export const getSamplePage = crud.getPage;
export const delSample = crud.del;
