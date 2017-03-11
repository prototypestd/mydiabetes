import { Template } from 'meteor/templating';

Template.calculator.onCreated(function(){
  // Here, this equals the current template instance. We can assign
  // our ReactiveVar to it, making it accessible throughout the
  // current template instance.
  this.sensitivityFactor = new ReactiveVar(0);
  this.carbRatio = new ReactiveVar(0);
  this.correction = new ReactiveVar(0);
});

Template.calculator.helpers({
	ISF() {
		return Template.instance().sensitivityFactor.get();
	},
	ICR() {
		return Template.instance().carbRatio.get();
	},
	correction() {
		return Template.instance().correction.get();
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
  'submit .calcICR'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const totalDose = target.totalDose.value;
 
    // Insert a record into the collection
    Meteor.call('calculator.calcICR', totalDose, function(error, result) {
		  if (error)
			console.log(error);
		
		template.carbRatio.set(result);
	});
 
    // Clear form
    target.totalDose.value = '';
  },
  'submit .calcCorrection'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
	const reading = target.reading.value;
    const totalDose = target.totalDose.value;
 
	if(reading > 6){
		// Insert a record into the collection
		Meteor.call('calculator.calcCorrection', reading, totalDose, function(error, result) {
			  if (error)
				console.log(error);
			
			template.correction.set(result);
		});
	}else{
		alert("You don't need to correct anything. \nYour glucose reading is good!");
	}
 
    // Clear form
	target.reading.value = '';
    target.totalDose.value = '';
  },
});