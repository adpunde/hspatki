(function () {
'use strict';

angular.module('hsp')
.controller('AdminController', AdminController);

function AdminController () {
    var $ctrl = this;
    $ctrl.username = '';
    $ctrl.password = '';

    $ctrl.Login = function () {
        // Send POST request to the server
    }
};

})();
