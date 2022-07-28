using CustomersService as service from '../../srv/customers-service';

annotate CustomersService.ActivationPhases with @UI : {
    Identification : [
        { Value : ID }
    ],
    HeaderInfo  : {
        TypeName : '{i18n>Activation Phases}',
        TypeNamePlural : '{i18n>Phases}',
        Title : { Value : phase_code }
    },
    PresentationVariant : {
        SortOrder       : [ //Default sort order
            {
                Property    : phase_code,
                Descending  : false,
            },
        ],
        Visualizations  : ['@UI.LineItem'],
        RequestAtLeast : [
            phase_description
        ]
    },

    SelectionFields  : [
    ],

    LineItem  : {
    ![@UI.Criticality] : phase_criticality,
    $value : [
      //  { $Type: 'UI.DataFieldForAction', Action: 'CustomersService.EntityContainer/initialize', Label: 'Initialize'},

        { Value : phase_code},
        { Value : startdate},
        { Value : act_phase_status_code},

    ]
    },

    HeaderFacets  : [
        {
        $Type : 'UI.ReferenceFacet',
        ID : 'PhaseStatus',
        Target : '@UI.FieldGroup#PhaseStatus',
        Label : 'Status'
    },
    {
        $Type : 'UI.ReferenceFacet',
        ID : 'ChangeLog',
        Target : '@UI.FieldGroup#ChangeLog',
        Label : 'Changes'
    }],

    // Facets  : [{
    //         $Type : 'UI.CollectionFacet',
    //         Label : 'Phase',
    //         ID    : 'Phase',
    //         Facets : [{
    //             $Type : 'UI.ReferenceFacet',
    //             ID : 'PhaseDescription',
    //             Target : '@UI.FieldGroup#ActivityDescription',
    //             Label : 'Info'
    //         }]
    //    },
  Facets  : [{
            $Type : 'UI.ReferenceFacet',
            Target : 'to_tasks/@UI.PresentationVariant', //'to_tasks/@UI.LineItem',
            Label : 'Tasks',
            ID    : 'Tasks',
        }],



    FieldGroup#PhaseStatus : {
        Data : [
        { Value : phase_code},
        { Value : startdate},
        { Value : act_phase_status_code}
        ]
    },

        FieldGroup#ChangeLog : {
        Data : [
            { Value : createdBy },
            { Value : createdAt },
            { Value : modifiedAt },
            { Value : modifiedBy}
        ]
    }
};


annotate CustomersService.PhaseTasks with @UI : {
  //  Identification  : [
  //      { Value : ID }
  //  ],

  //  HeaderInfo  : {
  //      TypeName : 'Tasks',
  //      TypeNamePlural : 'Tasks',
   //     //Title : { Value : product.description },
   //     //Description : { Value : product.description }
  //  },

  PresentationVariant : {
        SortOrder       : [ //Default sort order
            {
                Property    : task_sequence,
                Descending  : false,
            },
        ],
        Visualizations  : ['@UI.LineItem'],
    },

    LineItem : [
        { Value : task_sequence },
        { Value : task },
        { Value : task_status_code },
        { Value : startdate },
    ],
};