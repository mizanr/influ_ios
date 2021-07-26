import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';

@Injectable()
export class PlayAudioProvider {

  position = 0;
  duration = -1;
  isLoaded = false;
  audiofile: MediaObject;
  filepath: any;
  // isPlay = false;
  positionInterval: any;
  constructor(public http: HttpClient,
    private media: Media,
    public zone: NgZone) {
    console.log('Hello ProfilePlayerProvider Provider');
  }


  fromserver(item) {
    console.log('mm-====== from server');
    this.position = 0;
    this.duration = -1;
    this.audiofile = this.media.create(this.filepath);
    this.audiofile.play();
    // this.playaudio();
    //this.audiofile.setVolume(0.0); // you don't want users to notice that you are playing the file
    let get_duration_interval = setInterval(() => {
      if (this.duration == -1) {
        this.duration = ~~this.audiofile.getDuration(); // make it an integer

      } else {
        //this.audiofile.stop();
        this.audiofile.pause();
        this.audiofile.seekTo(0);
        this.isLoaded = true;
        this.audiofile.play();
        console.log('mm-====== got duration ', this.duration);
        console.log("paused", this.duration);
        this.getAndSetCurrentAudioPosition(item);
        //this.audiofile.release();
        //this.setRecordingToPlay();
        clearInterval(get_duration_interval);
      }
    }, 100);
  }


  getAndSetCurrentAudioPosition(item:any) {
    //console.log("get and set current audio position");
    let diff = 1;

    this.positionInterval = setInterval(() => {
      // console.log('interval working of position ');
      let last_position = this.position;
      this.audiofile.getCurrentPosition().then(position => {
        // console.log('nterval working of position, current posiitin:', position);
        if (position >= 0 && position < this.duration) {
          if (Math.abs(last_position - position) >= diff) {
            this.audiofile.seekTo(last_position * 1000);
          } else {
            // update position for display
            this.zone.run(() => {
              this.position = position;
              // console.log('1----------',this.position);
            })

          }
        } else if (position >= this.duration) {
          //this.pauseaudio();
          this.audiofile.stop();
          item.isplayaudio = false;
          this.position = 0;
        }
      });
    }, 100);
  }


  playaudio() {
    console.log("play audio clicked--")
    this.audiofile.play();
    // this.isPlay = true;
  }

  pauseaudio() {
    console.log('pause audio clicked ');
    this.audiofile.pause();
    // this.isPlay = false;
  }



  getMMSS(time: any) {
    var Sec = parseInt(time);
    var returnString = "";
    var hour = Math.floor(Sec / 3600);
    var minute: any;
    var seconds: any;
    minute = Math.floor(Sec / 60);
    if (minute < 10) {
      minute = "0" + minute;
    }
    seconds = Sec % 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (hour > 0) {
      returnString = hour + ":";
    }
    returnString = returnString + minute + ":" + seconds;
    return returnString;
  }


  resetPlayer() {
   
    this.duration = -1;
    this.filepath='';
    // this.isPlay = false;
    console.log('this.audiofile-------- in ProfilePlayerProvieder',this.audiofile);
    if(this.audiofile &&  this.isLoaded == true){
      this.audiofile.stop();
      this.audiofile.release();
    }
    this.isLoaded = false;
    this.position = 0;
    clearInterval(this.positionInterval);
  }

}
