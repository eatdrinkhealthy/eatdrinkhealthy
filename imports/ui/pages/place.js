import "./place.html";
import { Lists } from "../../api/lists/lists.js";

import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { validationSuccess, validationFail } from "../components/validation.js";
import { addVenueToList } from "../../api/lists/methods.js";
import { createStars } from "../components/createStars.js";

Template.place.onCreated(function createPlace() {
  this.venueId = FlowRouter.current().params._id;
  this.autorun(() => {
    this.subscribe("venue", this.venueId);
    this.subscribe("lists");
  });
});

Template.place.helpers({
  place: () => Places.findOne(),
  rating: (score) => createStars(score),
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
