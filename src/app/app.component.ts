import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'standup';
  currName = '';
  names: Array<string> = [];
  standupStarted = false;
  standupFinished = false;
  timeExceeded = false;
  currentSpeaker = '';
  index = 0;
  speakingTime;
  speakerTime = 120;
  speakingMinutes = 0;
  speakingSeconds = 0;
  intervalId;
  totalTime = 0;
  totalMinutes = 0;
  totalSeconds = 0;
  defaultImageSource = 'assets/standup.jpg';
  finishedImageSource = 'assets/laughing.jpg';
  talkingImageSource = 'assets/talking.jpg';
  imageSource = this.defaultImageSource;

  constructor() {
    this.getNames();
  }

  getNames = () => {
    const namesAsString = localStorage.getItem('standupNames');
    if (namesAsString !== null) {
      this.names = JSON.parse(namesAsString);
    }
  }

  addName = () => {
    if (this.currName.length > 0) {
      this.names.push(this.currName);
      this.currName = '';
    }
    const input = document.getElementById('nameInput');
    input.focus();
  }

  removeName = (index: number) => {
    this.names.splice(index, 1);
  }

  startStandup = () => {
    localStorage.setItem('standupNames', JSON.stringify(this.names));
    this.standupStarted = true;
    this.imageSource = this.talkingImageSource;
    this.setRandomSpeaker();
    this.currName = '';
  }

  setRandomSpeaker = () => {
    this.speakingTime = this.speakerTime;
    this.timeExceeded = false;
    this.index = Math.floor(Math.random() * this.names.length);
    this.currentSpeaker = this.names[this.index];
    this.intervalId = setInterval(() => {
      this.speakingMinutes = Math.floor(this.speakingTime / 60);
      this.speakingSeconds = this.speakingTime % 60;
      this.speakingTime--;
      if (this.speakingTime < 0) {
        this.timeExceeded = true;
        clearInterval(this.intervalId);
      }
      this.totalTime++;
    }, 1000);
  }

  nextSpeaker = () => {
    clearInterval(this.intervalId);
    this.names.splice(this.index, 1);
    this.speakingTime = this.speakerTime;
    if (this.names.length > 0) {
      this.setRandomSpeaker();
    } else {
      this.timeExceeded = false;
      this.standupFinished = true;
      this.totalMinutes = Math.floor(this.totalTime / 60);
      this.totalSeconds = this.totalTime % 60;
      this.imageSource = this.finishedImageSource;
    }
  }

  backToStart = () => {
    this.standupStarted = false;
    this.standupFinished = false;
    this.getNames();
    this.imageSource = this.defaultImageSource;
  }
}
