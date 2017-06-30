import { ServiceConfiguration } from "meteor/service-configuration";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  {
    $set: {
      appId: Meteor.settings.oAuth.facebook.appId,
      secret: Meteor.settings.oAuth.facebook.secret,
      loginStyle: "redirect",
    },
  }
);

Accounts.onCreateUser(({ profile }, user) => {
  const profileWithPicture = profile;
  const currentUser = user;
  profileWithPicture.picture = `https://graph.facebook.com/${user.services.facebook.id}/picture/?type=large`;
  currentUser.profile = profileWithPicture;
  return currentUser;
});
