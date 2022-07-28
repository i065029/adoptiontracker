using ActivitiesService as service from '../../srv/customers-service';

annotate ActivitiesService.Activities with {

    to_customer @(Common : {
        ValueList : {
            Label : 'Customer',
            CollectionPath : 'Customers',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    ValueListProperty : 'ID',
                    LocalDataProperty : to_customer_ID
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'customer_name',
                    LocalDataProperty : to_customer.customer_name
                }
            ]
        }
    });

    activity_category @(Common : {
        ValueListWithFixedValues: true,
        ValueList : {
            Label : 'Category',
            CollectionPath : 'ActivityCategory',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    ValueListProperty : 'code',
                    LocalDataProperty : activity_category_code
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'name',
                    LocalDataProperty : activity_category.name
                }
            ]
        },
    });

    createdBy @(Common : {
        ValueList : {
            Label : 'Created By',
            CollectionPath : 'Cees',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    ValueListProperty : 'email',
                    LocalDataProperty : createdBy
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'name',
                    LocalDataProperty : createdBy
                }
            ]
        }
    });

};
