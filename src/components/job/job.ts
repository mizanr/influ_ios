import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { AlertProvider } from './../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'job',
  templateUrl: 'job.html'
})
export class JobComponent {

  @Input() k: any;
  text: string;

  constructor(public navCtrl: NavController,
    public trans: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    public alert: AlertProvider,
    public auth: AuthProvider,
    public api: RestApiProvider) {
    console.log('Hello JobComponent Component');
    this.text = 'Hello World';
  }


  profile(id) {
    this.navCtrl.push('CompanyProfilePage', { ID: id })
  }

  openAction(id) {
    const actionSheet = this.actionSheetCtrl.create({
      // title: this.trans.instant('REPORT_THIS_POST'),
      buttons: [
        {
          text: this.trans.instant('BLOCK_COMPANY'),
          handler: () => {
            this.alert.show('Alert!', 'Coming Soon!')
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


  openSlider(imgNameArr, index) {
    let profileModal = this.api.modalCtrl.create('ImagesViewerPage', { imgs: imgNameArr, index: index });
    profileModal.present();
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

  jobDetail(id) {
    this.navCtrl.push('JobDetialPage', { JobId: id });

  }
  
}
