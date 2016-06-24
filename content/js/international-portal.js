(function () {
    'use strict';

    angular.module('internationalPortal.showcase', [])
    

})();
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
(function () {
    'use strict';

    angular
        .module('internationalPortal.showcase')
        .controller('valuationsCtrl', valuationsCtrl);

    valuationsCtrl.$inject = ['dataService'];

    function valuationsCtrl(dataService) {
        var vm = this;
        
        vm.test = "Valuations";

    }


})();
(function () {
    'use strict';

    angular
           .module('internationalPortal.showcase')
           .directive('jsonTree', jsonTree);

    function jsonTree() {
        return {
            restrict: 'E',
            scope: {
                jsonTreeData: '='
            },
            link: function (scope, element, attrs) {

                scope.dataType = null;
                scope.dataTypeChildren = 0;

                if (check.array(scope.jsonTreeData)) {
                    scope.dataType = "array";
                }
                if (check.object(scope.jsonTreeData)) {
                    scope.dataType = "object";
                }
                if (check.string(scope.jsonTreeData)) {
                    scope.dataType = "string";
                }
                if (check.number(scope.jsonTreeData)) {
                    scope.dataType = "number";
                }
                if (scope.dataType == null) {
                    scope.dataType = "object";
                }

                scope.hasChildren = function (val) {
                    if(check.array(val)){
                        return true;
                    }else{
                        return false;
                    }
                }

                scope.isHeader = function (val) {
                    if (check.array(val) || check.object(val)) {
                        return true;
                    } else {
                        return false;
                    }
                }

            },
            templateUrl: "content/app/showcase/jsonTree.directive.view.html"
        };
    }
})();


