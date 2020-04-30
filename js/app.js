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
    this.day = parseInt(day);
    this.month = parseInt(month);
    this.year = parseInt(year);

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
    return new Date(this.year, this.month - 1, this.day);
  }

  getId() {
    return (((this.year * 100) + this.month) * 100) + this.day;
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
  var pixels = [];
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

      pixels.push(pixel);
      console.log(pixel);
  }
  processPixels(pixels);
}

function processPixels(pixels) {
  pixels.sort(comparePixels);

  var currentDate = new Date(Date.now());
  this.startingDate = currentDate;
  this.endingDate = currentDate;
  this.pixelsMap = new Map()
  if (pixels.lenght == 0) {
    // TODO show error message ?
    return;
  }

  this.firstPixel = pixels[0];
  this.lastPixel = pixels[pixels.length - 1];

  var firstPixelDate = this.firstPixel.getDate();
  var lastPixelDate = this.lastPixel.getDate();
  if (firstPixelDate < currentDate) {
    this.startingDate = firstPixelDate;
  }
  if (lastPixelDate > currentDate) {
    this.endingDate = lastPixelDate;
  }
  this.startingDate.setDate(1);
  this.endingDate.setDate(1);

  for(var i = 0; i < pixels.length; i++) {
    pixelsMap.set(pixels[i].getId(), pixels[i]);
  }

  drawPixels();
}

function drawPixels() {
  const containerTable = document.getElementById("pixelsTableContainer");
  const containerLogs = document.getElementById("pixelsLogsContainer")
  var tableHTML = "<table>";
  var logsHTML = "";

  var iDate = new Date(startingDate.getTime());
  tableHTML += "<tr><td style=\"border: 0px\"></td>";
  for(var j = 1; j <= 31; j++) {
    const dayNumber = j;
    const dayTextPrefix = (dayNumber < 10) ? "0" : "";
    tableHTML += "<td>" + dayTextPrefix + dayNumber + "</td>"
  }
  tableHTML += "</tr>";
  for(var j = 0; j < monthsFromTo(startingDate, endingDate); j++) {
    const monthNumber = iDate.getMonth() + 1;
    const monthName = iDate.toLocaleString('default', { month: 'long' });
    var monthHTML = "<td>" + monthName + "</td>";
    while((iDate.getMonth() + 1) == monthNumber) {
      const pixel = pixelsMap.get(dateToPixelId(iDate));
      const mood = (pixel != null) ? pixel.mood : Moods.NOT_SET;
      monthHTML += getPixelCellHTML(iDate, mood);
      if (pixel != null) {
        logsHTML += getPixelLogHTML(pixel);
      }
      iDate.setDate(iDate.getDate() + 1);
    }
    tableHTML += "<tr>" + monthHTML + "</tr>";
  }

  tableHTML += "</table>";
  logsHTML += "</div>";
  containerTable.innerHTML = tableHTML;
  containerLogs.innerHTML = logsHTML;
}

function getPixelCellHTML(date, mood) {
  return "<td class=\"cell mood" + mood + "\">  </td>";
}

function getPixelLogHTML(pixel) {
  var html = "<div>";
  const date = pixel.getDate();
  const monthNameShort = date.toLocaleString('default', { month: 'short' });
  const dayNumber = date.toLocaleString('default', { day: 'numeric' });
  const dayTextPrefix = (dayNumber < 10) ? "0" : "";
  const yearNumber = date.getFullYear();
  const weekDay = date.toLocaleString('default', { weekday: 'long' });
  const dateText = monthNameShort + " " + dayTextPrefix + dayNumber + " " + yearNumber + ", " + weekDay;
  html += "<div class=\"log mood" + pixel.mood + "\">";
  html += dateText + "<br>";
  html += pixel.emotions + "<br>";
  html += pixel.notes + "<br>";
  html += "</div>";
  return html;
}

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
