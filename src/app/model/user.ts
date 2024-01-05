import { Event } from "./event";
import { Roles } from "./roles";

export class User {
    id: string;
    email: string;
    password: string;
    username: string;
    roles: Roles;
    cart_list: Event[];
    wishlist: Event[];
    myEvents: Event[];

    constructor(email: string, password: string, id : string) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = "";
        this.roles = { reader: true, author: false, admin: false }
        this.cart_list = [];
        this.wishlist = [];
        this.myEvents = [];
    }

    toPlainObject(): any {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            roles: this.roles,
            cart_list: this.cart_list,
            wishlist: this.wishlist,
            myEvents: this.myEvents
        };
    }
}
