import { Template } from 'meteor/templating';
import { FoodLibrary, Media } from '/lib/collections';
import SimpleSchema from 'simpl-schema';

Template.flibrary.onCreated(function(){
  this.category = new ReactiveVar('milk');
  this.imageu = new ReactiveVar('');
  this.subscribe("foodlibrary");
  this.subscribe("media");
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

Template.foodview.helpers({
  getImage(id) {
	  return Media.find({ _id: id });
  }
});

Template.flibrary.events({
	'submit .new-food' (event) {
		event.preventDefault();
		
		const target = event.target;
		const name = target.name.value;
		const category = target.category.value;
		const carb = target.carb.value;
		const imageId = Template.instance().imageu.get();
		
		Meteor.call('flibrary.insert', name, category, carb, imageId);
		
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
	},
	'change .imageupload': function(event, template) {
		var file = event.target.files[0];
		const imageId = Media.insert(file, function (err, fileObj) {
			// Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
		});
		Template.instance().imageu.set(imageId);
	}
});