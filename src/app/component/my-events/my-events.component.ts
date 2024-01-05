import { Component, OnInit } from '@angular/core';
import { Event } from '../../model/event';
import { DataService } from 'src/app/shared/data.service';
import { AuthorizationService } from 'src/app/shared/authorization.service';
import { User } from 'src/app/model/user';
import { confirmPasswordReset } from '@angular/fire/auth';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
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

  constructor(private dataService: DataService, private authService: AuthorizationService) {}

  ngOnInit() {
    this.getAllEvents();
  }
  
  getAllEvents() {
    this.authService.getAllEvents().subscribe(data => {
      const userData: any = data.payload.data() || {};
      const myEventsField = userData.myEvents;
      if (myEventsField) {
        this.eventsList = myEventsField;
      }
    });
  }

  addEvent() {
    if (this.title == '' || this.number_of_seats == '' || this.price == '' || this.date == '') {
      alert('Fill all values!');
      return;
    }
    this.eventObj.id = this.authService.createId();
    this.eventObj.title = this.title;
    this.eventObj.number_of_seats = this.number_of_seats;
    this.eventObj.price = this.price;
    this.eventObj.date = this.date;
    const emailWithQuotes = JSON.stringify(localStorage.getItem('token'));
    const email = emailWithQuotes.substring(1, emailWithQuotes.length - 1);
    const user = this.authService.getUser(email)
                                  .subscribe(user => {
                                    if (user) {
                                      this.authService.addEvent(this.eventObj, user);
                                    }
                                  });
    this.eventsList.push(this.eventObj);
    this.dataService.addEvent(this.eventObj);
    this.resetForm();
  }

  updateEvent() {

  }

  deleteEvent(event: Event) {
    const emailWithQuotes = JSON.stringify(localStorage.getItem('token'));
    const email = emailWithQuotes.substring(1, emailWithQuotes.length - 1);
    const user = this.authService.getUser(email)
    .subscribe(user => {
                                    if (user) {
                                      this.eventsList = this.eventsList.filter(item => item !== event);
                                      user.myEvents = this.eventsList;
                                      this.authService.updateUser(user);
                                      this.dataService.deleteEvent(event);
                                    }
                                  });
  }

  resetForm() {
    this.id = '';
    this.title = '';
    this.number_of_seats = '';
    this.price = '';
    this.date = '';
  }
}
