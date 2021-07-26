import { EncryptProvider } from './../../providers/encrypt/encrypt';
import { TranslateService } from '@ngx-translate/core';
import { SelectPage } from './../select/select';
import { VerifyPage } from './../verify/verify';
import { AuthProvider } from './../../providers/auth/auth';
import { TabsPage } from './../tabs/tabs';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { SignupPage } from './../signup/signup';
import { ForgotPage } from './../forgot/forgot';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AES256 } from '@ionic-native/aes-256';
import { Platform } from 'ionic-angular/platform/platform';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // email: any = '';
  // password: any = '';
  loginForm: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider, public alert: AlertProvider,
    public auth: AuthProvider,
    public formBuilder: FormBuilder,
    public translateService: TranslateService,
    public encrypt: EncryptProvider,
    public plt: Platform,
    public events:Events) {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), Validators.required])],
      password: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9]{6,20}'), Validators.required])],
    });

  }


  get() {
    console.log(this.loginForm);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  keep(i) {
    return JSON.parse(i)
  }

  ionViewWillEnter() {
    this.api.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.api.menuCtrl.enable(true);
  }

  forgot() {
    this.navCtrl.push('ForgotPage', { Email: this.loginForm.controls.email.value });
  }

  signup() {
    this.navCtrl.push('SelectPage');
  }

  login() {
    if (this.plt.is('cordova')) {
      this.encrypt.getEncryptedData(this.loginForm.controls.password.value).then((r: any) => {
        let data = {
          "email": { "value": this.loginForm.controls.email.value, "type": "EMAIL" },
          "password": { "value": r.trim(), "type": "NO" },
        }
        this.api.postData(data, 0, 'login').then((res: any) => {
          if (res.status == 1) {
            // this.alert.show("Alert!", res.message);
            // this.navCtrl.pop();
            this.events.publish('LoggedIn');
            this.auth.updateUserDetails(res.data);
            if (res.data.email_verified == 1) {
              this.navCtrl.setRoot(TabsPage);
            } else {
              this.navCtrl.push('VerifyPage');
            }
          }
          else {
            this.alert.show(this.translateService.instant('ALERT'), res.message);
          }
        })

      })

    } else {
      let data = {
        "email": { "value": this.loginForm.controls.email.value, "type": "EMAIL" },
        "password": { "value": this.loginForm.controls.password.value, "type": "NO" },
      }
      this.api.postData(data, 0, 'login').then((res: any) => {
        if (res.status == 1) {
          // this.alert.show("Alert!", res.message);
          // this.navCtrl.pop();
          this.auth.updateUserDetails(res.data);
          if (res.data.email_verified == 1) {
            this.navCtrl.setRoot(TabsPage);
          } else {
            this.navCtrl.push('VerifyPage');
          }
        }
        else {
          this.alert.show(this.translateService.instant('ALERT'), res.message);
        }
      })
    }
  }

}
