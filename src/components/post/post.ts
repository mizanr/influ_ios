import { AlertProvider } from './../../providers/alert/alert';
import { AuthProvider } from './../../providers/auth/auth';
import { TranslateService } from '@ngx-translate/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component, Input } from '@angular/core';

/**
 * Generated class for the PostComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent {

  @Input() k: any;

  constructor(public api: RestApiProvider,
    public navCtrl: NavController,
    public trans: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthProvider,
    public alert: AlertProvider) {
  }

  openAction(id) {
    let user = this.auth.getUserDetails();
    let btnText: any;
    if (user.user_type == 1) {
      btnText = this.trans.instant('REPORT')
    } else {
      btnText = this.trans.instant('BLOCK_COMPANY')
    }
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: btnText,
          handler: () => {
            if (user.user_type == 1) {
              let textModal = this.api.modalCtrl.create('TextModalPage', { PostId: id }, { cssClass: 'myModal' });
              textModal.present();
            } else {
              this.alert.show('Alert!', 'Coming Soon!')
            }
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

  openSlider(imgNameArr, index) {
    let profileModal = this.api.modalCtrl.create('ImagesViewerPage', { imgs: imgNameArr, index: index });
    profileModal.present();
  }


  postdetail(item) {
    if (item.type == 2) {
      this.navCtrl.push('PostDetailPage', { PostId: item.Id });
    } else {
      this.navCtrl.push('JobDetialPage', { JobId: item.Id });
    }
  }


  profile(obj) {
    if (obj.created_by.user_type == 1) {
      this.navCtrl.push('CompanyProfilePage', { ID: obj.created_by.id })
    } else {
      this.navCtrl.push('InfluencerProfilePage', { InfluId: obj.created_by.id, PostId: obj.Id });
    }
  }
}
