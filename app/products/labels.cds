using ProductsService as service from '../../srv/customers-service';

annotate ProductsService.Products with @title : '{i18n>PRODUCTS}' {
    ID @title : '{i18n>PRODUCT_PRODUCT}' @Common.Text : name @Common.TextArrangement : #TextOnly; 
    category @title : '{i18n>PRODUCT_CAPABILITY}' @Common.Text : category.description @Common.TextArrangement : #TextOnly;
    description @title : '{i18n>PRODUCT_DESCRIPTION}';
};

annotate ProductsService.ProductCategories with @title : '{i18n>PRODUCT_CAPABILITY}' {
    ID @title : '{i18n>PRODUCT_CAPABILITY}' @Common.Text : description @Common.TextArrangement : #TextOnly; 
    description @title : '{i18n>PRODUCT_CAPABILITY_DESCR}';
};