import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { EncryptProvider } from './../../providers/encrypt/encrypt';
import { SignupPage } from './../signup/signup';
import { ForgotPage } from './../forgot/forgot';
// import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AES256 } from '@ionic-native/aes-256';
import { Platform } from 'ionic-angular/platform/platform';

import { FacebookProvider } from './../../providers/facebook/facebook';
import { TranslateService } from '@ngx-translate/core';
import { TabsPage } from './../tabs/tabs';
import { AuthProvider } from './../../providers/auth/auth';
import { GooglePlusProvider } from './../../providers/google-plus/google-plus';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
/**
 * Generated class for the LoginPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-popup',
  templateUrl: 'login-popup.html',
})
export class LoginPopupPage {
  loginForm: any;
  constructor(public navCtrl: NavController,
    public viewCtrl:ViewController,
    // public navParams: NavParams,
    public api: RestApiProvider, public alert: AlertProvider,
    public auth: AuthProvider,
    public formBuilder: FormBuilder,
    public translateService: TranslateService,
    public encrypt: EncryptProvider,
    public google: GooglePlusProvider,
    public plt: Platform,
    public facebook:FacebookProvider,
    public events:Events,
    public navParams: NavParams) {
      this.loginForm = this.formBuilder.group({
        email: [null, Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), Validators.required])],
        password: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9]{6,20}'), Validators.required])],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPopupPage');
  }


  close() {
    this.viewCtrl.dismiss();
  }

  get() {
    console.log(this.loginForm);
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
    this.navCtrl.push('ForgotPage',{Email: this.loginForm.controls.email.value });
  }

  signup() {
    this.navCtrl.push('SelectPage');
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 150);
  }

  login2() {
    // if (this.plt.is('cordova')) {
      this.encrypt.getEncryptedData2(this.loginForm.controls.password.value).then((r: any) => {
        let data = {
          "email": { "value": this.loginForm.controls.email.value, "type": "EMAIL" },
          "password": { "value":r, "type": "NO" },
        }
        this.api.postData(data, 0, 'login').then((res: any) => {
          if (res.status == 1) {
            this.auth.updateUserDetails(res.data);
            localStorage.removeItem('guest');
            // this.alert.show("Alert!", res.message);
            // this.navCtrl.pop();
            this.events.publish('LoggedIn');
            setTimeout(() => {
              this.viewCtrl.dismiss(true);
            }, 150);
            if (res.data.email_verified == 1) {
              window.location.href='';
              setTimeout(() => {
                this.navCtrl.setRoot(TabsPage);                
              }, 500);
            } else {
              window.location.href='';
              setTimeout(() => {
                this.navCtrl.push('VerifyPage');                
              }, 150);
            }
          }
          else {
            this.alert.show(this.translateService.instant('ALERT'), res.message);
          }
        })

      })

    // } else {
    //   let data = {
    //     "email": { "value": this.loginForm.controls.email.value, "type": "EMAIL" },
    //     "password": { "value": this.loginForm.controls.password.value, "type": "NO" },
    //   }
    //   this.api.postData(data, 0, 'login').then((res: any) => {
    //     if (res.status == 1) {
    //       localStorage.removeItem('guest');
    //       // this.alert.show("Alert!", res.message);
    //       // this.navCtrl.pop();
    //       this.auth.updateUserDetails(res.data);
    //       if (res.data.email_verified == 1) {
    //         this.navCtrl.setRoot(TabsPage);
    //       } else {
    //         this.navCtrl.push('VerifyPage');
    //       }
    //     }
    //     else {
    //       this.alert.show(this.translateService.instant('ALERT'), res.message);
    //     }
    //   })
    // }
  }


  fbLogin() {
    if (this.plt.is('cordova')) {
      this.facebook.login().then((res: any) => {
        console.log('Fb res--------------------------', res);
        if (res) {
          // this.imageP.imgURLtoURI(res.profilepic).then((base64: any) => {
          //   this.imageP.imgURItoBlobR(base64).then((blob: any) => {
          //     console.log('final blob-----',blob);

              //this.blob_img=blob;
              this.socialLogin(res, 'fb');
          //   });
          // });
        }
      });
    } else {
      let k = {
        email: 'a@gmail.com',
        fname: 'a',
        lname: 'b',
        id: '123456789'
      }
      this.socialLogin(k, 'fb');
    }
  }


  googleLogin() {
    if (this.plt.is('cordova')) {
      this.google.login().then((res: any) => {
        if (res) {
          this.socialLogin(res, 'google');
        }
      });
    } else {
      let k = {
        email: 'a@gmail.com',
        fname: 'a',
        lname: 'b',
        id: '123456789'
      }
      this.socialLogin(k, 'fb');
    }
  }


  socialLogin(k: any, type: any) {
    let Data = {
      email: { "value": k.email, "type": "NO" },
      first_name: { "value": k.fname + ' ' + k.lname, "type": "NO" },
    }
    let SignUpDetail = {
      LoginType: '',
      Fname: k.fname,
      Lname: k.lname,
      Email: k.email
    }
    if (type == 'google') {
      Data['GmailID'] = { "value": k.id, "type": "NO" };
      Data['LoginType'] = { "value": 'Googleplus', "type": "NO" };
      SignUpDetail.LoginType = 'Googleplus';
      SignUpDetail['ID'] = { value: k.id, name: 'GmailID' };
    }
    if (type == 'fb') {
      Data['FacebookID'] = { "value": k.id, "type": "NO" };
      Data['LoginType'] = { "value": 'Facebook', "type": "NO" };
      SignUpDetail.LoginType = 'Facebook';
      SignUpDetail['ID'] = { value: k.id, name: 'FacebookID' };
    }
    if (type == 'instagram') {
      Data['InstaID'] = { "value": k.id, "type": "NO" };
      Data['LoginType'] = { "value": 'Instagram', "type": "NO" };
      SignUpDetail.LoginType = 'Instagram';
      SignUpDetail['ID'] = { value: k.id, name: 'InstaID' };
    }
    if (type == 'tiktok') {
      Data['TiktokID'] = { "value": k.id, "type": "NO" };
      Data['LoginType'] = { "value": 'Tiktok', "type": "NO" };
      SignUpDetail.LoginType = 'Tiktok';
      SignUpDetail['ID'] = { value: k.id, name: 'TiktokID' };
    }
    this.api.postData(Data, 0, 'SocialLogin').then((result: any) => {
      console.log(result);
      this.google.googlePlus.logout().then(r => {
        console.log('google Logout---------', r);

      }).catch(e => {
        console.log('google Logout Error---------', e);

      });
      if (result.status == 2) {
        this.navCtrl.push('SelectPage', { SignupData: SignUpDetail ,is_social:1});
      } else if (result.status == 1) {
        localStorage.removeItem('guest');
        this.auth.updateUserDetails(result.user);
        setTimeout(() => {
          this.viewCtrl.dismiss();
        }, 150);
        this.navCtrl.setRoot(TabsPage);
        this.events.publish('LoggedIn');
      } else {
        this.alert.presentToast(result.message,'buttom');
      }
    })
  }

  login() {
    
    this.navCtrl.push('LoginPage');
    // this.navCtrl.push(SelectPage);
  }
  privacy() {
    this.navCtrl.push('PrivacyPage', { Type: 'privacy' })
  }
  terms() {
    this.navCtrl.push('PrivacyPage', { Type: 'terms' })
  }

}
