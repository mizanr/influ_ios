import { FileOpener } from '@ionic-native/file-opener';
import { TranslateService } from '@ngx-translate/core';
import { AuthProvider } from '../auth/auth';
import { AlertProvider } from '../alert/alert';

import { File, FileEntry } from '@ionic-native/file';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { subscribeOn } from 'Rxjs/operator/subscribeOn';
import { MediaProvider } from '../media/media';
/*
  Generated class for the DownloadProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DownloadProvider {
  percentage = 0;
  downloadingTitle = "";
  isDownloading = false;
  fileTransfer: FileTransferObject;
  constructor(
    public http: HttpClient,
    public file: File,
    public alert: AlertProvider,
    public zone: NgZone,
    public transfer: FileTransfer,
    public auth: AuthProvider,
    public trans: TranslateService,
    public mediaP: MediaProvider,
    public fileOpener: FileOpener,
  ) {
    // console.log('Hello DownloadProvider Provider');
  }



  download(filename: any) {//, id:number, title:string){
    console.log('filename', filename);
    console.log('filename', filename.trim());
    this.isDownloading = true;
    // let name = filename.substr(1, filename.length - 2)
    this.percentage = 0;

    // this.loading.show();


    this.downloadingTitle = filename.trim();


    var localurl = this.file.externalRootDirectory + "Download/" + filename;
    console.log('mizan', localurl);
    this.isDownloading = true;
    this.percentage = 0;
    this.fileTransfer = this.transfer.create();

    console.log('FileLiveUrl------', this.auth.mediaLink + filename);
    this.fileTransfer.download(this.auth.mediaLink + filename, localurl).then((entry) => {
      // this.loading.hide();
      // this.saveData(song,localurl,imageurl);
      this.mediaP.getMime(localurl).then((mimeType: any) => {
        this.fileOpener.open(localurl, mimeType).then(r => {
          console.log('file opened successfully!');
        })
      })
      let files = entry as FileEntry;
      files.file(success => {

        console.log('success-------', success);
      });
      this.isDownloading = false;
      this.percentage = 0;
      this.downloadingTitle = "";
      this.alert.presentToast("'" + filename + "' " + this.trans.instant('HAS_BEEN_ADDED_TO_DOWNLOAD_FOLDER'), "bottom");

    }, (error) => {
      console.log("error", error);
      this.resetvariable();
      //this.loading.hide();

    });
    this.fileTransfer.onProgress((res: ProgressEvent) => {
      this.zone.run(() => {
        this.isDownloading = true;

        this.percentage = Math.floor(res.loaded / res.total * 100);
      })
    })





  }

  resetvariable() {
    this.isDownloading = false;
    this.downloadingTitle = "";
    this.percentage = 0;
  }

  cancelDownload() {

    this.alert.confirmationAlert("Confirmation", "Are you sure want to cancel this downloading?").then((res) => {
      if (res) {

        this.isDownloading = false;
        this.percentage = 0;
        this.fileTransfer.abort();
      }

    });
  }


  checkFileExistOrNot(filename) {
    console.log('File Name----', filename);

    return new Promise((resolve, reject) => {

      var localurl = this.file.externalRootDirectory + "Download/";
      this.file.checkFile(localurl, filename).then((res) => {
        console.log('file found', res);
        resolve(1)
      }).catch((err) => {
        resolve(0);
        console.log('file not found', err);
      });



    });
  }




  createTextFile(content, name) {
    return new Promise((resolve, reject) => {
      let filename = name + '.txt';
      var path = this.file.externalRootDirectory + "Download/";
      //  this.file.createFile(path, filename, true).then((res)=>{
      this.file.writeFile(path, filename, content, { replace: true }).then((res) => {
        console.log("file created response", res);
        resolve(true)
      })
        .catch((res) => {
          console.log("file created error", res);
          resolve(false)
        })

    })
    // })

  }

}
