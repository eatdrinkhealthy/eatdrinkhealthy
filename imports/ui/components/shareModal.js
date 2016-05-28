import "./shareModal.html";

import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router";

Template.shareModal.onCreated(() => {
  new Clipboard("[data-action=copy-to-clipboard]");
});

Template.shareModal.events({
  "click [data-action=copy-to-clipboard]": () => {
    Meteor.setTimeout(() => {
      $(".list").removeClass("list--blur");
      $(".share-modal").fadeOut(200);
    }, 200);
  }
});

Template.shareModal.helpers({
  listUrl: () => "edh.co/list/" + FlowRouter.current().params._id
});
