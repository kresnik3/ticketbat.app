import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Rest } from '../../providers/rest';

@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage {

  name:any='';
  email:any='';
  phone:any='';
  show_name:any='';
  message:any='';

  constructor(public naco: NavController,
              public rest: Rest,
              private aler: AlertController,
              public load: LoadingController,
              public toas: ToastController,
              public napa: NavParams) {}

  ionViewWillEnter(){
    let user = this.rest.getUser();
    if(user)
    {
      this.name = user.first_name+' '+user.last_name;
      this.email = user.email;
      this.phone = user.phone;
    }
    else
      this.name = this.email = this.phone = '';
  }

  send() {
    //loading msg
    let loader = this.load.create({
        content: 'Sending email.<br>Please wait...'
    });
    loader.present();
    //load elements from rest
    this.rest.sendContactEmail(this.name,this.email,this.phone,this.show_name,this.message).subscribe(
      data => {
        if(data.success)
        {
          this.toas.create({
            message: 'Your message was sent successfully!',
            position: 'middle',
            duration: 1500
          }).present();
          this.name = this.email = this.phone = this.show_name = this.message = '';
        }
        else
          this.aler.create({
            title: 'An Error Ocurred!',
            subTitle: data.msg,
            buttons: ['OK']
          }).present();
        loader.dismiss();
      },
      err => {
        loader.dismiss();
        this.aler.create({
          title: 'Connection Error!',
          message: 'There was an error connecting with our servers.<br>Please, check your network status and click "RETRY".',
          buttons: [ {
              text: 'RETRY',
              handler: () => { this.send(); }
            } ]
        }).present();
      }
    );
  }

}
