import "./place.html";
import { Lists } from "../../api/lists/lists.js";

import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { validationSuccess, validationFail } from "../components/validation.js";

// components

// methods
import {
  addVenueToList
} from "../../api/lists/methods.js";

Template.place.onCreated(function createPlace() {
  this.venueId = FlowRouter.current().params._id;
  this.autorun(() => {
    this.subscribe("venue", this.venueId);
    this.subscribe("lists");
  });
});

Template.place.helpers({
  place: () => Places.findOne(),
  rating: () => {
    const venue = Places.findOne();
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
  address: (location) => {
    const street = location.address.replace(/,/g, "") || "";
    const postalCode = location.postalCode || "";
    const city = location.city || "";
    const formatedAddress = `${street}, ${postalCode}, ${city}`;
    return formatedAddress;
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
  "click .place__close": () => {
    history.back();
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
  }
});
