import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public auth:AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  terms(){
  }
  privacy(){
    this.navCtrl.push('PrivacyPage')
  }
  contact(){
    this.navCtrl.push('ContactPage')
  }
  login(){
    this.navCtrl.push('PreloginPage')
  }
  blocked(){
    this.navCtrl.push('BlocklistPage')
  }
  language(){
    const modal = this.modalCtrl.create('LanguagePage',{},{cssClass:'moremodel', showBackdrop:true, enableBackdropDismiss:true});
     modal.present();
  }
}
