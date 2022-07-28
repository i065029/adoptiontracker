using {
    managed,
    Currency,
    sap.common.CodeList,
    cuid
} from './common';
using {
    adoptiontracker.db.Regions,
    adoptiontracker.db.MarketUnits,
    adoptiontracker.db.MarketUnitCees,
    adoptiontracker.db.Cees,
    adoptiontracker.db.ProductCategories,
    adoptiontracker.db.ExecutiveAlignment,
    adoptiontracker.db.AdjustmentReason,
    adoptiontracker.db.RiseStatus,
    adoptiontracker.db.PartnerType,
    adoptiontracker.db.PaygoStatus,
    adoptiontracker.db.MaturityDimensions,
    adoptiontracker.db.MaturityDimensionLevels,
    adoptiontracker.db.TechnologyDomains,
    adoptiontracker.db.Engagement,
    adoptiontracker.db.Phase,
    adoptiontracker.db.ActivationTasks
} from './master-data';

namespace adoptiontracker.db;

/**
 * Customers
 *
 * Most of the Customer data is imported from Totango and not
 * editable by the user. Customers is draft-enabled. This is
 * for all compositions (being the Activities and Risks).
 * Updates and Deletes on Customers are blocked. See `app/customers/capabilities/cds`
 * .
 */
entity Customers : managed {
        // Read-only fields populated by totango sync
    key ID                                          : UUID;
        @readonly account_id                        : String(20);
        @readonly customer_name                     : String(100);
        @readonly account_type                      : String(50);
        @readonly status                            : String(10);
        @readonly region                            : String(50);
        @readonly market_unit                       : String(50);
        @readonly country                           : String(100);
        @readonly industry_code                     : String(100);
        @readonly to_cee                            : Association to Cees;
        @readonly acv                               : Decimal(12, 2);
        @readonly health_rank                       : String(10);
        @readonly cloud_health_assessment           : String(50);
        @readonly cs_sentiment                      : String(10);
        @readonly cs_sentiment_reason               : String(30);
        @readonly entitlement_consumption           : Decimal(6, 2); // As %
        @readonly consumption_actual                : Decimal(6, 2);
        @readonly shelfware                         : String(10);
        @readonly days_in_shelfware                 : Integer;
        @readonly products                          : String(1000);
        @readonly renewal_type                      : String(20);
        @readonly next_renewal_date                 : Date;
        @readonly days_until_next_renewal           : Integer;
        @readonly ce_acct_classification            : String(20);
        @readonly int_acct_classification           : String(20);
        @readonly last_touch                        : Timestamp; //Date;
        @readonly satisfaction_score                : Integer;
        @readonly contract_start_date               : Date;
        @readonly currency                          : Currency;
        virtual cr_url                              : String; // add a cloud reporting url
        virtual consumption_perc                    : Decimal(6, 2);
        virtual cs_sentiment_criticality            : Integer;
        virtual cloud_health_assessment_criticality : Integer;
        // user editable fields
        exec_sponsor_required                       : Boolean default false;
        executive_alignment                         : Association to ExecutiveAlignment;
        partner_type                                : Association to PartnerType;
        partner                                     : String(100); // e.g. IBM, HCL, Wipro, Accenture, Pwc, EY
        live_apps                                   : Integer default 0;
        planned_apps                                : Integer default 0;
        rise_status                                 : Association to RiseStatus;
        paygo_status                                : Association to PaygoStatus;
        adjustment                                  : Decimal(5, 2) default 0.0;
        adjustment_reason                           : Association to AdjustmentReason;
        engagement_score                            : Decimal(5, 2) default 0.0;
        next_renewal_date_criticality               : Integer default 0;
        deleted                                     : Boolean default false;
        to_activities                               : Composition of many Activities
                                                          on to_activities.to_customer = $self;
        to_risks                                    : Composition of many Risks
                                                          on to_risks.to_customer = $self;
        to_maturity                                 : Composition of many MaturityAssessments
                                                          on to_maturity.customer = $self;
        to_maturityAnalytics                        : Association to MaturityAssessmentsAnalytics
                                                          on to_maturityAnalytics.customer = $self;

        /* Activate team specific properties */
        activation_progress                         : Integer;
        activation_phase                            : Association to Phase;
        engagement_status                           : Association to Engagement;
        btp_activated                               : Boolean default false;
        btp_act_criticality                         : Integer default 2;
        to_act_progress                             : Composition of many ActivationPhases
                                                          on to_act_progress.to_customer = $self;
}

