import { Template } from 'meteor/templating';
import { Invites, UserInfo } from '/lib/collections';

Template.adminpanel.onCreated(function(){
	this.subscribe("userlist");
	this.subscribe("invites");
	this.subscribe("userinfoadmin");
});

Template.myuser.onCreated(function(){
	this.userId = new ReactiveVar('');
});

Template.adminpanel.helpers({
	tasks() {
		return Invites.find({});
	},
	users() {
		return Meteor.users.find({});
	},
	clickedId() {
		return Session.get('curUserId');
	}
});

Template.myuser.helpers({
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
	},
	userInfo(){
		let user = Template.instance().userId.get();
		console.log(user);
		console.log(UserInfo.find({ userId: user }).map(function(post) { return post._id; }));
		return UserInfo.find({ userId: user }).map(function(post) { return post._id; });
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
	},
	'submit .update-insulin'(event) {
		// Prevent default browser form submit
		event.preventDefault();
	 
		// Get value from form element
		const target = event.target;
		const totalDose = target.totalDose.value;
		const userId = Session.get('curUserId');
	 
		// Insert a record into the collection
		Meteor.call('user.updateInsulin', totalDose, userId, function(error, result){
			if(error){
				swal('Oops...', 'Something went wrong!', 'error');
				console.log(error.reason);
			}else{
				swal(
					'Success!',
					'Insulin ratio updated. ' + grin,
					'success'
				);
			}
		});
	}
});

Template.myuser.events({
	'click [data-state]' () {
		event.preventDefault();
		
		Template.instance().userId.set(this._id);
		Session.set('curUserId',this._id);
	}
});
		
