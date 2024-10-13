sap.ui.define([
		"zjblessons/Worklist/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblessons.Worklist.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);