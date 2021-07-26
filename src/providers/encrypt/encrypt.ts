import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AES256 } from '@ionic-native/aes-256';

/*
  Generated class for the EncryptProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EncryptProvider {

  secureKey: any;
  secureIV: any;
  constructor(public http: HttpClient,
    public aes256: AES256) {
    console.log('Hello EncryptProvider Provider');
    this.generateSecureKeyAndIV();

  }


  generateSecureKeyAndIV() {
    this.secureKey = 'e18b7d4423b599b62f4088ae49660548'; // Returns a 32 bytes string
    this.secureIV = '6fb735c2ec9ec65d'; // Returns a 16 bytes string
    console.log(this.secureKey + '--------' + this.secureIV);
  }

  getEncryptedData(data) {
    return new Promise((resolve, reject) => {
      this.aes256.encrypt(this.secureKey, this.secureIV, data)
        .then(res => {
          console.log('Encrypted Data: ', res);
          resolve(res);
        })
        .catch((error: any) => console.error('aes256 Error--------', error));
    });
  }

}
