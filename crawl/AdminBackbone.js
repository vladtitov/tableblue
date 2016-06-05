/**
 * Created by yrik6 on 18.04.2016.
 */
///<reference path="../js/base.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Table;
(function (Table) {
    var Person = (function (_super) {
        __extends(Person, _super);
        function Person() {
            _super.apply(this, arguments);
        }
        Person.prototype.defaults = function () {
            return {
                date: 0,
                start: 0,
                end: 0,
                myevent: '',
                selected: false,
                location: '',
                editable: false
            };
        };
        return Person;
    }(Backbone.Model));
    Table.Person = Person;
    var PersonView = (function (_super) {
        __extends(PersonView, _super);
        function PersonView(options) {
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
            this.model.on('change:editable', function () {
                if (_this.model.get('editable')) {
                    _this.makeEditable();
                }
                else {
                    _this.$el.find('.myevent').attr('contenteditable', false);
                    _this.$el.find('.location').attr('contenteditable', false);
                }
            });
        }
        PersonView.prototype.edit = function (evt) {
            if (!this.model.get('selected')) {
                this.model.trigger('selectedModel', this.model);
            }
            else {
                this.model.set('editable', true);
            }
        };
        PersonView.prototype.makeEditable = function () {
            var _this = this;
            this.$el.removeClass('warning').addClass('info');
            var myevent = this.$el.find('.myevent').attr('contenteditable', true);
            var mylocation = this.$el.find('.location').attr('contenteditable', true);
            myevent.blur(function () {
                console.log(myevent.text());
                _this.model.set('myevent', myevent.children().text());
            });
            mylocation.blur(function () {
                _this.model.set('location', mylocation.children().text());
            });
        };
        PersonView.prototype.remove = function () {
            this.$el.remove();
            return this;
        };
        PersonView.prototype.render = function () {
            // var data = this.model.toJSON();
            // data.date = moment.unix(data.date).format('MM DD YYYY');
            // data.start = moment.unix(data.start).format('h:mm a');
            // data.end = moment.unix(data.end).format('h:mm a');
            // this.$el.html( PersonView.template(data) );
            return this;
        };
        PersonView.template = _.template($('#row-template').html());
        return PersonView;
    }(Backbone.View));
    Table.PersonView = PersonView;
    var AllPersonCollection = (function (_super) {
        __extends(AllPersonCollection, _super);
        function AllPersonCollection(options) {
            _super.call(this, options);
            for (var str in options)
                this[str] = options[str];
            this.listenTo(this, 'selectedModel', this.ModelSelected);
        }
        AllPersonCollection.prototype.setEditable = function () {
            if (this.selectedModel) {
                this.selectedModel.set('editable', true);
            }
        };
        AllPersonCollection.prototype.setDestroy = function () {
            if (this.selectedModel) {
                this.remove(this.selectedModel);
            }
        };
        AllPersonCollection.prototype.ModelSelected = function (model) {
            if (this.selectedModel) {
                this.selectedModel.set('selected', false);
            }
            model.set('selected', true);
            this.selectedModel = model;
        };
        return AllPersonCollection;
    }(Backbone.Collection));
    Table.AllPersonCollection = AllPersonCollection;
    var AllPersonView = (function (_super) {
        __extends(AllPersonView, _super);
        function AllPersonView(options) {
            _super.call(this, options);
            this.options = options;
            this.setElement($('#tablebody'));
            this.collection.bind("add", this.ModelAdded, this);
        }
        AllPersonView.prototype.ModelAdded = function (person) {
            var row = new PersonView({ tagName: 'tr', model: person });
            this.$el.append(row.render().el);
            return this;
        };
        return AllPersonView;
    }(Backbone.View));
    Table.AllPersonView = AllPersonView;
})(Table || (Table = {}));
//# sourceMappingURL=AdminBackbone.js.map