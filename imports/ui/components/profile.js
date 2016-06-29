import "./profile.html";

import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

Template.profile.helpers({
  photoUrl: () => {
    const user = Meteor.user();
    let url = "/images/avatar.png";
    if (user && user.profile.picture) {
      url = user.profile.picture;
    }
    return url;
  },
});

Template.profile.onRendered(() => {
  if (Meteor.isCordova) {
    $(".profile").css({ paddingTop: "+=20px" });
    $(".profile__settings").css({ top: "+=20px" });
  }
});

Template.profile.events({
  "click [data-action=logout-user]": () => {
    Meteor.logout();
  }
});
