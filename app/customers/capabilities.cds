using CustomersService as service from '../../srv/customers-service';

// Semantic key will also show the editing status (draft etc)
annotate CustomersService.Customers with @odata.draft.enabled @Common.SemanticKey: [account_id]; //[customer_name];

// Block INSERT, DELETE on the top-level Customer entity - these are only updated from Totango
// To block UPDATE we use @readonly on the Totango fields - see data-model.cds.
annotate CustomersService.Customers with
    @Capabilities.InsertRestrictions.Insertable: false
    @Capabilities.DeleteRestrictions.Deletable: false;

// Block all edit capabilities
annotate CustomersService.ProductCategories with
    @Capabilities.InsertRestrictions.Insertable: false
    @Capabilities.DeleteRestrictions.Deletable: false
    @Capabilities.UpdateRestrictions.Updatable: false;
annotate CustomersService.Products with
    @Capabilities.InsertRestrictions.Insertable: false
    @Capabilities.DeleteRestrictions.Deletable: false
    @Capabilities.UpdateRestrictions.Updatable: false;


// Edit capability only
annotate CustomersService.MaturityAssessments with
    @Capabilities.InsertRestrictions.Insertable: false
    @Capabilities.DeleteRestrictions.Deletable: false;

// Prepare for Analytics
annotate CustomersService.MaturityAssessmentsAnalytics with @(
    Aggregation.ApplySupported : {
        Transformations          : [
            'aggregate',
            'topcount',
            'bottomcount',
            'identity',
            'concat',
            'groupby',
            'filter',
            'expand',
            'top',
            'skip',
            'orderby',
            'search'
        ],
        Rollup                   : #None,
        PropertyRestrictions     : true,
        GroupableProperties : [
            customer_ID,
            domainCode,
            domainName,
            dimensionCode,
            dimensionName
        ],
        AggregatableProperties : [
          {
            Property : score,
            RecommendedAggregationMethod : 'max',
            SupportedAggregationMethods : [
                'min',
                'max',
                'average'
            ]
          }
        ],
    }
);
