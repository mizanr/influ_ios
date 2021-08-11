import { TranslateService } from '@ngx-translate/core';
import { AlertProvider } from './../../providers/alert/alert';
import { AuthProvider } from './../../providers/auth/auth';
import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

/**
 * Generated class for the BlocklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-blocklist',
  templateUrl: 'blocklist.html',
})
export class BlocklistPage {
  blocklist=[];
  noData=false;
  constructor(
    public navCtrl: NavController, 
    public api:RestApiProvider,
    public trans:TranslateService,
    public alert:AlertProvider,
    public auth:AuthProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlocklistPage');
    this.get_block();
  }
  get_block(){
        this.api.get({block_by:this.auth.getCurrentUserId()},1,'BlockedCompanyList').then((res:any)=>{
          if(res.status==1){
              this.blocklist = res.data;
          }
          else{
            this.blocklist=[];
          }

          if(this.blocklist.length==0){
            this.noData=true;
          }
          else{
            this.noData=false;
          }
        })
  }


  unblock(item:any){
    let data = {
      block_by:this.auth.getCurrentUserId(),
      block_to:item.id
    }
    this.api.get(data,1,'UnBlockCompany').then((res:any)=>{
      if(res.status==1){
          this.get_block(); 
         this.alert.presentToast(this.trans.instant('UNBLOCKED_SUCCESSFULL'),'bottom');

      }
      else{
        
        // this.blocklist=[];
      }
    })
  }

}
