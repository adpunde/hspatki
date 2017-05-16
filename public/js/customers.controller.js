(function () {
'use strict';

angular.module('hsp')
.controller('CustomersController', CustomersController);

function CustomersController () {
    var $ctrl = this;
    $ctrl.customers = contactObj;
    //console.log($ctrl.customers);
};

})();
