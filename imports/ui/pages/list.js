import "./list.html";
import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router";
import { AutoForm } from "meteor/aldeed:autoform";
import { validationSuccess, validationFail } from "../components/validation.js";
import { removeVenueFromList, removeList } from "../../api/lists/methods.js";
import { Lists } from "../../api/lists/lists.js";

// components
import "../components/shareModal.js";

// helper function
function isOwner() {
  const list = Lists.findOne();
  const user = Meteor.user();
  return list && user ? user._id === list.userId : false;
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

Template.list.onRendered(function renderList() {
  const list = Lists.findOne();
  const user = Meteor.user();
  this.autorun(() => {
    if (list && user && user._id !== list.userId) {
      $("#updateListInfo :input").prop("disabled", true);
    }
  });
});

Template.list.helpers({
  Lists: () => Lists,
  list: () => Lists.findOne(),
  owner: () => isOwner(),
  place: function findVenue() {
    return Places.findOne({ _id: this.toString() });
  },
  rating: (score) => Math.round(score / 2),
  address: (location) => {
    let address = "";
    if (location) {
      const street = location.address.replace(/,/g, "") || "";
      const postalCode = location.postalCode || "";
      const city = location.city || "";
      const formattedAddress = `${street}, ${postalCode}, ${city}`;
      address = formattedAddress;
    }
    return address;
  },
});

Template.list.events({
  "click .list-item": function goToVenue() {
    const newPath = FlowRouter.path("place", { _id: this.toString() });
    FlowRouter.go(newPath);
  },
  "focus #updateListInfo": () => {
    Session.set("currentTitle", $(".list__title").val());
    Session.set("currentDescription", $(".list__description").val());
  },
  "blur #updateListInfo": () => {
    $("#updateListInfo").submit();
  },
  "keydown #updateListInfo input": (event) => {
    if (event.keyCode === 13) {
      $("#updateListInfo").submit();
      $("#updateListInfo input").trigger("blur");
    }
  },
  "submit #updateListInfo": (event) => {
    event.preventDefault();
  },
  "click .list__share": () => {
    $(".list").addClass("list--blur");
    $(".share-modal").fadeIn(200);
  },
  "click": (event) => {
    const isNotShareModal = !$(event.target).is(".share-modal");
    const isNotShareButton = !$(event.target).is(".list__share");
    if (isNotShareModal && isNotShareButton) {
      $(".list").removeClass("list--blur");
      $(".share-modal").fadeOut(200);
    }
  },
  "click .list__delete": (event, instance) => {
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
  "click .list__edit": () => {
    // Toggle Enter venue and delete venue buttons
    if ($(".list-item__arrow").hasClass("list-item__arrow--delete")) {
      $(".list-item__arrow").text("»");
    } else {
      $(".list-item__arrow").text("–");
    }
    $(".list-item__arrow").toggleClass("list-item__arrow--delete");

    // Toggle Settings Button
    if ($(".list__edit").text() === "Edit") {
      $(".list__edit").text("Done");
    } else {
      $(".list__edit").text("Edit");
    }
    $(".list__edit").toggleClass("list__edit--red");

    // Toggle Share and Delete Button
    $(".list__share").toggle();
    $(".list__delete").toggleClass("list__delete--show");
  },
  "click [data-action=go-home]": () => {
    FlowRouter.go("/");
  }
});

AutoForm.hooks({
  updateListInfo: {
    before: {
      update: (doc) => {
        return doc;
      }
    },
    onSuccess: () => validationSuccess(),
    onError: () => {
      validationFail();
      $(".list__title").val(Session.get("currentTitle"));
      $(".list__description").val(Session.get("currentDescription"));
    }
  }
});
