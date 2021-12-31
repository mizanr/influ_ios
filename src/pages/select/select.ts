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
type:any;
is_social:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events,
    public api: RestApiProvider,
    public translate: TranslateService) {
      this.type=navParams.data.type || '';
      this.is_social=navParams.data.is_social||0;
  }

  ionViewWillEnter() {
    this.api.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.api.menuCtrl.enable(true);
  }
  influencer() {
    if(this.type=='guest'){
      localStorage.setItem('guest',JSON.stringify(2));
      this.navCtrl.setRoot(TabsPage);
    } else {
      this.navCtrl.push('SignupPage', { Type: 2, SignupData: this.navParams.get('SignupData') ,is_social:this.is_social});
    }
    // this.event.publish('dashboardselect3ed', 1);
  }

  company() {
    if(this.type=='guest'){
      localStorage.setItem('guest',JSON.stringify(1));
      this.navCtrl.setRoot(TabsPage);
    } else {
      this.navCtrl.push('SignupPage', { Type: 1, SignupData: this.navParams.get('SignupData') ,is_social:this.is_social });
    }
    // this.event.publish('dashboardselect3ed', 0);
  }


}
