import "./profile.html";

// import { Meteor } from "meteor/meteor";
// import { ReactiveVar } from "meteor/reactive-var";
// import { ReactiveDict } from "meteor/reactive-dict";
import { Template } from "meteor/templating";
// import { FlowRouter } from "meteor/kadira:flow-router";

Template.profile.helpers({

});

Template.profile.events({
  "click [data-action=logout-user]": () => {
    Meteor.logout();
  }
});
