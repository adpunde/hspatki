(function () {
'use strict';

angular.module('hsp')
.service('DataService', DataService);

DataService.$inject = ['ExcelSheetName'];
function DataService (ExcelSheetName) {
    var service = this;

    service.writeCSVFile = function (data, filename) {
        var fieldTitles = ['tin', 'pan', 'stn', 'scheme', 'gstin', 'arn',
            'name', 'address', 'state', 'pincode',
            'personName', 'designation', 'mobile', 'email'
        ];

        var CheckField = function (array, field) {
            if (array[field])
                return array[field];
            return '';
        };

        var lines = '';
        data.forEach(function (row) {
            var fields = [];
            for (var i = 0; i < fieldTitles.length; i++) {
                fields.push(CheckField(row, fieldTitles[i]));
            }

            var newRow = fields.join(',');
            lines += newRow;
            lines += "\n";
        });

        var firstRow = fieldTitles.join(',');
        var fileData = firstRow + "\n" + lines;

        var blob = new Blob([fileData], { type: 'text/csv' });
        saveAs(blob, filename);
    }

    service.readExcelData = function (filename, done) {

        var reader = new FileReader();
        reader.readAsBinaryString(filename);

        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type : 'binary'});
            var idx = workbook.SheetNames.indexOf(ExcelSheetName);
            if (idx === -1) {
                return done(new Error(ExcelSheetName + 'sheet not found in excel file.'));
            }

            var objArray = XLSX.utils.sheet_to_json(workbook.Sheets[ExcelSheetName]);
            var newArray = [];

            objArray.forEach(function (entry) {
                if (!entry.tin && !entry.pan && !entry.stn) {
                    return done(new Error('Either of TIN/PAN/STN must be available for every row.'));
                }

                var newEntry = {};
                if (entry.tin) newEntry.tin = entry.tin;
                if (entry.pan) newEntry.pan = entry.pan;
                if (entry.stn) newEntry.stn = entry.stn;
                if (entry.name) newEntry.name = entry.name;
                newArray.push(newEntry);

                done(null, newArray);
            });
        };
    }

};

})();
//var array = response.data;

//var blob = new Blob([array], { type: 'application/json' });
//saveAs(blob, "contacts.json");

//var str = '';
//for (var i = 0; i < array.length; i++) {
//    str += array[i].tin + ',' + array[i].dealerName + "\n";
//}
//blob = new Blob([str], { type: 'text/csv' });
//saveAs(blob, "contacts.csv");

// var header = response.headers('content-disposition');
// var parts = header.match(new RegExp(".*filename=\"(.*)\""));
// console.log(header);
// console.log('FileName: ', fileName);
