#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <AddressBookUI/AddressBookUI.h>
#import <Cordova/CDVPlugin.h>

@interface ContactChooser : CDVPlugin <ABPersonViewControllerDelegate, ABPeoplePickerNavigationControllerDelegate, UIActionSheetDelegate>

@property(strong) NSString* callbackID;

- (void) chooseContact:(CDVInvokedUrlCommand*)command;

@end
