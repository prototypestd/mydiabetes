import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Logger, Exception } from '/lib/api';
import { Logbook, LabResults } from '/lib/collections';

if (Meteor.isServer) {
	
	Logbook.permit(['insert', 'update', 'remove']).ifLoggedIn().allowInClientCode();
	
	LabResults.permit(['insert', 'update', 'remove']).ifHasRole({ 
		role: ['doctor', 'super-admin'], 
		group: 'staff'
	});
	
  // This code only runs on the server
	Meteor.publish('logbook', function tasksPublication() {
		return Logbook.find({
			$or: [
				{ userId: this.userId }
			],
		});
	});
	
	Meteor.publish('labresults', function labPublication() {
		return LabResults.find({
			$or: [
				{ userId: this.userId }
			],
		});
	});
	
	Meteor.publish('labresultsadmin', function labPublication() {
		return LabResults.find({});
	});
}

Meteor.methods({
  'logbook.insert'(prebreakfast, prelunch, predinner, prebed, midnight) {
    check(prebreakfast, String);
    check(prelunch, String);
    check(predinner, String);
    check(prebed, String);
    check(midnight, String);
	
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth()+1;
	var curDate = day + '/' + month;
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
	try {
		Logbook.insert({
		  userId: this.userId,
		  date: curDate, // current time
		  prebreakfast,
		  prelunch,
		  predinner,
		  prebed,
		  midnight,
		},(error, result) => {
			if(error){
				throw new Error();
			}
		});
	} catch (e) {
		Logger.error("Exception: "+e);
	}
  },
  'logbook.remove'(recordId) {
    check(recordId, String);
 
    Logbook.remove(recordId);
  },
  'logbook.checkBreakfast'(prebreakfast){
	  if(prebreakfast > 6){
		  return true;
	  }
  },
  'logbook.checkLunch'(prebreakfast){
	  if(prebreakfast > 6){
		  return true;
	  }
  },
  'logbook.checkDinner'(prebreakfast){
	  if(prebreakfast > 6){
		  return true;
	  }
  },
  'logbook.checkBed'(prebreakfast){
	  if(prebreakfast > 6){
		  return true;
	  }
  },
  'labresult.insert' (hba1c, fastsugar, bmi, malbumin, lipid, creatinine, userId){
	
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth()+1;
	var curDate = day + '/' + month;
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
	try {
		LabResults.insert({
			userId,
			date: curDate, // current time
			hba1c,
			fastsugar,
			bmi,
			malbumin,
			lipid,
			creatinine
		},(error, result) => {
			if(error){
				throw new Error();
			}
		});
	} catch (e) {
		console.log('Error: labresult.insert: '+e.reason);
	}
  },
  'labresult.remove'(recordId) {
    check(recordId, String);
 
    LabResults.remove(recordId);
  },
});