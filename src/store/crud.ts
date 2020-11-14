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

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import {
  authenticatedJsonGET,
  authenticatedJsonPOST,
  authenticatedJsonDELETE,
  authenticatedJsonPUT,
} from "@src/api-helper";

export type CRUDExtension = {
  loading: boolean;
  page?: number;
};

interface CRUDState {
  adding: boolean;
  loading: boolean;
}

export type CRUDEntityState<T> = EntityState<T> & CRUDState;

export function CRUD<
  ObjectType extends CRUDExtension & IdType,
  IdType,
  SuperIdType = never
>(
  name: string,
  uniqueId: (o: IdType) => string,
  basePath: (o: SuperIdType) => string,
  individualPath: (o: IdType) => string,
  page_limit = 5
) {
  const adapter = createEntityAdapter<ObjectType>({ selectId: uniqueId });

  const get = createAsyncThunk(
    `${name}/get`,
    async (
      arg: {
        id: IdType;
        fullfilled?: () => void;
        rejected?: () => void;
      },
      thunkAPI
    ) => {
      return (await authenticatedJsonGET(
        thunkAPI.dispatch,
        individualPath(arg.id)
      )) as ObjectType;
    }
  );

  const getPage = createAsyncThunk(
    `${name}/getPage`,
    async (
      arg: {
        id?: SuperIdType;
        page: number;
        fullfilled?: (elements: number) => void;
        rejected?: () => void;
        queryParameter?: { [id: string]: string };
      },
      thunkAPI
    ) => {
      let queryString = `?page_limit=${page_limit}&page_offset=${
        arg.page * page_limit
      }`;
      if (arg.queryParameter)
        queryString += Object.keys(arg.queryParameter).map(
          (key) => `&${key}=${arg.queryParameter[key]}`
        );
      return (await authenticatedJsonGET(
        thunkAPI.dispatch,
        basePath(arg.id) + queryString
      )) as Array<ObjectType>;
    }
  );

  const getAll = createAsyncThunk(
    `${name}/getAll`,
    async (
      arg: {
        id?: SuperIdType;
        fullfilled?: () => void;
        rejected?: () => void;
        queryParameter?: { [id: string]: string };
      },
      thunkAPI
    ) => {
      let page = 0;
      let res = await new Promise((resolve) =>
        thunkAPI.dispatch(
          getPage({
            id: arg.id,
            page: page,
            fullfilled: resolve,
            queryParameter: arg.queryParameter,
          })
        )
      );
      while (res > 0) {
        page++;
        res = await new Promise((resolve) =>
          thunkAPI.dispatch(
            getPage({
              id: arg.id,
              page: page,
              fullfilled: resolve,
              queryParameter: arg.queryParameter,
            })
          )
        );
      }
    }
  );

  const add = createAsyncThunk(
    `${name}/add`,
    async (
      arg: {
        id?: SuperIdType;
        data?: Partial<ObjectType>;
        fullfilled?: () => void;
        rejected?: () => void;
      },
      thunkAPI
    ) => {
      return (await authenticatedJsonPOST(
        thunkAPI.dispatch,
        basePath(arg.id),
        arg.data ? arg.data : {}
      )) as ObjectType;
    }
  );
  const del = createAsyncThunk(
    `${name}/delete`,
    async (
      arg: { id: IdType; fullfilled?: () => void; rejected?: () => void },
      thunkAPI
    ) => {
      return await authenticatedJsonDELETE(
        thunkAPI.dispatch,
        individualPath(arg.id)
      );
    }
  );
  const change = createAsyncThunk(
    `${name}/change`,
    async (
      arg: {
        id: IdType;
        data: Partial<ObjectType>;
        fullfilled?: () => void;
        rejected?: () => void;
      },
      thunkAPI
    ) => {
      return (await authenticatedJsonPUT(
        thunkAPI.dispatch,
        individualPath(arg.id),
        arg.data
      )) as ObjectType;
    }
  );

  const crudState: CRUDState = { adding: false, loading: false };
  const initialState = adapter.getInitialState(crudState);
  const slice = createSlice({
    name: name,
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
      // get
      builder.addCase(get.pending, (state: any, action) => {
        adapter.addOne(state, {
          ...action.meta.arg.id,
          loading: true,
        } as ObjectType);
      });
      builder.addCase(get.fulfilled, (state: any, action) => {
        adapter.updateOne(state, {
          id: uniqueId(action.meta.arg.id),
          changes: { ...action.payload, loading: false },
        });
        if (action.meta.arg.fullfilled) action.meta.arg.fullfilled();
      });
      builder.addCase(get.rejected, (state: any, action) => {
        adapter.removeOne(state, uniqueId(action.meta.arg.id));
        if (action.meta.arg.rejected) action.meta.arg.rejected();
      });

      // getPage
      builder.addCase(getPage.pending, (state: any) => {
        state.loading = true;
      });
      builder.addCase(getPage.fulfilled, (state: any, action) => {
        adapter.addMany(
          state,
          action.payload.map((o) => ({
            ...action.meta.arg.id,
            ...o,
            loading: false,
          }))
        );
        state.loading = false;
        if (action.meta.arg.fullfilled)
          action.meta.arg.fullfilled(action.payload.length);
      });
      builder.addCase(getPage.rejected, (state: any, action) => {
        state.loading = false;
        if (action.meta.arg.rejected) action.meta.arg.rejected();
      });

      // getAll
      builder.addCase(getAll.fulfilled, (_, action) => {
        if (action.meta.arg.fullfilled) action.meta.arg.fullfilled();
      });
      builder.addCase(getAll.rejected, (_, action) => {
        if (action.meta.arg.rejected) action.meta.arg.rejected();
      });

      // add
      builder.addCase(add.pending, (state) => {
        state.adding = true;
      });
      builder.addCase(add.fulfilled, (state: any, action) => {
        adapter.addOne(state, {
          ...action.meta.arg.id,
          ...action.payload,
          loading: false,
        });
        state.adding = false;
        if (action.meta.arg.fullfilled) action.meta.arg.fullfilled();
      });
      builder.addCase(add.rejected, (state: any, action) => {
        state.adding = false;
        if (action.meta.arg.rejected) action.meta.arg.rejected();
      });

      // del
      builder.addCase(del.pending, (state: any, action) => {
        adapter.updateOne(state, {
          id: uniqueId(action.meta.arg.id),
          changes: { loading: true } as Partial<ObjectType>,
        });
      });
      builder.addCase(del.fulfilled, (state: any, action) => {
        adapter.removeOne(state, uniqueId(action.meta.arg.id));
        if (action.meta.arg.fullfilled) action.meta.arg.fullfilled();
      });
      builder.addCase(del.rejected, (state: any, action) => {
        adapter.updateOne(state, {
          id: uniqueId(action.meta.arg.id),
          changes: { loading: false } as Partial<ObjectType>,
        });
        if (action.meta.arg.rejected) action.meta.arg.rejected();
      });

      // change
      builder.addCase(change.pending, (state: any, action) => {
        adapter.updateOne(state, {
          id: uniqueId(action.meta.arg.id),
          changes: { loading: true } as Partial<ObjectType>,
        });
      });
      builder.addCase(change.fulfilled, (state: any, action) => {
        adapter.updateOne(state, {
          id: uniqueId(action.meta.arg.id),
          changes: { ...action.meta.arg.data, loading: false },
        });
        if (action.meta.arg.fullfilled) action.meta.arg.fullfilled();
      });
      builder.addCase(change.rejected, (state: any, action) => {
        adapter.updateOne(state, {
          id: uniqueId(action.meta.arg.id),
          changes: { loading: false } as Partial<ObjectType>,
        });
        if (action.meta.arg.rejected) action.meta.arg.rejected();
      });

      builder.addCase("clear", (state) => {
        adapter.removeAll(state as any);
      });
    },
  });

  return {
    get: get,
    getPage: getPage,
    getAll: getAll,
    add: add,
    change: change,
    del: del,
    slice: slice,
  };
}
