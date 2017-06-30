import { Accounts } from "meteor/accounts-base";

Accounts.ui.config({
  requestPermissions: {
    facebook: ["public_profile"],
  },
});
