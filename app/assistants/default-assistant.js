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

function DefaultAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

DefaultAssistant.prototype.setup = function() {
    this.contentDiv = this.controller.get('lblInformation');

    this.handlebtnFBConnectClicked = this.handlebtnFBConnectClicked.bindAsEventListener(this);
    Mojo.Event.listen(this.controller.get('btnFBConnect'), Mojo.Event.tap, this.handlebtnFBConnectClicked);
};

DefaultAssistant.prototype.handlebtnFBConnectClicked = function(event) {
    this.controller.stageController.pushScene('fbconnect');
}

DefaultAssistant.prototype.activate = function(event) {
    if(event != null && event.id)
    {
        //event contains all the facebook jsons info,
        //this is where the magic happens.
        
        var content = this.contentDiv.innerHTML;

        this.contentDiv.innerHTML = 'hello, ' + event.name + '<br />Your facebook URL is:<br />' + event.link;
    }
};

DefaultAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

DefaultAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
