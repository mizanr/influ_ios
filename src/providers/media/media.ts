import { IOSFilePicker } from '@ionic-native/file-picker';
import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../alert/alert';

import { LoadingProvider } from './../loading/loading';
import { Camera } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
// import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Media, MediaObject } from '@ionic-native/media';
import { File, FileEntry } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { ImageProvider } from '../image/image';
import { Platform, AlertController } from 'ionic-angular';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { DomSanitizer } from "@angular/platform-browser";
import { ImagePicker } from '@ionic-native/image-picker';
import { normalizeURL } from 'ionic-angular';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor';

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPE = "video/mp4";
@Injectable()
export class MediaProvider {
  recordingStatus = 0;
  timer = "00:00";
  duration = -1;
  file_array = [];
  isLoaded = false;
  isPlay = false;
  position = 0;
  interval1:any;
  interval2:any;
  interval3:any;
  filePath_array = [];
  blob = {
  }
  filepath: any;
  audioInterval: any;

  audiofile: MediaObject;
  audioFileName:string = '';
  audioFileDir:string = '';
  VideoEditorOptions = {
    OptimizeForNetworkUse: {
      NO: 0,
      YES: 1
    },
    OutputFileType: {
      M4V: 0,
      MPEG4: 1,
      M4A: 2,
      QUICK_TIME: 3
    }
  };
  constructor(
    public http: HttpClient,
    public camera: Camera,
    private androidPermissions: AndroidPermissions,
    private videoEditor: VideoEditor,
    public filepicker:IOSFilePicker,
    // private mediaCapture: MediaCapture,
    private media: Media,
    public loading: LoadingProvider,
    private zone: NgZone,
    public sanitizer: DomSanitizer,
    public image: ImageProvider,
    private file: File,
    private filePath: FilePath,
    private fileChooser: FileChooser,
    public imagePicker: ImagePicker,
    public plt: Platform,
    public imageResizer: ImageResizer,
    public alert: AlertProvider,
    public alertCtrl: AlertController,
    public trans: TranslateService
  ) {
    // console.log('Hello MediaProvider Provider');
    this.askpermission();

  }

