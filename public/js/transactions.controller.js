(function () {
'use strict';

angular.module('hsp')
.controller('TransactionsController', TransactionsController);

function TransactionsController () {
    var $ctrl = this;
    $ctrl.contacts = contactObj;
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
    $ctrl.filtered = [];

    var searchString = $ctrl.transName;
    if (searchString)
        searchString = searchString.toLowerCase();

    angular.forEach($ctrl.transactions, function (trans) {
        var contact = contactObj[trans.tin];
        if (!searchString ||
                contact.dealerName.toLowerCase().indexOf(searchString) !== -1) {
            var obj = trans;
            obj.dealerName = contact.dealerName;
            $ctrl.filtered.push(obj);
        }
    });

    console.log($ctrl.filtered);
};

})();
