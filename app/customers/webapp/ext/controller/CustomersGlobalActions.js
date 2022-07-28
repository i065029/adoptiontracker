/**
 * Custom global action handler.
 * 
 * We are using the (editflow api)[https://ui5.sap.com/#/api/sap.fe.core.controllerextensions.EditFlow]
 * to handle the global actions, instead of directly calling `$.ajax()`.
 * This api takes care of CSRF tokens which are required if the app is running
 * within the Launchpad.
 * 
 */
sap.ui.define([
    "com/sap/pntcee/customers/ext/lib/ServiceUtil",
    "sap/m/MessageToast",
], function (ServiceUtil, MessageToast) {
    return {

        /**
         * Launch an app to show all the activities in one list
         * 
         * Use the launchpads (cFLP only) cross app navigation api to launch the app.
         */
        showAllActivities: function() {
            let oCrossAppNav = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService('CrossApplicationNavigation');
            var userID = "";
            let oUserInfo = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService('UserInfo');

            if (oUserInfo) {
                userID = sap.ushell.Container.getService("UserInfo").getEmail(); 
            } else {
                userID = null;
            }

            if (oCrossAppNav) {
                console.log('Navigating to AdoptionTrackerActivities with parameter createdBy = ' + userID);
                oCrossAppNav.toExternal({
                    target: {
                        semanticObject : "AdoptionTrackerActivities",
                        action : "display" 
                    }, 
                    params: {
                        "createdBy" : userID
                    }
                });
            } else {
                console.log('Cross-app navigation only supported when running in Launchpad service!');
                MessageToast.show('Cross-app navigation only supported when running in Launchpad service!');
            }
        },

        /**
         * Call the OData service updateCustomers() action.
         */
        syncTotangoCustomers: function () {
            let actionName = "updateCustomers";
            // context is required for bound action only
            let parameters = {
			    //contexts: oEvent.getSource().getBindingContext(),
				model: this.getModel(),
			};
			this.editFlow.invokeAction(actionName, parameters)
                .then(function (result) {
                    MessageToast.show("Customers update running in background...");
                })
                .catch(function (error) {
                    MessageToast.show("Error: " + error);
                });
        },

        /**
         * Enable the customer sync button.
         */
        enableTotangoCustomers: function (oBindingContext, aSelectedContexts) {
            return true;
        },

        /**
         * Start a background job in the CAP service to routinely
         * sync the Totango customer data.
         */
        startJobs: function () {
            let actionName = "startJobs";
            // context is required for bound action only
            let parameters = {
			    //contexts: oEvent.getSource().getBindingContext(),
				model: this.getModel(),
			};
			this.editFlow.invokeAction(actionName, parameters)
                .then(function (result) {
                    MessageToast.show("Customers update job scheduled");
                })
                .catch(function (error) {
                    MessageToast.show("Error: " + error);
                });
        },

        /**
         * Enable the jobs button.
         */
        enableJobsButton: function (oBindingContext, aSelectedContexts) {
            return true;
        },

        /**
         * Stop any running background job.
         */
        stopJobs: function () {
            let actionName = "stopJobs";
            // context is required for bound action only
            let parameters = {
			    //contexts: oEvent.getSource().getBindingContext(),
				model: this.getModel(),
			};
			this.editFlow.invokeAction(actionName, parameters)
                .then(function (result) {
                    MessageToast.show("Customers update job cancelled");
                })
                .catch(function (error) {
                    MessageToast.show("Error: " + error);
                });
        },

        /**
         * Enable the stop jobs button.
         *
         */
        enableStopJobsButton: function (oBindingContext, aSelectedContexts) {
            return true;
        }
    }
})
