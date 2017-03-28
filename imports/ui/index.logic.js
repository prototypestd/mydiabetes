import { Template } from 'meteor/templating';
import { Invites, UserInfo } from '/lib/collections';

Template.index.events({
	'submit .request-beta' (event) {
		event.preventDefault();
		
		const target = event.target;
		const email = target.email.value;
		const reason = target.reason.value;
		
		Meteor.call('beta.addToInvites', email, reason, function(error, result) {
			if(error){
				alert(error.reason);
			}else{
				target.email.value = '';
				target.reason.value = '';
				alert('Invite requested. We\'ll be in touch soon');
			}
		});
	}
});
		