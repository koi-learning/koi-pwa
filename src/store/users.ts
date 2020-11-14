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
import { User, UserId } from "./interface";

const crud = CRUD<User, UserId>(
  "user",
  (o) => o.user_uuid,
  () => `user`,
  (o) => `user/${o.user_uuid}`
);

export const userReducer = crud.slice.reducer;
export type UserEntityState = CRUDEntityState<User>;

export const getUser = crud.get;
export const getAllUser = crud.getAll;
export const addUser = crud.add;
export const changeUser = crud.change;
export const delUser = crud.del;
