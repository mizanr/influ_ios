import { EncryptProvider } from './../../providers/encrypt/encrypt';
import { TranslateService } from '@ngx-translate/core';
import { AuthProvider } from './../../providers/auth/auth';
import { ImageProvider } from './../../providers/image/image';
import { VerifyPage } from './../verify/verify';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { NavController, NavParams, Thumbnail, IonicPage } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AbstractControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  formData = {
    email: '',
    password: '',
    confirmP: '',
    dob: '',
    country: '',
    city: '',
    state: '',
    zip_code: '',
    first_name: '',
    last_name: '',
    user_type: '',
    company_name: '',
    company_website: '',
    company_logo: '',
    company_address: '',
    company_desc: '',
    category: '',
    gender: 'Any'
  }
  blob_name: any = '';
  blob: any = '';
  categories: any = [];
  countries: any;
  min1: any;
  companyForm: any;
  influForm: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public alert: AlertProvider,
    public imageP: ImageProvider,
    public auth: AuthProvider,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public encrypt: EncryptProvider
  ) {
    var d = new Date();
    var m = d.getMonth() + 1;

    this.min1 = (d.getFullYear() - 18) + "-" + ((m > 9) ? m : "0" + m) + "-" + ((d.getDate() > 9) ? d.getDate() : "0" + d.getDate());

    this.formData.user_type = navParams.get('Type');
    if (this.formData.user_type == '2') {
      this.getCategory();
    }
    this.getCodes();
    this.companyForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), Validators.required])],
      passwords: this.formBuilder.group({
        password: ['', [Validators.pattern('[a-zA-Z0-9]{6,20}'), Validators.required]],
        confirmP: ['', [Validators.required]],
      }, { validator: this.passwordConfirming }),
      country: [''],
      company_name: ['', Validators.compose([Validators.required])],
      company_address: [''],
      company_website: ['', Validators.compose([Validators.required])],
      company_desc: ['', Validators.compose([Validators.required])],
    });


    this.influForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), Validators.required])],
      passwords: this.formBuilder.group({
        password: ['', [Validators.pattern('[a-zA-Z0-9]{6,20}'), Validators.required]],
        confirmP: ['', [Validators.required]],
      }, { validator: this.passwordConfirming }),
      country: [''],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      gender: ['Any', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
    });
    if (this.navParams.get('SignupData')) {
      let l = this.navParams.get('SignupData');
      this.influForm.controls.first_name.value = l.Fname;
      this.influForm.controls.last_name.value = l.Lname;
      this.influForm.controls.email.value = l.Email;
      this.companyForm.controls.email.value = l.Email;
      this.companyForm.get(['passwords', 'password']).value = 123456;
      this.companyForm.get(['passwords', 'confirmP']).value = 123456;
      this.influForm.get(['passwords', 'password']).value = 123456;
      this.influForm.get(['passwords', 'confirmP']).value = 123456;

    }
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmP').value) {
      return { invalid: true };
    }
  }
  OpenAutofillPlaces() {
    const modal = this.api.modal.create('AutofillPlacesPage');
    modal.onDidDismiss((location: any) => {
      if (location) {
        console.log(location);
        // this.formData.company_address = location.fulladdress;
        this.companyForm.controls.company_address.value = location.fulladdress;
        this.formData.city = location.city;
        this.formData.zip_code = location.post_code;
        this.formData.state = location.state;
        // this.country = location.country;
      }
    });
    modal.present();
  }

  OpenAutofillCountry() {
    const modal = this.api.modal.create('AutofillPlacesPage');
    modal.onDidDismiss((location: any) => {
      if (location) {
        console.log(location);
        // this.formData.company_address = location.fulladdress;
        this.formData.country = location.country;
        this.companyForm.controls.country.value = location.country;
        this.influForm.controls.country.value = location.country;
      }
    });
    modal.present();
  }

  getCategory() {
    let data = {
    }
    this.api.postData(data, 0, 'category').then((res: any) => {
      if (res.status == 1) {
        this.categories = res.data
      }
      else {
        this.alert.show("Alert!", res.message);
      }
    })
  }
  get() {
    console.log('dfsadfsad---', this.companyForm);

  }
  signup() {
    console.log('pass----', this.companyForm.get(['passwords', 'password']).value);
    let passToEncrypt: any;
    if (this.formData.user_type == '1') {
      passToEncrypt = this.companyForm.get(['passwords', 'password']).value
    } else {
      passToEncrypt = this.influForm.get(['passwords', 'password']).value
    }
    this.encrypt.getEncryptedData(passToEncrypt).then((r: any) => {
      console.log('Encrypter passwor=========', r);
      r = r.trim();
      let data = {
        // // "first_name": { "value": this.formData.first_name, "type": "FNAME" },
        // // "last_name": { "value": this.formData.last_name, "type": "LNAME" },
        // "email": { "value": this.formData.email, "type": "EMAIL" },
        // "country": { "value": this.formData.country, "type": "COUNTRY" },
        // // "dob": { "value": this.formData.dob, "type": "DOB" },
        // "password": { "value": this.formData.password, "type": "PASSW" },
        // "confirmP": { "value": this.formData.confirmP, "type": "CONFP" },
        // "user_type": { "value": this.formData.user_type, "type": "NO" },
      }
      if (this.formData.user_type == '1') {
        this.formData.company_name = this.formData.company_name.trim();
        this.formData.company_website = this.formData.company_website.trim();
        this.formData.company_desc = this.formData.company_desc.trim();
        data['email'] = { "value": this.companyForm.controls.email.value, "type": "NO" };
        data['country'] = { "value": this.companyForm.controls.country.value, "type": "NO" };
        data['password'] = { "value": r, "type": "NO" };
        data['confirmP'] = { "value": r, "type": "NO" };
        data['user_type'] = { "value": this.formData.user_type, "type": "NO" };
        data['company_logo'] = { "value": this.blob, name: this.blob_name, "type": "CIMAGE" };
        data['company_name'] = { "value": this.companyForm.controls.company_name.value, "type": "NO" };
        data['company_address'] = { "value": this.companyForm.controls.company_address.value, "type": "NO" };
        data['city'] = { "value": this.formData.city, "type": "NO" };
        data['state'] = { "value": this.formData.state, "type": "NO" };
        data['zip_code'] = { "value": this.formData.zip_code, "type": "NO" };
        data['company_website'] = { "value": this.companyForm.controls.company_website.value, "type": "NO" };
        data['company_desc'] = { "value": this.companyForm.controls.company_desc.value, "type": "NO" };
      } else {
        data['email'] = { "value": this.influForm.controls.email.value, "type": "NO" };
        data['country'] = { "value": this.influForm.controls.country.value, "type": "NO" };
        data['password'] = { "value": r, "type": "NO" };
        data['confirmP'] = { "value": r, "type": "NO" };
        data['user_type'] = { "value": this.formData.user_type, "type": "NO" };
        this.formData.first_name = this.formData.first_name.trim();
        this.formData.last_name = this.formData.last_name.trim();
        data['first_name'] = { "value": this.influForm.controls.first_name.value, "type": "NO" };
        data['last_name'] = { "value": this.influForm.controls.last_name.value, "type": "NO" };
        data['dob'] = { "value": this.influForm.controls.dob.value, "type": "NO" };
        data['gender'] = { "value": this.influForm.controls.gender.value, "type": "NO" };
        data['category'] = { "value": this.influForm.controls.category.value, "type": "NO" };
      }
      if (this.navParams.get('SignupData')) {
        let l = this.navParams.get('SignupData');
        data[l.ID.name] = { "value": l.ID.value, "type": "NO" };
        data['LoginType'] = { "value": l.LoginType, "type": "NO" };
      }
      this.api.postData(data, 0, 'signup').then((res: any) => {
        if (res.status == 1) {
          this.navCtrl.push('VerifyPage');
          this.auth.updateUserDetails(res.data)
        }
        else {
          this.alert.show(this.translate.instant('ALERT'), res.message);
        }
      })
    })
  }


  edit() {
    console.log('clickceddfadsf');

    this.imageP.getImage().then((res: any) => {
      this.formData.company_logo = res;
      this.blob_name = this.imageP.generateImageName('hello.png');
      this.imageP.imgURItoBlob(res).then((b) => {
        this.blob = b;
      })
    })
  }

  home() {
    // this.navCtrl.push(SelectPage);
    this.navCtrl.push('VerifyPage')
  }

  privacy() {
    this.navCtrl.push('PrivacyPage', { Type: 'privacy' })
  }
  terms() {
    this.navCtrl.push('PrivacyPage', { Type: 'terms' })
  }
  login() {
    this.navCtrl.popToRoot();
  }

  getCodes() {
    let data = {
      // "email": { "value": this.formData.email, "type": "NO" },
    };
    this.api.get(data, 0, 'country').then((result: any) => {
      if (result.status == "0") {
        // this.alertP.show("", result.message);
      } else {
        this.countries = result.data;
        this.getDeviceCountry()
        // let k = this.countries.filter(a => {
        //   if (a.id == 226) {
        //     return a;
        //   }
        // });
        // console.log(k);
        // this.formData.country_code = k[0].phonecode;
        // this.formData.countryFlag = k[0].image;
      }
    }, (err) => {
    });
  }


  getDeviceCountry() {
    let data = {
      // "email": { "value": this.formData.email, "type": "NO" },
    };
    this.api.get(data, 1, 'GetCountryByIP').then((result: any) => {
      if (result.status == "0") {
        // this.alertP.show("", result.message);
      } else {
        let k = this.countries.filter(x => {
          if (result.country == x.iso)
            return x;
        });
        console.log(k);
        // this.formData.country = k[0].name;
        this.companyForm.controls.country.value = k[0].name;
        this.influForm.controls.country.value = k[0].name;
      }
    }, (err) => {
    });
  }
}
