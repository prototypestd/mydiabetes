import { Template } from 'meteor/templating';
import { Invites, UserInfo } from '/lib/collections';

window.Invites = Invites;

Template.adminpanel.onCreated(function(){
	this.subscribe("userlist");
	this.subscribe("invites");
	this.subscribe("userinfoadmin");
	this.subscribe("labresultsadmin");
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
	labresults() {
		return LabResults.find({ userId: Session.get('curUserId') });
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
		if(Meteor.userId() === this._id){
			return Roles.userIsInRole(this._id, 'super-admin') ? "disabled" : "";
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
				Meteor.call('calculator.calcICR');
				Meteor.call('calculator.calcISF');
				swal(
					'Success!',
					'Insulin ratio updated. ' + grin,
					'success'
				);
			}
		});
	},
	'submit .new-labrecord'(event) {
		// Prevent default browser form submit
		event.preventDefault();
 
		// Get value from form element
		const target = event.target;
		const prebreakfast = target.hba1c.value;
		const prelunch = target.fast.value;
		const predinner = target.bmi.value;
		const prebed = target.malbumin.value;
		const midnight = target.lipid.value;
		const crea = target.crea.value;
		const user = Session.get('curUserId');
 
		// Insert a record into the collection
		Meteor.call('labresult.insert', prebreakfast, prelunch, predinner, prebed, midnight, crea, user, function(error, result) {
			if(error){
				swal('Oops...', 'Something went wrong!', 'error');
				console.log(error.reason);
			}else{
				swal(
					'Success!',
					'New lab result inserted. ' + grin,
					'success'
				);
			}
		});
	},
});

Template.userinvite.events({
	'click .sendInvite' () {
		swal({
			title: 'Are you sure?',
			text: 'You would have to invite back the user!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete!',
			cancelButtonText: 'No, keep',
		}).then(function() {
			console.log(Session.get('invitesendid'));
		
			var userid = Session.get('invitesendid');
			Meteor.call('beta.sendInvite', userid, function(error, result) {
				if(error){
					swal('Oops...', error.message, 'error');
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
			console.log(Session.get('invitedeleteid'));
		
			var userid = Session.get('invitedeleteid');
			Meteor.call('beta.deleteInvite', userid, function(error, result) {
				if(error){
					swal('Oops...', error.message, 'error');
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
	}
});

Template.myuser.events({
	'click [data-state]' () {
		event.preventDefault();
		
		Template.instance().userId.set(this._id);
		Session.set('curUserId',this._id);
	},
	'click .deleteUser' () {
		console.log(this._id);
		
		var userid = this._id;
		swal({
			title: 'Are you sure?',
			text: 'You would have to request the user to register back later!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete!',
			cancelButtonText: 'No, keep',
		}).then(function() {
			Meteor.call('users.deleteUser', userid, function(error, result) {
				if(error){
					swal('Oops...', error.message, 'error');
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
});
		
