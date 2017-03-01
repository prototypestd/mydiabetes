import { Meteor } from 'meteor/meteor';

export const Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });