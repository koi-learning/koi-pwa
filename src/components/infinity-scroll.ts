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

import { LitElement, property, customElement } from "lit-element";

@customElement("infinity-scroll")
export class InfinityScroll extends LitElement {
  private _scrollTarget!: HTMLElement;
  private _isLocked = false;
  private _isPending = false;
  private _page: Array<number> = [];
  private _count: Array<number> = [];
  private _currentSubpage = 0;

  @property() timeout = 1000;
  @property({ type: Number }) subPages = 0;
  @property() updateOn;

  @property()
  get scrollTarget() {
    return this._scrollTarget || undefined;
  }

  set scrollTarget(value) {
    this.unregisterScrollListener();
    const old = this.scrollTarget;
    this._scrollTarget = value;
    this.requestUpdate("scrollTarget", old);
    this.registerScrollListener();
  }

  update(changedProperties) {
    super.update(changedProperties);
    this.reset();
  }

  protected reset() {
    this._page = new Array(this.subPages + 1);
    this._page.fill(0);
    this._count = new Array(this.subPages + 1);
    this._count.fill(0);
    this._currentSubpage = this.subPages;
    this._isLocked = false;
  }

  protected loadPage() {
    this.dispatchEvent(
      new CustomEvent("loadPage", {
        detail: {
          subpage: this._currentSubpage,
          page: this._page[this._currentSubpage],
          count: this._count,
          fullfilled: this.fullfilled,
          rejected: this.rejected,
          noparent: this.noparent,
        },
      })
    );
  }

  protected noparent = () => {
    this._currentSubpage--;
    this._isPending = false;
    this.loadNextPageIfNecessary();
  };

  protected rejected = () => {
    this._isLocked = true;
    setTimeout(() => {
      this._isLocked = false;
      this.loadNextPageIfNecessary();
    }, this.timeout);
  };

  protected fullfilled = (elements: number) => {
    this._isPending = false;
    if (elements > 0) {
      this._page[this._currentSubpage]++;
      if (this._currentSubpage < this.subPages) {
        this._currentSubpage++;
      }
      this.loadNextPageIfNecessary();
    } else {
      if (this._currentSubpage > 0) {
        this._count[this._currentSubpage - 1]++;
        this._count[this._currentSubpage] = 0;
        this._page[this._currentSubpage] = 0;
        this.loadNextPageIfNecessary();
      } else {
        this.reset();
        this._isLocked = true;
        setTimeout(() => {
          this._isLocked = false;
          this.loadNextPageIfNecessary();
        }, this.timeout);
      }
    }
  };
  protected loadNextPageIfNecessary() {
    if (
      this.scrollTarget &&
      this.scrollTarget.scrollTop + 300 >=
        this.scrollTarget.scrollHeight - this.scrollTarget.clientHeight &&
      !this._isPending &&
      !this._isLocked
    ) {
      this._isPending = true;
      setTimeout(() => this.loadPage(), 0);
    }
  }

  protected handleTargetScroll = () => {
    this.loadNextPageIfNecessary();
  };

  protected registerListeners() {
    this.registerScrollListener();
  }

  protected unregisterListeners() {
    this.unregisterScrollListener();
  }

  protected registerScrollListener() {
    if (this.scrollTarget)
      this.scrollTarget.addEventListener("scroll", this.handleTargetScroll);
    this.loadNextPageIfNecessary();
  }

  protected unregisterScrollListener() {
    if (this.scrollTarget)
      this.scrollTarget.removeEventListener("scroll", this.handleTargetScroll);
  }

  connectedCallback() {
    super.connectedCallback();
    this.reset();
    this.registerListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unregisterListeners();
  }
}
