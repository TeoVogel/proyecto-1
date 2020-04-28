const Moods = {
  NOT_SET : 0,
  SADDEST : 1,
  SAD : 2,
  NEUTRAL : 3,
  HAPPY : 4,
  HAPPIEST : 5
}

class Pixel {

  constructor(day, month, year) {
    this.day = day;
    this.month = month;
    this.year = year;

    this.mood = Moods.NOT_SET;
    this.notes = "";
    this.emotions = [];
  }

  setMood(mood) {
    this.mood = mood;
  }

  setNotes(notes) {
    this.notes = notes;
  }

  addEmotion(emotion) {
    this.emotions.push(emotion);
  }

  getDate() {
    return new Date(this.year, this.month, this.day);
  }

}

class Month {

  constructor(month, year) {
    this.month = month;
    this.year = year;
    this.maxDay = (new Date(year, month, 0)).getDate();
    this.pixels = [];
  }

  addPixel(pixel) {
    if (pixel.month == this.month && pixel.year == this.year) {
      this.pixels.push(pixel);
    }
  }

}

function parseJSON(jsonArray) {
  for(var i = 0; i < jsonArray.length; i++) {
      var pixelJsonObj = jsonArray[i];

      var date = pixelJsonObj.date;
      var yearMonthDay = date.split("-");
      var pixel = new Pixel(yearMonthDay[2], yearMonthDay[1], yearMonthDay[0]);
      pixel.setMood(Moods.NOT_SET + pixelJsonObj.mood);
      pixel.setNotes(pixelJsonObj.notes);

      var emotionsJsonArray = pixelJsonObj.emotions;
      for(var j = 0; j < emotionsJsonArray.length; j++) {
        pixel.addEmotion(emotionsJsonArray[j]);
      }

      console.log(pixel);
  }
}
