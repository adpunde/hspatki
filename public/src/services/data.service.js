(function () {
'use strict';

angular.module('hsp')
.service('DataService', DataService);

DataService.$inject = ['ExcelSheetName'];
function DataService (ExcelSheetName) {
    var service = this;

    service.writeCSVFile = function (data, filename) {
        console.log('Data', data);
        var fieldTitles = ['tin', 'pan', 'stn', 'scheme', 'gstin', 'arn',
            'name', 'address', 'state', 'pincode',
            'personName', 'designation', 'mobile', 'email'
        ];

        var i, j;
        var goodsIndex = 0;
        var servicesIndex = 0;
        var placesIndex = 0;

        var CheckObjField = function (obj, field) {
            if (obj[field])
                return obj[field];
            return '';
        };

        var CheckArrayField = function (array, index, field) {
            console.log(array);
            if (array && array[index] && array[index].field)
                return array[index].field;
            return '';
        };

        data.forEach(function (row) {
            if (row.goods && row.goods.length > 0) {
                if (goodsIndex < row.goods.length)
                    goodsIndex = row.goods.length;
            }
            if (row.services && row.services.length > 0) {
                if (servicesIndex < row.services.length)
                    servicesIndex = row.services.length;
            }
            if (row.places && row.places.length > 0) {
                if (placesIndex < row.places.length)
                    placesIndex = row.places.length;
            }
        });

        var lines = '';
        data.forEach(function (row) {
            var fields = [];
            for (i = 0; i < fieldTitles.length; i++) {
                fields.push(CheckObjField(row, fieldTitles[i]));
            }

            var goodsFields = [];
            for (j = 0; j < goodsIndex; j++) {
                goodsFields.push(CheckArrayField(row.goods, j, name));
                goodsFields.push(CheckArrayField(row.goods, j, hsn));
                console.log(goodsFields);
            }

            var servicesFields = [];
            for (j = 0; j < servicesIndex; j++) {
                servicesFields.push(CheckArrayField(row.services, j, name));
                servicesFields.push(CheckArrayField(row.services, j, sac));
            }

            var placesFields = [];
            for (j = 0; j < placesIndex; j++) {
                placesFields.push(CheckArrayField(row.places, j, name));
                placesFields.push(CheckArrayField(row.places, j, address));
                placesFields.push(CheckArrayField(row.places, j, state));
                placesFields.push(CheckArrayField(row.places, j, pincode));
            }

            var newRow = fields.join(',') + ',' +
                goodsFields.join(',') + ',' +
                servicesFields.join(',') + ',' +
                placesFields.join(',');

            lines += newRow;
            lines += "\n";
        });

        for (j = 0; j < goodsIndex; j++) {
            fieldTitles.push('goodsname' + j);
            fieldTitles.push('goodshsn' + j);
        }

        for (j = 0; j < servicesIndex; j++) {
            fieldTitles.push('servicesname' + j);
            fieldTitles.push('servicessac' + j);
        }

        for (j = 0; j < placesIndex; j++) {
            fieldTitles.push('placesname' + j);
            fieldTitles.push('placesaddress' + j);
            fieldTitles.push('placesstate' + j);
            fieldTitles.push('placespincode' + j);
        }

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
