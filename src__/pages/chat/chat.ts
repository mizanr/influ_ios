import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';

import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

import { Observable } from 'Rxjs/rx';
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  observableVar: any;
  chatList = [];
  noData = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public auth: AuthProvider) {
  }
  ionViewWillEnter() {

    this.getChatList(1);
    this.observableVar = Observable.interval(3000).subscribe(() => {
      this.getChatList(0);
    });
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
    this.navCtrl.push('ChatDetailsPage', { JobId: obj.Job_detail.Id, ReceiverId: obj.sender.id })
  }

  deleteChat(obj) {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
      "job_id": obj.Job_detail.Id,
      "receiver_id": obj.sender.id,
    };
    this.api.get(data, 1, 'delete_chat').then((result: any) => {
      if (result.status == 1) {
        this.getChatList(1);
      }
    }, (err) => {
    });
  }


  openNoti() {
    this.navCtrl.push('NotificationPage');
  }
}
