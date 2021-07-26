import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-request-list',
  templateUrl: 'request-list.html',
})
export class RequestListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestListPage');
  }

}
