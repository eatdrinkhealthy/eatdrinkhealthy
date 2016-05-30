import "./list.html";
import { Lists } from "../../api/lists/lists.js";

import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router";

// methods
import {
  updateListTitle,
  updateListDescription,
  removeVenueFromList,
  removeList
} from "../../api/lists/methods.js";

// components
import "../components/shareModal.js";

// helper function
function isOwner() {
  const list = Lists.findOne();
  const user = Meteor.user();
  return list && user && user._id === list.author
}

Template.list.onCreated(function createList() {
  this.listId = FlowRouter.current().params._id;
  this.autorun(() => {
    this.subscribe("list", this.listId);
  });
});

Template.list.helpers({
  listId: () => FlowRouter.current().params._id,
  list: () => Lists.findOne(),
  owner: () => {
    const list = Lists.findOne();
    return list ? list.author === Meteor.user()._id : false;
  },
  venueCount: () => {
    const list = Lists.findOne();
    return list ? list.venues.length : "";
  }
});

Template.list.events({
  "click [data-action=edit-list-title]": () => {
    if (isOwner()) {
      $("[data-action=edit-list-title]").hide();
      $("[data-action=save-list-title]").show().focus();
    }
  },
  "click [data-action=edit-list-description]": () => {
    if (isOwner()) {
      $("[data-action=edit-list-description]").hide();
      $("[data-action=save-list-description]").show().focus();
    }
  },
  "blur [data-action=save-list-title]": (event, instance) => {
    const newTitle = $("[data-action=save-list-title]")[0].value;
    updateListTitle.call({
      listId: instance.listId,
      newTitle
    }, () => {
      $("[data-action=save-list-title]").hide();
      $("[data-action=edit-list-title]").show();
    });
  },
  "blur [data-action=save-list-description]": (event, instance) => {
    const newDescription = $("[data-action=save-list-description]")[0].value;
    updateListDescription.call({
      listId: instance.listId,
      newDescription
    }, () => {
      $("[data-action=save-list-description]").hide();
      $("[data-action=edit-list-description]").show();
    });
  },
  "click [data-action=share-list]": () => {
    $(".list").addClass("list--blur");
    $(".share-modal").fadeIn(200);
  },
  "click .list": (event) => {
    const isNotShareModal = !$(event.target).is(".share-modal");
    const isNotShareButton = !$(event.target).is("[data-action=share-list]");
    if (isNotShareModal && isNotShareButton) {
      $(".list").removeClass("list--blur");
      $(".share-modal").fadeOut(200);
    }
  },
  "click [data-action=edit-list]": () => {
    // Toggle Enter venue and delte venue buttons
    if ($(".list-item__arrow").hasClass("list-item__arrow--delete")) {
      $(".list-item__arrow").text("»");
    } else {
      $(".list-item__arrow").text("–");
    }
    $(".list-item__arrow").toggleClass("list-item__arrow--delete");

    // Toggle Share and Delete Button
    $("[data-action=share-list]").toggle();
    $("[data-action=delete-list]").toggleClass("list__delete--hide");
    $("[data-action=delete-list]").toggleClass("list__delete--show");

    // Toggle Settings Button
    $("[data-action=edit-list]").toggleClass("list__edit--red");
  },
  "click [data-action=delete-list]": (event, instance) => {
    if (isOwner() && confirm("Are you sure you want to delete this list?")) { // eslint-disable-line
      removeList.call({ listId: instance.listId });
      FlowRouter.go("/");
    }
  },
  "click .list-item__arrow--delete": function hello(event, instance) {
    if (isOwner()) {
      removeVenueFromList.call({ listId: instance.listId, venueId: this.toString() });
    }
  },
  "click [data-action=close-list]": () => {
    FlowRouter.go("/");
  },
  "keydown [data-action=save-list-title]": (event) => {
    if (event.keyCode === 13) {
      $("[data-action=save-list-title]").trigger("blur");
    }
  },
  "keydown [data-action=save-list-description]": (event) => {
    if (event.keyCode === 13) {
      $("[data-action=save-list-description]").trigger("blur");
    }
  }
});
