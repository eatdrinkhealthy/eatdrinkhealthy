import { Accounts } from "meteor/accounts-base";

Accounts.onCreateUser((options, user) => {
  options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
  user.profile = options.profile;
  return user;
});
