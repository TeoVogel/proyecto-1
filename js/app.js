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
    this.notes = '';
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

function parseJSON(jsonArray) {
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
      console.log(pixel);
  }
  processPixels(pixels);
}

function processPixels(pixels) {
  pixels.sort(comparePixels);

  this.pixelsMap = new Map()
  if (pixels.length == 0) {
    // TODO show error message ?
    return;
  }

  this.firstPixel = pixels[0];
  this.lastPixel = pixels[pixels.length - 1];
  this.startingDate = firstPixel.getDate();
  this.endingDate = lastPixel.getDate();

  for(var i = 0; i < pixels.length; i++) {
    pixelsMap.set(pixels[i].getId(), pixels[i]);
  }

  drawPixels();
}

function drawPixels() {
  var tableHTML = '<table>';
  var logsHTML = '';
  tableHTML += getPixelsTableHeaderHTML();

  var iDate = new Date(startingDate.getTime());
  for(var j = 0; j < monthsFromTo(startingDate, endingDate); j++) {
    const monthName = iDate.toLocaleString('default', { month: 'long' });
    const monthNumber = iDate.getMonth() + 1;
    const yearNumber = iDate.getFullYear();
    const pixelsInMonth = [];
    var tableRowHTML = '<td>' + monthName + '</td>';
    while((iDate.getMonth() + 1) == monthNumber) {
      const pixel = pixelsMap.get(dateToPixelId(iDate));
      tableRowHTML += getPixelCellHTML(pixel);
      if (pixel != null) { pixelsInMonth.push(pixel); }
      iDate.setDate(iDate.getDate() + 1);
    }
    logsHTML += getPixelLogMonthHTML(pixelsInMonth, monthName, monthNumber, yearNumber);
    tableHTML += '<tr>' + tableRowHTML + '</tr>';
  }

  tableHTML += '</table>';
  document.getElementById('pixelsTableContainer').innerHTML = tableHTML;
  document.getElementById('pixelsLogsContainer').innerHTML = logsHTML;
}

function getPixelsTableHeaderHTML() {
  var html = '<tr><td style="border: 0px"></td>';
  for(var j = 1; j <= 31; j++) {
    const dayNumber = j;
    const dayTextPrefix = (dayNumber < 10) ? '0' : '';
    html += '<td>' + dayTextPrefix + dayNumber + '</td>';
  }
  html += '</tr>';
  return html;
}

function getPixelCellHTML(pixel) {
  const mood = (pixel != null) ? pixel.mood : Moods.NOT_SET;
  return '<td class="cell mood' + mood + '">  </td>';
}

function getPixelLogMonthHTML(pixels, monthName, month, year) {
  var html = "";
  if (pixels.length != 0) {
    const containerId = getLogMonthContainerElementId(month, year);
    html += '<a data-toggle="collapse" href="#' + containerId + '" >'
    html += '<div class="monthHeader"><h4>' + monthName + '</h4></div>';
    html += '</a>';
    html += '<div class="collapse" id="' + containerId + '">';
    pixels.forEach((pixel) => {
      html += getPixelLogHTML(pixel);
    });
    html += '</div>';
  }
  return html;
}

function getPixelLogHTML(pixel) {
  var html = '<div class="card log">';
  const date = pixel.getDate();
  const monthNameShort = date.toLocaleString('default', { month: 'short' });
  const dayNumber = date.toLocaleString('default', { day: 'numeric' });
  const dayTextPrefix = (dayNumber < 10) ? '0' : '';
  const yearNumber = date.getFullYear();
  const weekDay = date.toLocaleString('default', { weekday: 'long' });
  const dateText = dayTextPrefix + dayNumber + ' ' + monthNameShort + ' ' + yearNumber + ', ' + weekDay;
  html += '<div class="row ">';
  html += '<div class="col-2 col-lg-1 mood' + pixel.mood + '"><img src="img/mood' + pixel.mood + '.png"></div>';
  html += '<div class="col-10 col-lg-11">';
  html += '<h6>' + dateText + '</h6>';
  pixel.emotions.forEach((emotion) => {
    html += '<div class="emotion">' + emotion + '</div>';
  });
  html += '<br>';
  html += '<p>' + pixel.notes + '</p>';
  html += '</div></div></div>';
  return html;
}

function getLogMonthContainerElementId(month, year) {
  return 'logMonthContainer' + year + '-' + month;
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
