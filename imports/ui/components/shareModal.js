import "./shareModal.html";

import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router";

Template.shareModal.onRendered(() => {
  if (Meteor.isCordova) {
    $("[data-action=copy-to-clipboard]").hide();
    $(".share-modal").css({ height: "140px" });
  } else {
    new Clipboard("[data-action=copy-to-clipboard]");
  }
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
  listUrl: () => `${window.location.host}/list/${FlowRouter.current().params._id}`
});
