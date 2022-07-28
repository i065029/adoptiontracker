using CustomersService as service from '../../srv/customers-service';

//
// annotations that control rendering of fields and labels
//

annotate CustomersService.Customers with @title : '{i18n>CUSTOMER}' {
    account_id              @title              : '{i18n>CUSTOMER_NAME}'  @Common.Text                     : customer_name  @Common.TextArrangement            : #TextOnly;
    customer_name           @title              : '{i18n>CUSTOMER_NAME}';
    market_unit             @title              : '{i18n>MARKET_UNIT}';
    acv                     @title              : '{i18n>ACV}'  @Measures.ISOCurrency                      : currency_code;
    next_renewal_date       @title              : '{i18n>NEXT_RENEWAL_DATE}';
    to_cee                  @title              : '{i18n>CEE}'  @Common.Text                               : to_cee.name  @Common.TextArrangement              : #TextOnly;
    cloud_health_assessment @title              : '{i18n>CLOUD_HEALTH_SCORE}';
    health_rank             @title              : '{i18n>HEALTH_RANK}';
    consumption_perc        @title              : '{i18n>CONSUMPTION}';
    contract_start_date     @title              : '{i18n>CONTRACT_START_DATE}';
    status                  @title              : '{i18n>STATUS}';
    partner_type            @title              : '{i18n>PARTNER_TYPE}'  @Common.Text                      : partner_type.name  @Common.TextArrangement        : #TextOnly;
    partner                 @title              : '{i18n>PARTNER}';
    planned_apps            @title              : '{i18n>PLANNED_APPS}';
    live_apps               @title              : '{i18n>LIVE_APPS}';
    exec_sponsor_required   @title              : '{i18n>EXEC_SPONSOR_REQD}';
    executive_alignment     @title              : '{i18n>EXECUTIVE_ALIGNMENT}'  @Common.Text               : executive_alignment.name  @Common.TextArrangement : #TextOnly;
    rise_status             @title              : '{i18n>RISE_STATUS}'  @Common.Text                       : rise_status.name  @Common.TextArrangement         : #TextOnly;
    paygo_status            @title              : '{i18n>PAYGO_STATUS}'  @Common.Text                      : paygo_status.name  @Common.TextArrangement        : #TextOnly;
    adjustment              @title              : '{i18n>ADJUSTMENT}';
    adjustment_reason       @title              : '{i18n>ADJUSTMENT_REASON}'  @Common.Text                 : adjustment_reason.name  @Common.TextArrangement   : #TextOnly;
    deleted                 @title              : '{i18n>DELETED}';
    ce_acct_classification  @title              : '{i18n>ACCOUNT_CLASS}';
    account_type            @title              : '{i18n>ACCOUNT_TYPE}';
    cs_sentiment            @title              : '{i18n>CS_SENTIMENT}';
    cs_sentiment_reason     @title              : '{i18n>CS_SENTIMENT_REASON}';
    activation_progress     @title              : '{i18n>ACTIVATION_TEAM_OVERALL_PROGRESS}';
    activation_phase        @title              : '{i18n>ACTIVATION_TEAM_PHASE}'  @Common.Text             : activation_phase.name  @Common.TextArrangement    : #TextOnly;
    engagement_status       @title              : '{i18n>ACTIVATION_TEAM_ENGAGEMENT_STATUS}'  @Common.Text : engagement_status.name  @Common.TextArrangement   : #TextOnly;
    btp_activated           @title              : '{i18n>ACTIVATION_TEAM_ACCOUNT_ACTIVATED}';
};

annotate CustomersService.Cees with @title : '{i18n>CEE}' {
    id    @title                           : '{i18n>CEE}'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
    name  @title                           : '{i18n>CEE}';
    email @title                           : '{i18n>CEE_Email}'
};

annotate CustomersService.Activities with @title : 'Activities' {
    activity_category     @title                 : '{i18n>ACTIVITY_CATEGORY}'  @Common.Text       : activity_category.name  @Common.TextArrangement : #TextOnly;
    activity_type         @title                 : '{i18n>ACTIVITY_TYPE}'  @Common.Text           : activity_type.name  @Common.TextArrangement     : #TextOnly;
    activity_status       @title                 : '{i18n>ACTIVITY_STATUS}'  @Common.Text         : activity_status.name  @Common.TextArrangement   : #TextOnly;
    short_text            @title                 : '{i18n>ACTIVITY_SHORT_DESC}';
    activity_description  @title                 : '{i18n>ACTIVITY_DESC}'  @UI.MultiLineText;
    activity_ask          @title                 : '{i18n>ACTIVITY_ASK}';
    activity_completed_at @title                 : '{i18n>ACTIVITY_COMPLETED_ON}';
    activity_target       @title                 : '{i18n>ACTIVITY_TARGET}';
    sap_program           @title                 : '{i18n>ACTIVITY_SAP_PROGRAM}'  @Common.Text    : sap_program.name  @Common.TextArrangement       : #TextOnly;
    impl_support_team     @title                 : '{i18n>ACTIVITY_IMPL_SUPP_TEAM}'  @Common.Text : impl_support_team.name  @Common.TextArrangement : #TextOnly;
    rating                @title                 : '{i18n>ACTIVITY_RATING}';
};

