import React from "react";
import firebase from 'react-native-firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDTyrDGYAZSqZk71i1hjb5dAu-oSFZ9iMU",
    authDomain: "<your-auth-domain>",
    databaseURL: "https://barkodtarayici.firebaseio.com/\n",
    storageBucket: "barkodtarayici.appspot.com",
}

class DBServices {

    firebaseApp;
    itemsRef;

    initialize(){
        this.firebaseApp = firebase.initializeApp(firebaseConfig);
        this.itemsRef = this.firebaseApp.database().ref();
    }

    setDBRef(objRef) {
        this.itemsRef = this.firebaseApp.database().ref(objRef);
    }

    setChild(objRef) {
        this.itemsRef = this.itemsRef.child(objRef);
    }

    getOnce(eventType) {
        return this.itemsRef.once(eventType);
    }

    update(obj) {
        this.itemsRef.update(obj);
    }

    set(obj) {
        this.itemsRef.update(obj);
    }

}

export let dbServices = new DBServices();