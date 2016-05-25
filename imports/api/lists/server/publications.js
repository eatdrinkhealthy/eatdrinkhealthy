import { Meteor } from "meteor/meteor";
import { Lists } from "../lists.js";

Meteor.publish("lists", function publishLists() {
  return Lists.find({ author: this.userId });
});
