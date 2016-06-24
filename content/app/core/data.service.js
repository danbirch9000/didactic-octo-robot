(function () {
    'use strict';

    angular
        .module('internationalPortal.core')
        .factory('dataService', dataService);

    dataService.$inject = ['$http', 'logger', '$q'];

    function dataService($http, logger, $q) {

        function getCountries(workItemId, workItemRejection) {
            return getData('http://localhost:50214/api/v0/countries', 'Error getting countries');
        }

        function getBrands(countryCode) {
            return getData('http://localhost:50214/api/v0/brands?countryCodes=' + countryCode, 'Error getting brands for country');
        }

        function getModelRanges(brandId) {
            return getData("http://localhost:50214/api/v0/brands/"+ brandId +"/modelranges", 'Error getting model ranges for brand');
        }

        function getGenerationMarks(modelRangeId) {
            return getData("http://localhost:50214/api/v0/modelranges/" + modelRangeId  + "/generations", 'Error getting generation mark for model range');
        }

        function getDerivatives(generationMarkId) {
            return getData("http://localhost:50214/api/v0/generations/" + generationMarkId + "/Derivatives", 'Error getting derivatives for given generation mark');
        }

        function getVehicleData(derivativeId) {
            return getData("http://localhost:50214/api/v0/Derivatives/" + derivativeId, 'Error getting derivative data');
        }

        function getPricelistsColours() {
            return getData("http://localhost:50214/api/v0/derivatives/503668/pricelists/14/Colours", 'Error getting Pricelists colours');
        }
        
        function getPriceLists(derivativeId) {
            return getData("http://localhost:50214/api/v0/derivatives/"+ derivativeId +"/PriceLists", 'Error getting Pricelists');
        }

        function getDataTypeData(selection) {
            return getData("http://localhost:50214/api/v0/derivatives/" + selection.derivative.derivativeId + "/pricelists/" + selection.pricelist.priceListId + "/" + selection.dataType.val, 'Error getting data');
        }

        //******* PRIVATE METHODS ********************
        function getData(url, error) {

            var string = "user:password";
            var encodedString = btoa(string);

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': "Basic dXNlcjpwYXNzd29yZA=="
                }
            })
            .then(function (response) {
                console.log(response.data);
                return response.data;
            })
            .catch(function (errResponse) {
                if (typeof errResponse.data == 'object') {
                    logger.error(errResponse.data, 'Data Error', error + ':\n' + errResponse.data.error);
                }
                else {
                    logger.error(errResponse.data, 'Data Error', error + ':\n' + errResponse.data);
                }
                return;
            });
        }

        function postData(url, data, error) {
            return $http({
                method: 'POST', url: url,
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                if (!response.data) {
                    return true;
                } else {
                    return response.data;
                }
            })
            .catch(function (errResponse) {
                if (typeof errResponse.data == 'object') {
                    logger.error(errResponse.data, 'Data Error', error + ':\n' + errResponse.data.error);
                }
                else {
                    logger.error(errResponse.data, 'Data Error', error + ':\n' + errResponse.data);
                }
                return;
            });
        }

        function putData(url, data, error) {
            return $http({
                method: 'PUT', url: url,
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                if (!response.data) {
                    return true;
                } else {
                    return response.data;
                }

            })
            .catch(function (errResponse) {
                if (typeof errResponse.data == 'object') {
                    logger.error(errResponse.data, 'Data Error', error + ':\n' + errResponse.data.error);
                }
                else {
                    logger.error(errResponse.data, 'Data Error', error + ':\n' + errResponse.data);
                }
                return;
            });
        }

        return {
            getCountries: getCountries,
            getBrands: getBrands,
            getModelRanges: getModelRanges,
            getGenerationMarks: getGenerationMarks,
            getDerivatives: getDerivatives,
            getVehicleData: getVehicleData,
            getPricelistsColours: getPricelistsColours,
            getPriceLists: getPriceLists,
            getDataTypeData: getDataTypeData
        };
    }
})();