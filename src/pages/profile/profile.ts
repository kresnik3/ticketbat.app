import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Rest } from '../../providers/rest';
import { MyPurchasesPage } from '../mypurchases/mypurchases';
import { MyCheckerPage } from '../mychecker/mychecker';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  countries:any=[];

  email:any='';
  password:any='';

  first_name:string='';
  last_name:string='';
  phone:string='';
  address:string='';
  city:string='';
  region:string='';
  country:string='US';
  zip:string='';

  form:any=0;
  user:any=null;

  constructor(public naco: NavController,
              public rest: Rest,
              public aler: AlertController,
              public load: LoadingController,
              public toas: ToastController,
              public napa: NavParams) {
      this.countries = rest.getCountries();
      this.user = this.rest.getUser();
      this.form = (this.user)? 1 : 0;
      this.email = 'ivan@ticketbat.com';
      this.password = 'ikbxcdragon@A1';
  }

  login(){
    //loading msg
    let loader = this.load.create({
        content: 'Login credentials.<br>Please wait...'
    });
    loader.present();
    //load elements from rest
    this.rest.login(this.email,this.password).subscribe(
      data => {
        if(data.success)
        {
          this.form = 1;
          this.user = data.user;
        }
        else
        {
          this.form = 0;
          this.user = null;
          this.aler.create({
            title: 'An Error Ocurred!',
            subTitle: data.msg,
            buttons: ['OK']
          }).present();
        }
        loader.dismiss();
      },
      err => {
        this.form = 0;
        this.user = null;
        loader.dismiss();
        this.aler.create({
          title: 'Connection Error!',
          message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
          buttons: [ {
              text: 'RETRY',
              handler: () => { this.login(); }
            } ]
        }).present();
      }
    );
  }

  logout(){
    this.user = null;
    this.rest.logout();
    this.form = 0;
  }

  register(){
    //loading msg
    let loader = this.load.create({
        content: 'Creating user.<br>Please wait...'
    });
    loader.present();
    //load elements from rest
    this.rest.register(this.email,this.first_name,this.last_name,this.phone,this.address,this.city,this.region,this.country,this.zip,this.password).subscribe(
      data => {
        if(data.success)
        {
          this.aler.create({
            title: 'User created successfully!',
            subTitle: data.msg,
            buttons: [{
                text: 'Ok',
                handler: (data: any) => {
                  this.first_name=this.last_name=this.phone=this.address=this.city=this.region=this.country=this.zip=this.password='';
                  this.form = 0;
                }
              }]
          }).present();
        }
        else
        {
          this.aler.create({
            title: 'An Error Ocurred!',
            subTitle: data.msg,
            buttons: ['OK']
          }).present();
        }
        loader.dismiss();
      },
      err => {
        loader.dismiss();
        this.aler.create({
          title: 'Connection Error!',
          message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
          buttons: [ {
              text: 'RETRY',
              handler: () => { this.register(); }
            } ]
        }).present();
      }
    );
  }

  recover(){
    this.aler.create({
      title: 'Recover password',
      message: 'Enter your email and the system will send your new password.',
      inputs: [{
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }],
      buttons: [{
          text: 'Cancel',
          handler: (data: any) => {}
        },{
          text: 'Ok',
          handler: (data: any) => {
            //checking code entered
            if(data.email.trim()=='')
              this.aler.create({
                title: 'Error',
                subTitle: 'You must enter a valid email!',
                buttons: ['Dismiss']
              }).present();
            else{
              //apply code
              this.rest.recover(data.email).subscribe(
                data => {
                  if(data.success)
                  {
                    this.toas.create({
                      message: 'Email sent successfully!',
                      position: 'middle',
                      duration: 1500
                    }).present();
                  }
                  else
                    this.aler.create({
                      title: 'An Error Ocurred!',
                      subTitle: data.msg,
                      buttons: ['OK']
                    }).present();
                },
                err => {
                  this.aler.create({
                    title: 'Connection Error!',
                    message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
                    buttons: [ {
                        text: 'RETRY',
                        handler: () => { this.recover(); }
                      } ]
                  }).present();
                }
              );
            }//
          }
        }]
    }).present();
  }

  change(){
    this.aler.create({
      title: 'Change password',
      message: 'Enter your old password, and then the new one. Press OK to submit the change.',
      inputs: [{
          name: 'oldPassword',
          type: 'password',
          placeholder: 'Old Password'
        },{
          name: 'newPassword',
          type: 'password',
          placeholder: 'New Password'
        }],
      buttons: [{
          text: 'Cancel',
          handler: (data: any) => {}
        },{
          text: 'Ok',
          handler: (data: any) => {
            //checking the code entered
            if(data.oldPassword.trim()=='' || data.newPassword.trim()=='')
              this.aler.create({
                title: 'Error',
                subTitle: 'You must enter valid passwords!',
                buttons: ['Dismiss']
              }).present();
            else{
              //apply code
              this.rest.change(data.oldPassword,data.newPassword).subscribe(
                data => {
                  if(data.success)
                  {
                    this.toas.create({
                      message: 'Password changed successfully!',
                      position: 'middle',
                      duration: 1500
                    }).present();
                  }
                  else
                    this.aler.create({
                      title: 'An Error Ocurred!',
                      subTitle: data.msg,
                      buttons: ['OK']
                    }).present();
                },
                err => {
                  this.aler.create({
                    title: 'Connection Error!',
                    message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
                    buttons: [ {
                        text: 'RETRY',
                        handler: () => { this.change(); }
                      } ]
                  }).present();
                }
              );
            }//
          }
        }]
    }).present();
  }

  goToMyPurchases(){
      this.naco.push(MyPurchasesPage);
  }

  goToMyChecker(){
      this.naco.push(MyCheckerPage);
  }


}
