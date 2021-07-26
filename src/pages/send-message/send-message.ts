import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SendMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-message',
  templateUrl: 'send-message.html',
})
export class SendMessagePage {
  msg: any = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public alert: AlertProvider,
    public trans: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendMessagePage');
  }

  send() {
    this.msg = this.msg.trim();
    if (this.msg == '') {
      this.alert.show(this.trans.instant('ALERT'), this.trans.instant('PLEASE_ENTER_MESSAGE'));
      return;
    }
    this.viewCtrl.dismiss(this.msg)
  }
}
