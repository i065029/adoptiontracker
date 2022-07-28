using {
    Currency,
    Country,
    sap,
    sap.common.CodeList,
    managed
} from './common';

namespace adoptiontracker.db;

aspect MasterData {}

entity Regions : MasterData {
    key ID           : UUID;
        region_name  : String(50);
        market_units : Association to many MarketUnits
                           on market_units.region = $self;
}

entity MarketUnits : MasterData {
    key ID      : UUID;
        mu_name : String(50);
        region  : Association to Regions;
        cees    : Association to many MarketUnitCees
                      on cees.market_unit = $self;
}

entity MarketUnitCees : MasterData {
    key ID          : UUID;
        market_unit : Association to MarketUnits;
        cee         : Association to Cees;
}

entity Cees : MasterData {
    key id           : UUID @odata.Type : 'Edm.String'; // Typecast to string as the default mapping to Edm.Guid is restrictive (ie values must be hyphenated)
        name         : String(100);
        email        : String(256);
        market_units : Association to many MarketUnitCees
                           on market_units.cee = $self;
}

entity ProductCategories : MasterData {
    key ID          : UUID;
        description : String(50);
}

// entity Products : MasterData {
//     key ID          : UUID;
//         description : String(50);
//         category    : Association to ProductCategories;
// }

entity ExecutiveAlignment : CodeList {
    key code : Integer enum {
            None               = 0;
            ImplementationTeam = 1;
            ProgramManager     = 2;
            HeadOfIT           = 3;
            CLevel             = 4;
        } default 0;
};

entity AdjustmentReason : CodeList {
    key code : Integer enum {
            None          = 0;
            Consumption   = 1;
            UseCases      = 2;
            ExpectedChurn = 3;
            ProductIssues = 4;
        } default 0;
};

entity RiseStatus : CodeList {
    key code : Integer enum {
            None                           = 0;
            RISEWithVoucher                = 1;
            RISEWithCommittedCPEA          = 2;
            RISEWithSubscriptionAndVoucher = 3;
        } default 0;
};

entity PartnerType : CodeList {
    key code : Integer enum {
            None         = 0;
            Consultancy  = 1;
            SAP_DBS_IBSO = 2;
        } default 0;
};

entity PaygoStatus : CodeList {
    key code : Integer enum {
            None             = 0;
            PAYGO_Standalone = 1;
            PAYGO_with_CX    = 2;
            PAYGO_with_HXM   = 3;
        } default 0;
};

entity TechnologyDomains : CodeList {
    key code : Integer;
};

entity MaturityDimensionLevels : CodeList {
    key code      : UUID;
        dimension : Association to MaturityDimensions;
        maturity  : Integer;
};


entity MaturityDimensions : CodeList {
    key code : Integer;
};

/* ACTIVATION TEAM ENTITIES */

entity Phase : CodeList {
    key code : Integer enum {
            L1_Getting_Started_With_BTP = 0;
            L2_Implementing             = 1;
            L3_Establishing             = 2;
            L4_BTP_Embedded_Strategy    = 3;
            L5_BTP_Center_of_Excellence = 4;
        };
};

entity Engagement : CodeList {
    key code : Integer enum {
            New                                              = 0;
            Reached_out_to_Internal_Stakeholders             = 1;
            Reached_out_to_Customer                          = 2;
            Delivered_An_Introduction_session                = 3;
            Completed_planning_session_for_Acceleration_Pack = 4;
            Completed_walk_through_of_the_Acceleration_Pack  = 5;
            Close_Engagement_High_Touch                      = 6;
            Close_Engagement_Digital                         = 7;
            Close_Engagement_Shelfware                       = 8;
            Close_Engagement_Not_RISEwithSAP                 = 9;
        };
};


entity ActivationTasks : MasterData {
    key ID          : UUID;
        description : String(50);
}