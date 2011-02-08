/*
 * The MIT License

 * Copyright (c) 2010 Peter Ma

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

function FbconnectAssistant() {
    //This is your call back link, mine is only used for testing
    this.link = 'https://graph.facebook.com/oauth/authorize?client_id=108042132288&redirect_uri=http://www.paschar.com/webos/callback/&display=touch';
}

FbconnectAssistant.prototype.setup = function() {
    var webviewattribute = {
		minFontSize:18,
		virtualpagewidth: this.controller.window.innerWidth,
		virtualpageheight: 32 ,
        url: this.link
	};
    this.controller.setupWidget('webview', webviewattribute, {});

    Mojo.Event.listen(this.controller.get("webview"), Mojo.Event.webViewTitleUrlChanged, this.fbURLChanged.bind(this));
};

FbconnectAssistant.prototype.fbURLChanged = function(event){
    if(event.url.indexOf('https://graph.facebook.com/oauth/access_token?') != -1)
    {
        new Ajax.Request(event.url, {
                contentType: 'text/html',
                onComplete: this.facebookConnected.bind(this)
            });
            
    }
    else if(event.url.indexOf('error_reason=user_denied') != -1 && event.url.indexOf('error_description=The+user+denied+your+request') != -1)
    {
        Mojo.Controller.errorDialog('You\'ve denied logging in with facebook.');        
    }

}

FbconnectAssistant.prototype.facebookConnected = function(transport){
    if(transport.responseText.indexOf('access_token') == 0)
    {
        var token = transport.responseText.substring(13);
        new Ajax.Request('https://graph.facebook.com/me?access_token=' + token, {
					method: 'get',
					contentType: 'text/html',
					onComplete: this.successfullyLoginFacebook.bind(this),
				});
    }
    else
    {
        Mojo.Controller.errorDialog('There were some problems logging with facebook');        
    }
}

FbconnectAssistant.prototype.successfullyLoginFacebook = function(transport){
    var facebookinfo = transport.responseText.evalJSON();
    if(facebookinfo.id)
    {
        this.controller.stageController.popScene(facebookinfo);
    }
    else{
        Mojo.Controller.errorDialog('There seem to be some problem logging in with facebook, please try again later.');
    }
}


FbconnectAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
   try {
        //Clean up the stuff
        var webview = this.controller.get('webview');                
        webview.mojo.clearCache();
        webview.mojo.clearCookies();
        webview.mojo.reloadPage();

   } catch(e) {
    //Tracking error coming soon
   }
};

FbconnectAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

FbconnectAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
    var element = this.controller.get('ga'); 
    element.parentNode.removeChild(element);
};
