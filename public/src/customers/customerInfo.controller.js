(function () {
'use strict';

angular.module('hsp')
.controller('CustomerInfoController', CustomerInfoController);

CustomerInfoController.$inject = ['info', 'CustomerService', '$state', '$rootScope'];
function CustomerInfoController (info, CustomerService, $state, $rootScope) {
    var ctrl = this;
    ctrl.info = info;
    ctrl.origInfo = Object.assign({}, info);

    ctrl.Submit = function (stateChange) {
        // Remove empty objects
        var i, array, obj;

        array = ctrl.info.places;
        if (array) {
            for (i = array.length - 1; i >= 0; i--) {
                obj = array[i];
                if (!obj.name && !obj.address && !obj.state && !obj.pincode)
                    array.splice(i, 1);
            }
        }

        array = ctrl.info.goods;
        if (array) {
            for (i = array.length - 1; i >= 0; i--) {
                obj = array[i];
                if (!obj.name && !obj.hsn)
                    array.splice(i, 1);
            }
        }

        array = ctrl.info.services;
        if (array) {
            for (i = array.length - 1; i >= 0; i--) {
                obj = array[i];
                if (!obj.name && !obj.sac)
                    array.splice(i, 1);
            }
        }

        // Make POST request and update customer data
        $rootScope.$broadcast('spinner:show', {on: true});
        CustomerService.updateCustomerInfo(ctrl.info)
        .then (function (tin) {
            alert('Data uploaded successfully !');
            if (stateChange)
                $state.go('customerLogin');
        })
        .catch (function (error) {
            alert('Error updating database: ' + error.message);
        })
        .finally (function () {
            $rootScope.$broadcast('spinner:show', {on: false});
        });
    };

    ctrl.empty = function (prop) {
        if (ctrl.origInfo[prop]) {
            return true;
        }
        return false;
    };

    ctrl.addPlace = function () {
        if (!ctrl.info.places)
            ctrl.info.places = [];
        ctrl.info.places.push({});
    };

    ctrl.addGood = function () {
        if (!ctrl.info.goods)
            ctrl.info.goods = [];
        ctrl.info.goods.push({});
    }

    ctrl.addService = function () {
        if (!ctrl.info.services)
            ctrl.info.services = [];
        ctrl.info.services.push({});
    }

    ctrl.removePlace = function () {
        if (ctrl.info.places)
            ctrl.info.places.pop();
    };

    ctrl.removeGood = function () {
        if (ctrl.info.goods)
            ctrl.info.goods.pop();
    }

    ctrl.removeService = function () {
        if (ctrl.info.services)
            ctrl.info.services.pop();
    }
};

})();
