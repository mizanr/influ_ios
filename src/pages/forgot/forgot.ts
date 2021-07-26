import { TranslateService } from '@ngx-translate/core';
import { VerifyPage } from './../verify/verify';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  forgotForm: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider,
    public api: RestApiProvider,
    public alert: AlertProvider,
    public formBuilder: FormBuilder,
    public translate: TranslateService) {
    this.forgotForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), Validators.required])],

    });
    this.forgotForm.controls.email.value = navParams.get('Email');
  }


  ionViewWillEnter() {
    this.api.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.api.menuCtrl.enable(true);
  }
  signup() {
    this.navCtrl.pop();
  }

  forgot() {
    let data = {
      "email": { "value": this.forgotForm.controls.email.value, "type": "EMAIL" },
    }
    this.api.postData(data, 0, 'forget_password').then((res: any) => {
      if (res.status == 1) {
        // this.navCtrl.pop();
        this.navCtrl.push('VerifyPage', { Email: this.forgotForm.controls.email.value })
      }
      else {
        this.alert.show(this.translate.instant('ALERT'), res.message);
      }
    })
  }

}
