import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, ViewController } from 'ionic-angular';
import { Rest } from '../../providers/rest';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {

  countries:any=[];
  months:any=[];
  years:any=[];

  cardholder:string;
  address:string;
  city:string;
  country:string='US';
  region:any;
  zip:any;
  phone:any;
  email:string;
  card:any;
  month:any='01';
  year:number;
  cvv:any;
  total:any;
  qty:number;

  constructor(public naco: NavController,
              public rest: Rest,
              public aler: AlertController,
              public load: LoadingController,
              public toas: ToastController,
              public view: ViewController,
              public napa: NavParams) {
        let current = new Date();
        this.year = Number(current.getFullYear());
        this.months = Array(12).fill(1).map((x,i)=>('00'+(i+1)).slice(-2));
        this.years = Array(20).fill(1).map((x,i)=>i+this.year);
        this.countries = rest.getCountries();
        this.total = napa.get('total');
        this.qty = napa.get('qty');
        let user = napa.get('user');
        if(user)
        {
          this.cardholder = user.first_name+' '+user.last_name;
          this.address = user.address;
          this.zip = user.zip;
          this.city = user.city;
          this.region = user.state;
          this.country = user.country;
          this.phone = user.phone;
          this.email = user.email;
        }
        else
          this.cardholder = this.address = this.zip = this.city = this.region = this.phone = this.email = '';
        //testing
        // this.card = '4000101611112226';
        // this.month = '09';
        // this.year = 2019;
        // this.cvv = 435;
  }

  dismiss() {
     this.view.dismiss();
  }

  process() {
    //loading msg
    let loader = this.load.create({
        content: 'Processing purchase.<br>Please wait...'
    });
    loader.present();
    //load elements from rest
    this.rest.purchaseMake(this.cardholder,this.address,this.city,this.country,this.region,this.zip,this.phone,this.email,this.card,this.month,this.year,this.cvv)
      .subscribe(
        data => {
          if(data.success)
          {
            this.aler.create({
              title: 'Purchase successfully!',
              subTitle: data.msg,
              buttons: ['OK']
            }).present();
            this.dismiss();
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
                handler: () => { this.process(); }
              } ]
          }).present();
        }
      );
  }

}
