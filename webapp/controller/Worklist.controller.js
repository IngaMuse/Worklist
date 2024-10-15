sap.ui.define(
  [
    "zjblessons/Worklist/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "zjblessons/Worklist/model/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, JSONModel, formatter, Sorter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("zjblessons.Worklist.controller.Worklist", {
      formatter: formatter,

      onInit: function () {
        const oViewModel = new JSONModel({
          sCount: '0'
        });
        this.setModel(oViewModel, "worklistView");
      },

      onBeforeRendering: function() {
        this._bindTable();
      },

      _bindTable() {
        const oTable = this.getView().byId('table');
        oTable.bindItems({
          path: '/zjblessons_base_Headers',
          sorter: [new Sorter('DocumentDate', true)],
          template: this._getTableTemplate(),
          urlParameters: {
              $select: 'HeaderID,DocumentNumber,DocumentDate,PlantText,RegionText,Description,Created'
          },
          events: {
            dataRequested: (oData) => {
              this._getTableCounter();
            }
          }
        })
      },

      _getTableCounter() {
        this.getModel().read('/zjblessons_base_Headers/$count', {
          success: (sCount) => {
            this.getModel('worklistView').setProperty('/sCount', sCount)
          }
        })
      },

      _getTableTemplate() {
        const oTemplate = new sap.m.ColumnListItem({
          type: 'Navigation',
          navigated: true,
          cells: [
            new sap.m.Text({
              text: '{DocumentNumber}'
            }),
            new sap.m.Text({
              text: '{DocumentDate}'
            }),
            new sap.m.Text({
              text: '{PlantText}'
            }),
            new sap.m.Text({
              text: '{RegionText}'
            }),
            new sap.m.Text({
              text: '{Description}'
            }),
            new sap.m.Text({
              text: '{Created}'
            }),
          ]
        })
        return oTemplate;
      },





      onSearch(oEvent) {
        const sValue = oEvent.getParameter("value");
        this._searchHandler(sValue);
      },
      onLiveSearch(oEvent) {
        const sValue = oEvent.getParameter("newValue");
        this._searchHandler(sValue);
      },

      _searchHandler(sValue) {
        const oTable = this.getView().byId("table"),
          oFilter = !!sValue.length
            ? new Filter({
                filters: [
                  new Filter("DocumentNumber", FilterOperator.Contains, sValue),
                  new Filter("PlantText", FilterOperator.EQ, sValue),
                ],
              })
            : [];
        oTable.getBinding("items").filter(oFilter);
      },

      onPress: function (oEvent) {
        this._showObject(oEvent.getSource());
      },

      onNavBack: function () {
        history.go(-1);
      },

      onRefresh: function () {
        var oTable = this.byId("table");
        oTable.getBinding("items").refresh();
      },

      _showObject: function (oItem) {
        this.getRouter().navTo("object", {
          objectId: oItem.getBindingContext().getProperty("HeaderID"),
        });
      },

      _applySearch: function (aTableSearchState) {
        var oTable = this.byId("table"),
          oViewModel = this.getModel("worklistView");
        oTable.getBinding("items").filter(aTableSearchState, "Application");
        if (aTableSearchState.length !== 0) {
          oViewModel.setProperty(
            "/tableNoDataText",
            this.getResourceBundle().getText("worklistNoDataWithSearchText")
          );
        }
      },
    });
  }
);
