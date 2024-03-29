/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback, func-names */


import { createStars } from "../../imports/ui/components/createStars";

import { expect } from "chai";

function howManyStars(starString) {
  // createStars() returns a string that represents 5 divs with some number of
  // full stars (the rating) followed by as many empty stars as necessary to total 5.
  // We'll parse out the rating by counting the full stars.
  const findFullStars = /<div class='star'><\/div>/g;
  const findEmptyStars = /<div class='star empty-star'><\/div>/g;

  let fullStars = 0;
  let emptyStars = 0;

  while (findFullStars.exec(starString)) {
    fullStars++;
  }
  while (findEmptyStars.exec(starString)) {
    emptyStars++;
  }

  const totalStars = fullStars + emptyStars;
  if (totalStars !== 5) {
    throw new Error(`
      createStars(): full and empty stars should total 5 but instead total ${totalStars}
        full stars: ${fullStars}
        empty stars: ${emptyStars}
        original string: ${starString}
    `);
  }

  return fullStars;
}

describe("createStars() calculations", function () {
  it("should return score/2 stars for even numbers", function () {
    [[0, 0], [2, 1], [4, 2], [6, 3], [8, 4], [10, 5]].forEach(([score, expectedStars]) => {
      expect(howManyStars(createStars(score))).to.equal(expectedStars,
        `a score of ${score} should get ${expectedStars} stars`);
    });
  });

  it("should round up the score/2 stars for even numbers", function () {
    [[1, 1], [3, 2], [5, 3], [7, 4], [9, 5]].forEach(([score, expectedStars]) => {
      expect(howManyStars(createStars(score))).to.equal(expectedStars,
        `a score of ${score} should get ${expectedStars} stars`);
    });
  });

  it("should round down if below the odd number", function () {
    [[0.9, 0], [2.9, 1], [4.9, 2], [6.9, 3], [8.9, 4]].forEach(([score, expectedStars]) => {
      expect(howManyStars(createStars(score))).to.equal(expectedStars,
        `a score of ${score} should get ${expectedStars} stars`);
    });
  });

  it("should return 0 stars if the score is undefined", function () {
    expect(howManyStars(createStars(undefined))).to.equal(0);
  });

  it("should handle numbers outside the expected range", function () {
    expect(howManyStars(createStars(-10000))).to.equal(0);
    expect(howManyStars(createStars(10000))).to.equal(5);
  });

  it("should just return 0 stars if handed a non-numerical score", function () {
    expect(howManyStars(createStars("hello"))).to.equal(0, 'passed "hello"');
    expect(howManyStars(createStars({ score: 5 }))).to.equal(0, "passed an object");
  });
});
