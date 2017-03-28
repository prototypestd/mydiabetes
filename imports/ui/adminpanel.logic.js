import { Template } from 'meteor/templating';
import { Invites, UserInfo } from '/lib/collections';

Template.adminpanel.onCreated(function(){
  this.subscribe("invites");
});

Template.adminpanel.helpers({
	tasks() {
		return Invites.find({});
	},
	users() {
		return Meteor.users.find({});
	}
});

Template.user.helpers({
	email() {
		return this.emails[0].address;
	}
});

Template.adminpanel.events({
	'click .sendInvite' () {
		if(confirm('Are you sure you want to invite' + this.email +'?')){
			Meteor.call('beta.sendInvite', this._id, function(error, result) {
				if(error){
					alert(error.reason);
				}else{
					alert('Invite sent!');
				}
			});
		}
	},
	'click .deleteInvite' () {
		if(confirm('Are you sure you want to cancel ' + this.email +'\'s invitation?')){
			Meteor.call('beta.deleteInvite', this._id, function(error, result) {
				if(error){
					alert(error.reason);
				}else{
					alert('Invite canceled!');
				}
			});
		}
	},
	'click .deleteUser' () {
		if(confirm('Are you sure you want to delete ' + this.email +'?')){
			Meteor.call('user.deleteUser', this._id, function(error, result) {
				if(error){
					alert(error.reason);
				}else{
					alert('User deleted!');
				}
			});
		}
	}
});
		