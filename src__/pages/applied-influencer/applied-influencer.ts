import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-applied-influencer',
  templateUrl: 'applied-influencer.html',
})
export class AppliedInfluencerPage {
  influs = [];
  noData = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider,
    public api: RestApiProvider) {
    this.getinflus()
  }


  getinflus() {
    let data = {
      "id": { "value": this.navParams.get('JobId'), "type": "NO" },
    }
    this.api.postData(data, 0, 'applied_influs').then((res: any) => {
      if (res.status == 1) {
        this.influs = res.data;
      }
      else {
        this.influs = [];
      }
      if (this.influs.length == 0) {
        this.noData = true
      } else {
        this.noData = false
      }
    })
  }


  profile(id, pId) {
    this.navCtrl.push('InfluencerProfilePage', { InfluId: id, PostId: pId });
  }

  chat(id) {
    this.navCtrl.push('ChatDetailsPage', { JobId: this.navParams.get('JobId'), ReceiverId: id })
  }
}
