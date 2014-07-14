/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package com.luochunhui.cordova.context;

import java.util.TimeZone;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.provider.Settings;

public class Connection extends CordovaPlugin {
    public static final String TAG = "Connection";

    /**
     * Constructor.
     */
    public Connection() {
    }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        Connection.uuid = getUuid();
    }


// *
//      * Open a native alert dialog, with a customizable title and button text.
//      *
//      * @param {String} url              Message to print in the body of the alert
//      * @param {Dictionary} data   The callback that is called when user clicks on a button.
//      * @param {Function} success                Title of the alert dialog (default: Alert)
//      * @param {Function} failed          Label of the close button (default: OK)
     
//      safeAjax: function(url, data, success, failed) {
//         var paraArr = new Array();
//         paraArr.push(url);
//         paraArr.push(data);
//         var exec = cordova.require('cordova/exec');
//         exec(function(data){
//                      success(data);
//                      }, 
//              function(err) {
//                      failed(err);
//                      }, 
//               "Connection", "safeAjax", paraArr);
//     }


    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("safeAjax")) {
            return safeAjax(arrgs, callbackContext)
        }
        else {
            return false;
        }
        return true;
    }

    protected boolean safeAjax(JSONArray args, CallbackContext callbackContext) {
            JSONObject r = new JSONObject();
            r.put("uuid", Device.uuid);
            r.put("version", this.getOSVersion());
            r.put("platform", this.getPlatform());
            r.put("cordova", Device.cordovaVersion);
            r.put("model", this.getModel());
            return callbackContext.success(r);
    }
}
