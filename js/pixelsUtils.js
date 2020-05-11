function comparePixels(pixelA, pixelB) {
  if (pixelA.getDate() > pixelB.getDate()) {
    return 1;
  }
  return -1;
}

function dateToPixelId(date) {
  return (((date.getFullYear() * 100) + date.getMonth() + 1) * 100) + date.getDate();
}

function parseJSONToPixels(jsonArray) {
  var pixels = [];
  for(var i = 0; i < jsonArray.length; i++) {
      var pixelJsonObj = jsonArray[i];

      var date = pixelJsonObj.date;
      var yearMonthDay = date.split('-');
      var pixel = new Pixel(yearMonthDay[2], yearMonthDay[1], yearMonthDay[0]);
      pixel.setMood(Moods.NOT_SET + pixelJsonObj.mood);
      pixel.setNotes(pixelJsonObj.notes);

      var emotionsJsonArray = pixelJsonObj.emotions;
      for(var j = 0; j < emotionsJsonArray.length; j++) {
        pixel.addEmotion(emotionsJsonArray[j]);
      }

      pixels.push(pixel);
  }
  return pixels;
}
