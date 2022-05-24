sap.ui.define(
  ["sap/ui/core/mvc/Controller", "workflowmodule/workflowmodule/model/models"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, models) {
    "use strict";

    return Controller.extend(
      "workflowmodule.workflowmodule.controller.orders",
      {
        onInit: function () {
        },
        onPickuppress: function (oEvent) {
            let oModel = oEvent.getSource().getParent().getBindingContext("OrdersModel");
            models.completeTask(oModel.getProperty("id"), oModel.getProperty("activityId"), oModel.getProperty("workflowInstanceId"), this)
        },

        onOrderTypeChanged : function() {            
            models.getTaskDetails(this.getView().getModel("OrdersModel").getProperty("/selectedType"), this, "test");
        }
      }
    );
  }
);
