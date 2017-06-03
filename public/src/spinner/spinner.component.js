(function() {
'use strict';

angular.module('Spinner')
.component('spinner', {
    templateUrl: 'src/spinner/spinner.template.html',
    controller: SpinnerController
});

SpinnerController.$inject = [ '$rootScope' ];
function SpinnerController($rootScope) {
    var $ctrl = this;

    var cancelListener = $rootScope.$on('spinner:show', function (event, data) {
        console.log('event: ', event);
        console.log('data: ', data);

        if (data.on) {
            $ctrl.showSpinner = true;
        }
        else {
            $ctrl.showSpinner = false;
        }
    });

    // Deregsiter the listener on rootScope
    $ctrl.$onDestroy = function() {
        cancelListener();
    };
};

})();
