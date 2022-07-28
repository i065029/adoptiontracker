using CustomersService as service from '../../srv/customers-service';
using from './layouts-activities';
using from './layouts-maturity';

/**
 * NOTE: CodeLists are already annotated by CAP to show value helps.
 * We include them here simply to add the annotation to show them as
 * a dropdown list.
 */


/**
 * Setup value helps on the Customers entity properties.
 */
annotate CustomersService.Customers with {

    to_cee @Common.ValueList: {
        CollectionPath : 'Cees',
        Label : 'CEE',
        Parameters : [
            {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: to_cee_id, ValueListProperty: 'id'},
            {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name'},
            {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'email'}
        ],
        SearchSupported : true
    };

    executive_alignment @Common.ValueListWithFixedValues;

    adjustment_reason @Common.ValueListWithFixedValues;

    rise_status @Common.ValueListWithFixedValues;

    partner_type @Common.ValueListWithFixedValues;

    paygo_status @Common.ValueListWithFixedValues;

    market_unit @Common.ValueList: {
        CollectionPath : 'MarketUnitsValueHelp',
        Label : 'Market Unit',
        Parameters : [
            {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: market_unit, ValueListProperty: 'market_unit'},
        ]
    };
    market_unit @Common.ValueListWithFixedValues;

    activation_phase @Common.ValueListWithFixedValues;
    engagement_status @Common.ValueListWithFixedValues;
}

/**
 * Setup value helps on the Activities entity properties.
 */
annotate CustomersService.Activities with {
    activity_category @Common.ValueListWithFixedValues;

    activity_type @Common.ValueListWithFixedValues;

    activity_type @Common.ValueList: {
        CollectionPath : 'ActivityType',
        Label : 'Activity Type',
        Parameters : [
            {$Type: 'Common.ValueListParameterIn', LocalDataProperty: activity_category_code, ValueListProperty: 'category'},
            {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: activity_type_code, ValueListProperty: 'code'},
            {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'name'}
        ]
    };

    activity_status @Common.ValueListWithFixedValues;

    sap_program @Common.ValueListWithFixedValues;

    impl_support_team @Common.ValueListWithFixedValues;
}

/**
 * Setup value helps on the Risks entity properties.
 */
annotate CustomersService.Risks with {
    risk_status @Common.ValueListWithFixedValues;
    risk_type @Common.ValueListWithFixedValues;
    risk_priority @Common.ValueListWithFixedValues;
}

/**
 * Add a value help on Activity Products, showing the list of values
 * from the Products entity.
 */
annotate CustomersService.ActivityProducts with {
    product @Common.ValueListWithFixedValues;
    product @Common.ValueList: {
        CollectionPath : 'Products',
        Label : 'Products',
        Parameters : [
            { $Type : 'Common.ValueListParameterInOut', LocalDataProperty : product_ID, ValueListProperty : 'ID' },
            { $Type : 'Common.ValueListParameterDisplayOnly', ValueListProperty : 'description' },
            { $Type : 'Common.ValueListParameterDisplayOnly', ValueListProperty : 'category/description' }
        ],
        PresentationVariantQualifier : 'SortOrderProducts'
    };
}

/**
 * Add a presentation variant to set the sort order on the above
 * products value list.
 * This annotation needs to be set on the `CollectionPath` entity.
 * Note: Do not set the Visualisation property here - stop sit working!
 */
annotate CustomersService.Products with @UI : {
    PresentationVariant#SortOrderProducts : {
       Text           : 'Default',
       SortOrder      : [{
           $Type      : 'Common.SortOrderType',
           Property   : name,
           Descending : false
       }]
    }
};

/**
 * Add a value help on Activity Products, showing the list of values
 * from the Products entity.
 */
annotate CustomersService.ActivityOutcomes with {
    kpi @Common.ValueListWithFixedValues;
    kpi @Common.ValueList: {
        CollectionPath : 'OutcomeKPIs',
        Label : '{18n>ACTIVITY_OUTCOME_TITLE',
        Parameters : [
            { $Type : 'Common.ValueListParameterInOut', LocalDataProperty : kpi_code, ValueListProperty : 'code' },
            { $Type : 'Common.ValueListParameterDisplayOnly', ValueListProperty : 'name' },
            { $Type : 'Common.ValueListParameterDisplayOnly', ValueListProperty : 'success_measures' }
        ]
    };
};

annotate service.Activities with @(
    UI.Facets : [
        {
            $Type : 'UI.CollectionFacet',
            Label : '{i18n>ACTIVITY}',
            ID : 'Activity',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID : 'ActivityDescription',
                    Target : '@UI.FieldGroup#ActivityDescription',
                    Label : 'Info',
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            Target : 'to_products/@UI.LineItem',
            Label : '{i18n>Products}',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Target : 'to_outcomes/@UI.LineItem',
            Label : '{i18n>Outcomes}',
        },
    ]
);
