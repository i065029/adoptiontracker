/**
 * App component
 * 
 * Note: we need to import (requires) the rich text editor block here so
 * that its avialable to the whole app.
 * The reason we cannot rely on the frgment definition to include the namespace
 * is that the XML templating has already run by the time the fragment is loaded.
 */
sap.ui.define(['sap/fe/core/AppComponent', "./ext/blocks/RichTextEditor"], function(AppComponent, RTE) {
    'use strict';

    return AppComponent.extend("com.sap.pntcee.customers.Component", {
        metadata: {
            manifest: "json"
        }
    });
});
