// Handles the setup of the routes within the app.

// Sets the root the the 'body' tag
BlazeLayout.setRoot('body');

// Sets the index to automatically render either dashboard or the main page depending on logged in status
FlowRouter.route('/', {
  name: 'App_Content',
  action() {
	  if(Meteor.user() === undefined){
		BlazeLayout.render('content', {main: 'dashboard'});
	  }else{
		BlazeLayout.render('content', {main: 'index'});
	  }
  }
});

FlowRouter.route('/signup/:token', {
	name: 'signup',
	action( params ){
	}
});

// Sets up the 404 page
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('content', {main: 'App_notFound'});
  }
};