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
    var Message = (function (_super) {
        __extends(Message, _super);
        function Message() {
            _super.apply(this, arguments);
        }
        Message.prototype.defaults = function () {
            return {
                msg: '',
                active: false,
                selected: false,
                location: '',
                editable: false
            };
        };
        return Message;
    }(Backbone.Model));
    Table.Message = Message;
    var MessageView = (function (_super) {
        __extends(MessageView, _super);
        function MessageView(options) {
            var _this = this;
            _super.call(this, options);
            this.model.on('remove', function () { return _this.remove(); });
            this.$el.on('click', function (evt) { return _this.edit(evt); });
            this.model.on('change:active', function () {
                if (_this.model.get('active')) {
                    _this.$el.find('.mychecked').attr('checked', true);
                }
                else {
                    _this.$el.find('.mychecked').attr('checked', false);
                }
            });
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
                }
            });
        }
        MessageView.prototype.edit = function (evt) {
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
        MessageView.prototype.makeEditable = function () {
            var _this = this;
            this.$el.removeClass('warning').addClass('info');
            var myevent = this.$el.find('.myevent').attr('contenteditable', true);
            myevent.blur(function () {
                _this.model.set('msg', myevent.text());
            });
        };
        MessageView.prototype.remove = function () {
            this.$el.remove();
            return this;
        };
        MessageView.prototype.render = function () {
            var data = this.model.toJSON();
            if (data.active)
                data.active = "checked";
            else
                data.active = "";
            this.$el.html(MessageView.template(data));
            return this;
        };
        MessageView.template = _.template($('#row-template').html());
        return MessageView;
    }(Backbone.View));
    Table.MessageView = MessageView;
    var AllMessageCollection = (function (_super) {
        __extends(AllMessageCollection, _super);
        function AllMessageCollection(options) {
            _super.call(this, options);
            for (var str in options)
                this[str] = options[str];
            this.listenTo(this, 'selectedModel', this.ModelSelected);
        }
        AllMessageCollection.prototype.setRow = function () {
            this.add(new Message());
        };
        AllMessageCollection.prototype.setEditable = function () {
            if (this.selectedModel) {
                this.selectedModel.set('editable', true);
            }
        };
        AllMessageCollection.prototype.setDestroy = function () {
            if (this.selectedModel) {
                this.remove(this.selectedModel);
            }
        };
        AllMessageCollection.prototype.ModelSelected = function (model) {
            if (this.selectedModel) {
                this.selectedModel.set('selected', false);
            }
            model.set('selected', true);
            this.selectedModel = model;
        };
        return AllMessageCollection;
    }(Backbone.Collection));
    Table.AllMessageCollection = AllMessageCollection;
    var AllMessageView = (function (_super) {
        __extends(AllMessageView, _super);
        function AllMessageView(options) {
            _super.call(this, options);
            this.options = options;
            this.setElement($('#tablebody'));
            this.collection.bind("add", this.ModelAdded, this);
        }
        AllMessageView.prototype.ModelAdded = function (message) {
            var row = new MessageView({ tagName: 'tr', model: message });
            this.$el.append(row.render().el);
            return this;
        };
        return AllMessageView;
    }(Backbone.View));
    Table.AllMessageView = AllMessageView;
})(Table || (Table = {}));
//# sourceMappingURL=AdminBackbone.js.map