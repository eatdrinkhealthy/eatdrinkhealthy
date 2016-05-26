import { FlowRouter } from "meteor/kadira:flow-router";
import { BlazeLayout } from "meteor/kadira:blaze-layout";

// Layouts
import "../../ui/layouts/layout.js";

// Pages
import "../../ui/pages/home.js";
import "../../ui/pages/list.js";

FlowRouter.route("/", {
  action() {
    BlazeLayout.render("layout", {
      yield: "home"
    });
  }
});

FlowRouter.route("/list/:_id", {
  action() {
    BlazeLayout.render("layout", {
      yield: "list"
    });
  }
});
