import { FacebookProvider } from './../../providers/facebook/facebook';
import { TranslateService } from '@ngx-translate/core';
import { TabsPage } from './../tabs/tabs';
import { AuthProvider } from './../../providers/auth/auth';
import { GooglePlusProvider } from './../../providers/google-plus/google-plus';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
// import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, IonicPage, Events } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-prelogin',
  templateUrl: 'prelogin.html',
})
export class PreloginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public alert: AlertProvider,
    public google: GooglePlusProvider,
    public plt: Platform,
    public facebook:FacebookProvider,
    public auth: AuthProvider,
    public translate: TranslateService,
    public events:Events) {
  }

  ionViewWillEnter() {
    this.api.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.api.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
    // this.google.silentLogin().then(r => {
    //   if (r == 1) {
    //     this.google.googlePlus.logout().then(r => {
    //       console.log('google Logout---------', r);

    //     }).catch(e => {
    //       console.log('google Logout Error---------', e);

    //     });
    //   }
    // });   
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
      Email: k.email,
      profile_img_url:k.profilepic,
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
        this.navCtrl.push('SelectPage', { SignupData: SignUpDetail,is_social:1 });
      } else if (result.status == 1) {
        localStorage.removeItem('guest');
        this.auth.updateUserDetails(result.user);
        this.navCtrl.setRoot(TabsPage);
        this.events.publish('LoggedIn');
      } else {
        this.alert.presentToast(result.message,'buttom');
      }
    })
  }

  login() {
    this.navCtrl.push('LoginPage')
    // this.navCtrl.push(SelectPage);
  }
  privacy() {
    this.navCtrl.push('PrivacyPage', { Type: 'privacy' })
  }
  terms() {
    this.navCtrl.push('PrivacyPage', { Type: 'terms' })
  }

  guest() {
    this.navCtrl.push('SelectPage',{type:'guest'});
  }

}
