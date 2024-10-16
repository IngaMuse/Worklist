sap.ui.define(
  [
    "zjblessons/Worklist/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "zjblessons/Worklist/model/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    Sorter,
    Filter,
    FilterOperator,
    Fragment,
    MessageToast
  ) {
    "use strict";

    return BaseController.extend("zjblessons.Worklist.controller.Worklist", {
      formatter: formatter,

      onInit: function () {
        const oViewModel = new JSONModel({
          sCount: "0",
        });
        this.setModel(oViewModel, "worklistView");
      },

      onBeforeRendering: function () {
        this._bindTable();
      },

      _bindTable() {
        const oTable = this.getView().byId("table");
        oTable.bindItems({
          path: "/zjblessons_base_Headers",
          sorter: [new Sorter("DocumentDate", true)],
          template: this._getTableTemplate(),
          urlParameters: {
            $select:
              "HeaderID,DocumentNumber,DocumentDate,PlantText,RegionText,Description,Created",
          },
          events: {
            dataRequested: (oData) => {
              this._getTableCounter();
            },
          },
        });
      },

      _getTableCounter() {
        this.getModel().read("/zjblessons_base_Headers/$count", {
          success: (sCount) => {
            this.getModel("worklistView").setProperty("/sCount", sCount);
          },
        });
      },

      _getTableTemplate() {
        const oTemplate = new sap.m.ColumnListItem({
          type: "Navigation",
          cells: [
            new sap.m.Text({
              text: "{DocumentNumber}",
            }),
            new sap.m.Text({
              text: {
                path: "DocumentDate",
                type: "sap.ui.model.type.Date",
                formatOptions: { style: "short" },
              },
            }),
            new sap.m.Text({
              text: "{PlantText}",
            }),
            new sap.m.Text({
              text: "{RegionText}",
            }),
            new sap.m.Text({
              text: "{Description}",
            }),
            new sap.m.Text({
              text: {
                path: "Created",
                type: "sap.ui.model.type.Date",
                formatOptions: { style: "short" },
              },
            }),
            new sap.m.Button({
              type: 'Transparent',
              icon: this.getResourceBundle().getText('iDecline'),
              press: this._onPressDelete.bind(this)
            })
          ],
        });
        return oTemplate;
      },


      _onPressDelete(oEvent) {
        const oBindingContext = oEvent.getSource().getBindingContext(),
        sKey = this.getModel().createKey('/zjblessons_base_Headers', {
          HeaderID: oBindingContext.getProperty('HeaderID')
        });
        sap.m.MessageBox.confirm("Do you really want to delete this entry?", {
          title: "Delete confirmation",
          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
          onClose: function (oAction) { if(oAction === sap.m.MessageBox.Action.YES)
            this.getModel().remove(sKey)
          }.bind(this)
      });
      },

      onPressRefresh() {
        MessageToast.show('Refresh');
        this._bindTable();
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

      onPressCreate() {
        this._loadCreateDialog();
      },

      _loadCreateDialog: async function () {
        this._oDialog = await Fragment.load({
          name: "zjblessons.Worklist.view.fragment.CreateDialog",
          controller: this,
          id: this.getView().getId(),
        }).then((oDialog) => {
          this.getView().addDependent(oDialog);
          return oDialog;
        });
        this._oDialog.open();
      },

      onDialogBeforeOpen(oEvent) {
        const oDialog = oEvent.getSource();
        const oParams = {
          Version: "A",
          HeaderID: "0",
          Created: new Date(),
          IntegrationID: null,
        };
        const oEntry = this.getModel().createEntry("/zjblessons_base_Headers", {
          properties: oParams,
        });
        oDialog.setBindingContext(oEntry);
      },
      onPressCancel() {
        this.getModel().resetChanges();
        this._oDialog.destroy();
      },
      onPressSave(oEvent) {
        this.getModel().submitChanges({
          success: () => {
            this._bindTable();
          },
        });
        this._oDialog.destroy();
      },
    });
  }
);
