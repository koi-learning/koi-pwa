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
  property,
  query,
  html,
  css,
  TemplateResult,
} from "lit-element";
import { GraphicType } from "@material/mwc-list/mwc-list-item-base";
import { Checkbox } from "@material/mwc-checkbox/mwc-checkbox";
import { List } from "@material/mwc-list";

import { CheckListItem } from "@material/mwc-list/mwc-check-list-item";
import { MultiSelectedEvent } from "@material/mwc-list/mwc-list-foundation";

export class ListItemBase extends CheckListItem {
  @property({ attribute: false }) hovered = false;
  @property({ type: Boolean }) selectionMode = false;

  twoline = true;
  left = true;
  graphic: GraphicType = "avatar";
  hasMeta = true;

  static get styles() {
    return [
      ...super.styles,
      css`
        .state-icon {
          color: var(--mdc-theme-text-disabled-on-background);
          --mdc-icon-size: 24px;
        }

        .state-icon.active {
          color: var(--mdc-theme-secondary);
        }

        :host {
          text-align: left;
        }

        .mdc-list-item__meta {
          width: unset !important;
          height: 24px !important;
        }
      `,
    ];
  }

  protected renderText() {
    return html`
      <span class="mdc-list-item__text">
        <span class="mdc-list-item__primary-text"> ${this.primaryText()} </span>
        <span class="mdc-list-item__secondary-text">
          ${this.secondaryText()}
        </span>
      </span>
    `;
  }

  protected renderGraphic() {
    return html` <span class="mdc-list-item__graphic material-icons">
      ${this.icon()}
    </span>`;
  }

  protected renderMeta() {
    return html` <span class="mdc-list-item__meta material-icons">
      ${this.meta()}
    </span>`;
  }

  render() {
    const showCheckbox =
      this.hovered || this.selectionMode || this.graphic === "control";
    const text = this.renderText();
    const graphic =
      this.graphic && this.graphic !== "control" && !(this.left && showCheckbox)
        ? this.renderGraphic()
        : html``;
    const meta =
      this.hasMeta && !(!this.left && showCheckbox)
        ? this.renderMeta()
        : html``;
    const ripple = this.renderRipple();
    const checkbox = showCheckbox ? this.renderCheckbox() : html``;

    return html` ${ripple} ${graphic} ${this.left ? "" : text} ${checkbox}
    ${this.left ? text : ""} ${meta}`;
  }

  private renderCheckbox() {
    return html`<span class="mdc-list-item__graphic">
      <mwc-checkbox
        reducedTouchTarget
        tabindex=${this.tabindex}
        .checked=${this.selected}
        ?disabled=${this.disabled}
        @change=${this.onChange}
        @click=${(event: Event) => {
          event.stopPropagation();
        }}
      >
      </mwc-checkbox>
    </span>`;
  }

  protected async onChange(evt: Event) {
    const checkbox = evt.target as Checkbox;

    if (this.selected !== checkbox.checked) {
      this.selected = checkbox.checked;
    }
  }

  startHover() {
    this.hovered = true;
  }

  endHover() {
    this.hovered = false;
  }

  protected onClick() {
    this.action();
  }

  contextMenu(event: Event) {
    super.onClick();
    event.preventDefault();
    event.stopPropagation();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("mouseenter", this.startHover);
    //this.addEventListener("focus", this.startHover)
    this.addEventListener("mouseleave", this.endHover);
    //this.addEventListener("blur", this.endHover)
    this.addEventListener("contextmenu", this.contextMenu);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("mouseenter", this.startHover);
    //this.removeEventListener("focus", this.startHover)
    this.removeEventListener("mouseleave", this.endHover);
    //this.removeEventListener("blur", this.endHover)
  }

  protected primaryText(): TemplateResult {
    throw new Error("Method not implemented.");
  }

  protected secondaryText(): TemplateResult {
    throw new Error("Method not implemented.");
  }

  protected meta(): TemplateResult {
    throw new Error("Method not implemented.");
  }

  protected icon(): TemplateResult {
    throw new Error("Method not implemented.");
  }

  protected action(): void {
    throw new Error("Method not implemented.");
  }
}

export class ListBase extends LitElement {
  @query("mwc-list")
  list: List;
  selection: unknown[];

  @property()
  selectionMode = false;
  @property()
  private oneSelected: boolean;

  private _selectionMode = false;

  update(changedProperties) {
    super.update(changedProperties);
    if (
      changedProperties.has("selectionMode") ||
      changedProperties.has("oneSelected")
    ) {
      const newSelectionMode = this.selectionMode || this.oneSelected;
      if (newSelectionMode !== this._selectionMode) {
        this._selectionMode = newSelectionMode;
        this.dispatchEvent(
          new CustomEvent("selectionMode", {
            detail: { selectionModeActive: this._selectionMode },
          })
        );
      }
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this.setSelectionModeOnChilds();
  }

  private setSelectionModeOnChilds() {
    for (const item of this.list.items as ListItemBase[]) {
      item.selectionMode = this._selectionMode;
    }
  }

  firstUpdated() {
    this.list.addEventListener("selected", (event: MultiSelectedEvent) => {
      this.oneSelected = event.detail.index.size ? true : false;

      const selection = [];
      for (const i of event.detail.index) {
        selection.push(this.list.items[i]);
      }
      this.selection = selection;
    });
  }
}
