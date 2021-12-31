import { FirebaseProvider } from './../../providers/firebase/firebase';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { k } from '@angular/core/src/render3';
import { AlertProvider } from '../../providers/alert/alert';
import { RatePopupPage } from '../rate-popup/rate-popup';


@IonicPage()
@Component({
  selector: 'page-applied-influencer',
  templateUrl: 'applied-influencer.html',
})
export class AppliedInfluencerPage {
  influs = [];
  noData = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider,
    public alert:AlertProvider,
    public api: RestApiProvider,
    public fireP: FirebaseProvider) {
    this.getinflus()
  }


  getinflus() {
    let data = {
      "id": { "value": this.navParams.get('JobId'), "type": "NO" },
      "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" },
    }
    this.api.postData(data, 0, 'applied_influs').then((res: any) => {
      if (res.status == 1) {
        this.influs = res.data;
      }
      else {
        this.influs = [];
      }
      if (this.influs.length == 0) {
        this.noData = true
      } else {
        this.noData = false
      }
    })
  }


  profile(id, pId) {
    this.navCtrl.push('InfluencerProfilePage', { InfluId: id, PostId: pId });
  }

  chat(applyBy, JobId, jTitle, applyByImage) {
    // this.navCtrl.push('ChatDetailsPage', { JobId: this.navParams.get('JobId'), ReceiverId: id })

    // this.navCtrl.push('ChatDetailsPage', { JobId: obj.Id, ReceiverId: obj.created_by.id });
    let other_user_id = parseInt(applyBy);
    let user_id = parseInt(this.auth.getCurrentUserId());
    let job_id = JobId;
    let job_title = jTitle;
    let rooms: any = [];
    let smartKey = other_user_id > user_id ? user_id + '_' + other_user_id : other_user_id + '_' + user_id;
    let rN = 'Room_' + job_id + '_' + smartKey;
    console.log('Unique room name---------', rN);

    this.fireP.getRooms().then(res => {
      rooms = res;
      let smartKey = other_user_id > user_id ? user_id + '_' + other_user_id : other_user_id + '_' + user_id;
      let rN = 'Room_' + job_id + '_' + smartKey;

      for (let index = 0; index < rooms.length; index++) {
        if (rooms[index].room_name == rN) {
          let k = {
            image: applyByImage,
            id: applyBy
          }
          this.navCtrl.push('ConversationPage', { RoomKey: rooms[index].key, JobTitle: job_title, JobId: job_id, other_user: k });
          return;
        }
      }


    });
  }


  hired(k) {
    console.log(k);
    let amount = Number(k.price) + Number(k.influ_service_fee);
    // let k = parseFloat(amt);
      let modal = this.api.modalCtrl.create('PaypalButtonPage', { Amount: amount }, { cssClass: "alertModal", enableBackdropDismiss: true, showBackdrop: true });
      modal.onDidDismiss((data: any) => {
        console.log(data);
        if (data) {
          this.runHireApi(k.apply_by,k.Id,amount,data,k.influ_service_fee,k.applied_id);
        }
      });
      modal.present();

  }

  runHireApi(hired_to, jobId, amt, tId,admincomm,applied_id) {

    let data = {
      "hired_by": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "hired_to": { "value": hired_to, "type": "NO" },
      "jobId": { "value": jobId, "type": "NO" },
      "amount": { "value": amt, "type": "NO" },
      "trasnsactionId": { "value": tId, "type": "NO" },
      'admin_comission':{value:admincomm,type:'NO'},
      applied_id:{value:applied_id,type:'NO'},
    }
    this.api.postData(data, 0, 'jobHiring').then((res: any) => {
      if (res.status == 1) {
        const modal = this.api.modalCtrl.create('SuccessfullPage', {type:1}, { cssClass: 'moremodel', showBackdrop: true, enableBackdropDismiss: true });
        modal.present();
        modal.onDidDismiss(() => {
          this.getinflus();
          // post.isPayment = 1;
        })
      }
      else {
      }
    });
  }


  mark_as_complete(k:any) {
    console.log(k);
    this.alert.confirmationAlert('Complete Job','Are you sure?').then((res:any) => {
      if(res){
        let Data = {
          id:k.Id,
          // user_id:k.apply_by,
          // company_id:this.auth.getCurrentUserId(),
          hired_id:k.hired_id,
        }
        this.api.get(Data,1,'MarkAsComplete').then((res:any) => {
          console.log(res);
          if(res.status==1){
            this.getinflus();
            if(k.is_rated==0){
              setTimeout(() => {
                this.rate_now(k);
              }, 200);
            }  
            // this.ionViewWillEnter();
             // this.getPost(0);
          }
        })
      }
    });    
  }


  rate_now(k) {
    let d = {
      id:k.apply_by
    }
    let ratemodal = this.api.modalCtrl.create(RatePopupPage, {data:d}, { cssClass: 'ratemodal' });
    ratemodal.present();
    ratemodal.onDidDismiss((data) => {
      if(data){
        this.getinflus();
        // this.getPost(0);
      }
    })
  }


  reject(k) {
    console.log(k);
    this.alert.confirmationAlert('Reject Job','Are you sure?').then((res:any) => {
      if(res){
        let Data = {
          // id:k.Id,
          id:k.applied_id,
          user_id:this.auth.getCurrentUserId(),
          // company_id:this.auth.getCurrentUserId(),
          // hired_id:k.hired_id,
        }
        this.api.get(Data,1,'reject_request').then((res:any) => {
          console.log(res);
          if(res.status==1){
            this.getinflus();
          }
        })
      }
    }); 
  }



}
