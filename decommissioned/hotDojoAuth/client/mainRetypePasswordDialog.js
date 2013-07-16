require([
  'dojo/_base/declare',
  'dojo/query',
  'dojo/aspect',
  'dojo/_base/lang',
  'dojo/_base/json',
  'dojo/topic',
  'dojo/text!hotplate/hotDojoAuth/templates/RetypePassword.html',

  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  'dijit/form/Form',
  "dijit/layout/ContentPane",
  'dijit/Dialog',

  "hotplate/hotDojoSubmit/defaultSubmit",
  "hotplate/hotDojoLogger/logger",
  "hotplate/hotDojoStores/stores",

  'hotplate/hotDojoAuth/ValidationPassword',
  "hotplate/hotDojoWidgets/AlertBar",
  "hotplate/hotDojoWidgets/BusyButton",



  ],function(
    declare
  , query
  , aspect
  , lang
  , json
  , topic
  , retypePasswordTemplateString

  , _WidgetBase
  , _TemplatedMixin
  , _WidgetsInTemplateMixin
  , Form
  , ContentPane
  , Dialog

  , ds
  , Logger
  , stores

  , ValidationPassword
  , AlertBar
  , BusyButton

  ){

  var r = {}

  // The password form will appear when the application emits a authNeeded (most likely
  // when a call returns an error code which means "not logged in")
  topic.subscribe('hotDojoSubmit/authNeeded', function(){
    r.retypePasswordDialog.show();
  });
 

  r.RetypePasswordDialog = declare("hotplate/hotDojoAuth/RetypePasswordDialog", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {


    templateString: retypePasswordTemplateString,

    show: function(){
      this.dialog.show();
    },

    postCreate: function(){
      var that = this;


      this.form.onSubmit = ds.defaultSubmit(this.form, this.button, function(){

        // Get the form's values
        var data = that.form.getValues();
        data.login = loginValue; // NOTE: this is loginName "the" global variable. FIXME: find a better way... seriously.
        data.remember = ['off']  // Off by default when you re-login


       // Store the data 
        stores('loginAnon').put(data).then(
          ds.UIMsg( that.button, null),
          ds.UIErrorMsg( that.form, that.button, that.alertBar, true )
        ).then(
          function(res){
            Logger("Jsonrest put(data) returned OK: " + json.toJson(res) );

            // Reset things so that it will look right if it happens again
            that.form.reset();
            that.alertBar.hide();
            that.dialog.hide();
            r.RetypePasswordDialog.failureCounts = 0;
          },
          function(err){
            that.form.reset();
            r.RetypePasswordDialog.failureCounts ++;
            if( r.RetypePasswordDialog.failureCounts > 2){
              window.location="/pages/login";
            }
          }
        );  // stores('loginanon').put(data)
        return false;
      });
    }
  });
  r.RetypePasswordDialog.failureCounts = 0;

  r.retypePasswordDialog = r.RetypePasswordDialog();

  return r;
});