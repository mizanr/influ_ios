import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-hired-services',
  templateUrl: 'hired-services.html',
})
export class HiredServicesPage {
  services: any = [];
  noData: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public auth: AuthProvider,
    public alert: AlertProvider,
    public translate: TranslateService) {
    // this.getService();
  }

  ionViewWillEnter(){
   this.getService();
  }

  getService() {
    let data = {
      "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" },
    }
    this.api.postData(data, 0, this.auth.getUserDetails().user_type == 1 ? 'HiredByMe' : 'HiredToMe').then((res: any) => {
      if (res.status == 1) {
        this.services = res.data;
      }
      else {
        this.services = [];
      }
      if (this.services.length == 0) {
        this.noData = true
      } else {
        this.noData = false
      }
    })
  }


  profile(id, pId) {
    this.navCtrl.push('InfluencerProfilePage', { InfluId: id, PostId: pId });
  }

  
  postdetail(id) {
    // let profileModal = this.modalCtrl.create('PostDetailPage', { PostId: id }, { cssClass: "alertModal", enableBackdropDismiss: true, showBackdrop: true });
    // profileModal.present();
    this.navCtrl.push('PostDetailPage',{ PostId: id });
  }
}
