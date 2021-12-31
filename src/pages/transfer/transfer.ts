import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth/auth';
import { RestApiProvider } from '../../providers/rest-api/rest-api';


@IonicPage()
@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html',
})
export class TransferPage {
  user_info:any;
  bank_detail:any={};
  amount:any;
  paypal_email:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public auth: AuthProvider,
    public trans: TranslateService,
    public api: RestApiProvider,
    public alert: AlertProvider,
    public viewCtrl: ViewController) {
      this.paypal_email=navParams.data.paypal_email;
  }

  ionViewDidLoad() {
    this.get_user_info();
    this.get_bank_detail();
    console.log('ionViewDidLoad TransferPage');
  }

  thank(){
    this.viewCtrl.dismiss();
  }

  

  closemodal(){
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter(){
  
  }

  OpenAutofillPlaces() {
    const modal = this.api.modal.create('AutofillPlacesPage');
    modal.onDidDismiss((location: any) => {
      if (location) {
        console.log(location);
        this.bank_detail.city=location.city;
        this.bank_detail.country=location.country;
        //this.formData.company_address = location.fulladdress;
        // this.country = location.country;
      }
    });
    modal.present();
  }

  get_user_info() {
    let url = `GetUserProfile?id=${this.auth.getCurrentUserId()}&sessionId=${this.auth.getCurrentUserId()}`;
    this.api.get({},1,url).then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.user_info=res.data;
        this.amount=parseInt(this.user_info.wallet_amount)>parseInt(this.user_info.max_withdraw_amt)?this.user_info.max_withdraw_amt:this.user_info.wallet_amount;
      }
    })
  }

  get_bank_detail() {
    let url =`GetBankDetails?user_id=${this.auth.getCurrentUserId()}`;
    this.api.get({},0,url).then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.bank_detail=res.data;
      }
    })
  }

  update_bank() {
    let Data = {
      user_id:{value:this.auth.getCurrentUserId(),type:'NO'},
      account_no:{value:this.bank_detail.account_no,type:'BANKACC'},
      routing:{value:this.bank_detail.routing,type:'ROUNTING'},      
      user_name:{value:this.bank_detail.user_name,type:'USERNAME'},
      bank_name:{value:this.bank_detail.bank_name,type:'BANKNAME'},
      bank_address:{value:this.bank_detail.bank_address,type:'NO'},
      code:{value:this.bank_detail.code,type:'CODE'},
      city:{value:this.bank_detail.city,type:'CITY'},
      country:{value:this.bank_detail.country,type:'COUNTRY'},
      zipcode:{value:this.bank_detail.zipcode,type:'ZIPCODE'},
    }
    this.api.postData(Data,0,'update_bank').then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.withdrawal_amount();
      }
    })
  }


  withdrawal_amount() {
    if(parseInt(this.amount)<parseInt(this.user_info.min_withdraw_amt)){
      // this.alert.presentToast(this.trans.instant('MINMUM_WITHDRAWAL_AMOUNT')`$${this.user_info.min_withdraw_amt}.`,'bottom');
      this.alert.presentToast(`Minmum withdrawal amount$${this.user_info.min_withdraw_amt}.`,'bottom');
      return;
    }
    if(parseInt(this.amount)>parseInt(this.user_info.max_withdraw_amt)){
      // this.alert.presentToast(this.trans.instant('MAXMUM_WITHDRAWAL_AMOUNT')`$${this.user_info.max_withdraw_amt}.`,'bottom');
      this.alert.presentToast(`Maxmum withdrawal amount$${this.user_info.max_withdraw_amt}.`,'bottom');
      return;
    }

    let url = `withdraw_request?amount=${this.amount}&user_id=${this.auth.getCurrentUserId()}&email_id=${this.paypal_email}`;
    this.api.get({},1,url).then((res:any) => {
      if(res.status==1){
        this.alert.presentToast(res.message,"bottom");
        this.viewCtrl.dismiss(true);
      } else {
        this.alert.presentToast(res.message,"bottom");
      }
    })
  }

}
