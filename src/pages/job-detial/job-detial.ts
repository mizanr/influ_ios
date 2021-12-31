import { FirebaseProvider } from './../../providers/firebase/firebase';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'Firebase';

@IonicPage()
@Component({
  selector: 'page-job-detial',
  templateUrl: 'job-detial.html',
})
export class JobDetialPage {
  detail: any;
  user:any;
  is_mark:any;
  ref = firebase.database().ref('chatrooms1/');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public auth: AuthProvider,
    public alert: AlertProvider,
    public trans: TranslateService,
    public fireP: FirebaseProvider) {
  }

  ionViewWillEnter() {
    this.getJob()
    this.user= this.auth.getUserDetails();
  }

  getJob() {
    let data = {
      "user_id": this.auth.isUserLoggedIn()?this.auth.getCurrentUserId():this.auth.guest_id(),
      "job_id": this.navParams.get('JobId'),
    }
    this.api.get(data, 1, 'GetJobById').then((res: any) => {
      if (res.status == 1) {
        // this.categories = res.data
        this.detail = res.data[0];
        this.is_mark=res.data[0].is_mark;
        // this.influServiceFee = res.influ_service_fee;
        // this.influeServiceInPercent = res.influ_service_fee_percent
      }
      else {
      }
    })
  }

  edit(i) {
    this.navCtrl.push('AddJobPage', { EditId: i })
  }

  openApplied(i) {
    this.navCtrl.push('AppliedInfluencerPage', { JobId: i });
  }

  deleteJob(i) {
    this.alert.confirmationAlert(this.trans.instant('ALERT'), this.trans.instant('DO_YOU_WANT_TO_DELETE_THIS_JOB_POST')).then(r => {
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


  send(obj) {
    let profileModal = this.api.modalCtrl.create('SendMessagePage', { JobTitle: obj.title }, { cssClass: "mymodal" });
    profileModal.onDidDismiss(data => {
      if (data) {
        this.sendMsg(obj, data)
      }
    });
    profileModal.present();
  }


  // sendMsg(obj, m) {
  //   let Data = {
  //     JobId: { "value": obj.Id, "type": "NO" },
  //     sender: { "value": this.auth.getCurrentUserId(), "type": "NO" },
  //     receiver: { "value": obj.created_by.id, "type": "NO" },
  //     message: { "value": m, "type": "MSG" },
  //     msg_type: { "value": 'text', "type": "NO" },
  //   }
  //   this.api.postData(Data, 0, 'SendMessage').then((result: any) => {
  //     console.log(result);
  //     if (result.status == 1) {
  //       this.apply(obj);
  //     } else {
  //     }
  //   })
  // }


  apply(obj) {
    obj.applied_status = 1;
    let data = {
      "apply_by": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "jobId": { "value": obj.Id, "type": "NO" },
    }
    this.api.postData(data, 1, 'applyJob').then((res: any) => {
      if (res.status == 1) {
        this.getJob();
      }
      else {
        obj.applied_status = 0;
      }
    })

  }


  message(obj) {
    // this.navCtrl.push('ChatDetailsPage', { JobId: obj.Id, ReceiverId: obj.created_by.id });
    let other_user_id = parseInt(this.detail.created_by.id);
    let user_id = parseInt(this.auth.getCurrentUserId());
    let job_id = this.detail.Id;
    let job_title = this.detail.title;
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
          this.navCtrl.push('ConversationPage', { RoomKey: rooms[index].key, JobTitle: job_title, JobId: job_id, other_user: this.detail.created_by });
          return;
        }
      }


    });
  }



  sendMsg(msg: string, roomKey) {
    msg = msg.trim();
    if (!msg) {
      return;
    }



    let newData = firebase.database().ref('chatrooms1/' + roomKey + '/chats').push();

    // let obj = firebase.database().ref

    // console.log('Roomkey-------------', chat_room.child('last_message'));
    // console.log('receiver-------------', this.navParams.get('ReceiverId'));
    let time = (new Date()).toISOString();

    let data = {
      msg_type: 'text',
      message: msg,
      time_ago: time,
      sender_id: this.auth.getCurrentUserId(),
      sender_image: this.auth.getUserDetails().image
    }
    data["unread_" + this.auth.getCurrentUserId()] = true;
    data['show_id_'+this.auth.getCurrentUserId()]=true;
    data['show_id_'+parseInt(this.detail.created_by.id)]=true;
    newData.set(data);
    let chat_room = firebase.database().ref('chatrooms1/' + roomKey);
    chat_room.update({ last_message: msg, last_message_at: time })

  }


  createRoom(job_id, job_title, other_user, item) {
    let profileModal = this.api.modalCtrl.create('SendMessagePage', { JobTitle: item.title }, { cssClass: "mymodal" });
    profileModal.onDidDismiss(result1 => {
      if (result1) {
        let other_user_id = parseInt(this.detail.created_by.id);
        let user_id = parseInt(this.auth.getCurrentUserId());
        let user1_name = "";
        let user2_name = "";
        let newData = this.ref.push();
        let smartKey = other_user_id > user_id ? user_id + '_' + other_user_id : other_user_id + '_' + user_id;
        let rN = 'Room_' + job_id + '_' + smartKey;
        let data = {

          room_name: rN,
          user1: other_user_id,
          user2: parseInt(this.auth.getCurrentUserId()),
          job_id: job_id,
          job_title: job_title,
          last_message: ''

        }
        data['user_' + other_user_id + '_open'] = false;
        data['user_' + this.auth.getCurrentUserId() + '_open'] = false;
        console.log('data------------', data);

        newData.set(data);
        this.fireP.getRooms().then((res: any) => {
          let rooms = res;
          for (let index = 0; index < rooms.length; index++) {
            if (rooms[index].room_name == rN) {
              // this.navCtrl.push('ConversationPage', { RoomKey: rooms[index].key, JobTitle: rooms[index].Job_detail.title, JobId: this.detail.Id });
              // return;
              this.sendMsg(result1, rooms[index].key);

            }
          }
              this.apply(item);

        });
      }
    });
    profileModal.present();
  }


  cancel_request() {
    this.alert.confirmationAlert('Cancel Request','Are you sure?').then((res:any) => {
      if(res){
        let url = `CancelApplyJob?jobId=${this.navParams.get('JobId')}&apply_by=${this.auth.getCurrentUserId()}`;
        // let url = `CancelApplyJob?jobId=${this.navParams.get('JobId')}`;
        this.api.get({},1,url).then((res:any) => {
          console.log(res);
          if(res.status==1){
            this.getJob();
          }
        })
      }
    })
  }

  login() {
    const modal = this.api.modal.create('LoginPopupPage',{},{cssClass:'moremodel',enableBackdropDismiss:true});
      modal.present();
  }

}
