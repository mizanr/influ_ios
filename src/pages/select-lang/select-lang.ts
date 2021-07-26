import { AuthProvider } from './../../providers/auth/auth';
import { TranslateService } from '@ngx-translate/core';
import { PreloginPage } from './../prelogin/prelogin';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-select-lang',
  templateUrl: 'select-lang.html',
})
export class SelectLangPage {
  slectedL = 'english';
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public translateService: TranslateService,
    public auth: AuthProvider
  ) {
  }
  next() {
    console.log();

    if (this.slectedL == 'english') {
      this.translateService.setDefaultLang('en');
      this.auth.updateUserLanguage('en');
      window.location.href=''
    } else {
      this.translateService.setDefaultLang('he');
      this.auth.updateUserLanguage('he');
      window.location.href=''
    }
  }
}
