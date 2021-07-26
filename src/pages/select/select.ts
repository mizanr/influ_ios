import { TranslateService } from '@ngx-translate/core';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { SignupPage } from './../signup/signup';
import { TabsPage } from './../tabs/tabs';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { Events, NavController, NavParams, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
})
export class SelectPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
    public api: RestApiProvider,
    public translate: TranslateService) {
  }

  ionViewWillEnter() {
    this.api.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.api.menuCtrl.enable(true);
  }
  influencer() {
    // this.event.publish('dashboardselect3ed', 1);
    this.navCtrl.push('SignupPage', { Type: 2, SignupData: this.navParams.get('SignupData') });
  }

  company() {
    // this.event.publish('dashboardselect3ed', 0);
    this.navCtrl.push('SignupPage', { Type: 1, SignupData: this.navParams.get('SignupData') });
  }


}
