import { FirebaseProvider } from './../../providers/firebase/firebase';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { k } from '@angular/core/src/render3';


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


}
