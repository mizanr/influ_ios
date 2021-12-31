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
  paypay_id:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public loader: LoadingProvider,
    public auth: AuthProvider,
    public api: RestApiProvider) {
      setTimeout(() => {
       
      }, 2000);
    let lang = this.auth.getUserLanguage();
    let newUrl: any;
    if (lang == 'en') {
      newUrl = "https://www.paypal.com/sdk/js?client-id=AboZ5AGczvI-lO0S6s2_pMkTFSQnuK3iod5JChOcpG7nyA3E0PGqksE0w1yLIC-jVlmoYq7pTlkxolHj&currency=USD&locale=en_US"
    } else {
      newUrl = "https://www.paypal.com/sdk/js?client-id=AboZ5AGczvI-lO0S6s2_pMkTFSQnuK3iod5JChOcpG7nyA3E0PGqksE0w1yLIC-jVlmoYq7pTlkxolHj&currency=USD&locale=he_IL"
    }
    let elemnt: any = document.getElementById("payPalD");
    console.log('elemnt--------', elemnt);
    // elemnt.setAttribute("src", newUrl);
    // console.log('newElement--------',newElement);

    // document.head.appendChild(newElement);
    this.loader.show();
    setTimeout(() => {
     this.pay();
      this.loader.hide();
    }, 3000);
    this.getCodes();
  }

  ionViewWillEnter() {
    this.api.get({},0,'Paypal_detail').then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.paypay_id=res.data.PayPal_CLIENT_ID;
        // let lang = this.auth.getUserLanguage();
        // let newUrl: any;
        // if (lang == 'en') {
        //   newUrl =`https://www.paypal.com/sdk/js?client-id=${this.paypay_id}&currency=USD&locale=en_US`;
        // } else {
        //   newUrl =`https://www.paypal.com/sdk/js?client-id=${this.paypay_id}&currency=USD&locale=he_IL`;
        // }
        // let elemnt: any = document.getElementById("payPalD");
        // console.log('elemnt--------', elemnt);
        // elemnt.setAttribute("src", newUrl);
       // this.pay_pal();

      }
    })
  }


  pay_pal() {
		let  client = {
		  sandbox : this.paypay_id,
		  production: 'AW2zU1GQAEoIgiEFHvXIgKrf11ptFpkZYzQu1wLiQzgS3F_s6LrENjg9BsG15bzGOY3CK86QzOizsXtw'
	   }
		 let self=this;     
		 paypal.Button.render({
		   env: 'sandbox',
		   client: client,commit: true,style: {size: 'medium'},
		   payment: (data, actions) => {return actions.payment.create({payment: {transactions: [
				   { amount: { total: self.navParams.get('Amount'), currency: 'USD' }}
				 ]}});
			   },
		   onAuthorize:(data, actions)=>{
			 return actions.payment.execute().then((payment) => {
			   console.log('new paypal payment:-',payment);
         self.viewCtrl.dismiss(payment.cart);
			//    this.make_promote(this.allData,payment.id,'PayPal');
			   //this.view.dismiss(payment);
			  //  this.navCtrl.pop();
			  //  if(this.type == 'C'){
			  //    this.charity_donate(payment.id);
			  //  } else {
			  //    this.donate_program(payment.id);
			  //  }
			 
			 })
	  
			
		   },
			onError:  (err) => {
			 // Show an error page here, when an error occurs
			 console.error(err);
			 // this.alertP
		 }
		 },`#paypal-button-container`)
		 
	   }


  new_paypal() {	
    paypal.Buttons({      
      style:{
        label:'checkout',
        tagline:false,
        branding:false,
        size:'responsive',
      },      
      funding: {      
      },      
      createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.navParams.get('Amount')
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
          // This function shows a transaction success message to your buyer.
          console.log(details);
        });
      }
    }).render('#paypal-button-container');
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
      sandbox: this.paypay_id,//'AQwoZAAHsmA5vBLj_mZffS3NWJjNJODewuV2WakPm-BQilgsawTtnbLvWHNC73idcfiaHBOjaeTDkAS8',//'Ad4svtxw9WY-uml1hsNFEtPYIeNue-SWhBorz7ARjYoU1lxE5bAiE53i4OZcggMWdPB8C1NLaJ_YkquO',
      production: this.paypay_id//'AQwoZAAHsmA5vBLj_mZffS3NWJjNJODewuV2WakPm-BQilgsawTtnbLvWHNC73idcfiaHBOjaeTDkAS8'
    }
    let u = this.auth.getUserDetails();
    console.log('user info-------',u);
    let self = this;
    let payer = {

    };
    // payer['cc_given_name'] = "test";
    // payer['cc_family_name'] = 'test';
    payer={
      name:{
      given_name:u.first_name,
      surname:u.last_name
    },
  }
    // ['given_name'] = "test";
    // payer['name']['family_name'] = "test";

    payer['address'] = {};
    if (u.company_address) {
      payer['address']["address_line_1"] = u.company_address;
      payer['address']["country_code"] = this.countrySN;
      // payer['address']["postal_code"] = u.zip_code;
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
    if (u.phone) {
      payer['phone']["phone_type"] = 'MOBILE';
      payer['phone']["phone_number"]['national_number'] = u.phone;
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
