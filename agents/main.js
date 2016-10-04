var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tablesTwo;
(function (tablesTwo) {
    'use strict';
    var VOAgent = (function () {
        function VOAgent() {
        }
        return VOAgent;
    }());
    tablesTwo.VOAgent = VOAgent;
    var AgentModel = (function (_super) {
        __extends(AgentModel, _super);
        function AgentModel() {
            _super.apply(this, arguments);
        }
        AgentModel.prototype.initialize = function () {
            var _this = this;
            if (this.get('time') > 0) {
                setInterval(function () {
                    var t = +_this.get('time') + 1;
                    _this.set('time', t);
                }, 1000);
            }
        };
        AgentModel.prototype.defaults = function () {
            return {
                id: 0,
                icon: '',
                old_icon: '',
                time: 0,
                name: ''
            };
        };
        return AgentModel;
    }(Backbone.Model));
    tablesTwo.AgentModel = AgentModel;
    var RowViewTwo = (function (_super) {
        __extends(RowViewTwo, _super);
        function RowViewTwo(options) {
            var _this = this;
            _super.call(this, options);
            this.model.bind('change:icon', function () { return _this.changeIcon(); });
            this.model.bind('change:time', function () { return _this.onTimeChange(); });
            this.model.bind('destroy', function () { return _this.destroy(); });
            this.model.bind('remove', function () { return _this.remove(); });
        }
        RowViewTwo.prototype.onTimeChange = function () {
            var t = this.model.get("time");
            if (t == 0)
                this.$time.text(' ');
            else
                this.$time.text(moment.unix(t).format('m:ss'));
        };
        RowViewTwo.prototype.changeIcon = function () {
            var $icon = this.$icon;
            var old = this.$icon_child.addClass('out');
            setTimeout(function () {
                old.remove();
            }, 2000);
            var newdiv = $('<div>').addClass('in').css('background-image', 'url("' + this.model.get('icon') + '")').appendTo($icon);
            setTimeout(function () {
                newdiv.removeClass('in');
            }, 10);
            this.$icon_child = newdiv;
        };
        RowViewTwo.prototype.initialize = function () {
            this.$el.html(RowViewTwo.template(this.model.toJSON()));
            this.$icon = this.$el.find('.icon2').first();
            this.$icon_child = this.$icon.children();
            this.$time = this.$el.find('.time').first();
            this.onTimeChange();
        };
        RowViewTwo.prototype.render = function () {
            return this;
        };
        RowViewTwo.prototype.remove = function () {
            var _this = this;
            this.$el.fadeOut(function () {
                _super.prototype.remove.call(_this);
            });
            return this;
        };
        RowViewTwo.prototype.add = function () {
            console.log('add');
        };
        RowViewTwo.prototype.destroy = function () {
            console.log('destroy');
        };
        return RowViewTwo;
    }(Backbone.View));
    tablesTwo.RowViewTwo = RowViewTwo;
})(tablesTwo || (tablesTwo = {}));
var utils;
(function (utils) {
    'use strict';
    var AutoScroller = (function () {
        function AutoScroller(options) {
            var _this = this;
            this.delay = 1;
            this.speed = 0.5;
            this.currentScroll = 0;
            for (var str in options)
                this[str] = options[str];
            this.$scrollWindow = $(this.scrollWindow).first();
            this.$scrollContent = $(this.scrollContent).first();
            this.$list = $(this.list).first();
            this.init();
            setTimeout(function () { return _this.start(null); }, 2000);
        }
        AutoScroller.prototype.resetScroll = function () {
            this.$list.append(this.$list.children().first());
            this.$scrollWindow.scrollLeft(0);
        };
        AutoScroller.prototype.nextStep = function () {
            var _this = this;
            if (this.$scrollWindow.width() > this.$scrollContent.width()) {
                return;
            }
            var num = this.$list.children().first().width();
            this.currentScroll = num;
            this.$scrollWindow.animate({
                scrollLeft: this.currentScroll
            }, this.speed, function () {
                _this.resetScroll();
            });
        };
        AutoScroller.prototype.setWidth = function () {
            this.windowWidtht = this.$scrollWindow.width();
        };
        AutoScroller.prototype.init = function () {
            this.delay = this.delay * 1000;
            this.speed = this.speed * 1000;
            this.setWidth();
        };
        AutoScroller.prototype.start = function (evt) {
            var _this = this;
            if (this.isRunning)
                return;
            $(".scroll-window").css('overflow-x', 'hidden');
            this.timerId = setInterval(function () { _this.nextStep(); }, this.delay);
        };
        AutoScroller.prototype.stop = function (evt) {
            clearInterval(this.timerId);
            this.isRunning = false;
        };
        return AutoScroller;
    }());
    utils.AutoScroller = AutoScroller;
})(utils || (utils = {}));
'use strict';
var Formatter = {
    formatTime: function (num) {
        if (isNaN(num))
            return '';
        var h = Math.floor(num / 60 / 60);
        var min = Math.floor((num - (h * 3600)) / 60);
        var sec = (num - (h * 3600)) - (min * 60);
        return (h < 10 ? '0' + h : h) + ':' + (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
    },
    time: function ($view, val) {
        return $view.text(this.formatTime(val));
    },
    name: function ($view, val) {
        return $view.text(val);
    },
    aux: function ($view, val) {
        var $old = $view;
        var $el = $old.clone();
        setTimeout(function () {
            $old.hide('slow', function () {
                $old.remove();
            });
        }, 500);
        $el.appendTo($old.parent());
        $el.text(val);
        return $el;
    },
    icon: function ($view, val) {
        var $old = $view;
        var $el = $old.clone();
        setTimeout(function () {
            $old.hide('slow', function () {
                $old.remove();
            });
        }, 500);
        $el.appendTo($old.parent());
        $el.attr('class', val);
        return $el;
    },
    time_color: function ($view, val) {
        return $view.attr('class', val);
    },
    aux_color: function ($view, val) {
        return $view.attr('class', val);
    }
};
var tablesTwo;
(function (tablesTwo) {
    'use strict';
    var AgentModel = tablesTwo.AgentModel;
    var RowView = tablesTwo.RowViewTwo;
    var AgentsCollection = (function (_super) {
        __extends(AgentsCollection, _super);
        function AgentsCollection(options) {
            _super.call(this, options);
            this.model = AgentModel;
            this.url = options.url;
        }
        AgentsCollection.prototype.refreshData = function (delay) {
            var _this = this;
            var self = this;
            console.log('refreshAgents in ' + delay);
            setTimeout(function () { return _this.fetch({
                error: function () {
                    self.refreshData(60);
                },
                success: function () {
                }
            }); }, delay * 1000);
        };
        AgentsCollection.prototype.parse = function (res) {
            if (res && res.list && res.list.length) {
                _.map(res.list, function (item) {
                });
                var delay = res.list.length * 5;
                if (delay < 30)
                    delay = 30;
                if (delay > 60)
                    delay = 60;
                this.refreshData(delay);
                return res.list;
            }
            else {
                this.refreshData(60);
            }
        };
        return AgentsCollection;
    }(Backbone.Collection));
    tablesTwo.AgentsCollection = AgentsCollection;
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView(options) {
            var _this = this;
            _super.call(this, options);
            this.container = $(options.container);
            this.setElement(this.container.find('ul').first(), true);
            RowView.template = _.template($(options.rowTempalete).html());
            this.collection = options.collection;
            this.collection.bind('remove', function (evt) {
            }, this);
            this.collection.bind("add", function (evt) {
                var row = new RowView({ model: evt, tagName: 'li' });
                _this.$el.append(row.render().el);
            }, this);
            this.render = function () {
                return this;
            };
        }
        TableView.prototype.render = function () {
            return this;
        };
        return TableView;
    }(Backbone.View));
    tablesTwo.TableView = TableView;
})(tablesTwo || (tablesTwo = {}));
$(document).ready(function () {
    console.log('TableTwo ready');
    var collectionTwo = new tablesTwo.AgentsCollection({
        url: 'agents/getagents.php'
    });
    var dd = new tablesTwo.TableView({
        container: '#AgentsList2',
        rowTempalete: '#row-template2',
        collection: collectionTwo
    });
    var scroller = new utils.AutoScroller({
        scrollWindow: '#AgentsList2 .scroll-window',
        scrollContent: '#AgentsList2 .scroll-content',
        list: '#AgentsList2 .scroll-window ul',
        delay: 3,
        speed: 0.7
    });
    collectionTwo.refreshData(0.01);
});
//# sourceMappingURL=main.js.map