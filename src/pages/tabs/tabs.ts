import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { NavParams, Tabs, Events } from 'ionic-angular';
import { AddJobPage } from './../add-job/add-job';
import { Component, ViewChild } from '@angular/core';

import { Observable } from 'Rxjs/rx';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('companyTabs') companyTabRef: Tabs;
  @ViewChild('influTabs') influTabRef: Tabs;

  observableVar: any;

  count: any;
  tab1Root = 'HomePage';
  tab2Root = 'AddJobPage';
  tab3Root = 'ChatPage';
  tab4Root = 'CompanyProfilePage';


  tab5Root = 'HomeInfluencerPage';
  tab6Root = 'AddjobInfluPage';
  tab7Root = 'ChatPage';
  tab8Root = 'InfluencerProfilePage';

  constructor(public navParams: NavParams,
    public auth: AuthProvider,
    public events: Events,
    public api: RestApiProvider) {
    this.events.subscribe('SelectTab', (index) => {
      if (this.auth.getUserDetails().user_type == 1) {
        this.companyTabRef.select(index);
      } else {
        this.influTabRef.select(index);
      }
    });


    this.observableVar = Observable.interval(3000).subscribe(() => {
      this.getNotiUnread(0);
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
        this.count = result.unread_message;
      } else {
      }
    }, (err) => {
    });
  }
}
