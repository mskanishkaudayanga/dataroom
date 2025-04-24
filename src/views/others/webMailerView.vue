


<script>
// import axios from 'axios';
// import Navigation from "@/components/Navigation.vue";
// import forge from "node-forge";
//
// export default {
//   name: 'WebmailerView',
//   components: {
//     Navigation
//   },
//   data() {
//     return {
//       loading: true,
//       csrfToken: '',
//       iframeSrc: '',
//       reloadTries : 0,
//       isLoggedIn : JSON.parse(localStorage.getItem('isLoggedIn')) || false,
//     };
//   },
//   methods: {
//
//
//     async  getPublicKey() {
//       try {
//         const url = this.webMailerUrl + '?_action=get_public_key';
//
//         const response = await axios.get(url, {
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         });
//         return response.data;
//       } catch (error) {
//         console.error('Error fetching public key:', error);
//         throw error;
//       }
//     },
//     async  encryptData(email, password) {
//       const publicKeyPem = await this.getPublicKey();
//       const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
//       console.log(publicKey);
//
//       const encryptedEmail = forge.util.encode64(publicKey.encrypt(forge.util.encodeUtf8(email), 'RSAES-PKCS1-V1_5'));
//
//       const encryptedPassword = forge.util.encode64(publicKey.encrypt(forge.util.encodeUtf8(password), 'RSAES-PKCS1-V1_5'));
//       console.log(encryptedEmail,encryptedPassword)
//
//       return { encryptedEmail, encryptedPassword };
//     },
//     async loginAndSetIframe() {
//       try {
//         if(!this.isLoggedIn){
//         await this.fetchCsrfToken();
//         if (!this.$csrfTokenEmail) {
//           throw new Error('CSRF token is missing. Cannot proceed with login.');
//         }
//           const url = this.webMailerUrl + '?_task=login&dynamic=1';
//
//         const payload = new URLSearchParams();
//
//         const { encryptedEmail, encryptedPassword } = await this.encryptData('Request@bestplace-immobilien.de', 'Frage039Warum!');
//         console.log('sending credentials',encryptedEmail, encryptedPassword);
//         const email = encryptedEmail;
//         const password = encryptedPassword;
//         payload.append('_user', email);
//         payload.append('_pass', password);
//         payload.append('_task', 'login');
//         payload.append('_action', 'login');
//         payload.append('_token', this.$csrfTokenEmail);
//
//         const response = await axios.post(url, payload, {
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         });
//
//         if (response.status === 200) {
//           document.cookie.split(";").forEach((cookie) => {
//             const name = cookie.split("=")[0].trim();
//             document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//           });
//           if (this.reloadTries == 1) {
//             window.location.reload();
//             this.reloadTries++;
//           }
//         } else {
//           console.error('Error logging in:', response.statusText);
//         }
//           localStorage.setItem('isLoggedIn', true);
//           this.isLoggedIn = true;
//           setTimeout(() => {
//             localStorage.setItem('isLoggedIn', false);
//             this.isLoggedIn = false;
//             console.log('Login status expired. User needs to check session again.');
//           }, 10 * 60 * 1000);
//         }
//       } catch (error) {
//         console.error('Error fetching webmail content:', error);
//       } finally {
//         this.loading = false;
//         this.iframeSrc = this.webMailerUrl + '?_task=mail';
//       }
//     },
//   },
//   mounted() {
//       this.loginAndSetIframe();
//       if ( !this.agentsForWebmailer.includes(this.getUserMail()) ) {
//         this.redirectToHomeView();
//       }
//   },
// };
</script>

<template>
<!--  <Navigation />-->
<!--  <div class="webmailer-container-wrapper">-->

<!--    <div class="webmailer-container">-->
<!--      <div v-if="loading" class="loading">Loading...</div>-->
<!--      <iframe-->
<!--          v-else-->
<!--          :src="iframeSrc"-->
<!--          class="webmailer-iframe"-->
<!--          frameborder="0"-->
<!--      ></iframe>-->
<!--    </div>-->
<!--  </div>-->
</template>


<style scoped>

.webmailer-container-wrapper {
  width: 100%;
}

.webmailer-container {
  color: #fff;
  height: 100vh;
  width: 94vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
}

.webmailer-container iframe {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .webmailer-container {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .webmailer-container {
    max-width: 100%;
    padding: 10px;
  }
}

h1 {
  color: #4E7DEE;
}

.loading {
  font-size: 18px;
  color: #4E7DEE;
}

.webmailer-iframe {
  border: none;
  border-radius: 8px;
}
</style>
