sap.ui.define([
		"zjblessons/Worklist/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/Worklist/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("zjblessons.Worklist.controller.Worklist", {

			formatter: formatter,

			onInit : function () {
				const oViewModel = new JSONModel({
				});
				this.setModel(oViewModel, "worklistView");
			},

			onSearch(oEvent) {
				const sValue = oEvent.getParameter('value');
				this._searchHandler(sValue);
			},
			onLiveSearch(oEvent) {
				const sValue = oEvent.getParameter('newValue');
				this._searchHandler(sValue);
			},

			_searchHandler(sValue) {
				const oTable = this.getView().byId('table'),
				oFilter = !!sValue.length ? [new Filter('DocumentNumber', FilterOperator.Contains, sValue)] : [];
				oTable.getBinding('items').filter(oFilter);
			},

			onPress : function (oEvent) {
				this._showObject(oEvent.getSource());
			},

			onNavBack : function() {
				history.go(-1);
			},

			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},

			_showObject : function (oItem) {
				this.getRouter().navTo("object", {
					objectId: oItem.getBindingContext().getProperty("HeaderID")
				});
			},

			_applySearch: function(aTableSearchState) {
				var oTable = this.byId("table"),
					oViewModel = this.getModel("worklistView");
				oTable.getBinding("items").filter(aTableSearchState, "Application");
				if (aTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			}

		});
	}
);