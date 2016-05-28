import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Lists } from "./lists.js";

export const updateListTitle = new ValidatedMethod({
  name: "Lists.methods.updateListTitle",

  validate: new SimpleSchema({
    listId: { type: String },
    newTitle: { type: String }
  }).validator(),

  run({ listId, newTitle }) {
    const list = Lists.findOne(listId);
    if (list && !this.userId === list.author) {
      throw new Meteor.Error("Lists.methods.updateTitle.notLoggedIn",
        "User must own the list to update it.");
    }

    Lists.update(listId, {
      $set: { title: newTitle }
    });
  }
});

export const updateListDescription = new ValidatedMethod({
  name: "Lists.methods.updateListDescription",

  validate: new SimpleSchema({
    listId: { type: String },
    newDescription: { type: String }
  }).validator(),

  run({ listId, newDescription }) {
    const list = Lists.findOne(listId);
    if (list && !this.userId === list.author) {
      throw new Meteor.Error("Lists.methods.updateTitle.notLoggedIn",
        "User must own the list to update it.");
    }

    Lists.update(listId, {
      $set: { description: newDescription }
    });
  }
});

export const addVenueToList = new ValidatedMethod({
  name: "Lists.methods.addVenueToList",

  validate: new SimpleSchema({
    listId: { type: String },
    venueId: { type: String }
  }).validator(),

  run({ listId, venueId }) {
    const list = Lists.findOne(listId);
    if (list && !this.userId === list.author) {
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
    if (list && !this.userId === list.author) {
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
    if (list && !this.userId === list.author) {
      throw new Meteor.Error("Lists.methods.updateTitle.notLoggedIn",
        "User must own the list to update it.");
    }

    Lists.remove(listId);
  }
});
