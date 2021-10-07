import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { MyScannerPage } from '../myscanner/myscanner';
import { MyListPage } from '../mylist/mylist';
import { Rest } from '../../providers/rest';

@Component({
  selector: 'page-mychecker',
  templateUrl: 'mychecker.html'
})
export class MyCheckerPage {

  venue:any;
  show:any;
  showtime:any;

  venues:any;
  shows:any;
  showtimes:any;

  constructor(public naco: NavController,
              public rest: Rest,
              public load: LoadingController,
              public aler: AlertController,
              public napa: NavParams) {
    //init
    if(!this.rest.logged())
        this.naco.pop();
    this.venue = this.show = this.showtime = '';
    this.venues = this.shows = this.showtimes = [];
    this.loadVenues();
  }

  loadVenues(){
    //loading msg
    let loader = this.load.create({
        content: 'Loading venues.<br>Please wait...'
    });
    loader.present();
    //load elements from rest
    this.rest.getVenuesCheck().subscribe(
      data => {
        if(data.success)
          this.venues = this.rest.getVenues().filter((item) => {
            return (data.venues.indexOf(item.id) != -1);
          });
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
              handler: () => { this.loadVenues(); }
            } ]
        }).present();
      }
    );
  }

  selectVenue(){
    //loading msg
    let loader = this.load.create({
        content: 'Loading shows.<br>Please wait...'
    });
    this.shows = this.rest.getShows().filter((item) => {
      return (item.venue_id == this.venue);
    });
    this.showtime = this.show = '';
    this.showtimes = [];
    loader.dismiss();
  }

  selectShow(){
    //loading msg
    let loader = this.load.create({
        content: 'Loading events.<br>Please wait...'
    });
    loader.present();
    //load elements from rest
    this.rest.getEventsCheck(this.show).subscribe(
      data => {
        if(data.success)
        {
          this.showtime = '';
          this.showtimes = data.events;
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
              handler: () => { this.selectShow(); }
            } ]
        }).present();
      }
    );
  }

  goToMyScanner(){
      this.naco.push(MyScannerPage,{showtime:this.showtime});
  }

  goToMyList(){
      this.naco.push(MyListPage,{showtime:this.showtime});
  }

}
