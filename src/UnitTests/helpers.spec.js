import {
    increment,
    checkValideApiResponseTest,
    checkIfDateInFuture,
    checkValOfPrice,
    englishDateWithTimeToGermanDate,
    checkIfRealEstatesGotFee,
    filterRangeOfNumbers,
    filterSingleRealEstate,
    filterRangeOfObject
} from './helpers.js'

describe('incrementert', () => {
    test('increments the current number by 1', () => {
        expect(increment(0, 10)).toBe(1)
    })

    test('does not increment the current number over the max', () => {
        expect(increment(10, 10)).toBe(10)
    })

    test('has a default max of 10', () => {
        expect(increment(10)).toBe(10)
    })
})



describe('validApiResponse', () => {

    test('status is 200 int', () =>{
        expect(checkValideApiResponseTest({ status: 200 })).toBe(true)
    })

    test('status is bool', () =>{
        expect(checkValideApiResponseTest({notstatusset: true})).toBe(false)
    })

    test('status is 400 int', () =>{
        expect(checkValideApiResponseTest({status: 400})).toBe(false)
    })

    test('status is string', () =>{
        expect(checkValideApiResponseTest({status: 'string'})).toBe(false)
    })

    test('status empty', () =>{
        expect(checkValideApiResponseTest({status: ''})).toBe(false)
    })

})


describe('checkDateFutureValidation', () => {

    test('check date in past', () =>{
        expect(checkIfDateInFuture('2022-01-01')).toBe(false);
    })

    test('check date and time in past', () =>{
        expect(checkIfDateInFuture('2022-01-01 10:00:00')).toBe(false);
    })

    test('check date in future', () =>{
        expect(checkIfDateInFuture('2023-12-27')).toBe(true);
    })

    test('check date and time in future', () =>{
        expect(checkIfDateInFuture('2023-12-12 10:59:00')).toBe(true);
    })

    test('check wrong format', () =>{
        expect(checkIfDateInFuture('sdvfdsgdfsdfs')).toBe(null);
    })

    test('check wrong format', () =>{
        expect(checkIfDateInFuture('12312312312')).toBe(null);
    })

    test('check wrong format', () =>{
        expect(checkIfDateInFuture(12312312312)).toBe(null);
    })

})

describe('validation test of insert', () => {
    test('test null', () => {
        expect(checkValOfPrice(null)).toBe(true);
    })

    test('test zero', () => {
        expect(checkValOfPrice(0)).toBe(true);
    })

    test('test zero string', () => {
        expect(checkValOfPrice('0')).toBe(true);
    })

    test('test random string', () => {
        expect(checkValOfPrice('none')).toBe(false);
    })
})

describe('validation date formater english to german', () => {
    test('test correct input', () => {
        expect(englishDateWithTimeToGermanDate('2023-01-11 15:00:00')).toBe('11.01.2023 15:00:00');
    })

    test('test empty string', () => {
        expect(englishDateWithTimeToGermanDate('')).toBe(false);
    })

    test('test wrong string', () => {
        expect(englishDateWithTimeToGermanDate('asdsadasdas')).toBe(false);
    })
})


