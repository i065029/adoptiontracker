using CustomersService as service from '../../srv/customers-service';

//
// annotations that control the behavior of fields and actions
//

annotate CustomersService.Customers {
    cr_url @UI.Hidden;
    consumption_actual @UI.Hidden;
    deleted @Common.FilterDefaultValue: false;
}

annotate CustomersService.Activities {
    ID @UI.Hidden;
    activity_category @mandatory; // @Core.Immutable; //TODO: BUG activities will not get saved when this annotation is present!
}

annotate CustomersService.Risks {
    ID @UI.Hidden;
}

annotate CustomersService.ActivityProducts {
    ID @UI.Hidden;
}

annotate CustomersService.Products {
    category_ID @UI.Hidden;
}

annotate CustomersService.ProductCategories {
    ID @UI.Hidden;
}

annotate CustomersService.MaturityAssessments {
    @readonly dimension;
}