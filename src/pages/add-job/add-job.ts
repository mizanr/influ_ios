import { TranslateService } from '@ngx-translate/core';
import { MediaProvider } from './../../providers/media/media';
import { ImageProvider } from './../../providers/image/image';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage } from 'ionic-angular';
@IonicPage()

@Component({
  selector: 'page-add-job',
  templateUrl: 'add-job.html',
})
export class AddJobPage {
  formData = {
    title: '',
    category: [''],
    price: '',
    post_type: ['Facebook'],
    images: [],
    descriptions: '',
    country: {
      id: "",
      nicename: ""
    }
  };
  validations = {
    isTitleEmpty: true,
    isTitleWrong: false,
    isDescEmpty: true,
    isDescWrong: false,
    isPriceEmpty: true,
    isPriceWrong: false,
    isServiceSelceted: false,
    isImageEmpty: true
  }
  editId: any;
  newImagesArr: any = [];
  countries: any;
  cates: any = [];
  service_types = [{ service_title: 'FACEBOOK', checked: false, value: 'Facebook' },
  { service_title: 'IMAGE_FILE', checked: false, value: 'Image file' },
  { service_title: 'VIDEO_FILE', checked: false, value: 'Video file' },
  { service_title: 'TIKTOK', checked: false, value: 'Tiktok' },
  { service_title: 'INSTAGRAM_POST', checked: false, value: 'Instagram Post' },
  { service_title: 'INSTAGRAM_STORY', checked: false, value: 'Instagram Story' }]
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider,
    public api: RestApiProvider,
    public alert: AlertProvider,
    public image: ImageProvider,
    public alertCtrl: AlertController,
    public medaiP: MediaProvider,
    public translate: TranslateService
  ) {
    this.editId = this.navParams.get('EditId');
    if (this.editId) {
      // this.formData = this.editId;
      this.getDetails();
      this.validations = {
        isTitleEmpty: false,
        isTitleWrong: false,
        isDescEmpty: false,
        isDescWrong: false,
        isPriceEmpty: false,
        isPriceWrong: false,
        isServiceSelceted: false,
        isImageEmpty: false
      }
    } else {
      this.getCodes();
      this.validations = {
        isTitleEmpty: false,
        isTitleWrong: false,
        isDescEmpty: false,
        isDescWrong: false,
        isPriceEmpty: false,
        isPriceWrong: false,
        isServiceSelceted: false,
        isImageEmpty: false
      }
    }
    this.getCategory();

  }

  getCategory() {
    let data = {
    };
    this.api.get(data, 1, 'category').then((result: any) => {
      if (result.status == "0") {
      } else {
        this.cates = result.data;
      }
    }, (err) => {
    });
  }

  getDetails() {
    let data = {
      "user_id": this.auth.getCurrentUserId(),
      "job_id": this.editId,
    }
    this.api.get(data, 1, 'GetJobById').then((res: any) => {
      if (res.status == 1) {
        // this.categories = res.data
        this.formData = res.data[0];
        this.formData.post_type = res.data[0].post_type.split(',');
        let array = res.data[0].category;
        this.formData.category = [];
        for (let index = 0; index < array.length; index++) {
          this.formData.category.push(array[index].id);
        }
        // let k = this.formData.post_type.split(",");
        for (let index = 0; index < this.formData.post_type.length; index++) {
          for (let p = 0; p < this.service_types.length; p++) {
            if (this.formData.post_type[index] == this.service_types[p].value) {
              this.service_types[p].checked = true;
            }
          }
        }
      }
      else {
        this.alert.show(this.translate.instant('ALERT'), res.message);
      }
    })
  }

  onKeyT() {
    if (this.formData.title[0] == ' ') {
      console.log('dfasdfdsfas=====', this.formData.title);
      this.formData.title = this.formData.title.trim();
    }

    if (this.formData.title == '' || this.formData.title == null || this.formData.title === 'false') {
      this.validations.isTitleEmpty = true;
    } else {
      this.validations.isTitleEmpty = false;
    }
    console.log(this.formData.title.trim().length);

    if (this.formData.title && (this.formData.title.trim().length < 5 || this.formData.title.trim().length > 50)) {
      this.validations.isTitleWrong = true
    } else {
      this.validations.isTitleWrong = false;
    }


    if ((this.formData.images.length + this.newImagesArr.length) == 0) {
      this.validations.isImageEmpty = true;
    } else {
      this.validations.isImageEmpty = false;
    }
  }

  onBlurT() {
    this.formData.title = this.formData.title.trim();
    this.onKeyT();
  }

  selectChange() {
    console.log('workin');
    this.formData.post_type = [];
    for (let index = 0; index < this.service_types.length; index++) {
      if (this.service_types[index].checked) {

        // for (let p = 0; p < this.formData.post_type.length; p++) {
        //   if (this.service_types[index].value != this.formData.post_type[p]) {
        this.formData.post_type.push(this.service_types[index].value)
        // }
        // }
      }
    }
    console.log(this.formData.post_type);

    if (this.formData.post_type.length == 0) {
      this.validations.isServiceSelceted = true
    } else {
      this.validations.isServiceSelceted = false
    }
  }

  onKeyD() {
    if (this.formData.descriptions[0] == ' ') {
      console.log('dfasdfdsfas=====', this.formData.title);
      this.formData.descriptions = this.formData.descriptions.trim();
    }
    if (this.formData.descriptions == '' || this.formData.descriptions == null || this.formData.descriptions === 'false') {
      this.validations.isDescEmpty = true;
    } else {
      this.validations.isDescEmpty = false;
    }

    if (this.formData.descriptions && (this.formData.descriptions.trim().length < 20 || this.formData.descriptions.trim().length > 500)) {
      this.validations.isDescWrong = true
    } else {
      this.validations.isDescWrong = false;
    }
  }

  onBlurD() {
    this.formData.descriptions = this.formData.descriptions.trim();
    this.onKeyD();
  }

  kp() {
    if (this.formData.price == null) {
      this.validations.isPriceEmpty = true;
    } else {
      this.validations.isPriceEmpty = false;
    }

    if (this.formData.price != null && !this.isInteger()) {
      this.validations.isPriceWrong = true
    } else {
      this.validations.isPriceWrong = false;
    }
    this.selectChange();
  }


  isInteger() {
    let l = JSON.parse(this.formData.price)
    if (l === parseInt(l, 10))
      return true
    else
      return false
  }
  Post() {

    // if (this.formData.title.length < 5 || this.formData.title.length > 50) {
    //   this.alert.showMessage('TITLE');
    //   return
    // }
    // if (this.formData.descriptions.length < 20 || this.formData.descriptions.length > 500) {
    //   this.alert.showMessage('DESC');
    //   return
    // }
    // if (this.formData.price == null) {
    //   this.alert.showEmptyMessage('PRICE');
    //   return
    // } else if (!this.isInteger()) {
    //   this.alert.show('Alert!', 'Price should be integer only!');
    //   return
    // }
    // if (this.formData.images.length == 0) {
    //   this.alert.showEmptyMessage('IMAGE');
    //   return;
    // }

    // for (let index = 0; index < this.service_types.length; index++) {
    //   if (this.service_types[index].checked) {
    //     this.formData.post_type.push(this.service_types[index].value)
    //   }
    // }
    let data = {
      "created_by": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "type": { "value": 1, "type": "NO" },
      "title": { "value": this.formData.title, "type": "TITLE" },
      "descriptions": { "value": this.formData.descriptions, "type": "DESC" },
      "category": { "value": this.formData.category, "type": "NO" },
      "price": { "value": this.formData.price, "type": "NO" },
      "post_type": { "value": this.formData.post_type, "type": "SERVICET" },
      "country": { "value": this.formData.country.id, "type": "COUNTRY" },
    }
    for (let i = 0; i < this.formData.images.length; i++) {
      data["images[" + i + "]"] = { "value": this.formData.images[i].file, "type": "IMAGE", "name": this.formData.images[i].name }
    }
    this.api.postData(data, 0, 'InsertJob').then((res: any) => {
      if (res.status == 1) {
        this.alert.show(this.translate.instant('ALERT'), this.translate.instant('JOB_IS_CREATED_SUCCESSFULLY'));
        this.navCtrl.push('JobListPage');

        this.formData = {
          title: '',
          category: [''],
          price: '',
          post_type: ['Facebook'],
          images: [],
          descriptions: '',
          country: {
            id: "",
            nicename: ""
          }
        }
      }
      else {
        this.alert.show(this.translate.instant('ALERT'), res.message);
      }
    })
  }

  getPicture() {
    // this.alertCtrl.create({
    //   title: 'Set Photo',
    //   message: 'Do you want to take a photo or choose multiple images from your photo gallery?',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => { }
    //     },
    //     {
    //       text: 'Choose from Gallery',
    //       handler: () => {
    //         this.getMultiplePicture('e');
    //       }
    //     },
    //     {
    //       text: 'Take Photo',
    //       handler: () => {
    //         this.image.getImageFromCamera().then((img: any) => {
    //           console.log();
    //           let blob = this.image.imgURItoBlobR(img);
    //           let blob_name = this.image.generateImageName('hello.jpg');
    //           let data = { file: blob, name: blob_name, preview: img };
    //           this.formData.images = this.formData.images.concat(data);
    //           console.log('file array----', this.formData.images);
    //         })
    //       }
    //     }
    //   ]
    // }).present();
    this.image.getImage().then((img: any) => {
      console.log();
      let blob = this.image.imgURItoBlobR(img);
      let blob_name = this.image.generateImageName('hello.jpg');
      let data = { file: blob, name: blob_name, preview: img };
      this.formData.images = this.formData.images.concat(data);
      console.log('file array----', this.formData.images);
      this.onKeyT()
    })
    // this.image.getImage().then((res: any) => {
    //   this.formData.company_logo = res;
    //   this.blob_name = this.imageP.generateImageName('hello.png');
    //   this.imageP.imgURItoBlob(res).then((b) => {
    //     this.blob = b;
    //   })
    // })
  }

  getPictureEdit() {
    this.image.getImage().then((img: any) => {
      console.log();
      let blob = this.image.imgURItoBlobR(img);
      let blob_name = this.image.generateImageName('hello.jpg');
      let data = { file: blob, name: blob_name, preview: img };
      this.newImagesArr = this.newImagesArr.concat(data);
      this.onKeyT()
    })

  }

  getMultiplePicture(e: any) {
    let count: any = (5 - this.formData.images.length);

    console.log('count---', count);
    this.medaiP.selectMultipleImages(count).then((res: any) => {
      console.log('res-----------==============', res);

      if (res != 0) {
        this.formData.images = this.formData.images.concat(res);
      }
    });
  }


  delImage(I: any) {
    this.formData.images.splice(I, 1);
    this.onKeyT()
  }
  delImageE(i) {
    if ((this.formData.images.length + this.newImagesArr.length) != 1) {
      this.newImagesArr.splice(i, 1);
    } else {
      this.alert.show(this.translate.instant('ALERT'), this.translate.instant('AT_LEAST_ONE_IMAGE_IS_REQUIRED'))
    }

  }

  update() {
    // if (this.formData.title.length < 5 || this.formData.title.length > 50) {
    //   this.alert.showMessage('TITLE');
    //   return
    // }
    // if (this.formData.descriptions.length < 20 || this.formData.descriptions.length > 500) {
    //   this.alert.showMessage('DESC');
    //   return
    // }

    // if (this.formData.price == null) {
    //   this.alert.showEmptyMessage('PRICE');
    //   return
    // } else if (!this.isInteger()) {
    //   this.alert.show('Alert!', 'Price should be integer only!');
    //   return
    // }
    // if ((this.formData.images.length + this.newImagesArr.length) == 0) {
    //   this.alert.showEmptyMessage('IMAGE');
    //   return;
    // }
    let data = {
      "id": { "value": this.editId, "type": "NO" },
      "created_by": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "type": { "value": 1, "type": "NO" },
      "title": { "value": this.formData.title, "type": "TITLE" },
      "descriptions": { "value": this.formData.descriptions, "type": "DESC" },
      "category": { "value": this.formData.category, "type": "NO" },
      "price": { "value": this.formData.price, "type": "NO" },
      "post_type": { "value": this.formData.post_type, "type": "SERVICET" },
      "country": { "value": this.formData.country.id, "type": "COUNTRY" },

    }
    for (let i = 0; i < this.newImagesArr.length; i++) {
      data["images[" + i + "]"] = { "value": this.newImagesArr[i].file, "type": "IMAGE", "name": this.newImagesArr[i].name }
    }
    this.api.postData(data, 0, 'UpdateJob').then((res: any) => {
      if (res.status == 1) {
        this.alert.show(this.translate.instant('ALERT'), this.translate.instant('JOB_IS_UPDATED_SUCCESSFULLY'));
        this.navCtrl.pop();
      }
      else {
        this.alert.show("Alert!", res.message);
      }
    })
  }

  delServerImage(i) {
    if ((this.formData.images.length + this.newImagesArr.length) != 1) {
      this.alert.confirmationAlert(this.translate.instant('ALERT'), this.translate.instant('DO_YOU_WANT_TO_DELETE_THIS_MESSAGE')).then(r => {
        if (r) {
          let data = {
            "id": { "value": i, "type": "NO" },
          }
          this.api.postData(data, 0, 'removeImage').then((res: any) => {
            if (res.status == 1) {
              this.getDetails();
              // this.navCtrl.pop();
            }
            else {
            }
          })
        }
      })
    } else {
      this.alert.show(this.translate.instant('ALERT'), this.translate.instant('AT_LEAST_ONE_IMAGE_IS_REQUIRED'))
    }
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
        this.formData.country = k[0];
      }
    }, (err) => {
    });
  }


  openModal() {
    let modal = this.api.modalCtrl.create('SelectCountryPage', { countries: this.countries });
    modal.onDidDismiss((data: any) => {
      if (data) {
        this.formData.country = data;
        console.log(data);
      }
    });
    modal.present();
  }


  cateChange() {
    let array = this.formData.category;
    this.formData.category = [];
    console.log(array);

    for (let index = 0; index < array.length; index++) {
      if (array[index]) {
        this.formData.category.push(array[index]);
      }
    }
    if (this.formData.category.length == 0) {
      this.formData.category.push('');
    }
  }


  openNoti() {
    this.navCtrl.push('NotificationPage');
  }
}
