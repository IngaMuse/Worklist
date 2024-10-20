sap.ui.define([
	] , function () {
		"use strict";

		return {
			
			modifiedFormatter(oData) {
				const oDateFormatter = sap.ui.core.format.DateFormat.getDateInstance({
					style: 'medium'
				})
				return oDateFormatter.format(oData);
			}

		};

	}
);