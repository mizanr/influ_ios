import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { AddjobInfluPage } from './../addjob-influ/addjob-influ';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-my-post',
  templateUrl: 'my-post.html',
})
export class MyPostPage {
  jobs: any = [];
  noData = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider,
    public api: RestApiProvider,
    public alert: AlertProvider,
    public trans: TranslateService) {
  }

  ionViewWillEnter() {
    this.getJob();
  }

  getJob() {
    let data = {
      "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" },
    }
    this.api.postData(data, 0, 'GetServicesList').then((res: any) => {
      if (res.status == 1) {
        this.jobs = res.data;
      }
      else {
        this.jobs = [];
      }
      if (this.jobs.length == 0) {
        this.noData = true
      } else {
        this.noData = false
      }
    })
  }

  deleteJob(i) {
    this.alert.confirmationAlert(this.trans.instant('ALERT'),this.trans.instant('DO_YOU_WANT_TO_DELETE_THIS_SERVICE') ).then(r => {
      if (r) {
        let data = {
          "id": { "value": i, "type": "NO" },
        }
        this.api.postData(data, 0, 'DeleteJob').then((res: any) => {
          if (res.status == 1) {
            this.getJob();
          }
          else {
          }
        })
      }
    })
  }

  edit(i) {
    this.navCtrl.push('AddjobInfluPage', { EditId: i })
  }

  detail(id) {
    // let profileModal = this.modalCtrl.create('PostDetailPage', { PostId: id }, { cssClass: "alertModal", enableBackdropDismiss: true, showBackdrop: true });
    // profileModal.present();
    this.navCtrl.push('PostDetailPage', { PostId: id });
  }
}
