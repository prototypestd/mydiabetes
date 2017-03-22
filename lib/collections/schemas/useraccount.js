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