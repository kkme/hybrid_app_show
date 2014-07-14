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
#import "JfpalConnection.h"

@class PyConn;


@interface JfpalConnection () {
    NSMutableArray *requestPoll;
    NSInteger requestTag;
}
@end

@implementation JfpalConnection

- (void)pluginInitialize
{
    requestPoll = [[NSMutableArray alloc] init];
    requestTag = 0;
}


- (void)safeAjax:(CDVInvokedUrlCommand*)command
{    
    // Check command.arguments here.
    [self.commandDelegate runInBackground:^{
        //NSString* url = [command.arguments objectAtIndex:0];
        NSString *url =[NSString stringWithFormat:@"%@", @"" ];
        
        NSDictionary* postData = [command.arguments objectAtIndex:1];
        
        AFHTTPRequestOperation * request = [[PyConn sharedManager] request:url param:postData delegate:self withTag:++requestTag];
        
        [requestPoll addObject:@[request, command, [NSDate date] ]];
    }];
}

- (void) requestFinishedWithOperation:(AFHTTPRequestOperation *)operation {
    NSMutableDictionary *respData = [[PyConn sharedManager] parse: operation];
    
    
    if(respData == nil) {
        //[PyConn networkError];
        return;
    }
    
    for (NSArray *pair in requestPoll) {
        if (pair[0] == operation) {
            CDVPluginResult* pluginResult = nil;
            
            if (! [[respData objectForKey:@"respCode"] isEqualToString:@"0000"]) {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:respData];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:((CDVInvokedUrlCommand*)pair[1]).callbackId];
            }
            else {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:respData];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:((CDVInvokedUrlCommand*)pair[1]).callbackId];
            }
            
            [requestPoll removeObject:pair];
            break;
        }
    }

    //timeout
    for (NSArray *pair in requestPoll) {
        NSTimeInterval timeDifference = [[NSDate date] timeIntervalSinceDate:pair[2]];
        if ( timeDifference > 30 ) {
            [self requestFailed:pair[0]];
            [requestPoll removeObject:pair];
        }
    }
}

- (void)requestFinished:(NSDictionary *)respData {
    NSLog(@"respData in SafeAjax: %@", respData);
}

- (void) requestFailedWithOperation:(AFHTTPRequestOperation *)operation {
    for (NSArray *pair in requestPoll) {
        if (pair[0] == operation) {
            CDVPluginResult* pluginResult = nil;
            
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:((CDVInvokedUrlCommand*)pair[1]).callbackId];
            [requestPoll removeObject:pair];
            break;
        }
    }
}

- (void)requestFailed:(id)request {
    NSLog(@"respData error in SafeAjax: %@", request);
}

@end
