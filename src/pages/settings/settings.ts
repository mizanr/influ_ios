
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, IonicPage } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
is_noti:any=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,public api:RestApiProvider,
    public auth:AuthProvider) {
      this.is_noti=this.auth.getUserDetails().is_noti==1?true:false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  terms(){
    this.navCtrl.push('PrivacyPage',{Type:'terms'});
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

  noti_event(ev:any) {
    console.log(this.is_noti);
    let Data = {
      user_id:{ "value": this.auth.getCurrentUserId(), "type": "NO" },
      is_noti:{value:this.is_noti?1:0,type:'NO'},
    }
    this.api.postData(Data, 0, 'edit_profile').then((res: any) => {
      if (res.status == 1) {
        this.auth.updateUserDetails(res.data);
      }
      else {
      }
    })
  }
}
