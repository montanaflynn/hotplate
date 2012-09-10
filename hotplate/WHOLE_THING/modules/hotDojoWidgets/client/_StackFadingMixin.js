
define([
  "dojo/_base/declare",
  "dojo/_base/html",
  "dojo/_base/fx",
  "dojo/_base/lang",


   ], function(
     declare
     , html
     , baseFx
     , lang

 ){

    return declare('baseWidgets._StackFadingMixin', null, {

      fadeInInProgress: null,
      fadeOutInProgress: null,

      _transition:function(newWidget, oldWidget){

        // console.log("Transition called");

        // Needed later for calling this.inherited(arguments);
        that = this;
        var a = arguments;

        /*
        console.log("Values:");
        console.log("FadeInInProgress :" + this.fadeInInProgress);
        console.log("FadeOutInProgress :" + this.fadeOutInProgress);
        */

        // An animation was stopped: don't do the whole animation thing, reset everything,
        // called this.inherited(arguments) as if nothing happened
        if( this.fadeInInProgress || this.fadeOutInProgress ){

           // Stop animations
           this.fadeInInProgress ? this.fadeInInProgress.stop() : false;
           this.fadeOutInProgress ? this.fadeOutInProgress.stop() : false;

           // Reset opacity for everything
           html.style(newWidget.domNode, "opacity", 1);
           html.style(oldWidget.domNode, "opacity", 1);

           // call inherited(arguments) as if nothing happened
           this.inherited(arguments);
           return;
         }

        // ////////////////////////////////////////
        // // FADEOUT
        // ////////////////////////////////////////
        // console.log("Fade out starting");
        that.fadeOutInProgress = baseFx.fadeOut({
          node:oldWidget.domNode,
          duration: 250,
          onStop: function(){
            that.fadeOutInProgress = null;
            // console.log("Fadeout stopped");
          },

          // ////////////////////////////////////////
          // // FADEIN
          // ////////////////////////////////////////
          onEnd: function(){

            that.fadeOutInProgress = null;

            // Make the widget transparent, and then call inherited -- which will do the actual switch.
            html.style(newWidget.domNode, "opacity", 0);
            that.inherited(a);
            // console.log("Fadeout ended");

            // At this point the widget is visible, selected but transparent.
            // Let's fix that...
            // console.log("Fade in starting");
            that.fadeInInProgress = baseFx.fadeIn({
              node:newWidget.domNode,
              duration: 250,
              onStop: function(){
                that.fadeInInProgress = null;
                // console.log("Fadein stopped");
              },
              onEnd: function(){
                // console.log("Fadein ended");
                that.fadeInInProgress = null;
              },
           }).play();
          }
        }).play();
      }
    }); // Declare
}); // Define



