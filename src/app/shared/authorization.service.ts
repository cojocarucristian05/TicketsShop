import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../model/user';
import { Roles } from '../model/roles';
import { Router } from '@angular/router';
import { GoogleAuthProvider, authInstance$ } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { Event } from '../model/event';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // If the user is logged in, get the user data from Firestore
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          // If the user is not logged in, return an observable of null
          return of(null);
        }
      })
    );
  }

  // Sign up with email and password
  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(res => {
      const user = new User(email, password, this.afs.createId());
      const userData = user.toPlainObject();
      this.afs.collection('/Users').add(userData);
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }

  // Sign in with email and password
  signIn(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password).then(res => {
      localStorage.setItem('token', email);
      this.router.navigate(['/home']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/login']);
    })
  }

  // Sign out
  signOut() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }

  // Update user roles in Firestore
  updateRoles(user:User, roles: Roles) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);
    return userRef.set({ roles }, { merge: true });
  }

  // Check if a user has a specific role
  hasAdminRole() { 
    const emailWithQuotes = JSON.stringify(localStorage.getItem('token'));
    const email = emailWithQuotes.substring(1, emailWithQuotes.length - 1);
    return new Observable<boolean>(observer => {
      this.getUserRoles(email).subscribe(roles => {
        const hasAuthor = roles?.admin === true;
        observer.next(hasAuthor);
        observer.complete();
      });
    });
  }

  hasAuthorRole() {
    const emailWithQuotes = JSON.stringify(localStorage.getItem('token'));
    const email = emailWithQuotes.substring(1, emailWithQuotes.length - 1);
    return new Observable<boolean>(observer => {
      this.getUserRoles(email).subscribe(roles => {
        const hasAuthor = roles?.author === true;
        observer.next(hasAuthor);
        observer.complete();
      });
    });
  }

  googleSignIn() {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider).then(res => {
      const emailWithQuotes = JSON.stringify(res.user?.email);
      const email = emailWithQuotes.substring(1, emailWithQuotes.length - 1);
      this.userExist(email).subscribe(exists => {
        if (!exists) {
          const user = new User(email, "", this.afs.createId());
          const userData = user.toPlainObject();
          this.afs.collection("/Users").add(userData)
          .then(function(docRef) {
              localStorage.setItem('docId', docRef.id);
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });  
        }
      });
      localStorage.setItem('token', email);
      this.router.navigate(['/home']);
    }, err => {
      alert(err.message);
    })
  }

  getUserRoles(email: string): Observable<Roles | null> {
    return this.afs.collection<User>('Users', ref => ref.where('email', '==', email))
      .valueChanges()
      .pipe(
        take(1),
        map((users: User[]) => {
          if (users && users.length > 0) {
            const user: User = users[0];
            return user.roles;
          } else {
            return null;
          }
        })
      );
  }

  getUser(email: string): Observable<User | null> {
    return this.afs.collection<User>('Users', ref => ref.where('email', '==', email))
      .valueChanges()
      .pipe(
        take(1),
        map((users: User[]) => {
          if (users && users.length > 0) {
            const user: User = users[0];
            return user;
          } else {
            return null;
          }
        })
      );
  }

  userExist(email: string): Observable<boolean> {
    const userData: Observable<User[]> = this.afs.collection<User>('Users', ref => ref.where('email', '==', email))
      .valueChanges()
      .pipe(
        take(1)
      );
    return userData.pipe(
      map(users => users && users.length > 0)
    );
  }

  addEvent(event: Event, user: User) {
    console.log(event.id);
    user.myEvents.push(event);
    console.log("result: ", this.updateUser(user));
  }

  addUser(user: User) {
    user.id = this.afs.createId();
    return this.afs.collection('/Users').add(user);
  }

  deleteUser(user: User) {
    return this.afs.doc('/Users/'+ user.id).delete();
  }

  updateUser(user: User) {
    const id = localStorage.getItem('docId');
    return this.afs.doc('/Users/'+ id).update(user);
  }

  getAllEvents() {
    const id = localStorage.getItem('docId');
    return this.afs.doc('/Users/'+ id).snapshotChanges();
  }

  createId(): string {
    return this.afs.createId();
  }

} 
