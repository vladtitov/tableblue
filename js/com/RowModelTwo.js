/**
 * Created by Vlad on 4/27/2016.
 */
///<reference path="../base.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tableTwo;
(function (tableTwo) {
    var VOAgent = (function () {
        function VOAgent() {
        }
        return VOAgent;
    }());
    tableTwo.VOAgent = VOAgent;
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
    }(Backbone.Model));
    tableTwo.AgentModel = AgentModel;
})(tableTwo || (tableTwo = {}));
//# sourceMappingURL=RowModelTwo.js.map