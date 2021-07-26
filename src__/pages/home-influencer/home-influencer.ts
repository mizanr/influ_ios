import { AlertProvider } from './../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';

import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController, Refresher } from 'ionic-angular';

import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";
@IonicPage()

@Component({
  selector: 'page-home-influencer',
  templateUrl: 'home-influencer.html',
})

export class HomeInfluencerPage {
  public buttonClicked: boolean = false;
  noData = false;
  services: any = [];
  start: any = 0;
  observableVar: Subscription;
  filter = {
    name: '',
    country: {
      id: "",
      nicename: ""
    },
    category: '',
    reviews: '',
    post_type: ''
  };
  previousPostCount: any;
  public ngIfCtrl() {

    this.buttonClicked = !this.buttonClicked;
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider,
    public api: RestApiProvider,
    public actionSheetCtrl: ActionSheetController,
    public trans: TranslateService,
    public alert: AlertProvider) {
  }

  ionViewWillEnter() {
    this.start = 0;
    this.startInterval();
  }

  ionViewWillLeave() {
    this.observableVar.unsubscribe();
  }

  startInterval() {
    this.getService('', 1, '');
    // // let user =  JSON.parse(localStorage.getItem("userDetailsUserGF"))
    // this.currentUser = this.auth.getCurrentUserId();
    // this.currentUsername = this.navParams.get("name");
    this.observableVar = Observable.interval(10000).subscribe(() => {

      this.getService1();
    });
  }

  profile(id) {
    this.navCtrl.push('CompanyProfilePage', { ID: id })
  }

  openfilter() {
    let modal = this.api.modalCtrl.create('FilterInfluPage', { Filter: this.filter });
    modal.onDidDismiss((data: any) => {
      if (data) {
        this.filter = data;
        this.start = 0;
        this.getService('', 1, '');
      }
    });
    modal.present();
  }

  getService(inf, s, refresher) {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
      "type": 1,
      "category": this.filter.category,
      // "gender": this.filter.gender,
      "country": this.filter.country.nicename,
      // "age": this.filter.age,
      "name": this.filter.name,
      "post_type": this.filter.post_type,
      "start": this.start,
      "limit": 30,
    }
    this.api.get(data, s, 'getPostList').then((res: any) => {
      if (inf != '') {
        inf.complete();
      }
      if (refresher != '') {
        refresher.complete();
      }

      if (res.status == 1) {
        this.previousPostCount = res.total_post_count;
        if (this.start != 0) {
          if (res.data.length != 0) {
            this.services = this.services.concat(res.data);
          }
        } else {
          this.services = res.data;
        }
        this.start = this.start + 30;
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


  getService1() {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
      "type": 1,
    }
    this.api.get(data, 0, 'getPostList').then((res: any) => {
      if (res.status == 1) {
        let tp = parseInt(res.total_post_count);
        let pp = parseInt(this.previousPostCount);
        console.log('----------', tp, '------------', pp);

        if (tp > pp) {
          this.start = 0;
          this.getService('', 1,'');
        }
      }
      else {
      }
    })
  }

  doInfinite(infiniteScroll) {
    this.getService(infiniteScroll, 0,'');
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


  openNoti() {
    this.navCtrl.push('NotificationPage');
  }

  doRefresh(ev) {
    this.start = 0;
    this.getService('', 0, ev);
  }
}
