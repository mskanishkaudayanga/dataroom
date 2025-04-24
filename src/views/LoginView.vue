<script>
  import axios from "axios";
  import InputField from '../components/forms/InputField.vue'
  import AlertMessage from "../components/card/AlertMessage.vue";
  import {userRolesStore} from "@/stores/userRoleStore";

  export default {
    name: 'LoginView',
    components: {InputField, AlertMessage},
    data(){
      return {
        apiResponse: '',
        alertText: '',
        alertStatus: '',
      }
    },
    methods: {
      submitForm(event) {
        event.preventDefault()

        axios.post(this.globalApiBaseUrl + '/login', {
          mail: event.target.elements.mail.value,
          password: event.target.elements.password.value
        })
        .then(
            response => {
              this.submitFormHandler(response.data)
            })
        .catch(error => this.submitFormHandler(error));
      },
      submitFormHandler(response){
        this.apiResponse = response

        if ( this.apiResponse.status === 200 ){
          const store = userRolesStore();
          store.setUserRoles(response.response.roles)
          store.setUserCompany(response.response.company)
          store.setUserId(parseInt(response.response.id))
          store.setUserOoUsername(response.response.ooUsername)
          store.setUserMail(response.response.mail)
          this.alertStatus = 'success';
          this.alertText = 'Einloggen erfolgreich';
          this.redirectToHomeView();
        } else {
          this.alertStatus = 'warning';
          this.alertText = 'Einloggen fehlgeschlagen';
        }
      },
    },
  }
</script>

<template>
  <div class="login-form-wrapper">
    <div class="view-title"><h1>Bestplace Cockpit</h1></div>
    <form @submit="submitForm">
      <div class="field-wrapper">
        <InputField input-type="text" input-name="mail" input-placeholder="E-Mail"/>
        <label class="ph">E-Mail</label>
      </div>
      <div class="field-wrapper">
        <InputField input-type="password" input-name="password" input-placeholder="Passwort"/>
        <label class="ph">Passwort</label>
      </div>
      <div class="field-wrapper">
        <InputField input-type="submit" input-value="Einloggen" class="button"/>
      </div>
    </form>
    <AlertMessage :alertStatus="alertStatus" :alertText="alertText"></AlertMessage>

  </div>
</template>

<style scoped>

.login-form-wrapper {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -60%);
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  color: var(--blue);
}

form .field-wrapper + .field-wrapper {
  margin-top: 15px;
}

.button {
  background-color: var(--blue);
  color: white;
  text-transform: uppercase;
  border-radius: var(--border-radius);
  padding: 10px 25px;
  font-weight: 700;
  text-align: center;
}

.alert-message {
  margin-top: 15px;
}

</style>
