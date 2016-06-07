import "./home.html";

import { $ } from "meteor/jquery";
import { Template } from "meteor/templating";

// Components used inside the template
import "../components/sidebar.js";
import "../components/map/map.js";
import "../components/profile.js";
import "../components/lists.js";

Template.home.events({
  "click .sidebar": () => {
    $(".filter").addClass("filter-closed");
  },
  "click #map": () => {
    $(".filter").addClass("filter-closed");
  }
});
