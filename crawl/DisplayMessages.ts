///<reference path="../js/base.ts"/>

module movingtext {
    export class Messages{
        private interval:number=200000;
        private height:number;
        private isFirstTime:boolean=true;
        $el:JQuery;
        url:string;
        messages:Array<string>;
        private position:number =0;
        private speed:number=1;

        isRuning:boolean;

        static sendError (message) {
            $.post ("crawl/log.php", message);
        }

        constructor(options:any){
            for(var str in options)this[str]=options[str];
            this.$el=$(options.selector);
            this.interval = options.interval;
            this.height = this.$el.height();
            this.messages = [];
            this.start();
            this.loadData();
            setInterval( () =>{
                this.loadData();
            }, this.interval)
        }





        private onScrollEnd():void{
            this.render();
            this.stop();
            this.position = 0;
            setTimeout( () => {
                this.start();
                this.scroll();
            }, 1000);
         }

        private prev:number;
        private even:number=0;

        scroll():void{
            if(this.isRuning)requestAnimationFrame(()=>{  this.scroll(); });
            if (this.even===0) {
                this.even = 1
                return
            } else {
                this.even =0;
            }
            this.$el.scrollTop(this.position+=this.speed);
            var w = this.$el.scrollTop();
            if(this.prev ==w)this.onScrollEnd();
            this.prev = w;
        }

        start():void {
            this.isRuning = true;
        }

        loadData():void{
            $.get(this.url, (result:any [] ) =>{
                this.messages = result;
                if (!this.messages) {
                    movingtext.Messages.sendError ("this messages null");
                    return;
                }
                if (this.isFirstTime){
                    this.render();
                    this.isFirstTime=false;
                    this.scroll();
                }
            });
        }

        stop(){
            this.isRuning = false;
        }

        private render(){
            var mov =  $('<div>');
            $('<p>').css('height', '560px').appendTo(mov);

            this.messages.forEach( function (item ) {
                $('<p>').html(item).appendTo(mov);
            });

            $('<p>').css('height', '560px').appendTo(mov);
            this.$el.empty();
            this.$el.append(mov);
        }

    }
}

var MTROptions={
    selector:"#message-template",
    url:"crawl/gettext.php",
    interval:25000,
    speed:1
}

var movingText = new movingtext.Messages(MTROptions);