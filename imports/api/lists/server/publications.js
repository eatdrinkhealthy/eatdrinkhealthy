import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Lists } from "../lists.js";

Meteor.publish("lists", function publishLists() {
  return Lists.find({ author: this.userId });
});

Meteor.publish("list", (listId) => {
  check(listId, String);
  return Lists.find({ _id: listId });
});