describe('validation array of real estate if fee is set', () => {

    let normalData = [{
        "id": "510",
        "reservation_id": "476",
        "create_date": "2023-01-19 09:49:45",
        "estate_nr": "Leadverteiler3-WE02",
        "estate_price": "200000",
        "estate_fee": "2000",
        "estate_rent": "0",
        "modified_date": "0000-00-00",
        "cancellation_reason": "",
        "cancellation": "0",
        "estate_typ": "Wohnung",
        "real_estate_agent": "mperera",
        "real_estate_sys_id": "5505",
        "realestate_notartermin": "0"
    }];

    let normalDataNoFee = [{
        "id": "510",
        "reservation_id": "476",
        "create_date": "2023-01-19 09:49:45",
        "estate_nr": "Leadverteiler3-WE02",
        "estate_price": "200000",
        "estate_fee": "0",
        "estate_rent": "0",
        "modified_date": "0000-00-00",
        "cancellation_reason": "",
        "cancellation": "0",
        "estate_typ": "Wohnung",
        "real_estate_agent": "mperera",
        "real_estate_sys_id": "5505",
        "realestate_notartermin": "0"
    }];

    let wrongData = [{
        "id": "510",
        "reservation_id": "476",
        "create_date": "2023-01-19 09:49:45",
        "estate_nr": "Leadverteiler3-WE02",
        "estate_price": "200000",
        "estate_feetester": "0",
        "estate_rent": "0",
        "modified_date": "0000-00-00",
        "cancellation_reason": "",
        "cancellation": "0",
        "estate_typ": "Wohnung",
        "real_estate_agent": "mperera",
        "real_estate_sys_id": "5505",
        "realestate_notartermin": "0"
    }];

    test('test correct input with fee', () => {
        expect(checkIfRealEstatesGotFee(normalData)).toBe(true);
    })

    test('test correct input without fee', () => {
        expect(checkIfRealEstatesGotFee(normalDataNoFee)).toBe(false);
    })

    test('test correct input without fee', () => {
        expect(checkIfRealEstatesGotFee(normalDataNoFee)).toBe(false);
    })

    test('test wrong fee property name', () => {
        expect(checkIfRealEstatesGotFee(wrongData)).toBe(false);
    })

    test('test wrong string', () => {
        expect(checkIfRealEstatesGotFee('asdsadasdas')).toBe(false);
    })
})



describe('validation range filter', () => {

    let correctData = {
        filter: {
            from: 100000,
            to: 200000
        },
        valueToCheck: '150000',
    }

    test('test correct input', () => {
        expect(filterRangeOfNumbers(correctData.filter, correctData.valueToCheck)).toBe(true);
    })

    let falseData = {
        filter: {
            from: 100000,
            to: 500000
        },
        valueToCheck: '1000000',
    }
    test('test wrong input', () => {
        expect(filterRangeOfNumbers(falseData.filter, falseData.valueToCheck)).toBe(false);
    })

    let false2Data = {
        filter: {
            from: '100',
            to: '100'
        },
        valueToCheck: '0',
    }
    test('test wrong 2 input', () => {
        expect(filterRangeOfNumbers(false2Data.filter, false2Data.valueToCheck)).toBe(false);
    })

})




describe('validation filter', () => {

    let filter = {
            usageKind: 'Wohnen',
            status: 'Alle',
            type: 'Alle',
            budget: {
                from: '',
                to: ''
            },
            rentStatus: 'Alle',
            rooms: {
                from: '',
                to: ''
            },
            squareMeter: {
                from: '',
                to: ''
            },
            floor: {
                from: '',
                to: ''
            },
            balcony: false,
            terrace: false,
            garden: false,
            lift: false,
            basement: false,
            parkingSlot: false,
            constructionYear: {
                from: '',
                to: ''
            },
            yield: {
                from: '',
                to: ''
            },
            commissionFree: false,
            renterProtection: false,
            searchArea: 'all',
            roughSearchArea: [],
            district: [],
            localPart: [],
            inTrainArea: false,
        };

    let realEstate = {
        "real_estate_sys_id": "5959",
        "real_estate_id": "GE63-WE00",
        "real_estate_price": 0,
        "real_estate_reservationprice": 0,
        "real_estate_fee": 0,
        "real_estate_rented": "false",
        "real_estate_object_type": null,
        "real_estate_object_kind": "Wohnen",
        "real_estate_project_name": "13353_WDDNG",
        "real_estate_street": "Genterstraße 63",
        "real_estate_zipcode": "13353",
        "real_estate_city": "Berlin",
        "real_estate_article": "",
        "real_estate_number": null,
        "real_estate_basement_nr": "",
        "real_estate_rooms": "0.00",
        "real_estate_usage_kind": "Wohnen",
        "real_estate_housemoney": "0.00",
        "real_estate_commissionfree": "0",
        "real_estate_yield": "0.00",
        "real_estate_calculated_area": "0.00",
        "real_estate_living_area": "0.00",
        "real_estate_net_cold_rent": "0.00",
        "real_estate_price_squaremetres": "0.00",
        "real_estate_lift": null,
        "real_estate_balcony": false,
        "real_estate_terrace": "0",
        "real_estate_floor": "",
        "real_estate_has_basement": "",
        "real_estate_construction_year": "0",
        "real_estate_status": "Aktive Vermarktung",
        "real_estate_rent_per_month": "0.00",
        "real_estate_rent_state": "",
        "real_estate_in_train_area": "",
        "real_estate_parking": "",
        "real_estate_garden": "Nein",
        "real_estate_city_area": "Mitte",
        "real_estate_search_area": "Berlin-Mitte",
        "real_estate_buy_by_renter": "",
        "real_estate_company": "kg",
        "real_estate_building_part": ""
    };


    test('test correct input', () => {
        expect(filterSingleRealEstate(realEstate, filter)).toBe(true);
    })

})

