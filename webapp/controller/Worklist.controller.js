sap.ui.define(
  [
    "zjblessons/Worklist/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "zjblessons/Worklist/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("zjblessons.Worklist.controller.Worklist", {
      formatter: formatter,

      onInit: function () {
        const oViewModel = new JSONModel({});
        this.setModel(oViewModel, "worklistView");
      },

      onSearch(oEvent) {
        const sValue = oEvent.getParameter("value");
        let sValueType;
        oEvent.getSource().sId.includes('Plant') ? sValueType = "Plant" : sValueType = "Search";
        this._searchHandler(sValue, sValueType);
        debugger;
      },
      onLiveSearch(oEvent) {
        const sValue = oEvent.getParameter("newValue");
        let sValueType;
        oEvent.getSource().sId.includes('Plant') ? sValueType = "Plant" : sValueType = "Search";
        this._searchHandler(sValue, sValueType);
      },

      _searchHandler(sValue, sValueType) {
        const oTable = this.getView().byId("table"),
          oFilter = !!sValue.length
            ? sValueType==="Search"?new Filter('DocumentNumber', FilterOperator.Contains, sValue):
            new Filter('PlantText', FilterOperator.EQ, sValue)
            : [];
        oTable.getBinding("items").filter(oFilter);
      },

    });
  }
);
