function comparePixels(pixelA, pixelB) {
  if (pixelA.getDate() > pixelB.getDate()) {
    return 1;
  }
  return -1;
}

function dateToPixelId(date) {
  return (((date.getFullYear() * 100) + date.getMonth() + 1) * 100) + date.getDate();
}

function monthsFromTo(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    months++;
    return months <= 0 ? 0 : months;
}
