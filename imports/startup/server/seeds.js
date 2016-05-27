import { Meteor } from "meteor/meteor";
import { ServiceConfiguration } from "meteor/service-configuration";
import { Lists } from "../../api/lists/lists.js";

// Insert some list items if there is nothing in the db on startup.
if (Meteor.isServer) {
  Meteor.startup(() => {
    if (Lists.find().count() === 0) {
      console.log("Inserting seed data..."); // eslint-disable-line no-console

      // Insert a fake Facebook configuration for testing and easy dev setup
      // On production or staging we will delete this record
      ServiceConfiguration.configurations.insert({
        _id: "123fake",
        service: "facebook",
        appId: "fake",
        secret: "delete me if you want to set up real facebook OAuth",
        loginStyle: "redirect",
      });

      // Insert lists
      const newLists = [
        {
          title: "Vegan Shops",
          description: "A list of my favourite local vegan shops.",
          venues: ["8732gyruu3a", "3da8gyui3", "a398yhiuda"],
        },
        {
          title: "Vegetarian Shops",
          description: "A list of my favourite local vegetarian shops.",
          venues: ["8732gyruu3a", "3da8gyui3", "a398yhiuda"],
        },
        {
          title: "Gluten-Free Restaurants",
          description: "A list of my favourite local Gluten-Free restaurants.",
          venues: ["8732gyruu3a", "3da8gyui3", "a398yhiuda"],
        },
      ];

      Meteor.users.find().fetch().forEach((user) => {
        if (Lists.find({ author: user._id }).count() === 0) {
          newLists.forEach((list) => {
            Lists.insert({
              title: list.title,
              description: list.description,
              venues: list.venues,
              author: user._id,
              dateCreated: new Date(),
            });
          });
        }
      });
    }
  });
}
