import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth/auth';
import { RestApiProvider } from '../../providers/rest-api/rest-api';

/**
 * Generated class for the PaypalAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paypal-account',
  templateUrl: 'paypal-account.html',
})
export class PaypalAccountPage {
paypal_accounts:any=new Array();

  constructor(public navCtrl: NavController,
    public auth: AuthProvider,
    public translate:TranslateService,
   public api: RestApiProvider,
   public alertP:AlertProvider,
   public events:Events,
   public view:ViewController,
     public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaypalAccountPage');
  }

  closemodal() {
    this.view.dismiss();
  }

  ionViewWillEnter() {
    this.get_user_info();
  }

  get_user_info() {
    let url = `GetUserProfile?id=${this.auth.getCurrentUserId()}&sessionId=${this.auth.getCurrentUserId()}`;
    this.api.get({},0,url).then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.paypal_accounts=res.paypal_account;
        if(this.paypal_accounts.length==0){
          this.view.dismiss(2);
        }
      }
    })
  }

  delete(l) {
    this.alertP.confirmationAlert(
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

  go(l) {
    this.view.dismiss(l);
  }

  add(){
    this.view.dismiss(1);
  }

}
