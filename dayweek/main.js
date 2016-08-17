var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tables;
(function (tables) {
    var VOAgent = (function () {
        function VOAgent() {
        }
        return VOAgent;
    }());
    tables.VOAgent = VOAgent;
    var AgentModel = (function (_super) {
        __extends(AgentModel, _super);
        function AgentModel() {
            _super.apply(this, arguments);
        }
        AgentModel.prototype.defaults = function () {
            return {
                id: 0,
                name: '',
                icon: '',
                old_icon: 'icons/great.png',
                Dial: 0,
                Prescriber: 0,
                non_prescriber: 0,
                connects: 0
            };
        };
        AgentModel.prototype.initialize = function () {
            var _this = this;
            this.on('change:icon', function (evt) { return _this.onIcon(evt); });
        };
        AgentModel.prototype.onIcon = function (evt) {
            this.set('old_icon', this.previous('icon'));
        };
        return AgentModel;
    }(Backbone.Model));
    tables.AgentModel = AgentModel;
    var RowView = (function (_super) {
        __extends(RowView, _super);
        function RowView(options) {
            var _this = this;
            _super.call(this, options);
            this.model.on('change', function () { return _this.render(); });
            this.model.bind('remove', function () { return _this.remove(); });
        }
        RowView.prototype.render = function () {
            var _this = this;
            this.$el.html(RowView.template(this.model.toJSON()));
            setTimeout(function () {
                _this.$el.find('.icon > div:first').addClass('out');
                _this.$el.find('.in').removeClass('in');
            }, 20);
            return this;
        };
        RowView.prototype.remove = function () {
            var _this = this;
            this.$el.fadeOut(function () {
                _super.prototype.remove.call(_this);
            });
            return this;
        };
        return RowView;
    }(Backbone.View));
    tables.RowView = RowView;
})(tables || (tables = {}));
var utilsDay;
(function (utilsDay) {
    var AutoScroller = (function () {
        function AutoScroller(options) {
            var _this = this;
            this.scrollHeight = 0;
            this.step = 0;
            this.delay = 2;
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
        AutoScroller.prototype.checkScroll = function () {
            var scroll = this.$scrollWindow.scrollTop();
            this.actualScroll = scroll;
            if (this.$scrollWindow.height() < this.$scrollContent.height()) {
                if (this.step > 1) {
                    this.step = 0;
                    this.currentScroll = 0;
                    this.$list.append(this.$list.children().first());
                    this.$list.append(this.$list.children().first());
                    this.$scrollWindow.scrollTop(0);
                }
            }
            else {
                this.step = 0;
                this.currentScroll = 0;
            }
        };
        AutoScroller.prototype.nextStep = function () {
            var _this = this;
            if (this.$scrollWindow.height() > this.$scrollContent.height()) {
                this.step = 0;
                this.currentScroll = 0;
                return;
            }
            var h = this.$list.children(this.step).height();
            this.step++;
            this.currentScroll += h;
            this.$scrollWindow.animate({
                scrollTop: this.currentScroll
            }, this.speed, function () {
                _this.checkScroll();
            });
        };
        AutoScroller.prototype.setHeight = function () {
            this.windowHeight = this.$scrollWindow.height();
        };
        AutoScroller.prototype.init = function () {
            this.delay = this.delay * 1000;
            this.speed = this.speed * 1000;
            this.setHeight();
        };
        AutoScroller.prototype.start = function (evt) {
            var _this = this;
            if (this.isRunning)
                return;
            this.timerId = setInterval(function () { _this.nextStep(); }, this.delay);
        };
        AutoScroller.prototype.stop = function (evt) {
            clearInterval(this.timerId);
            this.isRunning = false;
        };
        return AutoScroller;
    }());
    utilsDay.AutoScroller = AutoScroller;
})(utilsDay || (utilsDay = {}));
'use strict';
var Formatter = {
    formatTime: function (num) {
        if (isNaN(num))
            return '';
        var h = Math.floor(num / 60 / 60);
        var min = Math.floor((num - (h * 3600)) / 60);
        var sec = (num - (h * 3600)) - (min * 60);
        return h + ':' + (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
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
var tables;
(function (tables) {
    var AgentsCollection = (function (_super) {
        __extends(AgentsCollection, _super);
        function AgentsCollection(options) {
            _super.call(this, options);
            this.model = tables.AgentModel;
            this.url = options.url;
            this.params = options.params;
            this.fetch({ data: this.params });
        }
        AgentsCollection.prototype.sendRequest = function () {
            if (this.params.report == 'd')
                this.params.report = 'w';
            else
                this.params.report = 'd';
            this.fetch({ data: this.params });
        };
        AgentsCollection.prototype.setHeaders = function () {
            if (this.params.report == 'w')
                $('#DailyWeekly').text('Weekly Report');
            else
                $('#DailyWeekly').text('Daily Report');
        };
        AgentsCollection.prototype.setMyTimeout = function (num) {
            var _this = this;
            if (isNaN(num) || num < 6)
                num = 6;
            var delay = (num - 6) * 5 + 15;
            setTimeout(function () { return _this.sendRequest(); }, delay * 1000);
        };
        AgentsCollection.prototype.parse = function (res) {
            this.setHeaders();
            this.setMyTimeout(res.agents.length);
            _.map(res.agents, function (item) {
                item.non_prescriber = item['Nonprescriber'];
                item.connects = item.non_prescriber + item.Prescriber;
            });
            this.trigger('myParse', res.agents, this.params.report);
            return res.agents;
        };
        return AgentsCollection;
    }(Backbone.Collection));
    tables.AgentsCollection = AgentsCollection;
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView(options) {
            var _this = this;
            _super.call(this, options);
            this.container = $(options.container);
            this.setElement(this.container.find('tbody').first(), true);
            tables.RowView.template = _.template($(options.rowTempalete).html());
            this.collection = options.collection;
            this.collection.bind('remove', function (evt) {
            }, this);
            this.collection.bind("add", function (evt) {
                var row = new tables.RowView({ model: evt, tagName: 'tr' });
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
    tables.TableView = TableView;
})(tables || (tables = {}));
$(document).ready(function () {
    console.log('Table 1 ready');
    var collection = new tables.AgentsCollection({
        url: 'dayweek/bsd.php',
        params: {
            report: 'd'
        }
    });
    var t = new tables.TableView({
        container: '#AgentsList1',
        rowTempalete: '#row-template',
        collection: collection
    });
    var scrollerDay = new utilsDay.AutoScroller({
        scrollWindow: '#AgentsList1 .scroll-window',
        scrollContent: '#AgentsList1 .scroll-content',
        list: '#AgentsList1 .scroll-window tbody',
        delay: 2,
        speed: 0.7
    });
    var controller = new tables.SummaryController(collection);
});
var tables;
(function (tables) {
    var SummaryModel = (function (_super) {
        __extends(SummaryModel, _super);
        function SummaryModel(obj) {
            _super.call(this, obj);
        }
        SummaryModel.prototype.defaults = function () {
            return {
                id: 0,
                dials: 0,
                connects: 0,
                type: 'Weekly'
            };
        };
        return SummaryModel;
    }(Backbone.Model));
    tables.SummaryModel = SummaryModel;
    var SummaryView = (function (_super) {
        __extends(SummaryView, _super);
        function SummaryView(options) {
            var _this = this;
            _super.call(this, options);
            this.setElement('#Summary');
            this.template = options.template;
            this.model.on('change', function () { return _this.render(); });
            this.template = _.template($(this.template).html());
        }
        SummaryView.prototype.render = function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        };
        return SummaryView;
    }(Backbone.View));
    tables.SummaryView = SummaryView;
    var SummaryController = (function () {
        function SummaryController(collection) {
            var _this = this;
            this.model = new SummaryModel({}),
                this.view = new SummaryView({
                    model: this.model,
                    template: '#row-template4'
                });
            collection.on('myParse', function (evt, par) {
                var dials = 0;
                var connects = 0;
                _.map(evt, function (item) {
                    dials += item.Dial;
                    connects += item.connects;
                });
                if (par == 'w')
                    _this.model.set({ type: 'Weekly', dials: dials, connects: connects });
                else
                    _this.model.set({ type: 'Daily', dials: dials, connects: connects });
            });
        }
        return SummaryController;
    }());
    tables.SummaryController = SummaryController;
})(tables || (tables = {}));
//# sourceMappingURL=main.js.map