import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Rest } from '../../providers/rest';
import { ShowsPage} from '../shows/shows';

@Component({
  selector: 'page-venues',
  templateUrl: 'venues.html'
})
export class VenuesPage {

  venues: any;
  cities: any;

  location: string;
  search: string;

  constructor(public naco: NavController,
              public rest: Rest,
              public load: LoadingController,
              public navCtrl: NavController) {
        //loading msg
        let loader = this.load.create({
            content: 'Loading venues.<br>Please wait...'
        });
        loader.present();
        //init values
        this.location = this.rest.getLocation();
        this.search = '';
        this.cities = this.rest.getCities();
        this.venues = this.rest.getVenues();
        this.searchItems();
        loader.dismiss();
  }
  //update location to use global
  ionViewWillEnter(){
    this.location = this.rest.getLocation();
    this.searchItems();
  }
  //navigator
  goToShowsVenue(venue_id){
        this.naco.setRoot(ShowsPage,{venue_id:venue_id});
  }
  //update location
  updateLocation(){
          this.rest.setLocation(this.location);
          this.searchItems();
  }
  //filter for search venues
  searchItems() {
        let venuex = this.rest.getVenues();
        //filter locations first
        if(this.location != 'All'){
          venuex = venuex.filter((item) => {
            return (item.city.trim().toLowerCase().indexOf(this.location.trim().toLowerCase()) > -1);
          });
        }
        //filter search second
        if(this.search.trim() != ''){
          venuex = venuex.filter((item) => {
            return (item.name.toLowerCase().indexOf(this.search.trim().toLowerCase()) > -1);
          });
        }
        //update shows
        this.venues = venuex;
    }

}
