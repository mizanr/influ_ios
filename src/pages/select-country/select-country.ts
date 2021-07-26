import { AuthProvider } from './../../providers/auth/auth';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-select-country',
  templateUrl: 'select-country.html',
})
export class SelectCountryPage {
  @ViewChild('searchinput') searchinput;
  countrylist = [];
  searchList = [];
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public auth: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectCountryPage');
    this.countrylist = this.navParams.get('countries');
    this.searchList = Object.assign([], this.countrylist);
  }

  ionViewDidEnter() {
    setTimeout(() => {
      let m: any = document.getElementsByClassName('searchbar-input');
      if (m[0]) {
        m[0].focus();
      }
    }, 500)
  }


  getItems(val) {
    if (val) {
      this.searchList = this.countrylist.filter(a => {
        if (!a.name) return false;
        return a.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
    else {
      this.searchList = Object.assign([], this.countrylist);
    }
  }


}
