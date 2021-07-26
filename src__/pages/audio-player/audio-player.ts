import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AuthProvider } from './../../providers/auth/auth';
import { MediaProvider } from './../../providers/media/media';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

@IonicPage()

@Component({
  selector: 'page-audio-player',
  templateUrl: 'audio-player.html',
})
export class AudioPlayerPage {
  detail: any;
  isLoaded = false;
  constructor(
    public navCtrl: NavController,
    public media: MediaProvider,
    public auth: AuthProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AudioPlayerPage');
    this.detail = this.navParams.get("detail");
    this.media.filepath = this.auth.mediaLink + this.detail.message;
    this.media.fromserver();
    console.log(this.detail);
  }

}