describe('validation filter floor', () => {



    let realEstate = {
        "real_estate_sys_id": "5959",
        "real_estate_id": "GE63-WE00",
        "real_estate_price": 0,
        "real_estate_reservationprice": 0,
        "real_estate_fee": 0,
        "real_estate_rented": "false",
        "real_estate_object_type": null,
        "real_estate_object_kind": "Wohnen",
        "real_estate_project_name": "13353_WDDNG",
        "real_estate_street": "Genterstraße 63",
        "real_estate_zipcode": "13353",
        "real_estate_city": "Berlin",
        "real_estate_article": "",
        "real_estate_number": null,
        "real_estate_basement_nr": "",
        "real_estate_rooms": "0.00",
        "real_estate_usage_kind": "Wohnen",
        "real_estate_housemoney": "0.00",
        "real_estate_commissionfree": "0",
        "real_estate_yield": "0.00",
        "real_estate_calculated_area": "0.00",
        "real_estate_living_area": "0.00",
        "real_estate_net_cold_rent": "0.00",
        "real_estate_price_squaremetres": "0.00",
        "real_estate_lift": null,
        "real_estate_balcony": false,
        "real_estate_terrace": "0",
        "real_estate_floor": "2. OG",
        "real_estate_has_basement": "",
        "real_estate_construction_year": "0",
        "real_estate_status": "Aktive Vermarktung",
        "real_estate_rent_per_month": "0.00",
        "real_estate_rent_state": "",
        "real_estate_in_train_area": "",
        "real_estate_parking": "",
        "real_estate_garden": "Nein",
        "real_estate_city_area": "Mitte",
        "real_estate_search_area": "Berlin-Mitte",
        "real_estate_buy_by_renter": "",
        "real_estate_company": "kg",
        "real_estate_building_part": ""
    };


    test('test from to', () => {
        expect(filterRangeOfObject({from: '1. OG', to: '3. OG'}, realEstate.real_estate_floor)).toBe(true);
    })

    test('test from true', () => {
        expect(filterRangeOfObject({from: 'SOUT', to: ''}, 'EG')).toBe(true);
    })

    test('test from false', () => {
        expect(filterRangeOfObject({from: 'HOCH', to: ''}, 'EG')).toBe(false);
    })

    test('test to true', () => {
        expect(filterRangeOfObject({from: '', to: '10. OG'}, '9. OG')).toBe(true);
    })

    test('test to false', () => {
        expect(filterRangeOfObject({from: '', to: '10. OG'}, 'DG')).toBe(false);
    })

    test('test to false 2', () => {
        expect(filterRangeOfObject({from: '5. OG', to: '10. OG'}, 'DG')).toBe(false);
    })

    test('test to true 1', () => {
        expect(filterRangeOfObject({from: '20. OG', to: 'DG'}, 'DG')).toBe(true);
    })

    test('test to true 2', () => {
        expect(filterRangeOfObject({from: '20. OG', to: ''}, 'DG')).toBe(true);
    })

    test('test to false 3', () => {
        expect(filterRangeOfObject({from: '20. OG', to: ''}, '18. OG')).toBe(false);
    })

    test('test missionett value', () => {
        expect(filterRangeOfObject({from: 'EG + 1. OG', to: ''}, 'KG')).toBe(true);
    })

})
