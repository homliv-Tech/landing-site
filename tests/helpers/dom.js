import { mock } from "bun:test";
mock.module("server-only", () => ({}));
import { GlobalRegistrator } from "@happy-dom/global-registrator";

const network = { fetch, Request, Response, Headers };
GlobalRegistrator.register({
  url: "http://localhost:3000",
  width: 375,
  height: 812,
});
Object.assign(globalThis, network);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