/**
 * Activities on a Customer
 *
 * When creating a new Activity we want to force the user to
 * choose the category. This can be done via adding the
 * @Core.Immutable annotation however there is a bug and this
 * doesn't currently work. We can also make it a non-hidden key
 * field to get exactly the same capability: Handling of
 * Non-Computed Key Fields and Immutable Fields <https://sapui5.hana.ondemand.com/#/topic/b623e0bbbb2b4147b2d0516c463921a0>
 */

entity Activities : managed {
    key ID                    : UUID;
        to_customer           : Association to Customers;
        activity_category     : Association to ActivityCategory;
        activity_type         : Association to ActivityType;
        short_text            : String(100);
        activity_description  : LargeString;
        activity_status       : Association to ActivityStatus;
        activity_target       : Date;
        activity_completed_at : Date;
        sap_program           : Association to SAPProgramType;
        impl_support_team     : Association to ImplSupportTeam;
        activity_ask          : LargeString;
        to_products           : Composition of many ActivityProducts
                                    on to_products.activity = $self;
        to_outcomes           : Composition of many ActivityOutcomes
                                    on to_outcomes.activity = $self;
        rating                : Integer @assert.range : [
            0,
            5
        ];
}

entity ActivityProducts : managed {
    key ID       : UUID;
        activity : Association to Activities;
        product  : Association to Products;
}

@cds.search : {
    name,
    category
}
entity Products {
    key ID          : UUID;
        name        : String(50);
        category    : Association to ProductCategories;
        description : String(500);
}

entity Risks : managed {
    key ID                     : UUID;
        to_customer            : Association to Customers;
        short_text             : String(100);
        risk_transaction_type  : Integer default 0;
        risk_description       : LargeString;
        risk_mitigation_plan   : LargeString;
        risk_chance_of_success : Integer default 0; // 0-100
        risk_type              : Association to RiskType;
        risk_priority          : Association to RiskPriority;
        risk_status            : Association to RiskStatus;
        risk_target            : Date;
}

entity ActivityOutcomes : cuid {
    kpi      : Association to OutcomeKPIs;
    activity : Association to Activities;
    result   : String;
    score    : Integer;
}

@odata.singleton
entity Settings {
    is_admin : Boolean;
}

// entity UploadLogs : managed {
//     key ID            : UUID;
//         filename      : String(255);
//         total         : Integer default 0;
//         processed     : Integer default 0;
//         created       : Integer default 0;
//         updated       : Integer default 0;
//         deleted       : LargeString; // JSON Array of custromer.account_id's deleted
//         exception_str : LargeString;
// }

// entity SnapshotLogs : managed {
//     key snapshot_time : Timestamp;
//         count         : Integer default 0;
//         processed     : Integer default 0;
//         exception_str : LargeString;
// }

// entity CustomerHistory : managed, CustomerTotangoFields, CustomerCustomFields {
//     key snapshot_time                             : Timestamp;
//         completed_transactions                    : Integer default 0;
//         completed_transactions_this_calendar_year : Integer default 0;
//         completed_farming                         : Integer default 0;
//         completed_farming_this_calendar_year      : Integer default 0;
//         transaction_pipeline                      : Integer default 0;
//         farming_pipeline                          : Integer default 0;
//         live_apps                                 : Integer default 0;
//         planned_apps                              : Integer default 0;
// }


//
//  Code Lists
//

entity ActivityStatus : CodeList {
    key code : Integer enum {
            Planned    = 0;
            InProgress = 1;
            Cancelled  = 2;
            Complete   = 3;
        } default 0;
};

entity ActivityCategory : CodeList {
    key code : Integer enum {
            Adoption    = 0;
            Transaction = 1;
        };
};

entity ActivityType : CodeList {
    key code     : Integer enum {
            Renewal                      = 0;
            Replacement                  = 1;
            Upsell                       = 2;
            Go_live                      = 3;
            Reference                    = 4;
            Kick_off                     = 5;
            Business_Process_Improvement = 6;
            Harmonisation                = 7;
            LOB_Extension                = 8;
            Pilot                        = 9;
            Value_Prop                   = 10;
            Architecture                 = 11;
        };
        category : Integer;
}

entity SAPProgramType : CodeList {
    key code : Integer enum {
            Early_Adopter_Care    = 0;
            Headliner             = 1;
            White_Glove_Migration = 2;
            Sunrise               = 3;
            BTP_Cloud_Accelerate  = 4;
            ESAC                  = 5;
        }
}

/**
 * TODO: We should change this to use the Supporting Teams
 * entity from the ActivityRepo app (remote service call).
 */
