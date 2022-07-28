sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  const MaturityAssessment = Controller.extend("com.sap.pntcee.customers.ext.controller.MaturityAssessment", {});

  MaturityAssessment.prototype.onAfterRendering = function() {
    window.xcomp = this.getOwnerComponent();
    window.xview = this.getView();
    //debugger;
  };

  MaturityAssessment.prototype.navigate = function() {
    console.log(111111);
    try {
      window.xcomp = this.getOwnerComponent();
      window.xview = this.getView();
    } catch (err) {
      console.dir(err);
    }
  };

  return MaturityAssessment;
});
