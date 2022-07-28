sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/sap/pntcee/customers/test/integration/pages/CustomersListReport' ,
        'com/sap/pntcee/customers/test/integration/pages/CustomerObjectPage',
        'com/sap/pntcee/customers/test/integration/pages/ActivityObjectPage',
        'com/sap/pntcee/customers/test/integration/pages/ActivationProgressPage',
        'com/sap/pntcee/customers/test/integration/OpaJourney'
    ],
    function(JourneyRunner, CustomersListReport, CustomerObjectPage, ActivityObjectPage, ActivationProgressPage, Journey) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/sap/pntcee/customers') + '/launchpad_sandpit.html#fe-lrop-v4' //index.html'
        });

        
        JourneyRunner.run(
            {
                pages: {
                    onTheMainPage: CustomersListReport,
                    onTheDetailPage: CustomerObjectPage,
                    onTheActivityPage: ActivityObjectPage,
                    onTheActivationProgressPage: ActivationProgressPage 
                }
            },
            Journey.run
        );
        
    }
);