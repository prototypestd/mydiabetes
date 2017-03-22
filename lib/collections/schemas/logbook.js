import SimpleSchema from 'simpl-schema';

export const Logbook = new SimpleSchema({
  userId: {type: String},
  date: {type: String},
  prebreakfast: {type: Number, optional: true},
  prelunch: {type: Number, optional: true},
  predinner: {type: Number, optional: true},
  prebed: {type: Number, optional: true},
  midnight: {type: Number, optional: true},
  bolus1: {type: Number, optional: true},
  bolus2: {type: Number, optional: true},
  bolus3: {type: Number, optional: true},
  basal: {type: Number, optional: true}
});