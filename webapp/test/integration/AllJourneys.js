/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblessons/Worklist/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblessons/Worklist/test/integration/pages/Worklist",
	"zjblessons/Worklist/test/integration/pages/Object",
	"zjblessons/Worklist/test/integration/pages/NotFound",
	"zjblessons/Worklist/test/integration/pages/Browser",
	"zjblessons/Worklist/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblessons.Worklist.view."
	});

	sap.ui.require([
		"zjblessons/Worklist/test/integration/WorklistJourney",
		"zjblessons/Worklist/test/integration/ObjectJourney",
		"zjblessons/Worklist/test/integration/NavigationJourney",
		"zjblessons/Worklist/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});