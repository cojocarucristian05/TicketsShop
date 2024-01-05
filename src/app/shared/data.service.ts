import { Injectable } from '@angular/core';
import { Event } from '../model/event';
import { AngularFirestore } from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private angularFirestore: AngularFirestore) { }

  addEvent(event: Event) {
    return this.angularFirestore.collection('/Events').add(event);
  }

  getAllEvents() {
    return this.angularFirestore.collection('/Events').snapshotChanges();
  }

  deleteEvent(event: Event) {
    return this.angularFirestore.doc('/Events/'+ event.id).delete();
  }

  updateEvent(event: Event) {
    this.deleteEvent(event);
    this.addEvent(event);
  }
}
