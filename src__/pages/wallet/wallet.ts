
import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }
  trans(){
    const modal = this.modalCtrl.create('TransferPage',{},{cssClass:'moremodel', showBackdrop:true, enableBackdropDismiss:true});
     modal.present();
  }
}
