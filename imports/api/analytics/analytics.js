import { $ } from "meteor/jquery";
/* global analytics */

export function registerAnalyticsHandlers() {
  console.log("Registering...");
  $("[data-track]").each((i, block) => {
    console.log("found: ", $(block).data("track"));
    $(block).click(() => {
      analytics.track(`click: ${$(block).data("track")}`);
    });
  });
}
