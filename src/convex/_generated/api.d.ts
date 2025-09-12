/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as alerts from "../alerts.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as farms from "../farms.js";
import type * as fields from "../fields.js";
import type * as http from "../http.js";
import type * as maps from "../maps.js";
import type * as mockData from "../mockData.js";
import type * as plantImages from "../plantImages.js";
import type * as sensorData from "../sensorData.js";
import type * as uploads from "../uploads.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  alerts: typeof alerts;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  farms: typeof farms;
  fields: typeof fields;
  http: typeof http;
  maps: typeof maps;
  mockData: typeof mockData;
  plantImages: typeof plantImages;
  sensorData: typeof sensorData;
  uploads: typeof uploads;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
