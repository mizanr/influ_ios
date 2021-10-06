
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController, NavParams, IonicPage } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth/auth';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { InAppBrowser } from '@ionic-native/in-app-browser';
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
  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     public auth: AuthProvider,
     public translate:TranslateService,
    public api: RestApiProvider,
    private iab: InAppBrowser,
    public alert: AlertProvider,
     public modalCtrl: ModalController) {
      this.paypal_login();
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

  amount_popup() {
    // this.is_dithdrawal=!this.is_dithdrawal;
    const modal = this.modalCtrl.create('TransferPage',{},{cssClass:'moremodel', showBackdrop:true, enableBackdropDismiss:true});
     modal.present();
     modal.onDidDismiss((data) => {
       if(data){
         this.ionViewWillEnter();
       }
     })
  }

  trans(){
    if(this.user_info.paypal_email!=''){
      this.amount_popup();
    } else {
      const browser = this.iab.create('https://www.webwiders.com/WEB01/Influ/button.php', '_blank', 'location=yes');
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
                  // clearInterval(interval);
                  let Data = {
                    email:session[0].email,
                    user_id:this.auth.getCurrentUserId(),
                  }
                  this.api.get(Data,1,'update_paypal_email').then((res:any) => {
                    console.log(res);
                    if(res.status==1){
                      this.amount_popup();
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

  profile(id) {
    this.navCtrl.push('CompanyProfilePage', { ID: id });
  }

  get_user_info() {
    let url = `GetUserProfile?id=${this.auth.getCurrentUserId()}&sessionId=${this.auth.getCurrentUserId()}`;
    this.api.get({},1,url).then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.user_info=res.data;
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

  paypal_login() {    
    paypal.use( ['login'], function (login) {
      login.render ({
        "appid":"AWB3lHZ7zhjGTNx4ZI3g_NNhEf0WZwMaSid4Ixu77ihJbVN9KB-Xpp6y3yMkcnO_IeO8An3Pfp_5xSYR",
        "authend":"sandbox",
        "scopes":"email",
        "containerid":"lippButton",
        "responseType":"code",
        "locale":"en-us",
        "buttonType":"LWP",
        "buttonShape":"pill",
        "buttonSize":"lg",
        "fullPage":"true",
        "returnurl":"https://www.webwiders.com/WEB01/Influ/resp/get_paypal_info"
      });
    });    
  }

}
