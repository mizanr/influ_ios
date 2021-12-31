import { AlertProvider } from './../../providers/alert/alert';
import { AuthProvider } from './../../providers/auth/auth';
import { TranslateService } from '@ngx-translate/core';
import { NavController, ActionSheetController, Events, App } from 'ionic-angular';
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
    // public navCtrl: NavController,
    public trans: TranslateService,
    public events:Events,
    public app:App,
    public actionSheetCtrl: ActionSheetController,
    public auth: AuthProvider,
    public alert: AlertProvider) {
  }

  openAction(k) {
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
              console.log(k);
              let textModal = this.api.modalCtrl.create('TextModalPage', { PostId: k.Id }, { cssClass: 'myModal' });
              textModal.present();
            } else {
              // this.alert.show('Alert!', 'Coming Soon!');
              console.log(k);
              this.block_user(k.created_by.id);
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
    console.log(item);
    if (item.type == 2) {
      // alert("post component");
      this.app.getActiveNav().push('PostDetailPage', { PostId: item.Id });
      // this.navCtrl.push('PostDetailPage', { PostId: item.Id });
    } else {
      this.app.getActiveNav().push('JobDetialPage', { JobId: item.Id });
    }
  }


  profile(obj) {
    if (obj.created_by.user_type == 1) {
      this.app.getActiveNav().push('CompanyProfilePage', { ID: obj.created_by.id })
    } else {
      this.app.getActiveNav().push('InfluencerProfilePage', { InfluId: obj.created_by.id, PostId: obj.Id });
    }
  }

  block_user(id){
    let data = {
      "block_to":id,
      "block_by":this.auth.getCurrentUserId()
    }
    //https://www.w4ebwiders.com/WEB01/Influ/Api/BlockCompany?block_by=51&block_to=52
      this.api.get(data,1,'BlockCompany').then((res:any)=>{
            if(res.status==1){
              this.events.publish('list_refresh',true);
              // this.navCtrl.pop();
              //this.getProfile();
            }
      })
    
  }

}
