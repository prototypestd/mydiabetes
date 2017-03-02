import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'calculator.calcICR'( totalDose ) {
		var ICR = 450 / totalDose;
		
		return ICR;
  },
  'calculator.calcISF'( totalDose ) {
	  var ISF = 100 / totalDose;
	  var r = Math.round(ISF * 100)/100;
	  console.log( "The ISF is: "+ISF);
	  return r;
  },
});