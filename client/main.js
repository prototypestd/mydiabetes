import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Logbook } from '../imports/api/Logbook.js';
import { UserInfo } from '../imports/api/Calculator.js';
import { FoodLibrary } from '../imports/api/FoodLibrary.js';
import { SimpleSchema } from 'simpl-schema';

// Import some stratup functions
import '../imports/startup/routes.js';

Meteor.startup(function () {
	Status.setTemplate('uikit');
});

// Import the main page
import './main.html';

// Import template logics
import '../imports/ui/global.logic.js';
import '../imports/ui/index.logic.js';
import '../imports/ui/logbook.logic.js';
import '../imports/ui/foodlibrary.logic.js';
import '../imports/ui/adminpanel.logic.js';

AutoForm.debug();

// Global Template Logic
Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('logbook');
  Meteor.subscribe('userinfo');
});

Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');
Template['override-atTextInput'].replaces('atTextInput');

//SimpleSchema.extendOptions(['autoform']);

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


