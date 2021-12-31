import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { JobDetialPage } from '../job-detial/job-detial';


@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  notiList = [];
  noData = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider,
    public event:Events,
    public api: RestApiProvider) {
    this.getNotifications();
  }

  getNotifications() {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
    }
    this.api.get(data, 1, 'get_notification').then((result: any) => {
      if (result.status == 1) {
        this.notiList = result.data;
        this.unread();
      }
      else {
        this.notiList = [];
      }
      if (this.notiList.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
    })

  }

  unread() {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
    }
    this.api.get(data, 0, 'make_as_read_notification').then((result: any) => {
      this.auth.unread_noti = 0;
    })
  }

  open(data) {
    // if(data.screen=='jobdetail'){
    //     this.navCtrl.push(JobDetialPage,{JobId:data.jobid});
    // }

    if(data.screen=='rate'){
      setTimeout(() => {
        this.auth.influ_tab_type='Reviews';
        this.event.publish('SelectTab',3);
      }, 500);
    }

    if(data.screen=="job_complete"){
      this.navCtrl.push('PostDetailPage',{PostId:data.postId});
  }

  if(data.screen=="job_done"){
    this.navCtrl.push('JobDetialPage',{JobId:data.postId});
  }

    if(data.screen=="job_hired"){
        this.navCtrl.push('HiredListPage',{service_id:data.postId});
    }

    if(data.screen=='withdrawal_request'){
        this.navCtrl.push('WalletPage');
    }

    if (data.screen == 'ChatDetailsPage') {
      setTimeout(() => {
        // this.navCtrl.push('ChatDetailsPage', { JobId: data.JobId, ReceiverId: data.receiver });
      }, 700)
    } else if (data.screen == 'InfluencerProfile') {

      // this.navCtrl.push('JobDetialPage', { JobId: data.jobId });

      this.navCtrl.push('AppliedInfluencerPage', { JobId: data.jobId });
      
      // setTimeout(() => {
      //   this.navCtrl.push('InfluencerProfilePage', { InfluId: data.InfluId });
      // }, 700)
    }
  }
}
