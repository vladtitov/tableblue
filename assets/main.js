var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var iconsAdmin;
(function (iconsAdmin) {
    var VOIcon = (function () {
        function VOIcon() {
        }
        return VOIcon;
    }());
    iconsAdmin.VOIcon = VOIcon;
    var RowModel = (function (_super) {
        __extends(RowModel, _super);
        function RowModel(obj) {
            _super.call(this, obj);
        }
        RowModel.prototype.defaults = function () {
            return {
                id: '',
                icon: '',
                name: '',
                filename: ''
            };
        };
        return RowModel;
    }(Backbone.Model));
    iconsAdmin.RowModel = RowModel;
    var RowView = (function (_super) {
        __extends(RowView, _super);
        function RowView(options) {
            var _this = this;
            _super.call(this, options);
            this.model.on('change', function () { return _this.render(); });
        }
        RowView.prototype.render = function () {
            var _this = this;
            var data = this.model.toJSON();
            this.$el.html(RowView.template(data));
            this.$el.find('.btn').change(function (evt) { return _this.reuploadImage(evt); });
            return this;
        };
        RowView.prototype.uploadFile = function (url) {
            this.model.set('icon', url + '?' + Date.now());
        };
        RowView.prototype.reuploadImage = function (evt) {
            var _this = this;
            var input = evt.target;
            var file = input.files[0];
            var form = new FormData();
            form.append('file', file);
            $.ajax({
                url: 'assets/assets.php?filename=' + this.model.get('filename'),
                type: 'POST',
                dataType: 'json',
                data: form,
                cache: false,
                contentType: false,
                processData: false
            }).done(function (res) {
                if (res.error) {
                    alert(res.error);
                    return;
                }
                else if (res.success == 'success') {
                    _this.uploadFile(res.result);
                }
            }).fail(function (res) {
                console.log('fail', res);
            });
        };
        RowView.template = _.template($('#row-template').html());
        return RowView;
    }(Backbone.View));
    iconsAdmin.RowView = RowView;
    var AllIconCollection = (function (_super) {
        __extends(AllIconCollection, _super);
        function AllIconCollection(options) {
            _super.call(this, options);
            for (var str in options)
                this[str] = options[str];
            this.fetch();
        }
        AllIconCollection.prototype.parse = function (res) {
            return res.assets;
        };
        return AllIconCollection;
    }(Backbone.Collection));
    iconsAdmin.AllIconCollection = AllIconCollection;
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView(options) {
            _super.call(this, options);
            this.options = options;
            this.setElement($('#tablebody'));
            this.collection.bind("add", this.ModelAdded, this);
        }
        TableView.prototype.ModelAdded = function (icon) {
            var row = new RowView({ tagName: 'tr', model: icon });
            this.$el.append(row.render().el);
            return this;
        };
        return TableView;
    }(Backbone.View));
    iconsAdmin.TableView = TableView;
})(iconsAdmin || (iconsAdmin = {}));
$(document).ready(function () {
    var collection = new iconsAdmin.AllIconCollection({
        url: 'assets/assets.php',
    });
    var t = new iconsAdmin.TableView({ collection: collection });
});
//# sourceMappingURL=main.js.map