annotate CustomersService.Risks with @title : 'Risks' {
    risk_type            @title             : '{i18n>RISK_TYPE}'  @Common.Text     : risk_type.name  @Common.TextArrangement     : #TextOnly;
    risk_target          @title             : '{i18n>RISK_TARGET}';
    short_text           @title             : '{i18n>RISK_SHORT_DESC}';
    risk_description     @title             : '{i18n>RISK_DESC}'  @UI.MultiLineText;
    risk_mitigation_plan @title             : '{i18n>RISK_MITIGATION_PLAN}'  @UI.MultiLineText;
    risk_priority        @title             : '{i18n>RISK_PRIORITY}'  @Common.Text : risk_priority.name  @Common.TextArrangement : #TextOnly;
    risk_status          @title             : '{i18n>RISK_STATUS}'  @Common.Text   : risk_status.name  @Common.TextArrangement   : #TextOnly;
};


annotate CustomersService.ExecutiveAlignment with @title : 'Executive Alignment' {
    code @UI.Hidden;
};

annotate CustomersService.AdjustmentReason with @title : 'Adjustment Reason' {
    code @UI.Hidden;
};

annotate CustomersService.RiseStatus with @title : 'RISE Status' {
    code @UI.Hidden;
};

annotate CustomersService.ActivityType with @title : 'Activity Type' {
    code @title                                    : 'Type'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
}

annotate CustomersService.ActivityStatus with @title : 'Activity Status' {
    code @title                                      : 'Type'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
}

annotate CustomersService.ImplSupportTeam with @title : 'Implementation Support Team' {
    code @title                                       : 'Type'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
}

annotate CustomersService.SAPProgramType with @title : 'SAP Program Type' {
    code @title                                      : 'Type'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
}

annotate CustomersService.ActivityCategory with @title : 'Activity Category' {
    code @title                                        : 'Type'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
}

annotate CustomersService.RiskStatus with @title : 'Status' {
    code @title                                  : 'Status'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
};

annotate CustomersService.RiskPriority with @title : 'Priority' {
    code @title                                    : 'Priority'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
};

annotate CustomersService.RiskType with @title : 'Type' {
    code @title                                : 'Type'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
};

annotate CustomersService.ActivityProducts with @title : 'Products' {
    product @title                                     : 'Product'  @Common.Text : product.name  @Common.TextArrangement : #TextOnly;
};

annotate CustomersService.Products with @title : 'Products' {
    ID          @title                         : 'Product'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
    description @title                         : 'Description';
};

annotate CustomersService.ProductCategories with @title : 'Capability' {
    description @title                                  : 'Capability';
};

annotate CustomersService.ActivityOutcomes with @title : '{i18n>ACTIVITY_OUTCOME_PLURAL}' {
    kpi    @title                                      : 'KPI' @Common.Text : kpi.name  @Common.TextArrangement : #TextOnly;
    result @title                                      : 'Result for the KPI' @UI.MultiLineText;
    score  @title                                      : 'Score';
};

annotate CustomersService.OutcomeKPIs with @title : '{i18n>ACTIVITY_OUTCOME_KPIS}' {
    code             @title                       : 'KPI'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
    success_measures @title                       : 'Success Measures';
};

/* ACTIVATION TEAM LABEL ANNOTATIONS */

annotate CustomersService.ActivationPhases with @title : 'Activation Phases' {
    phase             @title                           : '{i18n>ACTIVATION_PHASE}'  @Common.Text  : phase.name  @Common.TextArrangement            : #TextOnly
                      @Common.ValueListWithFixedValues;
    startdate         @title                           : '{i18n>ACTIVATION_START_DATE}';
    act_phase_status  @title                           : '{i18n>ACTIVATION_STATUS}'  @Common.Text : act_phase_status.name  @Common.TextArrangement : #TextOnly
                      @Common.ValueListWithFixedValues;
    phase_description @title                           : '{i18n>ACTIVATION_DESC}'  @UI.MultiLineText;
};

annotate CustomersService.PhaseTasks with @title : 'Phase Tasks' {
    task_sequence @title                         : '{i18n>ACTIVATION_TASK_NO}';
    task          @title                         : '{i18n>ACTIVATION_TASK}';
    startdate     @title                         : '{i18n>ACTIVATION_TASK_START_DATE}';
    task_status   @title                         : '{i18n>ACTIVATION_TASK_STATUS}'  @Common.Text : task_status.name  @Common.TextArrangement : #TextOnly
                  @Common.ValueListWithFixedValues;
};

annotate CustomersService.Engagement with @title : 'Engagement Status' {
    code @title                                  : '{i18n>ACTIVATION_ENGAGEMENT_TYPE}'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
};

annotate CustomersService.ActPhaseStatus with @title : 'Activation Status' {
    code @title                                      : '{i18n>ACTIVATION_PHASE_STATUS_TYPE}'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
};

annotate CustomersService.Phase with @title : 'Phase' {
    code @title                             : '{i18n>ACTIVATION_PHASE_TYPE}'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
};

annotate CustomersService.TaskStatus with @title : 'Task Status' {
    code @title                                  : '{i18n>ACTIVATION_TASK_STATUS_TYPE}'  @Common.Text : name  @Common.TextArrangement : #TextOnly;
};

/**
 * Add @Common.Text #TextOnly to hide id/key/code and show
 * name/description only for better UX. Also make `comments`
 * field a `TextArea` rather than a single line `Input`.
 */
annotate CustomersService.MaturityAssessments with {
    domain    @Common.Text : {
        $value                 : domain.name,
        ![@UI.TextArrangement] : #TextOnly,
    };
    dimension @Common.Text : {
        $value                 : dimension.name,
        ![@UI.TextArrangement] : #TextOnly,
    };
    comments  @UI.MultiLineText;
};

annotate CustomersService.MaturityDimensionLevels with {
    dimension @Common.Text : {
        $value                 : dimension.name,
        ![@UI.TextArrangement] : #TextOnly,
    };
};
