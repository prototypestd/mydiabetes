import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'calculator.calcICR'( totalDose ) {
		var ICR = 450 / totalDose;
		var r = Math.round(ICR * 100)/100;
		return r;
  },
  'calculator.calcISF'( totalDose ) {
	  var ISF = 100 / totalDose;
	  var r = Math.round(ISF * 100)/100;
		
	  return r;
  },
  'calculator.calcCorrection'( reading, totalDose ) {
	  var ISF = 100 / totalDose;
	  var correction = (reading - 6) / (Math.round(ISF * 100)/100);
	  var r = Math.round(correction * 100)/100;
	  
	  return r;
  },
});