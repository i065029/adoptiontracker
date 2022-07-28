using CustomersService as service from '../../srv/customers-service';

annotate CustomersService.MaturityAssessments with @UI : {
    Identification                            : [{Value : ID}],

    PresentationVariant                       : {
        Text           : 'Default',
        Visualizations : ['@UI.LineItem'],
        SortOrder      : [
            {
                $Type      : 'Common.SortOrderType',
                Property   : domain_code,
                Descending : false
            },
            {
                $Type      : 'Common.SortOrderType',
                Property   : dimension_code,
                Descending : false
            }
        ],
        RequestAtLeast : [
            domain_code,
            dimension_code,
            score,
            comments
        ]
    },

    SelectionVariant #IntegrationDomainFilter : {
        Text          : '{i18n>Integration}',
        SelectOptions : [{
            $Type        : 'UI.SelectOptionType',
            PropertyName : domain_code,
            Ranges       : [{
                $Type  : 'UI.SelectionRangeType',
                Sign   : #I,
                Option : #EQ,
                Low    : 0
            }]
        }]
    },

    SelectionVariant #IntelligentTechDomainFilter : {
        Text          : '{i18n>IntelligentTech}',
        SelectOptions : [{
            $Type        : 'UI.SelectOptionType',
            PropertyName : domain_code,
            Ranges       : [{
                $Type  : 'UI.SelectionRangeType',
                Sign   : #I,
                Option : #EQ,
                Low    : 6
            }]
        }]
    },

    SelectionVariant #DataDomainFilter        : {
        Text          : '{i18n>Data}',
        SelectOptions : [{
            $Type        : 'UI.SelectOptionType',
            PropertyName : domain_code,
            Ranges       : [{
                $Type  : 'UI.SelectionRangeType',
                Sign   : #I,
                Option : #EQ,
                Low    : 1
            }]
        }]
    },

    SelectionVariant #SecurityDomainFilter    : {
        Text          : '{i18n>Security}',
        SelectOptions : [{
            $Type        : 'UI.SelectOptionType',
            PropertyName : domain_code,
            Ranges       : [{
                $Type  : 'UI.SelectionRangeType',
                Sign   : #I,
                Option : #EQ,
                Low    : 2
            }]
        }]
    },

    SelectionVariant #AnalyticsDomainFilter   : {
        Text          : '{i18n>Analytics}',
        SelectOptions : [{
            $Type        : 'UI.SelectOptionType',
            PropertyName : domain_code,
            Ranges       : [{
                $Type  : 'UI.SelectionRangeType',
                Sign   : #I,
                Option : #EQ,
                Low    : 3
            }]
        }]
    },

    SelectionVariant #DevOpsDomainFilter      : {
        Text          : '{i18n>DevOps}',
        SelectOptions : [{
            $Type        : 'UI.SelectOptionType',
            PropertyName : domain_code,
            Ranges       : [{
                $Type  : 'UI.SelectionRangeType',
                Sign   : #I,
                Option : #EQ,
                Low    : 4
            }]
        }]
    },

    SelectionVariant #DigitalExpDomainFilter  : {
        Text          : '{i18n>DigitalExp}',
        SelectOptions : [{
            $Type        : 'UI.SelectOptionType',
            PropertyName : domain_code,
            Ranges       : [{
                $Type  : 'UI.SelectionRangeType',
                Sign   : #I,
                Option : #EQ,
                Low    : 5
            }]
        }]
    },

    Facets                                    : [{
        $Type  : 'UI.CollectionFacet',
        Label  : '{i18n>Maturity}',
        ID     : 'Maturity',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            ID     : 'MaturityTable',
            Target : '@UI.LineItem',
            Label  : '{i18n>MaturityAssessment}'
        }]
    }],

    LineItem                                  : [
        {
            $Type : 'UI.DataField',
            Value : domain_code,
            Label : '{i18n>Domain}',
            ![@UI.Hidden],
        },
        {
            $Type : 'UI.DataField',
            Value : dimension_code,
            Label : '{i18n>Dimension}',
        },
        {
            $Type  : 'UI.DataFieldForAnnotation',
            Target : '@UI.DataPoint#score',
            Label  : '{i18n>Score}',
        },
        {
            $Type : 'UI.DataField',
            Value : comments,
            Label : '{i18n>Comments}',
        }
    ],

    DataPoint #score                          : {
        Value                : score,
        Visualization        : #Rating,
        TargetValue          : 5,
        ![@Common.QuickInfo] : dimension.name,
    }
};

