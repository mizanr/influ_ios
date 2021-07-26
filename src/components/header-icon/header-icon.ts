import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';

/**
 * Generated class for the HeaderIconComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header-icon',
  templateUrl: 'header-icon.html'
})
export class HeaderIconComponent {

  text: string;

  constructor(public auth: AuthProvider,
    public navCtrl: NavController,
    public trans: TranslateService) {
    console.log('Hello HeaderIconComponent Component');
    this.text = 'Hello World';
  }


  openNoti() {
    this.navCtrl.push('NotificationPage');
  }
}
