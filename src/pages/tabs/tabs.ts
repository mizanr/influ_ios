import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { NavParams, Tabs, Events, ModalController } from 'ionic-angular';
import { AddJobPage } from './../add-job/add-job';
import { Component, ViewChild } from '@angular/core';
import * as firebase from 'Firebase';
import { Observable } from 'Rxjs/rx';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('companyTabs') companyTabRef: Tabs;
  @ViewChild('influTabs') influTabRef: Tabs;

  // observableVar: any;
  mesgCount=0;
  count: any;
  isguest:any;

  // For login user

  tab1Root = 'HomePage';
  tab2Root = 'AddJobPage';
  tab3Root = 'ChatPage';
  tab4Root = 'CompanyProfilePage';

  tab5Root = 'HomeInfluencerPage';
  tab6Root = 'AddjobInfluPage';
  tab7Root = 'ChatPage';
  tab8Root = 'InfluencerProfilePage';


  // For Guest user

  tab9Root = 'HomePage';
  tab10Root = '';
  tab11Root = '';
  tab12Root = '';

  tab13Root = 'HomeInfluencerPage';
  tab14Root = '';
  tab15Root = '';
  tab16Root = '';

  constructor(public navParams: NavParams,
    public auth: AuthProvider,
    public events: Events,
    public modal:ModalController,
    public api: RestApiProvider) {
      this.isguest = JSON.parse(localStorage.getItem('guest')) || 0;
      console.log('isguest--------------',this.isguest);

    this.events.subscribe('SelectTab', (index) => {
      if (this.auth.getUserDetails().user_type == 1) {
        this.companyTabRef.select(index);
      } else {
        this.influTabRef.select(index);
      }
    });
    if(this.isguest==0){
      this.getNotiUnread(0);
     this.getUnreadMessageCount();
    }
    this.events.subscribe('GetNotiCount', r => {
      this.getNotiUnread(0);
    })
    this.events.subscribe('chat_count_start',()=>{
      this.getUnreadMessageCount();
    })
    this.events.subscribe('chat_count_stop',()=>{
      firebase.database().ref('chatrooms1/').off('value');
    })
    // this.observableVar = Observable.interval(3000).subscribe(() => {
    //   this.getNotiUnread(0);
    // });
     
  }


  getUnreadMessageCount(){
    firebase.database().ref('chatrooms1/').on('value', (resp: any) => {
      this.mesgCount = 0;
      resp.forEach(childSnapshot => {
        let item = childSnapshot.val();
        if (item.user1 == this.auth.getCurrentUserId() || item.user2 == this.auth.getCurrentUserId()) {
          item.key = childSnapshot.key;
          let otheruser = (item.user1 == this.auth.getCurrentUserId()) ? item.user2 : item.user1;
          let m = firebase.database().ref('chatrooms1/' + item.key + '/chats').orderByChild('unread_' + otheruser).equalTo(true);//.orderByChild('sender_id');//.equalTo(item["other_user"]);
          m.on('value', (aaa) => {
            item['unread_msg'] = aaa.numChildren();
            // console.log('tabs data ',item['unread_msg']);
            this.mesgCount = this.mesgCount + item['unread_msg'];
            
            m.off('value');
          })
        }
      });
    });
  }


  getNotiUnread(s: any) {
    // this.count=11;
    let data = {
      "user_id": this.auth.getCurrentUserId(),
    };
    this.api.get(data, s, 'unread_counts').then((result: any) => {
      if (result.status == "1") {
        // console.log(result);
        this.auth.unread_noti = result.unread_noti;
        //  this.count = result.unread_message;
      } else {
      }
    }, (err) => {
    });
  }



  tabChanged($ev) {
    console.log("Tab Change------------------",$ev)
  //  $ev.setRoot($ev.root);
    $ev.popToRoot();//($ev.root);
  }

  guestTabChanged($ev) {
    console.log($ev);
    if($ev.root=='') {
      const modal = this.modal.create('LoginPopupPage',{},{cssClass:'moremodel',enableBackdropDismiss:true});
      modal.present();
    }
  }

}
