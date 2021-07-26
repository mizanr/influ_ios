import { AuthProvider } from './../../providers/auth/auth';
import { EditProfilePage } from './../edit-profile/edit-profile';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider) {
  }
  ionViewWillEnter() {
    this.user = this.auth.getUserDetails();
  }
  opneEdit() {
    this.navCtrl.push('EditProfilePage')
  }

}