entity ImplSupportTeam : CodeList {
    key code : Integer enum {
            Migration_Factory        = 0;
            HANA_Cloud_DWC_SWAT_Team = 1;
            APJ_SWAT_Team            = 2;
            App_Haus                 = 3;
            APJ_DTO                  = 4;
            Adoption_COE             = 5;
            UTP                      = 6;
            SolX                     = 7;
            VPT                      = 8;
            Consulting               = 9;
            IBSO                     = 10;
        }
}

entity RiskStatus : CodeList {
    key code : Integer enum {
            Identified          = 0;
            Mitigation_Proposed = 1;
            Cancelled           = 2;
            Closed              = 3;
        };
};

entity RiskPriority : CodeList {
    key code : Integer enum {
            Low      = 0;
            Medium   = 1;
            High     = 2;
            Critical = 3;
        };
};

entity RiskType : CodeList {
    key code : Integer enum {
            Engagement         = 0;
            Competitor         = 1;
            Usecase            = 2;
            Product_Capability = 3;
            Partner            = 4;
        };
};

entity MaturityAssessments : cuid, managed {
    customer  : Association to Customers;
    domain    : Association to TechnologyDomains;
    dimension : Association to MaturityDimensions;
    score     : Integer @assert.range : [
        0,
        5
    ];
    comments  : String(1000);
};

@Aggregation.ApplySupported.PropertyRestrictions : true
entity MaturityAssessmentsAnalytics as projection on MaturityAssessments {
    ID,
    customer,
    dimension.code as dimensionCode,
    domain.code    as domainCode,
    domain.name    as domainName,
    dimension.name as dimensionName,
    score
};

entity ActivationPhases : managed {
    key ID                : UUID @(Core.Computed : true);
        to_customer       : Association to Customers;
        phase             : Association to Phase;
        startdate         : DateTime;
        act_phase_status  : Association to ActPhaseStatus;
        to_tasks          : Composition of many PhaseTasks
                                on to_tasks.phase = $self;
        phase_criticality : Integer;
        phase_description : LargeString;
}

entity PhaseTasks : managed {
    key ID            : UUID;
        phase         : Association to ActivationPhases;
        task_sequence : Integer;
        task          : String(200); // Association to Tasks;
        startdate     : DateTime;
        task_status   : Association to TaskStatus;
}

entity Tasks {
    key ID          : UUID;
        description : String(50);
//  task_description  : Association to ActivationTasks;
}


entity TaskStatus : CodeList {
    key code : Integer enum {
            NotStarted = 0;
            Planned    = 1;
            InProgress = 2;
            Cancelled  = 3;
            Complete   = 4;
        };
}

entity ActPhaseStatus : CodeList {
    key code : Integer enum {
            NotStarted = 0;
            Planned    = 1;
            InProgress = 2;
            Cancelled  = 3;
            Complete   = 4;
        };
}

@readonly
entity OutcomeKPIs : CodeList {
    key code             : Integer enum {
            ConsumedRevenue       = 1;
            IEAdoption            = 2;
            PortfolioSuccess      = 3;
            CustomerAdvocacy      = 4;
            GoLives               = 5;
            SafeguardingExpansion = 6;
        };
        success_measures : String;
}

// Phases & Tasks Master

entity PhasesMaster : managed {
    key ID               : UUID;
        engagement_model : String(100);
        phase            : Association to Phase;
        startdate        : DateTime;
        act_phase_status : Association to ActPhaseStatus;
        to_tasks         : Composition of many TasksMaster
                               on to_tasks.phase = $self;
}

entity TasksMaster : managed {
    key ID            : UUID;
        phase         : Association to one PhasesMaster;
        task_sequence : Integer;
        task          : String(1000); // Association to Tasks;
        startdate     : DateTime;
        task_status   : Association to TaskStatus;
}

/**
 * Data type used for data transfer in and out of the actions
 * linking this app to the ActivityRepo app (remote service
 * calls). This is used so that we can include the text fields
 * for some of the codes/IDs.
 */
type ActivityRepoActivity {
    ID                         : UUID;
    short_text                 : String;
    region_ID                  : Integer;
    region_name                : String;
    maturity_level_min         : Integer;
    maturity_level_max         : Integer;
    rating                     : Integer;
    domain_code                : Integer;
    fre_pillar_code            : Integer;
    fre_realm_code             : Integer;
    supportingteam_description : String;
    technicaldomain_name       : String;
    cost                       : Boolean;
    description                : LargeString;
    duration                   : String;
    engagement_model_code      : Integer;
    expected_outcome           : String;
    person_responsible         : String;
    prereqs_deps               : String;
    supportingteam_ID          : UUID;
}
