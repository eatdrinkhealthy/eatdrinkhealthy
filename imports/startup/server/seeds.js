import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Lists } from "../../api/lists/lists.js";
import { Roles } from "meteor/alanning:roles";

// Insert some list items if there is nothing in the db on startup.
if (Meteor.isServer) {
  // Insert lists
  const newLists = [
    {
      title: "Vegan Shops",
      description: "A list of my favourite local vegan shops.",
      venues: [
        "4b6c4f7cf964a5209f2f2ce3",
        "4c0d39fec700c9b6a116a2dd",
        "54fd7b9d498ed10df2a3c248",
      ],
    },
    {
      title: "Vegetarian Shops",
      description: "A list of my favourite local vegetarian shops.",
      venues: [
        "4b6c4f7cf964a5209f2f2ce3",
        "4c0d39fec700c9b6a116a2dd",
        "54fd7b9d498ed10df2a3c248",
      ],
    },
    {
      title: "Gluten-Free Restaurants",
      description: "A list of my favourite local Gluten-Free restaurants.",
      venues: [
        "4b6c4f7cf964a5209f2f2ce3",
        "4c0d39fec700c9b6a116a2dd",
        "54fd7b9d498ed10df2a3c248",
      ],
    },
  ];

  const addUser = (userInfo) => {
    let retVal;
    if (Accounts.createUser) {
      retVal = Accounts.createUser(userInfo);
    } else {
      // accounts-password is not added
      const userId = Meteor.users.insert(userInfo);
      retVal = Meteor.users.findOne(userId);
    }
    return retVal;
  };
  Meteor.startup(() => {
    // Some seed users for every app. Each app can modify these or add other
    // seed data as desired.
    // This only runs if accounts-password is added (Accounts.createUser is
    // defined in that package)

    if (Meteor.users.find().count() === 0) {
      console.log("Inserting seed users ..."); // eslint-disable-line no-console

      addUser({
        username: "turing",
        email: "turing@example.com",
        password: "password",
        profile: {
          name: "Alan Turing",
        },
      });

      addUser({
        username: "knuth",
        email: "knuth@example.com",
        password: "password",
        profile: {
          name: "Ada Lovelace",
        },
      });

      addUser({
        username: "lovelace",
        email: "lovelace@example.com",
        password: "password",
        profile: {
          name: "Ada Lovelace",
        },
      });

      addUser({
        username: "kernighan",
        email: "kernighan@example.com",
        password: "password",
        profile: {
          name: "Brian Kernighan",
        },
      });

      addUser({
        username: "ritchie",
        email: "ritchie@example.com",
        password: "password",
        profile: {
          name: "Dennis Ritchie",
        },
      });

      addUser({
        username: "dijkstra",
        email: "dijkstra@example.com",
        password: "password",
        profile: {
          name: "Edsger Dijkstra",
        },
      });

      addUser({
        username: "wozniak",
        email: "wozniak@example.com",
        password: "password",
        profile: {
          name: "Steve Wozniak",
        },
      });

      const admin = addUser({
        username: "admin",
        email: "admin@example.com",
        password: "password",
        profile: {
          name: "Admin",
        },
      });
      Roles.addUsersToRoles(admin, ["admin"]);
    }

    if (Lists.find().count() === 0) {
      console.log("Inserting seed data..."); // eslint-disable-line no-console

      Meteor.users.find().fetch().forEach((user) => {
        if (Lists.find({ userId: user._id }).count() === 0) {
          newLists.forEach((list) => {
            Lists.insert({
              title: list.title,
              description: list.description,
              venues: list.venues,
              author: user.profile.name,
              userId: user._id,
              dateCreated: new Date(),
            });
          });
        }
      });
    }
  });

  // Add sample lists to a user
  global.addSampleLists = id => {
    try {
      const user = Meteor.users.findOne({ _id: id });
      newLists.forEach((list) => {
        Lists.insert({
          title: list.title,
          description: list.description,
          venues: list.venues,
          author: user.profile.name,
          userId: user._id,
          dateCreated: new Date(),
        });
      });
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
    }
  };
}

