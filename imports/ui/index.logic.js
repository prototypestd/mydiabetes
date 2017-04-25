import { Template } from 'meteor/templating';
import { Invites, UserInfo } from '/lib/collections';

Template.index.onRendered(function() {
  let settings = 'particles.json';
  this.autorun(() => {
    if (particlesJS) {
      console.log(`loading particles.js config from "${settings}"...`)
      /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
      particlesJS.load('particles', settings, function () {
        console.log('callback - particles.js config loaded');
      });
    }
  });
});

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
		