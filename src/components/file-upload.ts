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

import { LitElement, html, customElement, property, css } from "lit-element";
import { store } from "@src/store/store";
import { authenticatedFetch } from "@src/api-helper";

@customElement("koi-file-upload")
export class FileUpload extends LitElement {
  @property({ attribute: false }) isUploading = false;
  @property({ attribute: false }) isDownloading = false;
  @property() showUpload: boolean;
  @property() showDownload: boolean;
  @property() location: string;
  @property() filename: string;
  @property() label: string;

  uploadTemplate() {
    if (this.isUploading) {
      return html`<mwc-button
        outlined
        label="uploading"
        disabled
      ></mwc-button>`;
    }
    if (this.showUpload != undefined) {
      return html`<mwc-button
        icon="file_upload"
        outlined
        label="upload"
        @click=${() =>
          (this.renderRoot.querySelector("input") as HTMLInputElement).click()}
      ></mwc-button>`;
    }
  }

  downloadTemplate() {
    if (this.isDownloading) {
      return html`<mwc-button
        outlined
        label="downloading"
        disabled
      ></mwc-button>`;
    }
    if (this.showDownload != undefined) {
      return html`<mwc-button
        icon="file_download"
        outlined
        label="download"
        @click=${this.download}
      ></mwc-button>`;
    }
  }

  static get styles() {
    return css`
      .flex {
        display: flex;
        text-align: left;
      }

      mwc-button {
        width: 100%;
      }

      .label {
        width: 100%;
        max-width: 150px;
        margin: auto;
        font-size: 1rem;
        line-height: 1.75rem;
        font-weight: 400;
        letter-spacing: 0.009375em;
      }
    `;
  }

  render() {
    return html`
      <div class="flex">
        ${this.label
          ? html`<span class="mdc-typography--subtitle1 label"
              >${this.label}</span
            >`
          : html``}
        ${this.uploadTemplate()} ${this.downloadTemplate()}
      </div>
      <input
        type="file"
        name="name"
        style="display: none;"
        @change=${this.upload}
      />
      <a style="display: none;" download=${this.filename}></a>
    `;
  }

  upload() {
    const input = this.renderRoot.querySelector("input");
    const file = input.files[0];
    input.value = "";
    this.isUploading = true;

    authenticatedFetch(store.dispatch, this.location, {
      headers: { ContentType: "application/octet-stream" },
      method: "POST",
      body: file,
    })
      .then(() => {
        this.isUploading = false;
        this.dispatchEvent(new CustomEvent("uploaded"));
      })
      .catch(() => {
        this.isUploading = false;
      });
  }

  download() {
    const link = this.renderRoot.querySelector("a");
    this.isDownloading = true;

    authenticatedFetch(store.dispatch, this.location, { method: "GET" })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        link.href = url;
        link.click();
        this.isDownloading = false;
      })
      .catch(() => {
        this.isUploading = false;
      });
  }
}
