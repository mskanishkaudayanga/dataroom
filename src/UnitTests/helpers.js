export function increment (current, max = 10) {
    if (current < max) {
        return current + 1
    }
    return current
}

export function checkValideApiResponseTest (apiResponse) {
    if ( apiResponse && apiResponse.status === 200 ){
        return true;
    } else {
        return false;
    }
}

export function checkIfDateInFuture(futureDate) {
    // Dateformat should be in yyyy-mm-dd
    // can also have time as H:i:s in addition
    if ( !isNaN(futureDate) ){
        return null;
    }

    const currentTime = Date.now();
    const futureDateStamp = new Date(futureDate);

    const futureTime = futureDateStamp.getTime();
    if (futureTime > currentTime) {
        return true;
    } else if (futureTime < currentTime) {
        return false;
    } else {
        return null;
    }
}

export function checkValOfPrice(val){
    if ( !val || val === 0 || val === '0' ){
        return true;
    }
    return false;
}

export function englishDateWithTimeToGermanDate(date) {
    if ( date === undefined || date === '' ){
        return false;
    }
    // Expect input string in format yyyy-mm-dd HH:ii:ss
    let dateArrayHourSplit = date.split(' ');
    let dateArray = dateArrayHourSplit[0].split('-');

    if ( dateArray[2] === undefined || dateArray[1] === undefined || dateArray[0] === undefined ){
        return false;
    }

    return dateArray[2]+'.'+dateArray[1]+'.'+dateArray[0]+' '+dateArrayHourSplit[1];
}

export function checkIfRealEstatesGotFee(arrayOfRealEstates) {
    let returnVal = false;
    for( const RealEstate of arrayOfRealEstates ){
        if ( RealEstate['estate_fee'] && parseInt(RealEstate['estate_fee']) > 0 ){
            returnVal = true;
            break;
        }
    }
    return returnVal
}

export function filterRangeOfNumbers(rangeObject, realEstateValue) {

    let valueToCheck = parseFloat(realEstateValue);
    let validator = {
        from: false,
        to: false,
    };

    if ( !rangeObject.from && !rangeObject.to ){
        return true;
    }

    if ( rangeObject.from ){
        if ( rangeObject.from !== 0 && rangeObject.from !== '' ){
            rangeObject.from = parseFloat(rangeObject.from);
            if ( rangeObject.from <= valueToCheck ){
                validator.from =  true;
            } else {
                validator.from =  false;
            }
        } else {
            delete validator.from;
        }
    }

    if ( rangeObject.to ){
        if ( rangeObject.to !== 0 && rangeObject.to !== '' ){
            rangeObject.to = parseFloat(rangeObject.to);
            if ( rangeObject.to >= valueToCheck ){
                validator.to =  true;
            } else {
                validator.to =  false;
            }
        } else {
            delete validator.to;
        }
    }

    Object.keys(validator).forEach(function(ele) {
        if ( validator[ele] === false ){
            validator = false;
        }
    });

    return validator;

}

