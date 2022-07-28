using ProductsService as service from '../../srv/customers-service';

annotate ProductsService.Products with {
    category @(Common : {
        ValueListWithFixedValues: true,
        ValueList : {
            Label : '{i18n>PRODUCT_CAPABILITY}',
            CollectionPath : 'ProductCategories',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    ValueListProperty : 'ID',
                    LocalDataProperty : category_ID 
                }
            ]
        }
    });
};
