import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const UserInfo = new Mongo.Collection("userinfo");

if (Meteor.isServer) {
	
	UserInfo.allow({
		insert: function () { return true; },
		update: function () { return true; },
		remove: function () { return true; }
	});
	
  // This code only runs on the server
  Meteor.publish('userinfo', function userInfo() {
    return UserInfo.find({
      $or: [
        { userId: this.userId }
      ],
    });
  });
}

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
  'calculation.calcDose' ( carb, reading, totalDose ) {
	  var ICR = 450 / totalDose;
	  var r1 = Math.round(ICR * 100)/100;
	  
	  var correction = 0;
	  if(reading > 6){
		var ISF = 100 / totalDose;
		correction = (reading - 1) / (Math.round(ISF * 100)/100);
		var r2 = Math.round(correction * 100)/100;
	  }
	  
	  if (correction > 0){
		var dose = (carb / ICR) + correction;
	  }else{
		var dose = (carb / ICR);
	  }
	  var r3 = Math.round(dose * 100)/100;
	  
	  return r3;
  },
});