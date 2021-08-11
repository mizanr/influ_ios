import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import * as firebase from 'Firebase';
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
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {

  rooms = [];
  ref = firebase.database().ref('chatrooms/');

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ref.on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
      console.log('Rooms------',this.rooms);
      
    });
  }
  addRoom() {
    this.navCtrl.push('AddRoomPage');
  }

  joinRoom(key) {
    this.navCtrl.setRoot('HomeRoomPage', {
      key: key,
      nickname: this.navParams.get("nickname")
    });
  }
}
