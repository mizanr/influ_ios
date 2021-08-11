import { TranslateService } from '@ngx-translate/core';
import { AuthProvider } from './../../providers/auth/auth';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the CompanyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-company-profile',
  templateUrl: 'company-profile.html',
})
export class CompanyProfilePage {
  grown: string = "Profile";
  public buttonClicked: boolean = false;

  public ngIfCtrl() {

    this.buttonClicked = !this.buttonClicked;
  }
  profile: any;
  jobs = [];
  noData = false;
  hires: any;
  posts: any;
  ownerId: any;
  hired_services = [];

  noHireData = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public trans:TranslateService,
    public actionSheetCtrl:ActionSheetController,
    public alert: AlertProvider,
    public auth: AuthProvider
  ) {
  }

  ionViewWillEnter() {
    if (this.navParams.get('ID')) {
      this.ownerId = this.navParams.get('ID')
    } else {
      this.ownerId = this.auth.getCurrentUserId();
    };
    this.getProfile();
  }

  getProfile() {
    let data = {
      "id": this.ownerId,
    }
    this.api.get(data, 1, 'GetUserProfile').then((res: any) => {
      if (res.status == 1) {
        this.profile = res.data;
        this.hires = res.no_of_hires;
        this.posts = res.no_of_posts;
        this.getJob();
      }
      else {
      }
    })
  }

  getJob() {
    let data = {
      "user_id": { "value": this.ownerId, "type": "NO" },
    }
    this.api.postData(data, 0, 'GetMyJobList').then((res: any) => {
      this.getHiredService();
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

  back() {
    this.navCtrl.pop();
  }

  onChange() {
    // if (this.grown == 'Images' || this.grown == 'Reviews') {
    //   this.alert.show('Alert!', 'Coming Soon!');
    // }
  }

  opneEdit() {
    this.navCtrl.push('EditProfilePage')
  }


  getHiredService() {
    let data = {
      "user_id": { "value": this.ownerId, "type": "NO" },
    }
    this.api.postData(data, 0, 'HiredByMe').then((res: any) => {
      if (res.status == 1) {
        this.hired_services = res.data;
      }
      else {
        this.hired_services = [];
      }
      if (this.hired_services.length == 0) {
        this.noHireData = true
      } else {
        this.noHireData = false
      }
    })
  }


  openSlider(imgNameArr, index) {
    let profileModal = this.api.modalCtrl.create('ImagesViewerPage', { imgs: imgNameArr, index: index });
    profileModal.present();
  }


  postdetail(id) {
    // let profileModal = this.modalCtrl.create('PostDetailPage', { PostId: id }, { cssClass: "alertModal", enableBackdropDismiss: true, showBackdrop: true });
    // profileModal.present();
    this.navCtrl.push('PostDetailPage', { PostId: id });
  }
  jobDetail(id) {
    this.navCtrl.push('JobDetialPage', { JobId: id });

  }
  makeActive(k) {
    this.grown = k;
  }


  
  openNoti() {
    this.navCtrl.push('NotificationPage');
  }



  
  block_user(){
    let data = {
      "block_to":  this.ownerId,
      "block_by":this.auth.getCurrentUserId()
    }
    //https://www.webwiders.com/WEB01/Influ/Api/BlockCompany?block_by=51&block_to=52
      this.api.get(data,1,'BlockCompany').then((res:any)=>{
            if(res.status==1){
              this.navCtrl.pop();
              //this.getProfile();
            }
      })
    
  }



  openAction(id) {
    const actionSheet = this.actionSheetCtrl.create({
      title: this.trans.instant('BLOCK_THIS_COMPANY'),
      buttons: [
        {
          text: this.trans.instant('BLOCK'),
          handler: () => {
            this.block_user();
            // this.navCtrl.pop();
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





}
