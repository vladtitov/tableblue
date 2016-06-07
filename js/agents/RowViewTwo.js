/**
 * Created by Vlad on 4/27/2016.
 */
///<reference path="../base.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tablesTwo;
(function (tablesTwo) {
    var VOAgent = (function () {
        function VOAgent() {
        }
        return VOAgent;
    })();
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
                    var t = _this.get('time') + 1;
                    _this.set('time', t);
                }, 1000);
            }
        };
        AgentModel.prototype.defaults = function () {
            return {
                id: 0,
                icon: '',
                time: 0
            };
        };
        return AgentModel;
    })(Backbone.Model);
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
                this.$time.text(Formatter.formatTime(t));
        };
        RowViewTwo.prototype.changeIcon = function () {
            var $icon = this.$icon;
            var old = this.$icon_child.addClass('out');
            setTimeout(function () {
                old.remove();
            }, 2000);
            var newdiv = $('<div>').addClass('in').css('background-image', 'url("icons/' + this.model.get('icon') + '.png")').appendTo($icon);
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
    })(Backbone.View);
    tablesTwo.RowViewTwo = RowViewTwo;
})(tablesTwo || (tablesTwo = {}));
//# sourceMappingURL=RowViewTwo.js.map