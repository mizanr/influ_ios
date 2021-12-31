import { TranslateService } from '@ngx-translate/core';

import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
// import { RestApiProvider } from '../../providers/rest-api/rest-api';

const messages = {
  "BANKACC":{ title: 'Invalid Bank Account!', subTitle: 'Please enter valid  bank account!', empty: "Please enter your  bank account!"},

  "BANKNAME":{ title: 'Invalid Bank Name!', subTitle: 'Please enter valid  bank name!', empty: "Please enter your  bank name!"},

  "BANKADDRESS":{ title: 'Invalid Bank Address!', subTitle: 'Please enter valid  bank address!', empty: "Please enter your  bank address!"},

  "USERNAME":{ title: 'Invalid Account Holder Name!', subTitle: 'Please enter valid account holder name!', empty: "Please enter account holder name!"},

  "CODE":{ title: 'Invalid IFSC Code!', subTitle: 'Please enter valid IFSC code!', empty: "Please enter your IFSC code!"},
  // "CITY":{ title: 'Invalid City!', subTitle: 'Please enter valid city!', empty: "Please enter your city!"},
  // "COUNTRY":{ title: 'Invalid Country!', subTitle: 'Please enter valid country!', empty: "Please enter your country!"},
  "ZIPCODE":{ title: 'Invalid Zip Code!', subTitle: 'Please enter valid zip code!', empty: "Please enter your zip code!"},
  "ROUNTING":{ title: 'Invalid Routing Number!', subTitle: 'Please enter valid routing number!', empty: "Please enter your routing numbrer!"},

  "FNAME": {
    title: 'Invalid Name!', subTitle: 'Please enter valid first name!', empty: "Please enter your first name!"
  },
  "LNAME": {
    title: 'Invalid Name!', subTitle: 'Please enter valid last name!', empty: "Please enter your last name!"
  },
  "ADDRS": {
    title: 'Invalid Address!', subTitle: '', empty: "Please enter address!"
  },
  "EMAIL": {
    title: 'Invalid Email!', subTitle: 'Your Email is invalid please enter valid email', empty: "Please enter your email!"
  },
  "PASSW": {
    title: 'Invalid Password!', subTitle: 'Password must be at least 6 characters include characters and numbers!', empty: "Please enter password!"
  },
  "CONFP": {
    title: 'Invalid Password!', subTitle: 'Passwords should me matched!', empty: "Please confirm new password!"
  },
  "COUNTRY": {
    title: 'Invalid Country!', subTitle: '', empty: "Please enter country!"
  },
  "DOB": {
    title: 'Invalid DOB!', subTitle: '', empty: "Please select your DOB!"
  },
  "CNAME": {
    title: 'Invalid Company Name!', subTitle: '', empty: "Please enter your company name!"
  },
  "CADD": {
    title: 'Invalid Company Address!', subTitle: '', empty: "Please enter your company address!"
  },
  "CWEB": {
    title: 'Invalid Company Website!', subTitle: '', empty: "Please enter your company website!"
  },
  "CDESC": {
    title: 'Invalid Company Description!', subTitle: '', empty: "Please enter about your company!"
  },
  "CIMAGE": {
    title: 'Invalid Company Logo!', subTitle: '', empty: "Please browser your company logo!"
  },
  "PIMAGE": {
    title: 'Invalid Profile Image!', subTitle: '', empty: "Please add your profile image!"
  },
  "CATE": {
    title: 'Invalid Category!', subTitle: '', empty: "Please select category!"
  },
  "CPASS": {
    title: 'Invalid Current Password!', subTitle: 'Password is invalid!', empty: "Please enter current password!"
  },
  "GENDER": {
    title: 'Invalide Gender!', subTitle: '', empty: "Enter   your gender!",
  },
  "TITLE": {
    title: 'Invalid Title!', subTitle: 'The title must have atleast 5 characters & maximum 50 characters!', empty: "Please enter title!"
  },
  "PRICE": {
    title: 'Invalid Price!', subTitle: '', empty: "Please enter price in USD!"
  },
  "DESC": {
    title: 'Invalid Description!', subTitle: 'The description must have atleast 20 characters & maximum 500 characters!', empty: "Please write description for the job post!"
  },
  "IMAGE": {
    title: 'Invalid Image!', subTitle: 'Please add image!', empty: "Please add  image!",
  },
  "SERVICET": {
    title: 'Invalid Service Type!', subTitle: '', empty: "Please select a service type!",
  },
  "MSG": {
    title: 'Invalid Message!', subTitle: '', empty: "Please enter message!"
  },






  "CASSW": {
    title: 'Invalid Current Password!', subTitle: '', empty: "Please enter current password!"
  },
  "AGE": {
    title: 'Invalid Age!', subTitle: '', empty: "Please enter age!"
  },
  "NOK": {
    title: 'Invalid Number of Kids!', subTitle: '', empty: "Please enter number of kids!"
  },
  "NOD": {
    title: 'Invalid Number of Days!', subTitle: '', empty: "Please enter number of days!"
  },
  "PHONE": {
    title: 'Invalid Mobile Number!', subTitle: 'Please enter valid phone number!', empty: "Please enter your Mobile Number!"
  },
  "POSITION": {
    title: 'Invalid Position!', subTitle: '', empty: "Please enter your position!"
  },
  "EDATE": {
    title: 'Invalid Established date!', subTitle: '', empty: "Please enter established date!"
  },

  "CINDUSTRY": {
    title: 'Invalid Company Industry!', subTitle: '', empty: "Please enter your company industry!"
  },

  "WEBSITE": {
    title: 'Invalid Website!', subTitle: '', empty: "Please enter website!"
  },

  "COMP": {
    title: 'Invalid!', subTitle: '', empty: "Please select company!"
  },

  "POSN": {
    title: 'Invalid!', subTitle: '', empty: "Please enter position!"
  },

  "EXPR": {
    title: 'Invalid!', subTitle: '', empty: "Please enter experience!"
  },

  "PASS": {
    title: 'Invalid!', subTitle: '', empty: "Please enter password!"
  },
  "EHD": {
    title: 'Invalid!', subTitle: '', empty: "Please Enter Employeement Hire Date!"
  },
  "WADD": {
    title: 'Invalid Address!', subTitle: '', empty: "Please Select Work Address!"
  },
  "HADD": {
    title: 'Invalid Address!', subTitle: "", empty: "Please Select Home Address!"
  },
  "SUBJECT": {
    title: 'Invalid Address!', subTitle: "", empty: "Please Enter Subject!"
  },
  "MESSAGE": {
    title: 'Invalid Address!', subTitle: "", empty: "Please Enter Message!"
  },

  "DPRT": {
    title: 'Invalid!', subTitle: '', empty: "Please enter your department!"
  },
  "CRPASS": {
    title: 'Invalid!', subTitle: '', empty: "Please enter current password!"
  },

  // "NPASS": {
  //   title: 'Invalid!', subTitle: '', empty: "Please enter new password!"
  // },

  "CNPASS": {
    title: 'Invalid!', subTitle: 'Password should be matched!', empty: "Password should be matched!"
  },
  "WHAT": {
    title: 'Invalid Text!', subTitle: 'Your phone number is invalid. Please enter valid phone number,should be with country code!', empty: "Please enter What's in your mind!"
  },
  "NPASS": {
    title: 'Invalid Password!', subTitle: 'Password is invalid', empty: "Please enter new password!"
  },
  // "CONFP": {
  //   title: 'Invalid Password!', subTitle: 'Password should be matched', empty: "Please retype password!"
  // },

  "VID": {
    title: 'Upload Image/Video!', subTitle: 'Please Upload Image/Video', empty: "Please Upload Image/Video!",
  },

  "FIMAGE": {
    title: 'Select Image!', subTitle: 'Please Select Image to post', empty: "Please select image to post!",
  },
  "FILLP": {
    title: 'Invalid Input!', subTitle: 'Please fill all field properly', empty: "Please enter your Address!"
  },
  "MSGI": {
    title: 'Invalid Message!', subTitle: 'Please fill all field properly', empty: "Please write message!"
  },
  "ELE": {
    title: 'Invalid Element!', subTitle: 'Please fill all field properly', empty: "Please enter element name!"
  },
  "CITY": {
    title: 'Invalid City!', subTitle: 'Please fill all field properly', empty: "Please enter city name!"
  },
  "SDATE": {
    title: 'Invalid Date!', subTitle: 'Please fill all field properly', empty: "Please enter start date!"
  },

  "CMMT": {
    title: 'Invalid Comment!', subTitle: 'Please fill all field properly', empty: "Please enter Comment!"
  },

  "TXT": {
    title: 'Invalid Comment!', subTitle: 'Please fill  field properly', empty: "Please enter content!"
  },


  "TECHP": {
    title: 'Technical Problem!', subTitle: 'Technical Problem, Please check your network connection!', empty: "",
    titleA: "مشكلة فنية!", subTitleA: "مشكلة فنية ، يرجى التحقق من اتصال الشبكة الخاص بك!", emptyA: ""
  },
  "SDAT": {
    title: 'Select Start Date!', subTitle: 'Date is invalid', empty: "Please selct start date!",
    titleA: "اختر تاريخ البدء", subTitleA: "Date is invalid", emptyA: "يرجى تحديد تاريخ البدء!"
  },
  "EDAT": {
    title: 'Select End Date!', subTitle: 'Date is invalid', empty: "Please select end date!",
    titleA: "حدد تاريخ الانتهاء!", subTitleA: "Date is invalid", emptyA: "يرجى تحديد تاريخ الانتهاء!"
  },
  "KWRD": {
    title: 'Invalid Keyword!', subTitle: 'Keyword is invalid', empty: "Please enter keyword!",
    titleA: "كلمة رئيسية غير صالحة!", subTitleA: "الكلمة الرئيسية غير صالحة", emptyA: "من فضلك ادخل الكلمة"
  },
  "DST": {
    title: 'Invalid Destination!', subTitle: 'Password is invalid', empty: "Please enter destination!",
    titleA: "!وجهة غير صالحة", subTitleA: "كلمة المرور غير صالحة", emptyA: "!الرجاء إدخال الوجهة"
  },
  "AGNCY": {
    title: 'Invalid Agency!', subTitle: 'Password is invalid', empty: "Please select agency!",
    titleA: "!وكالة غير صالحة", subTitleA: "Password is invalid", emptyA: "!يرجى اختيار الوكالة"
  },
}
const m = {
  fnameEmpty: { title: 'Mendetory field!', subTitle: 'Your Email is invalid please enter valid email' },
  lnameInvalid: { title: 'Password Reset Sent!', subTitle: 'A password reset email has been sent to: ' },
  lnameEmpty: { title: 'Password Reset Sent!', subTitle: 'A password reset email has been sent to: ' },

  profileUpdated: { title: 'Profile Updated!', subTitle: 'Your profile has been successfully updated!' },
  emailVerified: { title: 'Email Confirmed!', subTitle: 'Congratulations! Your email has been confirmed!' },
  emailVerificationSent: { title: 'Email Confirmation Sent!', subTitle: 'An email confirmation has been sent to: ' },
  accountDeleted: { title: 'Account Deleted!', subTitle: 'Your account has been successfully deleted.' },
  passwordChanged: { title: 'Password Changed!', subTitle: 'Your password has been successfully changed.' },
  invalidCredential: { title: 'Invalid Credential!', subTitle: 'An error occured logging in with this credential.' },
  operationNotAllowed: { title: 'Login Failed!', subTitle: 'Logging in with this provider is not allowed! Please contact support.' },
  userDisabled: { title: 'Account Disabled!', subTitle: 'Sorry! But this account has been suspended! Please contact support.' },
  userNotFound: { title: 'Account Not Found!', subTitle: 'Sorry, but an account with this credential could not be found.' },
  wrongPassword: { title: 'Incorrect Password!', subTitle: 'Sorry, but the password you have entered is incorrect.' },
  invalidEmail: { title: 'Invalid Email!', subTitle: 'Sorry, but you have entered an invalid email address.' },
  emailAlreadyInUse: { title: 'Email Not Available!', subTitle: 'Sorry, but this email is already in use.' },
  weakPassword: { title: 'Weak Password!', subTitle: 'Sorry, but you have entered a weak password.' },
  requiresRecentLogin: { title: 'Credential Expired!', subTitle: 'Sorry, but this credential has expired! Please login again.' },
  userMismatch: { title: 'User Mismatch!', subTitle: 'Sorry, but this credential is for another user!' },
  providerAlreadyLinked: { title: 'Already Linked!', subTitle: 'Sorry, but your account is already linked to this credential.' },
  credentialAlreadyInUse: { title: 'Credential Not Available!', subTitle: 'Sorry, but this credential is already used by another user.' },
  changeName: { title: 'Change Name Failed!', subTitle: 'Sorry, but we\'ve encountered an error changing your name.' },
  changeEmail: { title: 'Change Email Failed!', subTitle: 'Sorry, but we\'ve encountered an error changing your email address.' },
  changePhoto: { title: 'Change Photo Failed!', subTitle: 'Sorry, but we\'ve encountered an error changing your photo.' },
  passwordsDoNotMatch: { title: 'Change Password Failed!', subTitle: 'Sorry, but the passwords you entered do not match.' },
  updateProfile: { title: 'Update Profile Failed', subTitle: 'Sorry, but we\'ve encountered an error updating your profile.' },
  usernameExists: { title: 'Username Already Exists!', subTitle: 'Sorry, but this username is already taken by another user.' },
  imageUpload: { title: 'Image Upload Failed!', subTitle: 'Sorry but we\'ve encountered an error uploading selected image.' }
};

