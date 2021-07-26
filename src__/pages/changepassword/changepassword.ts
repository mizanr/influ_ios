import { EncryptProvider } from './../../providers/encrypt/encrypt';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertProvider } from '../../providers/alert/alert';
@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  old_pass: any = '';
  new_pass: any = '';
  confirmP: any = '';
  constructor(public navCtrl: NavController, public rest_api: RestApiProvider,
    public auth: AuthProvider, public alertP: AlertProvider,
    public navParams: NavParams,
    public restApi: RestApiProvider,
    public encrypt: EncryptProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }

  pass() {
    let reg = /^[a-zA-Z0-9]{6,20}$/;
    if (this.old_pass == '') {
      this.alertP.showEmptyMessage('CPASS');
      return
    }
    if (this.new_pass == '') {
      this.alertP.showEmptyMessage('PASSW');
      return
    }
    if (reg.test(this.new_pass) == false) {
      this.alertP.showMessage('PASSW');
      return;
    }
    if (this.confirmP == '') {
      this.alertP.showEmptyMessage('CONFP');
      return
    }
    if (this.new_pass != this.confirmP) {
      this.alertP.showMessage('CONFP');
      return
    }


    let Data = {
      user_id: { "value": this.auth.getCurrentUserId(), "type": "NO" },
      current_password: { "value": this.old_pass, "type": "NO" },
      password: { "value": this.new_pass, "type": "NO" },
      confirmP: { "value": this.confirmP, "type": "NO" },
    }

    this.encrypt.getEncryptedData(this.old_pass).then((cP: any) => {
      this.encrypt.getEncryptedData(this.new_pass).then((newP: any) => {
        Data['current_password'].value = cP.trim();
        Data['password'].value = newP.trim();
        this.rest_api.postData(Data, 1, 'change_password').then((result: any) => {
          console.log(result);
          if (result.status == 1) {
            this.navCtrl.pop();
          } else {
          }
        })

      })
    })

  }

}
