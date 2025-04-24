<script>
  import axios from "axios";
  import CloseIcon from "@/components/icons/icon-close.vue";
  import AnimateCircleIcon from "@/components/icons/icon-animate-loading-circle.vue";
  import InputField from "@/components/forms/InputField.vue";
  import AsterixMarkIcon from "@/components/icons/icon-red-asterix-mark.vue";
  import Dropdown from "@/components/forms/Dropdown.vue";
  import DropdownArrow from "@/components/icons/icon-dropdown.vue";
  import TextAreaField from "@/components/forms/TextAreaField.vue";
  import Button from "@/components/buttons/button.vue";
  import AlertMessage from "@/components/card/AlertMessage.vue";

  export default {
    name: "canbanModalCreateLead",
    components: {
      AlertMessage,
      Button, TextAreaField, DropdownArrow, Dropdown, AsterixMarkIcon, InputField, AnimateCircleIcon, CloseIcon},
    data() {
      return {
        isOpenModal: true,
        isLoading: false,
        isLoadingOffers: false,
        isLoadingCustomer: false,
        isLoadingRealEstate: false,

        apiUsersRealEstateOffers: [],

        apiUsersResponse: [],

        leadForm: {

          generalLead: 'true',
          newCustomer: true,
          message: '',
          searchCustomer: '',
          foundRealEstates: [],
          foundCustomers: [],
          foundCustomersInCompany: 'living',
          language: 'Deutsch',
          selectedRealEstateSysId: '',
          selectedCustomerNr: '',
          selectedCustomerSysId: '',

          sendDirectToAgent: 'true',

          mail: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          salutation: {
            required: true,
            valid: true,
            value: 'Herr',
            label: {
              de: ''
            }
          },
          title: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          firstname: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          lastname: {
            required: true,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          phone: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          medium: {
            required: true,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          source: {
            required: true,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          agent: {
            required: true,
            valid: true,
            value: '',
            onofficeVal: '',
            label: {
              de: ''
            }
          },
          selectedRealEstate: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          selectedRealEstateCompany: {
            required: true,
            valid: true,
            value: 'living',
            label: {
              de: ''
            }
          },
        },

        dropdownsShow: {
          showRealEstateDropdown: false,
          showCustomerDropdown: false,
          showSalutationDropdown: false,
          showLanguageDropdown: false,
          showSourceDropdown: false,
          showContactAgentDropdown: false,
          showContactSourceDropdown: false
        },

        dropdownContents: {
          language: [
            'Deutsch',
            'Englisch',
            'Französisch',
            'Niederländisch',
            'Spanisch',
            'Polnisch',
            'Ukrainisch'
          ]
        },

        dropdownRelativePosition: false,

        searchedLivingFinal: false,
        cancelToken: null,
        cancelTokenRealEstates: null,

        approveCreateLeadWithoutMailOrPhoneModalProcess: false,
        showErrorMsg: false,

      }
    },
    methods: {
      closeDropdowns() {
        for (const index in this.dropdownsShow) {
          this.dropdownsShow[index] = false;
        }
      },
      closeModal() {
        this.$router.push({name: 'canbanTool'});
        this.resetData();
      },
      setDropdownTop($event) {
        const eleName = $event.target.name;
        const additionalSpace = 5;
        if (this.$refs['input' + eleName] !== undefined) {
          this.$refs['dropdown' + eleName].$el.style.top = this.$refs['input' + eleName].$el.clientHeight + additionalSpace + 'px';
        }
        if (!this.isInViewport(this.$refs['dropdown' + eleName].$el)) {
          this.dropdownRelativePosition = true;
          this.$refs['dropdown' + eleName].$el.style.top = '0px';
        } else {
          this.dropdownRelativePosition = false;
        }
      },
      makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
      },
      triggerCanbanReload() {
        this.$emit('reloadCanban', this.makeid(30));
      },
      searchRealEstate() {
        if (this.leadForm.selectedRealEstate.value && this.leadForm.selectedRealEstate.value.length >= 3) {

          this.dropdownsShow.showRealEstateDropdown = false;

          axios.interceptors.request.use((config) => {
            return config;
          }, (error) => {
            // Handle request error
            // this.isLoadingRealEstate = false;
            this.leadForm.foundRealEstates = [];
            this.dropdownsShow.showRealEstateDropdown = false;
            return Promise.reject(error);
          });

          this.isLoadingRealEstate = true;

          axios.get(this.globalApiBaseUrl + '/onoffice/getRealEstate?searchString=' + this.leadForm.selectedRealEstate.value + '&company=living&allowStammobject=true', {
                cancelToken: new axios.CancelToken((cancel) => {
                  this.cancelTokenRealEstates = cancel;
                }),
              })
              .then(
                  (response) => {
                    this.leadForm.foundRealEstates = response.data.response.real_estates;

                    Object.entries(this.leadForm.foundRealEstates).forEach(([index, value]) => {
                      if ( value.real_estate_id.includes('-WE00') && value.real_estate_company === 'kg' ){

                        Object.entries(this.leadForm.foundRealEstates).forEach(([ind, val]) => {
                          if ( val.real_estate_id === value.real_estate_id && val.real_estate_company === 'living' ){
                            delete this.leadForm.foundRealEstates[index];
                            return;
                          }
                        });

                      }
                    });

                    function extractNumericPart(value) {
                      const numericPart = value.match(/\d+/);
                      return numericPart ? parseInt(numericPart[0]) : 0;
                    }

                    let realEstateArray = []

                    for (let realEstate in this.leadForm.foundRealEstates) {
                      realEstateArray.push(this.leadForm.foundRealEstates[realEstate]);
                    }

                    realEstateArray.sort((a, b) => {
                      return extractNumericPart(a.real_estate_id) - extractNumericPart(b.real_estate_id);
                    });

                    this.leadForm.foundRealEstates = {...realEstateArray};

                    this.leadForm.selectedRealEstateSysId = response.data.response.real_estate_sys_id;
                    this.dropdownsShow.showRealEstateDropdown = true;
                    this.isLoadingRealEstate = false;
                  }
              )
              .catch(
                  (error) => {
                    if ( error.message !== 'canceled' ) {
                      this.isLoadingRealEstate = false;
                    }
                  }
              )
        }
      },
      async searchCustomers(company = 'living') {

        // if ( company === 'kg' ) {
        //   this.searchedLivingFinal = false;
        // }
        //
        // // when founded real estate is a living one than search only in living system
        // if ( this.leadForm.selectedRealEstateCompany.value === 'living' ) {
        //   company = 'living';
        // }

        this.leadForm.foundCustomersInCompany = company;

        if ( company === 'living' ) {
          this.isLoadingCustomer = true;
          this.searchedLivingFinal = true;
        }
        axios.interceptors.request.use((config) => {
          // Update isLoading data property
          if ( config.url.includes('getCustomerData') ) {
            this.isLoadingCustomer = true;
          }
          return config;
        }, (error) => {
          // Handle request error
          this.isLoadingCustomer = false;
          this.leadForm.foundCustomers = [];
          this.dropdownsShow.showCustomerDropdown = false;
          return Promise.reject(error);
        });

        this.leadForm.foundCustomers = [];

        if (this.leadForm.searchCustomer && this.leadForm.searchCustomer.length >= 3) {

          axios.get(this.globalApiBaseUrl + '/onoffice/getCustomerData?searchString=' + this.leadForm.searchCustomer + '&company=' + company + '&searchForPhone=true', {
            cancelToken: new axios.CancelToken((cancel) => {
              this.cancelToken = cancel;
            }),
          })
          .then(
              (response) => {
                if (response.data.response !== null) {
                  this.leadForm.foundCustomers = response.data.response.client_data;
                  this.leadForm.foundCustomers['company'] = company;
                } else {
                  if ( !this.searchedLivingFinal ){
                    this.searchCustomers();
                  }
                  this.leadForm.foundCustomers = [];
                }
                this.dropdownsShow.showCustomerDropdown = true;
              }
          )
          .catch(
              (error) => {
                this.leadForm.foundCustomers = [];
                this.dropdownsShow.showCustomerDropdown = false;
              }
          ).finally(
          () => {
            this.isLoadingCustomer = false;
          })
        }
      },
      getAllUsersOffers() {
        this.isLoadingOffers = true;
        axios.get(this.globalApiBaseUrl + '/onoffice/getAllCustomerOfferedRealEstates?company='+this.leadForm.selectedRealEstateCompany.value+'&customerSysId='+this.leadForm.selectedCustomerSysId)
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    this.apiUsersRealEstateOffers = this.sortArray(response.data.response, 'real_estate_id', 'DESC');
                  }
                }
            ).catch(
            (error) => {
              console.log(error);
            }
        ).finally(
            () => {
              this.isLoadingOffers = false;
            })
      },
      restartCustomerSearch() {
        if (this.cancelToken) {
          this.isLoadingCustomer = false;
          this.cancelToken();
        }
        this.searchCustomers();
      },
      restartRealEstateSearch() {
        if (this.cancelTokenRealEstates) {
          this.cancelTokenRealEstates();
        }
        this.searchRealEstate();
      },
      getAllPossibleAgents() {
        if (this.isLoading) {
          return;
        }

        this.isLoading = true;
        axios.get(this.globalApiBaseUrl + '/onoffice/getAllUsersByCompany?company='+this.leadForm.selectedRealEstateCompany.value)
            .then(
                (response) => {
                  if ( response.data.status === 200 ){
                    let object = {};
                    Object.entries(response.data.response.list_of_all_users_data).forEach(([value, index]) => {
                      let key = index.user_Vorname;
                      if ( typeof index.user_Nachname !== 'undefined' && index.user_Nachname !== null && index.user_Nachname !== '' ) {
                        key += ' ' + index.user_Nachname;
                      }
                      key = key.replaceAll('  ', ' ');
                      object[key] = index.user_Name;
                    });
                    this.apiUsersResponse = this.sortObjectValueAlphabetically(object);
                  }
                }
            ).catch(
            (error) => {
              console.log(error);
            }
        ).finally(
            () => {
              this.isLoading = false;
            })
      },
      submitLead() {

        if (this.isLoading || !this.validateSubmit()) {
          return;
        }

        if ( !this.approveCreateLeadWithoutMailOrPhoneModalProcess && (this.leadForm.mail.value === '' || this.leadForm.phone.value === '') ) {
          this.showErrorMsg = true;
          this.approveCreateLeadWithoutMailOrPhoneModalProcess = true;
          return;
        }

        this.isLoading = true;

        let dataToSend = {};

        dataToSend['client_company'] = this.leadForm.selectedRealEstateCompany.value;

        dataToSend['client_mail'] = this.leadForm.mail.value;

        dataToSend['sendDirectToAgent'] = this.leadForm.sendDirectToAgent;

        dataToSend['setAdditionalAgent'] = 'true';

        if (this.leadForm.selectedRealEstateCompany.value !== '') {
          dataToSend['client_company'] = this.leadForm.selectedRealEstateCompany.value;
        }

        if (this.leadForm.salutation.value !== '') {
          dataToSend['client_salutation'] = this.leadForm.salutation.value;
        }

        if (this.leadForm.title.value !== '') {
          dataToSend['client_title'] = this.leadForm.title.value;
        }

        if (this.leadForm.firstname.value !== '') {
          dataToSend['client_first_name'] = this.leadForm.firstname.value;
        }

        if (this.leadForm.lastname.value !== '') {
          dataToSend['client_last_name'] = this.leadForm.lastname.value;
        }

        if (this.leadForm.phone.value !== '') {
          dataToSend['client_phone'] = this.leadForm.phone.value;
        }

        if (this.leadForm.selectedCustomerNr !== '') {
          dataToSend['client_id'] = this.leadForm.selectedCustomerNr;
        }

        // Reset client_id if system where submit into is not the same as the customer was found in
        // Result will be new customer will be created in the system
        if ( this.leadForm.selectedRealEstateCompany.value !== this.leadForm.foundCustomers['company'] ) {
          dataToSend['client_id'] = '';
        }

        if (this.leadForm.agent.onofficeVal !== '' && this.leadForm.sendDirectToAgent === 'true') {
          dataToSend['agent'] = this.leadForm.agent.onofficeVal
        }

        if (this.leadForm.language === 'Französisch') {
          dataToSend['client_language'] = 'FRA';
        } else if (this.leadForm.language === 'Englisch') {
          dataToSend['client_language'] = 'ENG';
        } else if (this.leadForm.language === 'Niederländisch') {
          dataToSend['client_language'] = 'NLD';
        } else if (this.leadForm.language === 'Spanisch') {
          dataToSend['client_language'] = 'ESP';
        } else if (this.leadForm.language === 'Polnisch') {
          dataToSend['client_language'] = 'POL';
        } else if (this.leadForm.language === 'Ukrainisch') {
          dataToSend['client_language'] = 'CHE';
        } else {
          dataToSend['client_language'] = 'DEU';
        }

        axios.post(this.globalApiBaseUrl + '/onoffice/sendCustomerData', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    if ( response.data.response.response.results[0].actionid === 'urn:onoffice-de-ns:smart:2.5:smartml:action:modify' ) {
                      this.submitLeadActivity(response.data.response.response.results[0].resourceid);
                    } else {
                      this.submitLeadActivity(response.data.response.response.results[0].data.records[0].id);
                    }
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            )
      },
      submitLeadDirectToAgent(allData, activityId) {

        this.isLoading = true;

        let dataToSend = {};

        dataToSend['client_company'] = this.leadForm.selectedRealEstateCompany.value;

        dataToSend['client_mail'] = this.leadForm.mail.value;

        dataToSend['sendDirectToAgent'] = this.leadForm.sendDirectToAgent;

        if (this.leadForm.selectedRealEstateCompany.value !== '') {
          dataToSend['client_company'] = this.leadForm.selectedRealEstateCompany.value;
        }

        if (this.leadForm.salutation.value !== '') {
          dataToSend['client_salutation'] = this.leadForm.salutation.value;
        }

        if (this.leadForm.title.value !== '') {
          dataToSend['client_title'] = this.leadForm.title.value;
        }

        if (this.leadForm.firstname.value !== '') {
          dataToSend['client_first_name'] = this.leadForm.firstname.value;
        }

        if (this.leadForm.lastname.value !== '') {
          dataToSend['client_last_name'] = this.leadForm.lastname.value;
        }

        if (this.leadForm.phone.value !== '') {
          dataToSend['client_phone'] = this.leadForm.phone.value;
        }

        if (this.leadForm.selectedCustomerNr !== '') {
          dataToSend['client_id'] = this.leadForm.selectedCustomerNr;
        }

        if (this.leadForm.agent.onofficeVal !== '') {
          dataToSend['agent'] = this.leadForm.agent.onofficeVal
        }

        if (this.leadForm.message !== '') {
          dataToSend['message'] = this.leadForm.message
        }

        dataToSend['agentFullName'] = this.leadForm.agent.value

        dataToSend['client_sys_id'] = allData['customerSysId'];

        dataToSend['activity_id'] = activityId;

        dataToSend['realEstateData'] = allData['realEstateData'];

        let leadData = {
          'leadData': dataToSend
        };

        axios.post(this.globalApiBaseUrl + '/canban/sendLeadDirectToAgent', leadData)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    this.triggerCanbanReload();
                    this.closeModal();
                    this.notificationBannerInit('success', 'Kunde und Aktivität gespeichert');
                  } else {
                    this.closeModal();
                    this.notificationBannerInit('warning', 'Daten konnten nicht gespeichert werden');
                  }
                }
            )
            .catch(
                (error) => {
                  console.log(error);
                }
            ).finally(
            () => {
              this.isLoading = false;
            })
      },
      submitLeadActivity(customerSysId) {

        this.isLoading = true;

        let sourceMapping = '';
        let realEstateMapping = this.leadForm.selectedRealEstateSysId;

        if (this.leadForm.selectedRealEstateCompany.value === 'kg') {
          if (this.leadForm.source.value === 'Showroom') {
            sourceMapping = 'Ladenlokal';
          } else if (this.leadForm.source.value === 'Mieterkauf') {
            sourceMapping = 'indMulti6437Select6437';
          } else if (this.leadForm.source.value === 'My Casa Away') {
            sourceMapping = 'indMulti2840Select9006';
          } else if (this.leadForm.source.value === 'WhatsApp') {
            sourceMapping = 'indMulti2808Select8972';
          } else if (this.leadForm.source.value === 'keine Quelle') {
            sourceMapping = 'indMulti2542Select8444';
          } else if (this.leadForm.source.value === 'Instagram') {
            sourceMapping = 'indMulti6331Select6331';
          } else if (this.leadForm.source.value === 'Google') {
            sourceMapping = 'indMulti6383Select6383';
          } else if (this.leadForm.source.value === 'Facebook') {
            sourceMapping = 'indMulti6459Select6459';
          } else if (this.leadForm.source.value === 'TikTok') {
            sourceMapping = 'indMulti3056Select9228';
          } else if (this.leadForm.source.value === 'LinkedIn') {
            sourceMapping = 'indMulti6347Select6347';
          } else {
            sourceMapping = this.leadForm.source.value;
          }

          if (this.leadForm.generalLead === 'true') {
            // get allgemein anfrage real estate
            realEstateMapping = '2084';
          }
        } else {
          if (this.leadForm.source.value === 'Showroom') {
            sourceMapping = 'Ladenlokal';
          } else if (this.leadForm.source.value === 'Mieterkauf') {
            sourceMapping = 'indMulti2132Select6904';
          } else if (this.leadForm.source.value === 'My Casa Away') {
            sourceMapping = 'indMulti2704Select8132';
          } else if (this.leadForm.source.value === 'WhatsApp') {
            sourceMapping = 'indMulti2684Select8128';
          } else if (this.leadForm.source.value === 'keine Quelle') {
            sourceMapping = 'indMulti2434Select7956';
          } else if (this.leadForm.source.value === 'Instagram') {
            sourceMapping = 'indMulti2398Select7898';
          } else if (this.leadForm.source.value === 'Google') {
            sourceMapping = 'indMulti2398Select7896';
          } else if (this.leadForm.source.value === 'Facebook') {
            sourceMapping = 'indMulti2398Select7892';
          } else if (this.leadForm.source.value === 'TikTok') {
            sourceMapping = 'indMulti3408Select8350';
          } else if (this.leadForm.source.value === 'LinkedIn') {
            sourceMapping = 'indMulti2398Select7900';
          } else {
            sourceMapping = this.leadForm.source.value;
          }

          if (this.leadForm.generalLead === 'true') {
            // get allgemein anfrage real estate
            realEstateMapping = '5319';
          }
        }

        if (this.leadForm.source.value === 'Immobilienscout24') {
          sourceMapping = 'immobilienscout24_system';
        }

        if (this.leadForm.source.value.includes('Kleinanzeigen')) {
          sourceMapping = 'ebay_system';
        }

        if (this.leadForm.source.value === 'Immowelt') {
          sourceMapping = 'immowelt_system';
        }

        if (this.leadForm.source.value === 'Neubaukompass') {
          sourceMapping = 'neubaukompass';
        }

        let dataToSend = {};
        dataToSend['customerSysId'] = customerSysId;
        dataToSend['activityData'] = {
          'actionkind': this.newCustomer ? 'Lead Neukunde' : 'Lead Bestandskunde',
          'actiontype': this.leadForm.medium.value,
          'source': sourceMapping,
          'note': this.leadForm.message,
        };

        if ( this.leadForm.sendDirectToAgent === 'true' ){
          dataToSend['activityData']['agent_oo_username'] = this.leadForm.agent.onofficeVal;
        }

        dataToSend['realEstateData'] = [{'real_estate_sys_id': realEstateMapping}];
        dataToSend['company'] = this.leadForm.selectedRealEstateCompany.value;

        axios.post(this.globalApiBaseUrl + '/onoffice/sendActivity', dataToSend)
            .then(
                (response) => {
                  if (response.data.status === 200) {
                    if ( this.leadForm.sendDirectToAgent === 'true' ) {
                      this.submitLeadDirectToAgent(dataToSend, response.data.response.response.results[0].data.records[0].id);
                    } else {
                      this.closeModal();
                      this.notificationBannerInit('success', 'Kunde und Aktivität gespeichert');
                    }
                  } else {
                    this.notificationBannerInit('warning', 'Daten konnten nicht gespeichert werden');
                  }
                }
            )
            .catch(
                (error) => {
                  this.closeModal();
                  this.notificationBannerInit('warning', 'Daten konnten nicht gespeichert werden');
                }
            )
      },
      dropdownClick(field, clickedText) {
        if (field === 'selectedRealEstate') {
          Object.entries(this.leadForm.foundRealEstates).forEach(([index, value]) => {
            if (value.real_estate_id === clickedText) {
              this.leadForm.selectedRealEstate.value = clickedText;
              this.leadForm.selectedRealEstateCompany.value = value.real_estate_company;
              this.leadForm.selectedRealEstateSysId = value.real_estate_sys_id;
            }
          });
        } else if (field === 'mail') {

          const clickedTextRemovedWhiitespace = clickedText.replace(/\s+/g, "");
          const arr = clickedTextRemovedWhiitespace.split("|"); // split the string by " | " delimiter
          const clickedMail = arr[0];
          Object.entries(this.leadForm.foundCustomers).forEach(([index, value]) => {
            if (value.client_email === clickedMail) {
              this.updateCustomer(value);
            }
          });
        } else if (field === 'language') {
          this.leadForm[field] = clickedText;
        } else {
          this.leadForm[field].value = clickedText;
        }
        this.closeDropdowns();
      },
      updateCustomer(data) {

        this.leadForm.newCustomer = false;

        if (typeof data.client_sys_id !== 'undefined' && data.client_sys_id !== '') {
          this.leadForm.selectedCustomerSysId = data.client_sys_id
        }
        if (typeof data.client_salutation !== 'undefined' && data.client_salutation !== '') {
          this.leadForm.salutation.value = data.client_salutation
        }
        if (typeof data.client_email !== 'undefined' && data.client_email !== '') {
          this.leadForm.mail.value = data.client_email
        }
        if (typeof data.client_first_name !== 'undefined' && data.client_first_name !== '') {
          this.leadForm.firstname.value = data.client_first_name
        }
        if (typeof data.client_last_name !== 'undefined' && data.client_last_name !== '') {
          this.leadForm.lastname.value = data.client_last_name
        }
        if (typeof data.client_title !== 'undefined' && data.client_title !== '') {
          this.leadForm.title.value = data.client_title
        }
        if (typeof data.client_phone !== 'undefined' && data.client_phone !== '') {
          this.leadForm.phone.value = data.client_phone
        }
        if (typeof data.client_language !== 'undefined' && data.client_language !== '') {
          if ( data.client_language === 'ENG' ) {
            this.leadForm.language = 'Englisch';
          } else if ( data.client_language === 'FRA' ) {
            this.leadForm.language = 'Französisch';
          } else if ( data.client_language === 'NLD' ) {
            this.leadForm.language = 'Niederländisch';
          } else if ( data.client_language === 'ESP' ) {
            this.leadForm.language = 'Spanisch';
          } else {
            this.leadForm.language = 'Deutsch';
          }
        }
        if (typeof data.client_id !== 'undefined' && data.client_id !== '') {
          this.leadForm.selectedCustomerNr = data.client_id
        }
        if (typeof data.client_agent !== 'undefined' && data.client_agent !== '') {
          this.leadForm.agent.onofficeVal = data.client_agent
          this.leadForm.agent.value = data.client_agent
          Object.entries(this.apiUsersResponse).forEach(([index, value]) => {
            if (value === data.client_agent) {
              this.leadForm.agent.value = index
              return;
            }
          });
        }

      },
      resetData(holdSearchEntry = false) {
        this.leadForm = {
          generalLead: this.leadForm.generalLead,
          newCustomer: true,
          message: '',
          searchCustomer: holdSearchEntry ? this.leadForm.searchCustomer : '',
          foundRealEstates: [],
          foundCustomers: [],
          language: 'Deutsch',
          selectedRealEstateSysId: '',

          sendDirectToAgent: 'true',

          mail: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          salutation: {
            required: true,
            valid: true,
            value: 'Herr',
            label: {
              de: ''
            }
          },
          title: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          firstname: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          lastname: {
            required: true,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          phone: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          medium: {
            required: true,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          source: {
            required: true,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          agent: {
            required: true,
            valid: true,
            value: '',
            onofficeVal: '',
            label: {
              de: ''
            }
          },
          selectedRealEstate: {
            required: false,
            valid: true,
            value: '',
            label: {
              de: ''
            }
          },
          selectedRealEstateCompany: {
            required: true,
            valid: true,
            value: 'living',
            label: {
              de: ''
            }
          },
        }
      },
      validateSubmit() {
        let validationChecker = true;
        Object.entries(this.leadForm).forEach(([key, field]) => {
          if ( typeof field.required !== 'undefined' && field.required ){
            if ( field.value === undefined || field.value === ''){
              this.leadForm[key].valid = false;
              validationChecker = false;
            } else {
              if (  field === 'mail' ) {
                if ( this.isValidEmail(field.value) ) {
                  this.leadForm[key].valid = true;
                } else {
                  this.leadForm[key].valid = false;
                  validationChecker = false;
                }
              } else {
                this.leadForm[key].valid = true;
              }
            }
          }
        });
        return validationChecker;
      },
    },
    watch: {
      'leadForm.generalLead': function(newVal) {
        // if ( newVal === 'true' ) {
        //   this.leadForm.selectedRealEstateCompany.value = 'living'
        // }
        this.resetData(true);
      },
      'leadForm.agent.value': function(newVal) {
        for (const [index, value] of Object.entries(this.apiUsersResponse)) {
          if (index === newVal) {
            this.leadForm.agent.onofficeVal = value;
            break;
          }
        }
      },
      'leadForm.sendDirectToAgent': function(newVal) {
        if ( newVal !== 'true' ){
          this.leadForm.agent.required = false;
        } else {
          this.leadForm.agent.required = true;
        }
      },
      'leadForm.selectedRealEstateCompany.value': function(newVal) {
        this.leadForm.salutation.value = 'Herr';
        this.leadForm.mail.value = '';
        this.leadForm.language = '';
        this.leadForm.title.value = '';
        this.leadForm.firstname.value = '';
        this.leadForm.lastname.value = '';
        this.leadForm.phone.value = '';
        this.leadForm.medium.value = '';
        this.leadForm.source.value = '';
        this.leadForm.agent.value = '';
        this.leadForm.agent.onofficeVal = '';
        this.leadForm.selectedCustomerNr = '';
        this.getAllPossibleAgents();
      },
      'leadForm.selectedCustomerSysId': function(newVal) {
        this.getAllUsersOffers();
      },
    },
    computed: {
      renderErrorMsg() {
        let msg = 'Sind Sie sicher den Lead ohne ';
        if ( this.leadForm.mail.value === '' ) {
          msg += 'einer E-Mail ';
        }
        if ( this.leadForm.phone.value === '' ) {
          if ( this.leadForm.mail.value === '' ) {
            msg += 'oder Telefonnummer';
          } else {
            msg += 'einer Telefonnummer';
          }
        }
        msg += ' anzulegen?';
        return msg;
      },
      renderAktionDropdownSelection() {
        let globalOptions = this.activityType;

        if ( this.leadForm.selectedRealEstateCompany.value === 'living' ) {
          return Object.fromEntries(
              Object.entries(globalOptions).filter(([key]) => key !== "Bauträger")
          );
        }

        return globalOptions;
      }
    },
    mounted() {
      this.getAllPossibleAgents();
    }
  }
</script>


<template>

  <div class="modal-wrapper" :class="{ active: isOpenModal }" v-if="isOpenModal" @click="closeDropdowns">

    <div class="modal-inner-wrapper">

      <div class="modal-header">
        <div class="title">Neuen Lead erstellen</div>
        <CloseIcon @click="closeModal()"></CloseIcon>
      </div>

      <div class="modal-body">

        <form class="lead-data">

          <div class="meta-data-top">
            <div>Derzeitiges Unternehmen: <b>{{ leadForm.selectedRealEstateCompany.value }}</b></div>
            <div>Vorraussichtliche Aktivität in OnOffice: <b>{{ leadForm.newCustomer ? 'Lead Neukunde' : 'Lead Bestandskunde' }}</b> </div>
            <div v-if="this.getUserRole() >= 1">Angebotene Immobilien:
              <b v-for="(value, key) in apiUsersRealEstateOffers" v-if="apiUsersRealEstateOffers.length > 0">{{value.real_estate_id}}, </b>
              <b v-else><span v-if="!isLoadingOffers">-</span></b>
              <span class="loading-icon-offers" v-if="isLoadingOffers"><AnimateCircleIcon></AnimateCircleIcon> </span>
            </div>
          </div>

          <div class="field-wrapper radios">
            <label for="generalLead" class="radio-wrapper">
              <InputField inputType="radio" id="generalLead" inputName="generalLead" value="true" :inputValue="leadForm.generalLead" v-model="leadForm.generalLead"></InputField>
              Allgemeine Anfrage
            </label>
            <label for="realEstateLead" class="radio-wrapper">
              <InputField inputType="radio" id="realEstateLead" inputName="realEstateLead" value="false" :inputValue="leadForm.generalLead" v-model="leadForm.generalLead"></InputField>
              Immobilien Anfrage
            </label>
          </div>

          <div class="field-wrapper search" v-if="leadForm.generalLead === 'false'" :class="{'invalid': !leadForm.selectedRealEstate.valid, 'valid': leadForm.selectedRealEstate.valid}">
            <InputField ref="inputRealEstates" inputType="text" inputPlaceholder="Straße oder Immo-Nr." inputName="RealEstates" :inputValue="leadForm.selectedRealEstate.value" v-model="leadForm.selectedRealEstate.value" @input="restartRealEstateSearch" @focus="setDropdownTop($event)"></InputField>
            <label class="ph">Suchen nach Straße oder Immo-Nr. <AsterixMarkIcon></AsterixMarkIcon></label>
            <Dropdown ref="dropdownRealEstates" :class="{active: dropdownsShow.showRealEstateDropdown, relative: dropdownRelativePosition}" type="realEstate" :renderingObject="leadForm.foundRealEstates" @dropdown-item-clicked="dropdownClick('selectedRealEstate', $event)" @click.stop=""></Dropdown>
            <AnimateCircleIcon v-if="isLoadingRealEstate"></AnimateCircleIcon>
          </div>

          <div class="field-wrapper search" v-if="this.getUserRole() >= 1">
            <InputField ref="inputRealEstates" inputType="text" inputName="Customers" :inputValue="leadForm.searchCustomer" v-model="leadForm.searchCustomer" @input="restartCustomerSearch" @focus="setDropdownTop($event)"></InputField>
            <label class="ph">Kundensuche nach E-Mail oder Telefon</label>
            <Dropdown ref="dropdownCustomers" :class="{active: dropdownsShow.showCustomerDropdown, relative: dropdownRelativePosition}" type="customerData" :renderingObject="leadForm.foundCustomers" @dropdown-item-clicked="dropdownClick('mail', $event)" @click.stop=""></Dropdown>
            <AnimateCircleIcon v-if="isLoadingCustomer"></AnimateCircleIcon>
          </div>

          <div class="title-seperator"><span>Kundendaten</span></div>

          <div class="field-wrapper two-col">
            <span>
                <InputField class="dropdown-input" ref="inputSalutation" inputType="text" inputPlaceholder="Anrede" inputName="Salutation" :inputValue="leadForm.salutation.value" v-model="leadForm.salutation.value" @focus="setDropdownTop($event)" @click="dropdownsShow.showSalutationDropdown = true" @click.stop=""></InputField>
                <label class="ph">Anrede</label>
                <DropdownArrow class="dropdown-arrow"></DropdownArrow>
                <Dropdown ref="dropdownSalutation" :class="{active: dropdownsShow.showSalutationDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="this.salutationList" :filterFor="leadForm.salutation.value" @dropdown-item-clicked="dropdownClick('salutation', $event)" @click.stop=""></Dropdown>
              </span>
            <span>
              <InputField inputType="text" inputName="CustomerTitle" :inputValue="leadForm.title.value" v-model="leadForm.title.value"></InputField>
              <label class="ph">Titel</label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span>
              <InputField inputType="text" inputName="Firstname" :inputValue="leadForm.firstname.value" v-model="leadForm.firstname.value"></InputField>
              <label class="ph">Vorname</label>
            </span>
            <span :class="{'invalid': !leadForm.lastname.valid, 'valid': leadForm.lastname.valid}">
              <InputField inputType="text" inputName="Lastname" :inputValue="leadForm.lastname.value" v-model="leadForm.lastname.value"></InputField>
              <label class="ph">Nachname <AsterixMarkIcon></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span>
              <InputField inputType="text" inputName="Firstname" :inputValue="leadForm.phone.value" v-model="leadForm.phone.value"></InputField>
              <label class="ph">Telefon</label>
            </span>
            <span :class="{'invalid': !leadForm.mail.valid, 'valid': leadForm.mail.valid}">
              <InputField inputType="text" inputName="Lastname" :inputValue="leadForm.mail.value" v-model="leadForm.mail.value"></InputField>
              <label class="ph">E-Mail <AsterixMarkIcon v-if="leadForm.mail.required"></AsterixMarkIcon></label>
            </span>
          </div>

          <div class="field-wrapper two-col">
            <span>
              <InputField class="dropdown-input" ref="inputLanguage" inputType="text" inputName="Language" :inputValue="leadForm.language" v-model="leadForm.language" @focus="setDropdownTop($event)" @click="dropdownsShow.showLanguageDropdown = true" @click.stop=""></InputField>
              <label class="ph">Sprache</label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownLanguage" :class="{active: dropdownsShow.showLanguageDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="dropdownContents.language" :filterFor="leadForm.language" @dropdown-item-clicked="dropdownClick('language', $event)" @click.stop=""></Dropdown>
            </span>
            <span :class="{'invalid': !leadForm.medium.valid, 'valid': leadForm.medium.valid}">
              <InputField class="dropdown-input" ref="inputSource" inputType="text" inputName="Source" :inputValue="leadForm.medium.value" v-model="leadForm.medium.value" @focus="setDropdownTop($event)" @click="dropdownsShow.showSourceDropdown = true" @click.stop=""></InputField>
              <label class="ph">Medium <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownSource" :class="{active: dropdownsShow.showSourceDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="renderAktionDropdownSelection" :filterFor="leadForm.medium.value" @dropdown-item-clicked="dropdownClick('medium', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper" :class="{'two-col': leadForm.sendDirectToAgent === 'true'}">
            <span :class="{'invalid': !leadForm.agent.valid, 'valid': leadForm.agent.valid}" v-if="leadForm.sendDirectToAgent === 'true'">
              <InputField class="dropdown-input" ref="inputSource" inputType="text" inputName="Source" :inputValue="leadForm.agent.value" v-model="leadForm.agent.value" @focus="setDropdownTop($event)" @click="dropdownsShow.showContactAgentDropdown = true" @click.stop=""></InputField>
              <label class="ph">Makler <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownSource" :class="{active: dropdownsShow.showContactAgentDropdown, relative: dropdownRelativePosition}" type="users" :renderingObject="this.apiUsersResponse" :filterFor="leadForm.agent.value" @dropdown-item-clicked="dropdownClick('agent', $event)" @click.stop=""></Dropdown>
            </span>

            <span :class="{'invalid': !leadForm.source.valid, 'valid': leadForm.source.valid}">
              <InputField class="dropdown-input" ref="inputSource" inputType="text" inputName="Source" :inputValue="leadForm.source.value" v-model="leadForm.source.value" @focus="setDropdownTop($event)" @click="dropdownsShow.showContactSourceDropdown = true" @click.stop=""></InputField>
              <label class="ph">Herkunft Kontakt <AsterixMarkIcon></AsterixMarkIcon></label>
              <DropdownArrow class="dropdown-arrow"></DropdownArrow>
              <Dropdown ref="dropdownSource" :class="{active: dropdownsShow.showContactSourceDropdown, relative: dropdownRelativePosition}" type="country" :renderingObject="this.sourceOfContact" :filterFor="leadForm.source.value" @dropdown-item-clicked="dropdownClick('source', $event)" @click.stop=""></Dropdown>
            </span>
          </div>

          <div class="field-wrapper">
            <TextAreaField inputName="leadmsg" :inputVal="leadForm.message" v-model="leadForm.message"></TextAreaField>
            <label class="ph">Bemerkung</label>
          </div>

          <div class="field-wrapper radios">
            <label for="directToAgent" class="radio-wrapper">
              <InputField inputType="radio" id="directToAgent" inputName="directToAgent" value="true" :inputValue="leadForm.sendDirectToAgent" v-model="leadForm.sendDirectToAgent"></InputField>
              Lead an Makler übermitteln
            </label>
            <label for="directToLV" class="radio-wrapper">
              <InputField inputType="radio" id="directToLV" inputName="directToLV" value="false" :inputValue="leadForm.sendDirectToAgent" v-model="leadForm.sendDirectToAgent"></InputField>
              Lead an Vertriebsleiter übermitteln
            </label>
          </div>

        </form>

        <div class="error-message" v-if="showErrorMsg">
          <AlertMessage :alertText="renderErrorMsg" alertStatus="warning"></AlertMessage>
        </div>

        <div class="actions">

          <Button type="delete" @click="closeModal" v-if="!showErrorMsg">Schließen</Button>
          <Button type="delete" @click="showErrorMsg = false; approveCreateLeadWithoutMailOrPhoneModalProcess = false;" v-if="showErrorMsg">Nein</Button>
          <Button type="report" @click="submitLead" data-cy="submit">{{!showErrorMsg ? 'Lead' : 'Ja'}} erstellen <AnimateCircleIcon v-if="this.isLoading"></AnimateCircleIcon></Button>

        </div>

      </div>

    </div>

  </div>

</template>


<style scoped>

.title {
  font-size: 18px;
  font-weight: 700;
}

.verkaufsmeldung-data, .process-tabs-wrapper {
  display: flex;
  justify-content: space-between;
}

.meta-data-top {
  margin-bottom: 25px;
  font-size: 12px;
}

.verkaufsmeldung-data + .verkaufsmeldung-data,
.edit-real-estate {
  margin-top: 25px;
}

.radios, .radio-wrapper{
  text-align: center;
}

.field-wrapper + .field-wrapper {
  margin-top: 25px;
}

.field-wrapper:not(.search)  {
  display: flex;
  justify-content: space-between;
}

.field-wrapper.radios {
  justify-content: center;
}

.field-wrapper > span {
  flex-basis: 48%;
}

.field-wrapper:not(.two-col) > span {
  flex-basis: 100%;
}

.radio-wrapper {
  display: inline-block;
}

.process-tabs-wrapper, .real-estates-list, .modal-body {
  margin-top: 40px;
}

.verkaufsmeldung-data:first-of-type > div:last-of-type {
  text-align: right;
}

.verkaufsmeldung-data > div {
  flex-basis: 48%;
}

.customer-data a {
  color: var(--blue);
}

.process-tabs-wrapper .processtab {
  flex-basis: 32%;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 40px;
}

.actions > .button, .actions > a {
  flex-basis: 48%;
  margin-bottom: 15px;
}

.actions .button.full-width {
  flex-basis: 100%;
}

.actions.delete-init .button:last-of-type,
.actions.report-init .button:last-of-type,
.actions.approve-init .button:last-of-type{
  flex-basis: 48%;
  margin-bottom: 15px;
}

iframe {
  width: 100%;
  height: 70vh;
}

.iframe-view .actions.approve-init .button:last-of-type {
  flex-basis: 100%;
}

.actions.approve-init.reject-init .button:last-of-type {
  flex-basis: 48%;
}

.option-wrapper {
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  padding: 25px 0;
  border-top: dotted 1px var(--light-gray);
  border-bottom: dotted 1px var(--light-gray);
}

.option-wrapper + .option-wrapper {
  border-top: none;
  margin-top: 0;
}

.option-wrapper .checkbox {
  flex-basis: auto;
  top: 0;
  margin-top: 0;
}

.title-seperator {
  position: relative;
  flex-basis: 100%;
  margin: 25px 0;
  text-align: center;
  z-index: 0;
}

.title-seperator span {
  position: relative;
  padding: 0 15px;
  background: white;
  z-index: 2;
}

.title-seperator:after {
  content: '';
  display: block;
  height: 2px;
  width: 100%;
  background-color: var(--light-light-gray);
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
}

.real-estates-list {
  height: auto;
  margin-bottom: 25px;
}

.real-estate-list-item {
  border-bottom: none;
}

.fee-conditional {
  margin-bottom: 15px;
}

.loading-icon-offers .loading-animation {
  display: inline;
  font-size: 16px;
  margin-left: 5px;
}

/* Medium Mobile */
@media (max-width: 500px){
  .verkaufsmeldung-data {
    flex-wrap: wrap;
  }
  .verkaufsmeldung-data > div {
    flex-basis: 100%;
  }
  .verkaufsmeldung-data:last-of-type {
    display:none;
  }
  .additional + .additional {
    margin-top: 10px;
  }
  .real-estate-list-item .row {
    flex-wrap: wrap;
  }
  .real-estate-list-item .row > div {
    flex-basis: 100%;
  }
  .verkaufsmeldung-data > div b {
    display: block;
  }
}


</style>
