import { FirebaseProvider } from './../../providers/firebase/firebase';
import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage, Slides } from 'ionic-angular';
import * as firebase from 'Firebase';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { RatePopupPage } from '../rate-popup/rate-popup';
@IonicPage()

@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html',
})
export class PostDetailPage {
  @ViewChild(Slides) slide: Slides;
  detail: any = '';
  hired_id:any;
  influServiceFee: any;
  influeServiceInPercent: any;
  hiredStatus: any;
  public buttonClicked: boolean = false;
  filter_counts:any=new Array();
  ratings:any=new Array();
  all_ratings:any=new Array();
  ref = firebase.database().ref('chatrooms1/');
  roomName: any;
  ismark:any;
  rate_status:any;
  isdeleted:any;
  delete_reason:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public auth: AuthProvider, public api: RestApiProvider,
    public alert: AlertProvider,
    public trans: TranslateService,
    public fireP: FirebaseProvider) {

  }
  ionViewWillEnter() {
    this.getPost(1);
  }

  getPost(lodr:any) {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
      "job_id": this.navParams.get('PostId'),
    }
    this.api.get(data, lodr, 'GetJobById').then((res: any) => {
      if (res.status == 1) {
        // this.categories = res.data
        this.detail = res.data[0];
        this.filter_counts=res.filter_count;
        // setTimeout(()=>{
        //   this.slide.update();
        // },1000)
        this.ratings=res.data[0].rate_list;
        this.all_ratings=res.data[0].rate_list;
        this.rate_status=res.data[0].is_rated;
        this.influServiceFee = res.influ_service_fee;
        this.influeServiceInPercent = res.influ_service_fee_percent;
        this.hiredStatus = res.hired_status;
        this.hired_id=res.is_complete_id;
        this.ismark=res.is_complete;

        this.isdeleted=res.data[0].is_delete;
        this.delete_reason=res.data[0].is_reason;
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
      admin_comission:{value:this.influServiceFee,type:'NO'},
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
    console.log("created by --------", this.detail)
    let other_user_id = parseInt(this.detail.created_by.id);
    let user_id = parseInt(this.auth.getCurrentUserId());

    console.log(other_user_id,'---------',user_id);
    
    let job_id = this.detail.Id;
    let job_title = this.detail.title;
    let rooms: any = [];
    this.fireP.getRooms().then(res => {
      rooms = res;
      let smartKey = other_user_id > user_id ? user_id + '_' + other_user_id : other_user_id + '_' + user_id;
      let rN = 'Room_' + job_id + '_' + smartKey;
      this.roomName = rN;
      if (rooms.length == 0) {
        this.createRoom(rN, job_id, job_title, this.detail.created_by);
        return;
      }
      for (let index = 0; index < rooms.length; index++) {
        if (rooms[index].room_name == rN) {
          this.navCtrl.push('ConversationPage', { RoomKey: rooms[index].key, JobTitle: job_title, JobId: job_id, other_user: this.detail.created_by });
          return;
        }

        if (index == rooms.length - 1) {
          this.createRoom(rN, job_id, job_title, other_user_id);
        }
        // for (let i = 0; i < rooms.length; i++) {
        // }
        // this.navCtrl.push('ChatDetailsPage', { JobId: this.detail.Id, ReceiverId: this.detail.created_by.id });
      }


    });

  }

  createRoom(room_name, job_id, job_title, other_user) {

    let user1_name = "";
    let user2_name = "";
    let newData = this.ref.push();
    let data = {

      room_name: room_name,
      user1: other_user,
      user2: parseInt(this.auth.getCurrentUserId()),
      job_id: job_id,
      job_title: job_title,
      last_message: ''

    }
    data['user_' + other_user + '_open'] = false;
    data['user_' + this.auth.getCurrentUserId() + '_open'] = false;
    newData.set(data);
    this.fireP.getRooms().then((res: any) => {
      console.log('other user-----', data.user1);
      console.log('Room name----', this.roomName);

      let rooms = res;
      for (let index = 0; index < rooms.length; index++) {
        if (rooms[index].room_name == this.roomName) {
          this.navCtrl.push('ConversationPage', { RoomKey: rooms[index].key, JobTitle: rooms[index].job_title, JobId: this.detail.Id, other_user: this.detail.created_by });
          return;
        }
      }
    });
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

  rate_now() {
    let ratemodal = this.api.modalCtrl.create(RatePopupPage, {data:this.detail.created_by}, { cssClass: 'ratemodal' });
    ratemodal.present();
    ratemodal.onDidDismiss((data) => {
      if(data){
        this.getPost(0);
      }
    })
  }

  rating_filter(filter:any) {
    console.log(filter);
    this.ratings=this.all_ratings.filter((item) => {
      return item.rate==filter;
    })
  }

  public ngIfCtrl() {
    this.buttonClicked = !this.buttonClicked;
  }

  mark_as_complete(service:any) {
    console.log(service);
    this.alert.confirmationAlert('Complete Service','Are you sure?').then((res:any) => {
      console.log(res);
      if(res==true){
        let Data = {
          id:service.Id,
          user_id:this.auth.getCurrentUserId(),
          hired_id:this.hired_id,
          //company_id:this.
        }
        this.api.get(Data,1,'MarkAsComplete').then((res:any) => {
          console.log(res);
          if(res.status==1){
              this.getPost(0);
              if(this.detail.is_rated==0){
                setTimeout(() => {
                  this.rate_now();
                }, 200);
              }              
          }
        })
      }
    })    
  }


  hired_by() {
    this.navCtrl.push('HiredListPage',{service_id:this.navParams.get('PostId')});
  }

  reject_() {
    let data = {
      user_id:{value:this.auth.getCurrentUserId(),type:'NO'},
      service_id:{value:this.detail.Id,type:'NO'},
    }
    this.api.postData(data,0,'reject').then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.getPost(0);
      }
    })
  }

  accept() {
    let data = {
      hiredId:{value:this.hired_id,type:'NO'},
      jobId:{value:this.detail.Id,type:'NO'},
      user_id:{value:this.auth.getCurrentUserId(),type:'NO'},
    } 
    this.api.postData(data,0,'HiredAccept').then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.getPost(0);
      }
    })
  }

}
