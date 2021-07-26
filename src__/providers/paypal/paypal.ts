import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the PaypalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaypalProvider {

  constructor(public http: HttpClient,
    public payPal: PayPal) {
    console.log('Hello PaypalProvider Provider');
  }



  pay(amt: any) {
   console.log('Amount===================== ',amt);
   
    return new Promise((resolve) => {
      this.payPal.init({
        PayPalEnvironmentProduction: 'AboZ5AGczvI-lO0S6s2_pMkTFSQnuK3iod5JChOcpG7nyA3E0PGqksE0w1yLIC-jVlmoYq7pTlkxolHj',
        PayPalEnvironmentSandbox: 'AboZ5AGczvI-lO0S6s2_pMkTFSQnuK3iod5JChOcpG7nyA3E0PGqksE0w1yLIC-jVlmoYq7pTlkxolHj'
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {
          let payment = new PayPalPayment(amt, 'USD', 'Description', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((res) => {
            // Successfully paid
            console.log("payment success------------------------------------", res)
            resolve(res.response.id);
            // Example sandbox response
            //
            // {
            //   "client": {
            //     "environment": "sandbox",
            //     "product_name": "PayPal iOS SDK",
            //     "paypal_sdk_version": "2.16.0",
            //     "platform": "iOS"
            //   },
            //   "response_type": "payment",
            //   "response": {
            //     "id": "PAY-1AB23456CD789012EF34GHIJ",
            //     "state": "approved",
            //     "create_time": "2016-10-03T13:33:33Z",
            //     "intent": "sale"
            //   }
            // }
          }, (err) => {
            // Error or render dialog closed without being successful
            console.log("Error or render dialog closed without being successful------------------------------------", err)
          });
        }, (err) => {
          // Error in configuration
          console.log("Error in configuration------------------------------------", err)

        });
      }, (err) => {
        // Error in initialization, maybe PayPal isn't supported or something else
        console.log("Error in initialization, maybe PayPal isn't supported or something else------------------------------------", err)

      });
    });
  }
}
