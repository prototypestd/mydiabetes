import { Template } from 'meteor/templating';

Template.calculator.onCreated(function(){
  // Here, this equals the current template instance. We can assign
  // our ReactiveVar to it, making it accessible throughout the
  // current template instance.
  this.sensitivityFactor = new ReactiveVar(0);
});

Template.calculator.helpers({
	ISF() {
		console.log(Template.instance().sensitivityFactor.get());
		return Template.instance().sensitivityFactor.get();
	},
});

Template.calculator.events({
  'submit .calcISF'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const totalDose = target.totalDose.value;
 
    // Insert a record into the collection
    Meteor.call('calculator.calcISF', totalDose, function(error, result) {
		  if (error)
			console.log(error);
		
		template.sensitivityFactor.set(result);
	});
 
    // Clear form
    target.totalDose.value = '';
  },
  'submit .calcICR'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const totalDose = target.totalDose.value;
 
    // Insert a record into the collection
    Meteor.call('calculator.calcICR', totalDose, function(error, result) {
		myISF = result;
	});
 
    // Clear form
    target.totalDose.value = '';
  },
});