sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "dipatchlist/dipatchlist/model/models",
        "dipatchlist/dipatchlist/model/constants",
    ],
    function (UIComponent, Device, models, constants) {
        "use strict";

        return UIComponent.extend("dipatchlist.dipatchlist.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                models.getTaskDetails(constants.USER_INFO, this, "");
            }
        });
    }
);