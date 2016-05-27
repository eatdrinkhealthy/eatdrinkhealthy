import "./sidebar.html";

// import { Meteor } from "meteor/meteor";
// import { ReactiveVar } from "meteor/reactive-var";
// import { ReactiveDict } from "meteor/reactive-dict";
import { Template } from "meteor/templating";
// import { FlowRouter } from "meteor/kadira:flow-router";

Template.sidebar.events({
  "click .toggle-sidebar": function () {
    if ($(".sidebar").hasClass("hidden")) {
      $(".sidebar").removeClass("hidden");
      $(".toggle-sidebar").removeClass("closed");
    } else {
      $(".sidebar").addClass("hidden");
      $(".toggle-sidebar").addClass("closed");
    }
  }
});
