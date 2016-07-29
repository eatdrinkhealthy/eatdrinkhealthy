import { Accounts } from "meteor/accounts-base";

Accounts.onCreateUser(({ profile }, user) => {
  const profileWithPicture = profile;
  const currentUser = user;
  profileWithPicture.picture = `https://graph.facebook.com/${user.services.facebook.id}/picture/?type=large`;
  currentUser.profile = profileWithPicture;
  return currentUser;
});
