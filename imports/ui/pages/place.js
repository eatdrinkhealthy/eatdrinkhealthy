import "./place.html";
import { Lists } from "../../api/lists/lists.js";

import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Session } from "meteor/session";

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
  Session.set("allReviews", false);
});

Template.place.helpers({
  name: () => {
    const venue = Places.findOne();
    return venue ? venue.name : "";
  },
  category: () => {
    const venue = Places.findOne();
    return venue ? venue.category : "";
  },
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
  address: () => {
    const venue = Places.findOne();
    if (venue) {
      const street = venue.location.address.replace(/,/g, "");
      const postalCode = venue.location.postalCode;
      const city = venue.location.city;
      const formatedAddress = `${street}, ${postalCode}, ${city}`;
      return formatedAddress;
    }
    return false;
  },
  description: () => {
    const venue = Places.findOne();
    if (venue && venue.page && venue.page.pageInfo && venue.page.pageInfo.description) {
      return venue.page.pageInfo.description;
    }
    return false;
  },
  phone: () => {
    const venue = Places.findOne();
    if (venue && venue.contact && venue.contact.formattedPhone) {
      return venue.contact.formattedPhone;
    }
    return false;
  },
  photo: () => {
    const venue = Places.findOne();
    if (venue && venue.photo) {
      const photo = venue.photo;
      const formattedUrl = `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`;
      return formattedUrl;
    }
    return false;
  },
  tipsCount: () => {
    const venue = Places.findOne();
    if (venue && venue.tips) {
      const tips = venue.tips.count;
      return tips;
    }
    return false;
  },
  tip: () => {
    const venue = Places.findOne();
    if (venue && venue.tips) {
      const tips = venue.tips.groups[0].items;
      if (Session.get("allReviews")) {
        return tips;
      } else {
        return tips.slice(-3);
      }
    }
    return false;
  },
  userLists: () => {
    const user = Meteor.user();
    if (user) {
      const lists = Lists.find({ userId: user._id });
      return lists;
    }
    return false;
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
    addVenueToList.call({ listId, venueId: instance.venueId });
    $(".add-business").toggle();
  },
  "click .place__view-all": () => {
    Session.set("allReviews", true);
    $(".place__view-all").hide();
  }
});
