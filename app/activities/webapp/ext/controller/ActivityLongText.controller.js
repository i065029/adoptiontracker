sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/m/Label"
], function (Controller, RichTextEditor, Label) {
    "use strict";
    return Controller.extend("com.sap.pntcee.activities.ext.controller.ActivityLongText", {

        onInit: function() {
            let editForm = this.getView().byId("activityLongTextEditForm");
            editForm.onAfterRendering = function() {
                //Create the RichTextEditor when changing to edit mode for the first time
                if (editForm.getContent().length === 0) {
                    let RTE = new RichTextEditor("activityRichTextEditor", {
                        editorType: "TinyMCE4",
                        width: "100%",
                        height: "95%",
                        customToolbar: true,
                        editable: true,
                        showGroupFontStyle: true,
                        showGroupTextAlign: true,
                        showGroupStructure: true,
                        showGroupFont: true,
                        showGroupClipboard: false,
                        showGroupInsert: true,
                        showGroupLink: true,
                        showGroupUndo: true,
                        sanitizeValue: true,
                        wrapping: true,
                        value: "{activity_description}"
                    });
                    //let RTELabel = new Label("richTextEditorLabel", {
                    //    text: "Long description",
                    //    labelFor: "activityRichTextEditor"
                    //});
                    //editForm.addContent(RTELabel);
                    editForm.addContent(RTE);
                } else {
                    if(this.getView().byId("activityRichTextEditor")) {
                        this.getView().byId("activityRichTextEditor").setVisible(true);
                    }
                }
            }.bind(this);

            this.getView().byId("activityLongTextDisplayForm").onBeforeRendering = function() {
                if(this.getView().byId("activityRichTextEditor")) {
                    this.getView().byId("activityRichTextEditor").setVisible(false);
                }
            }.bind(this);
        }
    });
});