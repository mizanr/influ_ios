import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  email: any = '';
  msg: any = '';
  contactForm: any;
  constructor(public navCtrl: NavController,
    public auth: AuthProvider,
    public formBuilder: FormBuilder,
    public api: RestApiProvider,
    public alert: AlertProvider,
    public translate: TranslateService) {
    this.contactForm = this.formBuilder.group({
      email: [auth.getUserDetails().email, Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), Validators.required])],
      msg: ['', Validators.compose([Validators.required])],
    });
  }

  submit() {
    let data = {
      "email": { "value": this.contactForm.controls.email.value, "type": "NO" },
      "message": { "value": this.contactForm.controls.msg.value, "type": "NO" },
    }
    this.api.postData(data, 0, 'contactUs').then((res: any) => {
      if (res.status == 1) {
        this.alert.show(this.translate.instant('ALERT'), this.translate.instant('WE_WILL_REACH_YOU_BACK_SOON'));
        this.navCtrl.pop();
      }
      else {
      }
    })
  }
}
