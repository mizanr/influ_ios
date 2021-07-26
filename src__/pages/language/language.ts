import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {
  lang: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public auth: AuthProvider) {
    this.lang = this.auth.getUserLanguage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
  }

  closemodal() {
    this.viewCtrl.dismiss();
  }
  onChange() {
    if (this.lang == 'en') {
      this.auth.updateUserLanguage('en');
      window.location.href = '';
    } else {
      this.auth.updateUserLanguage('he');
      window.location.href = '';
    }
  }
}
