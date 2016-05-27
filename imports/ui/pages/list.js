import "./list.html";
import { Lists } from "../../api/lists/lists.js";

import { Meteor } from "meteor/meteor";
// import { ReactiveVar } from "meteor/reactive-var";
// import { ReactiveDict } from "meteor/reactive-dict";
import { Template } from "meteor/templating";
// import { FlowRouter } from "meteor/kadira:flow-router";

Template.list.onCreated(function createList() {
  const listId = FlowRouter.current().params._id;
  this.autorun(() => {
    this.subscribe("list", listId);
  });
});

Template.list.helpers({
  listId: () => FlowRouter.current().params._id,
  list: () => Lists.findOne(),
  owner: () => {
    const list = Lists.findOne();
    if (list) {
      return list.author === Meteor.user()._id;
    }
  },
  venueCount: () => {
    const list = Lists.findOne();
    if (list) {
      return list.venues.length;
    }
  }
});
