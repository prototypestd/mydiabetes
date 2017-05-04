import { Template } from 'meteor/templating';
import { UserChats } from '/lib/collections';
import SimpleSchema from 'simpl-schema';

window.UserChats = UserChats;

Template.userchats.onCreated(function(){
  this.subscribe("userchats");
});

Template.userchats.helpers({
  chats() {
    return UserChats.find({});
  }
})
