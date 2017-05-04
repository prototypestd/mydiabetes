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
 * Invites Collection
 */
export const Invites = new Mongo.Collection("invites");

Invites.attachSchema(Schemas.Invites);

/**
 * Logbook Collection
 */
export const Logbook = new Mongo.Collection("logbook");

Logbook.attachSchema(Schemas.Logbook);

/**
 * LabResults Collection
 */
export const LabResults = new Mongo.Collection("labresults");

LabResults.attachSchema(Schemas.LabResults);

/**
 * Food Library Collection
 */
export const FoodLibrary = new Mongo.Collection("foodlibrary");

FoodLibrary.attachSchema(Schemas.FoodLibrary);

/**
 * User Chats Collection
 */
export const UserChats = new Mongo.Collection("userchat");

UserChats.attachSchema(Schemas.UserChats);
