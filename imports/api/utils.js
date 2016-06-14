import { Meteor } from "meteor/meteor";

// Provide a predefined value for a non logged-in user
// (typically for consistent analytics reporting)
export function currentReportingUser() {
  return Meteor.userId() || "anonymous";
}
