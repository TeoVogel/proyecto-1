function setupTheme() {
  this.isDarkThemeEnabled = localStorage.getItem("isDarkThemeEnabled");
  setTheme(this.isDarkThemeEnabled);
  document.getElementById("themeToggle").checked = this.isDarkThemeEnabled;
}

function setTheme(isDarkThemeEnabled) {
  if (isDarkThemeEnabled) {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  }
}

function toggleTheme() {
  this.isDarkThemeEnabled = !this.isDarkThemeEnabled;
  setTheme(this.isDarkThemeEnabled);
  localStorage.setItem("isDarkThemeEnabled", this.isDarkThemeEnabled);
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

  startingDate.setDate(1);

  for(var i = 0; i < pixels.length; i++) {
    pixelsMap.set(pixels[i].getId(), pixels[i]);
  }

  drawPixels();
}

function drawPixels() {
  var tableHTML = '<table>';
  var logsHTML = '';
  tableHTML += getPixelsTableHeaderRowHTML();

  var iDate = new Date(startingDate.getTime());
  for(var j = 0; j < monthsFromTo(startingDate, endingDate); j++) {
    const monthName = iDate.toLocaleString('default', { month: 'long' });
    const monthNameShort = iDate.toLocaleString('default', { month: 'short' });
    const month = iDate.getMonth() + 1;
    const year = iDate.getFullYear();
    const pixelsInMonth = [];
    var tableRowHTML = `<td class="cell pixelsTableMonthCell">${monthNameShort}</td>`;
    while((iDate.getMonth() + 1) == month) {
      const pixel = pixelsMap.get(dateToPixelId(iDate));
      tableRowHTML += getPixelCellHTML(pixel);
      if (pixel != null) { pixelsInMonth.push(pixel); }
      iDate.setDate(iDate.getDate() + 1);
    }
    logsHTML += getPixelLogMonthHTML(pixelsInMonth, monthName, month, year);
    tableHTML += `<tr>${tableRowHTML}</tr>`;
  }

  tableHTML += '</table>';
  document.getElementById('pixelsTableContainer').innerHTML = tableHTML;
  document.getElementById('pixelsLogsContainer').innerHTML = logsHTML;
}

function getPixelsTableHeaderRowHTML() {
  var html = '<tr class="pixelsTableHeaderRow"><td class="cell" style="border: 0px"></td>';
  for(var j = 1; j <= 31; j++) {
    const day = j;
    const dayPfx = (day < 10) ? '0' : '';
    html += `<td class="cell">${dayPfx}${day}</td>`;
  }
  html += '</tr>';
  return html;
}

function getPixelCellHTML(pixel) {
  const mood = (pixel != null) ? pixel.mood : Moods.NOT_SET;
  const onClickListener = (pixel != null) ? `onClick="onPixelClicked(${pixel.day}, ${pixel.month}, ${pixel.year})"` : "";
  return `<td class="cell mood${mood}" ${onClickListener}>  </td>`;
}

function getPixelLogMonthHTML(pixels, monthName, month, year) {
  if (pixels.length != 0) {
    const id = getLogMonthElementId(month, year);
    var pixelLogsHtml = "";
    pixels.forEach((pixel) => { pixelLogsHtml += getPixelLogHTML(pixel); });
    return `<div class="monthHeader card">
              <a class="collapsed" data-toggle="collapse" href="#${id}">
                <h5>${monthName}</h5>
              </a>
              <div class="collapse" id="${id}">
                ${pixelLogsHtml}
              </div>
            </div>`;
  }
  return ``;
}

function getPixelLogHTML(pixel) {
  const id = getLogElementId(pixel.day, pixel.month, pixel.year);
  const dateText = getPixelLogDateText(pixel.getDate());
  var emotionsHtml = "";
  pixel.emotions.forEach((emotion) => { emotionsHtml += `<div class="emotion">${emotion}</div>`; });
  var html =
    `<div class="log" id="${id}">
      <div class="row ">
        <div class="col-2 col-lg-1 mood${pixel.mood}">
          <img src="img/mood${pixel.mood}.png">
        </div>
          <div class="col-10 col-lg-11">
            <h6>${dateText}</h6>
            <div>${emotionsHtml}</div>
            <p>${pixel.notes}</p>
        </div>
      </div>
    </div>`;
  return html;
}

function getPixelLogDateText(date) {
  const monthNameShort = date.toLocaleString('default', { month: 'short' });
  const day = date.toLocaleString('default', { day: 'numeric' });
  const dayPfx = (day < 10) ? '0' : '';
  const year = date.getFullYear();
  const weekDay = date.toLocaleString('default', { weekday: 'long' });
  return `${dayPfx}${day} ${monthNameShort} ${year}, ${weekDay}`;
}

function getLogMonthElementId(month, year) {
  return `logMonth${year}-${month}`;
}

function getLogElementId(day, month, year) {
  return `log${year}-${month}-${day}`;
}

function onPixelClicked(day, month, year) {
  document.getElementById(getLogMonthElementId(month, year)).classList.add("show");
  document.getElementById(getLogElementId(day, month, year)).scrollIntoView();
}
