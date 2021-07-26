import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingProvider {
  loading:any;
  constructor(public http: HttpClient,
    public loadingCtrl: LoadingController
    ) {
    //console.log('Hello LoaderProvider Provider');
  
  }

  show(){
    this.loading= this.loadingCtrl.create({
      content:''
    });
    this.loading.present();
  }
  hide(){
    this.loading.dismiss();
  }


}
