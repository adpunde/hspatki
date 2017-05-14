(function () {
'use strict';

angular.module('hsp')
.component('customers', {
    templateUrl: 'views/customer.html',
    bindings: {
        customer: '<',
        index: '<'
    }
});

})();
