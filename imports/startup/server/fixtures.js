import { Meteor } from "meteor/meteor";
import { Lists } from "../../api/lists/lists.js";

// Insert some list items if there is nothing in the db on startup.
Meteor.startup(() => {
  /*
  if (Lists.find().count() === 0) {
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
      }
    ];

    newLists.forEach((list) => {
      Lists.insert({
        title: list.title,
        description: list.description,
        venues: list.venues,
        author: Meteor.users.findOne()._id, // eslint-disable-line no-underscore-dangle
        dateCreated: new Date()
      });
    });
  }
  */
});
