using ActivitiesService as service from '../../srv/customers-service';

//
// annotations that control the fiori layout
//

annotate ActivitiesService.Activities with @UI : {
    
    HeaderInfo          : {
        TypeName       : 'Activity',
        TypeNamePlural : 'Activities',
        Title          : { Value : short_text },
    },
    PresentationVariant : {
        Text           : 'Default',
        Visualizations : ['@UI.LineItem'],
        SortOrder      : [{
            $Type      : 'Common.SortOrderType',
            Property   : activity_target,
            Descending : true
        }]
    },
    SelectionFields     : [
        createdBy,
        to_customer_ID,
        activity_category_code
    ],

    LineItem            : [
        {
            $Type : 'UI.DataField',
            Value : short_text
        },
        {
            $Type : 'UI.DataField',
            Value : activity_category_code,
            ![@HTML5.CssDefaults] : {width: '8em'},
        },
        {
            $Type : 'UI.DataField',
            Value : activity_target
        },
        {
            $Type : 'UI.DataField',
            Value : activity_completed_at
        },
        {
            $Type : 'UI.DataField',
            Value : to_customer_ID
        }
    ],

    HeaderFacets  : [{
        $Type : 'UI.ReferenceFacet',
        ID : 'ActivityStatus',
        Target : '@UI.FieldGroup#ActivityStatus',
        Label : 'Status'
    },{
        $Type : 'UI.ReferenceFacet',
        ID : 'ActivityManaged',
        Target : '@UI.FieldGroup#ActivityManaged',
        Label : 'Changes'
    }],

    Facets  : [{
        $Type : 'UI.CollectionFacet',
        Label : 'Activity',
        ID    : 'Activity',
        Facets : [{
            $Type : 'UI.ReferenceFacet',
            ID : 'ActivityDescription',
            Target : '@UI.FieldGroup#ActivityDescription',
            Label : 'Info'
        }]
    }, {
        $Type : 'UI.ReferenceFacet',
        Target : 'to_products/@UI.LineItem',
        Label : 'Products'
    }],

    FieldGroup#ActivityStatus : {
        Data : [
            { Value : activity_category_code },
            { Value : activity_type_code },
            { Value : activity_status_code },
            { Value : activity_target },
        ]
    },
    FieldGroup#ActivityManaged : {
        Data : [
            { Value : createdBy },
            { Value : createdAt },
            { Value : modifiedBy },
            { Value : modifiedAt }
        ]
    },
    FieldGroup#ActivityDescription : {
        Data : [
            { Value : activity_ask },
            { Value : activity_completed_at },
            { Value : sap_program_code },
            { Value : impl_support_team_code },
        ]
    }
};

annotate ActivitiesService.ActivityProducts with @UI : {
    Identification  : [
        { Value : ID }
    ],

    HeaderInfo  : {
        TypeName : 'Product',
        TypeNamePlural : 'Products',
        //Title : { Value : product.description },
        //Description : { Value : product.description }
    },

    LineItem : [
        { Value : product_ID },
        { Value : product.category.description }
    ],
};

// annotate CustomersService.Risks with @UI : {
//     Identification : [
//         { Value : risk_description }
//     ],
//     HeaderInfo  : {
//         TypeName : '{i18n>Risk}',
//         TypeNamePlural : '{i18n>Risks}',
//         Title : { Value : risk_description }
//     },
//     PresentationVariant  : {
//         Text : 'Default',
//         Visualizations : ['@UI.LineItem']
//     },
//     SelectionFields  : [
//     ],

//     LineItem  : [
//         { Value : risk_type_code},
//         { Value : risk_description},
//         { Value : risk_priority_code},
//         { Value : risk_status_code},
//         { Value : risk_target}
//     ],

//     HeaderFacets  : [{
//         $Type : 'UI.ReferenceFacet',
//         ID : 'RiskStatus',
//         Target : '@UI.FieldGroup#RiskStatus',
//         Label : 'Status'
//     },{
//         $Type : 'UI.ReferenceFacet',
//         ID : 'RiskManagement',
//         Target : '@UI.FieldGroup#RiskManagement',
//         Label : 'Changes'
//     }],

//     Facets  : [{
//         $Type : 'UI.CollectionFacet',
//         Label : 'Activity',
//         ID    : 'Activity',
//         Facets : [{
//             $Type : 'UI.ReferenceFacet',
//             ID : 'ActivityDescription',
//             Target : '@UI.FieldGroup#ActivityDescription',
//             Label : 'Info'
//         }]
//     }],

//     FieldGroup#RiskStatus : {
//         Data : [
//             { Value : risk_type_code },
//             { Value : risk_priority_code },
//             { Value : risk_status_code },
//             { Value : risk_target}
//         ]
//     },
//     FieldGroup#RiskManagement : {
//         Data : [
//             { Value : createdBy },
//             { Value : createdAt },
//             { Value : modifiedBy },
//             { Value : modifiedAt}
//         ]
//     },
//     FieldGroup#ActivityDescription : {
//         Data : [
//             { Value : risk_description },
//             { Value : risk_mitigation_plan }
//         ]
//     }
// };