import { TranslateService } from '@ngx-translate/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ModalController } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AlertProvider } from '../alert/alert'
// let apiUrl = 'http://bluediamondresearch.com/WEB01/veamel/Api/';
// let apiUrl = `https://www.webwiders.com/WEB01/Influ/api/`
let apiUrl = `https://app-api.influen.site/api/`
/*
    usefullData

*/
/***validation***/

const validation = {
  "EMAIL": /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  "PHONE": /^[0-9]{10,14}$/,
  // "PHONE": /^\+[1-9]{1}[0-9]{3,14}$/,
  "postal_code": /^[0-9\ ]{4,8}$/,
  "onlyAlpha": /^[a-zA-Z\s]*$/,
  "PASSW": /^[a-zA-Z0-9]{6,20}$/,
}




/*****************/
@Injectable()
export class RestApiProvider {
  // localStorageUserKey = "yallaLanguage";
  constructor(public http: HttpClient, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public alert: AlertProvider,
    public modal: ModalController,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,
    public trans: TranslateService) {
    console.log('Hello RestApiProvider Provider');
  }


  // presentAlert(message) {
  //
  //
  //
  //   let alert = this.alertCtrl.create({
  //     subTitle: 'GoFrakt',
  //     cssClass: 'simpleAlert',
  //     message: message,
  //     buttons: [{
  //     text:'Okay',
  //     cssClass:'cancel'
  //   }
  //     ]
  //   });
  //   alert.present();
  // }




  /***************************************************************************************************
  *******************************************POST DATA*************************************************
  ****************************************************************************************************/

  validation(data: any) {
    console.log(data);
    for (let key in data) {
      console.log('key----', data[key].type);

      if (data[key].type != "NO") {
        if (data[key].value == null || data[key].value == "" || data[key].value === false) {
          this.alert.showEmptyMessage(data[key].type);
          return 0;
        }
        else if (key == "confirmP" && (data[key].value != data["password"].value)) {
          this.alert.showMessage(data[key].type);
          return 0;
        }
        else if (key == "conf" && (data[key].value != data["password"].value)) {
          this.alert.showMessage(data[key].type);
          return 0;
        }
        else {
          if (data[key].type == "EMAIL" || data[key].type == "PHONE" || data[key].type == "onlyAlpha" || data[key].type == "PASSW") {
            if (!validation[data[key].type].test(data[key].value)) {
              this.alert.showMessage(data[key].type);
              return 0;
            }
          }
        }
      }

    }
    return 1;
  }



  generateFormData(data: any) {

    let input = new FormData();
    for (let key in data) {
      if (key !== "confirmP" && key !== "terms") {
        if (data[key].name && data[key].value) {
          input.append(key, data[key].value, data[key].name);
        } else {
          input.append(key, data[key].value);

        }
        // console.log("----------------form data generated",input,key,data);
      }
    }
    return input;
  }

  postData(data: any, showMsg: number, url: string) {

    console.log('post data called for video.', data);

    const loader = this.loadingCtrl.create({
      // content: "<img src='/assets/f2.gif'>",
      // spinner:'hide',
      cssClass: 'customloading'
    });
    loader.present();
    let valid = this.validation(data);
    // console.log('valid********:-',valid);
    // valid=0;
    //let formdata=this.generateFormData(data);
    //console.log(formdata);
    if (valid != 0) {
      let formdata = this.generateFormData(data);

      // console.log('Formdata**************:-',formdata);
      let headers = new HttpHeaders({ "Accept": "application/json" });

      // console.log('Hearders********:-',headers);

      return new Promise((resolve, reject) => {
        // console.log('Enter on promise');
        this.http.post(apiUrl + url, formdata, { headers: headers })
          .toPromise()
          .then((response: any) => {
            console.log('promise.')
            if (showMsg) {

              // console.log('if showMsg');
              this.alert.show(this.trans.instant('ALERT'), response.message);

            }
            resolve(response);

            loader.dismiss();
          })
          .catch((error) => {
            this.alert.showMessage("TECHP");
            console.error('error***********:-', error);
            reject(error);
            loader.dismiss();
            console.error('error***********:-', error);
          });
      });
    }
    else {
      return new Promise((resolve, reject) => {
        loader.dismiss();
      })
    }
  }


  postDataNoLoader(data: any, showMsg: number, url: string) {
    let valid = this.validation(data);
    // valid=0;
    //let formdata=this.generateFormData(data);
    //console.log(formdata);
    if (valid != 0) {
      let formdata = this.generateFormData(data);
      let headers = new HttpHeaders({ "Accept": "application/json" });
      return new Promise((resolve, reject) => {
        this.http.post(apiUrl + url, formdata, { headers: headers })
          .toPromise()
          .then((response: any) => {
            if (showMsg) {


              this.alert.show(this.trans.instant('ALERT'), response.msg);

            }
            resolve(response);

          })
          .catch((error) => {
            this.alert.showMessage("TECHP");

            reject(error);

          });
      });
    }
    else {
      return new Promise((resolve, reject) => {
      })
    }
  }


  /***************************************************************************************************
  *******************************************GET DATA*************************************************
  ****************************************************************************************************/

  getUrlFromData(data: any) {

    let params = new HttpParams();

    for (let key in data) {
      params = params.append(key, data[key]);
    }
    return params;
  }

  get(data: any, spinner: any, url: string) {
    // data['time'] = (new Date()).getTime();
    const loader = this.loadingCtrl.create({
      //   content: "<img src='/assets/f2.gif'>",
      //     spinner:'hide',
      cssClass: 'customloading'
    });
    if (spinner == "1") {
      loader.present();
    }
    let params = this.getUrlFromData(data);
    return new Promise((resolve, reject) => {
      this.http.get(apiUrl + url, { params: params })
        .toPromise()
        .then((response) => {
          resolve(response);
          loader.dismiss();
        })
        .catch((error) => {
          reject(error);
          loader.dismiss();
        });
    });
  }



  check() {
    return new Promise((resolve, reject) => {
      this.http.get(apiUrl, {})
        .toPromise()
        .then((response) => {
          resolve(response);

        })
        .catch((error) => {
          reject(error);

        });
    });
  }



  getCountries() {
    const loader = this.loadingCtrl.create({
      //   content: "<img src='/assets/f2.gif'>",
      //     spinner:'hide',
      cssClass: 'customloading'
    });

    loader.present();
    return new Promise((resolve, reject) => {
      this.http.get("countries.json", {})
        .toPromise()
        .then((response) => {
          resolve(response);
          loader.dismiss();
        })
        .catch((error) => {
          reject(error);
          loader.dismiss();
        });
    });

    // return new Promise((resolve, reject) => {
    //   this.http.get('https://www.webwiders.com/WEB01/Extra/api.php?action=Get_country').subscribe((response) => {
    //       console.log(response);
    //       resolve(response);
    //       loader.dismiss();
    //   });

    /*this.http.get("countries.json", {  })
      .toPromise()
      .then((response) => {
        resolve(response);
        loader.dismiss();
      })
      .catch((error) => {
        reject(error);
        loader.dismiss();
      });*/
    // });
  }









  getUrlDetails(link) {

    return new Promise((resolve, reject) => {
      resolve(1);
      // const headers = new HttpHeaders({
      //   'Content-Type':  'text/plain',

      // });
      // this.http.get(link, {headers:headers,responseType: 'text' })
      //   .toPromise()
      //   .then((response) => {
      //     resolve(response);

      //   })
      //   .catch((error) => {
      //     reject(error);

      //   });
    });
  }




}
