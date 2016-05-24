import { FlowRouter } from "meteor/kadira:flow-router";
import { BlazeLayout } from "meteor/kadira:blaze-layout";

// Layouts
import "../../ui/layouts/layout.js";

// Pages
import "../../ui/pages/home.js";

FlowRouter.route("/", {
  action() {
    BlazeLayout.render("layout", {
      yield: "home"
    });
  }
});
