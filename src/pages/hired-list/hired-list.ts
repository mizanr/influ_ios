import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import * as firebase from 'Firebase';
import { AlertProvider } from '../../providers/alert/alert';

/**
 * Generated class for the HiredListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hired-list',
  templateUrl: 'hired-list.html',
})
export class HiredListPage {
  service_id:any;
lists:any = new Array();
roomName:any;
detail:any;
ref = firebase.database().ref('chatrooms1/');
  constructor(public navCtrl: NavController, 
    public auth: AuthProvider, 
    public api: RestApiProvider,
    public alertP:AlertProvider,
    public fireP: FirebaseProvider,
    public navParams: NavParams) {
    this.service_id=navParams.data.service_id;
    console.log(this.service_id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HiredListPage');
  }

  ionViewWillEnter() {
    let url = `GetHiredList?job_id=${this.service_id}`;
    this.api.get({},1,url).then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.lists=res.data;
      } else {
        this.lists=new Array();
      }
    })
  }

  mark_as_complete(service:any) {
    console.log(service);
    let Data = {
      id:service.jobId,
      user_id:this.auth.getCurrentUserId(),
      company_id:service.hired_by,
    }
    this.api.get(Data,1,'MarkAsComplete').then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.ionViewWillEnter();
         // this.getPost(0);
      }
    })
  }

  accept(l) {
    console.log(l);
    this.alertP.confirmationAlert('Accept Rquest','Are you sure?').then((res:any) => {
      if(res){
        let data = {
          id:{value:l.id,type:'NO'},
          jobId:{value:l.jobId,type:'NO'},
          user_id:{value:this.auth.getCurrentUserId(),type:'NO'},
        } 
        this.api.postData(data,0,'HiredAccept').then((res:any) => {
          console.log(res);
          if(res.status==1){
            this.ionViewWillEnter();
            // this.getPost(0);
          }
        })
      }
    })
   
  }

  reject_(l) {
    console.log(l);
    this.alertP.confirmationAlert('Reject Rquest','Are you sure?').then((res:any) => {
      if(res){
        let data = {
          user_id:{value:this.auth.getCurrentUserId(),type:'NO'},
          id:{value:l.id,type:'NO'},
        }
        this.api.postData(data,0,'HiredReject').then((res:any) => {
          console.log(res);
          if(res.status==1){
            this.ionViewWillEnter();
            // this.getPost(0);
          }
        })
      }
    });
    
  }

  chat(l) {
    console.log('click');
    this.detail=l;
    let other_user_id = parseInt(l.hired_by);
    let user_id = parseInt(this.auth.getCurrentUserId());

    console.log(other_user_id,'---------',user_id);
    let job_id =l.jobId;
    let job_title = l.title;
    // let rooms: any = [];
    let rooms: any = [];
    this.fireP.getRooms().then(res => {
      rooms = res;
      let smartKey = other_user_id > user_id ? user_id + '_' + other_user_id : other_user_id + '_' + user_id;
      let rN = 'Room_' + job_id + '_' + smartKey;
      this.roomName = rN;
      if (rooms.length == 0) {
        this.createRoom(rN, job_id, job_title, l.created_by);
        return;
      }
      for (let index = 0; index < rooms.length; index++) {
        console.log(rooms[index],'--------room index','rN-----',rN);
        if (rooms[index].room_name == rN) {
          this.navCtrl.push('ConversationPage', { RoomKey: rooms[index].key, JobTitle: job_title, JobId: job_id, other_user: l.created_by });
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
    //this.navCtrl.push('ConversationPage',{},);
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
          
          this.navCtrl.push('ConversationPage', { RoomKey: rooms[index].key, JobTitle: rooms[index].job_title, JobId: job_id, other_user: other_user });
          return;
        }
      }
    });
  }

}
