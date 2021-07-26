import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {
  content = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider,
    public api: RestApiProvider) {
    this.getpolicy();
  }

  getpolicy() {
    let l = '';
    if (this.navParams.get('Type') == 'terms') {
      l = 'terms_condition'
    } else {
      l = 'privacy_policy'
    }
    let data = {
    }
    this.api.postData(data, 0, l).then((res: any) => {
      if (res.status == 1) {
        this.content=res.data[0].details
      }
      else {
      }
    })
  }

}
