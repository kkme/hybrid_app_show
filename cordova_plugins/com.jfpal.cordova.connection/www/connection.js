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

/**
 * Provides access to notifications on the device.
 */

module.exports = {
    /**
     * Open a native alert dialog, with a customizable title and button text.
     *
     * @param {String} url              Message to print in the body of the alert
     * @param {Dictionary} data   The callback that is called when user clicks on a button.
     * @param {Function} success                Title of the alert dialog (default: Alert)
     * @param {Function} failed          Label of the close button (default: OK)
     */
     safeAjax: function(url, data, success, failed) {
        var paraArr = new Array();
        paraArr.push(url);
        paraArr.push(data);
        var exec = cordova.require('cordova/exec');
        exec(function(data){
                     success(data);
                     }, 
             function(err) {
                     failed(err);
                     }, 
              "Connection", "safeAjax", paraArr);
    }
};
