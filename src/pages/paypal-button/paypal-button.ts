import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { AuthProvider } from './../../providers/auth/auth';
import { LoadingProvider } from './../../providers/loading/loading';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
declare var paypal: any;

@IonicPage()
@Component({
  selector: 'page-paypal-button',
  templateUrl: 'paypal-button.html',
})
export class PaypalButtonPage {
  countries = [];
  countrySN: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public loader: LoadingProvider,
    public auth: AuthProvider,
    public api: RestApiProvider) {
    let lang = this.auth.getUserLanguage();
    let newUrl: any;
    if (lang == 'en') {
      newUrl = "https://www.paypal.com/sdk/js?client-id=AboZ5AGczvI-lO0S6s2_pMkTFSQnuK3iod5JChOcpG7nyA3E0PGqksE0w1yLIC-jVlmoYq7pTlkxolHj&currency=USD&locale=en_US"
    } else {
      newUrl = "https://www.paypal.com/sdk/js?client-id=AboZ5AGczvI-lO0S6s2_pMkTFSQnuK3iod5JChOcpG7nyA3E0PGqksE0w1yLIC-jVlmoYq7pTlkxolHj&currency=USD&locale=he_IL"
    }
    let elemnt: any = document.getElementById("payPalD");
    console.log('elemnt--------', elemnt);
    elemnt.setAttribute("src", newUrl);
    // console.log('newElement--------',newElement);

    // document.head.appendChild(newElement);
    this.loader.show();
    setTimeout(() => {
      this.pay();
      this.loader.hide();
    }, 3000);
    this.getCodes();
  }

  getCodes() {
    let data = {
      // "email": { "value": this.formData.email, "type": "NO" },
    };
    this.api.get(data, 0, 'country').then((result: any) => {
      if (result.status == "0") {
        // this.alertP.show("", result.message);
      } else {
        this.countries = result.data;
        let k: any = this.countries.filter(a => {
          if (a.name == this.auth.getUserDetails().country) {
            return a;
          }
        });
        console.log(k);
        this.countrySN = k[0].iso;
      }
    }, (err) => {
    });
  }


  pay() {
    // this.loader.show();
    let client = {
      sandbox: 'AboZ5AGczvI-lO0S6s2_pMkTFSQnuK3iod5JChOcpG7nyA3E0PGqksE0w1yLIC-jVlmoYq7pTlkxolHj',//'Ad4svtxw9WY-uml1hsNFEtPYIeNue-SWhBorz7ARjYoU1lxE5bAiE53i4OZcggMWdPB8C1NLaJ_YkquO',
      production: 'AboZ5AGczvI-lO0S6s2_pMkTFSQnuK3iod5JChOcpG7nyA3E0PGqksE0w1yLIC-jVlmoYq7pTlkxolHj'
    }
    let u = this.auth.getUserDetails();
    let self = this;
    let payer = {};
    payer['address'] = {};
    if (u.company_address) {
      payer['address']["address_line_1"] = u.company_address;
      payer['address']["country_code"] = this.countrySN;
      payer['email_address'] = u.email;
    }
    if (u.city) {
      payer['address']["admin_area_2"] = u.city;
    }
    if (u.state) {
      payer['address']["admin_area_1"] = u.state;
    }
    if (u.zip_code) {
      payer['address']["postal_code"] = u.zip_code;
    }
    console.log(paypal);

    paypal.Buttons({
      // billin_address:{
      //   email:'mizan@gmail.com'
      // },
      // env: 'sandbox',
      // client: client, commit: true, style: { size: 'large', },
      // payment: (data, actions) => {

      //   console.log('Amt----------', self.navParams.get('Amount'));
      //   // self.loader.hide();

      //   return actions.payment.create({
      //     payment: {
      //       transactions: [
      //         { amount: { total: self.navParams.get('Amount'), currency: 'USD' } }
      //       ]
      //     }
      //   });
      // },
      // onAuthorize: (data, actions) => {
      //   return actions.payment.execute().then((payment) => {
      //     console.log('new paypal payment:-', payment);
      //     this.viewCtrl.dismiss(payment.id);
      //   })
      // },
      // onError: (err) => {
      //   console.error(err);
      //   // alert('Profile of this charity organization is not completed yet!');
      // }

      // Set up the transaction
      createOrder: function (data, actions) {

        return actions.order.create({
          payer: payer,
          purchase_units: [{
            amount: {
              value: self.navParams.get('Amount')
            }
          }]
        });
      },

      // Finalize the transaction
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          console.log('new paypal payment:-', details);
          self.viewCtrl.dismiss(details.id);
          // Show a success message to the buyer
          // alert('Transaction completed by ' + details.payer.name.given_name + '!');
        });
      }

    }).render('#paypal-button-container0')
  }

}