(function () {
    'use strict';

    angular.module('toastr', [])
      .factory('toastr', toastr);

    toastr.$inject = ['$animate', '$injector', '$document', '$rootScope', '$sce', 'toastrConfig', '$q'];

    function toastr($animate, $injector, $document, $rootScope, $sce, toastrConfig, $q) {
        var container;
        var index = 0;
        var toasts = [];

        var previousToastMessage = '';
        var openToasts = {};

        var containerDefer = $q.defer();

        var toast = {
            active: active,
            clear: clear,
            error: error,
            info: info,
            remove: remove,
            success: success,
            warning: warning
        };

        return toast;

        /* Public API */
        function active() {
            return toasts.length;
        }

        function clear(toast) {
            // Bit of a hack, I will remove this soon with a BC
            if (arguments.length === 1 && !toast) { return; }

            if (toast) {
                remove(toast.toastId);
            } else {
                for (var i = 0; i < toasts.length; i++) {
                    remove(toasts[i].toastId);
                }
            }
        }

        function error(message, title, optionsOverride) {
            var type = _getOptions().iconClasses.error;
            return _buildNotification(type, message, title, optionsOverride);
        }

        function info(message, title, optionsOverride) {
            var type = _getOptions().iconClasses.info;
            return _buildNotification(type, message, title, optionsOverride);
        }

        function success(message, title, optionsOverride) {
            var type = _getOptions().iconClasses.success;
            return _buildNotification(type, message, title, optionsOverride);
        }

        function warning(message, title, optionsOverride) {
            var type = _getOptions().iconClasses.warning;
            return _buildNotification(type, message, title, optionsOverride);
        }

        function remove(toastId, wasClicked) {
            var toast = findToast(toastId);

            if (toast && !toast.deleting) { // Avoid clicking when fading out
                toast.deleting = true;
                toast.isOpened = false;
                $animate.leave(toast.el).then(function () {
                    if (toast.scope.options.onHidden) {
                        toast.scope.options.onHidden(!!wasClicked, toast);
                    }
                    toast.scope.$destroy();
                    var index = toasts.indexOf(toast);
                    delete openToasts[toast.scope.message];
                    toasts.splice(index, 1);
                    var maxOpened = toastrConfig.maxOpened;
                    if (maxOpened && toasts.length >= maxOpened) {
                        toasts[maxOpened - 1].open.resolve();
                    }
                    if (lastToast()) {
                        container.remove();
                        container = null;
                        containerDefer = $q.defer();
                    }
                });
            }

            function findToast(toastId) {
                for (var i = 0; i < toasts.length; i++) {
                    if (toasts[i].toastId === toastId) {
                        return toasts[i];
                    }
                }
            }

            function lastToast() {
                return !toasts.length;
            }
        }

        /* Internal functions */
        function _buildNotification(type, message, title, optionsOverride) {
            if (angular.isObject(title)) {
                optionsOverride = title;
                title = null;
            }

            return _notify({
                iconClass: type,
                message: message,
                optionsOverride: optionsOverride,
                title: title
            });
        }

        function _getOptions() {
            return angular.extend({}, toastrConfig);
        }

        function _createOrGetContainer(options) {
            if (container) { return containerDefer.promise; }

            container = angular.element('<div></div>');
            container.attr('id', options.containerId);
            container.addClass(options.positionClass);
            container.css({ 'pointer-events': 'auto' });

            var target = angular.element(document.querySelector(options.target));

            if (!target || !target.length) {
                throw 'Target for toasts doesn\'t exist';
            }

            $animate.enter(container, target).then(function () {
                containerDefer.resolve();
            });

            return containerDefer.promise;
        }

        function _notify(map) {
            var options = _getOptions();

            if (shouldExit()) { return; }

            var newToast = createToast();

            toasts.push(newToast);

            if (ifMaxOpenedAndAutoDismiss()) {
                var oldToasts = toasts.slice(0, (toasts.length - options.maxOpened));
                for (var i = 0, len = oldToasts.length; i < len; i++) {
                    remove(oldToasts[i].toastId);
                }
            }

            if (maxOpenedNotReached()) {
                newToast.open.resolve();
            }

            newToast.open.promise.then(function () {
                _createOrGetContainer(options).then(function () {
                    newToast.isOpened = true;
                    if (options.newestOnTop) {
                        $animate.enter(newToast.el, container).then(function () {
                            newToast.scope.init();
                        });
                    } else {
                        var sibling = container[0].lastChild ? angular.element(container[0].lastChild) : null;
                        $animate.enter(newToast.el, container, sibling).then(function () {
                            newToast.scope.init();
                        });
                    }
                });
            });

            return newToast;

            function ifMaxOpenedAndAutoDismiss() {
                return options.autoDismiss && options.maxOpened && toasts.length > options.maxOpened;
            }

            function createScope(toast, map, options) {
                if (options.allowHtml) {
                    toast.scope.allowHtml = true;
                    toast.scope.title = $sce.trustAsHtml(map.title);
                    toast.scope.message = $sce.trustAsHtml(map.message);
                } else {
                    toast.scope.title = map.title;
                    toast.scope.message = map.message;
                }

                toast.scope.toastType = toast.iconClass;
                toast.scope.toastId = toast.toastId;
                toast.scope.extraData = options.extraData;

                toast.scope.options = {
                    extendedTimeOut: options.extendedTimeOut,
                    messageClass: options.messageClass,
                    onHidden: options.onHidden,
                    onShown: generateEvent('onShown'),
                    onTap: generateEvent('onTap'),
                    progressBar: options.progressBar,
                    tapToDismiss: options.tapToDismiss,
                    timeOut: options.timeOut,
                    titleClass: options.titleClass,
                    toastClass: options.toastClass
                };

                if (options.closeButton) {
                    toast.scope.options.closeHtml = options.closeHtml;
                }

                function generateEvent(event) {
                    if (options[event]) {
                        return function () {
                            options[event](toast);
                        };
                    }
                }
            }

            function createToast() {
                var newToast = {
                    toastId: index++,
                    isOpened: false,
                    scope: $rootScope.$new(),
                    open: $q.defer()
                };
                newToast.iconClass = map.iconClass;
                if (map.optionsOverride) {
                    angular.extend(options, cleanOptionsOverride(map.optionsOverride));
                    newToast.iconClass = map.optionsOverride.iconClass || newToast.iconClass;
                }

                createScope(newToast, map, options);

                newToast.el = createToastEl(newToast.scope);

                return newToast;

                function cleanOptionsOverride(options) {
                    var badOptions = ['containerId', 'iconClasses', 'maxOpened', 'newestOnTop',
                                      'positionClass', 'preventDuplicates', 'preventOpenDuplicates', 'templates'];
                    for (var i = 0, l = badOptions.length; i < l; i++) {
                        delete options[badOptions[i]];
                    }

                    return options;
                }
            }

            function createToastEl(scope) {
                var angularDomEl = angular.element('<div toast></div>'),
                  $compile = $injector.get('$compile');
                return $compile(angularDomEl)(scope);
            }

            function maxOpenedNotReached() {
                return options.maxOpened && toasts.length <= options.maxOpened || !options.maxOpened;
            }

            function shouldExit() {
                var isDuplicateOfLast = options.preventDuplicates && map.message === previousToastMessage;
                var isDuplicateOpen = options.preventOpenDuplicates && openToasts[map.message];

                if (isDuplicateOfLast || isDuplicateOpen) {
                    return true;
                }

                previousToastMessage = map.message;
                openToasts[map.message] = true;

                return false;
            }
        }
    }
}());

