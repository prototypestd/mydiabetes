import { Mongo } from "meteor/mongo";
import * as Schemas from "./schemas";

/**
*
* Core Collections
*
*/

/**
 * UserInfo Collection
 */
export const UserInfo = new Mongo.Collection("userinfo");

UserInfo.attachSchema(Schemas.UserInfo);

/**
 * Logbook Collection
 */
export const Logbook = new Mongo.Collection("logbook");

Logbook.attachSchema(Schemas.Logbook);

/**
 * LabResults Collection
 */
export const LabResults = new Mongo.Collection("labresults");