annotate CustomersService.MaturityAssessmentsAnalytics with @UI : {
    Identification : [{Value : ID}],

    Facets         : [{
        $Type  : 'UI.CollectionFacet',
        Label  : '{i18n>Maturity}',
        ID     : 'Maturity',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            ID     : 'maturityChart',
            Target : '@UI.Chart',
            Label  : '{i18n>MaturityChart}'
        }]
    }],

    Chart          : {
        $Type               : 'UI.ChartDefinitionType',
        //Title : '{i18n>MaturityAssessment}',
        ChartType           : #Column,
        //Dimensions : [domainName, dimensionName],
        Dimensions          : [domainName],
        Measures            : [avgScore],
        MeasureAttributes   : [{
            $Type   : 'UI.ChartMeasureAttributeType',
            Measure : avgScore,
            Role    : #Axis3
        }],
        DimensionAttributes : [
            // {
            //     $Type : 'UI.ChartDimensionAttributeType',
            //     Dimension: dimensionCode,
            //     Role : #Series
            // },
            // {
            //     $Type : 'UI.ChartDimensionAttributeType',
            //     Dimension: dimensionName,
            //     Role : #Series
            // },
            {
                $Type     : 'UI.ChartDimensionAttributeType',
                Dimension : domainCode,
                Role      : #Category
            },
            {
                $Type     : 'UI.ChartDimensionAttributeType',
                Dimension : domainName,
                Role      : #Category
            }
        ]
    /* Actions : [
        {
            $Type : 'UI.DataFieldForIntentBasedNavigation',
            Label : 'txt DataFieldForIntentBasedNavigation',
            SemanticObject : 'provide_semantic_object',
            Action : 'provide_action_name'
        }
    ] */
    }
};

annotate CustomersService.MaturityAssessmentsAnalytics with @(Analytics.AggregatedProperties : [
    {
        Name                 : 'avgScore',
        AggregationMethod    : 'average',
        AggregatableProperty : 'score',
        ![@Common.Label]     : 'Average Score'
    },
    {
        Name                 : 'minScore',
        AggregationMethod    : 'min',
        AggregatableProperty : 'score',
        ![@Common.Label]     : 'Min Score'
    },
    {
        Name                 : 'maxScore',
        AggregationMethod    : 'max',
        AggregatableProperty : 'score',
        ![@Common.Label]     : 'Max Score'
    }
]);


annotate CustomersService.MaturityDimensionLevels with @UI : {
    PresentationVariant : {
        Text           : 'Default',
        SortOrder      : [
            {
                $Type      : 'Common.SortOrderType',
                Property   : dimension_code,
                Descending : false
            },
            {
                $Type      : 'Common.SortOrderType',
                Property   : maturity,
                Descending : false
            }
        ],
        GroupBy        : [dimension.code],
        Visualizations : ['@UI.LineItem'],
        RequestAtLeast : [
            dimension_code,
            maturity
        ]
    },

    Facets              : [{
        $Type  : 'UI.CollectionFacet',
        Label  : '{i18n>MaturityLevels}',
        ID     : 'MaturityLevels',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            ID     : 'MaturityLevelsTable',
            Target : '@UI.LineItem',
            Label  : '{i18n>MaturityLevels}'
        }]
    }],

    LineItem            : [
        {
            $Type : 'UI.DataField',
            Value : dimension_code,
            Label : '{i18n>Dimension}',
        },
        {
            $Type  : 'UI.DataFieldForAnnotation',
            Target : '@UI.DataPoint#maturity',
            Label  : '{i18n>MaturityLevel}',
        },
        {
            $Type : 'UI.DataField',
            Value : descr,
            Label : '{i18n>Description}',
        }
    ],

    DataPoint #maturity : {
        Value         : maturity,
        Visualization : #Rating,
        TargetValue   : 5
    }
};
