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

import { RootState } from "./store/store";
import {
  GeneralRoleData,
  AbstractRole,
  ModelId,
  InstanceId,
  InstanceRoleData,
  ModelRoleData,
} from "./store/interface";
import { getAllGeneralRole } from "./store/generalRole";
import { getAllGeneralAccess } from "./store/generalAccess";
import { entityFilter, entityMap } from "./util";
import { getAllModelRole } from "./store/modelRole";
import { getAllModelAccess } from "./store/modelAccess";
import { getAllInstanceRole } from "./store/instanceRole";
import { getAllInstanceAccess } from "./store/instanceAccess";

function checkRolesForRight(roles: Array<AbstractRole>, key: string) {
  if (roles.find((r) => r && r[key]) == undefined) {
    return false;
  } else {
    return true;
  }
}

export function hasGeneralRight(key: keyof GeneralRoleData, state: RootState) {
  if (!state.api.isLoggedIn) return false;
  const access = entityFilter(
    state.generalAccess,
    (a) => a.user_uuid == state.api.user_id
  );
  const roles = entityMap(
    access,
    (a) => state.generalRoles.entities[a.role_uuid]
  );
  return checkRolesForRight(roles, key);
}
export function loadGeneralRights(dispatch) {
  dispatch(getAllGeneralAccess({}));
  dispatch(getAllGeneralRole({}));
}

export function hasModelRight(
  model: ModelId,
  key: keyof ModelRoleData,
  state: RootState
) {
  if (!state.api.isLoggedIn) return false;
  if (!model) return false;
  const access = entityFilter(
    state.modelAccess,
    (a) => a.user_uuid == state.api.user_id && a.model_uuid == model.model_uuid
  );
  const roles = entityMap(
    access,
    (a) => state.modelRoles.entities[a.role_uuid]
  );
  return checkRolesForRight(roles, key);
}

export function loadModelRights(model: ModelId, dispatch) {
  dispatch(getAllModelAccess({ id: model }));
  dispatch(getAllModelRole({}));
  loadGeneralRights(dispatch);
}

export function hasInstanceRight(
  instance: InstanceId,
  key: keyof InstanceRoleData,
  state: RootState
) {
  if (!state.api.isLoggedIn) return false;
  if (!instance) return false;
  const access = entityFilter(
    state.instanceAccess,
    (a) =>
      a.user_uuid == state.api.user_id &&
      a.instance_uuid == instance.instance_uuid
  );
  const roles = entityMap(
    access,
    (a) => state.instanceRoles.entities[a.role_uuid]
  );
  return checkRolesForRight(roles, key);
}

export function loadInstanceRights(instance: InstanceId, dispatch) {
  dispatch(getAllInstanceAccess({ id: instance }));
  dispatch(getAllInstanceRole({}));
  loadModelRights(instance, dispatch);
}
