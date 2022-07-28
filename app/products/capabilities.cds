using ProductsService as service from '../../srv/customers-service';

// Semantic key will also show the editing status (draft etc)
annotate ProductsService.Products with @odata.draft.enabled @Common.SemanticKey: [ID];

// Block INSERT, DELETE on the top-level Customer entity - these are only updated from Totango
// To block UPDATE we use @readonly on the Totango fields - see data-model.cds.
//annotate ActivitiesService.Activities with
//    @Capabilities.InsertRestrictions.Insertable: false
//    @Capabilities.DeleteRestrictions.Deletable: false;

// // Block all edit capabilities
// annotate CustomersService.ProductCategories with
//     @Capabilities.InsertRestrictions.Insertable: false
//     @Capabilities.DeleteRestrictions.Deletable: false
//     @Capabilities.UpdateRestrictions.Updatable: false;
