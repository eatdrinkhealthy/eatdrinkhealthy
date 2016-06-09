import { $ } from "meteor/jquery";
/* global analytics */

export function registerAnalyticsHandlers() {
  $("[data-track]").each((i, block) => {
    $(block).click(() => {
      analytics.track(`click: ${$(block).data("track")}`);
    });
  });
}
