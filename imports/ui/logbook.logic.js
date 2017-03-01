import { Template } from 'meteor/templating';
import { Logbook } from '../api/Logbook.js';

Template.logbook.helpers({
  curYear() {
	 var today = new Date();
	 return today.getFullYear();
  },
  tasks() {
      return Logbook.find({});
  },
});

Template.logbook.events({
  'submit .new-record'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const prebreakfast = target.prebreakfast.value;
    const prelunch = target.prelunch.value;
    const predinner = target.predinner.value;
    const prebed = target.prebed.value;
    const midnight = target.midnight.value;
 
    // Insert a record into the collection
    Meteor.call('logbook.insert', prebreakfast, prelunch, predinner, prebed, midnight);
 
    // Clear form
    target.text.value = '';
    target.prebreakfast.value = '';
    target.prelunch.value = '';
    target.predinner.value = '';
    target.prebed.value = '';
    target.midnight.value = '';
  },
  'click .delete'() {
    Meteor.call('logbook.remove', this._id);
  },
});

Logbook.schema = new SimpleSchema({
  userId: {type: String, regEx: SimpleSchema.RegEx.Id},
  date: {type: String},
  prebreakfast: {type: Number, optional: true},
  prelunch: {type: Number, optional: true},
  predinner: {type: Number, optional: true},
  prebed: {type: Number, optional: true},
  midnight: {type: Number, optional: true},
  bolus1: {type: Number, optional: true},
  bolus2: {type: Number, optional: true},
  bolus3: {type: Number, optional: true},
  basal: {type: Number, optional: true}
});

Logbook.attachSchema(Logbook.schema);