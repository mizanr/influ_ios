import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-hired-by',
  templateUrl: 'hired-by.html',
})
export class HiredByPage {
  detail: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
    this.detail = navParams.get('company');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HiredByPage');
  }

}
