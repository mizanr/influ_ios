import { TranslateService } from '@ngx-translate/core';
import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AlertProvider } from './../../providers/alert/alert';
import { Component, Input } from '@angular/core';
import { ActionSheetController, NavController } from 'ionic-angular';

/**
 * Generated class for the ServiceComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'service',
  templateUrl: 'service.html'
})
export class ServiceComponent {
  @Input() k: any;
  text: string;

  constructor(public alert: AlertProvider,
    public actionSheetCtrl: ActionSheetController,
    public api: RestApiProvider,
    public auth: AuthProvider,
    public trans: TranslateService,
    public navCtrl: NavController) {
    console.log('Hello ServiceComponent Component');
    this.text = 'Hello World';
  }

  openAction(id) {
    const actionSheet = this.actionSheetCtrl.create({
      title: this.trans.instant('REPORT_THIS_POST'),
      buttons: [
        {
          text: this.trans.instant('REPORT'),
          handler: () => {
            let textModal = this.api.modalCtrl.create('TextModalPage', { PostId: id }, { cssClass: 'myModal' });
            textModal.present();
          }
        },
        {
          text: this.trans.instant('CANCEL'),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

  }


  hire(obj, post_user_id, post_id, amt) {
    if (amt == 0) {

      this.runHireApi(obj, post_user_id, post_id, amt, '')
    } else {
      // setTimeout(() => {
      console.log(amt);
      let k = parseInt(amt);
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
    })
  }


  details(obj) {
    this.navCtrl.push('ChatDetailsPage', { JobId: obj.Id, ReceiverId: obj.created_by.id })
  }


  postdetail(id) {
    // let profileModal = this.modalCtrl.create('PostDetailPage', { PostId: id }, { cssClass: "alertModal", enableBackdropDismiss: true, showBackdrop: true });
    // profileModal.present();
    this.navCtrl.push('PostDetailPage',{ PostId: id });
  }
  openSlider(imgNameArr, index) {
    let profileModal = this.api.modalCtrl.create('ImagesViewerPage', { imgs: imgNameArr, index: index });
    profileModal.present();
  }
}
