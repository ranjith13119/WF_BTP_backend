sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/Device", "chatbot/chatbot/model/models"],
  function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("chatbot.chatbot.Component", {
      metadata: {
        manifest: "json",
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

        this.renderRecastChatbot();
      },

      renderRecastChatbot: function () {
        if (!document.getElementById("cai-webchat")) {
          var s = document.createElement("script");
          s.setAttribute("id", "cai-webchat");
          s.setAttribute("src", "https://cdn.cai.tools.sap/webclient/bootstrap.js");
          document.body.appendChild(s);
        }
        s.setAttribute("channelId", "xxx");
        s.setAttribute("token", "xxx");
      },
    });
  }
);
