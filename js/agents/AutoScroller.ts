///<reference path="../base.ts"/>
 
 
module utils{
   export class AutoScroller{
       private isRunning:boolean;
       
       scrollWindow:string;
       scrollContent:string;
       list:string;
       
       $scrollWindow:JQuery;      
       $scrollContent:JQuery;       
       $list:JQuery;
       windowWidtht:number;
       timerId:number;
       step:number=0;
       delay:number=1;
       speed:number=0.5;
       private currentScroll:number=0;
       private actualScroll:number;

        constructor(options:any){
            for(var str in options)this[str] = options[str];
            this.$scrollWindow = $(this.scrollWindow).first();
            this.$scrollContent = $(this.scrollContent).first();
            this.$list = $(this.list).first();

            this.init();
            setTimeout(()=>this.start(null),2000);
        }

       private checkScroll(){
           var scroll:number =  this.$scrollWindow.scrollLeft();

           if(this.$scrollWindow.width() > this.$scrollContent.width()) {
               if (this.step == 1) {
                   this.step = 0;
                   this.currentScroll = 0;
                   this.$list.append(this.$list.children().first());
                   this.$scrollWindow.scrollLeft(0);
               }
           }
       }
       private nextStep():void{
           if(this.$scrollWindow.width() < this.$scrollContent.width()) {
               return;
           }
           var h:number = this.$list.children(this.step).width();
           this.step++;
           this.currentScroll+=h;
           this.$scrollWindow.animate({
               scrollLeft:this.currentScroll
           },this.speed,()=>{
               this.checkScroll();
           })
       }
       setWidth():void{
           this.windowWidtht = this.$scrollWindow.width();
       }

       init():void{
           this.delay = this.delay*1000;
           this.speed = this.speed*1000;
           // this.$scrollWindow.on('mouseover',(evt)=>this.stop(evt));
           // this.$scrollWindow.on('mouseleave',(evt)=>this.start(evt));
           this.setWidth();
       }
        start(evt:JQueryEventObject):void{
            if(this.isRunning) return;
            $(".scroll-window").css('overflow-x', 'hidden');
            this.timerId = setInterval(()=>{this.nextStep()},this.delay);
        }
        stop(evt:JQueryEventObject):void{
            clearInterval(this.timerId);
            this.isRunning=false;
            // $(".scroll-window").css('overflow-x', 'auto');
        }
    }
}