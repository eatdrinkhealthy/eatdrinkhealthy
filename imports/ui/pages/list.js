import "./list.html";
import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router";
import { ReactiveVar } from "meteor/reactive-var";
import { AutoForm } from "meteor/aldeed:autoform";
import { validationSuccess, validationFail } from "../components/validation.js";
import { removeVenueFromList, removeList } from "../../api/lists/methods.js";
import { Lists } from "../../api/lists/lists.js";
import { createStars } from "../components/createStars.js";
import { loading } from "../components/loading.html"; // eslint-disable-line no-unused-vars
import { Places } from "../../api/places/client/places";

// components
import "../components/shareModal.js";

// helper function
function isOwner() {
  const list = Lists.findOne();
  const user = Meteor.user();
  return list && user ? user._id === list.userId : false;
}

Template.list.onCreated(function createList() {
  editMode = new ReactiveVar(false);
  this.listId = FlowRouter.current().params._id;
  this.autorun(() => {
    this.subscribe("list", this.listId);
    const list = Lists.findOne();
    if (list) {
      this.subscribe("listVenues", list.venues);
    }
  });
});

Template.list.onRendered(() => {
  if (Meteor.isCordova) {
    $(".list__nav").animate({ paddingTop: "+=20px", height: "+=20px" }, 100);
  }
});

Template.list.helpers({
  Lists: () => Lists,
  list: () => Lists.findOne(),
  owner: () => isOwner(),
  place: function findPlace() {
    return Places.findOne({ _id: this.toString() });
  },
  rating: (score) => createStars(score),
  address: (location) => {
    let address = "";
    if (location) {
      const street = location.address ? `${location.address.replace(/,/g, "")}, ` : "";
      const postalCode = location.postalCode ? `${location.postalCode}, ` : "";
      const city = location.city || "";
      const formattedAddress = `${street}${postalCode}${city}`;
      address = formattedAddress;
    }
    return address;
  },
  editMode: () => editMode.get(),
});

Template.list.events({
  "click .list-item": function goToVenue() {
    const newPath = FlowRouter.path("place", { _id: this.toString() });
    // Meteor.defer is here to fix a meteor bug "Error: Must be attached"
    Meteor.defer(() => {
      FlowRouter.go(newPath);
    });
  },
  "focus #updateListInfo": () => {
    oldForm = $("#updateListInfo").serialize();
    oldTitle = $("#updateListInfo").serializeArray().filter(o => o.name === "title")[0].value;
  },
  "blur #updateListInfo": () => {
    const newForm = $("#updateListInfo").serialize();
    const newTitle = $("#updateListInfo").serializeArray().filter(o => o.name === "title")[0].value;
    if (oldForm !== newForm && newTitle !== "") {
      $("#updateListInfo").submit();
    } else if (newTitle === "") {
      $("#updateListInfo .list__title").val(oldTitle);
      validationFail();
    }
  },
  "keydown #updateListInfo input": (event) => {
    if (event.keyCode === 13) {
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
  "click .list": (event) => {
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
      // Meteor.defer is here to fix a meteor bug "Error: Must be attached"
      Meteor.defer(() => {
        FlowRouter.go("home");
      });
    }
  },
  "click .list-item__arrow--delete": function hello(event, instance) {
    event.stopPropagation();
    if (isOwner()) {
      removeVenueFromList.call({ listId: instance.listId, venueId: this.toString() });
    }
  },
  "click .list__edit": () => {
    editMode.set(!editMode.get());
  },
  "click [data-action=go-home]": () => {
    // Meteor.defer is here to fix a meteor bug "Error: Must be attached"
    Meteor.defer(() => {
      FlowRouter.go("home");
    });
  },
});

AutoForm.hooks({
  updateListInfo: {
    onSuccess: () => validationSuccess(),
    onError: () => validationFail(),
  },
});
