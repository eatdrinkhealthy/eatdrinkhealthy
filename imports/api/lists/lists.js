import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Lists = new Mongo.Collection("lists");

listsSchema = new SimpleSchema({
  title: {
    type: String,
    max: 100
  },
  description: {
    type: String,
    optional: true,
    max: 200
  },
  venues: {
    type: [String],
    optional: true,
    min: 0
  },
  author: {
    type: String,
  },
  dateCreated: {
    type: Date,
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
