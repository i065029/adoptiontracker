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
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/m/Dialog', 
    'sap/m/Button', 
    'sap/m/ButtonType', 
    'sap/m/Table',
    'sap/m/Text',
    'sap/m/Column',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/m/CheckBox',
    'sap/ui/model/json/JSONModel',
    'sap/m/RatingIndicator',
    'sap/ui/model/Sorter',
    'sap/m/Link'], function (
        MessageToast,
        MessageBox,
        Dialog,
        Button,
        ButtonType,
        Table,
        Text,
        Column,
        ColumnListItem,
        Label,
        CheckBox,
        JSONModel,
        RatingIndicator,
        Sorter,
        Link
    ) {

    /**
     * Navigate to the ActivityRepo app in a new browser window/tab.
     * 
     * Use the launchpads (cFLP only) cross app navigation api to launch the app.
     * We get the resulting url and pass it to URLHelper to open it in a new
     * window/tab.
     * @param {*} activityObject 
     */
    function navigateToActivityRepo(activityObject) {
        console.dir(activityObject);

        let oCrossAppNav = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService('CrossApplicationNavigation');

        if (oCrossAppNav) {
            console.log('Navigating to ActivityRepo with parameter ID = ' + activityObject.ID);
            // oCrossAppNav.toExternal({
            //     target: {
            //         semanticObject : "FREActivityRepository",
            //         action : "display" 
            //     }, 
            //     params: {
            //         "ID" : activityObject.ID
            //     }
            // });
            oCrossAppNav.hrefForExternalAsync({
                target: {
                    semanticObject: "FREActivityRepository",
                    action: "display"
                },
                params: {
                    "ID": activityObject.ID
                }
            })
            .then((url) => {
                sap.m.URLHelper.redirect(url, true /* new windows/tab */);
            });
        } else {
            console.log('Cross-app navigation only supported when running in Launchpad service!');
            MessageToast.show('Cross-app navigation only supported when running in Launchpad service!');
        }
    }

    /**
     * Process activities
     * 
     * * NOTE: We cannot use the FE editFlow API here because it throws up a popup
     * to ask the user for any action parameters whereas we wish to pass parameters
     * programmatically. We call the action using the OData V4 model instead.
     * 
     * Process:
     *  1. Call the getActivties action to read all the activity templates that
     *     match the maturity assessment for the customer
     *  2. Create a dialog with a table of the activity templates. Allow user to
     *     select
     *  3. Call the importActivity action to import the selected activity templates
     *     into the customer's activity list (engagement plan).
     *
     * @param {*} that - need to use the context from the FE action handler
     * instead of `this`
     * @param {*} bindingContext - the binding context of the FE action handler 
     * (binding context for the object page)
     * @param {boolean} bAll - if true, import all activities, otherwise, import only
     * the activities based on the maturity assessment for the customer
     */
    function processActivities (that, bindingContext, bAll) {
        sap.ui.core.BusyIndicator.show();

        /**
         * Setup the binding contexts for calling the actions to get the activities from
         * the activity repo app and to import the user-selected activities into the
         * activtiies table.
         */
        const getActivitiesOperation = that.getModel().bindContext('/getActivities(...)', bindingContext);
        getActivitiesOperation.setParameter('customerID', bindingContext.getObject().ID);
        getActivitiesOperation.setParameter('bAll', bAll);

        const importActivitiesOperation = that.getModel().bindContext('/importActivities(...)', bindingContext);
        importActivitiesOperation.setParameter('customerID', bindingContext.getObject().ID);

        let tableTitle = bAll? 'All available Activities': 'Recommended Activities from Maturity Assessment';

        getActivitiesOperation
            .execute()
            .then(() => {
                console.log('getActivitiesOperation CAP action done!');
                const activity_templates = getActivitiesOperation.getBoundContext().getObject();
                
                if (activity_templates.value.length === 0) {
                    sap.ui.core.BusyIndicator.hide();
                    //MessageToast.show('THIS IS A TEST');
                    MessageBox.show('No activities found.\n\nCheck that a maturity assessment has been entered for the customer!', {
                        icon: MessageBox.Icon.WARNING,
                        title: 'No activities',
                        actions: [MessageBox.Action.CLOSE]
                    });
                } else {
                    // Add a property for the checkbox selected value.
                    for (var i = 0; i < activity_templates.value.length; i++) {
                        activity_templates.value[i].selected = false;
                    }
                    var activitiesJSONModel = new JSONModel(activity_templates.value);
                    tableTitle = tableTitle + ' (' + activity_templates.value.length + ')';

                    /**
                     * Create a dialog holding a sap.m.Table for the found activities.
                     * Note: the binding uses a Sorter to provide grouping on the
                     * technical domain values.
                     */
                    if (!that.activityTemplateDialog) {
                        that.activityTemplateDialog = new Dialog({
                            title: tableTitle,
                            afterClose: function () {
                                that.activityTemplateDialog.destroy();
                                that.activityTemplateDialog = null;
                            },
                            content: new Table({
                                autoPopinMode : true,
                                sticky: [sap.m.Sticky.ColumnHeaders],
                                columns: [
                                    new Column({
                                        header: [
                                            new Label({text: ''})
                                        ],
                                        width: '5em'
                                    }),
                                    new Column({
                                        header: [
                                            new Label({text: 'Activity'})
                                        ],
                                        width: '30em'
                                    }),
                                    new Column({
                                        header: [
                                            new Label({text: 'Supporting Team'})
                                        ]
                                    }),
                                    new Column({
                                        header: [
                                            new Label({text: 'Region'})
                                        ]
                                    }),
                                    new Column({
                                        header: [
                                            new Label({text: 'Rating'})
                                        ]
                                    })
                                ]
                            }).bindItems("/", new ColumnListItem({
                                cells: [
                                    new CheckBox({selected: "{selected}"}),
                                    //new Text({text: "{short_text}"}),
                                    new Link({text: "{short_text}", wrapping: true, press: function(oEvent) {
                                        navigateToActivityRepo(oEvent.getSource().getBindingContext().getObject());
                                    }, target: "_blank"}),
                                    //new Text({text: "{supportingteam_description}"}),
                                    new Text({text: "{supportingteam/description}"}),
                                    new Text({text: "{region/name}"}),
                                    new RatingIndicator({
                                        editable: false,
                                        value: "{rating}",

                                    })
                                ]
                            }), new Sorter('domain/name', false, function(oContext) {
                                let name = oContext.getProperty('domain/name');
                                return {
                                    key: name,
                                    name: name
                                };
                            })),
                            beginButton: new Button({
                                type: ButtonType.Emphasized,
                                text: "Import Selected Activities",
                                press: function () {
                                    that.activityTemplateDialog.close();

                                    let activities = activitiesJSONModel.getData().filter(x => x.selected);
                                    if (activities.length === 0) {
                                        MessageToast.show('No activities selected for import');
                                        return;
                                    }
                                    activities.forEach(obj => {
                                        delete obj['selected'];
                                    });
                                    console.dir(activities);

                                    sap.ui.core.BusyIndicator.show();
                                    importActivitiesOperation.setParameter('activities', activities);
                                    importActivitiesOperation
                                        .execute()
                                        .then(() => {
                                            console.log('importActivitiesOperation CAP action done!');
                                            sap.ui.core.BusyIndicator.hide();
                                            that._controller.extensionAPI.refresh();
                                            MessageBox.show('Selected activities have been imported to the engagement plan.\n\nPlease add your expected engagement outcomes on each activity!', {
                                                icon: MessageBox.Icon.SUCCESS,
                                                title: 'Success',
                                                actions: [MessageBox.Action.CLOSE]
                                            });
                                        })
                                        .catch(error => {
                                            sap.ui.core.BusyIndicator.hide();
                                            MessageBox.show('Importing selected activities failed.', {
                                                icon: MessageBox.Icon.ERROR,
                                                title: 'An error occured',
                                                details: error,
                                                actions: [MessageBox.Action.CLOSE]
                                            });
                                            console.dir(error);
                                        });
                                }.bind(that)
                            }),
                            endButton: new Button({
                                text: "Cancel",
                                press: function () {
                                    this.activityTemplateDialog.close();
                                    sap.ui.core.BusyIndicator.hide();
                                }.bind(that)
                            })
                        });
        
                        that.activityTemplateDialog.setModel(activitiesJSONModel);
                        that._view.addDependent(this.activityTemplateDialog);
                    }
    
                    sap.ui.core.BusyIndicator.hide();
                    that.activityTemplateDialog.open();
                }
            })
            .catch((err) => {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.show('Failed to get activity templates.', {
                    icon: MessageBox.Icon.ERROR,
                    title: 'An error occured',
                    details: err,
                    actions: [MessageBox.Action.CLOSE]
                });
            });
    }

    return {

        /**
         * Open the maturity help text as side content on the `MaturityTable`
         * section.
         * 
         * @param {*} bindingContext 
         * @param {*} selectedContexts 
         * @returns 
         */
        openMaturityHelper: function (bindingContext, selectedContexts) {
            this.showSideContent("MaturityTable");
        },

        addFromTemplate: function (bindingContext, selectedContexts) {
            processActivities(this, bindingContext, true);
        },

        /**
         * Get list of activity templates and allow user to choose
         * 
         * @param {*} bindingContext
         * @param {*} selectedContexts 
         * @returns 
         */
         addRecommendedFromTemplate: function (bindingContext, selectedContexts) {
            processActivities(this, bindingContext, false);
            return;

            let that = this;

            // Setup the binding contexts for the action calls.
            const getActivitiesOperation = this.getModel().bindContext('/getActivities(...)', bindingContext);
            getActivitiesOperation.setParameter('customerID', bindingContext.getObject().ID);

            const importActivitiesOperation = this.getModel().bindContext('/importActivities(...)', bindingContext);
            importActivitiesOperation.setParameter('customerID', bindingContext.getObject().ID);

            getActivitiesOperation
                .execute()
                .then(() => {
                    console.log('getActivitiesOperation CAP action done!');
                    const activity_templates = getActivitiesOperation.getBoundContext().getObject();
                    
                    if (activity_templates.value.length === 0) {
                        MessageToast.show("No matching activity templates found");
                    } else {
                        // Add a property for the checkbox selected value.
                        for (var i = 0; i < activity_templates.value.length; i++) {
                            activity_templates.value[i].selected = false;
                        }
                        var activitiesJSONModel = new JSONModel(activity_templates.value);

                        /**
                         * Create a dialog holding a sap.m.Table for the found activities.
                         * Note: the binding uses a Sorter to provide grouping on the
                         * technical domain values.
                         */
                        if (!that.activityTemplateDialog) {
                            that.activityTemplateDialog = new Dialog({
                                title: "Recommended Activities",
                                afterClose: function () {
                                    that.activityTemplateDialog.destroy();
                                    that.activityTemplateDialog = null;
                                },
                                content: new Table({
                                    autoPopinMode : true,
                                    sticky: [sap.m.Sticky.ColumnHeaders],
                                    columns: [
                                        new Column({
                                            header: [
                                                new Label({text: ''})
                                            ],
                                            width: '5em'
                                        }),
                                        new Column({
                                            header: [
                                                new Label({text: 'Activity'})
                                            ],
                                            width: '30em'
                                        }),
                                        new Column({
                                            header: [
                                                new Label({text: 'Supporting Team'})
                                            ]
                                        }),
                                        new Column({
                                            header: [
                                                new Label({text: 'Region'})
                                            ]
                                        }),
                                        new Column({
                                            header: [
                                                new Label({text: 'Rating'})
                                            ]
                                        })
                                    ]
                                }).bindItems("/", new ColumnListItem({
                                    cells: [
                                        new CheckBox({selected: "{selected}"}),
                                        new Text({text: "{short_text}"}),
                                        new Text({text: "{supportingteam_description}"}),
                                        new Text({text: "{region_name}"}),
                                        new RatingIndicator({
                                            editable: false,
                                            value: "{rating}",

                                        })
                                    ]
                                }), new Sorter('technicaldomain_name', false, function(oContext) {
                                    let name = oContext.getProperty('technicaldomain_name');
                                    return {
                                        key: name,
                                        name: name
                                    };
                                })),
                                beginButton: new Button({
                                    type: ButtonType.Emphasized,
                                    text: "Import Selected Activities",
                                    press: function () {
                                        this.activityTemplateDialog.close();

                                        let activities = activitiesJSONModel.getData().filter(x => x.selected);
                                        if (activities.length === 0) {
                                            MessageToast.show('No activities selected for import');
                                            return;
                                        }
                                        activities.forEach(obj => {
                                            delete obj['selected'];
                                        });
                                        console.dir(activities);
                                        importActivitiesOperation.setParameter('activities', activities);
                                        importActivitiesOperation
                                            .execute()
                                            .then(() => {
                                                console.log('importActivitiesOperation CAP action done!');
                                                that._controller.extensionAPI.refresh();
                                                MessageBox.show('Selected activities have been imported to the engagement plan.\n\nPlease add your expected engagement outcomes on each activity!', {
                                                    icon: MessageBox.Icon.SUCCESS,
                                                    title: 'Success',
                                                    actions: [MessageBox.Action.CLOSE]
                                                });
                                            })
                                            .catch(error => {
                                                MessageBox.show('Importing selected activities failed.', {
                                                    icon: MessageBox.Icon.ERROR,
                                                    title: 'An error occured',
                                                    details: error,
                                                    actions: [MessageBox.Action.CLOSE]
                                                });
                                                console.dir(error);
                                            });
                                    }.bind(that)
                                }),
                                endButton: new Button({
                                    text: "Cancel",
                                    press: function () {
                                        this.activityTemplateDialog.close();
                                    }.bind(that)
                                })
                            });
            
                            that.activityTemplateDialog.setModel(activitiesJSONModel);
                            that._view.addDependent(this.activityTemplateDialog);
                        }
            
                        that.activityTemplateDialog.open();
                    }
                })
                .catch((err) => {
                    console.dir(err);
                    MessageBox.show('Failed to get activity templates.', {
                        icon: MessageBox.Icon.ERROR,
                        title: 'An error occured',
                        details: err,
                        actions: [MessageBox.Action.CLOSE]
                    });
                });
        }
    }
});