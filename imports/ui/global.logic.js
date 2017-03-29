import { Template } from 'meteor/templating';

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
	}
});

Template.header.events({
	'click [data-state]' (event, template){
		event.preventDefault();
		
		Template.instance().state.set(event.target.dataset.state);
	}
});