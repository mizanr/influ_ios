
import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }
  closemodal(){
    this.viewCtrl.dismiss();
  }
  buy(){
    this.viewCtrl.dismiss();
    const modal = this.modalCtrl.create('SuccessfullPage',{},{cssClass:'moremodel', showBackdrop:true, enableBackdropDismiss:true});
     modal.present();
  }
}
