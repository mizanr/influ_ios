import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-successfull',
  templateUrl: 'successfull.html',
})
export class SuccessfullPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessfullPage');
  }

  closemodal(){
    this.viewCtrl.dismiss();
  }

}
