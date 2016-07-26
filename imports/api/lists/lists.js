import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Lists = new Mongo.Collection("lists");

const listsSchema = new SimpleSchema({
  title: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  venues: {
    type: [String],
    optional: true,
  },
  author: {
    type: String,
  },
  userId: {
    type: String,
  },
  dateCreated: {
    type: Date,
  },
});

Lists.attachSchema(listsSchema);

Lists.allow({
  insert(userId) {
    return userId;
  },
  update(userId, doc) {
    return doc.userId === userId;
  },
  remove(userId, doc) {
    return doc.userId === userId;
  },
});
