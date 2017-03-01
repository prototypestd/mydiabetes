import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'calculator.calcICR'({ totalDose }) {
		var ICR = 450 / totalDose;
		
		return ICR;
  }
});