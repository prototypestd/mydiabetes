import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { UserInfo } from '/lib/collections';

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

Meteor.methods({
  // Calculate the ICR (Insulin carbohydrate ratio) for patient
  // totalDose = total dose;
  'calculator.calcICR'() {
		
		const dose = UserInfo.find({
					$or: [
							{ userId: this.userId }
						],
					}).map(function(post) { return post.totalDose; });
	  
		const ICR = 450 / dose;
		//const r = Math.round(ICR * 100)/100;
		const r = round(ICR);
		
		UserInfo.update({ userId: this.userId },{$set:{icr: r}}, function(error, result){
			if(error){
				console.log(error.reason);
			}
		});
		return r;
  },
  // Calculate the ISF (Insulin sensitivity factor) for patient
  // totalDose = total dose;
  'calculator.calcISF'() {
	  
		const dose = UserInfo.find({
					$or: [
							{ userId: this.userId }
						],
					}).map(function(post) { return post.totalDose; });
	  
		const ISF = 100 / dose;
		//const r = Math.round(ISF * 100)/100;
		const r = round(ISF);
		
		UserInfo.update({ userId: this.userId },{$set:{isf: r}}, function(error, result){
			if(error){
				console.log(error.reason);
			}
		});
		return r;
  },
  // Calculate the correction for patient
  // reading = glucose reading; totalDose = total dose;
  'calculator.calcCorrection'( reading ) {
	  
		const dose = UserInfo.find({
					$or: [
							{ userId: this.userId }
						],
					}).map(function(post) { return post.totalDose; });
	  
		const ISF = 100 / dose;
		const correction = (reading - 6) / (Math.round(ISF * 100)/100);
		const r = round(correction);
	  
	  return r;
  },
  // Calculate the dose of patient
  // carb = intake carbohydrate; reading = glucose reading; totalDose = total dose;
  'calculation.calcDose' ( carb, reading ) {
	  
		const dose = UserInfo.find({
					$or: [
							{ userId: this.userId }
						],
					}).map(function(post) { return post.totalDose; });
	  
		const ICR = 450 / dose;
		const r1 = Math.round(ICR * 100)/100;
		let r2 = 0;
		let curDose = 0;
		let correction = 0;
	  
		if(reading > 6){
			const ISF = 100 / dose;
			correction = (reading - 1) / (Math.round(ISF * 100)/100);
			r2 = Math.round(correction * 100)/100;
		}
	  
		if (correction > 0){
			curDose = (carb / ICR) + correction;
		}else{
			curDose = (carb / ICR);
		}
		const r3 = round(curDose);
	  
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