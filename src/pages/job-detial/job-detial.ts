import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the JobDetialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-job-detial',
  templateUrl: 'job-detial.html',
})
export class JobDetialPage {
  detail: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public auth: AuthProvider,
    public alert:AlertProvider,
    public trans:TranslateService) {
  }

  ionViewWillEnter() {
    this.getJob()
  }

  getJob() {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
      "job_id": this.navParams.get('JobId'),
    }
    this.api.get(data, 1, 'GetJobById').then((res: any) => {
      if (res.status == 1) {
        // this.categories = res.data
        this.detail = res.data[0];
        // this.influServiceFee = res.influ_service_fee;
        // this.influeServiceInPercent = res.influ_service_fee_percent
      }
      else {
      }
    })
  }

  edit(i) {
    this.navCtrl.push('AddJobPage', { EditId: i })
  }

  openApplied(i) {
    this.navCtrl.push('AppliedInfluencerPage', { JobId: i })
  }

  deleteJob(i) {
    this.alert.confirmationAlert(this.trans.instant('ALERT'), this.trans.instant('DO_YOU_WANT_TO_DELETE_THIS_JOB_POST')).then(r => {
      if (r) {
        let data = {
          "id": { "value": i, "type": "NO" },
        }
        this.api.postData(data, 0, 'DeleteJob').then((res: any) => {
          if (res.status == 1) {
            this.navCtrl.pop();
          }
          else {
          }
        })
      }
    })
  }

  
  send(obj) {
    let profileModal = this.api.modalCtrl.create('SendMessagePage', { JobTitle: obj.title }, { cssClass: "mymodal" });
    profileModal.onDidDismiss(data => {
      if (data) {
        this.sendMsg(obj, data)
      }
    });
    profileModal.present();
  }


  sendMsg(obj, m) {
    let Data = {
      JobId: { "value": obj.Id, "type": "NO" },
      sender: { "value": this.auth.getCurrentUserId(), "type": "NO" },
      receiver: { "value": obj.created_by.id, "type": "NO" },
      message: { "value": m, "type": "MSG" },
      msg_type: { "value": 'text', "type": "NO" },
    }
    this.api.postData(Data, 0, 'SendMessage').then((result: any) => {
      console.log(result);
      if (result.status == 1) {
        this.apply(obj);
      } else {
      }
    })
  }

  
  apply(obj) {
    obj.applied_status = 1;
    let data = {
      "apply_by": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "jobId": { "value": obj.Id, "type": "NO" },
    }
    this.api.postData(data, 1, 'applyJob').then((res: any) => {
      if (res.status == 1) {
      }
      else {
        obj.applied_status = 0;
      }
    })

  }

  
  message(obj) {
    this.navCtrl.push('ChatDetailsPage', { JobId: obj.Id, ReceiverId: obj.created_by.id })
  }

}
