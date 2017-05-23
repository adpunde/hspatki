(function () {
'use strict';

angular.module('hsp')
.service('CustomerService', CustomerService);

CustomerService.$inject = ['$http'];
function CustomerService ($http) {
    var service = this;
    var info = {};

    service.getCustomerInfo = function (tin) {
        return $http.get('/api/customers', {params: {"tin": tin}})
            .then (function (response) {
                return response.data;
            })
            .catch (function (response) {
                console.log('Error', response);
                return null;
            });
    };

    service.updateCustomerInfo = function (info) {
        return $http.post('/api/customers/update',
            JSON.stringify(info), {'Content-type': 'application/json'})
            .then (function (response) {
                return response.data;
            })
            .catch (function (response) {
                console.log('Error', response);
                return null;
            });
    };

};

})();
