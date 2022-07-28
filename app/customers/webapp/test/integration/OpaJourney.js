sap.ui.define(['sap/ui/test/opaQunit'], function(opaTest) {
    'use strict';

    var Journey = {
        run: function() {
            QUnit.module('Engagement Tracker journey');

            opaTest('#000: Start', function(Given, When, Then) {
                Given.iResetTestData().and.iStartMyApp();
                Then.onTheMainPage.iSeeThisPage();
            });

            
            opaTest('#1: Customers List: Check List Report Page loads', function(Given, When, Then) {
                When.onTheMainPage.onFilterBar().iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows();
            });


            opaTest('#2: Customer Object Page: Check Object Page loads', function(Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow(1);
                Then.onTheDetailPage.iSeeThisPage();
            });
            

            opaTest('#3: Customer Object Page: Check Edit mode', function(Given, When, Then) {
                When.onTheDetailPage.onHeader().iExecuteEdit();
                Then.onTheDetailPage.iSeeThisPage();
            });

            
            opaTest('#4: Customer Object Page: Navigate to Activity', function(Given, When, Then) {
                When.onTheDetailPage.iGoToSection('Engagement Plan');
                When.onTheDetailPage.onTable({property: 'to_activities'}).iPressRow(2);

                Then.onTheActivityPage.iSeeThisPage()
                    .and.onHeader().iCheckTitle("This is a transaction activity");
            });


            opaTest('#5: Activity Object Page: Go back to Customer', function(Given, When, Then) {
                When.onTheShell.iNavigateBack(); // ONLY WORKS WHEN RUNNING IN FLP SHELL
                Then.onTheDetailPage.iSeeThisPage();
            });


            opaTest('#6: Customer Object Page: Navigate to Activation Checklists', function(Given, When, Then) {
                When.onTheDetailPage.iGoToSection('Activation progress');
                When.onTheDetailPage.onTable({property: 'to_act_progress'}).iPressRow(1);

                Then.onTheActivationProgressPage.iSeeThisPage()
                    .and.onHeader().iCheckTitle("Phase2: Get Connected");
            });


            opaTest('#7: Activity Object Page: Go back to Customer', function(Given, When, Then) {
                When.onTheShell.iNavigateBack(); // Only works when running in FLP shell
                Then.onTheDetailPage.iSeeThisPage();
            });


            opaTest('#999: Tear down', function(Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };

    return Journey;
});