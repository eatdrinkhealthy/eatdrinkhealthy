import { FlowRouter } from "meteor/kadira:flow-router";
import { BlazeLayout } from "meteor/kadira:blaze-layout";

// Layouts
import "../../ui/layouts/layout.js";

// Pages
import "../../ui/pages/home.js";
import "../../ui/pages/list.js";
import "../../ui/pages/place.js";

BlazeLayout.setRoot("body");

FlowRouter.route("/", {
  name: "home",
  action() {
    BlazeLayout.render("layout", {
      yield: "home"
    });
  }
});

FlowRouter.route("/list/:_id", {
  name: "list",
  action() {
    BlazeLayout.render("layout", {
      yield: "list"
    });
  }
});

FlowRouter.route("/place/:_id", {
  name: "place",
  action() {
    BlazeLayout.render("layout", {
      yield: "place"
    });
  }
});
