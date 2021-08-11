import { TranslateService } from '@ngx-translate/core';
import { MyPostPage } from './../my-post/my-post';
import { ImageProvider } from './../../providers/image/image';
import { AlertProvider } from './../../providers/alert/alert';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage, ActionSheetController } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';

@IonicPage()
@Component({
  selector: 'page-addjob-influ',
  templateUrl: 'addjob-influ.html',
})
export class AddjobInfluPage {
  formData = {
    title: '',
    category: [''],
    price: '',
    post_type: ['Facebook'],
    images: [],
    descriptions: '',
    service_video: '',
    video_thumbnail: '',
  }
  editId: any;
  newImagesArr: any = [];
  cates: any = [];
  vdoRes: any = "";
  validations = {
    isTitleEmpty: true,
    isTitleWrong: false,
    isDescEmpty: true,
    isDescWrong: false,
    isPriceEmpty: true,
    isPriceWrong: false,
    isServiceSelceted: false,
    isImageEmpty: true
  };

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
    public translate: TranslateService,
    public actionSheetCtrl: ActionSheetController,
    public trans: TranslateService) {
    this.getCategory();
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
        // this.formData.category = res.data[0].category.id;
        this.formData.post_type = res.data[0].post_type.split(',');
        let array = res.data[0].category;
        this.formData.category = [];
        for (let index = 0; index < array.length; index++) {
          this.formData.category.push(array[index].id);
        }
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


  isInteger() {
    let l = JSON.parse(this.formData.price)
    if (l === parseInt(l, 10))
      return true
    else
      return false
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

  // onBlurP() {
  //   this.formData.price = this.formData.price.trim();
  //   this.kp();
  // }


  Post() {
    let data = {
      "created_by": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "type": { "value": 2, "type": "NO" },
      "title": { "value": this.formData.title, "type": "TITLE" },
      "descriptions": { "value": this.formData.descriptions, "type": "DESC" },
      "category": { "value": this.formData.category, "type": "NO" },
      "price": { "value": this.formData.price, "type": "NO" },
      "post_type": { "value": this.formData.post_type, "type": "SERVICET" },
    }
    console.log('k-----------', this.formData.images);

    for (let i = 0; i < this.formData.images.length; i++) {
      data["images[" + i + "]"] = { "value": this.formData.images[i].file, "type": "NO", "name": this.formData.images[i].name };
      data["thumb[" + i + "]"] = {
        "value": this.formData.images[i].thumbNail.file, type: "NO", name: this.formData.images[i].thumbNail.name
      };
    }
    // if (this.vdoRes) {
    //   data["video_thumbnail"] = {
    //     value: this.vdoRes.thumb.file,
    //     type: "IMAGE",
    //     name: this.vdoRes.thumb.name
    //   };
    //   data["service_video"] = {
    //     value: this.vdoRes.video.file,
    //     type: "IMAGE",
    //     name: this.vdoRes.video.name
    //   };
    // }
    this.api.postData(data, 0, 'InsertJob').then((res: any) => {
      if (res.status == 1) {
        this.alert.show(this.translate.instant('ALERT'), this.translate.instant('SERVICE_IS_CREATED_SUCCESSFULLY'));
        this.navCtrl.push('MyPostPage');

        this.formData = {
          title: '',
          category: [''],
          price: '',
          post_type: ['Facebook'],
          images: [],
          descriptions: '',
          service_video: '',
          video_thumbnail: '',
        }
      }
      else {
        this.alert.show(this.translate.instant('ALERT'), res.message);
      }
    })
  }

  getPicture(to) {
    this.medaiP.getCompressedImage().then((res: any) => {
      console.log('res-----------==', res);
      // let blob = this.image.imgURItoBlobR(img);
      // let blob_name = this.image.generateImageName('hello.jpg');
      const reader = new FileReader();
      const nullBlob = new Blob([reader.result], {
        type: '',
      });
      console.log('Null blob-----', nullBlob);

      let k = {
        file: nullBlob,
        name: 'no',
      }
      let data = { file: res.file, name: res.name, preview: res.preview, type: 'image', thumbNail: k };
      if (to == 'toAdd') {
        this.formData.images = this.formData.images.concat(data);
        console.log('file array----', this.formData.images);
      } else {
        this.newImagesArr = this.newImagesArr.concat(data);
      }

      this.onKeyT()
    })
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
    let data = {
      "id": { "value": this.editId, "type": "NO" },
      "created_by": { "value": this.auth.getCurrentUserId(), "type": "NO" },
      "type": { "value": 2, "type": "NO" },
      "title": { "value": this.formData.title, "type": "TITLE" },
      "descriptions": { "value": this.formData.descriptions, "type": "DESC" },
      "category": { "value": this.formData.category, "type": "NO" },
      "price": { "value": this.formData.price, "type": "NO" },
      "post_type": { "value": this.formData.post_type, "type": "SERVICET" },

    }
    console.log(this.newImagesArr);

    for (let i = 0; i < this.newImagesArr.length; i++) {
      data["images[" + i + "]"] = { "value": this.newImagesArr[i].file, "type": "NO", "name": this.newImagesArr[i].name }
      data["thumb[" + i + "]"] = {
        "value": this.newImagesArr[i].thumbNail.file, type: "NO", name: this.newImagesArr[i].thumbNail.name
      };
    }
    this.api.postData(data, 0, 'UpdateJob').then((res: any) => {
      if (res.status == 1) {
        this.alert.show(this.translate.instant('ALERT'), this.translate.instant('SERVICE_IS_UPDATED_SUCCESSFULLY'));
        this.navCtrl.pop();
      }
      else {
        this.alert.show(this.translate.instant('ALERT'), res.message);
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


  // getVideo() {
  //   this.medaiP.getVideoByGallery().then((res1: any) => {
  //     if (res1 != 0) {
  //       // this.sendThumb(res1);
  //       console.log("res1=-=-=-=-=-=-=-=-=-=-=-=", res1);
  //       this.vdoRes = res1;
  //       this.formData.service_video = this.vdoRes.video.preview;
  //       this.formData.video_thumbnail = this.vdoRes.thumb.preview;
  //     } else {
  //       // alert("اضافة اختبار");
  //     }
  //   });
  // }

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


  openAction(status) {
    const actionSheet = this.actionSheetCtrl.create({
      // title: this.trans.instant('REPORT_THIS_POST'),
      buttons: [
        {
          text: this.trans.instant('ADD_VIDEO'),
          handler: () => {
            this.getVideo(status);
          }
        },
        {
          text: this.trans.instant('ADD_IMAGE'),
          handler: () => {
            this.getPicture(status);
          }
        },
        {
          text: this.trans.instant('CANCEL'),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

  }


  getVideo(to) {
    this.medaiP.getVideoByGallery().then((res1: any) => {
      if (res1 != 0) {
        console.log("res1=-=-=-=-=-=-=-=-=-=-=-=", res1);
        // this.vdoRes = res1;
        // this.formData.lession_video = this.vdoRes.video.preview;
        // this.formData.video_thumbnail = this.vdoRes.thumb.preview;

        // let k = {
        //   file: res1.video.file,
        //   name: this.image.generateImageName('hello.jpg')
        // }

        let data = { file: res1.video.file, name: res1.video.name, preview: res1.video.preview, type: 'video', thumbNail: res1.thumb };
        if (to == 'toAdd') {
          this.formData.images = this.formData.images.concat(data);
        } else {
          this.newImagesArr = this.newImagesArr.concat(data);
        }
      } else {
      }

      this.onKeyT()
    });
  }
}
