import "./layout.html";

import { $ } from "meteor/jquery";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

Template.layout.onRendered(() => {
  // to make the cordova app feel more app-like, disable any sort of highlighting
  if (Meteor.isCordova) {
    $("body").addClass("unselectable");
  }
});
