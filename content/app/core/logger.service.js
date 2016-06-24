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