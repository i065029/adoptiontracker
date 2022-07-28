using ActivitiesService as service from '../../srv/customers-service';

annotate ActivitiesService.Activities with @title : 'Activity' {
    to_customer @title : 'Customer' @Common.Text : to_customer.customer_name @Common.TextArrangement : #TextOnly; 
    activity_category @title : 'Category' @Common.Text : activity_category.name @Common.TextArrangement : #TextOnly;
    activity_type         @title                 : 'Type'  @Common.Text               : activity_type.name  @Common.TextArrangement     : #TextOnly;
    activity_status       @title                 : 'Status'  @Common.Text             : activity_status.name  @Common.TextArrangement   : #TextOnly;
    short_text            @title                 : 'Short description';
    activity_description  @title                 : 'Description'  @UI.MultiLineText;
    activity_ask          @title                 : 'Ask';
    activity_completed_at @title                 : 'Completed on';
    activity_target       @title                 : 'Target';
    sap_program           @title                 : 'SAP program'  @Common.Text        : sap_program.name  @Common.TextArrangement       : #TextOnly;
    impl_support_team     @title                 : 'Impl. support team'  @Common.Text : impl_support_team.name  @Common.TextArrangement : #TextOnly;
};

annotate ActivitiesService.Customers with @title : 'Customer' {
    ID @title : 'Customer' @Common.Text : customer_name @Common.TextArrangement : #TextOnly; 
};

annotate ActivitiesService.ActivityCategory with @title : 'Category' {
    code @title : 'Category' @Common.Text : name @Common.TextArrangement : #TextOnly;
};
