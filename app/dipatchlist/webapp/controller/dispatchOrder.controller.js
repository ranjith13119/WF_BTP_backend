sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "dipatchlist/dipatchlist/model/models"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, models) {
        "use strict";

        return Controller.extend("dipatchlist.dipatchlist.controller.dispatchOrder", {
            onInit: function () {

            },

            onDispatchpress : function(oEvent) {
                let oModel = oEvent.getSource().getParent().getBindingContext("OrdersModel");
                models.completeTask(oModel.getProperty("id"), oModel.getProperty("activityId"), oModel.getProperty("workflowInstanceId"), this);
            }
        });
    });
