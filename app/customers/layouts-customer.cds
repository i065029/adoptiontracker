using CustomersService as service from '../../srv/customers-service';
using from './layouts-activities';
using from './layouts-maturity';
using from './layouts-activation-checklists';

//
// annotations that control the fiori layout
//

annotate CustomersService.Customers with @UI : {
    HeaderInfo          : {
        TypeName       : '{i18n>Customer}',
        TypeNamePlural : '{i18n>Customers}',
        Title          : { Value : customer_name },
    },
    PresentationVariant : {
        Text           : 'Default',
        Visualizations : ['@UI.LineItem'],
        SortOrder      : [{
            $Type      : 'Common.SortOrderType',
            Property   : acv,
            Descending : true
        }],
        // We must force the request of the consumpton_actual property
        // to allow the after-READ CAP handler to work and calculate
        // the consumption percente value.
        RequestAtLeast : [
            consumption_actual
        ],
    },
    SelectionFields     : [
        to_cee_id,
        customer_name,
        market_unit,
        deleted
    ],

    LineItem            : [
        {
            Value : account_id,
            ![@UI.Importance] : #High,
            ![@HTML5.CssDefaults] : {width: '100%'}
        },
        {
            Value : market_unit,
            ![@HTML5.CssDefaults] : {width: '8em'},
        },
        {Value : acv},
        {
            Value : next_renewal_date,
            Criticality : next_renewal_date_criticality,
            CriticalityRepresentation: #WithoutIcon,
            ![@UI.Importance] : #High
        },
        {
            Value : to_cee_id,
            ![@HTML5.CssDefaults] : {width: '12em'},
        },
        {
            Value : cs_sentiment,
            Criticality : cs_sentiment_criticality,
            CriticalityRepresentation: #OnlyIcon,
            ![@HTML5.CssDefaults] : {width: '8em'}
        },
        {Value : cs_sentiment_reason},
        {
            Value : cloud_health_assessment,
            Criticality : cloud_health_assessment_criticality,
            CriticalityRepresentation: #OnlyIcon, ![@UI.Importance] : #Low,
            ![@HTML5.CssDefaults] : {width: '9em'}
        },
        {
          Criticality : btp_act_criticality,
          Value : btp_activated,
          ![@HTML5.CssDefaults] : {width: '13em'}
        },
        {
          Value : engagement_status_code,
          ![@UI.Importance] : #High,
          ![@HTML5.CssDefaults] : {width: '13em'}
        }
    ],

    HeaderFacets  : [{
        $Type : 'UI.ReferenceFacet',
        ID : 'CustomerHeader',
        Target : '@UI.FieldGroup#CustomerHeader',
        Label : ''
    },{
        $Type : 'UI.ReferenceFacet',
        Target : '@UI.DataPoint#ACV'
    }, {
        $Type : 'UI.ReferenceFacet',
        Target : '@UI.DataPoint#RenewalDate'
    },{
        $Type : 'UI.ReferenceFacet',
        Target : '@UI.Chart#ConsumptionMicroChart'
    }, {
        $Type : 'UI.ReferenceFacet',
        Target : '@UI.Chart#ActivationMicroChart'
    }, {
        $Type : 'UI.ReferenceFacet',
        ID : 'Sentiment',
        Target : '@UI.FieldGroup#Sentiment'
    }, {
        $Type : 'UI.ReferenceFacet',
        ID : 'HeaderLinks',
        Target : '@UI.FieldGroup#HeaderLinks'
    }],

    Facets  : [{
        $Type : 'UI.CollectionFacet',
        Label : '{i18n>Customer}',
        ID    : 'Customer',
        Facets: [{
            $Type : 'UI.ReferenceFacet',
            ID : 'StatusInfo',
            Target : '@UI.FieldGroup#StatusInfo',
            Label : 'Status Info'
        }, {
            $Type : 'UI.ReferenceFacet',
            ID : 'ActivationStatus',
            Target : '@UI.FieldGroup#ActivationStatus',
            Label : 'Activation Status'
        }]
    }, {
        $Type : 'UI.ReferenceFacet',
        ID : 'Maturity10Chart',
        Target : 'to_maturityAnalytics/@UI.Chart',
        Label : '{i18n>MaturityChart}'
    }, {
        $Type : 'UI.ReferenceFacet',
        ID : 'Maturity20Table',
        Target : 'to_maturity/@UI.LineItem',
        Label : '{i18n>Maturity}'
    }, {
        $Type : 'UI.ReferenceFacet',
        ID : 'Activities',
        Target : 'to_activities/@UI.LineItem',
        Label : '{i18n>ENGAGEMENT_PLAN}'
    }, {
        $Type : 'UI.ReferenceFacet',
        ID : 'Risks',
        Target : 'to_risks/@UI.LineItem',
        Label : '{i18n>RISKS}'
    }, {
        $Type : 'UI.ReferenceFacet',
        ID : 'ActivationChecklists',
        Target : 'to_act_progress/@UI.PresentationVariant',
        Label : '{i18n>ACTIVATION_CHECKLISTS}'
    }
  ],

    FieldGroup#CustomerHeader : {
        Data : [
            { Value : to_cee_id },
            { Value : region },
            { Value : market_unit }
        ]
    },

    FieldGroup#HeaderLinks : {
        Data : [
            {
                $Type : 'UI.DataFieldWithUrl',
                Value : 'View Cloud Reporting',
                Url : cr_url,
                IconUrl : '',
            }
        ],

    },

    FieldGroup#Sentiment : {
        Data : [
            { Value : contract_start_date },
            { Value : cs_sentiment, Criticality : cs_sentiment_criticality, CriticalityRepresentation: #OnlyIcon },
            { Value : cs_sentiment_reason },
            { Value : cloud_health_assessment, Criticality : cloud_health_assessment_criticality, CriticalityRepresentation : #OnlyIcon, },
            // To calculate the `consumption percentage` in the CAP after-READ
            // we must force-load the consumption actual value on the object
            // page.
            // The property is set to hidden in the field-control annotations.
            { Value : consumption_actual }
        ],

    },

    FieldGroup#StatusInfo : {
        Data : [
            { Value : planned_apps },
            { Value : live_apps },
            { Value : exec_sponsor_required },
            { Value : executive_alignment_code },
            { Value : partner_type_code },
            { Value : partner },
            { Value : rise_status_code },
            { Value : paygo_status_code },
            { Value : adjustment },
            { Value : adjustment_reason_code }
        ]
    },

    FieldGroup#ActivationStatus : {
        Data : [
            { Value : btp_activated },
            { Value : activation_phase_code },
            { Value : engagement_status_code },
            { Value : activation_progress },

        ]
    },

    DataPoint#ACV : {
        $Type : 'UI.DataPointType',
        Value : acv,
        Title : 'ACV'
    },
    DataPoint#RenewalDate : {
        $Type : 'UI.DataPointType',
        Value : next_renewal_date,
        Title : 'Renewal Date',
        Criticality : next_renewal_date_criticality,
    },

    Chart#ConsumptionMicroChart : {
        $Type : 'UI.ChartDefinitionType',
        Title : 'Consumption',
        ChartType : #Donut,
        Measures : [
            consumption_perc
        ],
        MeasureAttributes : [
            {
                $Type : 'UI.ChartMeasureAttributeType',
                Measure : consumption_perc,
                Role : #Axis1,
                DataPoint : '@UI.DataPoint#Consumption',
            }
        ]
    },

    DataPoint#Consumption : {
        Value : consumption_perc,
        Title : 'Consumption',
        Description : 'Radial Micro Chart',
        TargetValue : 100
    },

    Chart#ActivationMicroChart : {
        $Type : 'UI.ChartDefinitionType',
        Title : 'Activation',
        ChartType : #Donut,
        Measures : [
            activation_progress
        ],
        MeasureAttributes : [
            {
                $Type : 'UI.ChartMeasureAttributeType',
                Measure : activation_progress,
                Role : #Axis1,
                DataPoint : '@UI.DataPoint#Act',
            }
        ]
    },

    DataPoint#Act : {
        Value : activation_progress,
        Title : 'Activation',
        Description : 'Radial Micro Chart',
        TargetValue : 100,
    }
};
