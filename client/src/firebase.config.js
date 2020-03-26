import * as firebase from 'firebase/app';
import 'firebase/storage'

const firebaseConfig = {
     apiKey: "AIzaSyBobGQ6icN8riB3DbonWOdCPtc7SVQ5HyE",
     authDomain: "inventory-management-e2767.firebaseapp.com",
     databaseURL: "https://inventory-management-e2767.firebaseio.com",
     projectId: "inventory-management-e2767",
     storageBucket: "inventory-management-e2767.appspot.com",
     messagingSenderId: "452981708434",
     appId: "1:452981708434:web:9c0cfaf9fbfd491e0db84b",
     measurementId: "G-S7716HSF9F"
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()
export const storageRef = storage.ref()