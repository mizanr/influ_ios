import { OnesignalProvider } from './../../providers/onesignal/onesignal';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { PlayAudioProvider } from './../../providers/play-audio/play-audio';
import { DownloadProvider } from './../../providers/download/download';
import { TranslateService } from '@ngx-translate/core';
import { ImageProvider } from './../../providers/image/image';
import { AlertProvider } from './../../providers/alert/alert';
import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage, Content, ActionSheetController } from 'ionic-angular';

import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";
import { MediaProvider } from '../../providers/media/media';
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
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {
  ref = firebase.database().ref('active_users');
  chats_ref: any;
  chat_room_ref: any
  job: any;
  chat: any = [];
  observableVar: Subscription;
  msgPrelength = 0;
  msgPostlength = 0;
  msg: any = "";
  sendBtnDisabledS = false;
  toggled: boolean = false;
  message: string;
  baseUrl = "https://www.webwiders.com/WEB01/Influ/assets/media/";
  senderImage: any;
  roomKey: any;
  other_user: any;
  current_user: any;
  other_user_device: any = '';
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: RestApiProvider,
    public auth: AuthProvider,
    public alert: AlertProvider,
    public imageP: ImageProvider,
    public actionSheetCtrl: ActionSheetController,
    public trans: TranslateService,
    public media: MediaProvider,
    public download: DownloadProvider,
    public player: PlayAudioProvider,
    public fireP: FirebaseProvider,
    public onesignal: OnesignalProvider) {
    this.other_user = this.navParams.get('other_user');
    this.current_user = this.auth.getUserDetails();
    console.log('other userss', this.other_user);
    this.senderImage = this.auth.getUserDetails().image;
    this.roomKey = navParams.get('RoomKey');
    console.log('Roomkey---------', this.roomKey);

    this.chat_room_ref = firebase.database().ref('chatrooms1/' + this.roomKey);
    this.chats_ref = firebase.database().ref('chatrooms1/' + this.roomKey + '/chats');

  }


  snapshotToArray = snapshot => {
    let returnArr = [];


    return returnArr;
  };


  ionViewWillLeave() {
    this.player.resetPlayer();
    this.chats_ref.off('value');
    // let data={

    // }
    // data['user_'+this.auth.getCurrentUserId()+'_open']=true;
    // this.chat_room.update(data)
  }



  ionViewWillEnter() {
    this.getDevice();
    this.chats_ref.on('value', (resp: any) => {
      this.chat = [];
      resp.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        this.chat.push(item);
        // console.log('item------', item);
        let key = 'unread_' + this.other_user.id;
        if (this.other_user && item[key] == true) {

          this.mark_as_read_chat(item, key);
        };
        let s: any = 'unread_' + this.auth.getCurrentUserId();
        console.log(item.sender_id, '----', item.noti_status, '------------', item[s]);

        if (item.sender_id == this.auth.getCurrentUserId() && item.noti_status == 0 && item[s] == true) {
          console.log('In if----------');

          setTimeout(() => {
            this.check_noti_status(s);
            // this.sendNoti(item);            
          }, 2000);
        }
      });
      setTimeout(() => {
        if (this.content) {
          this.content.scrollToBottom();
        }
      }, 100)
      console.log('chat-------------', this.chat);
    });
  }


  check_noti_status(s) {
    for (let i = 0; i < this.chat.length; i++) {
      let item: any = this.chat[i];
      console.log('Item in check noti----', item);

      if (item.sender_id == this.auth.getCurrentUserId() && item.noti_status == 0 && item[s] == true) {
        if(this.other_user.is_noti==1){
          this.sendNoti(item);
        }
        return;
      }
    }

  }


  mark_as_read_chat(item: any, key) {
    console.log("mark as read chat--------");
    let data = {};
    data[key] = false;
    let chat_ref = firebase.database().ref('chatrooms1/' + this.roomKey + '/chats/' + item.key);
    chat_ref.update(data);
  }


  sendNoti(obj) {

    let u = this.auth.getUserDetails();
    let msg = u.user_type == 1 ? u.company_name : u.first_name;
    let d = msg + ' has sent you a message!';
    let k = {
      screen: "ChatDetailsPage",
      RoomKey: this.roomKey,
      JobTitle: this.navParams.get('JobTitle'),
      JobId: this.navParams.get('JobId'),
      other_user: this.auth.getUserDetails(),
    }
    console.log('Noti data sending--------------------', k);
    console.log('Msg at sending--------------------', d);
    this.onesignal.sendPushNotification(d, [this.other_user_device], k, 'Influ!').then(r => {
      if (r) {
        this.mark_noti_send(obj)
      }
    });
  }

  mark_noti_send(k) {
    let data = {};
    data['noti_status'] = 1;
    let chat_ref = firebase.database().ref('chatrooms1/' + this.roomKey + '/chats/' + k.key);
    chat_ref.update(data);
  }

  send(msg: string, type: string) {
    msg = msg.trim();
    if (!msg) {
      return;
    }



    let newData = firebase.database().ref('chatrooms1/' + this.roomKey + '/chats').push();

    // let obj = firebase.database().ref

    // console.log('Roomkey-------------', chat_room.child('last_message'));
    // console.log('receiver-------------', this.navParams.get('ReceiverId'));
    let time = (new Date()).toISOString();

    let data = {
      msg_type: type,
      message: msg,
      time_ago: time,
      sender_id: this.auth.getCurrentUserId(),
      sender_image: this.senderImage
    }
    data["unread_" + this.auth.getCurrentUserId()] = true;
    data["noti_status"] = 0;


    newData.set(data);

    this.chat_room_ref.update({ last_message: msg, last_message_at: time })
    this.msg = '';
  }



  getDevice() {
    let data = {
      "user_id": this.other_user.id,
    };
    this.api.get(data, 0, 'UserListComma').then((result: any) => {
      if (result.status == 1) {
        this.other_user_device = result.data[0].device_id
      }
    }, (err) => {
    });
  }

  sendFile(blob1, name1, type, p) {
    // let k = {
    //   msg_type: type,
    //   receiver: this.navParams.get('ReceiverId'),
    //   preview: p,
    //   sender: {
    //     id: this.auth.getCurrentUserId(),
    //     image: this.senderImage
    //   }
    // };
    // this.chat.push(k);
    if (type == 'audio') {
      this.media.resetRecording();
    }

    let data = {
      // action: { value: 'Send_media', type: 'NO' },
      file: { value: blob1, type: 'NO', name: name1 },
      file_type: { value: type, type: 'NO' },
    }

    this.api.postDataNoLoader(data, 0, 'Send_media').then((res: any) => {
      if (res.status == "1") {
        this.send(res.file_name, type);

      } else {
        // this.alertP.show('Alert!', res.message);
      }
    })
  }


  sendImg(fileName, typ) {
    let Data = {
      JobId: { "value": this.navParams.get('JobId'), "type": "NO" },
      sender: { "value": this.auth.getCurrentUserId(), "type": "NO" },
      receiver: { "value": this.navParams.get('ReceiverId'), "type": "NO" },
      message: { "value": fileName, "type": "NO" },
      msg_type: { "value": typ, "type": "NO" },

    }
    this.api.postDataNoLoader(Data, 0, 'SendMessage').then((result: any) => {
      console.log(result);
      if (result.status == 1) {

        if (typ == 'audio') {
          this.media.resetRecording();
        }
      } else {
      }
    })
  }

  editImage() {
    this.imageP.getImage().then((res: any) => {
      let preview = res;
      this.imageP.imgURItoBlob(res).then((b) => {

        this.sendFile(b, this.imageP.generateImageName('hello.png'), 'image', preview);

      })
    })
  }



  openSlider(imgNameArr, index) {
    let profileModal = this.api.modalCtrl.create('ImagesViewerPage', { imgs: imgNameArr, index: index });
    profileModal.present();
  }

  // chatReaded() {
  //   let data = {
  //     "user_id": this.auth.getCurrentUserId(),
  //     "JobId": this.navParams.get('JobId'),
  //     "receiver": this.navParams.get('ReceiverId'),
  //   }
  //   this.api.get(data, 0, 'unread_chat').then((result: any) => {
  //     this.job = result.Job_data;
  //     if (result.status == 1) {

  //     }
  //     else {
  //     }
  //   })

  // }

  attach() {

    const actionSheet = this.actionSheetCtrl.create({
      // title: this.trans.instant('REPORT_THIS_POST'),
      buttons: [
        {
          text: this.trans.instant('SEND_IMAGE'),
          handler: () => {
            this.editImage();
          }
        },
        {
          text: this.trans.instant('SEND_FILE'),
          handler: () => {
            this.media.getFile().then((res1: any) => {
              console.log('res1------------', res1);
              if (res1 != 0) {
                if (res1.file.type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || res1.file.type == 'application/msword' || res1.file.type == 'application/pdf') {

                  this.sendFile(res1.file, res1.name, 'file', res1.name);
                } else {
                  this.alert.show('Alert', 'Only Pdf,Ppt & Document files are allowed!');
                  return;
                }
              }
            });
          }
        },
        {
          text: this.trans.instant('CANCEL'),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  openFile(link) {
    console.log('link----=-=-=-=', link);

    this.download.checkFileExistOrNot(link).then((res) => {
      if (res == 1) {
        this.alert.confirmationAlert(this.trans.instant('CONFIRMATION'), this.trans.instant('FILE_ALREADY_EXISTS')).then((res) => {
          if (res) {

            this.download.download(link);
          }

        });
      }
      else {
        this.download.download(link);
      }
    })
  }


  handleSelection(event) {
    console.log(event);

    this.msg += event.char;
  }


  startaudio() {
    // if (this.friend_status.block_by_friend.indexOf('full') > -1) {
    //   this.alert.presentToast(this.profile.full_name + " has blocked you", "bottom")
    // } else if (this.friend_status.block_by_friend.indexOf('all') > -1) {
    //   this.alert.presentToast(this.profile.full_name + " has blocked you for media", "bottom")
    // }
    // else {
    this.media.startAudioRecording();
    // }
  }


  openAudioModal(detail) {
    const modal = this.api.modalCtrl.create('AudioPlayerPage', { detail: detail }, { cssClass: 'radioModal', showBackdrop: true, enableBackdropDismiss: true })
    modal.present();
    modal.onDidDismiss((res) => {
      this.media.resetRecording();
    })
  }


  sss(e) {

    if (e.keyCode == 8 || e.keyCode == 229) {
      this.content.resize();
    }
  }



  eventHandler(ev: any) {
    this.content.resize();
    if (this.msg.length > 0) {
      if (ev == '13' || ev == 13) {
        this.send(this.msg, 'text');
      }
    }
    else {
      setTimeout(() => {
        // this.content.scrollToBottom(0);
      }, 10)
    }
  }


  run_audio(item: any, index: any) {
    // if(item.isplayaudio){
    //   this.player.playaudio();
    // }else{
    this.player.resetPlayer();
    for (let i = 0; i < this.chat.length; i++) {
      if (this.chat[i].msg_type == 'audio' && index == i) {
        console.log('Post to play-----', this.chat[index]);

        this.player.filepath = this.auth.mediaLink + this.chat[index].message;
        this.player.fromserver(this.chat[index]);
        console.log('filepath-------', this.player.filepath);

        this.chat[i].isplayaudio = true;
        // let m = this.player.getMMSS(this.player.duration-this.player.position);
        // this.posts[i]['audio_duration']=m;
      } else {
        this.chat[i].isplayaudio = false;
      }
    }
    // }
  }


  audio_pauseaudio(index: any) {
    for (let i = 0; i < this.chat.length; i++) {
      if (index == i) {
        this.player.pauseaudio();
        this.player.resetPlayer();
        this.chat[i]['isplayaudio'] = false;
      } else {
        this.chat[i]['isplayaudio'] = false;
      }
    }
    // this.media.pauseaudio();
  }


  // sendMessage() {
  //   let newData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();
  //   console.log('Roomkey-------------',this.roomkey);

  //   newData.set({
  //     type: this.data.type,
  //     user: this.data.nickname,
  //     message: this.data.message,
  //     sendDate: Date()
  //   });
  //   this.data.message = '';
  // }

}
