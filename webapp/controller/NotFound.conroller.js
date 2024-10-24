sap.ui.define([
  "zjblessons/Worklist/controller/BaseController"
], function (BaseController) {
  "use strict";

  return BaseController.extend("zjblessons.Worklist.controller.NotFound", {

    onLinkPressed : function () {
      this.getRouter().navTo("worklist");
    }

  });

}
);