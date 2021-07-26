import { AlertProvider } from './../../providers/alert/alert';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';

import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { AuthProvider } from '../../providers/auth/auth';
@IonicPage()
@Component({
  selector: 'page-text-modal',
  templateUrl: 'text-modal.html',
})
export class TextModalPage {
  msg: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public api: RestApiProvider, public auth: AuthProvider, public alert: AlertProvider) {
  }
  cancel() {

    this.viewCtrl.dismiss();
  }

  done() {
    let data = {
      "post_id": { "value": this.navParams.get('PostId'), "type": "NO" },
      "message": { "value": this.msg, "type": "MSG" },
      "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" },
    }
    this.api.postData(data, 0, 'report').then((res: any) => {
      this.viewCtrl.dismiss();
      if (res.status == 1) {
        this.alert.show("Alert!", res.message);
      }
      else {
      }
    })

  }


}
