///<reference path="../base.ts"/>
var utilsDay;
(function (utilsDay) {
    var AutoScroller = (function () {
        function AutoScroller(options) {
            var _this = this;
            this.scrollHeight = 0;
            this.step = 0;
            this.delay = 1;
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
                if (this.step == 2) {
                    this.step = 0;
                    this.currentScroll = 0;
                    this.$list.append(this.$list.children().first());
                    this.$list.append(this.$list.children().first());
                    this.$scrollWindow.scrollTop(0);
                }
            }
        };
        AutoScroller.prototype.nextStep = function () {
            var _this = this;
            if (this.$scrollWindow.height() > this.$scrollContent.height()) {
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
            // this.$scrollWindow.on('mouseover',(evt)=>this.stop(evt));
            // this.$scrollWindow.on('mouseleave',(evt)=>this.start(evt));
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
            // $(".nano").nanoScroller();
        };
        return AutoScroller;
    })();
    utilsDay.AutoScroller = AutoScroller;
})(utilsDay || (utilsDay = {}));
//# sourceMappingURL=AutoScroller.js.map