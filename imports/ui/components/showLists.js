import "./showLists.html";
import { Lists } from "../../api/lists/lists.js";

import { Template } from "meteor/templating";
import { AutoForm } from "meteor/aldeed:autoform";

Template.showLists.onCreated(function createShowLists() {
  this.autorun(() => {
    this.subscribe("lists");
  });
});

Template.showLists.helpers({
  list: () => Lists.find(),
  Lists() {
    return Lists;
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

