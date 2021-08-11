import { FirebaseProvider } from './../../providers/firebase/firebase';
import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';

import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Events } from 'ionic-angular';
import * as firebase from 'Firebase';

import { Observable } from 'Rxjs/rx';
export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  all_thread_ref:any;
  observableVar: any;
  chatList: any = [];
  users = {

  };
  noData = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public auth: AuthProvider,
    public event:Events,
    public fireP: FirebaseProvider) {
      this.all_thread_ref = firebase.database().ref('chatrooms1/');

  }






 



  getusers(users) {
    console.log(users);
    if (users.length > 0) {
      let data = {
        "user_id": users.join(','),
      };
      this.api.get(data, 0, 'UserListComma').then((result: any) => {
        if (result.status == 1) {

          for (let i = 0; i < result.data.length; i++) {
            this.users['user_' + result.data[i].id] = result.data[i];
          }
        }
      }, (err) => {
      });

    }
  }




  ionViewWillEnter() {
    
    this.all_thread_ref.on('value', (resp: any) => {
      this.chatList = [];
      let users = [];
      let totalCount = 0;
      resp.forEach(childSnapshot => {
        let item = childSnapshot.val();
        if (item.user1 == this.auth.getCurrentUserId() || item.user2 == this.auth.getCurrentUserId()) {
          item.key = childSnapshot.key;
          let otheruser = (item.user1 == this.auth.getCurrentUserId()) ? item.user2 : item.user1;
          item["other_user"] = otheruser;
          if (!this.users['user_' + otheruser]) {
            users.push(otheruser);
          }
          let m = firebase.database().ref('chatrooms1/' + item.key + '/chats').orderByChild('unread_' + otheruser).equalTo(true);//.orderByChild('sender_id');//.equalTo(item["other_user"]);
          m.on('value', (aaa) => {
            item['unread_msg'] = aaa.numChildren();
            totalCount = totalCount + item['unread_msg']
            m.off('value');
          })
          this.chatList.push(item);
        }
      });
      this.sort();
      this.getusers(users)
      if (this.chatList.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
    });
    // // this.getChatList(1);
    // this.observableVar = Observable.interval(3000).subscribe(() => {
    //   // this.getChatList(0);
    // });
  }

  ionViewWillLeave(){
     this.all_thread_ref.off('value');


     this.event.publish('chat_count_start')//chat_count_start
  }

  ionViewDidLeave() {
    console.log('Inviewdidleave');

    if (this.observableVar) {
      this.observableVar.unsubscribe();
      // console.log('unsubscribing');
    }
  }

  getChatList(s) {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
    };
    this.api.get(data, s, 'GetChatList').then((result: any) => {
      if (result.status == "0") {
        this.chatList = []
      } else {
        this.chatList = result.chat_list;
      }
      if (this.chatList.length == 0) {
        this.noData = true;
      } else {
        this.noData = false;
      }
    }, (err) => {
    });
  }

  details(obj) {
    if(!this.users['user_' + obj.other_user]){
      return;
    }
    // this.navCtrl.push('ChatDetailsPage', { JobId: obj.Job_detail.Id, ReceiverId: obj.sender.id })
    this.navCtrl.push('ConversationPage', { RoomKey: obj.key, JobTitle: obj.job_title, JobId: obj.job_id, other_user: this.users['user_' + obj.other_user] });

  }

  deleteChat(obj) {
    console.log(obj);
    firebase.database().ref('chatrooms1/'+obj.key).remove();
    // let data = {
    //   "user_id": this.auth.getCurrentUserId(),
    //   "job_id": obj.Job_detail.Id,
    //   "receiver_id": obj.sender.id,
    // };
    // this.api.get(data, 1, 'delete_chat').then((result: any) => {
    //   if (result.status == 1) {
    //     this.getChatList(1);
    //   }
    // }, (err) => {
    // });
  }


  openNoti() {
    this.navCtrl.push('NotificationPage');
  }


  sort(){
    console.log("sort funtion");

    this.chatList.sort((a,b)=>{
      console.log("chat short function",a,b);
      let  c =(new Date(a.last_message_at)).getTime();
      let d = (new Date(b.last_message_at)).getTime();
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
      return c < d ? 1 : -1;  
});
  }


}
