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

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api";
import { modelReducer } from "./model";
import { instanceReducer } from "./instance";
import { userReducer } from "./users";
import { generalRoleReducer } from "./generalRole";
import { modelRoleReducer } from "./modelRole";
import { sampleReducer } from "./samples";
import { instanceRoleReducer } from "./instanceRole";
import { modelAccessReducer } from "./modelAccess";
import { instanceAccessReducer } from "./instanceAccess";
import { generalAccessReducer } from "./generalAccess";
import { labelRequestReducer } from "./labelRequest";

const rootReducer = combineReducers({
  models: modelReducer,
  modelRoles: modelRoleReducer,
  modelAccess: modelAccessReducer,
  instances: instanceReducer,
  instanceRoles: instanceRoleReducer,
  instanceAccess: instanceAccessReducer,
  samples: sampleReducer,
  featureRequests: labelRequestReducer,
  users: userReducer,
  generalRoles: generalRoleReducer,
  generalAccess: generalAccessReducer,
  api: apiSlice.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});
