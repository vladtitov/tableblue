///<reference path="../js/base.ts"/>
var movingtext;
(function (movingtext) {
    var Messages = (function () {
        function Messages(options) {
            this.interval = 200000;
            this.speed = 1;
            for (var str in options)
                this[str] = options[str];
            this.$el = $(options.selector);
            this.start();
        }
        Messages.sendError = function (message) {
            $.post("crawl/log.php", message);
        };
        Messages.prototype.start = function () {
            var that = this;
            that.loadData();
            setInterval(function () {
                that.loadData();
            }, this.interval);
        };
        Messages.prototype.loadData = function () {
            var _this = this;
            var that = this;
            $.get(this.url, function (result) {
                _this.messages = result;
                that.render();
            });
        };
        Messages.prototype.render = function () {
            var mov = $("<marquee behavior='scroll' direction='up' scrollamount='" + this.speed + "' height='560px'>");
            if (!this.messages) {
                movingtext.Messages.sendError("this messages null");
                return;
            }
            this.messages.forEach(function (item) {
                $('<p>').html(item).appendTo(mov);
            });
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
    speed: 3
};
var movingText = new movingtext.Messages(MTROptions);
//# sourceMappingURL=DisplayMessages.js.map