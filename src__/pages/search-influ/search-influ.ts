import { FilterInfluPage } from './../filter-influ/filter-influ';
import { AlertProvider } from './../../providers/alert/alert';
import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-search-influ',
  templateUrl: 'search-influ.html',
})
export class SearchInfluPage {
  influs: any = [];
  noData = false;
  filter = {
    keywords: '',
    country: {
      id: "",
      nicename: ""
    },
    category: '',
    reviews: '',
    age: '',
    gender: '',
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public auth: AuthProvider,
    public alert: AlertProvider) {
    this.getTopInflu();
  }
  // getItems(ev) {
  //   if (ev.target.value.length != '') {
  //     this.getTopInflu(ev.target.value);
  //   } else {
  //     this.influs = []
  //   }
  // }

  profile(id) {
    this.navCtrl.push('InfluencerProfilePage', { InfluId: id });
  }


  getTopInflu() {
    let data = {
      "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "keywords": { "value": this.filter.keywords, "type": "NO" },
      "category": { "value": this.filter.category, "type": "NO" },
      "gender": { "value": this.filter.gender, "type": "NO" },
      "country": { "value": this.filter.country.id, "type": "NO" },
      "age": { "value": this.filter.age, "type": "NO" },
    }
    this.api.postData(data, 0, 'getTopInflu').then((res: any) => {
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

  openFilter() {
    let modal = this.api.modalCtrl.create('FilterInfluPage', { Filter: this.filter });
    modal.onDidDismiss((data: any) => {
      if (data) {
        this.filter = data;
        this.getTopInflu();
      }
    });
    modal.present();
  }
}
