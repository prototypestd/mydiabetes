import SimpleSchema from 'simpl-schema';

export const FoodLibrary = new SimpleSchema({
  name: {type: String},
  category: {type: String},
  carb: {type: String},
  serving: {type: String},
  energy: {type: String},
  sugar: {type: String},
  picture: {type: String, optional: true}
});