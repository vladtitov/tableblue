var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rating;
(function (rating) {
    var DataModel = (function (_super) {
        __extends(DataModel, _super);
        function DataModel(obj) {
            _super.call(this, obj);
        }
        DataModel.prototype.initialize = function () {
            var _this = this;
            this.updateData();
            this.on('change', function () { return _this.updateData(); });
        };
        DataModel.prototype.updateData = function () {
            this.attributes.total = this.get('Dial') + this.get('Prescriber') + this.get('Non_prescriber');
            this.attributes.time = Math.round(this.attributes.COUNTER_ready_eff / DataModel.devider);
            this.attributes.calculated = (this.attributes.total / this.attributes.time).toPrecision(2);
            this.attributes.rating = (this.attributes.calculated / DataModel.percentOf * 100).toPrecision(3);
            var ar = DataModel.criteria;
            ;
            if (ar)
                for (var i = 0, n = ar.length; i < n; i++)
                    if (this.attributes.rating < ar[i].max) {
                        this.attributes.icon = ar[i].icon;
                        break;
                    }
            this.trigger('render');
        };
        DataModel.prototype.defaults = function () {
            return {
                icon: '',
                Dial: 0,
                Prescriber: 0,
                Non_prescriber: 0,
                COUNTER_ready_eff: 0,
                calculated: '',
                calc: 0,
                total: 0,
                time: 0,
                rating: 0
            };
        };
        return DataModel;
    }(Backbone.Model));
    rating.DataModel = DataModel;
    var RowView = (function (_super) {
        __extends(RowView, _super);
        function RowView(options) {
            var _this = this;
            _super.call(this, options);
            this.model.on('remove', function () { return _this.remove(); });
            this.$el.on('click', function (evt) { return _this.edit(evt); });
            this.model.on('change:selected', function () {
                if (_this.model.get('selected')) {
                    _this.$el.addClass('warning');
                }
                else {
                    _this.$el.removeClass();
                    _this.model.set('editable', false);
                }
            });
            this.model.on('render', function () {
                _this.render();
            });
        }
        RowView.prototype.edit = function (evt) {
            if (evt.target.localName != 'input') {
                if (!this.model.get('selected')) {
                    this.model.trigger('selectedModel', this.model);
                }
                else {
                    this.model.set('editable', true);
                }
            }
            else {
                this.model.get('active') ? this.model.set('active', false) : this.model.set('active', true);
            }
        };
        RowView.prototype.makeEditable = function () {
            var _this = this;
            this.$el.removeClass('warning').addClass('info');
            var myevent = this.$el.find('.myevent').attr('contenteditable', 'true');
            myevent.blur(function () {
                _this.model.set('msg', myevent.text());
            });
        };
        RowView.prototype.remove = function () {
            this.$el.remove();
            return this;
        };
        RowView.prototype.render = function () {
            var data = this.model.toJSON();
            this.$el.html(RowView.template(data));
            return this;
        };
        RowView.template = _.template($('#row-template').html());
        return RowView;
    }(Backbone.View));
    rating.RowView = RowView;
    var DataCollection = (function (_super) {
        __extends(DataCollection, _super);
        function DataCollection(options) {
            _super.call(this, options);
            this.model = DataModel;
            for (var str in options)
                this[str] = options[str];
            this.listenTo(this, 'selectedModel', this.ModelSelected);
        }
        DataCollection.prototype.onPrecentCnenge = function (num) {
            DataModel.percentOf = num;
            if (this.length > 1) {
                this.each(function (item) {
                    item.updateData();
                });
            }
        };
        DataCollection.prototype.onDeviderCnenge = function (num) {
            DataModel.devider = num;
            if (this.length > 1) {
                this.each(function (item) {
                    item.updateData();
                });
            }
        };
        DataCollection.prototype.parse = function (res) {
            var ar = [];
            _.map(res.agents, function (item) {
                item.Non_prescriber = item['Nonprescriber'];
                item.calculated = '';
                ar.push(item);
            });
            return ar;
        };
        DataCollection.prototype.setRow = function () {
            this.add(new DataModel({}));
        };
        DataCollection.prototype.setEditable = function () {
            if (this.selectedModel) {
                this.selectedModel.set('editable', true);
            }
        };
        DataCollection.prototype.setCriteria = function (ar) {
            DataModel.criteria = ar;
            if (this.models.length > 1) {
                this.each(function (item) {
                    item.updateData();
                });
            }
        };
        DataCollection.prototype.ModelSelected = function (model) {
            if (this.selectedModel) {
                this.selectedModel.set('selected', false);
            }
            model.set('selected', true);
            this.selectedModel = model;
        };
        return DataCollection;
    }(Backbone.Collection));
    rating.DataCollection = DataCollection;
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView(options) {
            var _this = this;
            _super.call(this, options);
            this.dayWeekSettings = new DayWeekSettings();
            this.dayWeekSettings.onPercent = function (num) { return _this.onPercentChange(num); };
            this.dayWeekSettings.onDevider = function (num) { return _this.onDeviderChange(num); };
            this.dayWeekSettings.loadData().then(function () {
                _this.collection.fetch({ data: { report: 'd' } });
            });
            this.dayWeekSettings.onCahange = function (ar) {
                _this.collection.setCriteria(ar);
            };
            this.collection = new DataCollection(options);
            var radios = $('[name=WeeklyDayly]').change(function () {
                radios.each(function (i, item) {
                    if ($(item).prop('checked'))
                        _this.collection.fetch({
                            data: {
                                report: $(item).val()
                            }
                        });
                });
            });
            RowView.template = _.template(document.getElementById('DataRow').innerHTML);
            this.options = options;
            this.setElement($('#tablebody'));
            this.collection.bind("add", this.ModelAdded, this);
        }
        TableView.prototype.onDeviderChange = function (num) {
            console.log('Devider', num);
            this.collection.onDeviderCnenge(num);
        };
        TableView.prototype.onPercentChange = function (num) {
            console.log(num);
            this.collection.onPrecentCnenge(num);
        };
        TableView.prototype.ModelAdded = function (model) {
            var row = new RowView({ tagName: 'tr', model: model });
            this.$el.append(row.render().el);
            return this;
        };
        return TableView;
    }(Backbone.View));
    rating.TableView = TableView;
    var DayWeekSettings = (function () {
        function DayWeekSettings() {
            var _this = this;
            this.$view = $('#Calculator');
            this.$list = $('#IconsList');
            $('#btnSave').click(function () {
                if (confirm('You want to save a new Settings file?'))
                    _this.saveData();
            });
            $('#PercentOf').change(function () {
                var num = Number($('#PercentOf').val());
                if (isNaN(num))
                    return;
                _this.percentOf = num;
                if (_this.onPercent)
                    _this.onPercent(_this.percentOf);
            });
            $('#Devider').change(function () {
                var num = Number($('#Devider').val());
                if (isNaN(num))
                    return;
                _this.devider = num;
                if (_this.onDevider)
                    _this.onDevider(_this.devider);
            });
        }
        DayWeekSettings.prototype.loadData = function () {
            var _this = this;
            return $.get('dayweek/admin.php').done(function (res) {
                _this.criteria = res.criteria;
                _this.percentOf = res.percentOf;
                _this.devider = res.devider;
                $('#PercentOf').val(_this.percentOf);
                $('#Devider').val(_this.devider);
                if (_this.onPercent)
                    _this.onPercent(_this.percentOf);
                if (_this.onDevider)
                    _this.onDevider(_this.devider);
                if (_this.onCahange)
                    _this.onCahange(_this.criteria);
                _this.render();
            });
        };
        DayWeekSettings.prototype.setCriteria = function (ar) {
            if (this.criteria.length !== ar.length)
                return;
            for (var i = 0, n = this.criteria.length; i < n; i++) {
                this.criteria[i].max = ar[i];
            }
            if (this.onCahange)
                this.onCahange(this.criteria);
        };
        DayWeekSettings.prototype.addListeners = function () {
            var _this = this;
            var inputs = this.$list.find('input').change(function () {
                var ar = [];
                var valid = true;
                inputs.each(function (i, el) {
                    var val = Number($(el).val());
                    ar.push(val);
                    if (isNaN(val))
                        valid = false;
                });
                if (valid)
                    _this.setCriteria(ar);
            });
        };
        DayWeekSettings.prototype.render = function () {
            var out = '';
            var i = 0;
            this.criteria.forEach(function (item) {
                out += '<div>' +
                    '<div class="text-center">' + item.state + '</div>' +
                    '<div class="text-center"><img src="' + item.icon + '" /></div>' +
                    'to <input type="text" value="' + item.max + '" size="1" data-i="' + (i++) + '" /> ' +
                    '</div>';
            });
            this.$list.html(out);
            this.addListeners();
        };
        DayWeekSettings.prototype.saveData = function () {
            $.post('dayweek/admin.php', JSON.stringify({ percentOf: this.percentOf, devider: this.devider, criteria: this.criteria })).done(function (res) {
                if (res.success)
                    alert('Settings saved on server');
                else
                    alert('Error ' + res);
            });
        };
        return DayWeekSettings;
    }());
    var RaitingManager = (function () {
        function RaitingManager() {
            var table = new TableView({
                url: 'dayweek/bsd.php'
            });
        }
        return RaitingManager;
    }());
    rating.RaitingManager = RaitingManager;
    $(document).ready(function () {
        new RaitingManager();
    });
})(rating || (rating = {}));
//# sourceMappingURL=main.js.map