var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var movingtext;
(function (movingtext) {
    var Messages = (function () {
        function Messages(options) {
            var _this = this;
            this.interval = 200000;
            this.isFirstTime = true;
            this.position = 0;
            this.speed = 1;
            this.even = 0;
            for (var str in options)
                this[str] = options[str];
            this.$el = $(options.selector);
            this.interval = options.interval;
            this.height = this.$el.height();
            this.messages = [];
            this.start();
            this.loadData();
            setInterval(function () {
                _this.loadData();
            }, this.interval);
        }
        Messages.sendError = function (message) {
            $.post("crawl/log.php", message);
        };
        Messages.prototype.onScrollEnd = function () {
            var _this = this;
            this.render();
            this.stop();
            this.position = 0;
            setTimeout(function () {
                _this.start();
                _this.scroll();
            }, 1000);
        };
        Messages.prototype.scroll = function () {
            var _this = this;
            if (this.isRuning)
                requestAnimationFrame(function () { _this.scroll(); });
            if (this.even === 0) {
                this.even = 1;
                return;
            }
            else {
                this.even = 0;
            }
            this.$el.scrollTop(this.position += this.speed);
            var w = this.$el.scrollTop();
            if (this.prev == w)
                this.onScrollEnd();
            this.prev = w;
        };
        Messages.prototype.start = function () {
            this.isRuning = true;
        };
        Messages.prototype.loadData = function () {
            var _this = this;
            $.get(this.url, function (result) {
                _this.messages = result;
                if (!_this.messages) {
                    movingtext.Messages.sendError("this messages null");
                    return;
                }
                if (_this.isFirstTime) {
                    _this.render();
                    _this.isFirstTime = false;
                    _this.scroll();
                }
            });
        };
        Messages.prototype.stop = function () {
            this.isRuning = false;
        };
        Messages.prototype.render = function () {
            var mov = $('<div>');
            $('<p>').css('height', '560px').appendTo(mov);
            this.messages.forEach(function (item) {
                $('<p>').html(item).appendTo(mov);
            });
            $('<p>').css('height', '560px').appendTo(mov);
            this.$el.empty();
            this.$el.append(mov);
        };
        return Messages;
    }());
    movingtext.Messages = Messages;
})(movingtext || (movingtext = {}));
var MTROptions = {
    selector: "#message-template",
    url: "crawl/gettext.php",
    interval: 25000,
    speed: 1
};
var movingText = new movingtext.Messages(MTROptions);
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
var myapp;
(function (myapp) {
    var Main = (function () {
        function Main(opt) {
            var _this = this;
            for (var str in opt) {
                this[str] = opt[str];
            }
            this.$btnAdd = $('#btnAdd').click(function () {
                _this.onAddClick();
            });
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
                        $.get(_this.url_get_excel, { filename: res.result }).done(function (res) {
                            _this.SetData(res);
                        });
                    });
                    input.remove();
                    _this.$fileInput = null;
                });
                _this.$fileInput = input;
            });
        }
        Main.prototype.InitTable = function () {
            var collection = new Table.AllMessageCollection({});
            var tableView = new Table.AllMessageView({ collection: collection });
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
                var data = this.CleanData(this.collection.toJSON());
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
        Main.prototype.onAddClick = function () {
            this.collection.setRow();
        };
        Main.prototype.CleanData = function (data) {
            var out = [];
            data.forEach(function (item) {
                out.push({ msg: item.msg, active: item.active });
            });
            return out;
        };
        Main.prototype.onDeleteClick = function () {
            if (confirm('Do you want to delete?')) {
                this.collection.setDestroy();
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
//# sourceMappingURL=main.js.map