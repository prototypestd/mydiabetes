import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { UserInfo, Invites, UserChats } from '/lib/collections';
import { AccountsLockout } from 'meteor/lucasantoniassi:accounts-lockout';

/*
 * Limits the login attempt to 3 tries.
 * Locks the account for 60 seconds if more
 * than 3 wrong attempts were made.
 *
 * TODO: Trial & Error for lockoutPeriod
 */
(new AccountsLockout({
  	knownUsers: {
   		failuresBeforeLockout: 3,
   		lockoutPeriod: 60,
    		failureWindow: 15,
  	},
  	unknownUsers: {
    		failuresBeforeLockout: 3,
    		lockoutPeriod: 60,
    		failureWindow: 15,
  	},
})).startup();

/*
 * Hook on to onCreateUser to allow
 * insertion of totalDose into database
 */
Accounts.onCreateUser((options,user) => {
	UserInfo.insert({
		userId: user._id,
		totalDose: 0,
		icr: 0,
		isf: 0
	}, (error) => {
		if(error){
			console.log(error.message);
			return;
		}
	});

	return user;
});

if (Meteor.isServer) {

	UserInfo.permit(['insert', 'update', 'remove']).ifLoggedIn().allowInClientCode();

	Invites.permit(['insert', 'update', 'remove']);

	Meteor.publish('userlist', function userList() {
		return Meteor.users.find({});
	});

	Meteor.publish('userinfo', function userInfo() {
		return UserInfo.find({
			$or: [
				{ userId: this.userId }
			],
		});
	});

  Meteor.publish('userinfoadmin', function userInfo() {
		return UserInfo.find({});
	});

  Meteor.publish('invites', function userInfo() {
		return Invites.find({});
	});

  Meteor.publish('userchats', function userInfo() {
    return UserChats.find({
      $or: [
        { userId: this.userId }
      ],
    });
  });

	Impersonate.adminGroups = [
		{ role: "super-admin", group: "staff" }
	];
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
	'beta.checkInvite' (token){
		check(token, String);
		console.log(token);

		if(Invites.find({token: token}).count() > 0){
			var invite = Invites.findOne({token: token})._id;

			console.log(invite);
			Invites.remove(invite, (err) => {
				if(err){
					console.log(err.message);
				}
			});
			return true;
		}

		return false;
	},
	'users.addUserInfo' (userId){
		UserInfo.insert({
			userId: userId,
			totalDose: 0,
			icr: 0,
			isf: 0
		}, (error) => {
			if(error){
				console.log(error.message);
				return false;
			}else{
				return true;
			}
		});
	},
	'users.deleteUser' (userId){
		check(userId, String);

		Meteor.users.remove(userId);
	},
	'user.setRoleOnUser' ( options ) {
		check( options, {
			user: String,
			role: String
		});

		try {
			Roles.setUserRoles( options.user, [ options.role ] );
		} catch( exception ) {
			return exception;
		}
	},
	'user.updateInsulin' (t, id){
		UserInfo.update({ userId: id },{$set:{totalDose: t}}, function(error, result){
			if(error){
				console.log(error.reason);
			}
		});
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
