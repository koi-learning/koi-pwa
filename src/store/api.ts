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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authenticatedFetch } from "@src/api-helper";

const loginInternal = createAsyncThunk(
  "api/login",
  async (arg: {
    user_name: string;
    password: string;
    fullfilled?: () => void;
    rejected?: () => void;
  }) => {
    const apiBase = localStorage.getItem("apiBase");

    const response = await fetch(apiBase + "login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    });
    const data = await response.json();
    return data as { token: string; expire: string; user_uuid: string };
  }
);
export const login = (
  user: string,
  password: string,
  fullfilled?: () => void,
  rejected?: () => void
) => {
  return loginInternal({
    user_name: user,
    password: password,
    fullfilled: fullfilled,
    rejected: rejected,
  });
};

export const logout = createAsyncThunk(
  "api/logout",
  async (arg: { fullfilled?: () => void; rejected?: () => void }, thunkApi) => {
    await authenticatedFetch(thunkApi.dispatch, "logout", {
      method: "POST",
    });
  }
);

declare const API_URL: string; // Webpack define
if (localStorage.getItem("apiBase") == null) {
  localStorage.setItem("apiBase", API_URL);
}
let initialState = {
  isLoggingIn: false,
  isLoggingOut: false,
  isLoggedIn: false,
  user_id: undefined as string,
};
if (
  localStorage.getItem("token") != null &&
  localStorage.getItem("user") != null
) {
  initialState = {
    isLoggingIn: false,
    isLoggingOut: false,
    isLoggedIn: true,
    user_id: localStorage.getItem("user"),
  };
} else {
  localStorage.removeItem("token");
}

export const apiSlice = createSlice({
  name: "api",
  initialState: initialState,
  reducers: {
    invalidateLoginInternal(state) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      state.isLoggedIn = false;
      return { ...state, isLoggingIn: false, user_id: undefined };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginInternal.pending, (state) => {
      state.isLoggingIn = true;
    });
    builder.addCase(loginInternal.fulfilled, (state, action) => {
      localStorage.setItem("token", action.payload.token);
      state.isLoggingIn = false;
      state.isLoggedIn = true;
      state.user_id = action.payload.user_uuid;
      localStorage.setItem("user", action.payload.user_uuid);
      if (action.meta.arg.fullfilled) action.meta.arg.fullfilled();
    });
    builder.addCase(loginInternal.rejected, (state, action) => {
      state.isLoggingIn = false;
      state.isLoggedIn = false;
      if (action.meta.arg.rejected) action.meta.arg.rejected();
    });

    builder.addCase(logout.pending, (state) => {
      state.isLoggingOut = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggingOut = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.isLoggedIn = false;
      if (action.meta.arg.fullfilled) action.meta.arg.fullfilled();
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoggingOut = false;
      if (action.meta.arg.rejected) action.meta.arg.rejected();
    });
  },
});

const { invalidateLoginInternal } = apiSlice.actions;
export const invalidateLogin = () => invalidateLoginInternal();
