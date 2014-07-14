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
#import "JfpalSafepay.h"
#import "NSDictionary+UrlEncoding.h"


@interface JfpalSafepay () {
    NSMutableArray *requestPoll;
    NSInteger requestTag;
}
@end

@implementation JfpalSafepay


- (void)doPay:(CDVInvokedUrlCommand*)command {
    NSMutableDictionary* data = [NSMutableDictionary dictionaryWithDictionary: [command.arguments objectAtIndex:0] ];
    
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    
    NSString *schema = [[appDelegate schemes] objectForKey:@"app"];
    
    NSString *s = [NSString stringWithFormat:@"%@://sdk.jfpal.com/pay?%@",
                   schema, [data urlEncodedString]
                   ];
    NSURL *url = [NSURL URLWithString:s];
    
    NSLog(@"call url: %@", url);
    
    [appDelegate setCdvPlugin:self];
    
    [appDelegate application:[UIApplication sharedApplication] handleOpenURL:url];
}

//          paraArr.push(partner);
//>         paraArr.push(externToken);
//>         paraArr.push(tradeNo);
//>         paraArr.push(bizType);
//>         paraArr.push(bizSubType);
//>         paraArr.push('jfpal');
- (void)doService:(CDVInvokedUrlCommand*)command {
    NSMutableDictionary* data = [NSMutableDictionary dictionaryWithDictionary: [command.arguments objectAtIndex:0] ];
    
    AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    NSString *schema = [[appDelegate schemes] objectForKey:@"sdk"];
    
    
    //?merchantId=%@&merchantName=%@&productId=%@&orderAmt=%d&orderDesc%@=&orderRemark=1
    
    NSString *s = [NSString stringWithFormat:@"%@://sdk.jfpal.com/pay?%@",
                   schema, [data urlEncodedString]
                   ];
    //partner, partnerName, productId, [money intValue], ];
    NSURL *url = [NSURL URLWithString:s];
    
    [appDelegate setCdvPlugin:self];
    
    [appDelegate application:[UIApplication sharedApplication] handleOpenURL:url];
    
}

@end
