/*global location*/
sap.ui.define([
		"zjblessons/Worklist/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"zjblessons/Worklist/model/formatter"
	], function (
		BaseController,
		JSONModel,
		History,
		formatter
	) {
		"use strict";

		return BaseController.extend("zjblessons.Worklist.controller.Object", {

			formatter: formatter,

			onInit : function () {
					const oViewModel = new JSONModel({
						busy : true,
						delay: 0,
						sSelectedTab: 'List',
						bEditMode: false,
						sVersion: ''
					});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
				this.setModel(oViewModel, "objectView");
			},

			onNavBack : function() {
				this._navBack();
			},

			_navBack() {
				const sPreviousHash = History.getInstance().getPreviousHash();
				if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					this.getRouter().navTo("worklist", {}, true);
				}
			},

			_onObjectMatched: function (oEvent) {
				const sObjectId = oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					const sObjectPath = this.getModel().createKey("zjblessons_base_Headers", {
						HeaderID :  sObjectId
					});

					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}
			},

			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			},

			onPressEdit(){
				this._setEditModel(true);
			},

			onPressSave() {
				const oModel = this.getModel(),
					oView = this.getView(),
					oPendingChanges = oModel.getPendingChanges(),
					sPath = oView.getBindingContext().getPath().slice(1);
				if (oPendingChanges.hasOwnProperty(sPath)) {
					oView.setBusy(true);
					oModel.submitChanges({
						success: () => {
							oView.setBusy(false);
						},
						error: () => {
							oView.setBusy(false);
						}
					});
			}
				this._setEditModel(false);
			},

			onPressCancel(){
				this._setEditModel(false);
				this.getModel().resetChanges();
			},

			_setEditModel(bValue) {
				const oModel = this.getModel("objectView");
				oModel.setProperty('/bEditMode', bValue);
			},

			onPressDelete() {
				const oView = this.getView(),
					sPath = oView.getBindingContext().getPath();
          sap.m.MessageBox.confirm(this.getResourceBundle().getText('sMessageConfirmation'), {
            title: this.getResourceBundle().getText('sTitleConfirmation'),
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						styleClass: 'sapUiSizeCozy',
            onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								oView.setBusy(true);
								this.getModel().remove(sPath, {
								success: function () {
									oView.setBusy(false);
									this._navBack();
								}.bind(this),
								error: function () {
									
								}.bind(this)
								}
								)
							}
            }.bind(this)
          });
			},
		});
	}
);