(function () {
    'use strict';

    angular.module('toastr')
      .constant('toastrConfig', {
          allowHtml: false,
          autoDismiss: false,
          closeButton: false,
          closeHtml: '<button>&times;</button>',
          containerId: 'toast-container',
          extendedTimeOut: 1000,
          iconClasses: {
              error: 'toast-error',
              info: 'toast-info',
              success: 'toast-success',
              warning: 'toast-warning'
          },
          maxOpened: 0,
          messageClass: 'toast-message',
          newestOnTop: true,
          onHidden: null,
          onShown: null,
          onTap: null,
          positionClass: 'toast-top-right',
          preventDuplicates: false,
          preventOpenDuplicates: false,
          progressBar: false,
          tapToDismiss: true,
          target: 'body',
          templates: {
              toast: 'directives/toast/toast.html',
              progressbar: 'directives/progressbar/progressbar.html'
          },
          timeOut: 5000,
          titleClass: 'toast-title',
          toastClass: 'toast'
      });
}());

(function () {
    'use strict';

    angular.module('toastr')
      .directive('progressBar', progressBar);

    progressBar.$inject = ['toastrConfig'];

    function progressBar(toastrConfig) {
        return {
            replace: true,
            require: '^toast',
            templateUrl: function () {
                return toastrConfig.templates.progressbar;
            },
            link: linkFunction
        };

        function linkFunction(scope, element, attrs, toastCtrl) {
            var intervalId, currentTimeOut, hideTime;

            toastCtrl.progressBar = scope;

            scope.start = function (duration) {
                if (intervalId) {
                    clearInterval(intervalId);
                }

                currentTimeOut = parseFloat(duration);
                hideTime = new Date().getTime() + currentTimeOut;
                intervalId = setInterval(updateProgress, 10);
            };

            scope.stop = function () {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };

            function updateProgress() {
                var percentage = ((hideTime - (new Date().getTime())) / currentTimeOut) * 100;
                element.css('width', percentage + '%');
            }

            scope.$on('$destroy', function () {
                // Failsafe stop
                clearInterval(intervalId);
            });
        }
    }
}());

(function () {
    'use strict';

    angular.module('toastr')
      .controller('ToastController', ToastController);

    function ToastController() {
        this.progressBar = null;

        this.startProgressBar = function (duration) {
            if (this.progressBar) {
                this.progressBar.start(duration);
            }
        };

        this.stopProgressBar = function () {
            if (this.progressBar) {
                this.progressBar.stop();
            }
        };
    }
}());

(function () {
    'use strict';

    angular.module('toastr')
      .directive('toast', toast);

    toast.$inject = ['$injector', '$interval', 'toastrConfig', 'toastr'];

    function toast($injector, $interval, toastrConfig, toastr) {
        return {
            replace: true,
            templateUrl: function () {
                return toastrConfig.templates.toast;
            },
            controller: 'ToastController',
            link: toastLinkFunction
        };

        function toastLinkFunction(scope, element, attrs, toastCtrl) {
            var timeout;

            scope.toastClass = scope.options.toastClass;
            scope.titleClass = scope.options.titleClass;
            scope.messageClass = scope.options.messageClass;
            scope.progressBar = scope.options.progressBar;

            if (wantsCloseButton()) {
                var button = angular.element(scope.options.closeHtml),
                  $compile = $injector.get('$compile');
                button.addClass('toast-close-button');
                button.attr('ng-click', 'close(true, $event)');
                $compile(button)(scope);
                element.prepend(button);
            }

            scope.init = function () {
                if (scope.options.timeOut) {
                    timeout = createTimeout(scope.options.timeOut);
                }
                if (scope.options.onShown) {
                    scope.options.onShown();
                }
            };

            element.on('mouseenter', function () {
                hideAndStopProgressBar();
                if (timeout) {
                    $interval.cancel(timeout);
                }
            });

            scope.tapToast = function () {
                if (angular.isFunction(scope.options.onTap)) {
                    scope.options.onTap();
                }
                if (scope.options.tapToDismiss) {
                    scope.close(true);
                }
            };

            scope.close = function (wasClicked, $event) {
                if ($event && angular.isFunction($event.stopPropagation)) {
                    $event.stopPropagation();
                }
                toastr.remove(scope.toastId, wasClicked);
            };

            element.on('mouseleave', function () {
                if (scope.options.timeOut === 0 && scope.options.extendedTimeOut === 0) { return; }
                scope.$apply(function () {
                    scope.progressBar = scope.options.progressBar;
                });
                timeout = createTimeout(scope.options.extendedTimeOut);
            });

            function createTimeout(time) {
                toastCtrl.startProgressBar(time);
                return $interval(function () {
                    toastCtrl.stopProgressBar();
                    toastr.remove(scope.toastId);
                }, time, 1);
            }

            function hideAndStopProgressBar() {
                scope.progressBar = false;
                toastCtrl.stopProgressBar();
            }

            function wantsCloseButton() {
                return scope.options.closeHtml;
            }
        }
    }
}());

