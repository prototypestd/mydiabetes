import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { UserInfo, Invites } from '/lib/collections';

if (Meteor.isServer) {
	
	UserInfo.permit(['insert', 'update', 'remove']).ifLoggedIn();
	
	Invites.permit(['insert', 'update', 'remove']);
	
	// This code only runs on the server
    Meteor.publish('userinfo', function userInfo() {
		return UserInfo.find({
			$or: [
				{ userId: this.userId }
			],
		});
	});
	
    Meteor.publish('invites', function userInfo() {
		return Invites.find({});
	});
}

Meteor.methods({
	/**
	 * Adds a user to the invite list 
	 *
	 * @param {String} email User email
	 */
	'beta.addToInvites' (email, reason){
		check(email, String);
		check(reason, String);
		
		let emailExists = Invites.findOne( { email: email } ),
			inviteCount = Invites.find( {}, { fields: { _id: 1 } } ).count();
			
		if(!emailExists){
			return Invites.insert({
				email: email,
				invited: false,
				requested: (new Date()).toISOString(),
				token: Random.hexString(15),
				accountCreated: false,
				inviteNumber: inviteCount + 1,
				reason: reason
			});
		}else{
			throw new Meteor.Error('already-invited', 'Sorry it looks like you\'ve already been invited');
		}
	},
	'beta.sendInvite' (inviteId){
		check(inviteId, String);
		
		const urls = {
			development: 'http://localhost:3000/signup/',
			production: '#'
		};

		let invite = Invites.findOne({_id: inviteId });
		
		if(invite){
		  SSR.compileTemplate( 'inviteEmail', Assets.getText( 'email/templates/invite.html' ) );

		  Email.send({
			to: invite.email,
			from: 'myDiabetes <beta@mydiabetes.io>',
			subject: 'Welcome to myDiabetes!',
			html: SSR.render( 'inviteEmail', {
			  url: urls[ process.env.NODE_ENV ] + invite.token
			})
		  });

		  Invites.update( invite._id, {
			$set: {
			  invited: true,
			  dateInvited: ( new Date() ).toISOString()
			} 
		  });
		} else {
		  throw new Meteor.Error( 'not-found', 'Sorry, an invite with that ID could not be found.' );
		}
	},
	'beta.deleteInvite' (userId){
		check(userId, String);
		
		Invites.remove(userId);
	},
	'users.deleteUser' (userId){
		check(userId, String);
		
		Meteor.user.remove(userId);
	},
	/**
	* Update a user's permission
	*
	* @param {object} targetUserId Id of user to update
	* @param {Array} roles User's new permissions
	* @param {String} group User's new group
	*/
	'users.updateRoles' (targetUserId, roles, group){
		var loggedInUser = Meteor.user();
		
		if(!loggedInUser || !Roles.userIsInRole(loggedInUser, ['super-admin'])){
			throw new Meteor.Error(403, "Access denied");
		}
		
		Roles.setUserRoles(targetUserId, roles, group);
	},
	  /**
	   * hasPermission - server
	   * server permissions checks
	   * hasPermission exists on both the server and the client.
	   * @param {String | Array} checkPermissions -String or Array of permissions if empty, defaults to "admin, owner"
	   * @param {String} userId - userId, defaults to Meteor.userId()
	   * @param {String} checkGroup group - default to shopId
	   * @return {Boolean} Boolean - true if has permission
	   */
	  hasPermission(checkPermissions, userId = Meteor.userId(), checkGroup = null) {
		// check(checkPermissions, Match.OneOf(String, Array)); check(userId, String); check(checkGroup,
		// Match.Optional(String));

		let permissions;
		// default group to the shop or global if shop isn't defined for some reason.
		if (checkGroup !== undefined && typeof checkGroup === "string") {
		  group = checkGroup;
		} else {
		  group = Roles.GLOBAL_GROUP;
		}

		// permissions can be either a string or an array we'll force it into an array and use that
		if (checkPermissions === undefined) {
		  permissions = ["super-admin"];
		} else if (typeof checkPermissions === "string") {
		  permissions = [checkPermissions];
		} else {
		  permissions = checkPermissions;
		}

		// return if user has permissions in the group
		if (Roles.userIsInRole(userId, permissions, group)) {
		  return true;
		}
		
		// no specific permissions found returning false
		return false;
	  },
	  
	  hasDoctorAccess() {
		return this.hasPermission(["doctor", "super-admin"]);
	  },

	  getSuperAdminId() {
		return Roles.getGroupsForUser(this.userId, "super-admin");
	  },
});