
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController, NavParams, IonicPage } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth/auth';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WithdrawalPopupPage } from '../withdrawal-popup/withdrawal-popup';
declare var paypal;
@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  type:any='trans';
  earnings:any=new Array();
histories:any=new Array();
user_info:any;
withdrawal_amount:any='';
is_dithdrawal:boolean=false;
paypal_accounts:any=[];
amount:any='';
paypal_email:any;
is_paypal_check:any=false;

  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     public auth: AuthProvider,
     public translate:TranslateService,
    public api: RestApiProvider,
    private iab: InAppBrowser,
    public alert: AlertProvider,
     public modalCtrl: ModalController) {
      this.user_info=this.auth.getUserDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }

  ionViewWillEnter(){
    this.get_user_info();
    this.get_history();
    this.get_earning();
  }

  amount_popup(paypal_account:any) {
    // this.is_dithdrawal=!this.is_dithdrawal;
    const modal = this.modalCtrl.create('TransferPage',{paypal_email:paypal_account.paypal_id},{cssClass:'moremodel', showBackdrop:true, enableBackdropDismiss:true});
     modal.present();
     modal.onDidDismiss((data) => {
       if(data){
         this.ionViewWillEnter();
       }
     })
  }

  opne_inapp() {
    // this.alert.presentToast('msizantest in app button clicked','bottom');
    const browser = this.iab.create('https://app-api.influen.site/button.php', '_blank','location=no,clearsessioncache=yes');
    browser.show();
    // this.alert.presentToast('miszantest created -----','bottom');
    browser.insertCSS({code:"body{background-color:white;height:100vh;width:100%;}"});
    // browser.show();
    browser.on('loadstop').subscribe(event => {  
      console.log('load stop callled........................');
      // var interval = setInterval(() => {
        browser.executeScript({code: "JSON.parse(localStorage.getItem('paypalsession'))"})
        .then((session) => {      
          // JSON.parse(localStorage.getItem('paypalsession'));
          console.log('inapp =========',session);
          if(session&&session!=null){
              if(session[0].status==1){
                browser.close();
                browser.executeScript({code: "localStorage.removeItem('paypalsession')"}).then(() =>{});
                // clearInterval(interval);
                let Data = {
                  paypal_id:session[0].email,
                  user_id:this.auth.getCurrentUserId(),
                }
                this.api.get(Data,1,'add_paypal_account').then((res:any) => {
                  console.log(res);
                  if(res.status==1){
                    this.get_user_info();
                    // this.paypay_account();
                  }
                })
              } else {
              }
            // },1000) 
          }         
        });
      // }, 1000);
   });
  }

  trans(){
    if(this.paypal_accounts.length>0){
      // this.paypay_account();
      this.opne_inapp();
    } else {
      this.opne_inapp();
    }
  }

  get_history() {
    let url = `withdraw_request_list?user_id=${this.auth.getCurrentUserId()}`;
    this.api.get({},0,url).then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.histories=res.data;
      }
    })
  }

  get_earning() {
    let url = `GetInfluEarning?user_id=${this.auth.getCurrentUserId()}`;
    this.api.get({},0,url).then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.earnings=res.data;
      }
    })
  }

  service_detail(id) {
    this.navCtrl.push('PostDetailPage', { PostId: id });
  }

  job_detail(id) {
    this.navCtrl.push('JobDetialPage', { JobId: id });
  }

  profile(id) {
    this.navCtrl.push('CompanyProfilePage', { ID: id });
  }

  get_user_info() {
    let url = `GetUserProfile?id=${this.auth.getCurrentUserId()}&sessionId=${this.auth.getCurrentUserId()}`;
    this.api.get({},1,url).then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.user_info=res.data;
        this.paypal_accounts=res.paypal_account;

        if(this.paypal_accounts.length>0){
          this.paypal_email=this.paypal_accounts[0].paypal_id;
          this.paypal_email=this.paypal_accounts[0].ischecked=true;
          this.is_paypal_check=true;
        }

        this.amount=parseInt(this.user_info.wallet_amount)>parseInt(this.user_info.max_withdraw_amt)?this.user_info.max_withdraw_amt:this.user_info.wallet_amount;
      }
    })
  }

  

  dithdrawal() {
    console.log(this.withdrawal_amount,this.user_info.min_withdraw_amt);
    if(parseInt(this.withdrawal_amount)<parseInt(this.user_info.min_withdraw_amt)){
      this.alert.presentToast(`Minmum withdrawal amount $${this.user_info.min_withdraw_amt}.`,'bottom');
      return;
    } 
    if(parseInt(this.withdrawal_amount)>parseInt('10000')){
      this.alert.presentToast(`Maximum withdrawal amount $10000.`,'bottom');
      return;
    }
    if(parseInt(this.withdrawal_amount)>parseInt(this.user_info.wallet_amount)){
      this.alert.presentToast(`Not enough amount.`,'bottom');
      return;
    }

    let url = `withdraw_request?amount=${this.withdrawal_amount}&user_id=${this.auth.getCurrentUserId()}`;
    this.api.get({},1,url).then((res:any) => {
      if(res.status==1){
      } else {
        this.alert.presentToast(res.message,"bottom");
      }
    })
  }

  reject(h) {
    this.alert.show(this.translate.instant('REJECT'),h.reason);
    
  }

  paypay_account() {
    const modal = this.modalCtrl.create('PaypalAccountPage',{},{cssClass:'moremodel', showBackdrop:true, enableBackdropDismiss:true});
     modal.present();
     modal.onDidDismiss((data) => {
       if(data){
         if(data==1){
           this.opne_inapp();
         } else if(data == 2){
          this.get_user_info();
         } else {
          console.log(data);
          this.amount_popup(data);
         }
        //  this.ionViewWillEnter();
       }
     })
  }

  // paypal_login() {    
  //   paypal.use( ['login'], function (login) {
  //     login.render ({
  //       "appid":"AWB3lHZ7zhjGTNx4ZI3g_NNhEf0WZwMaSid4Ixu77ihJbVN9KB-Xpp6y3yMkcnO_IeO8An3Pfp_5xSYR",
  //       "authend":"sandbox",
  //       "scopes":"email",
  //       "containerid":"lippButton",
  //       "responseType":"code",
  //       "locale":"en-us",
  //       "buttonType":"LWP",
  //       "buttonShape":"pill",
  //       "buttonSize":"lg",
  //       "fullPage":"true",
  //       "returnurl":"https://www.webwiders.com/WEB01/Influ/resp/get_paypal_info"
  //     });
  //   });    
  // }


  withdrawal_submit() {
    if(parseInt(this.amount)<parseInt(this.user_info.min_withdraw_amt)){
      // this.alert.presentToast(this.trans.instant('MINMUM_WITHDRAWAL_AMOUNT')`$${this.user_info.min_withdraw_amt}.`,'bottom');
      this.alert.presentToast(`Minmum withdrawal amount$${this.user_info.min_withdraw_amt}.`,'bottom');
      return;
    }
    if(parseInt(this.amount)>parseInt(this.user_info.max_withdraw_amt)){
      // this.alert.presentToast(this.trans.instant('MAXMUM_WITHDRAWAL_AMOUNT')`$${this.user_info.max_withdraw_amt}.`,'bottom');
      this.alert.presentToast(`Maxmum withdrawal amount $${this.user_info.max_withdraw_amt}.`,'bottom');
      return;
    }


    if(parseInt(this.amount)>parseInt(this.user_info.wallet_amount)){
      // this.alert.presentToast(this.trans.instant('MAXMUM_WITHDRAWAL_AMOUNT')`$${this.user_info.max_withdraw_amt}.`,'bottom');
      this.alert.presentToast(`Insufficient Fund.`,'bottom');
      return;
    }



    let url = `withdraw_request?amount=${this.amount}&user_id=${this.auth.getCurrentUserId()}&email_id=${this.paypal_email}`;
    this.api.get({},1,url).then((res:any) => {
      if(res.status==1){
        this.is_paypal_check=false;
        this.ionViewWillEnter();
        this.alert.presentToast(res.message,"bottom");
        // this.viewCtrl.dismiss(true);
      } else {
        this.alert.presentToast(res.message,"bottom");
      }
    })
  }

  paypal_checkevent(ev,paypal:any,inx:any) {
    // ev.stopPropagation();
    console.log(ev);
    // if(ev.value==true){

    // }
    if(ev.value==true){
      for(let i =0;i<this.paypal_accounts.length;i++){
        if(inx!=i){
          this.paypal_accounts[i].ischecked=false;
        } else 
        {
          this.paypal_accounts[inx].ischecked=true;
          // this.paypal_email=this.paypal_accounts[inx].paypal_id;
          // this.is_paypal_check=true;
        }
      }
    }
   

    let f = this.paypal_accounts.filter((item) => {
      return item.ischecked;
    })

    console.log(f);

    if(f.length>0){
      this.paypal_email=f[0].paypal_id;
      this.is_paypal_check=true;
    } else {
      this.paypal_email='';
      this.is_paypal_check=false;
    }

  }

  delete(l) {
    this.alert.confirmationAlert(
      this.translate.instant('REMOVE_ACC'),
      this.translate.instant('ARE_YOU_SURE')).then((res:any) => {
      if(res){
        let Data = {
          paypal_id:l.paypal_id,
          user_id:this.auth.getCurrentUserId(),
        }
        this.api.get(Data,1,'remove_paypal_account').then((res:any) => {
          console.log(res);
          if(res.status==1){
            this.get_user_info();
            // this.paypay_account();
          }
        })
      }
    })
  }

  paypal_popup() {
    const modal = this.modalCtrl.create(WithdrawalPopupPage,{},{cssClass:'moremodel',enableBackdropDismiss:true});
    modal.present();
    modal.onDidDismiss((data) => {
      console.log(data);
      if(data){
        let Data = {
          paypal_id:data,
          user_id:this.auth.getCurrentUserId(),
        }
        this.api.get(Data,1,'add_paypal_account').then((res:any) => {
          console.log(res);
          if(res.status==1){
            this.get_user_info();
            // this.paypay_account();
          }
        })
      }
    })
  }

}
