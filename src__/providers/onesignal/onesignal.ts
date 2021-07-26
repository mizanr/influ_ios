import { Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { OneSignal } from '@ionic-native/onesignal';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
/*
  Generated class for the OnesignalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
//$ ionic cordova plugin add onesignal-cordova-plugin
//$ npm install --save @ionic-native/onesignal@4

@Injectable()
export class OnesignalProvider {

  open: BehaviorSubject<any> = new BehaviorSubject(null);
  received: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public http: HttpClient,
    // private oneSignal: OneSignal,
    private platform: Platform
  ) {
    console.log('Hello OnesignalProvider Provider');

  }


  init() {
    // if (this.platform.is("cordova")) {
    //   console.log("onesignal initialization ----------------------------");
    //   this.oneSignal.startInit('e9e0534e-18dd-4951-9ab7-1e62be4f03af', '497858804740'); //akash.webwiders@gmail.com onesignal account

    //   this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    //   this.oneSignal.handleNotificationReceived().subscribe((data: any) => {
    //     let newData = data.payload.additionalData;
    //     if (newData) {
    //       newData["isFocus"] = data.isAppInFocus;
    //       this.received.next(newData);
    //     }

    //   });

    //   this.oneSignal.handleNotificationOpened().subscribe((data: any) => {
    //     let newData = data.notification.payload.additionalData;
    //     if (newData) {
    //       newData["isFocus"] = data.notification.isAppInFocus;
    //       this.open.next(newData);
    //     }

    //   });
    //   this.oneSignal.endInit();


    // }
    // else {
    //   this.received.next(0);
    //   this.open.next(0);
    // }




  }


  id() {
    return new Promise((resolve, reject) => {
      //   if (this.platform.is("cordova")) {
      //     this.oneSignal.getIds().then(identity => {
      //       resolve(identity.userId);
      //     });
      //   } else {
      resolve(0);
      //   }
    });

  }


  /**************one signal**************** 
  this.onesignal.init();
  this.onesignal.open.subscribe((data:any)=>{
           if(data!=0){
              if(data.isFocus){

              }
         }
  });
  this.onesignal.received.subscribe((data:any)=>{
            if(data!=0){
                  if(data.isFocus){

                  }
            }
  });
    *************one signal end**************** */


}
