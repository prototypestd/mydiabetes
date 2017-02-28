import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Logbook } from '../imports/api/Logbook.js';

import './main.html';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('logbook');
});

Template.logbook.helpers({
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
});

// Routing
BlazeLayout.setRoot('body');

FlowRouter.route('/', {
  name: 'App_Content',
  action() {
	  if(Meteor.user() == undefined){
		BlazeLayout.render('content', {main: 'dashboard'});
	  }else{
		BlazeLayout.render('content', {main: 'index'});
	  }
  }
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('content', {main: 'App_notFound'});
  }
};

// Template overrides
Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');
Template['override-atTextInput'].replaces('atTextInput');

// User Management
var loginFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
		BlazeLayout.render('content', {main: 'dashboard'});
    }
    if (state === "signUp") {
		BlazeLayout.render('content', {main: 'dashboard'});
    }
  }
};

var postLogout = function(){
    BlazeLayout.render('content', {main: 'index'});
};

AccountsTemplates.configure({
    onSubmitHook: loginFunc,
	onLogoutHook: postLogout
});

// Collections
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


