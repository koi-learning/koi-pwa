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

import { CRUDExtension } from "./crud";

export interface UserId {
  user_uuid: string;
}

export interface RoleId {
  role_uuid: string;
}

export interface AccessId {
  access_uuid: string;
}

export type GeneralAccessId = AccessId;

export type ModelAccessId = AccessId & ModelId;

export type InstanceAccessId = AccessId & InstanceId;

export interface ModelId {
  model_uuid: string;
}

export interface ModelParamId extends ModelId {
  param_uuid: string;
}

export interface InstanceId extends ModelId {
  instance_uuid: string;
}

export interface InstanceParamId extends InstanceId {
  value_uuid: string;
}

export interface SampleId extends InstanceId {
  sample_uuid: string;
}

export interface LabelRequestId extends InstanceId {
  label_request_uuid: string;
}

export interface UserData {
  user_name: string;
}

export interface RoleData {
  role_name: string;
  role_description: string;
}
export interface GeneralRoleData {
  grant_access: boolean;
  edit_users: boolean;
  edit_models: boolean;
  edit_roles: boolean;
}

export interface ModelRoleData {
  can_see_model: boolean;
  instantiate_model: boolean;
  edit_model: boolean;
  download_model: boolean;
  grant_access_model: boolean;
}

export interface InstanceRoleData {
  can_see_instance: boolean;
  add_sample: boolean;
  get_training_data: boolean;
  get_inference_data: boolean;
  edit_instance: boolean;
  grant_access_instance: boolean;
  request_labels: boolean;
  response_labels: boolean;
}

interface AccessData {
  user_uuid: string;
  role_uuid: string;
}

export interface ModelData {
  model_name: string;
  model_description: string;
  has_code: boolean;
  has_visual_plugin: boolean;
  has_label_plugin: boolean;
  finalized: boolean;
}

export interface ModelParamData {
  constaint: string;
  description: string;
  name: boolean;
  type: boolean;
}

export interface InstanceParamData {
  value: number | string | null;
}

export interface InstanceData {
  instance_name: string;
  instance_description: string;
  has_inference: boolean;
  has_training: boolean;
  finalized: boolean;
}

export interface SampleData {
  obsolete: boolean;
  consumed: boolean;
}

export interface Tag {
  name: string;
}

export interface LabelRequestData extends SampleId {
  sample_uuid: string;
  obsolete: boolean;
}

export type User = UserId & UserData & CRUDExtension;
export type Model = ModelId & ModelData & CRUDExtension;
export type ModelParam = ModelParamId & ModelParamData & CRUDExtension;
export type InstanceParam = InstanceParamId &
  ModelParamData &
  InstanceParamData &
  CRUDExtension;
export type Instance = InstanceId & InstanceData & CRUDExtension;
export type GeneralAccess = GeneralAccessId & AccessData & CRUDExtension;
export type ModelAccess = ModelAccessId & AccessData & CRUDExtension;
export type InstanceAccess = InstanceAccessId & AccessData & CRUDExtension;
export type AbstractAccess = AccessId & AccessData & CRUDExtension;
export type Sample = SampleId & SampleData & CRUDExtension;
export type AbstractRole = RoleId & RoleData & CRUDExtension;
export type GeneralRole = RoleId & RoleData & GeneralRoleData & CRUDExtension;
export type ModelRole = RoleId & RoleData & ModelRoleData & CRUDExtension;
export type InstanceRole = RoleId & RoleData & InstanceRoleData & CRUDExtension;
export type LabelRequest = LabelRequestId & LabelRequestData & CRUDExtension;
