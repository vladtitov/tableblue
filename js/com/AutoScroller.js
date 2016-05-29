///<reference path="../base.ts"/>
var utils;
(function (utils) {
    var AutoScroller = (function () {
        function AutoScroller(options) {
            var _this = this;
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
        AutoScroller.prototype.onScrollEnd = function () {
            console.log('scrollend');
            this.stop(null);
        };
        AutoScroller.prototype.checkScroll = function () {
            var scroll = this.$scrollWindow.scrollLeft();
            // if(scroll == this.actualScroll)this.onScrollEnd();
            // this.actualScroll = scroll;
            // console.log(this.$scrollWindow.width());
            // console.log(this.$scrollContent.width());
            if (this.$scrollWindow.width() > this.$scrollContent.width()) {
                if (this.step == 1) {
                    this.step = 0;
                    this.currentScroll = 0;
                    this.$list.append(this.$list.children().first());
                    // this.$list.append(this.$list.children().first());
                    this.$scrollWindow.scrollLeft(0);
                }
            }
        };
        AutoScroller.prototype.nextStep = function () {
            var _this = this;
            //TODO from one to lines broken
            if (this.$scrollWindow.width() < this.$scrollContent.width()) {
                console.log("No scroll");
                return;
            }
            var h = this.$list.children(this.step).width();
            this.step++;
            this.currentScroll += h;
            this.$scrollWindow.animate({
                scrollLeft: this.currentScroll
            }, this.speed, function () {
                _this.checkScroll();
            });
        };
        AutoScroller.prototype.setWidth = function () {
            this.windowWidtht = this.$scrollWindow.width();
        };
        AutoScroller.prototype.init = function () {
            var _this = this;
            this.delay = this.delay * 1000;
            this.speed = this.speed * 1000;
            this.$scrollWindow.on('mouseover', function (evt) { return _this.stop(evt); });
            this.$scrollWindow.on('mouseleave', function (evt) { return _this.start(evt); });
            this.setWidth();
        };
        AutoScroller.prototype.start = function (evt) {
            var _this = this;
            // console.log('starting',this);
            if (this.isRunning)
                return;
            $(".scroll-window").css('overflow-x', 'hidden');
            this.timerId = setInterval(function () { _this.nextStep(); }, this.delay);
        };
        AutoScroller.prototype.stop = function (evt) {
            //console.log('stopping',this);
            clearInterval(this.timerId);
            this.isRunning = false;
            $(".scroll-window").css('overflow-x', 'auto');
            // $(".nano").nanoScroller();
        };
        return AutoScroller;
    }());
    utils.AutoScroller = AutoScroller;
})(utils || (utils = {}));
//# sourceMappingURL=AutoScroller.js.map