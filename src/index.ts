import { LightLitElement } from "@src/components/light-element";
import { html, customElement } from "lit-element";
import "./imports";
import { connect } from "pwa-helpers";
import { store, RootState } from "./store/store";

import { Router } from "@vaadin/router";

export const router = new Router();

@customElement("koi-app")
export class App extends connect(store)(LightLitElement) {
  private _isLoggedIn: boolean;
  stateChanged(state: RootState) {
    if (state.api.isLoggedIn != this._isLoggedIn) {
      this._isLoggedIn = state.api.isLoggedIn;
      if (router) {
        if (this._isLoggedIn) {
          router.setRoutes([
            { path: "/model/:id", component: "koi-model" },
            { path: "/model", component: "koi-models" },
            { path: "/instance", component: "koi-instances" },
            {
              path: "/model/:model_id/instance/:instance_id",
              component: "koi-instance",
            },
            { path: "/login", component: "page-login" },
            { path: "/role", component: "page-roles" },
            { path: "/user", component: "page-users" },
            { path: "/access", component: "page-access" },
            { path: "/", redirect: "/home" },
            { path: "/home", component: "page-home" },
            { path: "(.*)", component: "not-found" },
          ]);
        } else {
          router.setRoutes([{ path: "(.*)", component: "page-login" }]);
        }
      }
    }
  }

  render() {
    return html``;
  }

  firstUpdated() {
    const outlet = this.renderRoot;
    router.setOutlet(outlet);
  }
}

async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/sw.js");
    } catch (e) {
      alert("ServiceWorker registration failed. Sorry about that.");
    }
  }
}

registerSW();
