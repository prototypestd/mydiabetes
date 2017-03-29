import { Template } from 'meteor/templating';
import { Invites, UserInfo } from '/lib/collections';

Template.adminpanel.onCreated(function(){
	this.subscribe("userlist");
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
	},
	isCurrentUser(userId){
		return userId === Meteor.userId() ? true : false;
	},
	disableIfAdmin(userId){
		if(Meteor.userId() === userId){
			return Roles.userIsInRole(userId, 'super-admin') ? "disable" : "";
		}
	},
	disableIfDoctorAdmin(userId){
		if(!Roles.userIsInRole(Meteor.userId(), 'super-admin')){
			return Roles.userIsInRole(userId, ['doctor', 'super-admin']) ? "visibility:hidden" : "";
		}
	},
	selected(v1, v2){
		return v1 === v2 ? true : false;
	}
});

var grin = emojione.toImage(':grin:');
var cry = emojione.toImage(':cry:');

Template.adminpanel.events({
	'click .sendInvite' () {
		swal({
			title: 'Are you sure?',
			text: 'You would have to invite back the user!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete!',
			cancelButtonText: 'No, keep',
		}).then(function() {
			Meteor.call('beta.sendInvite', this._id, function(error, result) {
				if(error){
					swal('Oops...', 'Something went wrong!', 'error');
					console.log(error.reason);
				}else{
					swal(
						'Deleted!',
						'The invite was sent ' + grin,
						'success'
					);
				}
			});
		}, function(dismiss) {
			// dismiss can be 'cancel', 'overlay', 'close', 'timer'
			if (dismiss === 'cancel') {
				swal(
					'Cancelled',
					'The invite was not sent ' + cry,
					'error'
				);
			}
		});
	},
	'click .deleteInvite' () {
		swal({
			title: 'Are you sure?',
			text: 'You would have to invite back the user!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete!',
			cancelButtonText: 'No, keep',
		}).then(function() {
			console.log(this._id);
			Meteor.call('beta.deleteInvite', this._id, function(error, result) {
				if(error){
					swal('Oops...', 'Something went wrong!', 'error');
					console.log(error.reason);
				}else{
					swal(
						'Deleted!',
						'The invite was cancelled ' + grin,
						'success'
					);
				}
			});
		}, function(dismiss) {
			// dismiss can be 'cancel', 'overlay', 'close', 'timer'
			if (dismiss === 'cancel') {
				swal(
					'Cancelled',
					'The invite was not cancelled ' + cry,
					'error'
				);
			}
		});
	},
	'click .deleteUser' () {
		swal({
			title: 'Are you sure?',
			text: 'You would have to request the user to register back later!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete!',
			cancelButtonText: 'No, keep',
		}).then(function() {
			Meteor.call('user.deleteUser', this._id, function(error, result) {
				if(error){
					swal('Oops...', 'Something went wrong!', 'error');
					console.log(error.reason);
				}else{
					swal(
						'Deleted!',
						'The user was deleted ' + grin,
						'success'
					);
				}
			});
		}, function(dismiss) {
			// dismiss can be 'cancel', 'overlay', 'close', 'timer'
			if (dismiss === 'cancel') {
				swal(
					'Cancelled',
					'The user was not deleted ' + cry,
					'error'
				);
			}
		});
	},
    'change [name="userRole"]': function( event, template ) {
		let role = $( event.target ).find( 'option:selected' ).val();

		Meteor.call( "user.setRoleOnUser", {
			user: this._id,
			role: role
		}, ( error, response ) => {
			if ( error ) {
				swal('Oops...', 'Something went wrong! ' + cry, 'error');
				console.log(error.reason);
			}
		});
	}
});
		