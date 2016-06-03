export function createStars(score) {
  let stars = "";
  const scoreCount = Math.round(score / 2);
  for (i = 0; i < 5; i++) {
    if (scoreCount > i) {
      stars = stars.concat("<div class='star'></div>");
    } else {
      stars = stars.concat("<div class='star empty-star'></div>");
    }
  }
  return stars;
}
