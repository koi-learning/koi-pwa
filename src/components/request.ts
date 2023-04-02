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

import { Sample, Instance, LabelRequest } from "@src/store/interface";
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { connect } from "pwa-helpers";
import { store, RootState } from "@src/store/store";
import {
  authenticatedFetch,
  authenticatedJsonGET,
  authenticatedJsonPOST,
  authenticatedJsonPUT,
} from "@src/api-helper";
import { entityFind } from "@src/util";
import { getSample } from "@src/store/samples";
import {
  getLabelRequestPage,
  changeLabelRequest,
} from "@src/store/labelRequest";
import { until } from "lit-html/directives/until.js";

@customElement("request-card")
export class Request extends connect(store)(LitElement) {
  @property({ attribute: false }) instance: Instance;

  @property() code: string;
  @property() sample: Sample;
  @property() request: LabelRequest;
  @property() data: Promise<unknown[]>;
  @property() descriptor: Promise<unknown[]>;
  @property() tags: Promise<unknown[]>;

  static get styles() {
    return css`
      :host {
        height: 100%;
        width: 100%;
        z-index: 0;
        background: white;
      }
    `;
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("instance")) {
      authenticatedFetch(
        store.dispatch,
        `model/${this.instance.model_uuid}/requestplugin`,
        { method: "GET" }
      )
        .then((res) => res.text())
        .then((code) => (this.code = code));
      store.dispatch(
        getLabelRequestPage({
          id: this.instance,
          page: 0,
          queryParameter: { obsolete: "0" },
        })
      );
    }
    if (changedProperties.has("request")) {
      if (this.sample == null) store.dispatch(getSample({ id: this.request }));
    }
    if (changedProperties.has("sample")) {
      this.data = this.fetchData(this.sample);
      this.descriptor = this.fetchDescriptor(this.sample);
      this.tags = this.fetchTags(this.sample);
    }
  }

  stateChanged(state: RootState) {
    this.request = entityFind(
      state.featureRequests,
      (r) => r.instance_uuid == this.instance.instance_uuid && !r.obsolete
    );
    if (this.request) {
      this.sample = entityFind(
        state.samples,
        (s) => s.sample_uuid == this.request.sample_uuid
      );
    }
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

  async fetchTags(sample: Sample) {
    return await authenticatedJsonGET(
      store.dispatch,
      `model/${sample.model_uuid}/instance/${sample.instance_uuid}/sample/${sample.sample_uuid}/tags`
    );
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

  render() {
    if (this.request) {
      return html`
        <plugin-sandbox
          .data=${until(this.data)}
          .descriptor=${until(this.descriptor)}
          .code=${this.code}
          .tags=${until(this.tags)}
          @plugin-label=${this.plugin_label}
          @plugin-descriptor=${this.plugin_descriptor}
          @plugin-tag=${this.plugin_tag}
        ></plugin-sandbox>
      `;
    } else {
      return html` <div>no requests...</div> `;
    }
  }

  plugin_label(e) {
    this.addLabels(e.detail);
  }

  plugin_descriptor(e) {
    this.addDescriptors(e.detail);
  }

  plugin_tag(e) {
    this.addTags(e.detail);
  }

  async addLabels(data) {
    for (const d of data) {
      if (d.data_uuid) {
      } else {
        await this.addLabel(d.key, d.data);
      }
    }
    store.dispatch(
      changeLabelRequest({ id: this.request, data: { obsolete: true } })
    );
  }

  async addDescriptors(data) {
    for (const d of data) {
      if (d.data_uuid) {
      } else {
        await this.addDescriptor(d.key, d.data);
      }
    }
    store.dispatch(
      changeLabelRequest({ id: this.request, data: { obsolete: true } })
    );
  }

  async addTags(data) {
    for (const d of data) {
      if (d.data_uuid) {
      } else {
        await this.addTag(d.name);
      }
    }
    store.dispatch(
      changeLabelRequest({ id: this.request, data: { obsolete: true } })
    );
  }

  async addLabel(key, data) {
    const label = await authenticatedJsonPOST(
      store.dispatch,
      `model/${this.request.model_uuid}/instance/${this.request.instance_uuid}/sample/${this.request.sample_uuid}/label`,
      { key: key }
    );

    await authenticatedFetch(
      store.dispatch,
      `model/${this.request.model_uuid}/instance/${this.request.instance_uuid}/sample/${this.request.sample_uuid}/label/${label.label_uuid}/file`,
      {
        headers: { ContentType: "application/octet-stream" },
        method: "POST",
        body: data,
      }
    );
  }

  async addDescriptor(key, data) {
    const descriptor = await authenticatedJsonPOST(
      store.dispatch,
      `model/${this.request.model_uuid}/instance/${this.request.instance_uuid}/descriptor`,
      { key: key }
    );

    await authenticatedFetch(
      store.dispatch,
      `model/${this.request.model_uuid}/instance/${this.request.instance_uuid}/descriptor/${descriptor.descriptor_uuid}/file`,
      {
        headers: { ContentType: "application/octet-stream" },
        method: "POST",
        body: data,
      }
    );
  }

  async addTag(name) {
    await authenticatedJsonPUT(
      store.dispatch,
      `model/${this.request.model_uuid}/instance/${this.request.instance_uuid}/sample/${this.request.sample_uuid}/tags`,
      [{ name: name }]
    );
  }
}
