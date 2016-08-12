///<reference path="../com.ts"/>
 
 
module utils{
    'use strict'
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
      // step:number=0;
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

       private resetScroll(){
          // var scroll:number =  this.$scrollWindow.scrollLeft();
                   this.$list.append(this.$list.children().first());
                   this.$scrollWindow.scrollLeft(0);


       }
       private nextStep():void{

           if(this.$scrollWindow.width() > this.$scrollContent.width()) {
               return;
           }
           var num:number = this.$list.children().first().width();
         //  this.step++;
           this.currentScroll=num;
           this.$scrollWindow.animate({
               scrollLeft:this.currentScroll
           },this.speed,()=>{
               this.resetScroll();
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