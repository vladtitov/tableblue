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
    var RowViewNested = (function (_super) {
        __extends(RowViewNested, _super);
        // private $aux:JQuery;
        // private $aux_child;
        // private $time:JQuery;
        // private time:number;
        function RowViewNested(options) {
            var _this = this;
            _super.call(this, options);
            // this.model.bind('change:icon', ()=>this.changeIcon());
            // this.model.bind('change:Dial', ()=>this.changeDial());
            this.model.on('change', function () { return _this.render(); });
            // this.model.bind('change:aux', ()=>this.changeAux());
            // this.model.bind('change:time', ()=>this.onTimeChange());
            // this.model.bind('change:time_color', ()=>this.onTimeColorChange());
            this.model.bind('destroy', function () { return _this.destroy(); });
            this.model.bind('remove', function () { return _this.remove(); });
            //  this.model.bind('add',()=>this.add());
        }
        // private onTimeChange():void{
        //     var t:number = this.model.get("time");
        //
        //     this.$time.text(Formatter.formatTime(t));
        // }
        // private onTimeColorChange():void{
        //     var TimeSpan:JQuery=this.$time;
        //     TimeSpan.removeClass().addClass(this.model.get("time_color"));
        // }
        // private changeAux():void{
        //     var old:JQuery = this.$aux_child.addClass('out');
        //     var n:JQuery = $('<div>').addClass('trans in').html(this.model.get('aux')).appendTo(this.$aux);
        //     setTimeout(function(){ n.removeClass('in')},10);
        //     setTimeout(function(){old.remove()},2000);
        //     this.$aux_child=n;
        // }
        RowViewNested.prototype.changeDial = function () {
            this.$dial.text(this.model.get('Dial'));
        };
        RowViewNested.prototype.changeIcon = function () {
            var $icon = this.$icon;
            var old = this.$icon_child.addClass('out');
            setTimeout(function () {
                old.remove();
            }, 2000);
            // var newdiv= $('<div>').addClass('in '+this.model.get('icon')).appendTo($icon);
            var newdiv = $('<div>').addClass('in').css('background-image', 'url("icons/' + this.model.get('icon') + '.png")').appendTo($icon);
            setTimeout(function () {
                newdiv.removeClass('in');
            }, 10);
            this.$icon_child = newdiv;
        };
        // initialize() {
        //     this.$el.html(RowViewNested.template(this.model.toJSON()));
        //     this.$icon = this.$el.find('.icon').first();
        //     this.$icon_child = this.$icon.children();
        //     this.$dial = this.$el.find('.dial').first();
        //     // this.$aux = this.$el.find('.aux').first();
        //     // this.$aux_child = this.$aux.children();
        //     // this.$time = this.$el.find('.col2>span').first();
        //     // this.onTimeChange();
        //
        //
        //     //d.setUTCSeconds(this.model.get("time"));
        // }
        // private initMe():void{
        //     this.Icon= this.$el.find('.icon:first').get();
        //
        // }
        RowViewNested.prototype.render = function () {
            var _this = this;
            this.$el.html(RowViewNested.template(this.model.toJSON()));
            setTimeout(function () {
                _this.$el.find('.icon > div:first').addClass('out');
                _this.$el.find('.in').removeClass('in');
            }, 20);
            //if(!this.isInit)this.initMe();
            //this.$icon.attr('class',this.model.get('icon'));
            // console.log(this.model);
            // if (this.isFilling){return}
            // this.changeIcon1();
            // this.$el.html(Row.template(this.model.toJSON()));
            return this;
        };
        // private changeIcon2(){
        //
        //
        // }
        // private changeIcon3(){
        //
        //
        // }
        RowViewNested.prototype.remove = function () {
            var _this = this;
            this.$el.fadeOut(function () {
                _super.prototype.remove.call(_this);
            });
            return this;
        };
        RowViewNested.prototype.add = function () {
            console.log('add');
        };
        RowViewNested.prototype.destroy = function () {
            console.log('destroy');
        };
        return RowViewNested;
    }(Backbone.View));
    tables.RowViewNested = RowViewNested;
})(tables || (tables = {}));
//# sourceMappingURL=RowViewNested.js.map