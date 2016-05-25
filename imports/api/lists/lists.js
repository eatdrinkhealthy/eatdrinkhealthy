import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Lists = new Mongo.Collection("lists");

listsSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 100
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
    max: 200
  },
  venues: {
    type: [String],
    label: "List of Venues",
    optional: true,
    min: 0
  },
  author: {
    type: String,
    label: "Author"
  },
  dateCreated: {
    type: Date,
    label: "Date Created"
  }
});

Lists.attachSchema(listsSchema);

Lists.allow({
  insert(userId) {
    return userId;
  },
  update(userId, doc) {
    return doc.author === userId;
  },
  remove(userId, doc) {
    return doc.author === userId;
  }
});
