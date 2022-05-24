sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/Device"],
  /**
   * provide app-view type models (as in the first "V" in MVVC)
   *
   * @param {typeof sap.ui.model.json.JSONModel} JSONModel
   * @param {typeof sap.ui.Device} Device
   *
   * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
   */
  function (JSONModel, Device) {
    "use strict";

    return {
      createDeviceModel: function () {
        var oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
      },

      getTaskDetails: function (sUser, that, sCallback) {
        var oModel = !sCallback
          ? that.getModel()
          : that.getOwnerComponent().getModel();
        oModel.setUseBatch(false);
        var oOrderModel = !sCallback
          ? that.getModel("OrdersModel")
          : that.getOwnerComponent().getModel("OrdersModel");
        oOrderModel.setProperty("/busy", true);
        oModel.callFunction("/getTaskDetails", {
          method: "GET",
          urlParameters: { user: sUser },
          success: function (oData) {
            var aData = [];
            oData.results &&
              oData.results.forEach((task) => {
                aData.push({
                  ...task,
                  ...(task.context &&
                    task.context.orderData &&
                    task.context.orderData),
                });
              });
            oOrderModel.setProperty("/Orders", aData);
            oOrderModel.setProperty("/busy", false);
          },
          error: function (err) {
            oOrderModel.setProperty("/busy", false);
          },
        });
      },

      completeTask: function (sId, sUser, sWFID, that) {
        var oModel = that.getOwnerComponent().getModel();
        oModel.setUseBatch(false);
        var oOrderModel = that.getOwnerComponent().getModel("OrdersModel");
        oOrderModel.setProperty("/busy", true);
        oModel.callFunction("/completeTask", {
          method: "POST",
          urlParameters: { id: sId, user: sUser, wfId: sWFID },
          success: function () {
            this.getTaskDetails(constants.USER_INFO, that, "test");
          }.bind(this),
          error: function (err) {
            oOrderModel.setProperty("/busy", false);
          },
        });
      },
    };
  }
);
