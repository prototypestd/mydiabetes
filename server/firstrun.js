import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
	
	/*
	 * Creates a first user.
	 * Useful for new instances of mydiabetes
	 * Username: admin
	 * Password: admin
	 */
	if( Meteor.users.find().count() === 0 ){
		let id = Accounts.createUser({
			username: 'admin',
			email: 'admin@mydiabetes',
			password: 'admin',
		});
		
		Roles.setUserRoles(id, 'super-admin', 'staff');
	}
});