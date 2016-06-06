///<reference path="../js/base.ts"/>
var movingtext;
(function (movingtext) {
    var Messages = (function () {
        function Messages(options) {
            this.interval = 200000;
            this.isFirstTime = true;
            this.position = 0;
            this.speed = 1;
            for (var str in options)
                this[str] = options[str];
            this.$el = $(options.selector);
            this.start();
            this.loadData();
        }
        Messages.prototype.sendError = function (message) {
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
            }, 5000);
        };
        Messages.prototype.scroll = function () {
            var _this = this;
            if (this.isRuning)
                requestAnimationFrame(function () { _this.scroll(); });
        };
        Messages.prototype.start = function () {
            this.isRuning = true;
        };
        Messages.prototype.loadData = function () {
            var _this = this;
            $.get(this.url, function (result) {
                _this.messages = result;
                console.log(_this.messages);
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
            var mov = $('<marquee behavior="scroll" direction="up" height="655px">');
            if (!this.messages) {
                this.sendError("this messages null");
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
    speed: 1
};
var movingText = new movingtext.Messages(MTROptions);
//# sourceMappingURL=DisplayMessages.js.map