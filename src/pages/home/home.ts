import { TranslateService } from '@ngx-translate/core';
import { PaypalProvider } from './../../providers/paypal/paypal';
import { FilterInfluPage } from './../filter-influ/filter-influ';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController } from 'ionic-angular';

import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  services: any = [];
  noData = false;
  topInflu: any = [];
  public buttonClicked: boolean = false;
  filter = {
    name: '',
    country: {
      id: "",
      nicename: ""
    },
    category: '',
    reviews: '',
    age: '',
    gender: '',
    post_type: ''
  };
  start: any = 0;
  influStart = 0;
  scrolled: any;
  showSpinner = false;
  observableVar: Subscription;
  previousPostCount: any;
  constructor(public navCtrl: NavController,
    public auth: AuthProvider,
    public api: RestApiProvider,
    public alert: AlertProvider,
    public actionSheetCtrl: ActionSheetController,
    public paypal: PaypalProvider,
    public trans: TranslateService) {

  }

  ionViewWillEnter() {
    this.start = 0;
    this.influStart = 0;
    this.getTopInflu(1);
    this.startInterval();
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

  ionViewWillLeave() {
    this.observableVar.unsubscribe();
  }

  profile(id, pId) {
    this.navCtrl.push('InfluencerProfilePage', { InfluId: id, PostId: pId });
  }

  getService(inf, s, refresher) {
    let data = {
      // "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      // "type": { "value": 2, "type": "NO" },
      // // "keywords": { "value": this.filter.keywords, "type": "NO" },
      // "category": { "value": this.filter.category, "type": "NO" },
      // "gender": { "value": this.filter.gender, "type": "NO" },
      // "country": { "value": this.filter.country.nicename, "type": "NO" },
      // "age": { "value": this.filter.age, "type": "NO" },
      // "name": { "value": this.filter.name, "type": "NO" },
      // "post_type": { "value": this.filter.post_type, "type": "NO" },
      // "start": { "value": this.start, "type": "NO" },
      // "limit": { "value": 2, "type": "NO" },
      "user_id": this.auth.getCurrentUserId(),
      "type": 2,
      // "keywords": { "value": this.filter.keywords, "type": "NO" },
      "category": this.filter.category,
      "gender": this.filter.gender,
      "country": this.filter.country.nicename,
      "age": this.filter.age,
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
        this.services = this.services.concat(res.data);
        if (this.start != 0) {
          if (res.data.length != 0) {
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
      "type": 2,
    }
    this.api.get(data, 0, 'getPostList').then((res: any) => {
      if (res.status == 1) {
        let tp = parseInt(res.total_post_count);
        let pp = parseInt(this.previousPostCount);
        console.log('----------', tp, '------------', pp);

        if (tp > pp) {
          this.start = 0;
          this.getService('', 1, '');
        }
      }
      else {
      }
    })
  }


  getTopInflu(s) {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
      "start": this.influStart,
      "limit": 10,
    }
    this.api.get(data, s, 'getTopInflu').then((res: any) => {
      if (res.status == 1) {
        this.showSpinner = false;
        if (this.influStart != 0) {
          if (res.data.length != 0) {
            this.topInflu = this.topInflu.concat(res.data);
          }
        } else {
          this.topInflu = res.data;
        }
        this.influStart = this.influStart + 10;
      }
      else {
        this.topInflu = [];
      }
      // if (this.services.length == 0) {
      //   this.noData = true
      // } else {
      //   this.noData = false
      // }
    })
  }

  openfilter() {
    // this.navCtrl.push(SearchInfluPage);
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

  doInfinite(infiniteScroll) {
    this.getService(infiniteScroll, 0, '');
  }


  horiscroll($event) {

    // if (section.other != 1) {
    if (this.scrolled != 1 && this.scrolled != 2) {
      if (($event.srcElement.scrollLeft + $event.srcElement.clientWidth) >= $event.srcElement.scrollWidth - 50) {
        console.log('end me pahoch gaye');
        this.scrolled = 1;
        this.showSpinner = true;
        this.getTopInflu(0);
      }
    }
    // }
  }
  openNoti() {
    this.navCtrl.push('NotificationPage');
  }


  doRefresh(ev) {
    this.start = 0;
    this.getService('', 0, ev);
  }
}
