///<reference path="../base.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tablesTwo;
(function (tablesTwo) {
    var AgentModel = tablesTwo.AgentModel;
    var RowView = tablesTwo.RowViewTwo;
    var AgentsCollection = (function (_super) {
        __extends(AgentsCollection, _super);
        function AgentsCollection(options) {
            _super.call(this, options);
            this.model = AgentModel;
            this.url = options.url;
            this.fetch();
        }
        AgentsCollection.prototype.parse = function (res) {
            _.map(res.list, function (item) {
                item.id = item.id;
                item.time = item.t || 0;
                item.icon = '' + item.icon;
            });
            return res.list;
        };
        return AgentsCollection;
    })(Backbone.Collection);
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
    })(Backbone.View);
    tablesTwo.TableView = TableView;
})(tablesTwo || (tablesTwo = {}));
//# sourceMappingURL=BackboneTableTwo.js.map