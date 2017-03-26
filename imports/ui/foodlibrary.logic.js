import { Template } from 'meteor/templating';
import { FoodLibrary } from '/lib/collections';
import SimpleSchema from 'simpl-schema';

Template.flibrary.onCreated(function(){
  this.category = new ReactiveVar('milk');
  this.subscribe("foodlibrary");
});


Template.flibrary.helpers({
  currentUser() {
	  return UserInfo.findOne();
  },
  curYear() {
	 var today = new Date();
	 return today.getFullYear();
  },
  tasks() {
	  return FoodLibrary.find({ category: Template.instance().category.get() });
  }
});

Template.flibrary.events({
	'submit .new-food' (event) {
		event.preventDefault();
		
		const target = event.target;
		const name = target.name.value;
		const category = target.category.value;
		const carb = target.carb.value;
		
		Meteor.call('flibrary.insert', name, category, carb);
		
		target.name.value = '';
		target.category.value = '';
		target.carb.value = '';
	},
	'click .delete'() {
		Meteor.call('flibrary.remove', this._id);
	},
	'click [data-state]' (event) {
		event.preventDefault();
		
		console.log("Library state: " + event.target.dataset.state);
		Template.instance().category.set(event.target.dataset.state);
	}
});