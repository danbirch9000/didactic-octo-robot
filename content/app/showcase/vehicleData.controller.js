(function () {
    'use strict';

    angular
        .module('internationalPortal.showcase')
        .controller('vehicleDataCtrl', vehicleDataCtrl);

    vehicleDataCtrl.$inject = ['dataService', '$rootScope'];

    function vehicleDataCtrl(dataService, $rootScope) {
        var vm = this;
        vm.getBrands = getBrands;
        vm.getModelRanges = getModelRanges;
        vm.getGenerationMarks = getGenerationMarks;
        vm.getDerivatives = getDerivatives;
        vm.getVehicleData = getVehicleData;
        vm.getPriceLists = getPriceLists;
        vm.selectThisPricelist = selectThisPricelist;
        vm.getDataTypeData = getDataTypeData;
        vm.brands = [];
        vm.modelRanges = [];
        vm.generationMarks = [];
        vm.derivatives = [];
        vm.pricelists = [];
        vm.apiData = null;
        vm.selection = {
            country: null,
            brand: null,
            modelRange: null,
            generationMark: null,
            derivative: null,
            pricelist: null,
            dataType: null
        };
        vm.apiDemoTitle = "";
        activate();

        vm.dataTypes = [
            { "key": "Tech", "val": "Tech" },
            { "key": "Colours", "val": "Colours" },
            { "key": "Equipment", "val": "Equipment" }];

        function activate() {
            vm.apiDemoTitle = "Countries";
            var countries = dataService.getCountries();
            countries.then(function (result) {
                vm.countries = result;
                vm.apiData = angular.copy(result);
            });
        }

        //Get brands for given country
        function getBrands() {
            vm.apiDemoTitle = "Brands";
            vm.selection.brand = null;
            vm.selection.modelRange = null;
            vm.selection.generationMark = null;
            vm.selection.derivative = null;
            vm.selection.pricelist = null;
            vm.selection.dataType = null;
            vm.apiData = null;
            var brands = dataService.getBrands(vm.selection.country.countryCode);
            brands.then(function (result) {
                vm.brands = result;
                vm.apiData = angular.copy(result);
            });
        }
        //Get model ranges for given brand
        function getModelRanges() {
            vm.apiDemoTitle = "Model Ranges";
            vm.selection.modelRange = null;
            vm.selection.generationMark = null;
            vm.selection.derivative = null;
            vm.selection.pricelist = null;
            vm.selection.dataType = null;
            vm.apiData = null;

            var modelRanges = dataService.getModelRanges(vm.selection.brand.brandId);
            modelRanges.then(function (result) {
                vm.modelRanges = result;
                vm.apiData = angular.copy(result);
            });
        }
        //Get generation marks for given model range
        function getGenerationMarks() {
            vm.apiDemoTitle = "Generation Marks";
            vm.selection.generationMark = null;
            vm.selection.derivative = null;
            vm.selection.pricelist = null;
            vm.selection.dataType = null;
            vm.apiData = null;

            var generationMark = dataService.getGenerationMarks(vm.selection.modelRange.modelRangeId);
            generationMark.then(function (result) {
                vm.generationMarks = result;
                vm.apiData = angular.copy(result);
            });
        }
        //Get derivatives for given generation mark
        function getDerivatives() {
            vm.apiDemoTitle = "Derivatives";
            vm.selection.derivative = null;
            vm.selection.pricelist = null;
            vm.selection.dataType = null;
            vm.apiData = null;

            var derivatives = dataService.getDerivatives(vm.selection.generationMark.generationMarkId);
            derivatives.then(function (result) {
                vm.derivatives = result;
                vm.apiData = angular.copy(result);
            });
        }

        function getVehicleData() {
            vm.apiDemoTitle = "Vehicle Data";
            var vehicleData = dataService.getVehicleData(vm.selection.derivative.derivativeId);
            vehicleData.then(function (result) {
                vm.apiData = angular.copy(result);
            });
            getPriceLists();
        }

        function getPriceLists() {
            vm.apiDemoTitle = "Price Lists";
            var pricelist = dataService.getPriceLists(vm.selection.derivative.derivativeId);
            pricelist.then(function (result) {
                vm.pricelists = result;
            });
        }


        function selectThisPricelist() {
            vm.apiData = vm.selection.pricelist;
        }

        function getDataTypeData() {
            vm.apiDemoTitle = vm.selection.dataType.key + " Data";
            var getData = dataService.getDataTypeData(vm.selection);
            getData.then(function (result) {
                vm.apiData = result;
            });

        }


    }


})();