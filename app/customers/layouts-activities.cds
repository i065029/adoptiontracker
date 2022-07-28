using CustomersService as service from '../../srv/customers-service';

//
// annotations that control the fiori layout
//

annotate CustomersService.Activities with @UI : {
    HeaderInfo  : {
        TypeName : '{i18n>Activity}',
        TypeNamePlural : '{i18n>Activities}',
        Title : { Value : short_text }
    },
    PresentationVariant  : {
        Text : 'Default',
        Visualizations : ['@UI.LineItem'],
        SortOrder : [{
            $Type : 'Common.SortOrderType',
            Property : createdAt,
            Descending : true,
        }],
        // We must force the request of the consumpton_actual property
        // to allow the after-READ CAP handler to work and calculate 
        // the consumption percente value.
        RequestAtLeast : [
            activity_description
        ]
    },

    // Setup a segmented button table filter
    // Note: Must handle nil value otherwise can end up with hidden
    // Activities where the user hasnt entered a category value!
    SelectionVariant#ActivityAllFilter : {
        Text : 'All',
        SelectOptions : [{
            $Type : 'UI.SelectOptionType',
            PropertyName : activity_category_code,
            Ranges : [{
                $Type : 'UI.SelectionRangeType',
                Sign : #I,
                Option : #NE,
                Low : 99
            }]
        }]
    },
    SelectionVariant#ActivityTransactionFilter : {
        Text : 'Transactions',
        SelectOptions : [{
            $Type : 'UI.SelectOptionType',
            PropertyName : activity_category_code,
            Ranges : [{
                $Type : 'UI.SelectionRangeType',
                Sign : #I,
                Option : #NE,
                Low : 1
            }]
        }]
    },
    SelectionVariant#ActivityAdoptionFilter : {
        Text : 'FRE Activities',
        SelectOptions : [{
            $Type : 'UI.SelectOptionType',
            PropertyName : activity_category_code,
            Ranges : [{
                $Type : 'UI.SelectionRangeType',
                Sign : #I,
                Option : #EQ,
                Low : 1
            }]
        }]
    },

    SelectionFields  : [
        
    ],

    LineItem : [
        {
            $Type : 'UI.DataField',
            Value : activity_type_code,
            ![@HTML5.CssDefaults] : {width: '8em'}
        },
        {
            $Type : 'UI.DataField',
            Value : activity_status_code,
            ![@HTML5.CssDefaults] : {width: '8em'}
        },
        { Value : activity_target },
        {
          $Type : 'UI.DataField',
          Value : short_text,
          ![@HTML5.CssDefaults] : {width: '100%'}
        },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target : '@UI.DataPoint#rating',
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
    }, {
        $Type : 'UI.ReferenceFacet',
        ID : 'ActivityRating2',
        Target : '@UI.DataPoint#rating',
        Label : 'Rating'
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
    },{
        $Type : 'UI.ReferenceFacet',
        Target : 'to_outcomes/@UI.LineItem'
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
    },

    DataPoint #rating : {
        Value : rating,
        Visualization : #Rating,
        TargetValue : 5,
        Title : 'BTP CSP Rating'
    }
};

/**
 * SIDE-EFFECTS
 * 
 * Annotate the ActivityProducts value help field (navigation property)
 * with a side-effect to update all the product details.
 */
annotate CustomersService.ActivityProducts with @(
    Common.SideEffects #ActivityProducts : {
        SourceProperties : [
            product_ID
        ],
        TargetEntities : [
            product
        ],
    }
);

annotate CustomersService.ActivityOutcomes with @(
    Common.SideEffects #ActivityOutcomes : {
        SourceProperties : [
            kpi_code
        ],
        TargetEntities : [
            kpi
        ],
    }
);


annotate CustomersService.ActivityProducts with @UI : {
    Identification  : [
        { Value : ID }
    ],

    HeaderInfo  : {
        TypeName : 'Product',
        TypeNamePlural : 'Products'
    },

    LineItem : [
        { Value : product_ID },
        {
          $Type : 'UI.DataField',
          Value : product.description,
          ![@HTML5.CssDefaults] : {width: '100%'}
        },
        { Value : product.category.description }
    ],
};

annotate CustomersService.Risks with @UI : {
    Identification : [
        { Value : short_text }
    ],
    HeaderInfo  : {
        TypeName : '{i18n>Risk}',
        TypeNamePlural : '{i18n>Risks}',
        Title : { Value : short_text }
    },
    PresentationVariant  : {
        Text : 'Default',
        Visualizations : ['@UI.LineItem']
    },
    SelectionFields  : [
    ],

    LineItem  : [
        { Value : risk_type_code},
        { Value : short_text},
        { Value : risk_priority_code},
        { Value : risk_status_code},
        { Value : risk_target}
    ],

    HeaderFacets  : [{
        $Type : 'UI.ReferenceFacet',
        ID : 'RiskStatus',
        Target : '@UI.FieldGroup#RiskStatus',
        Label : 'Status'
    },{
        $Type : 'UI.ReferenceFacet',
        ID : 'RiskManagement',
        Target : '@UI.FieldGroup#RiskManagement',
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
    }],

    FieldGroup#RiskStatus : {
        Data : [
            { Value : risk_type_code },
            { Value : risk_priority_code },
            { Value : risk_status_code },
            { Value : risk_target}
        ]
    },
    FieldGroup#RiskManagement : {
        Data : [
            { Value : createdBy },
            { Value : createdAt },
            { Value : modifiedBy },
            { Value : modifiedAt}
        ]
    },
    FieldGroup#ActivityDescription : {
        Data : [
            { Value : risk_description },
            { Value : risk_mitigation_plan }
        ]
    }
};

annotate CustomersService.ActivityOutcomes with @UI : {
    Identification  : [
        { Value : ID }
    ],

    HeaderInfo  : {
        TypeName : '{i18n>ACTIVITY_OUTCOME}',
        TypeNamePlural : '{i18n>ACTIVITY_OUTCOME_PLURAL}'
    },

    LineItem : [
        { Value : kpi_code },
        {
            $Type : 'UI.DataField',
            Value : kpi.success_measures, 
        },
        {
            Value : result,
            ![@HTML5.CssDefaults] : {width: '100%'}
        },
        {
            $Type : 'UI.DataFieldForAnnotation',
            Target : '@UI.DataPoint#score',
        },
    ],
};

annotate CustomersService.ActivityOutcomes with @(
    UI.DataPoint #score : {
        Value : score,
        Visualization : #Rating,
        TargetValue : 5,
    }
);