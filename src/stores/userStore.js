import {defineStore} from 'pinia'
import CryptoJS from "crypto-js";


const key = import.meta.env.VITE_LOCAL_STORAGE_ENCRYPT_KEY;

export const userStore = defineStore('userDataStore', {
    state: () => {
        return {
            userLoginToken: '',
            userData: [],
            userMicroserviceToken: '',
        }
    },
    persist: true,
    getters: {
        getUserLoginToken(state) {
            const decryptData = CryptoJS.AES.decrypt(
                state.userLoginToken,
                key
            ).toString(CryptoJS.enc.Utf8);
            return decryptData;
        },
        getUserData(state) {
            const decryptData = CryptoJS.AES.decrypt(
                state.userData,
                key
            ).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptData)
        },
        get(state) {
            const decryptData = CryptoJS.AES.decrypt(
                state.userData,
                key
            ).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptData)
        },
        getUserMicroserviceTokenEncrypted(state) {
            return state.userMicroserviceToken;
        },
      },
      actions: {
        setUserLoginToken(userLoginToken) {
            const data = CryptoJS.AES.encrypt(userLoginToken, key).toString();
            this.userLoginToken = data; // Encryption Part
        },
        setUserData(userData) {
            if ( typeof userData === 'object' ) {
                userData = JSON.stringify(userData);
            }
            const data = CryptoJS.AES.encrypt(userData, key).toString();
            this.userData = data
        },
          setUserMicroserviceToken() {

              let keyHex = import.meta.env.VITE_LOCAL_STORAGE_ENCRYPT_KEY;
              let ivHex = import.meta.env.VITE_LOCAL_STORAGE_ENCRYPT_IV;

              let key = CryptoJS.enc.Hex.parse(keyHex);
              let iv = CryptoJS.enc.Hex.parse(ivHex);

              let encrypted = CryptoJS.AES.encrypt(import.meta.env.VITE_LOCAL_STORAGE_MICROSERVICE_AUTH_TOKEN, key, {
                  iv: iv,
                  mode: CryptoJS.mode.CBC,
                  padding: CryptoJS.pad.Pkcs7
              });

              this.userMicroserviceToken = encrypted.toString();
          },
      },
    }
  )
