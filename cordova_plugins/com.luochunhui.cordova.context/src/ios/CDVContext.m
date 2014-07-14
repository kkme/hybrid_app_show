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

#import <Cordova/CDV.h>
#import "CDVContext.h"


//TODO get appuser


@interface CDVContext () {}
@end

@implementation CDVContext

//null
- (void)login:(CDVInvokedUrlCommand*)command {
    UIApplication *appDelegate = (UIApplication *)[[UIApplication sharedApplication] delegate];
    SEL selector = NSSelectorFromString(@"login:");
    
    if ([appDelegate respondsToSelector:selector]) {
        [appDelegate performSelector:selector withObject:nil afterDelay:0];
    }
}

- (void)go:(CDVInvokedUrlCommand*)command {
    
}

- (void)quit:(CDVInvokedUrlCommand*)command {
    UIApplication *appDelegate = (UIApplication *)[[UIApplication sharedApplication] delegate];
    
    SEL selector = NSSelectorFromString(@"home");
    if ([appDelegate respondsToSelector:selector]) {
        [appDelegate performSelector:selector withObject:nil afterDelay:0];
    }
}

- (void) home:(CDVInvokedUrlCommand*)command {
    UIApplication *appDelegate = (UIApplication *)[[UIApplication sharedApplication] delegate];
    
    SEL selector = NSSelectorFromString(@"home");
    if ([appDelegate respondsToSelector:selector]) {
        [appDelegate performSelector:selector withObject:nil afterDelay:0];
    }
}

- (void) helpinfo:(CDVInvokedUrlCommand*)command {
    NSString* k = [command.arguments objectAtIndex:0];
    NSString *info = [GlobalInfo getHelpInfo: k];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:info];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) user: (CDVInvokedUrlCommand*)command {
    UIApplication *appDelegate = (UIApplication *)[[UIApplication sharedApplication] delegate];
    
    NSDictionary *dictResult = [[NSDictionary alloc] init];
    CDVPluginResult* pluginResult = nil;
    
    if ([appDelegate respondsToSelector:@selector(user)]) {
        id u = [appDelegate performSelector:@selector(user) withObject:nil];
        if ([u respondsToSelector:@selector(toDictionary)]) {
            dictResult = [u performSelector:@selector(toDictionary) withObject:nil];
        }
    }
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictResult];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
