import { GooglePlusProvider } from './../../providers/google-plus/google-plus';
import { TranslateService } from '@ngx-translate/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AuthProvider } from './../../providers/auth/auth';
import { AlertProvider } from './../../providers/alert/alert';
// import { VerifyModalPage } from './../verify-modal/verify-modal';
import { TabsPage } from './../tabs/tabs';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, Events, IonicPage } from 'ionic-angular';
// import { LoginPage } from '../login/login';
// import { ResetPasswordPage } from '../reset-password/reset-password';
@IonicPage()
@Component({
  selector: 'page-verify',
  templateUrl: 'verify.html',
})
export class VerifyPage {
  // @ViewChild(Content) content: Content;
  @ViewChild('one') one;
  @ViewChild('two') two;
  @ViewChild('three') three;
  @ViewChild('four') four;
  @ViewChild('five') five;
  @ViewChild('six') six;
  formdata = {
    first: '',
    second: '',
    third: '',
    fourth: '',
    fifth: '',
    sixth: '',
  }
  type: any;
  phone: any;
  code: any;
  email: any = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public auth: AuthProvider,
    public viewCtrl: ViewController,
    public alert: AlertProvider,
    public events: Events,
    public trans: TranslateService,
    public google: GooglePlusProvider) {
    this.email = this.navParams.get('Email');
  }

  ionViewWillEnter() {
    this.api.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.api.menuCtrl.enable(true);
  }

  onKeyUp(ev, id) {
    console.log(ev);
    if (ev != 8) {
      if (id == 'one') {
        this.two.setFocus();
      } else if (id == 'two') {
        this.three.setFocus();
      } else if (id == 'three') {
        this.four.setFocus();
      }
    } else {
      if (id == 'two') {
        this.one.setFocus();
      } else if (id == 'three') {
        this.two.setFocus();
      } else if (id == 'four') {
        this.three.setFocus();
      }
    }

  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  verify() {
    let data = {
      "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "token": { "value": this.formdata.first + this.formdata.second + this.formdata.third + this.formdata.fourth + this.formdata.fifth + this.formdata.sixth, "type": "NO" },
    }
    this.api.postData(data, 0, 'verifyUser').then((res: any) => {
      if (res.status == 1) {
        this.google.googlePlus.logout().then(r => {
          console.log('google Logout---------', r);

        }).catch(e => {
          console.log('google Logout Error---------', e);

        });
        this.navCtrl.setRoot(TabsPage);
        this.auth.updateUserDetails(res.data);
        this.events.publish('LoggedIn');
      }
      else {
        this.alert.show("Alert!", res.message);
      }
    })
  }

  resend() {
    let data = {
      "user_id": this.auth.getCurrentUserId()
    }
    this.api.get(data, 1, 'resend_otp').then((res: any) => {
      if (res.status == 1) {
        this.alert.show("Alert!", res.message);
      }
      else {
        this.alert.show("Alert!", res.message);
      }
    })
  }

  logout() {
    this.auth.logout();
  }

  verifyandsubmit() {
    let data = {
      "email": { "value": this.email, "type": "NO" },
      "token": { "value": this.formdata.first + this.formdata.second + this.formdata.third + this.formdata.fourth + this.formdata.fifth + this.formdata.sixth, "type": "NO" },
    }
    this.api.postData(data, 0, 'verify_forgot').then((res: any) => {
      if (res.status == 1) {
        this.navCtrl.push('CreatePasswordPage', { Email: this.email });
      }
      else {
        this.alert.show("Alert!", res.message);
      }
    })
  }

  forgot() {
    let data = {
      "email": { "value": this.email, "type": "EMAIL" },
    }
    this.api.postData(data, 0, 'forget_password').then((res: any) => {
      if (res.status == 1) {
        // this.navCtrl.pop();
        this.alert.show(this.trans.instant('ALERT'), this.trans.instant('VERIFICATION_IS_RESENT_TO_YOUR_EMAIL'));
      }
      else {
      }
    })
  }
}
