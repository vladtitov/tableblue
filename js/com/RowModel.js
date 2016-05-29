/**
 * Created by Vlad on 4/27/2016.
 */
///<reference path="../base.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var table;
(function (table) {
    var VOAgent = (function () {
        function VOAgent() {
        }
        return VOAgent;
    }());
    table.VOAgent = VOAgent;
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
                old_icon: 'great',
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
            // console.log(evt);
            this.set('old_icon', this.previous('icon'));
        };
        return AgentModel;
    }(Backbone.Model));
    table.AgentModel = AgentModel;
})(table || (table = {}));
//# sourceMappingURL=RowModel.js.map