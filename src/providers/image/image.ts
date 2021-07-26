import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { AlertController } from 'ionic-angular';

// import { FileTransfer } from '@ionic-native/file-transfer';
// import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';

/*
  Generated class for the ImageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageProvider {

  constructor(
    public http: HttpClient,
    public camera: Camera,
    public alertCtrl: AlertController,
    // public fileChooser:FileChooser,
    public file: File,
    public trans: TranslateService
  ) {
    console.log('Hello ImageProvider Provider');
  }


  getImageForCrop() {
    return new Promise((resolve, reject) => {
      if (Camera['installed']()) {

        this.alertCtrl.create({
          title: this.trans.instant('SET_PHOTO'),
          message: this.trans.instant('DO_YOU_WNAT_TO_TAKE_PHOTO_OR_CHOOSE_FORM_YOUR_PHOTO_GALLERY'),
          buttons: [
            {
              text: this.trans.instant('CANCEL'),
              handler: data => { }
            },
            {
              text: this.trans.instant('CHOOSE_FROM_GALLERY'),
              handler: () => {

                this.camera.getPicture

                this.camera.getPicture({
                  quality: 100,
                  // destinationType : this.camera.DestinationType.FILE_URI,
                  sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                  //encodingType: this.camera.EncodingType.JPEG,
                  mediaType: this.camera.MediaType.PICTURE,
                  targetHeight: 1000,
                  targetWidth: 1000,
                  saveToPhotoAlbum: false,
                  correctOrientation: true

                }).then((data) => {
                  resolve(data);
                }, (err) => {
                  reject('Unable to take photo: ' + err);
                })


              }
            },
            {
              text: this.trans.instant('TAKE_PHOTO'),
              handler: () => {

                this.camera.getPicture({
                  quality: 100,
                  //destinationType: this.camera.DestinationType.FILE_URI,
                  //encodingType: this.camera.EncodingType.JPEG,
                  targetHeight: 1000,
                  targetWidth: 1000,
                  saveToPhotoAlbum: false,
                  correctOrientation: true
                }).then((data) => {
                  resolve(data);
                }, (err) => {
                  reject('Unable to take photo: ' + err);
                })

              }
            }
          ]
        }).present();



      } else {

        resolve("webImage");
      }
    });
  }



  getImage() {
    return new Promise((resolve, reject) => {
      if (Camera['installed']()) {

        this.alertCtrl.create({
          title: this.trans.instant('SET_PHOTO'),
          message: this.trans.instant('DO_YOU_WNAT_TO_TAKE_PHOTO_OR_CHOOSE_FORM_YOUR_PHOTO_GALLERY'),
          buttons: [
            {
              text: 'Cancel',
              handler: data => { }
            },
            {
              text: this.trans.instant('CHOOSE_FROM_GALLERY'),
              handler: () => {

                this.camera.getPicture

                this.camera.getPicture({
                  quality: 100,
                  destinationType: this.camera.DestinationType.DATA_URL,
                  sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                  encodingType: this.camera.EncodingType.JPEG,
                  targetHeight: 1000,
                  targetWidth: 1000,
                  saveToPhotoAlbum: false,
                  correctOrientation: true

                }).then((data) => {
                  resolve('data:image/jpeg;base64,' + data);
                }, (err) => {
                  reject('Unable to take photo: ' + err);
                })


              }
            },
            {
              text: this.trans.instant('TAKE_PHOTO'),
              handler: () => {

                this.camera.getPicture({
                  quality: 100,
                  destinationType: this.camera.DestinationType.DATA_URL,
                  encodingType: this.camera.EncodingType.JPEG,
                  targetHeight: 1000,
                  targetWidth: 1000,
                  saveToPhotoAlbum: false,
                  correctOrientation: true
                }).then((data) => {
                  resolve('data:image/jpeg;base64,' + data);
                }, (err) => {
                  reject('Unable to take photo: ' + err);
                })

              }
            }
          ]
        }).present();



      } else {
        var self = this;
        var file = document.createElement("INPUT");
        file.setAttribute("type", "file");
        file.style.height = "0px";
        file.style.visibility = "hidden";
        file.click();
        file.onchange = function (ev: any) {
          self.getWebImage(ev.target.files[0]).then((res: any) => {
            resolve(res);
          });
        }
      }
    });
  }

  readVideoFile(file: any) {
    // this.readAsbase64(file);
    if (file.type == 'video/mp4') {
      // var ext;
      // var n = file.type.lastIndexOf('/');
      // var result = file.type.substring(n + 1);  
      // console.log('extion----',result);
      // ext = `.${result}`;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imgBlob = new Blob([reader.result], {
            type: file.type
          });

          let blobimageName = file.name;
          let videoBlob = imgBlob;

          let videoObj = {
            blob: videoBlob,
            type: file.type
          }
          resolve(videoObj);
        };
        reader.readAsArrayBuffer(file);
      });

    } else {
      alert('Please choose only video file.');
    }

  }


  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  imgURItoBlob(dataURI) {
    return new Promise((resolve, reject) => {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      console.log(mimeString);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      resolve(new Blob([new Uint8Array(array)], {
        type: mimeString
      }));
    });
  }


  imgURItoBlobR(dataURI) {

    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    console.log(mimeString);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  getWebImage(imagefile: any) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (readerEvent) => {
        let imageData = (readerEvent.target as any).result;
        resolve(imageData);
      };
      reader.readAsDataURL(imagefile);
    });

  }

  generateImageName(name) {
    let ext = this.getImageExt(name);
    return new Date().getTime() + '.' + ext;
  }

  getImageExt(name) {
    return name.substr(name.lastIndexOf('.') + 1);
  }


  getImageFromCamera() {
    return new Promise((resolve, reject) => {
      if (Camera['installed']()) {
        this.camera.getPicture({
          quality: 75,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          targetHeight: 1000,
          targetWidth: 1000,
          saveToPhotoAlbum: false,
          correctOrientation: true
        }).then((data) => {
          resolve('data:image/jpeg;base64,' + data);
        }, (err) => {
          reject('Unable to take photo: ' + err);
        })

      } else {
        var self = this;
        var file = document.createElement("INPUT");
        file.setAttribute("type", "file");
        file.style.height = "0px";
        file.style.visibility = "hidden";
        file.click();
        file.onchange = function (ev: any) {
          self.getWebImage(ev.target.files[0]).then((res: any) => {
            resolve(res);
          });
        }
      }
    })
  }
}
