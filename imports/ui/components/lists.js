import "./lists.html";
import { Lists } from "../../api/lists/lists.js";

import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { AutoForm } from "meteor/aldeed:autoform";

/* global FlowRouter */

Template.lists.onCreated(function createLists() {
  this.autorun(() => {
    this.subscribe("lists");
  });
  $(".lists__new-list").hide();
});

Template.lists.onRendered(() => {
  $(".lists__new-list").hide();
});

Template.lists.events({
  "click [data-action=create-list]": () => {
    $(".lists__new-list").fadeIn(200);
    $(".lists__create").hide();
  },
  "click [data-action=save-list]": () => {
    $(".lists__new-list").hide();
    $(".lists__create").fadeIn(200);
  },
  "click .lists-item__title": function goToList() {
    const newPath = FlowRouter.path("list", { _id: this._id });
    FlowRouter.go(newPath);
  },
});

Template.lists.helpers({
  list: () => Lists.find(),
  Lists() {
    return Lists;
  },
  venueCount() {
    return this.venues.length;
  },
});

AutoForm.hooks({
  insertList: {
    before: {
      insert(doc) {
        const newList = doc;
        const user = Meteor.user();
        newList.author = user.profile.name;
        newList.userId = user._id;
        newList.dateCreated = new Date();
        newList.venues = [];
        return doc;
      },
    },
  },
});

