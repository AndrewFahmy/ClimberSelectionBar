define(["jquery", "underscore", "qlik", "translator", "ng!$q", "ng!$http", "./properties", "./initialproperties", "client.utils/state", "objects.backend-api/field-api", "./lib/js/extensionUtils", "./lib/js/moment", "./lib/js/daterangepicker", "general.models/library/dimension", "text!./lib/css/style.css", "text!./lib/css/daterangepicker.css", "text!./lib/partials/template.html", "./lib/js/clTouch", "./lib/js/onLastRepeatDirective"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    "use strict";

    function r(a) {
        var b = 25568,
            c = 86400,
            d = (a - b) * c;
        return d
    }

    function s(a) {
        var b = l().utcOffset();
        return b >= 0 ? a.subtract(b, "m") : a.add(b, "m")
    }

    function t(a, b, c) {
        return c ? l.unix(r(a)).utc().format(b) : s(l.unix(r(a)).utc()).format(b)
    }

    function u(a, c, d) {
        var e;
        return a && (e = b.isNumber(Number(a)) && Number(a) < 1e5 ? t(a, c, d) : d ? l.utc(a, c, !1).format(c) : s(l.utc(a, c, !1)).format(c)), e
    }
    var v = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/sense/app/"));
    return v && "/" !== v.substr(0, 1) && (v = "/" + v), o = o.replace(new RegExp("__VirtualProxyPrefix__", "g"), v), k.addStyleToHeader(o), k.addStyleToHeader(p), {
        definition: g,
        initialProperties: h,
        thinHeader: !0,
        snapshot: {
            canTakeSnapshot: !0
        },
        support: {
            "export": !0,
            exportData: !0
        },
        resize: function(a, b) {
            this.paint(a, b)
        },
        paint: function(b, c) {
            var d = this;
            a(".qv-card" && !c.showTitles) ? a(".qv-object-cl-horizontalselectionbar").find("header.thin").addClass("no-title") : a(".qv-object-cl-horizontalselectionbar").find("header.thin").removeClass("no-title"), this.$scope.props = c.props, this.$scope.qId = c.qInfo.qId, d.$scope.setFields(c.kfLists), d.$scope.initSelectionsApplied || d.$scope.setInitSelections();
            var f = e.defer();
            return d.$scope.paintPromise = f, d.$scope.paintPromise.promise
        },
        template: q,
        controller: ["$scope", "$element", function(e, f) {
            e.enigmaModel = e.component.model.hasOwnProperty("enigmaModel") ? e.component.model.enigmaModel : e.component.model, e.options = {};
            var g, h = c.currApp();
            g = h ? h.model.layout.qLocaleInfo : {
                qCalendarStrings: {
                    qDayNames: ["må", "ti", "on", "to", "fr", "lö", "sö"],
                    qMonthNames: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
                },
                qFirstWeekDay: 0,
                qCollation: "sv-SE",
                qDateFmt: "YYYY-MM-DD"
            };
            var j = b.clone(g.qCalendarStrings.qDayNames);
            j.unshift(j.pop());
            var k = (g.qFirstWeekDay + 1) % 6;
            e.format = {
                CollationLocale: g.qCollation,
                DateFormat: g.qDateFmt,
                MonthNames: g.qCalendarStrings.qMonthNames,
                FirstWeekDay: k,
                DayNames: j
            }, e.selections = {
                field: "",
                swipe_idx_min: -1,
                swipe_idx_max: -1,
                values_to_select: [],
                selectionMode: ""
            }, e.$on("onRepeatLast", function() {
                a("[id^=daterangepicker-container-" + e.qId + "]").remove(), b.each(e.fields, function(c) {
                    if ("DATERANGE" === c.type) {
                        var f = "daterangepicker-container-" + e.qId + "-" + c.id,
                            g = "daterange-" + e.qId + "-" + c.id;
                        0 === a("#" + f).length && a("body").append('<div id="' + f + '" class="bootstrap-horizontalselectionbar" style="position: absolute"></div>');
                        var h = c.dateToday,
                            i = function(a, b) {
                                e.selectDateFromAndTo(c.field, a.format(e.format.DateFormat), b.format(e.format.DateFormat), !0)
                            },
                            j = {
                                showDropdowns: !0,
                                singleDatePicker: c.singleDatePicker,
                                locale: {
                                    format: e.format.DateFormat,
                                    firstDay: e.format.FirstWeekDay,
                                    monthNames: e.format.MonthNames,
                                    daysOfWeek: e.format.DayNames,
                                    applyLabel: d.get("Common.Apply"),
                                    cancelLabel: d.get("Common.Cancel"),
                                    customRangeLabel: c.customRangeLabel
                                },
                                alwaysShowCalendars: c.alwaysShowCalendars,
                                parentEl: "#" + f
                            };
                        null != c.dateStart && null != c.dateEnd && (j.startDate = c.dateStart, j.endDate = c.dateEnd), null != c.dateMin && null != c.dateMax && (j.minDate = c.dateMin, j.maxDate = c.dateMax), c.dateRanges && (j.ranges = {}, b.each(c.dateRanges, function(a) {
                            var b = l(h).endOf("month").format(e.format.DateFormat) === l(h).format(e.format.DateFormat);
                            switch (a.value) {
                                case "TODAY":
                                    j.ranges[a.label] = [l(h), l(h)];
                                    break;
                                case "YESTERDAY":
                                    j.ranges[a.label] = [l(h).subtract(1, "days"), l(h).subtract(1, "days")];
                                    break;
                                case "LAST07DAYS":
                                    j.ranges[a.label] = [l(h).subtract(6, "days"), l(h)];
                                    break;
                                case "LAST14DAYS":
                                    j.ranges[a.label] = [l(h).subtract(13, "days"), l(h)];
                                    break;
                                case "LAST28DAYS":
                                    j.ranges[a.label] = [l(h).subtract(27, "days"), l(h)];
                                    break;
                                case "LAST30DAYS":
                                    j.ranges[a.label] = [l(h).subtract(29, "days"), l(h)];
                                    break;
                                case "LAST60DAYS":
                                    j.ranges[a.label] = [l(h).subtract(59, "days"), l(h)];
                                    break;
                                case "LAST90DAYS":
                                    j.ranges[a.label] = [l(h).subtract(89, "days"), l(h)];
                                    break;
                                case "THISWEEK":
                                    j.ranges[a.label] = [l(h).startOf("week"), l(h).endOf("week")];
                                    break;
                                case "LASTWEEK":
                                    j.ranges[a.label] = [l(h).subtract(1, "week").startOf("week"), l(h).subtract(1, "week").endOf("week")];
                                    break;
                                case "THISMONTH":
                                    j.ranges[a.label] = [l(h).startOf("month"), l(h).endOf("month")];
                                    break;
                                case "LASTMONTH":
                                    j.ranges[a.label] = [l(h).subtract(1, "month").startOf("month"), l(h).subtract(1, "month").endOf("month")];
                                    break;
                                case "THISQUARTER":
                                    j.ranges[a.label] = [l(h).startOf("quarter"), l(h).endOf("quarter")];
                                    break;
                                case "LASTQUARTER":
                                    j.ranges[a.label] = [l(h).subtract(1, "quarter").startOf("quarter"), l(h).subtract(1, "quarter").endOf("quarter")];
                                    break;
                                case "THISYEAR":
                                    j.ranges[a.label] = [l(h).startOf("year"), l(h).endOf("year")];
                                    break;
                                case "LASTYEAR":
                                    j.ranges[a.label] = [l(h).subtract(1, "year").startOf("year"), l(h).subtract(1, "year").endOf("year")];
                                    break;
                                case "WTD":
                                    j.ranges[a.label] = [l(h).startOf("week"), l(h)];
                                    break;
                                case "MTD":
                                    j.ranges[a.label] = [l(h).startOf("month"), l(h)];
                                    break;
                                case "QTD":
                                    j.ranges[a.label] = [l(h).startOf("quarter"), l(h)];
                                    break;
                                case "YTD":
                                    j.ranges[a.label] = [l(h).startOf("year"), l(h)];
                                    break;
                                case "R11":
                                    j.ranges[a.label] = [l(h).subtract(10, "month"), l(h)];
                                    break;
                                case "R11FM":
                                    j.ranges[a.label] = b ? [l(h).subtract(10, "month").startOf("month"), l(h).endOf("month")] : [l(h).subtract(11, "month").startOf("month"), l(h).subtract(1, "month").endOf("month")];
                                    break;
                                case "R12":
                                    j.ranges[a.label] = [l(h).subtract(11, "month"), l(h)];
                                    break;
                                case "R12FM":
                                    j.ranges[a.label] = b ? [l(h).subtract(11, "month").startOf("month"), l(h).endOf("month")] : [l(h).subtract(12, "month").startOf("month"), l(h).subtract(1, "month").endOf("month")]
                            }
                        })), a("#" + g).daterangepicker(j, i), a("#" + f + " div").first().css("display", "inline-flex")
                    }
                }), e.paintPromise.resolve()
            }), e.resolutionBreakpoint = {
                width: 1024,
                height: 35,
                xsmallheight: 30,
                hideLabelHeight: 30
            }, e.fields = [], e.variables = [], e.willApplyInitSelections = !1, e.initSelectionsApplied = !1, e.sessionStorageId = e.$parent.layout.qExtendsId ? e.$parent.layout.qExtendsId : e.$parent.layout.qInfo.qId, e.getSizeMode = function() {
                var b = "TOP" === e.layout.props.alignLabel && e.showLabels() ? a(f).height() - 10 : a(f).height();
                return a(document).width() <= e.resolutionBreakpoint.width || b <= e.resolutionBreakpoint.height ? b <= e.resolutionBreakpoint.xsmallheight ? "X-SMALL" : "SMALL" : ""
            }, e.showLabels = function() {
                return a(f).height() <= e.resolutionBreakpoint.hideLabelHeight && "TOP" === e.layout.props.alignLabel ? !1 : e.options.showLabels
            }, e.getClass = function() {
                return i.isInAnalysisMode() ? "" : "no-interactions"
            }, e.setFields = function(c) {
                var d = [],
                    f = !1;
                b.each(c, function(c, g) {
                    f = c.showLabels ? !0 : f;
                    var h = c.showLabels ? c.label : "",
                        i = c.qListObject.qDataPages[0] ? c.qListObject.qDataPages[0].qMatrix : [];
                    switch (c.listType) {
                        case "FIELD":
                            d.push({
                                field: c.qListObject.qDimensionInfo.qGroupFieldDefs[0],
                                type: c.listType,
                                id: g,
                                visible: c.listVisible,
                                initSelection: c.initSelection,
                                initSelectionSeparator: c.initSelectionSeparatorComma ? "," : c.initSelectionSeparator,
                                label: h,
                                data: i
                            });
                            break;
                        case "VARIABLE":
                            for (var j = c.variableValues ? a.map(c.variableValues.split(","), a.trim) : [], k = [], m = 0; m < j.length; m++) k.push({
                                value: j[m]
                            });
                            d.push({
                                variable: c.variable,
                                variableValue: c.variableValue,
                                id: g,
                                type: c.listType,
                                visible: c.listVisible,
                                initSelection: c.initSelection,
                                label: h,
                                data: k
                            });
                            break;
                        case "FLAG":
                            var n = [];
                            b.each(i, function(a) {
                                var b = a[0].qText.replace(" ", "-"),
                                    c = a;
                                c.icon = v + "/Extensions/cl-HorizontalSelectionBar/lib/images/flags/" + b + ".png", n.push(c)
                            }), d.push({
                                field: c.qListObject.qDimensionInfo.qGroupFieldDefs[0],
                                type: c.listType,
                                id: g,
                                visible: c.listVisible,
                                initSelection: c.initSelection,
                                initSelectionSeparator: c.initSelectionSeparatorComma ? "," : c.initSelectionSeparator,
                                label: h,
                                data: n
                            });
                            break;
                        case "DATERANGE":
                            var o = "",
                                p = null,
                                q = null,
                                r = e.format.DateFormat,
                                s = "DEFAULT" === c.date.displayFormat ? r : c.date.displayFormat,
                                t = u(c.date.rangeMin, r, !0),
                                w = u(c.date.rangeMax, r, !0),
                                x = u(c.date.initSelectionFrom, r),
                                y = u(c.date.initSelectionTo, r),
                                M = u(c.date.initSelection, r),
                                z = isNaN(Number(c.date.today)) ? u(c.date.today, r, !0) : l(),
                                A = c.date.useDateRanges && !c.date.singleDate ? c.date.dateRanges : null,
                                B = c.date.useDateRanges && !c.date.singleDate ? c.date.alwaysShowCalenders : !0,
                                C = c.date.customRangeLabel,
                                D = !1,
                                _l = c.date.singleDate;
                            c.qListObject.qDimensionInfo.qStateCounts.qSelected > 0 ? (c.qListObject.qDimensionInfo.qStateCounts.qSelected < c.date.max - c.date.min + 1 && (D = !0), p = u(c.date.min, r), q = c.date.singleDate ? u(c.date.min, r) : u(c.date.max, r), o = c.date.singleDate ? u(c.date.min, s) : u(c.date.min, s) + " - " + u(c.date.max, s)) : o = c.date.defaultText, d.push({
                                field: c.qListObject.qDimensionInfo.qGroupFieldDefs[0],
                                type: c.listType,
                                id: g,
                                visible: c.listVisible,
                                dateFromInitSelection: x,
                                dateToInitSelection: y,
                                dateInitSelection: M,
                                dateFormat: r,
                                displayDateFormat: s,
                                displayText: o,
                                isNotARange: D,
                                dateStart: p,
                                dateEnd: q,
                                dateToday: z,
                                dateMin: t,
                                dateMax: w,
                                label: h,
                                dateRanges: A,
                                alwaysShowCalendars: B,
                                customRangeLabel: C,
                                data: i,
                                singleDatePicker : _l
                            });
                            break;
                        default:
                            this.$scope.fields[g] = null
                    }
                }), e.options.showLabels = f, e.fields = d
            }, e.selectValue = function(a, b, c, d) {
                a.ctrlKey ? e.selectFieldValues(b, [e.getValue(c)], !1) : e.selectFieldValues(b, [e.getValue(c)], d)
            }, e.selectElemNo = function(a, b, c, d) {
                a.ctrlKey ? e.selectElemNos(b, [c], !1, !1) : e.selectElemNos(b, [c], d, !1)
            }, e.selectElemNos = function(a, b, c) {
                var d = "/kfLists/" + a + "/qListObjectDef";
                e.enigmaModel.selectListObjectValues(d, b, c, !1)
            }, e.selectDateFromAndTo = function(a, b, c, d) {
                a = "=" === a.substring(0, 1) ? a.substring(1, a.length) : a, h.field(a).selectMatch(">=" + b + "<=" + c, d).then(function() {})
            }, e.selectFieldValues = function(a, c, d) {
                a = "=" === a.substring(0, 1) ? a.substring(1, a.length) : a;
                var e = [];
                b.each(c, function(a) {
                    e.push(JSON.parse(a))
                }), h.field(a).selectValues(e, d)["catch"](function(a) {})
            }, e.setVariable = function(a, b) {
                h.variable.setStringValue(a, b).then(function() {})
            }, e.getValue = function(a) {
                return JSON.stringify(isNaN(a.qNum) ? {
                    qText: a.qText
                } : a.qNum)
            }, e.showField = function(a) {
                return a.visible && !b.isEmpty(a.data)
            }, e.changeAlternativeDimensions = function(a, b, c, d) {
                h.getObject(d).then(function(d) {
                    var e = [{
                        qOp: "replace",
                        qPath: "qHyperCubeDef/qDimensions/0",
                        qValue: JSON.stringify(b)
                    }, {
                        qOp: "replace",
                        qPath: "qHyperCubeDef/qLayoutExclude/qHyperCubeDef/qDimensions/" + c,
                        qValue: JSON.stringify(a)
                    }];
                    d.clearSoftPatches(), d.applyPatches(e, !0)
                })
            }, e.prepareAlternativeDimension = function(a) {
                var d = c.navigation.getCurrentSheetId();
                h.getObject(d.sheetId).then(function(c) {
                    var d = [];
                    b.each(c.layout.cells, function(a) {
                        "linechart" === a.type && d.push(a.name)
                    }), b.each(d, function(c) {
                        h.getObjectProperties(c).then(function(d) {
                            h.getObject(c).then(function(f) {
                                if (f.clearSoftPatches(), d.properties.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions && d.properties.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions.length > 0) {
                                    var g = d.properties.qHyperCubeDef.qDimensions[0];
                                    b.each(d.properties.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions, function(b, d) {
                                        b.qLibraryId ? n.getProperties(b.qLibraryId).then(function(f) {
                                            a === f.properties.qDim.title && e.changeAlternativeDimensions(g, b, d, c)
                                        }) : b.qDef.qFieldLabels[0] === a && e.changeAlternativeDimensions(g, b, d, c)
                                    })
                                }
                            })
                        })
                    })
                })
            }, e.checkInitSelections = function() {
                var a = JSON.parse(sessionStorage.getItem(e.sessionStorageId)),
                    b = a ? a.selectionApplied : !1;
                b && "ON_SHEET" !== e.layout.props.initSelectionMode || (e.willApplyInitSelections = !0)
            }, e.setInitSelections = function() {
                if (e.willApplyInitSelections) {
                    b.each(e.fields, function(a) {
                        if ("VARIABLE" !== a.type && "DATERANGE" !== a.type && "" !== a.initSelection) {
                            var c = ["=", "<", ">"];
                            if (c.indexOf(a.initSelection.substring(0, 1)) > -1) h.field(a.field).clear(), h.field(a.field).selectMatch(a.initSelection);
                            else {
                                var d = [],
                                    f = a.initSelection.split(a.initSelectionSeparator ? a.initSelectionSeparator : ";");
                                b.each(f, function(a) {
                                    d.push(isNaN(a) ? '{"qText": "' + a + '"}' : a)
                                }), e.selectFieldValues(a.field, d, !1)
                            }
                        }
                        "VARIABLE" === a.type 
                        && "" !== a.initSelection 
                        && e.setVariable(a.variable, a.initSelection), "DATERANGE" === a.type 
                        && "" !== a.dateFromInitSelection 
                        && "" !== a.dateToInitSelection 
                        && !a.singleDatePicker 
                        && e.selectDateFromAndTo(a.field, a.dateFromInitSelection, a.dateToInitSelection, !1)
                        , "DATERANGE" === a.type
                        && "" !== a.dateInitSelection 
                        && a.singleDatePicker 
                        && e.selectDateFromAndTo(a.field,
                        a.dateInitSelection, a.dateInitSelection, !1)
                    });
                    var a = {
                        selectionApplied: !0
                    };
                    sessionStorage.setItem(e.sessionStorageId, JSON.stringify(a))
                }
                e.initSelectionsApplied = !0, e.willApplyInitSelections = !1
            }, e.checkInitSelections(), e.onActivate = function() {}, e.onSwipeStart = function(b) {
                var c = a(b.target),
                    d = a(b.target).index(),
                    f = c.attr("field");
                e.selections.swipe_idx_min = d, e.selections.swipe_idx_max = d, e.selections.field = f;
                var g = parseInt(c.attr("datavalue"));
                e.selections.selectionsMode = !c.hasClass("S"), "undefined" != typeof g && (e.selections.selectionsMode ? (e.selections.values_to_select.push(g), c.removeClass("A X O"), c.addClass("S")) : (e.selections.values_to_select.push(g), c.removeClass("S"), c.addClass("X")))
            }, e.onSwipeUpdate = function(b) {
                var c = a(b.originalEvent.target),
                    d = c.attr("field");
                if (d === e.selections.field) {
                    var f = a(b.originalEvent.target).index(),
                        g = e.selections.swipe_idx_min > f || e.selections.swipe_idx_max < f;
                    if (g) {
                        e.selections.swipe_idx_min = e.selections.swipe_idx_min > f ? f : e.selections.swipe_idx_min, e.selections.swipe_idx_max = e.selections.swipe_idx_max < f ? f : e.selections.swipe_idx_max;
                        var h = a(b.originalEvent.target.parentElement.children);
                        h.slice(e.selections.swipe_idx_min, e.selections.swipe_idx_max + 1).each(function() {
                            var b = this;
                            if (e.selections.selectionsMode) {
                                if (!a(b).hasClass("S")) {
                                    var c = parseInt(a(b).attr("datavalue")); - 1 === e.selections.values_to_select.indexOf(c) && "undefined" != typeof c && (e.selections.values_to_select.push(c), a(b).removeClass("A X O"), a(b).addClass("S"))
                                }
                            } else if (a(b).hasClass("S")) {
                                var d = parseInt(a(b).attr("datavalue")); - 1 === e.selections.values_to_select.indexOf(d) && "undefined" != typeof d && (e.selections.values_to_select.push(d), a(b).removeClass("S"), a(b).addClass("X"))
                            }
                        })
                    }
                }
            }, e.onSwipeCancel = function() {}, e.onSwipe = function() {
                e.selections.swipe_idx_min = -1, e.selections.swipe_idx_max = -1, e.selections.values_to_select !== [] && (e.selectElemNos(e.selections.field, e.selections.values_to_select, !0), e.selections.values_to_select = []), e.selections.field = ""
            }
        }]
    }
});
