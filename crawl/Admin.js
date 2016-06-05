/**
 * Created by Vlad on 4/29/2016.
 */
///<reference path="../js/base.ts"/>
///<reference path="AdminBackbone.ts"/>
var myapp;
(function (myapp) {
    var Main = (function () {
        function Main(opt) {
            var _this = this;
            for (var str in opt) {
                this[str] = opt[str];
            }
            this.$btnSave = $('#btn-save').click(function () {
                _this.saveData();
            });
            this.$btnDel = $('#btnDelete').click(function () {
                _this.onDeleteClick();
            });
            this.$btnEdit = $('#btnEdit').click(function () {
                _this.onEditClick();
            });
            var plus = $('#btn-plus').click(function () {
                if (_this.$fileInput) {
                    _this.$fileInput.remove();
                    _this.$fileInput = null;
                    return;
                }
                var input = $('<input type="file">').appendTo(plus.parent()).change(function () {
                    var el = input.get(0);
                    var files = el.files;
                    var file = files[0];
                    var form = new FormData();
                    form.append('myfile', file);
                    $.ajax({
                        url: _this.url_upload_temp,
                        type: 'POST',
                        dataType: 'json',
                        data: form,
                        cache: false,
                        contentType: false,
                        processData: false
                    }).done(function (res) {
                        //console.log(res);
                        $.get(_this.url_get_excel, { filename: res.result }).done(function (res) {
                            _this.SetData(res);
                        });
                        // this.onData(res);
                    });
                    input.remove();
                    _this.$fileInput = null;
                });
                _this.$fileInput = input;
            });
        }
        Main.prototype.InitTable = function () {
            var collection = new Table.AllPersonCollection({});
            var tableView = new Table.AllPersonView({ collection: collection });
            this.collection = collection;
        };
        Main.prototype.loadData = function () {
            this.collection.fetch({ url: this.url_data, data: { username: this.username } });
        };
        Main.prototype.SetData = function (res) {
            console.log(res);
            this.collection.set(res);
        };
        Main.prototype.saveData = function () {
            var _this = this;
            if (confirm('You want to save a new data file?')) {
                var data = this.collection.toJSON();
                $.post(this.url_data + '?username=' + this.username, JSON.stringify(data)).done(function (res) {
                    if (res.success == 'success') {
                        alert('New data was saved on server');
                        _this.loadData();
                    }
                    else
                        alert('Error save data');
                });
            }
        };
        Main.prototype.onDeleteClick = function () {
            if (confirm('Do you want to delete?')) {
                this.collection.setDestroy();
            }
            else {
            }
        };
        Main.prototype.onEditClick = function () {
            this.collection.setEditable();
        };
        return Main;
    }());
    myapp.Main = Main;
})(myapp || (myapp = {}));
$(document).ready(function () {
    var options = {
        url_data: 'crawl/crawl.php',
        username: 'myname'
    };
    var app = new myapp.Main(options);
    app.InitTable();
    app.loadData();
});
//# sourceMappingURL=Admin.js.map