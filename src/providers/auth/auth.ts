import { GooglePlus } from '@ionic-native/google-plus';
import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../alert/alert';

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { App, Events } from 'ionic-angular';

@Injectable()
export class AuthProvider {
  localStorageUserKey = "InfluAppAuth";
  localStorageCartKey = 'InfluCart';
  localStorageLanguageKey = "InfluAppLang";
  localStorageCategoryKey = "InfluAppCate";
  localStorageNotiData = "InfluNotiData";
  localStorageNotiCount = "InfluNotiUnreadCount";
  mediaLink = 'https://app-api.influen.site/assets/media/'
  onUserDetailChanged: BehaviorSubject<any> = new BehaviorSubject(null);
  onCateChanged: BehaviorSubject<any> = new BehaviorSubject(null);
  cartItem = new Array();
  unread_cound: any = 0;
  unread_chat_count: any = 0;
  unread_noti: any = 0;
  influ_tab_type:any='';
  constructor(public app: App,
    public alert: AlertProvider,
    public trans: TranslateService,
    public google: GooglePlus,
    public events: Events) {
    console.log('Hello AuthProvider Provider');
  }


  /***************************************************************************************************
  *******************************************GET USER DETAILS*************************************************
  ****************************************************************************************************/

  getUserDetails() {
    let user = JSON.parse(localStorage.getItem(this.localStorageUserKey));

    return user;
  }

  getCurrentCompanyId() {
    let user = JSON.parse(localStorage.getItem(this.localStorageUserKey));

    return user.company_tbl_id;
  }

  getlogo() {
    let user = JSON.parse(localStorage.getItem(this.localStorageUserKey));

    return user.company.company_logo;
  }
  getcolor() {
    let user = JSON.parse(localStorage.getItem(this.localStorageUserKey));

    return user.company.color;
  }

  getCurrentUserId() {
    let user = JSON.parse(localStorage.getItem(this.localStorageUserKey));
    return user.id;
  }

  updateUserDetails(details: any) {
    localStorage.setItem(this.localStorageUserKey, JSON.stringify(details));
    this.onUserDetailChanged.next(details);
  }

  updateCart(cart: any) {
    this.cartItem.push(cart);
    localStorage.setItem(this.localStorageCartKey, JSON.stringify(this.cartItem));
  }

  insertCarts(carts: any) {
    localStorage.setItem(this.localStorageCartKey, JSON.stringify(carts));
  }

  getCart() {
    let cart = JSON.parse(localStorage.getItem(this.localStorageCartKey));
    return cart;
  }

  removeCartItem(index: any) {
    var cartItem = this.getCart();
    cartItem.splice(index, 1);
    localStorage.setItem(this.localStorageCartKey, JSON.stringify(cartItem));
  }

  removeCart() {
    localStorage.removeItem(this.localStorageCartKey);
  }

  removeUserDetails() {
    localStorage.removeItem(this.localStorageUserKey);
  }




  removeAllUserDetails() {
    // localStorage.clear();
    localStorage.removeItem(this.localStorageUserKey);
    localStorage.removeItem(this.localStorageCartKey);

  }

  isUserLoggedIn() {
    let user = JSON.parse(localStorage.getItem(this.localStorageUserKey));
    if (user) {
      return true;
    }
    else {
      return false;
    }
  }

  /***************************************************************************************************
  *******************************************GET LANGUAGE DETAILS*************************************************
  ****************************************************************************************************/

  getUserLanguage() {
    let lang = localStorage.getItem(this.localStorageLanguageKey);
    return lang;
  }

  updateUserLanguage(lang: any) {
    localStorage.setItem(this.localStorageLanguageKey, lang);
  }

  /***************************************************************************************************
  *******************************************GET SELECTED CATEGORY************************************
  ****************************************************************************************************/


  getCate() {
    let lang = localStorage.getItem(this.localStorageCategoryKey);
    return lang;
  }

  updateCate(id: any) {
    localStorage.setItem(this.localStorageCategoryKey, JSON.stringify(id));
    this.onCateChanged.next(id);
  }


  removeCate() {
    localStorage.removeItem(this.localStorageCategoryKey);
  }


  /***************************************************************************************************
  *******************************************Noti Data************************************************
  ****************************************************************************************************/


  getNotiData() {
    let data = localStorage.getItem(this.localStorageNotiData);
    return JSON.parse(data);
  }

  updateNotiData(data: any) {
    localStorage.setItem(this.localStorageNotiData, JSON.stringify(data));
  }


  /***************************************************************************************************
  *******************************************Unread Msg cont************************************************
  ****************************************************************************************************/


  getCount() {
    let data = localStorage.getItem(this.localStorageNotiCount);
    return JSON.parse(data);
  }

  updateCount(data: any) {
    localStorage.setItem(this.localStorageNotiCount, JSON.stringify(data));
  }

  logout() {
    this.alert.confirmationAlert(this.trans.instant('ALERT'), this.trans.instant('DO_YOU_WANT_TO_LOGOUT')).then(r => {
      if (r) {
        this.app.getRootNav().popToRoot().then(() => {
          this.events.publish('LogOut');
          // this.google.logout().then(r => {
          console.log('logout from gmail res------', r);

          this.removeUserDetails();
          window.location.href = "";
          // });
        })
      }
    })
  }

  getFloat(string) {
    return parseFloat(string)
  }

  guest_id() {
    return '123456';
  }
}
