import { AuthProvider } from './../../providers/auth/auth';

import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-filter-influ',
  templateUrl: 'filter-influ.html',
})
export class FilterInfluPage {
  filter: any;
  countries: any;
  categories: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public api: RestApiProvider,
    public auth:AuthProvider) {
    this.getCategory();
    this.filter = this.navParams.get('Filter');
  }

  openModal() {
    let modal = this.api.modalCtrl.create('SelectCountryPage', { countries: this.countries });
    modal.onDidDismiss((data: any) => {
      if (data) {
        this.filter.country.id = data.id;
        this.filter.country.nicename = data.nicename;
        console.log(data);
      }
    });
    modal.present();
  }

  getCategory() {
    let data = {
    }
    this.api.postData(data, 0, 'category').then((res: any) => {
      if (res.status == 1) {
        this.categories = res.data;
        this.getCodes();
      }
      else {
      }
    })
  }



  getCodes() {
    let data = {
      // "email": { "value": this.formData.email, "type": "NO" },
    };
    this.api.get(data, 0, 'country').then((result: any) => {
      if (result.status == "0") {
        // this.alertP.show("", result.message);
      } else {
        this.countries = result.data;
        // this.getDeviceCountry()
        // let k = this.countries.filter(a => {
        //   if (a.id == 226) {
        //     return a;
        //   }
        // });
        // console.log(k);
        // this.formData.country_code = k[0].phonecode;
        // this.formData.countryFlag = k[0].image;
      }
    }, (err) => {
    });
  }

  reset() {
    this.filter = {
      name: '',
      country: {
        id: "",
        nicename: ""
      },
      category: '',
      reviews: '',
      age: '',
      gender: '',
      post_type:''
    }
  }
}
