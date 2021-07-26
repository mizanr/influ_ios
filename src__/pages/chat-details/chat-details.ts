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
@IonicPage()
@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html',
})
export class ChatDetailsPage {
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
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: RestApiProvider,
    public auth: AuthProvider,
    public alert: AlertProvider,
    public imageP: ImageProvider,
    public actionSheetCtrl: ActionSheetController,
    public trans: TranslateService,
    public media: MediaProvider,
    public download: DownloadProvider,
    public player: PlayAudioProvider) {

    if (this.auth.getUserDetails().user_type == 1) {
      this.senderImage = this.auth.getUserDetails().company_logo
    } else {
      this.senderImage = this.auth.getUserDetails().image
    }
  }

  ionViewWillEnter() {
    this.startConversation();
    // this.chatReaded();
  }

  ionViewWillLeave() {
    this.player.resetPlayer();
  }

  getChat(s) {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
      "JobId": this.navParams.get('JobId'),
      "receiver": this.navParams.get('ReceiverId'),
    }
    this.api.get(data, s, 'GetChatDataBetweenUsers').then((result: any) => {
      this.job = result.Job_data;
      if (result.status == 1) {
        console.log(result);
        // this.chat = result.data;
        this.msgPostlength = result.data.length;
        if (this.msgPrelength != this.msgPostlength) {
          this.chat = result.data;
          setTimeout(
            () => {
              this.content.scrollToBottom();
            },
            100
          );
        }
        this.msgPrelength = this.msgPostlength;

      }
      else {
      }
    })
  }


  ionViewDidLeave() {
    this.observableVar.unsubscribe();
    // this.navCtrl.popToRoot();
  }

  startConversation() {
    this.getChat(1);
    // // let user =  JSON.parse(localStorage.getItem("userDetailsUserGF"))
    // this.currentUser = this.auth.getCurrentUserId();
    // this.currentUsername = this.navParams.get("name");
    this.observableVar = Observable.interval(3000).subscribe(() => {
      this.getChat(0);
    });
  }


  send() {
    this.sendBtnDisabledS = true;
    let m = this.msg.trim();
    let k = {
      msg_type: 'text',
      receiver: this.navParams.get('ReceiverId'),
      message: m,
      sender: {
        id: this.auth.getCurrentUserId(),
        image: this.senderImage
      },
      time_ago: "Just Now"
    };
    this.chat.push(k);

    this.msg = "";
    setTimeout(
      () => {
        this.content.scrollToBottom();
      },
      100
    );
    this.sendBtnDisabledS = false;
    let Data = {
      JobId: { "value": this.navParams.get('JobId'), "type": "NO" },
      sender: { "value": this.auth.getCurrentUserId(), "type": "NO" },
      receiver: { "value": this.navParams.get('ReceiverId'), "type": "NO" },
      message: { "value": m, "type": "MSG" },
      msg_type: { "value": 'text', "type": "NO" },
    }
    this.api.postDataNoLoader(Data, 0, 'SendMessage').then((result: any) => {
      console.log(result);
      if (result.status == 1) {

        this.msg = "";
      } else {
      }
    })
  }


  sendFile(blob1, name1, type, p) {
    let k = {
      msg_type: type,
      receiver: this.navParams.get('ReceiverId'),
      preview: p,
      sender: {
        id: this.auth.getCurrentUserId(),
        image: this.senderImage
      }
    };
    this.chat.push(k);
    if (type == 'audio') {
      this.media.resetRecording();
    }
    setTimeout(
      () => {
        this.content.scrollToBottom();
      },
      100
    );
    console.log('type---------------', type);

    let data = {
      // action: { value: 'Send_media', type: 'NO' },
      file: { value: blob1, type: 'NO', name: name1 },
      file_type: { value: type, type: 'NO' },
    }

    this.api.postDataNoLoader(data, 0, 'Send_media').then((res: any) => {
      if (res.status == "1") {
        this.sendImg(res.file_name, type);

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
        this.send();
      }
    }
    else {
      setTimeout(() => {
        this.content.scrollToBottom(0);
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
}
