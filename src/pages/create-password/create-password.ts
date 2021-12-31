import { EncryptProvider } from './../../providers/encrypt/encrypt';
import { LoginPage } from './../login/login';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AlertProvider } from './../../providers/alert/alert';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-create-password',
  templateUrl: 'create-password.html',
})
export class CreatePasswordPage {
  pass: any = ''
  cPass: any = ''
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertP: AlertProvider,
    public api: RestApiProvider,
    public encrypt: EncryptProvider
  ) {
  }

  create() {
    let reg = /^[a-zA-Z0-9]{6,20}$/;
    if (this.pass == '') {
      this.alertP.showEmptyMessage('PASSW');
      return
    }
    if (reg.test(this.pass) == false) {
      this.alertP.showMessage('PASSW');
      return;
    }
    if (this.cPass == '') {
      this.alertP.showEmptyMessage('CONFP');
      return
    }
    if (this.pass != this.cPass) {
      this.alertP.showMessage('CONFP');
      return
    }
    let data = {
      "password": { "value": this.pass, "type": "NO" },
      "confirmP": { "value": this.cPass, "type": "NO" },
      "email": { "value": this.navParams.get('Email'), "type": "NO" }
    }
    this.encrypt.getEncryptedData2(this.pass).then((r: any) => {
      data["password"].value =r;
      console.log('new password-------', r, '-------');

      this.api.postData(data, 1, 'create_password').then((res: any) => {
        if (res.status == 1) {
          // this.navCtrl.popTo('LoginPage');
          this.navCtrl.getViews().forEach(element => {
            if (element.name == 'LoginPage') {
              this.navCtrl.popTo(element);
            }
          });
        }
        else {
        }
      })
    })

  }

}
