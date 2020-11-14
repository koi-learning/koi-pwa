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

import { EntityState } from "@reduxjs/toolkit";
export function entityMap<T, T2>(
  entities: EntityState<T>,
  callback: (arg: T) => T2
): Array<T2> {
  return entities.ids.map((id) => callback(entities.entities[id]));
}

export function entityFilter<T>(
  entities: EntityState<T>,
  callback: (arg: T) => boolean
): EntityState<T> {
  const filteredIds = entities.ids.filter((id) =>
    callback(entities.entities[id])
  );
  return { ids: filteredIds, entities: entities.entities };
}

export function entityFind<T>(
  entities: EntityState<T>,
  callback: (arg: T) => boolean
): T {
  return entities.entities[
    entities.ids.find((id) => callback(entities.entities[id]))
  ];
}

export function templateJoin<T, T2>(values: Array<T>, joiner: T2) {
  return values.map((v, i) => [v, i < values.length - 1 ? joiner : ""]);
}
