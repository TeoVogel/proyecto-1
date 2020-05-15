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
