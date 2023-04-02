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

import { LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("infinity-scroll")
export class InfinityScroll extends LitElement {
  private _scrollTarget!: HTMLElement;
  private _isLocked = false;
  private _isPending = false;
  private _page: Array<number> = [];
  private _count: Array<number> = [];
  private _currentSubpage = 0;

  @property() timeout = 2000;
  @property({ type: Number }) subPages = 0; // How many nested levels are there
  @property() updateOn;
  disconnecting: boolean;

  @property()
  get scrollTarget() {
    return this._scrollTarget || undefined;
  }

  set scrollTarget(value) {
    this.unregisterScrollListener();
    const old = this.scrollTarget;
    this._scrollTarget = value;
    this.requestUpdate("scrollTarget", old); // neccessary for custom property setter
    this.registerScrollListener();
  }

  update(changedProperties) {
    super.update(changedProperties);
    this.reset();
  }

  reset() {
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
          subpage: this._currentSubpage, // the level of subpaging
          page: this._page[this._currentSubpage], // the page to load
          count: this._count, // which element is selected on each level
          fullfilled: this.fullfilled,
          rejected: this.rejected,
          noparent: this.noparent, // should be called when for there is no element on a higher level corrosponding to count
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
    // when the loading of the page was rejected, try again after timeout
    // the request is still pending
    this._isLocked = true;
    setTimeout(() => {
      if (this.disconnecting) return;
      this._isLocked = false;
      this.loadNextPageIfNecessary();
    }, this.timeout);
  };

  protected fullfilled = (elements: number) => {
    // when the page loading was sucessful
    this._isPending = false;
    if (elements > 0) {
      // there were new elements added, so increase the page number of this level
      this._page[this._currentSubpage]++;
      if (this._currentSubpage < this.subPages) {
        // go down the hierarchie if there are still lower levels. We first want to exhaust the lower levels
        this._currentSubpage++;
      }
      this.loadNextPageIfNecessary();
    } else {
      // there are no new elements in this level
      if (this._currentSubpage > 0) {
        // we are on a lower level page, so we move on to the next element on the previous level
        this._count[this._currentSubpage - 1]++;
        // we will start at the 0 element (in page 0) again for this level
        this._count[this._currentSubpage] = 0;
        this._page[this._currentSubpage] = 0;
        this.loadNextPageIfNecessary();
      } else {
        this.reset();
        this._isLocked = true;
        setTimeout(() => {
          if (this.disconnecting) return;
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
      setTimeout(() => !this.disconnecting && this.loadPage(), 0);
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
    this.disconnecting = true;
    super.disconnectedCallback();
    this.unregisterListeners();
  }
}
