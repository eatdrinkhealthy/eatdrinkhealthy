/* eslint new-cap: 0 */
/* global browser */
/* global expect */

const actions = require("./actions");
const fixtures = require("./common-fixtures");

const baseUrl = "http://localhost:3000";

function steps() {
  //Given functions

  this.Given(/^I am on the homepage$/, () => {
    browser.url(baseUrl);
  });

  this.Given(/^I am signed out$/, () => {
    browser.execute("Meteor.logout()");
  });

  this.Given(/^I am authenticated$/, () => {
    browser.url(baseUrl);
    actions.toggleSidebar();
    const loginButton = "span.sign-in-text-facebook";
    if (browser.isExisting(loginButton)) {
      browser.click(loginButton);
    } else {
      // close the menu again - no login needed.
      actions.toggleSidebar();
    }
  });

  this.Given(/^I have the demo lists set up$/, function () {
    const meteorId = browser.execute(() => Meteor.userId()).value;
    fixtures.common.resetLists(meteorId);
  });

  // When functions

  this.When(/^I sign in$/, () => {
    browser.waitForExist("span.sign-in-text-facebook", 5000);
    browser.click("span.sign-in-text-facebook");
  });

  this.When(/^I click the menu$/, () => {
    actions.toggleSidebar();
  });

  this.When(/^I create a new list called "([^"]*)"$/, (listName) => {
    actions.toggleSidebar();
    actions.clickElement(".lists__create");
    actions.setTargetToValue(".lists__new-list>input", listName);
    actions.clickElement(".lists__new-list>button");
  });

  this.When(/^I delete the list "([^"]*)"$/, (listName) => {
    actions.toggleSidebar();

    // click the list by finding the index of its name
    browser.waitForExist(".lists");
    const listNames = browser.getText(".lists-item__title");
    const i = listNames.indexOf(listName) + 2;
    browser.element(`.lists-item:nth-child(${i})`).click(".lists-item__title");

    actions.clickElement(".list__edit");
    actions.clickElement(".list__delete");
    browser.alertAccept();
  });


  // Then functions

  this.Then(/^I see a map$/, () => {
    browser.waitForExist(".map", 1500);
  });

  this.Then(/^I see my name in the profile section$/, () => {
    browser.waitForExist(".profile__name", 1500);
    expect(browser.getText(".profile__name")).toEqual("Frodo Baggins");
  });

  this.Then(/^I see a list of lists$/, () => {
    browser.waitForExist(".lists__title");
    expect(browser.getText(".lists__title")).toEqual("MY LISTS");
  });

  this.Then(/^The list of lists will contain "([^"]*)"$/, (name) => {
    browser.waitForExist(".lists");
    const listNames = browser.getText(".lists-item__title");
    expect(listNames.indexOf(name)).not.toEqual(-1);
  });

  this.Then(/^There will not be a list called "([^"]*)"$/, function (name) {
    actions.toggleSidebar();
    browser.waitForExist(".lists", 1500);
    const listNames = browser.getText(".lists-item__title");
    expect(listNames.indexOf(name)).toEqual(-1);
  });

  // allow placeholders that don't return errors.
  this.Then(/^a test needs to be written$/, () => {
    // always pending
    pending();
  });
}

module.exports = steps;
