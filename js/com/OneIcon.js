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
    var OneIcon = (function (_super) {
        __extends(OneIcon, _super);
        function OneIcon(options) {
            var _this = this;
            _super.call(this, options);
            this.model.on('change', function () { return _this.render(); });
            this.model.bind('destroy', function () { return _this.destroy(); });
            this.model.bind('remove', function () { return _this.remove(); });
        }
        OneIcon.prototype.render = function () {
            var _this = this;
            this.$el.html(OneIcon.template(this.model.toJSON()));
            setTimeout(function () {
                _this.$el.find('.icon > div:first').addClass('out');
                _this.$el.find('.in').removeClass('in');
            }, 20);
            return this;
        };
        OneIcon.prototype.remove = function () {
            var _this = this;
            this.$el.fadeOut(function () {
                _super.prototype.remove.call(_this);
            });
            return this;
        };
        OneIcon.prototype.add = function () {
            console.log('add');
        };
        OneIcon.prototype.destroy = function () {
            console.log('destroy');
        };
        return OneIcon;
    }(Backbone.View));
    tables.OneIcon = OneIcon;
})(tables || (tables = {}));
//# sourceMappingURL=OneIcon.js.map