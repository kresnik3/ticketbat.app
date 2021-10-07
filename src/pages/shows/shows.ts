import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Rest } from '../../providers/rest';
import { ShowDetailsPage } from '../show-details/show-details';

@Component({
  selector: 'page-shows',
  templateUrl: 'shows.html'
})
export class ShowsPage {

  shows: any=[];
  cities: any=[];
  venues: any=[];

  venue: any='All';
  venue_name: string='All venues';
  location: string='All';
  search: string='';

  constructor(public naco: NavController,
              public napa: NavParams,
              public rest: Rest,
              private aler: AlertController,
              public load: LoadingController) {
        //loading msg
        let loader = this.load.create({
            content: 'Loading events.<br>Please wait...'
        });
        loader.present();
        //init values
        this.cities = this.rest.getCities();
        this.shows = this.rest.getShows();
        this.location = this.rest.getLocation();
        this.updateLocation();
        loader.dismiss();
  }
  //update location to use global
  ionViewWillEnter(){
    this.location = this.rest.getLocation();
    this.updateLocation();
    let venue_id = this.napa.get('venue_id');
    if(venue_id && venue_id > 0){
      this.venue = venue_id;
      this.updateVenues();
    }
  }
  //navigator
  goToShowDetails(id){
          this.naco.push(ShowDetailsPage,{id:id});
  }
  //update location
  updateLocation(){
          this.rest.setLocation(this.location);
          if(this.location == 'All'){
            this.venues = this.rest.getVenues();
          }
          else{
            this.venues = this.rest.getVenues().filter((item) => {
              return (item.city.trim().toLowerCase().indexOf(this.location.trim().toLowerCase()) > -1);
            });
          }
          this.venue = 'All';
          this.venue_name = 'All venues';
          this.searchItems();

  }
  //update venues
  updateVenues(){
          if(this.venue != 'All'){
            this.venues.filter((item) => {
              if(item.id == this.venue)
                this.venue_name = item.name;
            });
          }
          else{
            this.venue_name = 'All venues';
          }
          this.searchItems();
  }
  //search
  searchItems() {
          let showx = this.rest.getShows();
          //filter locations first
          if(this.location != 'All'){
            showx = showx.filter((item) => {
              return (item.city.trim().toLowerCase().indexOf(this.location.trim().toLowerCase()) > -1);
            });
          }
          //filter venues second
          if(this.venue != 'All'){
            showx = showx.filter((item) => {
              return (item.venue_id == this.venue);
            });
          }
          //filter search third
          if(this.search.trim() != ''){
            showx = showx.filter((item) => {
              return (item.name.toLowerCase().indexOf(this.search.trim().toLowerCase()) > -1);
            });
          }
          //update shows
          this.shows = showx;
     }
}
