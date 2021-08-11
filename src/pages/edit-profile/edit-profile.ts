import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { ImageProvider } from './../../providers/image/image';
import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  formData = {
    email: '',
    password: '',
    confirmP: '',
    dob: '',
    country: '',
    first_name: '',
    last_name: '',
    user_type: '',
    company_name: '',
    company_website: '',
    company_logo: '',
    company_address: '',
    company_desc: '',
    category: [],
    image: '',
    gender: '',
    youtube_channel: '',
    Instagram_channel: '',
    facebook_channel: '',
    background_image: ''
  }
  blob_name: any = '';
  blob: any = '';
  profile_blob_name: any = '';
  profile_blob: any = '';
  categories: any = [];
  cate: any = [];
  min1: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: RestApiProvider,
    public auth: AuthProvider,
    public imageP: ImageProvider,
    public alert: AlertProvider,
    public translate: TranslateService,
    public evetns: Events) {
    var d = new Date();
    var m = d.getMonth() + 1;

    this.min1 = (d.getFullYear() - 18) + "-" + ((m > 9) ? m : "0" + m) + "-" + ((d.getDate() > 9) ? d.getDate() : "0" + d.getDate());

    this.getCategory();
    this.formData = this.auth.getUserDetails();
    if (this.formData.Instagram_channel == null) {
      this.formData.Instagram_channel = '';
    }
    if (this.formData.facebook_channel == null) {
      this.formData.facebook_channel = '';
    }
    if (this.formData.youtube_channel == null) {
      this.formData.youtube_channel = '';
    }
    if (this.formData.user_type == '2') {
      let k = this.formData.category;
      for (let index = 0; index < k.length; index++) {
        this.cate.push(k[index].id)
      }
    }
  }

  update(doPop) {
    if (this.formData.company_logo == '') {
      this.alert.showEmptyMessage('CIMAGE');
      return;
    }
    if (this.formData.image == '') {
      this.alert.showEmptyMessage('PIMAGE');
      return;
    }
    let data = {
      // "first_name": { "value": this.formData.first_name, "type": "FNAME" },
      // "last_name": { "value": this.formData.last_name, "type": "LNAME" },
      "email": { "value": this.formData.email, "type": "EMAIL" },
      "country": { "value": this.formData.country, "type": "COUNTRY" },
      // "dob": { "value": this.formData.dob, "type": "DOB" },
      // "gender": { "value": this.formData.gender, "type": "GENDER" },
      "image": { "value": this.profile_blob, name: this.profile_blob_name, "type": "NO" },
      "user_type": { "value": this.formData.user_type, "type": "NO" },
      "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" }
    }
    if (this.formData.user_type == '1') {
      this.formData.company_name = this.formData.company_name.trim();
      this.formData.company_website = this.formData.company_website.trim();
      this.formData.company_desc = this.formData.company_desc.trim();
      data['company_name'] = { "value": this.formData.company_name, "type": "CNAME" };
      data['company_address'] = { "value": this.formData.company_address, "type": "CADD" };
      data['company_website'] = { "value": this.formData.company_website, "type": "CWEB" };
      data['company_desc'] = { "value": this.formData.company_desc, "type": "CDESC" };
      data['company_logo'] = { "value": this.blob, name: this.blob_name, "type": "NO" };
    } else {
      this.formData.first_name = this.formData.first_name.trim();
      this.formData.last_name = this.formData.last_name.trim();
      data['first_name'] = { "value": this.formData.first_name, "type": "FNAME" };
      data['last_name'] = { "value": this.formData.last_name, "type": "LNAME" };
      data['dob'] = { "value": this.formData.dob, "type": "DOB" };
      data['gender'] = { "value": this.formData.gender, "type": "GENDER" };
      data['category'] = { "value": this.cate, "type": "CATE" };
      data['facebook_channel'] = { "value": this.formData.facebook_channel, "type": "NO" };
      data['Instagram_channel'] = { "value": this.formData.Instagram_channel, "type": "NO" };
      data['youtube_channel'] = { "value": this.formData.youtube_channel, "type": "NO" };
    }
    this.api.postData(data, 1, 'edit_profile').then((res: any) => {
      if (res.status == 1) {
        this.auth.updateUserDetails(res.data);
        if (doPop) {
          this.navCtrl.pop();
        }
      }
      else {
      }
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

  editImage() {
    this.imageP.getImage().then((res: any) => {
      this.formData.image = res;
      this.profile_blob_name = this.imageP.generateImageName('hello.png');
      this.imageP.imgURItoBlob(res).then((b) => {
        this.profile_blob = b;
        this.update(false);
      });
    })
  }

  OpenAutofillPlaces() {
    const modal = this.api.modal.create('AutofillPlacesPage');
    modal.onDidDismiss((location: any) => {
      if (location) {
        console.log(location);
        this.formData.company_address = location.fulladdress;
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
        this.alert.show(this.translate.instant('ALERT'), res.message);
      }
    })
  }

  changeCover() {
    this.imageP.getImage().then((res: any) => {
      this.formData.background_image = res;
      let name = this.imageP.generateImageName('hello.png');
      this.imageP.imgURItoBlob(res).then((blb) => {
        this.updateCover(blb, name);
      });
    })
  }

  updateCover(blob, name) {
    let data = {
      "background_image": { "value": blob, name: name, "type": "NO" },
      "user_id": { "value": this.auth.getCurrentUserId(), "type": "NO" }
    }
    this.api.postData(data, 0, 'uploadBackgrounImage').then((res: any) => {
      if (res.status == 1) {
        this.evetns.publish('UpdateUserDetails');
      }
      else {
      }
    })
  }
}
