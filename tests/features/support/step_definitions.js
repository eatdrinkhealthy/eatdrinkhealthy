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

  this.When(/^I view the filter page$/, () => {
    actions.toggleFilter();
    browser.waitForExist(".filter-item", 1500);
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

  this.Then(/^I see "Vegan \/ Vegetarian" & "Juice Bars" filters set$/, () => {
    // const checkedFilters = browser.getValue(".check");
    // const checkedFilters = browser.element("input[value=juiceBar]");
    // console.log(checkedFilters);
    // const attributeList = browser.getAttribute("input[value=juiceBar]", "checked");
    // console.log(attributeList);

    // NOTE: getAttribute returns a string, not boolean; so here we use chai's
    //       to.equal to compare to a string of 'true' or not.
    expect(browser.getAttribute("input[value=glutenFree]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=juiceBar]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=saladPlace]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=veganVegeRestaurant]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=bakery]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=cafe]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=coffeeShop]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=restaurant]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=farmersMarket]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=butcher]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=healthFoodStore]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=organicGrocery]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=grocery]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=supermarket]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=fruitVegeStore]", "checked")).to.not.equal("true");
    expect(browser.getAttribute("input[value=market]", "checked")).to.not.equal("true");
  });

  this.Then(/^I see my name in the profile section$/, () => {
    browser.waitForExist(".profile__name", 1500);
    expect(browser.getText(".profile__name")).to.equal("Frodo Baggins");
  });

  this.Then(/^I see a list of lists$/, () => {
    browser.waitForExist(".lists__title");
    expect(browser.getText(".lists__title")).to.equal("MY LISTS");
  });

  this.Then(/^The list of lists will contain "([^"]*)"$/, (name) => {
    browser.waitForExist(".lists");
    const listNames = browser.getText(".lists-item__title");
    expect(listNames.indexOf(name)).not.to.equal(-1);
  });

  this.Then(/^There will not be a list called "([^"]*)"$/, function (name) {
    actions.toggleSidebar();
    browser.waitForExist(".lists", 1500);
    const listNames = browser.getText(".lists-item__title");
    expect(listNames.indexOf(name)).to.equal(-1);
  });

  // allow placeholders that don't return errors.
  this.Then(/^a test needs to be written$/, () => {
    // always pending
    pending();
  });
}

module.exports = steps;
