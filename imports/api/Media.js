import { Media } from "/lib/collections";

if (Meteor.isServer) {
	
  Security.permit(["insert", "update", "remove"]).collections([Media]).allowInClientCode();
	
  // This code only runs on the server
	Meteor.publish('media', function mediaPublication() {
		return Media.find({});
	});

}