@Injectable()
export class AlertProvider {
  lang = JSON.parse(localStorage.getItem("yallaLanguage"));
  constructor(public alertCtrl: AlertController,
    public trans: TranslateService,
    public toastCtrl: ToastController
  ) { }

  showMessage(code: any) {
    let title = ""
    let subtitle = ""
    let okButton = ""
    if (this.lang == 1) {
      title = messages[code].titleA;
      subtitle = messages[code].subTitleA;
      okButton = "حسنا";
    }
    else {
      title = messages[code].title;
      subtitle = messages[code].subTitle;
      okButton = "Ok";
    }
    const alert = this.alertCtrl.create({
      subTitle: title,
      message: subtitle,
      buttons: [
        {
          text: okButton,
          handler: () => {
          }
        }]
    });
    alert.present();
  }


  showEmptyMessage(code: any) {
    let sub = ""
    let mes = ""
    let okButton = ""
    sub = messages[code].title;
    mes = messages[code].empty;
    okButton = "Ok";

    const alert = this.alertCtrl.create({
      subTitle: sub,
      message: mes,
      buttons: [
        {
          text: okButton,
          handler: () => {
          }
        }]
    });
    alert.present();
    console.log(sub, mes);
  }


  show(title: string, message: string) {
    const alert = this.alertCtrl.create({
      subTitle: title,
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }]
    });
    alert.present();
  }

  showAsync(title: string, message: string) {
    return new Promise((resolve) => {
      this.alertCtrl.create({
        subTitle: title,
        message: message,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              // resolve();
            }
          }]
      }).present();
    });
  }



  confirmationAlert(title: string, message: string) {
    return new Promise((resolve) => {
      this.alertCtrl.create({
        subTitle: title,
        message: message,
        buttons: [
          {
            text: this.trans.instant('YES'),
            handler: () => {
              resolve(true);
            }
          },
          {
            text: this.trans.instant('NO'),
            handler: () => {
              resolve(false);
            }
          },
        ]
      }).present();
    });
  }

  confirm(code) {
    const alert = this.alertCtrl.create({
      title: messages[code].title,
      subTitle: messages[code].subTitle,
      buttons: [
        {
          text: this.trans.instant('CONFIRM'),
          handler: () => {
          }
        },
        {
          text: this.trans.instant('CANCEL'),
          handler: () => {
          }
        }]
    })
  }


  presentToast(message: string, position: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: position
    });
    toast.present();
  }
}
