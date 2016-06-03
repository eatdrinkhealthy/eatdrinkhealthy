import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Lists } from "./lists.js";

export const addVenueToList = new ValidatedMethod({
  name: "Lists.methods.addVenueToList",

  validate: new SimpleSchema({
    listId: { type: String },
    venueId: { type: String }
  }).validator(),

  run({ listId, venueId }) {
    const list = Lists.findOne(listId);
    if (list && !this.userId === list.userId) {
      throw new Meteor.Error("Lists.methods.updateTitle.notLoggedIn",
        "User must own the list to update it.");
    }

    Lists.update(listId, {
      $addToSet: { venues: venueId }
    });
  }
});

export const removeVenueFromList = new ValidatedMethod({
  name: "Lists.methods.removeVenueFromList",

  validate: new SimpleSchema({
    listId: { type: String },
    venueId: { type: String }
  }).validator(),

  run({ listId, venueId }) {
    const list = Lists.findOne(listId);
    if (list && !this.userId === list.userId) {
      throw new Meteor.Error("Lists.methods.updateTitle.notLoggedIn",
        "User must own the list to update it.");
    }

    Lists.update(listId, {
      $pull: { venues: venueId }
    });
  }
});

export const removeList = new ValidatedMethod({
  name: "Lists.methods.removeList",

  validate: new SimpleSchema({
    listId: { type: String }
  }).validator(),

  run({ listId }) {
    const list = Lists.findOne(listId);
    if (list && !this.userId === list.userId) {
      throw new Meteor.Error("Lists.methods.updateTitle.notLoggedIn",
        "User must own the list to update it.");
    }

    Lists.remove(listId);
  }
});
