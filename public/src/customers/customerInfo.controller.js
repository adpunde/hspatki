(function () {
'use strict';

angular.module('hsp')
.controller('CustomerInfoController', CustomerInfoController);

CustomerInfoController.$inject = ['info', 'CustomerService', '$state'];
function CustomerInfoController (info, CustomerService, $state) {
    var ctrl = this;
    ctrl.info = info;

    ctrl.removeEmptyObjects = function (array) {
        for (var i = 0; i < array.length; i++) {
            console.log('Array' + i, array[i]);
            if (angular.equals(array[i], {}))
                array.splice(i, 1);
        }
    };

    ctrl.Update = function () {
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
        CustomerService.updateCustomerInfo(ctrl.info)
        .then (function (tin) {
            alert('Data uploaded successfully !');
            $state.go('customerLogin');
        })
        .catch (function (error) {
            alert('Error updating database: ' + error.message);
            $state.go('customerLogin');
        });
    };

    ctrl.empty = function (prop) {
        if (ctrl.info[prop]) {
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
