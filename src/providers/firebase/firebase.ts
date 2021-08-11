import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
@Injectable()
export class FirebaseProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FirebaseProvider Provider');
  }

  getRooms() {
    return new Promise((resolve, reject) => {
      firebase.database().ref('chatrooms1/').on('value', resp => {
        let rooms = snapshotToArray(resp);
        console.log('Rooms-------------', rooms);
        resolve(rooms);
      });
    });
  }

  getChat(roomKey) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('chatrooms1/' + roomKey + '/chats').on('value', resp => {
        let chat = snapshotToArray(resp);
        console.log('chat-------------', chat);
        resolve(chat);
      });
    });
  }



  
}
