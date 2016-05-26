import "./showLists.html";
import { Lists } from "../../api/lists/lists.js";

import { Template } from "meteor/templating";
import { AutoForm } from "meteor/aldeed:autoform";

Template.showLists.onCreated(function createShowLists() {
  this.autorun(() => {
    this.subscribe("lists");
  });
  $(".list__new-list").hide();
});

Template.showLists.onRendered(() => {
  $(".list__new-list").hide();
});

Template.showLists.events({
  "click [data-action=create-list]": () => {
    $(".list__new-list").fadeIn(200);
    $(".list__create").hide();
  },
  "click [data-action=save-list]": () => {
    $(".list__new-list").hide();
    $(".list__create").fadeIn(200);
  }
});

Template.showLists.helpers({
  list: () => Lists.find(),
  Lists() {
    return Lists;
  },
  venueCount() {
    return this.venues.length;
  }
});

AutoForm.hooks({
  insertList: {
    before: {
      insert(doc) {
        const newList = doc;
        const user = Meteor.user();
        newList.author = user._id;  // eslint-disable-line no-underscore-dangle
        newList.dateCreated = new Date();
        newList.venues = [];
        return doc;
      }
    }
  }
});

