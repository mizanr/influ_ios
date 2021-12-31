import { Component, Directive, HostListener } from '@angular/core';
import {NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { RestApiProvider } from '../../providers/rest-api/rest-api';

/**
 * Generated class for the WithdrawalPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()



@Component({
  selector: 'page-withdrawal-popup',
  templateUrl: 'withdrawal-popup.html',
})

@Directive({
  selector: '[appBlockCopyPaste]'
})

export class WithdrawalPopupPage {
paypal_email:any='';
conrim_paypal_email:any='';

  constructor(public navCtrl: NavController,
    public view:ViewController,
    public Api:RestApiProvider,
    public alertP:AlertProvider,
     public navParams: NavParams) {
  }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

  close() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawalPopupPage');
  }


  submit() {
    let d = {
      email:{value:this.paypal_email,type:'EMAIL'},
      email1:{value:this.conrim_paypal_email,type:'EMAIL'},
    }
    var valid = this.Api.validation(d);
    if(valid!=0){
      if(this.paypal_email===this.conrim_paypal_email){
          this.view.dismiss(this.paypal_email);
      } else {
        this.alertP.show('Error','Both email should be matched!');
        return;
      }
    }
  }

}
