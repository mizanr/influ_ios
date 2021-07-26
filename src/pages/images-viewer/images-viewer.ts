import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-images-viewer',
  templateUrl: 'images-viewer.html',
})
export class ImagesViewerPage {
  imgs = [];
  index: any;
  baseUrl: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public auth: AuthProvider) {
    this.imgs = this.navParams.get("imgs");
    this.index = this.navParams.get('index');
    console.log(this.imgs)
  }

}
