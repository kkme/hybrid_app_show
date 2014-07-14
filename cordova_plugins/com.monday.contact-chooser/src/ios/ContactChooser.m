#import "ContactChooser.h"
#import <Cordova/CDVAvailability.h>

@interface ContactChooser ()
{
    NSArray *phoneList;
    
}
@property (nonatomic, assign) ABRecordRef person;

@property (nonatomic, retain) NSString *displayName;
@property (nonatomic, retain) NSString *email;
@property (nonatomic, retain) NSString *phone;

@end

@implementation ContactChooser
@synthesize callbackID;

- (void) chooseContact:(CDVInvokedUrlCommand*)command{
    self.callbackID = command.callbackId;
    self.phone = @"";
    
    ABPeoplePickerNavigationController *picker = [[ABPeoplePickerNavigationController alloc] init];
    picker.peoplePickerDelegate = self;
    [self.viewController presentViewController:picker animated:YES completion:nil];
}


- (void)displayPerson:(ABRecordRef)person
{
    ABMutableMultiValueRef phoneMulti = ABRecordCopyValue(person, kABPersonPhoneProperty);
	NSMutableArray *phones = [[NSMutableArray alloc] init];
    
    ABMultiValueRef multi = ABRecordCopyValue(person, kABPersonEmailProperty);
    //CFIndex index = ABMultiValueGetIndexForIdentifier(multi, identifier);
    self.email = (__bridge NSString *)ABMultiValueCopyValueAtIndex(multi, 0);
    
    self.displayName = (__bridge NSString *)ABRecordCopyCompositeName(person);
	for (int i = 0; i < ABMultiValueGetCount(phoneMulti); i++) {
		NSString *aPhone = (__bridge NSString*)ABMultiValueCopyValueAtIndex(phoneMulti, i) ;
        //		NSString *aLabel = (__bridge NSString*)ABMultiValueCopyLabelAtIndex(phoneMulti, i) ;
		
        //		if([aLabel isEqualToString:@"_$!<Mobile>!$_"] || [aLabel isEqualToString:@"_$!<Home>!$_"] || [aLabel isEqualToString:@"iPhone"])
        //		{
        [phones addObject:aPhone];
        //		}
	}
    
	if([phones count]>0)
	{
        NSMutableArray *hasPhones = [NSMutableArray arrayWithCapacity:phones.count];
        for (NSString *tmp in phones) {
            NSString *mobileNo = [[[[[[[tmp stringByReplacingOccurrencesOfString:@"(" withString:@""]
                                       stringByReplacingOccurrencesOfString:@")" withString:@""]
                                      stringByReplacingOccurrencesOfString:@" " withString:@""]
                                     stringByReplacingOccurrencesOfString:@"-" withString:@""] stringByReplacingOccurrencesOfString:@"+86" withString:@""] stringByReplacingOccurrencesOfString:@"17951" withString:@""] stringByReplacingOccurrencesOfString:@" " withString:@""]
            ;
            
            if ([mobileNo length] != 11 || ![mobileNo hasPrefix:@"1"])
                continue;
            [hasPhones addObject:mobileNo];
        }
        if (hasPhones.count > 1) {
            UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:@"选择你要充值的手机号码" delegate:self cancelButtonTitle:nil destructiveButtonTitle:nil otherButtonTitles: nil];
            for (NSString *phone in hasPhones) {
                [sheet addButtonWithTitle:phone];
            }
            [sheet addButtonWithTitle:@"取消"];
            [sheet setCancelButtonIndex:hasPhones.count];
            [sheet showInView:APP_DELEGATE.window];
            phoneList = hasPhones;
        }else if (hasPhones.count > 0) {
            self.phone = hasPhones[0];
            [self returnContact];
        }
	}
}

- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex
{
    if (buttonIndex < phoneList.count) {
        self.phone = phoneList[buttonIndex];
        [self returnContact];
    }
}

- (void) returnContact {
    NSMutableDictionary * contact = [NSMutableDictionary dictionaryWithCapacity:2];
    
    if (self.email != nil) {
        [contact setObject:self.email forKey: @"email"];
    }
    
    if (self.displayName != nil) {
        [contact setObject:self.displayName forKey: @"displayName"];
    }
    
    if (self.phone != nil) {
        [contact setObject:self.phone forKey: @"phoneNumber"];
    }
    
    
    [super writeJavascript:[[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:contact] toSuccessCallbackString:self.callbackID]];
}

- (BOOL)peoplePickerNavigationController: (ABPeoplePickerNavigationController *)peoplePicker
      shouldContinueAfterSelectingPerson:(ABRecordRef)person {
    [self.viewController dismissViewControllerAnimated:YES completion:^{
        
    }];
    [self displayPerson:person];
    
    return NO;
}

- (BOOL)peoplePickerNavigationController:(ABPeoplePickerNavigationController*)peoplePicker
      shouldContinueAfterSelectingPerson:(ABRecordRef)person
                                property:(ABPropertyID)property
                              identifier:(ABMultiValueIdentifier)identifier
{
    if (kABPersonEmailProperty == property)
    {
        ABMultiValueRef multi = ABRecordCopyValue(person, kABPersonEmailProperty);
        CFIndex index = ABMultiValueGetIndexForIdentifier(multi, identifier);
        self.email = (__bridge NSString *)ABMultiValueCopyValueAtIndex(multi, index);
        self.displayName = (__bridge NSString *)ABRecordCopyCompositeName(person);
        ABMultiValueRef multiPhones = ABRecordCopyValue(person, kABPersonPhoneProperty);
        for(CFIndex i = 0; i < ABMultiValueGetCount(multiPhones); i++) {
            if(identifier == ABMultiValueGetIdentifierAtIndex (multiPhones, i)) {
                self.phone = (__bridge NSString *)ABMultiValueCopyValueAtIndex(multiPhones, i);
                break;
            }
        }

        [self returnContact];
        
        [self.viewController dismissViewControllerAnimated:YES completion:nil];
        return NO;
    }
    return YES;
}

- (BOOL) personViewController:(ABPersonViewController*)personView shouldPerformDefaultActionForPerson:(ABRecordRef)person property:(ABPropertyID)property identifier:(ABMultiValueIdentifier)identifierForValue
{
    return YES;
}

- (void)peoplePickerNavigationControllerDidCancel:(ABPeoplePickerNavigationController *)peoplePicker{
    [self.viewController dismissViewControllerAnimated:YES completion:nil];
    [super writeJavascript:[[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR
                                                              messageAsString:@"People picker abort"]
                                            toErrorCallbackString:self.callbackID]];
}

@end
