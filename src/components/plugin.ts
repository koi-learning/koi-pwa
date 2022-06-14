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
  html,
  customElement,
  property,
  TemplateResult,
  LitElement,
  query,
  css,
} from "lit-element";

const frameContent = html`
  <!DOCTYPE html>
  <html style="width:100%; height:100%;">
    <head>
      <script>
        window.addEventListener("message", function (e) {
          const vw = Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
          );
          const vh = Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
          );

          const do_label = function (data) {
            const message = { type: "label", data: data };
            window.parent.postMessage(message, "*");
          };

          const do_descriptor = function (data) {
            const message = { type: "descriptor", data: data };
            window.parent.postMessage(message, "*");
          };

          const do_tag = function (data) {
            const message = { type: "tag", data: data };
            window.parent.postMessage(message, "*");
          };

          switch (e.data.type) {
            case "sample":
              if (e.data.tags == undefined) {
                e.data.tags = [];
              }
              eval(e.data.code);
              display(e.data.data, e.data.descriptor, vw, vh, e.data.tags);
              break;
          }
        });
      </script>
    </head>
    <body
      style="width:100%; height:100%; margin:0; display: flex;flex-direction: column;"
    ></body>
  </html>
`;

@customElement("plugin-sandbox")
export class PluginSandbox extends LitElement {
  @property() code: string;
  @property() data;
  @property() descriptor;
  @property() tags;

  @query("iframe") iframe: HTMLIFrameElement;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("message", this.messageListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("message", this.messageListener);
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (
      changedProperties.has("data") ||
      changedProperties.has("descriptor") ||
      changedProperties.has("code") ||
      changedProperties.has("tags")
    ) {
      if (this.iframe && this.descriptor && this.data && this.code) {
        const message = {
          type: "sample",
          code: this.code,
          data: this.data,
          descriptor: this.descriptor,
          tags: this.tags,
        };
        this.iframe.contentWindow.postMessage(message, "*");
      }
    }
  }

  static get styles() {
    return css`
      iframe {
        border: none;
        width: 100%;
        height: 100%;
      }
    `;
  }

  render(): TemplateResult {
    return html` <iframe></iframe>`;
  }

  firstUpdated() {
    this.iframe.contentWindow.document.write(frameContent.getHTML());
    if (this.descriptor && this.data && this.code) {
      const message = {
        type: "sample",
        code: this.code,
        data: this.data,
        descriptor: this.descriptor,
        tags: this.tags,
      };
      this.iframe.contentWindow.postMessage(message, "*");
    }
  }

  messageListener = (e) => {
    if (e.data.type && e.data.type == "label") {
      const event = new CustomEvent("plugin-label", {
        detail: e.data.data,
      });
      this.dispatchEvent(event);
    } else if (e.data.type && e.data.type == "descriptor") {
      const event = new CustomEvent("plugin-descriptor", {
        detail: e.data.data,
      });
      this.dispatchEvent(event);
    } else if (e.data.type && e.data.type == "tag") {
      const event = new CustomEvent("plugin-tag", {
        detail: e.data.data,
      });
      this.dispatchEvent(event);
    }
  };
}
