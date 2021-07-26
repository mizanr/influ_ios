import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html',
})
export class PostDetailPage {
  detail: any = '';
  influServiceFee: any;
  influeServiceInPercent: any;
  hiredStatus: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public auth: AuthProvider, public api: RestApiProvider,
    public alert: AlertProvider,
    public trans: TranslateService) {

  }
  ionViewWillEnter() {
    this.getPost()
  }

  getPost() {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
      "job_id": this.navParams.get('PostId'),
    }
    this.api.get(data, 1, 'GetJobById').then((res: any) => {
      if (res.status == 1) {
        // this.categories = res.data
        this.detail = res.data[0];
        this.influServiceFee = res.influ_service_fee;
        this.influeServiceInPercent = res.influ_service_fee_percent;
        this.hiredStatus = res.hired_status;
      }
      else {
      }
    })
  }


  hire(obj, post_user_id, post_id, amt) {
    if (amt == 0) {

      this.runHireApi(obj, post_user_id, post_id, amt, '')
    } else {
      // setTimeout(() => {
      console.log(amt);
      let k = parseFloat(amt);
      let modal = this.api.modalCtrl.create('PaypalButtonPage', { Amount: k }, { cssClass: "alertModal", enableBackdropDismiss: true, showBackdrop: true });
      modal.onDidDismiss((data: any) => {
        if (data) {
          this.runHireApi(obj, post_user_id, post_id, amt, data);
        }
      });
      modal.present();


      // }, 3000);

    }

  }

  runHireApi(post, post_user_id, post_id, amt, tId) {

    let data = {
      // "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "hired_by": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      // "keywords": { "value": this.filter.keywords, "type": "NO" },
      "hired_to": { "value": post_user_id, "type": "NO" },
      "jobId": { "value": post_id, "type": "NO" },
      "amount": { "value": amt, "type": "NO" },
      "trasnsactionId": { "value": tId, "type": "NO" },
    }
    this.api.postData(data, 0, 'jobHiring').then((res: any) => {
      if (res.status == 1) {
        const modal = this.api.modalCtrl.create('SuccessfullPage', {}, { cssClass: 'moremodel', showBackdrop: true, enableBackdropDismiss: true });
        modal.present();
        modal.onDidDismiss(() => {
          post.isPayment = 1;
        })
      }
      else {
      }
    });
  }


  details() {
    this.navCtrl.push('ChatDetailsPage', { JobId: this.detail.Id, ReceiverId: this.detail.created_by.id })
  }

  deleteJob(i) {
    this.alert.confirmationAlert(this.trans.instant('ALERT'), this.trans.instant('DO_YOU_WANT_TO_DELETE_THIS_SERVICE')).then(r => {
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

  edit(i) {
    this.navCtrl.push('AddjobInfluPage', { EditId: i })
  }
}
