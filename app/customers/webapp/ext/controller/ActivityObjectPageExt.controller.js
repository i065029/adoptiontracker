/**
 * This is an object page extension controller
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension"], function(
	ControllerExtension
) {
	"use strict";

	return ControllerExtension.extend("com.sap.pntcee.customers.ext.controller.ActivityObjectPageExt", {
		// this section allows to extend lifecycle hooks or override public methods of the base controller
		override: {

			/**
			 * Disable lazy loading of the activity object page as it causes issues
			 * with the binding flow in the rich text edit control
			 */
			 onAfterRendering: function() {
                this.getView().byId("fe::ObjectPage").setEnableLazyLoading(false)
			}

		}

	});
});
