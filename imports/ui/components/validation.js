import "./validation.html";

import { Meteor } from "meteor/meteor";
import { $ } from "meteor/jquery";

export function validationSuccess() {
  $(".alert--success").fadeIn(400);
  Meteor.setTimeout(() => {
    $(".alert--success").fadeOut(400);
  }, 2000);
}

export function validationFail() {
  $(".alert--fail").fadeIn(400);
  Meteor.setTimeout(() => {
    $(".alert--fail").fadeOut(400);
  }, 2000);
}
