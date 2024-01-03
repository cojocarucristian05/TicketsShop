import { Component } from '@angular/core';
import { Event } from '../../model/event';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  eventsList: Event[] = [];
  eventObj : Event = {
    id: '',
    title: '',
    number_of_seats: '',
    price: '',
    date: ''
  };

  id: string = '';
  title: string = '';
  number_of_seats: string = '';
  price: string = '';
  date: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getAllEvents();
  }
  
  getAllEvents() {
    this.dataService.getAllEvents().subscribe(res => {
      this.eventsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
    }, err => {
      alert('Error while fetching events!');
    })
  }

  addEvent() {
    if (this.title == '' || this.number_of_seats == '' || this.price == '' || this.date == '') {
      alert('Fill all values!');
      return;
    }
    this.eventObj.id = '';
    this.eventObj.title = this.title;
    this.eventObj.number_of_seats = this.number_of_seats;
    this.eventObj.price = this.price;
    this.eventObj.date = this.date;

    this.dataService.addEvent(this.eventObj);
    this.resetForm();
  }

  updateEvent() {

  }

  deleteEvent(event: Event) {
    this.dataService.deleteEvent(event);
  }

  resetForm() {
    this.id = '';
    this.title = '';
    this.number_of_seats = '';
    this.price = '';
    this.date = '';
  }
}
