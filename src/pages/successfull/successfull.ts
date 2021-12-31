import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-successfull',
  templateUrl: 'successfull.html',
})
export class SuccessfullPage {
type:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.type=navParams.data.type || 0;

    console.log(this.type);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessfullPage');
  }

  closemodal(){
    this.viewCtrl.dismiss();
  }

}
