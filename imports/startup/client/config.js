import { Accounts } from "meteor/accounts-base";

Accounts.ui.config({
  requestPermissions: {
    facebook: [
      "public_profile",
      // 'user_location' TODO: This will trigger a manual review process by facebook!
      //                       complete user profile before collecting this
    ]
  }
});
