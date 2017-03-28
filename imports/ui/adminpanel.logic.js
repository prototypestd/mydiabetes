import { Template } from 'meteor/templating';
import { Invites, UserInfo } from '/lib/collections';

Template.adminpanel.onCreated(function(){
  this.subscribe("invites");
});

Template.adminpanel.helpers({
	tasks() {
		return Invites.find({});
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
	}
});
		