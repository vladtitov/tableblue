/**
 * Created by Vlad on 4/27/2016.
 */
///<reference path="../base.ts"/>
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
    })();
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
                non_prescriber: 0
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
    })(Backbone.Model);
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
    })(Backbone.View);
    tables.RowView = RowView;
})(tables || (tables = {}));
//# sourceMappingURL=OneIcon.js.map