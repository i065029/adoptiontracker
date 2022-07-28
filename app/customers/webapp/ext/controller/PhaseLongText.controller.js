sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/m/Label"
], function (Controller, RichTextEditor, Label) {
    "use strict";
    return Controller.extend("com.sap.pntcee.customers.ext.controller.PhaseLongText", {

        onInit: function() {
            let editForm = this.getView().byId("phaseLongTextEditForm");
            editForm.onAfterRendering = function() {
                //Create the RichTextEditor when changing to edit mode for the first time
                if (editForm.getContent().length === 0) {
                    let RTE = new RichTextEditor("phaseRichTextEditor", {
                        editorType: "TinyMCE5",
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
                        value: "{phase_description}"
                    });
                    //let RTELabel = new Label("richTextEditorLabel", {
                    //    text: "Long description",
                    //    labelFor: "activityRichTextEditor"
                    //});
                    //editForm.addContent(RTELabel);
                    editForm.addContent(RTE);
                } else {
                    if(this.getView().byId("phaseRichTextEditor")) {
                        this.getView().byId("phaseRichTextEditor").setVisible(true);
                    }
                }
            }.bind(this);

            this.getView().byId("phaseLongTextDisplayForm").onBeforeRendering = function() {
                if(this.getView().byId("phaseRichTextEditor")) {
                    this.getView().byId("phaseRichTextEditor").setVisible(false);
                }
            }.bind(this);
        }
    });
});