export function filterSingleRealEstate(realEstate, filter){

    let filterRangeOfNumbers = this.filterRangeOfNumbers;

    // Detect if given real estate matches the filter and return true if it does
    if ( typeof realEstate === "undefined" || realEstate.length === 0 || typeof filter === "undefined" || filter.length === 0){
        console.log('wrong input');
        return false;
    }

    if ( (filter.usageKind !== 'Alle' && filter.usageKind !== '') && filter.usageKind !== realEstate.real_estate_usage_kind ){
        console.log('false usage kind');
        return false;
    }

    if ( (filter.status !== 'Alle' && filter.status !== '') && filter.status !== realEstate.real_estate_status ){
        console.log('false status');
        return false;
    }

    if ( !filterRangeOfNumbers(filter.budget, realEstate.real_estate_price) ){
        console.log('false budget');
        return false;
    }

    if ( (filter.rentStatus !== 'Alle' && filter.rentStatus !== '') && filter.rentStatus !== realEstate.real_estate_rent_state ){
        console.log('false rentStatus');
        return false;
    }

    if ( !filterRangeOfNumbers(filter.rooms, realEstate.real_estate_rooms) ){
        console.log('false rooms');
        return false;
    }

    if ( !filterRangeOfNumbers(filter.squareMeter, realEstate.real_estate_living_area) ){
        console.log('false squareMeter');
        return false;
    }

    if ( !filterRangeOfNumbers(filter.squareMeter, realEstate.real_estate_living_area) ){
        console.log('false squareMeter');
        return false;
    }

    // TODO Floors missing dont know how to handle it yet

    if ( filter.balcony && filter.balcony !== realEstate.real_estate_balcony ){
        console.log('false balcony');
        return false;
    }

    if ( filter.terrace && filter.terrace !== realEstate.real_estate_terrace ){
        console.log('false terrace');
        return false;
    }

    if ( filter.garden && filter.garden !== realEstate.real_estate_garden ){
        console.log('false garden');
        return false;
    }

    if ( filter.lift && filter.lift !== realEstate.real_estate_lift ){
        console.log('false lift');
        return false;
    }

    if ( filter.basement && filter.basement !== realEstate.real_estate_has_basement ){
        console.log('false basement');
        return false;
    }

    if ( filter.parkingSlot && filter.parkingSlot !== realEstate.real_estate_parking ){
        console.log('false parkingSlot');
        return false;
    }

    if ( !filterRangeOfNumbers(filter.constructionYear, realEstate.real_estate_construction_year) ){
        console.log('false constructionYear');
        return false;
    }

    if ( !filterRangeOfNumbers(filter.yield, realEstate.real_estate_yield) ){
        console.log('false yield');
        return false;
    }

    if ( filter.commissionFree && filter.commissionFree !== realEstate.real_estate_commissionfree ){
        console.log('false commissionFree');
        return false;
    }

    if ( filter.renterProtection && filter.renterProtection !== realEstate.real_estate_buy_by_renter ){
        console.log('false renterProtection');
        return false;
    }

    if ( filter.searchArea === 'only berlin' && realEstate.real_estate_city !== 'Berlin' ){
        console.log('false searchArea');
        return false;
    }

    if ( filter.roughSearchArea.length > 0 ){
        if ( !filter.roughSearchArea.includes('Alles andere') && !filter.roughSearchArea.includes(realEstate.real_estate_search_area) ){
            console.log('false roughSearchArea');
            return false;
        }
    }

    if ( filter.district.length > 0 ){
        if ( !filter.district.includes('Alle') && !filter.district.includes(realEstate.real_estate_city_area) ){
            console.log('false district');
            return false;
        }
    }

    // TODO Ortsteile is missing in onoffice
    // if ( filter.localPart.length > 0 ){
    //   if ( !filter.localPart.includes('Alle') && !filter.localPart.includes(realEstate.real_estate_city_area) ){
    //     return false;
    //   }
    // }

    if ( filter.inTrainArea && filter.inTrainArea !== realEstate.real_estate_in_train_area ){
        console.log('false inTrainArea');
        return false;
    }

    return true;
};

export function filterRangeOfObject(rangeObject, realEstateValue, debug = false) {

    if ( debug ){
        console.log(rangeObject);
    }

    let floor = {
        'KG': 'KG',
        'SOUT': 'SOUT',
        'EG': 'EG',
        'HOCH': 'HOCH',
        'EG + 1. OG': 'EG + 1. OG',
        '1. OG': '1. OG',
        '2. OG': '2. OG',
        '3. OG': '3. OG',
        '4. OG': '4. OG',
        '5. OG': '5. OG',
        '5. OG + 6. OG': '5. OG + 6. OG',
        '6. OG': '6. OG',
        '7. OG': '7. OG',
        '8. OG': '8. OG',
        '9. OG': '9. OG',
        '10. OG': '10. OG',
        '11. OG': '11. OG',
        '12. OG': '12. OG',
        '13. OG': '13. OG',
        '14. OG': '14. OG',
        '15. OG': '15. OG',
        '16. OG': '16. OG',
        '17. OG': '17. OG',
        '18. OG': '18. OG',
        '19. OG': '19. OG',
        'STG': 'STG',
        'DG': 'DG'
    };

    let fromCounter;
    let toCounter;
    let searchFloorPosition;

    let validator = {
        from: false,
        to: false,
    };

    let counter = 0;
    Object.keys(floor).forEach(function(item) {

        if ( rangeObject.from !== '' && rangeObject.from === item ) {
            if ( item === 'EG + 1. OG' ){
                fromCounter = 2;
            } else if ( item === '5. OG + 6. OG' ){
                fromCounter = 9;
            } else {
                fromCounter = counter;
            }
        }
        if ( rangeObject.to !== '' && rangeObject.to === item ) {
            if ( item === 'EG + 1. OG' ){
                fromCounter = 3;
            } else if ( item === '5. OG + 6. OG' ){
                fromCounter = 10;
            } else {
                fromCounter = counter;
            }
            toCounter = counter;
        }
        if ( realEstateValue === item ) {
            searchFloorPosition = counter;
        }
        counter = counter+1;
    });

    if ( typeof fromCounter !== 'undefined'){
        if ( searchFloorPosition >= fromCounter ) {
            validator.from = true;
        }
    } else {
        validator.from = true;
    }

    if ( typeof toCounter !== 'undefined'){
        if ( searchFloorPosition <= toCounter ) {
            validator.to = true;
        }
    } else {
        validator.to = true;
    }

    let returnVal = true;
    Object.keys(validator).forEach(function(ele) {
        if ( validator[ele] === false ){
            returnVal = false;
        }
    });

    return returnVal;

};
