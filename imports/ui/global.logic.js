import { Template } from 'meteor/templating';

if(Meteor.isClient){
	Tracker.autorun((c) => {
		let status = Meteor.status().connected;
		
		if(!status && !c.firstRun){
			Bert.alert('It seems that we\'ve lost connection to the server', 'danger', 'growl-top-right');
		}
	});
	
	Tracker.autorun(() => {
		let user = Meteor.userId();
		
		if(!user){
			BlazeLayout.render('content', {main: 'index'});
		}
	});
};

Template.header.onCreated(function(){
  this.state = new ReactiveVar('dashboard');
});

Template.registerHelper("isLoggedIn", function () {
	if(Meteor.user()){
		return true;
	}else{
		return false;
	}
});

Template.header.helpers({
	isDashboard(){
		if(Template.instance().state.get() === 'dashboard'){
			return true;
		}else{
			return false;
		}
	},
	isLogbook(){
		if(Template.instance().state.get() === 'logbook'){
			return true;
		}else{
			return false;
		}
	},
	isFlibrary(){
		if(Template.instance().state.get() === 'flibrary'){
			return true;
		}else{
			return false;
		}
	},
	isProfile(){
		if(Template.instance().state.get() === 'profile'){
			return true;
		}else{
			return false;
		}
	},
	isBurger(){
		if(Template.instance().state.get() === 'burger'){
			return true;
		}else{
			return false;
		}
	}
});

Template.header.events({
	'click [data-state]' (event, template){
		event.preventDefault();
		
		Template.instance().state.set(event.target.dataset.state);
	},
	'click .logout' (event){
		Meteor.logout();
		BlazeLayout.render('content', {main: 'index'});
	}
});