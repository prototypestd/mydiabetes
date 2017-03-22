import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { UserInfo } from '/lib/collections';

if (Meteor.isServer) {
	
	UserInfo.permit(['insert', 'update', 'remove']).ifLoggedIn();
	
  // This code only runs on the server
  Meteor.publish('userinfo', function userInfo() {
    return UserInfo.find({
      $or: [
        { userId: this.userId }
      ],
    });
  });
}

Meteor.methods({
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
	}
});