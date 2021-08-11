import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'Firebase';

@IonicPage()
@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {
  data = { roomname:'' };
  ref = firebase.database().ref('chatrooms/');
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }
  addRoom() {
    let newData = this.ref.push();
    newData.set({
      roomname:this.data.roomname,
      key:"Room_1_2ss",
      roomobject:{
        roomId:"Room_1_2"
      }
    });
    this.navCtrl.pop();
  }
}
