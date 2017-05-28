(function () {
'use strict';

angular.module('hsp')
.service('AdminService', AdminService);

AdminService.$inject = ['$http'];
function AdminService ($http) {
    var service = this;

    service.Login = function (username, password) {
        return $http.post('/api/admin/login',
            { "username": username, "password": password },
            {'Content-Type': 'application/x-www-form-urlencoded'}
        )
        .then (function (response) {
            return response.data;
        })
        .catch (function (response) {
            console.log('Error', response.data);
            throw new Error(response.data);
        });
    };

    service.downloadCustomerInfo = function () {
        return $http.get('/api/admin/download')
            .then (function (response) {
                return response.data;
            })
            .catch (function (response) {
                console.log('Error', response.data);
                throw new Error(response.data);
            });
    };

    service.importCustomerInfo = function (array) {
        return $http.post('/api/admin/import', JSON.stringify(array),
            {'Content-Type': 'application/json'}, {'timeout': 5000}
        )
        .then (function (response) {
            return response.data;
        })
        .catch (function (response) {
            console.log('Error', response.data);
            throw new Error(response.data);
        });
    };

    service.deleteCustomerInfo = function () {
        return $http.post('/api/admin/delete', {},
            {'Content-Type': 'application/json'}
        )
        .then (function (response) {
            return response.data;
        })
        .catch (function (response) {
            console.log('Error', response.data);
            throw new Error(response.data);
        });
    };
};

})();
