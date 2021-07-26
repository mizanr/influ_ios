import { DownloadProvider } from './../providers/download/download';
import { GooglePlusProvider } from './../providers/google-plus/google-plus';
import { RestApiProvider } from './../providers/rest-api/rest-api';
import { OnesignalProvider } from './../providers/onesignal/onesignal';
import { SuccessfullPage } from './../pages/successfull/successfull';

import { AuthProvider } from './../providers/auth/auth';

import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, Events, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PreloginPage } from './../pages/prelogin/prelogin';
import { TabsPage } from '../pages/tabs/tabs';
import { MyPostPage } from '../pages/my-post/my-post';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  lang: any;
  constructor(public platform: Platform, statusBar: StatusBar,
    public translate: TranslateService,
    splashScreen: SplashScreen,
    public event: Events,
    public auth: AuthProvider,
    public actionSheetCtrl: ActionSheetController,
    public onesignal: OnesignalProvider,
    public api: RestApiProvider,
    public google: GooglePlusProvider,
    public download: DownloadProvider) {
    platform.ready().then(() => {
      this.onesignal.init();
      this.onesignal.open.subscribe((data: any) => {
        console.log('Notidata----------', data);

        if (data != 0 && data) {

          if (data.other.screen == 'ChatDetailsPage') {
            setTimeout(() => {
              this.nav.push('ChatDetailsPage', { JobId: data.other.job_id, ReceiverId: data.other.receiver });
            }, 700)
          } else if (data.other.screen == 'InfluencerProfile') {
            setTimeout(() => {
              this.nav.push('InfluencerProfilePage', { InfluId: data.other.influId });
            }, 700)
          }

        }
      });
      this.event.subscribe('LoggedIn', r => {
        this.updateDeviceId();
      });


      this.event.subscribe('LogOut', r => {
        this.removeDeviceId();
      });
      this.lang = this.auth.getUserLanguage();
      console.log(this.lang);
      if (this.lang) {
        this.translate.setDefaultLang(this.lang);
        if (this.lang == 'he') {
          this.platform.setDir('rtl', true);
        }
      } else {
        this.translate.setDefaultLang('en');
      }
      // if (l) {
      //   translate.setDefaultLang(l);
      // } else {
      //   translate.setDefaultLang('en');
      // }
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString('#10b4ed');
      splashScreen.hide();


      if (this.auth.isUserLoggedIn()) {
        if (this.auth.getUserDetails().email_verified == 1) {
          this.rootPage = TabsPage;
          this.updateDeviceId();
          this.google.silentLogin();
          // this.rootPage = 'SuccessfullPage';

        } else {
          this.rootPage = 'VerifyPage';
        }
      } else {

        if (this.lang) {
          this.rootPage = 'PreloginPage'
        } else {
          this.rootPage = 'SelectLangPage'
        }
        // this.rootPage = CreatePasswordPage;
      }
    });

  }

  change() {
    this.nav.push('ChangepasswordPage')
  }
  profile() {
    // this.nav.push(ProfilePage)
    this.event.publish('SelectTab', 3)
  }
  add() {
    // this.nav.push(AddJobPage)
    this.event.publish('SelectTab', 1)
  }
  job() {
    this.nav.push('JobListPage')
  }
  settings() {
    this.nav.push('SettingsPage')
  }
  login() {
    this.nav.push('PreloginPage')
  }

  wallet() {
    this.nav.push('WalletPage');
  }
  addpost() {
    // this.nav.push(AddjobInfluPage)
    this.event.publish('SelectTab', 1)
  }
  jobrequest() {
    this.nav.push('RequestListPage')
  }
  mypost() {
    this.nav.push('MyPostPage')
  }
  openHired() {
    this.nav.push('HiredServicesPage')
  }

  changel() {
    const actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant('CHANGE_LANGUAGE'),
      buttons: [
        {
          text: this.translate.instant('ENGLISH'),
          handler: () => {
            console.log('Destructive clicked');
            this.auth.updateUserLanguage('en');
            window.location.href = '';
          }
        }, {
          text: this.translate.instant('HEBREW'),
          handler: () => {
            console.log('Archive clicked');
            this.auth.updateUserLanguage('he');
            window.location.href = '';
          }
        }, {
          text: this.translate.instant('CANCEL'),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  updateDeviceId() {
    if (this.platform.is('cordova')) {
      this.onesignal.id().then(identity => {
        console.log('-------Device Id----------', identity);
        let Data = {
          user_id: { "value": this.auth.getCurrentUserId(), "type": 'NO' },
          device_id: { "value": identity, "type": 'NO' },
        }
        this.api.postData(Data, 0, 'UpdateDeviceId').then((result: any) => {
          console.log(result);
        })
      })
    }
  }

  removeDeviceId() {
    // if(this.platform.is('cordova')){
    // this.onesignal.id().then(identity => {
    // console.log('-------Device Id----------',identity);
    let Data = {
      user_id: { "value": this.auth.getCurrentUserId(), "type": 'NO' },
      device_id: { "value": '', "type": 'NO' },
    }
    this.api.postData(Data, 0, 'UpdateDeviceId').then((result: any) => {
      console.log(result);
    })
    // })
    // }
  }

}
