import "./list.html";
import { Lists } from "../../api/lists/lists.js";

import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router";
import { validationSuccess, validationFail } from "../components/validation.js";

// components
import "../components/shareModal.js";

// methods
import {
  updateListTitle,
  updateListDescription,
  removeVenueFromList,
  removeList
} from "../../api/lists/methods.js";

// helper function
function isOwner() {
  const list = Lists.findOne();
  const user = Meteor.user();
  return list && user && user._id === list.userId;
}

Template.list.onCreated(function createList() {
  this.listId = FlowRouter.current().params._id;
  this.autorun(() => {
    this.subscribe("list", this.listId);
    const list = Lists.findOne();
    if (list) {
      this.subscribe("listVenues", list.venues);
    }
  });
});

Template.list.helpers({
  listId: () => FlowRouter.current().params._id,
  list: () => Lists.findOne(),
  owner: () => {
    const list = Lists.findOne();
    return list ? list.userId === Meteor.user()._id : false;
  },
  listCreator: () => {
    const list = Lists.findOne();
    return list ? list.author : "";
  },
  venueCount: () => {
    const list = Lists.findOne();
    return list ? list.venues.length : "";
  },
  name: function name() {
    const venue = Places.findOne({ _id: this.toString() });
    return venue ? venue.name : "";
  },
  category: function category() {
    const venue = Places.findOne({ _id: this.toString() });
    return venue ? venue.category : "";
  },
  rating: function rating() {
    const venue = Places.findOne({ _id: this.toString() });
    const score = venue ? venue.rating : 0;
    switch (Math.round(score)) {
      case 1: case 2:
        return "<span>&#10022; &#10023; &#10023; &#10023; &#10023;</span>";
      case 3: case 4:
        return "<span>&#10022; &#10022; &#10023; &#10023; &#10023;</span>";
      case 5: case 6:
        return "<span>&#10022; &#10022; &#10022; &#10023; &#10023;</span>";
      case 7: case 8:
        return "<span>&#10022; &#10022; &#10022; &#10022; &#10023;</span>";
      case 9: case 10:
        return "<span>&#10022; &#10022; &#10022; &#10022; &#10022;</span>";
      default:
        return "";
    }
  },
  address: function address() {
    const venue = Places.findOne({ _id: this.toString() });
    if (venue) {
      const street = venue.location.address.replace(/,/g, "");
      const postalCode = venue.location.postalCode;
      const city = venue.location.city;
      const formatedAddress = `${street}, ${postalCode}, ${city}`;
      return formatedAddress;
    }
    return false;
  },
});

Template.list.events({
  "click .list-item": function goToVenue() {
    const newPath = FlowRouter.path("place", { _id: this.toString() });
    FlowRouter.go(newPath);
  },
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
    const currentTitle = $("[data-action=edit-list-title]")[0].innerText;
    const newTitle = $("[data-action=save-list-title]")[0].value;
    if (!newTitle) {
      $("[data-action=save-list-title]").hide();
      $("[data-action=edit-list-title]").show();
      $("[data-action=save-list-title]")[0].value = currentTitle;
      validationFail();
    } else if (!(currentTitle === newTitle) && newTitle) {
      updateListTitle.call({
        listId: instance.listId,
        newTitle
      }, (error) => {
        $("[data-action=save-list-title]").hide();
        $("[data-action=edit-list-title]").show();
        if (error) {
          $("[data-action=save-list-title]")[0].value = currentTitle;
          validationFail();
        } else {
          validationSuccess();
        }
      });
    } else {
      $("[data-action=save-list-title]")[0].value = currentTitle;
      $("[data-action=save-list-title]").hide();
      $("[data-action=edit-list-title]").show();
    }
  },
  "blur [data-action=save-list-description]": (event, instance) => {
    const currentDescription = $("[data-action=edit-list-description]")[0].innerText;
    const newDescription = $("[data-action=save-list-description]")[0].value;
    const hasPromptText = (currentDescription === "add description");
    const isUnique = !(newDescription === currentDescription) && !hasPromptText;
    const isNew = !(newDescription === "") && hasPromptText;
    if (isUnique || isNew) {
      updateListDescription.call({
        listId: instance.listId,
        newDescription
      }, (error) => {
        $("[data-action=save-list-description]").hide();
        $("[data-action=edit-list-description]").show();
        if (error) {
          validationFail();
        } else {
          validationSuccess();
        }
      });
    } else {
      $("[data-action=save-list-description]").hide();
      $("[data-action=edit-list-description]").show();
    }
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
    // Toggle Enter venue and delete venue buttons
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
    if ($("[data-action=edit-list]").text() === "Edit") {
      $("[data-action=edit-list]").text("Done");
    } else {
      $("[data-action=edit-list]").text("Edit");
    }
    $("[data-action=edit-list]").toggleClass("list__edit--red");
  },
  "click [data-action=delete-list]": (event, instance) => {
    if (isOwner() && confirm("Are you sure you want to delete this list?")) {
      removeList.call({ listId: instance.listId });
      FlowRouter.go("home");
    }
  },
  "click .list-item__arrow--delete": function hello(event, instance) {
    event.stopPropagation();
    if (isOwner()) {
      removeVenueFromList.call({ listId: instance.listId, venueId: this.toString() });
    }
  },
  "click [data-action=go-home]": () => {
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
