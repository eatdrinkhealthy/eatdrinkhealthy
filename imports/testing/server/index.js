import { Lists } from "../../api/lists/lists";

// XXX Workaround: Expose as a global for testing fixture code access.
// This will not be necessary when Meteor fully adopts NPM, but if you try to
// import Lists as we do here from within the testing code, it fails because it
// can't use Meteor 1.3's workaround to make meteor modules importable:
// `Cannot find module 'meteor/mongo'`
global.Lists = Lists;
