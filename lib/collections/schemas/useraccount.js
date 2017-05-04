import SimpleSchema from 'simpl-schema';

/**
 * Schemas UserInfo
 */

export const UserInfo = new SimpleSchema({
  userId: {type: String},
  totalDose: {type: Number},
  icr: {type: Number},
  isf: {type: Number}
});

export const UserChats = new SimpleSchema({
  userId: {type: String},
  receiverId: {type: String},
  message: {type: String},
  timestamp: {type: String}
})

export const Invites = new SimpleSchema({
  "email": {
    type: String,
    label: "Email address of the person requesting the invite."
  },
  "invited": {
    type: Boolean,
    label: "Has this person been invited yet?"
  },
  "requested": {
    type: String,
    label: "The date this invite was requested."
  },
  "token": {
    type: String,
    label: "The token for this invitation.",
    optional: true
  },
  "accountCreated": {
    type: Boolean,
    label: "Has this invitation been accepted by a user?",
    optional: true
  },
  "dateInvited": {
    type: String,
    label: "The date this user was invited",
    optional: true
  },
  "inviteNumber": {
    type: Number,
    label: "This invitation's position in the queue."
  },
  "reason": {
	type: String,
	label: "This is the reason why should be invited"
  }
});
