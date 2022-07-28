using ProductsService as service from '../../srv/customers-service';

annotate ProductsService.Products with @UI : {

    HeaderInfo  : {
        $Type : 'UI.HeaderInfoType',
        TypeName : '{i18n>PRODUCT_PRODUCT}',
        TypeNamePlural : '{i18n>PRODUCT_PRODUCTS}',
        Title : { Value : name }
    },

    PresentationVariant : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : ['@UI.LineItem'],
        SortOrder : [{
            $Type : 'Common.SortOrderType',
            Property : name,
            Descending : false
        }]
    },

    SelectionFields : [
        category_ID,
    ],

    LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID
        },
        {
            $Type : 'UI.DataField',
            Value : category_ID
        },
        {
            $Type : 'UI.DataField',
            Value : description,
            ![@HTML5.CssDefaults] : {width: '100%'}
        }
    ],

    Facets  : [{
        $Type : 'UI.ReferenceFacet',
        Label : '{i18n>PRODUCT_DETAILS}',
        ID    : 'Product',
        Target : '@UI.FieldGroup#ProductDescription',
    }],


    FieldGroup#ProductDescription : {
        Data : [
            { Value : description },
            { Value : category_ID }
        ]
    },
};
