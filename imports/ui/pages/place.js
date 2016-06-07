import "./place.html";
import { Lists } from "../../api/lists/lists.js";

import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router";
import { validationSuccess, validationFail } from "../components/validation.js";
import { addVenueToList } from "../../api/lists/methods.js";
import { createStars } from "../components/createStars.js";
import { loading } from "../components/loading.html"; // eslint-disable-line no-unused-vars

Template.place.onCreated(function createPlace() {
  this.venueId = FlowRouter.current().params._id;
  this.autorun(() => {
    this.subscribe("venue", this.venueId);
    this.subscribe("lists");
  });
});

Template.place.helpers({
  cordova: () => Meteor.isCordova,
  place: () => Places.findOne(),
  rating: (score) => createStars(score),
  address: (location) => {
    let address = "";
    if (location) {
      const street = location.address ? location.address.replace(/,/g, "") + ", " : "";
      const postalCode = location.postalCode ? location.postalCode + ", " : "";
      const city = location.city || "";
      const formattedAddress = `${street}${postalCode}${city}`;
      address = formattedAddress;
    }
    return address;
  },
  photo: (photo) => `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`,
  tipsCount: (tips) => {
    let tipsCount = "";
    if (tips) {
      tipsCount = tips.count;
    }
    return tipsCount;
  },
  tip: () => {
    const venue = Places.findOne();
    if (venue && venue.tips) {
      const tips = venue.tips.groups[0].items;
      return tips;
    }
    return false;
  },
  userLists: () => {
    const user = Meteor.user();
    let returnedLists;

    if (user) {
      const lists = Lists.find({ userId: user._id });
      if (lists.count()) {
        returnedLists = lists;
      }
    }
    return returnedLists;
  }
});

Template.place.events({
  "click .place__back": () => {
    if (Meteor.isCordova) {
      history.back();
    }
  },
  "click .place__close": () => {
    // Meteor.defer is here to fix a meteor bug "Error: Must be attached"
    Meteor.defer(() => {
      FlowRouter.go("home");
    });
  },
  "click .place__add": () => {
    $(".add-business").toggle();
  },
  "click .add-business__save": (event, instance) => {
    const listId = $(".add-business__lists option:selected").val();
    addVenueToList.call({ listId, venueId: instance.venueId }, (error) => {
      $(".add-business").toggle();
      if (error) {
        validationFail();
      } else {
        validationSuccess();
      }
    });
  },
  "click .place": (event) => {
    const isNotAddBusiness = !$(event.target).is(".add-business");
    const isNotAddButton = !$(event.target).is(".place__add");
    if (isNotAddBusiness && isNotAddButton) {
      $(".add-business").fadeOut(200);
    }
  },
  "click .add-business": (event) => {
    event.stopPropagation();
  }
});
