import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StarRatingModule } from 'ionic3-star-rating';
import { AuthProvider } from '../../providers/auth/auth';
import { RestApiProvider } from '../../providers/rest-api/rest-api';

/**
 * Generated class for the RatePopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-rate-popup',
  templateUrl: 'rate-popup.html',
})
export class RatePopupPage {
service_info:any;
comment:any='';
rating:any=0;
rate:any=0;
influ_info:any;

  constructor(public navCtrl: NavController, 
    public view:ViewController,
    public auth: AuthProvider, public api: RestApiProvider,
    public navParams: NavParams) {
      this.influ_info=navParams.data.data;

      console.log(this.influ_info);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatePopupPage');
  }


  logRatingChange(ev:any) {
    console.log(ev);
    this.rate=ev;
  }


  submit() {
    let Data = {
      company_id:{value:this.auth.getCurrentUserId(),type:'NO'},
      influ_id:{value:this.influ_info.id,type:'NO'},
      comment:{value:this.comment,type:'NO'},
      // jobId:{value:this.service_info.Id,type:'NO'},
      rate:{value:this.rate,type:'NO'},
    }
    this.api.postData(Data,0,'rate_now').then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.view.dismiss(true);
      }
    })
  }

}
