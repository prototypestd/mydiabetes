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
  // Calculate the ICR (Insulin carbohydrate ratio) for patient
  // totalDose = total dose;
  /* Todo: totalDose should be taken directly from database */
  'calculator.calcICR'( totalDose ) {
		var ICR = 450 / totalDose;
		var r = Math.round(ICR * 100)/100;
		return r;
  },
  // Calculate the ISF (Insulin sensitivity factor) for patient
  // totalDose = total dose;
  /* Todo: totalDose should be taken directly from database */
  'calculator.calcISF'( totalDose ) {
	  var ISF = 100 / totalDose;
	  var r = Math.round(ISF * 100)/100;
		
	  return r;
  },
  // Calculate the correction for patient
  // reading = glucose reading; totalDose = total dose;
  /* Todo: totalDose should be taken directly from database */
  'calculator.calcCorrection'( reading, totalDose ) {
	  var ISF = 100 / totalDose;
	  var correction = (reading - 6) / (Math.round(ISF * 100)/100);
	  var r = Math.round(correction * 100)/100;
	  
	  return r;
  },
  // Calculate the dose of patient
  // carb = intake carbohydrate; reading = glucose reading; totalDose = total dose;
  /* Todo: totalDose should be taken directly from database */
  'calculation.calcDose' ( carb, reading, totalDose ) {
	  var ICR = 450 / totalDose;
	  var r1 = Math.round(ICR * 100)/100;
	  var r2 = 0;
	  var dose = 0;
	  var correction = 0;
	  
	  if(reading > 6){
		var ISF = 100 / totalDose;
		correction = (reading - 1) / (Math.round(ISF * 100)/100);
		r2 = Math.round(correction * 100)/100;
	  }
	  
	  if (correction > 0){
		dose = (carb / ICR) + correction;
	  }else{
		dose = (carb / ICR);
	  }
	  var r3 = Math.round(dose * 100)/100;
	  
	  return r3;
  },
  // Calculate the BMI of patient (This is in metric)
  // kg = weight; htc = height;
  'calculation.calcBMI' (kg, htc){
	  m = htc/100;
	  h2 = m * m;
	  
	  bmi = kg/h2;
	  
	  f_bmi = Math.floor(bmi);
	  
	  diff = bmi - f_bmi;
	  diff = diff * 10;
	  
	  diff = Math.round(diff);
	  if( diff == 10 ){
		  // Need to bump up the whole thing instead
		  f_bmi += 1;
		  diff = 0;
	  }
	  bmi = f_bmi + "." + diff;
	  
	  return bmi;
  }
});