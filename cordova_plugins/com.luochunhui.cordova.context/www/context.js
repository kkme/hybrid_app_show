/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova');

channel.createSticky('onCordovaUserReady');
// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaUserReady');

/**
 * This represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function Context() {
    this.user = null;

    var me = this;

    channel.onCordovaReady.subscribe(function() {
        me.get_user(function(info) {
            me.user = info;
            channel.onCordovaUserReady.fire();
        },function(e) {
            me.user = null;
            utils.alert("[ERROR] Error initializing Cordova: " + e);
        });
    });
}

/**
 * Get device info
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
Context.prototype.quit = function() {
    exec(null, null, "Context", "quit", []);
};

Context.prototype.home = function() {
    exec(null, null, "Context", "home", []);
};

Context.prototype.get_user = function(success) {
    exec(success, success, "Context", "user", []);
}
Context.prototype.helpinfo = function(helpkey, success) {
               exec(success, success, "Context", "helpinfo", [helpkey]);
               }
               


module.exports = new Context();
