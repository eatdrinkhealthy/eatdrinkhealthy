import "./list.html";
import { Lists } from "../../api/lists/lists.js";

import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { FlowRouter } from "meteor/kadira:flow-router";

// methods
import {
  updateListTitle,
  updateListDescription,
  removeVenueFromList,
  removeList
} from "../../api/lists/methods.js";

// components
import "../components/shareModal.js";

// helper function
function isOwner() {
  const list = Lists.findOne();
  const user = Meteor.user();
  return list && user && user._id === list.author
}
function removeListClient(instance) {
  if (isOwner()) {
    removeList.call({ listId: instance.listId });
    FlowRouter.go("home");
  }
}

Template.list.onCreated(function createList() {
  this.listId = FlowRouter.current().params._id;
  this.autorun(() => {
    this.subscribe("list", this.listId);
  });
});

Template.list.helpers({
  listId: () => FlowRouter.current().params._id,
  list: () => Lists.findOne(),
  owner: () => {
    const list = Lists.findOne();
    return list ? list.author === Meteor.user()._id : false;
  },
  venueCount: () => {
    const list = Lists.findOne();
    return list ? list.venues.length : "";
  }
});

Template.list.events({
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
      $(".alert--fail").fadeIn(400);
      Meteor.setTimeout(() => {
        $(".alert--fail").fadeOut(400);
      }, 2000);
    } else if (!(currentTitle === newTitle) && newTitle) {
      updateListTitle.call({
        listId: instance.listId,
        newTitle
      }, (error) => {
        $("[data-action=save-list-title]").hide();
        $("[data-action=edit-list-title]").show();
        if (error) {
          $("[data-action=save-list-title]")[0].value = currentTitle;
          $(".alert--fail").fadeIn(400);
          Meteor.setTimeout(() => {
            $(".alert--fail").fadeOut(400);
          }, 2000);
        } else {
          $(".alert--success").fadeIn(400);
          Meteor.setTimeout(() => {
            $(".alert--success").fadeOut(400);
          }, 2000);
        }
      });
    } else {
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
          $(".alert--fail").fadeIn(400);
          Meteor.setTimeout(() => {
            $(".alert--fail").fadeOut(400);
          }, 2000);
        } else {
          $(".alert--success").fadeIn(400);
          Meteor.setTimeout(() => {
            $(".alert--success").fadeOut(400);
          }, 2000);
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
    // Toggle Enter venue and delte venue buttons
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
    $("[data-action=edit-list]").toggleClass("list__edit--red");
  },
  "click [data-action=delete-list]": () => {
    $(".confirmation").fadeIn(200);
    $(".confirmation").addClass("delete-list-confirmation");
  },
  "click .confirmation__yes": (event, instance) => {
    if ($(".confirmation").hasClass("delete-list-confirmation")) {
      removeListClient(instance);
      $(".confirmation").removeClass().addClass("confirmation");
    }
  },
  "click .confirmation__cancel": () => {
    $(".confirmation").fadeOut(200);
    $(".confirmation").removeClass("delete-list-confirmation");
  },
  "click .list-item__arrow--delete": function hello(event, instance) {
    if (isOwner()) {
      removeVenueFromList.call({ listId: instance.listId, venueId: this.toString() });
    }
  },
  "click [data-action=close-list]": () => {
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
