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
  html,
  property,
  query,
  css,
} from "lit-element";
import { Dialog } from "@material/mwc-dialog";

@customElement("wait-dialog")
export class WaitDialog extends LitElement {
  @query("mwc-dialog")
  dialog: Dialog;

  @property() get open() {
    return this.dialog ? this.dialog.open : false;
  }

  set open(value: boolean) {
    if (!this.dialog) return;
    if (value) {
      this.dialog.show();
    } else {
      this.dialog.close();
    }
  }

  static get styles() {
    return css`
      div {
        display: flex;
        align-items: center;
      }
      paper-spinner {
        margin: 10px;
      }

      span {
        margin-left: 10px;
      }
    `;
  }

  render() {
    return html`<mwc-dialog
      hideActions
      scrimClickAction
      escapeKeyAction
      defaultAction
    >
      <div>
        <paper-spinner active></paper-spinner> <span><slot></slot></span>
      </div>
    </mwc-dialog>`;
  }
}

@customElement("confirm-dialog")
export class ConfirmDialog extends LitElement {
  @query("mwc-dialog")
  dialog: Dialog;

  show() {
    this.dialog.show();
  }

  render() {
    return html` <mwc-dialog id="deleteDialog" @closing=${this.closing}>
      <p><slot></slot></p>
      <mwc-button slot="primaryAction" dialogAction="ok"> OK </mwc-button>
      <mwc-button slot="secondaryAction" dialogAction="cancel">
        Cancel
      </mwc-button>
    </mwc-dialog>`;
  }

  closing = (e: CustomEvent) => {
    if (e.detail.action == "ok") {
      this.dispatchEvent(new CustomEvent("confirm"));
    }
  };
}
