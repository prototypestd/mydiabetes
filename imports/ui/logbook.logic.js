import { Template } from 'meteor/templating';
import { Logbook, LabResults, UserInfo } from '/lib/collections';
import SimpleSchema from 'simpl-schema';

Template.logbook.onCreated(function(){
  this.correction = new ReactiveVar(0);
  this.subscribe("logbook");
  this.subscribe("labresults");
  this.subscribe("userinfo");
});

Template.logbook.helpers({
  currentUser() {
	  return UserInfo.findOne();
  },
  curYear() {
	 var today = new Date();
	 return today.getFullYear();
  },
  tasks() {
      return Logbook.find({});
  },
  labresults() {
	  return LabResults.find({});
  },
  correction() {
	  return Template.instance().correction.get();
  },
  isf() {
	  return UserInfo.find().map(function(post) { return post.isf; });
  },
  icr() {
	  return UserInfo.find().map(function(post) { return post.icr; });
  },
});

window.Logbook = Logbook;
window.UserInfo = UserInfo;
window.LabResults = LabResults;

var grin = emojione.toImage(':grin:');
var cry = emojione.toImage(':cry:');

Template.logbook.events({
  'submit .new-record'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const prebreakfast = target.prebreakfast.value;
    const prelunch = target.prelunch.value;
    const predinner = target.predinner.value;
    const prebed = target.prebed.value;
    const midnight = target.midnight.value;
 
    // Insert a record into the collection
    Meteor.call('logbook.insert', prebreakfast, prelunch, predinner, prebed, midnight);
	
	Meteor.call('logbook.checkBreakfast',prebreakfast, function(error, result){
		if(result){
			swal({
				title: 'High Glucose Detected!',
				text: 'It seems that you\'re glucose reading is a bit high.\n Would you like a recommended correction dose? It is also recommended that you also check your ketone.',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes!',
				cancelButtonText: 'No',
			}).then(function() {
				Meteor.call('calculator.calcCorrection', prebreakfast, function(error, result) {
					if(error){
						swal('Oops...', 'Something went wrong!', 'error');
						console.log(error.reason);
					}else{
						swal(
							'Here you go',
							'Please give '+result+'u ' + grin,
							'success'
						);
					}
				});
			}, function(dismiss) {
				// dismiss can be 'cancel', 'overlay', 'close', 'timer'
				if (dismiss === 'cancel') {
					swal(
						'Aww',
						'You didn\'t want a correction. ' + cry,
						'error'
					);
				}
			});
		}
	});
	
	Meteor.call('logbook.checkBreakfast',prelunch, function(error, result){
		if(result){
			swal({
				title: 'High Glucose Detected!',
				text: 'It seems that you\'re glucose reading is a bit high.\n Would you like a recommended correction dose?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes!',
				cancelButtonText: 'No',
			}).then(function() {
				Meteor.call('calculator.calcCorrection', prelunch, function(error, result) {
					if(error){
						swal('Oops...', 'Something went wrong!', 'error');
						console.log(error.reason);
					}else{
						swal(
							'Here you go',
							'Please give '+result+'u  '+ grin,
							'success'
						);
					}
				});
			}, function(dismiss) {
				// dismiss can be 'cancel', 'overlay', 'close', 'timer'
				if (dismiss === 'cancel') {
					swal(
						'Aww',
						'You didn\'t want a correction. ' + cry,
						'error'
					);
				}
			});
		}
	});
	
	Meteor.call('logbook.checkBreakfast',predinner, function(error, result){
		if(result){
			swal({
				title: 'High Glucose Detected!',
				text: 'It seems that you\'re glucose reading is a bit high.\n Would you like a recommended correction dose?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes!',
				cancelButtonText: 'No',
			}).then(function() {
				Meteor.call('calculator.calcCorrection', predinner, function(error, result) {
					if(error){
						swal('Oops...', 'Something went wrong!', 'error');
						console.log(error.reason);
					}else{
						swal(
							'Here you go',
							'Please give '+result+'u ' + grin,
							'success'
						);
					}
				});
			}, function(dismiss) {
				// dismiss can be 'cancel', 'overlay', 'close', 'timer'
				if (dismiss === 'cancel') {
					swal(
						'Aww',
						'You didn\'t want a correction. ' + cry,
						'error'
					);
				}
			});
		}
	});
	
	Meteor.call('logbook.checkBreakfast',prebed, function(error, result){
		if(result){
			swal({
				title: 'High Glucose Detected!',
				text: 'It seems that you\'re glucose reading is a bit high.\n Would you like a recommended correction dose?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes!',
				cancelButtonText: 'No',
			}).then(function() {
				Meteor.call('calculator.calcCorrection', prebed, function(error, result) {
					if(error){
						swal('Oops...', 'Something went wrong!', 'error');
						console.log(error.reason);
					}else{
						swal(
							'Here you go',
							'Please give '+result+'u ' + grin,
							'success'
						);
					}
				});
			}, function(dismiss) {
				// dismiss can be 'cancel', 'overlay', 'close', 'timer'
				if (dismiss === 'cancel') {
					swal(
						'Aww',
						'You didn\'t want a correction. ' + cry,
						'error'
					);
				}
			});
		}
	});
	
    // Clear form
    target.prebreakfast.value = '';
    target.prelunch.value = '';
    target.predinner.value = '';
    target.prebed.value = '';
    target.midnight.value = '';
  },
  'click .delete'() {
    Meteor.call('logbook.remove', this._id, function(error, result) {
		if(error){
			swal('Oops...', 'Something went wrong!', 'error');
			console.log(error.reason);
		}else{
			swal(
				'Success!',
				'Diary entry deleted. ' + grin,
				'success'
			);
		}
	});
  },
  'click .deleteLab'() {
	  Meteor.call('labresult.remove', this._id, function(error, result) {
		if(error){
			swal('Oops...', 'Something went wrong!', 'error');
			console.log(error.reason);
		}else{
			swal(
				'Success!',
				'Lab result deleted. ' + grin,
				'success'
			);
		}
	});
  },
  'click .refreshRatio'() {
	  Meteor.call('calculator.calcICR', function(error, result) { if(error) { Bert.alert(error.reason, 'danger', 'growl-top-right'); } });
	  Meteor.call('calculator.calcISF', function(error, result) { if(error) { Bert.alert(error.reason, 'danger', 'growl-top-right'); } });
  },
  'click .exportPDF'() {
    var doc = new jsPDF('landscape');
	
	var today = new Date();
	var day = today.getDate();
	var month = today.getMonth()+1;
	var curDate = day + '/' + month;
	
    doc.text("Blood Glucose Records until " + curDate, 14, 16);
    var elem = document.getElementById("logbook");
    var res = doc.autoTableHtmlToJson(elem);
    doc.autoTable(res.columns, res.data, {startY: 20});
    doc.save('bg-' + curDate + '.pdf');
  },
  'submit .calcCorrection'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
	const reading = target.reading.value;
 
	if(reading > 6){
		// Insert a record into the collection
		Meteor.call('calculator.calcCorrection', reading, function(error, result) {
			if(error){
				swal('Oops...', 'Something went wrong!', 'error');
				console.log(error.reason);
			}else{
				swal(
					'Here You Go!',
					'Please give '+result+'u ' + grin,
					'success'
				);
			}
		});
	}else{
		swal(
			'Oh Wait!',
			'You don\'t need to give any correction.\n Your reading is already good. ' + grin,
			'info'
		);
	}
 
    // Clear form
	target.reading.value = '';
  },
});
