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
            service.writeExcelFile(data, filename + '.xlsx', done);
        }
    };

    service.writeJSONFile = function (data, filename, done) {
        var fileData = JSON.stringify(data, null, 4);
        var blob = new Blob([fileData], { type: 'application/json' });
        saveAs(blob, filename);
        done();
    };

    service.writeExcelFile = function (data, filename, done) {

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

        var fieldTitles = ['tin', 'pan', 'stn', 'scheme', 'gstin', 'arn',
            'name', 'address', 'state', 'pincode',
            'personName', 'designation', 'mobile', 'email'
        ];

        var maxGoodsIndex = 0;
        var maxServicesIndex = 0;
        var maxPlacesIndex = 0;

        CalculateMaxIndices(data);

        var spreadJSON = function (data) {
            var flatArray = [];
            data.forEach(function (row) {
                var flatObj = {};

                for (var j = 0; j < fieldTitles.length; j++) {
                    var field = fieldTitles[j];
                    flatObj[field] = CheckObjField(row, field);
                }

                for (var j = 0; j < maxGoodsIndex; j++) {
                    flatObj['gname' + j] = CheckArrayField(row, 'goods', j, 'name');
                    flatObj['gcode' + j] = CheckArrayField(row, 'goods', j, 'hsn');
                }

                for (var j = 0; j < maxServicesIndex; j++) {
                    flatObj['sname' + j] = CheckArrayField(row, 'services', j, 'name');
                    flatObj['scode' + j] = CheckArrayField(row, 'services', j, 'sac');
                }

                for (var j = 0; j < maxPlacesIndex; j++) {
                    flatObj['pname' + j] = CheckArrayField(row, 'places', j, 'name');
                    flatObj['paddress' + j] = CheckArrayField(row, 'places', j, 'address');
                    flatObj['pstate' + j] = CheckArrayField(row, 'places', j, 'state');
                    flatObj['pcode' + j] = CheckArrayField(row, 'places', j, 'pincode');
                }

                flatArray.push(flatObj);
            });

            return flatArray;
        };

        var flatArray = spreadJSON(data);

        var workbook = { SheetNames: [], Sheets: {} };
        var sheetName = 'customers';
        var sheet = this.json_to_sheet(flatArray);

        XLSX.utils.book_append_sheet(workbook, sheet, sheetName);

        var WBOptions = { bookType: 'xlsx', bookSST: false, type: 'binary' };
        var WBBinary = XLSX.write(workbook, WBOptions);

        var ToBinary = function (s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i)
                view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };

        saveAs(new Blob([ToBinary (WBBinary)],
            { type: "application/octet-stream" }), filename);

        done();
    }

    service.json_to_sheet = function(js) {
        var ws = {};
        var range = ({s: {c: 0, r: 0}, e: {c: 0, r: js.length}});
        var hdr = [], C = 0;

        for(var R = 0; R !== js.length; ++R) {
            Object.keys(js[R]).forEach(function (key) {
                if (hdr.indexOf(key) === -1)
                    hdr.push(key);
                C = hdr.indexOf(key);
                var v = js[R][key];
                var t = 'z';
                if (v)
                    t = 's';
                ws[XLSX.utils.encode_cell({c: C, r: R + 1})] = {t: t, v: v};
            });
        }

        range.e.c = hdr.length - 1;
        for(C = 0; C < hdr.length; ++C)
            ws[XLSX.utils.encode_col(C) + "1"] = {t: 's', v: hdr[C]};
        ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
    };

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

// var AppendFieldTitles = function (fieldTitles, maxGoodsIndex,
//         maxServicesIndex, maxPlacesIndex) {
//     // console.log(maxGoodsIndex, maxServicesIndex, maxPlacesIndex);
//     var newFieldTitles = Object.assign({}, fieldTitles);
//
//     for (var j = 1; j <= maxGoodsIndex; j++) {
//         newFieldTitles.push('gname' + j);
//         newFieldTitles.push('gcode' + j);
//     }
//
//     for (var j = 1; j <= maxServicesIndex; j++) {
//         newFieldTitles.push('sname' + j);
//         newFieldTitles.push('scode' + j);
//     }
//
//     for (var j = 1; j <= maxPlacesIndex; j++) {
//         newFieldTitles.push('pname' + j);
//         newFieldTitles.push('paddress' + j);
//         newFieldTitles.push('pstate' + j);
//         newFieldTitles.push('pcode' + j);
//     }
//
//     return newFieldTitles;
// };
