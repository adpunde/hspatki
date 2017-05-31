(function () {
'use strict';

angular.module('hsp')
.service('DataService', DataService);

DataService.$inject = ['ExcelSheetName'];
function DataService (ExcelSheetName) {
    var service = this;

    service.writeFile = function (data, filename, type, done) {
        if (type === 'json') {
            service.writeJSONFile(data, filename + '.json', done);
        }
        else {
            service.writeCSVFile(data, filename + '.csv', done);
        }
    };

    service.writeJSONFile = function (data, filename, done) {
        var fileData = JSON.stringify(data, null, 4);
        var blob = new Blob([fileData], { type: 'application/json' });
        saveAs(blob, filename);
        done();
    };

    service.writeCSVFile = function (data, filename, done) {
        var CheckObjField = function (obj, field) {
            if (obj[field])
                return obj[field];
            return '';
        };

        var CheckArrayField = function (obj, array, index, field) {
            if (obj[array] && obj[array][index])
                return obj[array][index][field];
            return '';
        };

        var CalculateMaxIndices = function (data) {
            data.forEach(function (row) {
                if (row.goods && row.goods.length > 0) {
                    if (maxGoodsIndex < row.goods.length)
                        maxGoodsIndex = row.goods.length;
                }
                if (row.services && row.services.length > 0) {
                    if (maxServicesIndex < row.services.length)
                        maxServicesIndex = row.services.length;
                }
                if (row.places && row.places.length > 0) {
                    if (maxPlacesIndex < row.places.length)
                        maxPlacesIndex = row.places.length;
                }
            });
        };

        var AppendFieldTitles = function (fieldTitles, maxGoodsIndex,
                maxServicesIndex, maxPlacesIndex) {
            for (var j = 1; j <= maxGoodsIndex; j++) {
                fieldTitles.push('gname' + j);
                fieldTitles.push('gcode' + j);
            }

            for (var j = 1; j <= maxServicesIndex; j++) {
                fieldTitles.push('sname' + j);
                fieldTitles.push('scode' + j);
            }

            for (var j = 1; j <= maxPlacesIndex; j++) {
                fieldTitles.push('pname' + j);
                fieldTitles.push('paddress' + j);
                fieldTitles.push('pstate' + j);
                fieldTitles.push('pcode' + j);
            }
        };

        var fieldTitles = ['tin', 'pan', 'stn', 'scheme', 'gstin', 'arn',
            'name', 'address', 'state', 'pincode',
            'personName', 'designation', 'mobile', 'email'
        ];

        var maxGoodsIndex = 0;
        var maxServicesIndex = 0;
        var maxPlacesIndex = 0;

        CalculateMaxIndices(data);
        console.log(maxGoodsIndex, maxServicesIndex, maxPlacesIndex);

        var lines = '';
        data.forEach(function (row) {
            var fields = [];
            for (var j = 0; j < fieldTitles.length; j++) {
                fields.push(CheckObjField(row, fieldTitles[j]));
            }

            var goodsFields = [];
            for (var j = 0; j < maxGoodsIndex; j++) {
                goodsFields.push(CheckArrayField(row, 'goods', j, 'name'));
                goodsFields.push(CheckArrayField(row, 'goods', j, 'hsn'));
            }

            var servicesFields = [];
            for (var j = 0; j < maxServicesIndex; j++) {
                servicesFields.push(CheckArrayField(row, 'services', j, 'name'));
                servicesFields.push(CheckArrayField(row, 'services', j, 'sac'));
            }

            var placesFields = [];
            for (var j = 0; j < maxPlacesIndex; j++) {
                placesFields.push(CheckArrayField(row, 'places', j, 'name'));
                placesFields.push(CheckArrayField(row, 'places', j, 'address'));
                placesFields.push(CheckArrayField(row, 'places', j, 'state'));
                placesFields.push(CheckArrayField(row, 'places', j, 'pincode'));
            }

            var newRow = fields.join(',') + ',' +
                goodsFields.join(',') + ',' +
                servicesFields.join(',') + ',' +
                placesFields.join(',');

            console.log(newRow);

            lines = lines + newRow + "\n";
        });

        AppendFieldTitles(fieldTitles, maxGoodsIndex, maxServicesIndex, maxPlacesIndex);

        var firstRow = fieldTitles.join(',');
        var fileData = firstRow + "\n" + lines;

        var blob = new Blob([fileData], { type: 'text/csv' });
        saveAs(blob, filename);
        done();
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
                if (entry.tin) newEntry.tin = entry.tin.toUpperCase();
                if (entry.pan) newEntry.pan = entry.pan.toUpperCase();
                if (entry.stn) newEntry.stn = entry.stn.toUpperCase();
                if (entry.name) newEntry.name = entry.name;
                if (entry.address) newEntry.address = entry.address;
                newArray.push(newEntry);
            });

            done(null, newArray);
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