  askpermission() {
    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      this.androidPermissions.PERMISSION.RECORD_AUDIO,
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
    ]);
  }

  getUniqeName() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  startAudioRecording() {
    console.log('statting recordoing');
    this.audioFileDir = this.file.externalDataDirectory;
    this.audioFileName = this.getUniqeName() + '.mp3';

    if (this.plt.is('ios')) {
      this.audioFileDir = this.file.documentsDirectory;
      this.audioFileName = this.getUniqeName() + '.m4a';
    }

    const recordPath = (this.audioFileDir + this.audioFileName).replace(/file:\/\//g, '');
    this.audiofile = this.media.create(recordPath);
    this.audiofile.startRecord();
    this.recordingStatus = 1;
    let time = 0;
    this.audioInterval = setInterval(() => {
      time = time + 1;
      let min = parseInt(time / 60 + "");
      let sec = time % 60;
      let min1 = min > 9 ? min + "" : "0" + min;
      let sec1 = sec > 9 ? sec + "" : "0" + sec;
      this.timer = min1 + ':' + sec1;
    }, 1000);

    // this.file.createFile((this.file.documentsDirectory.replace(/^file:\/\//, '')), 'my_file.3gp', true).then(() => {
    //   console.log('statting file c------');
    //   this.audiofile = this.media.create((this.file.documentsDirectory.replace(/^file:\/\//, '')) + 'my_file.3gp');
    //
    //   this.audiofile.onError.subscribe(error => {
    //     alert('Audio recording----'+JSON.stringify(error));
    //   });
    //
    //   this.filepath = (this.file.documentsDirectory.replace(/^file:\/\//, '')) + 'my_file.3gp';
    //   console.log('statting recoding-------1423625');
    // this.audiofile.startRecord()
    // console.log('statting recordoing after---------');
    // // onerror = (error) => alert('audio recording error');
    // this.recordingStatus = 1;
    //
    // console.log('recordingStatus------ in mediaprovider',this.recordingStatus);
    //
    // let time = 0;
    // this.audioInterval = setInterval(() => {
    //   time = time + 1;
    //   let min = parseInt(time / 60 + "");
    //   let sec = time % 60;
    //   let min1 = min > 9 ? min + "" : "0" + min;
    //   let sec1 = sec > 9 ? sec + "" : "0" + sec;
    //   this.timer = min1 + ':' + sec1;
    // }, 1000)
    // }).catch((err) => {
    //   console.log('catch----',err);
    // })
  }


  stopAudioRecording() {
    this.audiofile.stopRecord();
    this.recordingStatus = 2;
    clearInterval(this.audioInterval);

    //
    // clearInterval(this.interval1);
    // clearInterval(this.interval2);
    // clearInterval(this.interval3);
    // this.recordingStatus = 2;
    // clearInterval(this.audioInterval);
    // this.readAsBlob("file://"+this.filepath).then((res) => {
    //   this.blob = res;
    // });
    //
    // this.audiofile.play();
    // //this.audiofile.setVolume(0.0); // you don't want users to notice that you are playing the file
    // this.interval1 = setInterval(() => {
    //   if (this.duration == -1) {
    //     this.duration = ~~this.audiofile.getDuration(); // make it an integer
    //
    //   } else {
    //     // this.audiofile.stop();
    //     this.audiofile.pause();
    //     console.log("paused", this.duration);
    //     this.getAndSetCurrentAudioPosition();
    //     //this.audiofile.release();
    //     //this.setRecordingToPlay();
    //     clearInterval(this.interval1);
    //   }
    // }, 100);
  }


  fromserver() {
    this.audiofile = this.media.create(this.filepath);
    // var error = this.audiofile.onError;
    // alert('audio record error'+error);
    this.audiofile.play();
    //this.audiofile.setVolume(0.0); // you don't want users to notice that you are playing the file
    this.interval2 = setInterval(() => {
      if (this.duration == -1) {
        this.duration = ~~this.audiofile.getDuration(); // make it an integer

      } else {
        //this.audiofile.stop();
        this.audiofile.pause();
        this.isLoaded = true;
        console.log("paused", this.duration);
        this.getAndSetCurrentAudioPosition();
        //this.audiofile.release();
        //this.setRecordingToPlay();
        clearInterval(this.interval2);
      }
    }, 100);
  }


  playaudio() {
    try {
      this.audiofile.play();
      //this.getAndSetCurrentAudioPosition();
      this.isPlay = true;
      this.audiofile.setVolume(0.8);
    } catch (e) {
      console.log('play audio error ', e);
    }

  }
  pauseaudio() {

    this.audiofile.pause();
    this.isPlay = false;
  }

  resetRecording() {
    this.position = 0;
    this.recordingStatus = 0;
    this.timer = "00:00";
    this.isLoaded = false;
    clearInterval(this.interval1);
    clearInterval(this.interval2);
    clearInterval(this.interval3);
    this.duration = -1;
    this.isPlay = false;
    this.audiofile.stop();
    this.audiofile.release();
    this.blob = {
    }

  }


  getAndSetCurrentAudioPosition() {
    //console.log("get and set current audio position");
    let diff = 1;
  this.interval3 = setInterval(() => {
      let last_position = this.position;
      this.audiofile.getCurrentPosition().then(position => {
        console.log('current posiitin:', position);
        if (position >= 0 && position < this.duration) {
          if (Math.abs(last_position - position) >= diff) {
            this.audiofile.seekTo(last_position * 1000);
          } else {
            // update position for display
            this.zone.run(() => {
              this.position = position;
              console.log(this.position);
            })
          }
        } else if (position >= this.duration) {
          //this.pauseaudio();
          this.audiofile.stop();
          this.isPlay = false;
          this.position = 0;
        }
      });
    }, 100);
  }






















  getWebImage() {
    let imageData: any;
    let _this = this;
    return new Promise((resolve, reject) => {
      var file = document.createElement("INPUT");
      file.setAttribute("type", "file");
      file.style.height = "0px";
      file.style.visibility = "hidden";
      file.click();
      file.onchange = function (ev: any) {
        let reader = new FileReader();
        reader.onload = (readerEvent) => {
          imageData = (readerEvent.target as any).result;


          _this.image.imgURItoBlob(imageData).then((blob: any) => {
            console.log(blob);
            let name = _this.image.generateImageName("hello.jpg");
            resolve({ file: blob, name: name, preview:imageData });
          })



          // resolve(imageData);
        };

        reader.readAsDataURL(ev.target.files[0]);
      }
      console.log(imageData);


    });

  }





















  /************************************************************************************** */


  // getVideoByCamera(){
  //   return new Promise((resolve, reject) => {
  //   let options: CaptureVideoOptions = { limit: 1, quality: 0 };
  //   this.mediaCapture.captureVideo(options)
  // .then(
  //   (data: MediaFile[]) => {
  //      console.log("video captured successfull",data);
  //      this.loading.show();
  //     this.readAsBlob(data[0].fullPath).then((res)=>{
  //       if(res==0){
  //         this.loading.hide();
  //       resolve(0);
  //       }
  //       else{
  //         console.log("get blob successfull",res);
  //         this.getThumbByVideo(data[0].fullPath).then((thmb:any)=>{
  //           this.loading.hide();
  //           if(thmb==0){
  //               resolve(0);
  //           }
  //           else{
  //             resolve({thumb:thmb,video:res})
  //           }

  //         });
  //       }
  //     });

  //   },
  //   (err: CaptureError) => {
  //     resolve(0);
  //   }
  // );
  //   });

  // }


  getFile1() {
    console.log('get file fun. calling.........');
    return new Promise((resolve, reject) => {
      this.fileChooser.open()
        .then(uri => {
          console.log('Uri-----------', uri);

          this.filePath.resolveNativePath(uri)
            .then(filePath => {
              console.log('filePath-----------', filePath);
              this.loading.show();
              this.readAsBlob(filePath).then((res) => {
                resolve(res);
                this.loading.hide();
              });
            })
            .catch(err => {
              this.loading.hide();
              resolve(0)
            });
        })
        .catch(e => {
          this.loading.hide();
          resolve(0)
        });
    });

  }

  getFile() {
    // alert("getting file");
     return new Promise((resolve, reject) => {
       this.filepicker.pickFile()
       .then(uri => {
        // this.alert.presentToast('mizantest uri created -----'+uri,'bottom');
           let path = uri.includes("file://") ? uri : "file://" + uri;
           this.loading.show();
           this.readAsBlob(path).then((res)=>{
             resolve(res);
             this.loading.hide();
           });
           })
       .catch(e => {
         this.loading.hide();
         alert("pick file error");
         resolve(0)
       });
     });

   }

  getCompressedImage(no) {
    return new Promise((resolve, reject) => {

      this.alertCtrl.create({
        title: this.trans.instant('SET_PHOTO'),
        message: this.trans.instant('DO_YOU_WNAT_TO_TAKE_PHOTO_OR_CHOOSE_FORM_YOUR_PHOTO_GALLERY'),
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              resolve(0);
            }
          },
          {
            text: this.trans.instant('CHOOSE_FROM_GALLERY'),
            handler: () => {
              this.selectMultipleImages(no).then((res: any) => {
                let k = {
                  imgRes:res,
                  resType:'multipleImage'
                }
                resolve(k);
              })

            }
          },
          {
            text: this.trans.instant('TAKE_PHOTO'),
            handler: () => {
              this.getImageByCamera().then((res: any) => {
                let k = {
                  imgRes:res,
                  resType:'singleImage'
                }
                resolve(k);
              })
            }
          }
        ]
      }).present();
    });
  }


  selectMultipleImages(imgCount: any) {
    this.file_array = [];
    return new Promise((resolve, reject) => {
      let file_array = [];
      this.filePath_array = [];
      let options = {
        maximumImagesCount: imgCount,
      }
      this.imagePicker.getPictures(options).then((results: any) => {
        // alert("selected Images - "+JSON.stringify(results));
        console.log('results----------------', results);
        this.getCompressedblobFromMultiple(results, 0, results.length).then(file_array => {
          console.log('file_array before resolve ====--------------', file_array);
          resolve(file_array);
        })
      }, (err) => {
        // alert("err on select multiple images - "+JSON.stringify(err));
        reject(err);
      });
    })
  }


  getCompressedblobFromMultiple(results, i, n) {
    // console.log("get blob for multiple", i,n);
    console.log('getblobFromMultiple', i, n);
    return new Promise((resolve, reject) => {
      let uri=results[i];
      let filePath = uri.includes("file://")?uri:"file://"+ uri;
      // let options = {
      //   uri: results[i],
      //   quality: 100,
      //   width: this.plt.width() * 2,
      //   height: this.plt.height() * 2
      // } as ImageResizerOptions;

      // this.imageResizer.resize(options).then((filePath: string) => {
        console.log('get uri ----------------------', filePath);
        this.readAsBlob(filePath).then((res) => {
          console.log('i-------', results.length, i)
          if (res != 0) {
            this.file_array.push(res);
            // console.log('file_array--------------', this.file_array);
            console.log('blob_file--------', this.file_array);

          }
          else {

          }
          if (i < n - 1) {
            // console.log('this.getblobFromMultiple(results,i+1,n)==========', this.getblobFromMultiple(results, i + 1, n));

            this.getCompressedblobFromMultiple(results, i + 1, n).then((resa) => {
              resolve(resa)
            });
          }
          else {
            console.log('this.file_array ====--------------', this.file_array);
            resolve(this.file_array)
          }
        })
      // }).catch(e => console.log('resizer Error----------------------', e));
    })
  }


  readAsBlob(path) {
    return new Promise((resolve, reject) => {
      console.log('path--------', path);
      this.file.resolveLocalFilesystemUrl(path)
        .then(entry => {
          (<FileEntry>entry).file(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const blob = new Blob([reader.result], {
                type: file.type
              });
              console.log("blob.....", blob);
              let k = this.sanitizer.bypassSecurityTrustUrl((<any>window).Ionic.WebView.convertFileSrc(path));
              // this.alert.presentToast('blob generated-----','bottom');
              resolve({ name: file.name, file: blob, preview: k, path: path });
              // this.blob['name']=file.name;
              // this.blob['file']=blob;
              //  console.log("got blob file successfully", this.blob);
            };
            reader.readAsArrayBuffer(file);
          })
        })
        .catch(err => {
          // this.alert.presentToast('mizantest locl file system err -----','bottom');
          console.log("localfilesytem resolve.....", err);
          resolve(0);
        });
    })
  }


  readAsBlob2(path) {
    return new Promise((resolve, reject) => {
      console.log(path);
      this.file.resolveLocalFilesystemUrl(path)
        .then(entry => {
          console.log('entry----------------------', entry);
          (<FileEntry>entry).file(file => {
            console.log('file----------------------', file);
            const reader = new FileReader();
            reader.onloadend = () => {
              const blob = new Blob([reader.result], {
                type: file.type,
              });
              console.log("blob.....", blob);
              resolve({ name: file.name, file: blob,
                preview: this.sanitizer.bypassSecurityTrustResourceUrl((<any>window).Ionic.WebView.convertFileSrc(path)) });
              // this.blob['name']=file.name;
              // this.blob['file']=blob;
              //  console.log("got blob file successfully", this.blob);
            };
            reader.readAsArrayBuffer(file);
          })

        })
        .catch(err => {
          console.log("localfilesytem resolve.....", err);
          resolve(0);
        });
    })
  }

  getImageByCamera() {
    console.log("media provider");
    return new Promise((resolve, reject) => {
      if(this.plt.is('cordova')){

          this.camera.getPicture({
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            targetHeight: 1000,
            targetWidth: 1000,
            saveToPhotoAlbum: false,
            correctOrientation: true
          }).then((data) => {
            let path = data;
            console.log('Path--------==', path);

            // let options = {
            //   uri: path,
            //   quality: 100,
            //   width: this.plt.width() * 2,
            //   height: this.plt.height() * 2
            // } as ImageResizerOptions;

            let filePath = path.includes('file://')?path:'file://'+path;
            // this.imageResizer
            //   .resize(options)
            //   .then((filePath: string) => {
                console.log('FilePath--------------==', filePath);
                this.readAsBlob(filePath).then((res) => {
                  if (res == 0) {
                    // this.loading.hide();
                    resolve(0);
                  }
                  else {
                    resolve(res);
                    console.log("get blob successfull", res);

                  }
                });
              // })
              // .catch(e => console.log(e));






            // console.log('getting image by camera',data);
            //resolve('data:image/png;base64,' + data);
          }, (err) => {
            console.log('getting image by camera', err);
            reject('Unable to take photo: ' + err);
          })

      }

      else {
        this.getWebImage().then((res: any) => {
          resolve(res);
          // this.image.imgURItoBlob(res).then((blob: any) => {

          //   // console.log(blob);
          //   // let name = this.image.generateImageName("hello.jpg");
          //   // resolve({ file: blob, name: name, preview:res });


          // })

        })

      }
    });
  }



  getImageByGallery() {
    console.log("media provider");
    return new Promise((resolve, reject) => {
      if(this.plt.is('cordova')){
        console.log('In is cordova-------------------');

        this.camera.getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          quality: 100,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          targetHeight: 1000,
          targetWidth: 1000,
          saveToPhotoAlbum: false,
          correctOrientation: true
        }).then((data) => {
          let path = data;
          console.log('gallerypath', path);
          let options = {
            uri: path,
            quality: 100,
            width: this.plt.width() * 2,
            height: this.plt.height() * 2,

          } as ImageResizerOptions;

          this.imageResizer
            .resize(options)
            .then((filePath: string) => {
              console.log('FilePath--------------==', filePath);
              this.readAsBlob(filePath).then((res) => {
                if (res == 0) {
                  // this.loading.hide();
                  resolve(0);
                }
                else {
                  resolve(res);
                  console.log("get blob successfull", res);

                }
              });
            })
            .catch(e => console.log(e));
          //   resolve('data:image/png;base64,' + data);
        }, (err) => {
          reject('Unable to take photo: ' + err);
        })
      }
      else {
        this.getWebImage().then((res: any) => {
          console.log('In is getWebImage-------------------');

          resolve(res);
        })

      }
    });
  }


  getVideoByGallery() {
    console.log("media provider");
    return new Promise((resolve, reject) => {
      if (Camera['installed']()) {
        this.camera.getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.VIDEO
        }).then(async (data) => {
          console.log('checking path for get video by gallery', data);
          if (data) {
            let path = data.includes("file://") ? data : "file://" + data;
            console.log('checking path ', path);
            this.loading.show();
            var filename = data.substr(data.lastIndexOf('/') + 1);
            var dirpath = data.substr(0, data.lastIndexOf('/') + 1);

            dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;

            try {
              var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
              var retrievedFile = await this.file.getFile(dirUrl, filename, {});
            } catch (err) {
              console.log('try error');
              console.error(err);
              this.loading.hide();
              // resolve(0);
              return 0;//this.alert.s("Error","Something went wrong.");
            }

            retrievedFile.file(f => {
              this.loading.hide();
              console.log('retrieved file size:', f.size);
              console.log('retrieved file mime:', f.type);
              console.log("retrieve", f)
              if (f.type !== 'video/quicktime') {
                resolve(0);
                return this.alert.show("Alert!", 'Incorrect file format!');
              }
              if (f.size > MAX_FILE_SIZE) {
                resolve(0);
                return this.alert.show("Alert!", 'Please add video that have size less than 4 mb.');
              } else {
                this.readAsBlob(dirpath + filename).then((res) => {
                  if (res == 0) {
                    this.loading.hide();
                    resolve(0);
                  }
                  else {
                    console.log("get blob successfull", res);
                    this.getThumbByVideo(path).then((thmb: any) => {
                      this.loading.hide();
                      if (thmb == 0) {
                        resolve(0);
                      }
                      else {
                        resolve({ thumb: thmb, video: res })
                      }


                    });
                  }
                });
              }
              // this.selectedVideo = retrievedFile.nativeURL;
            });
            this.readAsBlob(dirpath + filename).then((res) => {
              if (res == 0) {
                this.loading.hide();
                resolve(0);
              }
              else {
                console.log("get blob successfull", res);
                this.getThumbByVideo(path).then((thmb: any) => {
                  this.loading.hide();
                  if (thmb == 0) {
                    resolve(0);
                  }
                  else {
                    resolve({ thumb: thmb, video: res })
                  }


                });
              }
            });



          }
          else {
            console.log('did not get any data');
          }


        }, (err) => {
          reject('Unable to take photo: ' + err);
        })
      }

    });
  }

  getVideoByGallery1() {
    console.log("media provider");
    return new Promise((resolve, reject) => {
      if (Camera['installed']()) {
        this.camera.getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.VIDEO
        }).then(async (data) => {
          console.log('checking path for get video by gallery', data);
          if (data) {
            let path = data.includes("file://") ? data : "file://" + data;
            console.log('checking path ', path);
            this.loading.show();
            var filename = data.substr(data.lastIndexOf('/') + 1);
            var dirpath = data.substr(0, data.lastIndexOf('/') + 1);

            dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
            // try {
            //   var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
            //   var retrievedFile = await this.file.getFile(dirUrl, filename, {});


            // } catch(err) {
            //   console.log('try error');
            //   this.loading.hide();
            //   return 0;//this.alert.s("Error","Something went wrong.");
            // }

            // retrievedFile.file( f => {
            //     this.loading.hide();
            //     console.log('retrieved file size:',f.size);
            //     console.log('retrieved file mime:',f.type);
            //     console.log("retrieve",f)
            //     // if (data.size > MAX_FILE_SIZE) return this.presentAlert("Error", "You cannot upload more than 5mb.");
            //     // if (data.type !== ALLOWED_MIME_TYPE) return this.presentAlert("Error", "Incorrect file type.");

            //     // this.selectedVideo = retrievedFile.nativeURL;
            // });
            // let path =  "file://"+data;
            this.readAsBlob(dirpath + filename).then((res) => {
              if (res == 0) {
                this.loading.hide();
                resolve(0);
              }
              else {
                console.log("get blob successfull", res);
                this.getThumbByVideo(path).then((thmb: any) => {
                  this.loading.hide();
                  if (thmb == 0) {
                    resolve(0);
                  }
                  else {
                    resolve({ thumb: thmb, video: res })
                  }


                });
              }
            });
          }
          else {
            console.log('did not get any data');
          }


        }, (err) => {
          reject('Unable to take photo: ' + err);
        })
      }

    });
  }

  getThumbByVideo(filepath) {
    console.log('getThumbByVideo', filepath);
    let date = (new Date()).getTime();
    return new Promise((resolve) => {
      var option: CreateThumbnailOptions = { fileUri: filepath, width: 300, height: 300, atTime: 1, outputFileName: 'thumb'+date, quality: 50 };
      this.videoEditor.createThumbnail(option).then(result => {
        // let thumbpath = this.file.externalDataDirectory + "files/videos/thumb.jpg";
        let thumbpath = result.includes("file://") ? result : "file://" + result;
        this.readAsBlob(thumbpath).then((res) => {
          if (res == 0) {

            resolve(0);
          }
          else {
            console.log("get blob successfull", res);
            resolve(res);;
          }
        });
      }).catch(e => {
        console.log('thumb error', e);
        resolve(0);
      });
    })
  }


  getMMSS(time: any) {
    var Sec = parseInt(time);
    var returnString = "";
    var hour = Math.floor(Sec / 3600);
    var minute: any;
    var seconds: any;
    minute = Math.floor(Sec / 60);
    if (minute < 10) {
      minute = "0" + minute;
    }
    seconds = Sec % 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (hour > 0) {
      returnString = hour + ":";
    }

    returnString = returnString + minute + ":" + seconds;

    return returnString;


  }
  getblobFromMultiple(results, i, n) {
    // console.log("get blob for multiple", i,n);
    console.log('getblobFromMultiple', i, n);
    return new Promise((resolve, reject) => {
      this.readAsBlob(results[i]).then((res) => {
        console.log('i-------', results.length, i)
        if (res != 0) {
          this.file_array.push(res);
          // console.log('file_array--------------', this.file_array);
          console.log('blob_file--------', this.file_array);

        }
        else {

        }
        if (i < n - 1) {
          // console.log('this.getblobFromMultiple(results,i+1,n)==========', this.getblobFromMultiple(results, i + 1, n));

          this.getblobFromMultiple(results, i + 1, n).then((resa) => {
            resolve(resa)
          });
        }
        else {
          console.log('this.file_array ====--------------', this.file_array);
          resolve(this.file_array)
        }
      })
    })
  }



  getMime(path) {
    return new Promise((resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(path)
        .then(entry => {
          console.log('entry----------------------', entry);
          (<FileEntry>entry).file(file => {

            resolve(file.type);
          })
        })
        .catch(err => {
          console.log("localfilesytem resolve.....", err);
          resolve(0);

        });
    })
  }


}
