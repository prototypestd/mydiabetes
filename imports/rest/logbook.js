import { Meteor } from 'meteor/meteor';
import { Logbook } from '../api/Logbook.js';
import { Api } from './apiversion.js';

if (Meteor.isServer) {

  // Generates: GET, POST on /api/items and GET, PUT, PATCH, DELETE on
  // /api/items/:id for the Items collection
  Api.addCollection(Logbook);

}