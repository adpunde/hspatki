(function () {
'use strict';

angular.module('hsp')
.controller('TransactionsController', TransactionsController);

function TransactionsController () {
    var $ctrl = this;
    $ctrl.contacts = contactObj.contacts;
    $ctrl.transactions = transObj.transactions;
    $ctrl.filtered = [];
    $ctrl.transName = '';
    $ctrl.search = search;
    $ctrl.search();
    //console.log($ctrl.transname);
    //console.log($ctrl.transactions);
};

function search() {
    var $ctrl = this;
    var fltContacts = [];
    $ctrl.filtered = [];

    var searchString = $ctrl.transName;
    if (searchString) {
        searchString = searchString.toLowerCase();
        angular.forEach($ctrl.contacts, function (contact) {
            if (contact.dealerName.toLowerCase().indexOf(searchString) !== -1) {
                var obj = {};
                obj.dealerName = contact.dealerName;
                obj.tin = contact.tin;
                fltContacts.push(obj);
            }
        });
        console.log(fltContacts);
    }

    if (!searchString) {
        $ctrl.filtered = $ctrl.transactions;
        angular.forEach($ctrl.filtered, function (trans) {
            angular.forEach($ctrl.contacts, function (contact) {
                if (contact.tin === trans.tin) {
                    trans.dealerName = contact.dealerName;
                }
            });
        });
    } else {
        angular.forEach($ctrl.transactions, function (trans) {
            angular.forEach(fltContacts, function (contact) {
                if (contact.tin === trans.tin) {
                    var obj = trans;
                    obj.dealerName = contact.dealerName;
                    $ctrl.filtered.push(obj);
                }
            });
        });
    }

    console.log($ctrl.filtered);
};

})();
