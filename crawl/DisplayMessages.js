///<reference path="../js/base.ts"/>
var movingtext;
(function (movingtext) {
    var Messages = (function () {
        function Messages(options) {
            this.interval = 200000;
            this.position = 0;
            this.speed = 1;
            for (var str in options)
                this[str] = options[str];
            this.$el = $(options.selector);
            this.height = this.$el.height();
            this.start();
            this.loadData();
        }
        Messages.sendError = function (message) {
            $.post("crawl/log.php", message);
        };
        Messages.prototype.onScrollEnd = function () {
            var _this = this;
            this.render();
            this.stop();
            this.position = 0;
            setTimeout(function () {
                _this.start();
                _this.loadData();
            }, 5000);
        };
        Messages.prototype.scroll = function () {
            var _this = this;
            if (this.isRuning)
                requestAnimationFrame(function () { _this.scroll(); });
            this.$el.scrollTop(this.position += this.speed);
            var w = this.$el.scrollTop();
            if (this.prev == w)
                this.onScrollEnd();
            this.prev = w;
        };
        Messages.prototype.start = function () {
            this.isRuning = true;
        };
        Messages.prototype.loadData = function () {
            var _this = this;
            $.get(this.url, function (result) {
                _this.messages = result;
                if (!_this.messages) {
                    movingtext.Messages.sendError("this messages null");
                    return;
                }
                _this.render();
                _this.scroll();
            });
        };
        Messages.prototype.stop = function () {
            this.isRuning = false;
        };
        Messages.prototype.render = function () {
            var mov = $('<div>');
            $('<p>').css('height', '560px').appendTo(mov);
            this.messages.forEach(function (item) {
                $('<p>').html(item).appendTo(mov);
            });
            $('<p>').css('height', '560px').appendTo(mov);
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