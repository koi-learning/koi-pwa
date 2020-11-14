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

import { invalidateLogin } from "./store/api";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

type DispatchType = ThunkDispatch<unknown, unknown, AnyAction>;

export const authenticatedFetch = async (
  dispatch: DispatchType,
  objectPath: string,
  init?: RequestInit
) => {
  const token = localStorage.getItem("token");
  const apiBase = localStorage.getItem("apiBase");

  if (token == null) {
    dispatch(invalidateLogin());
    throw new Error("No token found");
  }

  const authenticatedInit: RequestInit = {
    ...init,
    headers: {
      ...init.headers,
      Authorization: "Bearer " + token,
    },
  };

  return await fetch(apiBase + objectPath, authenticatedInit).then(
    (response) => {
      if (response.status === 401) {
        dispatch(invalidateLogin());
        throw Error("Unauthorized");
      }
      if (response.status !== 200) {
        response.text().then((text) => console.log(text));
        throw Error(response.statusText);
      }
      return response;
    }
  );
};

export const authenticatedJsonFetch = async (
  dispatch: DispatchType,
  objectPath: string,
  init?: RequestInit
) => {
  const extendedInit: RequestInit = {
    ...init,
    headers: {
      ...init.headers,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return await (
    await authenticatedFetch(dispatch, objectPath, extendedInit)
  ).json();
};

export const authenticatedJsonGET = async (
  dispatch: DispatchType,
  objectPath: string
) => authenticatedJsonFetch(dispatch, objectPath, { method: "GET" });
export const authenticatedJsonPUT = async (
  dispatch: DispatchType,
  objectPath: string,
  data: unknown
) =>
  authenticatedJsonFetch(dispatch, objectPath, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const authenticatedJsonPOST = async (
  dispatch: DispatchType,
  objectPath: string,
  data: unknown
) =>
  authenticatedJsonFetch(dispatch, objectPath, {
    method: "POST",
    body: JSON.stringify(data),
  });
export const authenticatedJsonDELETE = async (
  dispatch: DispatchType,
  objectPath: string
) => authenticatedJsonFetch(dispatch, objectPath, { method: "DELETE" });