angular.module("toastr").run(["$templateCache", function ($templateCache) {
    $templateCache.put("directives/progressbar/progressbar.html", "<div class=\"toast-progress\"></div>\n");
    $templateCache.put("directives/toast/toast.html", "<div class=\"{{toastClass}} {{toastType}}\" ng-click=\"tapToast()\">\n  <div ng-switch on=\"allowHtml\">\n    <div ng-switch-default ng-if=\"title\" class=\"{{titleClass}}\" aria-label=\"{{title}}\">{{title}}</div>\n    <div ng-switch-default class=\"{{messageClass}}\" aria-label=\"{{message}}\">{{message}}</div>\n    <div ng-switch-when=\"true\" ng-if=\"title\" class=\"{{titleClass}}\" ng-bind-html=\"title\"></div>\n    <div ng-switch-when=\"true\" class=\"{{messageClass}}\" ng-bind-html=\"message\"></div>\n  </div>\n  <progress-bar ng-if=\"progressBar\"></progress-bar>\n</div>\n");
}]);
(function () {
    'use strict';

    angular.module('internationalPortal.core', [

        // Third parties                        
        //'angular-loading-bar',
        'toastr',
        'ngRoute',
        'jsonFormatter'

        //// Angular addon
        //'ngSanitize',
        //'ngAnimate',
        //'ui.bootstrap'
    ]);

})();
(function () {
    'use strict';

    angular
        .module('internationalPortal.core')
        .filter('titleCase', function () {
            return function (input) {
                //console.log(input);
                //input = input || '';
                if (typeof input == "string") {
                    var result = input.replace(/([A-Z])/g, " $1");
                    var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                    return finalResult;
                } else {
                    return input;
                }

            };
        })
})();

(function () {
    'use strict';

    angular
        .module('internationalPortal.core')
        .factory('logger', logger);

    logger.$inject = ['toastr'];

    function logger(toastr) {
        function error(technicalData, title, message) {
            toastr.error(message, title, { timeOut: 10000 });

            if (!window.console) {
                return;
            }

            console.log('technical error details:');
            console.log(technicalData);
        }

        function info(title, message) {
            toastr.info(message, title);
        }

        function success(title, message) {
            toastr.success(message, title);
        }

        function warning(title, message) {
            toastr.warning(message, title);
        }

        return {
            error: error,
            info: info,
            success: success,
            warning: warning
        };
    }
}());
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
(function () {
    'use strict';
    //var type = require('type-detect');
    var internationalPortal = angular.module('internationalPortal', [

        'internationalPortal.core',
        // application
        'internationalPortal.showcase'
    ])
        .config(function ($routeProvider, $httpProvider) {
            $routeProvider.
            when('/', {
                templateUrl: '/views/login.html'
            }).
            when('/dashboard', {
                templateUrl: '/views/dashboard.html'
            }).
            when('/vehicle-data', {
                templateUrl: '/views/vehicle-data.html',
                controller: 'vehicleDataCtrl',
                controllerAs: 'vm'
            }).
            otherwise({
                redirectTo: '/dashboard'
            });


        })

    /*
    .run(['$http', function ($http) {
        $http.defaults.headers.common['Authorization'] = 'Basic user:password';
    }]);
    */

})();



