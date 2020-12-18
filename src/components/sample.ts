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

import {
  LitElement,
  customElement,
  property,
  html,
  query,
  css,
} from "lit-element";
import { Instance, Sample, Tag } from "@src/store/interface";
import {
  SampleEntityState,
  delSample,
  getSamplePage,
} from "@src/store/samples";
import { InfinityScroll } from "./infinity-scroll";
import { RootState, store } from "@src/store/store";
import { entityFilter, entityMap } from "@src/util";
import { authenticatedFetch, authenticatedJsonGET } from "@src/api-helper";
import { connect } from "pwa-helpers";
import { until } from "lit-html/directives/until.js";

@customElement("sample-cards")
export class Samples extends connect(store)(LitElement) {
  @property({ attribute: false }) instance: Instance;

  @property() code: string;
  @property() tags: Tag[];
  @property() include: string[] = [];
  @property() exclude: string[] = [];
  @property() samples: SampleEntityState;
  private _data: { [key: string]: Promise<unknown> | unknown } = {};
  private _descriptor: { [key: string]: Promise<unknown> | unknown } = {};

  @property({ attribute: false }) scrollTarget;

  @query("infinity-scroll")
  infinity_scroll: InfinityScroll;

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("instance")) {
      authenticatedJsonGET(
        store.dispatch,
        `model/${this.instance.model_uuid}/instance/${this.instance.instance_uuid}/tags`
      ).then((tags) => tags);

      authenticatedFetch(
        store.dispatch,
        `model/${this.instance.model_uuid}/visualplugin`,
        { method: "GET" }
      )
        .then((res) => res.text())
        .then((code) => (this.code = code));
    }
  }

  stateChanged(state: RootState) {
    this.samples = state.samples;
  }

  async fetchData(sample: Sample) {
    const data = await authenticatedJsonGET(
      store.dispatch,
      `model/${sample.model_uuid}/instance/${sample.instance_uuid}/sample/${sample.sample_uuid}/data`
    );
    return data.reduce(async (obj, d) => {
      if (d.has_file) {
        const file = await authenticatedFetch(
          store.dispatch,
          `model/${sample.model_uuid}/instance/${sample.instance_uuid}/sample/${sample.sample_uuid}/data/${d.data_uuid}/file`,
          { method: "GET" }
        ).then((res) => res.arrayBuffer());
        obj[d.key] = {
          ...d,
          file: file,
        };
      } else {
        obj[d.key] = {
          ...d,
        };
      }
      return obj;
    }, {});
  }

  async fetchDescriptor(sample: Sample) {
    const data = await authenticatedJsonGET(
      store.dispatch,
      `model/${sample.model_uuid}/instance/${sample.instance_uuid}/descriptor`
    );
    const obj = [];
    for (const d of data) {
      if (!obj[d.key]) {
        obj[d.key] = [];
      }
      if (d.has_file) {
        const file = await authenticatedFetch(
          store.dispatch,
          `model/${sample.model_uuid}/instance/${sample.instance_uuid}/descriptor/${d.descriptor_uuid}/file`,
          { method: "GET" }
        ).then((res) => res.arrayBuffer());
        obj[d.key].push({
          ...d,
          file: file,
        });
      } else {
        obj[d.key].push({
          ...d,
        });
      }
    }
    return obj;
  }

  async data(sample: Sample) {
    if (!Object.keys(this._data).includes(sample.sample_uuid)) {
      this._data[sample.sample_uuid] = this.fetchData(sample);
    }
    this._data[sample.sample_uuid] = await Promise.resolve(
      this._data[sample.sample_uuid]
    );
    return this._data[sample.sample_uuid];
  }

  async descriptor(sample: Sample) {
    if (!Object.keys(this._descriptor).includes(sample.instance_uuid)) {
      this._descriptor[sample.instance_uuid] = this.fetchDescriptor(sample);
    }
    this._descriptor[sample.instance_uuid] = await Promise.resolve(
      this._descriptor[sample.instance_uuid]
    );
    return this._descriptor[sample.instance_uuid];
  }

  includeTagToggle = (tag) => {
    if (this.include.includes(tag)) {
      this.include = this.include.filter((t) => t != tag);
    } else {
      this.include = [...this.include, tag];
    }
  };

  excludeTagToggle = (tag) => {
    if (this.exclude.includes(tag)) {
      this.exclude = this.exclude.filter((t) => t != tag);
    } else {
      this.exclude = [...this.exclude, tag];
    }
  };

  renderTags(active, toggle) {
    const passive = new Set();
    if (this.tags) {
      for (const tag of this.tags) {
        passive.add(tag.name);
      }
    }
    for (const tag of active) {
      passive.delete(tag);
    }
    return [...active]
      .map(
        (tag) =>
          html`<span class="chip active" @click=${() => toggle(tag)}>
            ${tag}
          </span>`
      )
      .concat(
        [...passive].map(
          (tag) =>
            html`<span class="chip" @click=${() => toggle(tag)}> ${tag} </span>`
        )
      );
  }

  render() {
    return html`
      <paper-card style="width: 100%">
        including: ${this.renderTags(this.include, this.includeTagToggle)}<br />
        excluding: ${this.renderTags(this.exclude, this.excludeTagToggle)}
      </paper-card>
      ${entityMap(
        entityFilter(
          this.samples,
          (s) => s.instance_uuid == this.instance.instance_uuid
        ),
        (sample) => html` <paper-card style="width: 200px">
          <div class="card-content">
            <div class="sample">
              <plugin-sandbox
                .data=${until(this.data(sample))}
                .descriptor=${until(this.descriptor(sample))}
                .code=${this.code}
              ></plugin-sandbox>
            </div>
          </div>
          <div class="card-actions">
            <mwc-button
              @click=${() => store.dispatch(delSample({ id: sample }))}
              >delete</mwc-button
            >
          </div>
        </paper-card>`
      )}
      <paper-spinner ?active=${this.samples.loading}></paper-spinner>
      <infinity-scroll
        .scrollTarget=${this.scrollTarget}
        .updateOn=${this.include.concat(this.exclude)}
        @loadPage=${(e) => {
          store.dispatch(
            this.include.length > 0
              ? getSamplePage({
                  id: this.instance,
                  ...e.detail,
                  queryParameter: {
                    inc_tags: this.include.join(","),
                    exc_tags: this.exclude.join(","),
                  },
                })
              : getSamplePage({
                  id: this.instance,
                  ...e.detail,
                  queryParameter: {
                    exc_tags: this.exclude.join(","),
                  },
                })
          );
        }}
      ></infinity-scroll>
    `;
  }

  static get styles() {
    return css`
      paper-card {
        margin: 10px;
      }

      .chip {
        display: inline-block;
        padding: 0 10px;
        margin: 5px;
        height: 20px;
        font-size: 16px;
        line-height: 20px;
        border-radius: 25px;
        background-color: #f1f1f1;
        cursor: pointer;
      }

      .active {
        background-color: var(--mdc-theme-secondary);
      }
    `;
  }
}
