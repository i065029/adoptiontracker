using {adoptiontracker.db as db} from '../db/data-model';
using {FREActivityService as external } from '../srv/external/FREActivityService';

service CustomersService @(path : '/cust') @(requires : ['AdoptionTrackerViewer']) {
    entity Customers                    as projection on db.Customers;

    /**
     * Dynamic value help entity to find all the market units within the
     * Customers dataset.
     * 
     * NOTE: All value helps in SAPUI5 1.104.* an onwards require a key field.
     */
    @readonly
    entity MarketUnitsValueHelpDistinct as
        select distinct market_unit from db.Customers
        where deleted =  false
          and market_unit <> '';

    entity MarketUnitsValueHelp as projection on MarketUnitsValueHelpDistinct {
        key market_unit
    };

    entity Activities                   as projection on db.Activities {
        *,
        to_customer : redirected to Customers
    };

    entity Risks                        as projection on db.Risks {
        *,
        to_customer : redirected to Customers
    };

    entity MaturityAssessments          as projection on db.MaturityAssessments {
        *,
        customer : redirected to Customers
    };

    @readonly
    @cds.redirection.target : false
    entity MaturityAssessmentsAnalytics as projection on db.MaturityAssessmentsAnalytics {
        *,
        customer : redirected to Customers
    };

    entity Regions                      as projection on db.Regions;
    entity MarketUnits                  as projection on db.MarketUnits;
    entity MarketUnitCees               as projection on db.MarketUnitCees;
    entity Cees                         as projection on db.Cees;
    entity ProductCategories            as projection on db.ProductCategories;
    entity ActivityProducts             as projection on db.ActivityProducts;
    entity Products                     as projection on db.Products;
    entity ActivityOutcomes             as projection on db.ActivityOutcomes;
    entity OutcomeKPIs                  as projection on db.OutcomeKPIs;

    @readonly
    entity MaturityDimensionLevels      as projection on db.MaturityDimensionLevels;

    entity ActivationPhases             as projection on db.ActivationPhases {
        *,
        to_customer : redirected to Customers
    };

    /**
     * EXTERNAL ENTITIES FROM ACTIVITYREPO APP
     */
    entity FREActivities as projection on external.FREActivities;
    // These three entities need to be here for the associations to work on FREActivities
    // If they are not here the CDS compiler removes the them as it thinks they won't be needed.
    // We could add the autoexpose annotation instead, but that won't work with Regions
    // due to the name clash. It does not matter what we call the exposed Regions (ExtRegions)
    // as it is only here to stop the association being removed by the compiler.
    // https://pages.github.tools.sap/cap/docs/cds/cdl#auto-expose
    // https://pages.github.tools.sap/cap/docs/cds/cdl#auto-redirect
    entity TechnicalDomain as projection on external.TechnicalDomain;
    entity ExtRegions as projection on external.Regions;
    entity SupportingTeams as projection on external.SupportingTeams;

    action   getActivities(customerID: String, bAll: Boolean) returns array of FREActivities; //db.ActivityRepoActivity;
    action   importActivities(customerID: String, activities: array of FREActivities /*db.ActivityRepoActivity*/);
    action   updateCustomers();
    action   startJobs();
    action   stopJobs();
    function isAdmin() returns Boolean;

    entity Settings                     as projection on db.Settings;
};

service ActivitiesService @(path : '/activities') @(requires : ['authenticated-user']) {
    entity Activities as projection on db.Activities;
    entity Cees       as projection on db.Cees;
    entity Customers  as projection on db.Customers;
};

/**
 * Products service
 *
 * View and maintain BTP products/services. All FRE Engagement
 * Tracker (adoptiontracker) users can view Products but only
 * those with AdoptionTrackerProductsEditor may edit.
 */
service ProductsService @(path : '/products') {
    entity Products @(restrict : [
        {
            grant : 'READ',
            to    : 'AdoptionTrackerViewer'
        },
        {
            grant : 'WRITE',
            to    : 'AdoptionTrackerProductsEditor'
        }
    ]) as projection on db.Products;

    entity ProductCategories @(restrict : [
        {
            grant : 'READ',
            to    : 'AdoptionTrackerViewer'
        },
        {
            grant : 'WRITE',
            to    : 'AdoptionTrackerProductsEditor'
        }
    ]) as projection on db.ProductCategories;
};
