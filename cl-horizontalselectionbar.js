define(["jquery", "underscore", "qlik", "translator", "ng!$q", "ng!$http", "./properties", "./initialproperties", "client.utils/state", "objects.backend-api/field-api", "./lib/js/extensionUtils", "./lib/js/moment", "./lib/js/daterangepicker", "general.models/library/dimension", "text!./lib/css/style.css", "text!./lib/css/daterangepicker.css", "text!./lib/partials/template.html", "./lib/js/clTouch", "./lib/js/onLastRepeatDirective"], function(e, t, a, i, s, n, l, o, r, c, d, u, p, f, m, b, h) {
    "use strict";

    function g(e) {
        var t = 25568,
            a = 86400,
            i = (e - t) * a;
        return i
    }

    function S(e) {
        var t = u().utcOffset();
        return t >= 0 ? e.subtract(t, "m") : e.add(t, "m")
    }

    function y(e, t, a) {
        return a ? u.unix(g(e)).utc().format(t) : S(u.unix(g(e)).utc()).format(t)
    }

    function D(e, a, i) {
        var s;
        return e && (s = t.isNumber(Number(e)) && Number(e) < 1e5 ? y(e, a, i) : i ? u.utc(e, a, !1).format(a) : S(u.utc(e, a, !1)).format(a)), s
    }
    var q = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/sense/app/"));
    return q && "/" !== q.substr(0, 1) && (q = "/" + q), m = m.replace(new RegExp("__VirtualProxyPrefix__", "g"), q), d.addStyleToHeader(m), d.addStyleToHeader(b), {
        definition: l,
        initialProperties: o,
        thinHeader: !0,
        snapshot: {
            canTakeSnapshot: !0
        },
        support: {
            "export": !1,
            exportData: !1
        },
        resize: function(e, t) {
            this.paint(e, t)
        },
        paint: function(t, a) {
            var i = this;
            e(!a.showTitles) ? e(".qv-object-cl-horizontalselectionbar").find("header.thin").addClass("no-title") : e(".qv-object-cl-horizontalselectionbar").find("header.thin").removeClass("no-title"), this.$scope.props = a.props, this.$scope.qId = a.qInfo.qId, i.$scope.setFields(a.kfLists), i.$scope.initSelectionsApplied || i.$scope.setInitSelections();
            var n = s.defer();
            return i.$scope.paintPromise = n, i.$scope.paintPromise.promise
        },
        template: h,
        controller: ["$scope", "$element", function(s, n) {
            s.enigmaModel = s.component.model.hasOwnProperty("enigmaModel") ? s.component.model.enigmaModel : s.component.model, s.options = {};
            var l = a.currApp(),
                o = l.model.layout.qLocaleInfo,
                c = t.clone(o.qCalendarStrings.qDayNames);
            c.unshift(c.pop());
            var d = (o.qFirstWeekDay + 1) % 6;
            s.format = {
                CollationLocale: o.qCollation,
                DateFormat: o.qDateFmt,
                MonthNames: o.qCalendarStrings.qMonthNames,
                FirstWeekDay: d,
                DayNames: c
            }, s.selections = {
                field: "",
                swipe_idx_min: -1,
                swipe_idx_max: -1,
                values_to_select: [],
                selectionMode: ""
            }, s.$on("onRepeatLast", function() {
                e("[id^=daterangepicker-container-" + s.qId + "]").remove(), t.each(s.fields, function(a) {
                    if ("DATERANGE" === a.type) {
                        var n = "daterangepicker-container-" + s.qId + "-" + a.id,
                            l = "daterange-" + s.qId + "-" + a.id;
                        0 === e("#" + n).length && e("body").append('<div id="' + n + '" class="bootstrap-horizontalselectionbar" style="position: absolute"></div>');
                        var o = a.dateToday,
                            r = function(e, t) {
                                s.selectDateFromAndTo(a.field, e.format(s.format.DateFormat), t.format(s.format.DateFormat), !0)
                            },
                            c = {
                                showDropdowns: !0,
                                singleDatePicker: a.singleDatePicker,
                                locale: {
                                    format: s.format.DateFormat,
                                    firstDay: s.format.FirstWeekDay,
                                    monthNames: s.format.MonthNames,
                                    daysOfWeek: s.format.DayNames,
                                    applyLabel: i.get("Common.Apply"),
                                    cancelLabel: i.get("Common.Cancel"),
                                    customRangeLabel: a.customRangeLabel
                                },
                                alwaysShowCalendars: a.alwaysShowCalendars,
                                parentEl: "#" + n
                            };
                        null != a.dateStart && null != a.dateEnd && (c.startDate = a.dateStart, c.endDate = a.dateEnd), null != a.dateMin && null != a.dateMax && (c.minDate = a.dateMin, c.maxDate = a.dateMax), a.dateRanges && (c.ranges = {}, t.each(a.dateRanges, function(e) {
                            var t = u(o).endOf("month").format(s.format.DateFormat) === u(o).format(s.format.DateFormat);
                            switch (e.value) {
                                case "TODAY":
                                    c.ranges[e.label] = [u(o), u(o)];
                                    break;
                                case "YESTERDAY":
                                    c.ranges[e.label] = [u(o).subtract(1, "days"), u(o).subtract(1, "days")];
                                    break;
                                case "LAST07DAYS":
                                    c.ranges[e.label] = [u(o).subtract(6, "days"), u(o)];
                                    break;
                                case "LAST14DAYS":
                                    c.ranges[e.label] = [u(o).subtract(13, "days"), u(o)];
                                    break;
                                case "LAST28DAYS":
                                    c.ranges[e.label] = [u(o).subtract(27, "days"), u(o)];
                                    break;
                                case "LAST30DAYS":
                                    c.ranges[e.label] = [u(o).subtract(29, "days"), u(o)];
                                    break;
                                case "LAST60DAYS":
                                    c.ranges[e.label] = [u(o).subtract(59, "days"), u(o)];
                                    break;
                                case "LAST90DAYS":
                                    c.ranges[e.label] = [u(o).subtract(89, "days"), u(o)];
                                    break;
                                case "THISWEEK":
                                    c.ranges[e.label] = [u(o).startOf("week"), u(o).endOf("week")];
                                    break;
                                case "LASTWEEK":
                                    c.ranges[e.label] = [u(o).subtract(1, "week").startOf("week"), u(o).subtract(1, "week").endOf("week")];
                                    break;
                                case "THISMONTH":
                                    c.ranges[e.label] = [u(o).startOf("month"), u(o).endOf("month")];
                                    break;
                                case "LASTMONTH":
                                    c.ranges[e.label] = [u(o).subtract(1, "month").startOf("month"), u(o).subtract(1, "month").endOf("month")];
                                    break;
                                case "THISQUARTER":
                                    c.ranges[e.label] = [u(o).startOf("quarter"), u(o).endOf("quarter")];
                                    break;
                                case "LASTQUARTER":
                                    c.ranges[e.label] = [u(o).subtract(1, "quarter").startOf("quarter"), u(o).subtract(1, "quarter").endOf("quarter")];
                                    break;
                                case "THISYEAR":
                                    c.ranges[e.label] = [u(o).startOf("year"), u(o).endOf("year")];
                                    break;
                                case "LASTYEAR":
                                    c.ranges[e.label] = [u(o).subtract(1, "year").startOf("year"), u(o).subtract(1, "year").endOf("year")];
                                    break;
                                case "WTD":
                                    c.ranges[e.label] = [u(o).startOf("week"), u(o)];
                                    break;
                                case "MTD":
                                    c.ranges[e.label] = [u(o).startOf("month"), u(o)];
                                    break;
                                case "QTD":
                                    c.ranges[e.label] = [u(o).startOf("quarter"), u(o)];
                                    break;
                                case "YTD":
                                    c.ranges[e.label] = [u(o).startOf("year"), u(o)];
                                    break;
                                case "R11":
                                    c.ranges[e.label] = [u(o).subtract(10, "month"), u(o)];
                                    break;
                                case "R11FM":
                                    c.ranges[e.label] = t ? [u(o).subtract(10, "month").startOf("month"), u(o).endOf("month")] : [u(o).subtract(11, "month").startOf("month"), u(o).subtract(1, "month").endOf("month")];
                                    break;
                                case "R12":
                                    c.ranges[e.label] = [u(o).subtract(11, "month"), u(o)];
                                    break;
                                case "R12FM":
                                    c.ranges[e.label] = t ? [u(o).subtract(11, "month").startOf("month"), u(o).endOf("month")] : [u(o).subtract(12, "month").startOf("month"), u(o).subtract(1, "month").endOf("month")]
                            }
                        })), e("#" + l).daterangepicker(c, r), e("#" + n + " div").first().css("display", "inline-flex")
                    }
                }), s.paintPromise.resolve()
            }), s.resolutionBreakpoint = {
                width: 1024,
                height: 35,
                xsmallheight: 30,
                hideLabelHeight: 30
            }, s.fields = [], s.variables = [], s.willApplyInitSelections = !1, s.initSelectionsApplied = !1, s.sessionStorageId = s.$parent.layout.qExtendsId ? s.$parent.layout.qExtendsId : s.$parent.layout.qInfo.qId, s.getSizeMode = function() {
                var t = "TOP" === s.layout.props.alignLabel && s.showLabels() ? e(n).height() - 10 : e(n).height();
                return e(document).width() <= s.resolutionBreakpoint.width || t <= s.resolutionBreakpoint.height ? t <= s.resolutionBreakpoint.xsmallheight ? "X-SMALL" : "SMALL" : ""
            }, s.showLabels = function() {
                return e(n).height() <= s.resolutionBreakpoint.hideLabelHeight && "TOP" === s.layout.props.alignLabel ? !1 : s.options.showLabels
            }, s.getClass = function() {
                return r.isInAnalysisMode() ? "" : "no-interactions"
            }, s.setFields = function(a) {
                var i = [],
                    n = !1;
                t.each(a, function(a, l) {
                    n = a.showLabels ? !0 : n;
                    var o = a.showLabels ? a.label : "",
                        r = a.qListObject.qDataPages[0] ? a.qListObject.qDataPages[0].qMatrix : [];
                    switch (a.listType) {
                        case "FIELD":
                            i.push({
                                field: a.qListObject.qDimensionInfo.qGroupFieldDefs[0],
                                type: a.listType,
                                id: l,
                                visible: a.listVisible,
                                initSelection: a.initSelection,
                                initSelectionSeparator: a.initSelectionSeparatorComma ? "," : a.initSelectionSeparator,
                                label: o,
                                data: r
                            });
                            break;
                        case "VARIABLE":
                            for (var c = a.variableValues ? e.map(a.variableValues.split(","), e.trim) : [], d = [], p = 0; p < c.length; p++) d.push({
                                value: c[p]
                            });
                            i.push({
                                variable: a.variable,
                                variableValue: a.variableValue,
                                id: l,
                                type: a.listType,
                                visible: a.listVisible,
                                initSelection: a.initSelection,
                                label: o,
                                data: d
                            });
                            break;
                        case "FLAG":
                            var f = [];
                            t.each(r, function(e) {
                                var t = e[0].qText.replace(" ", "-"),
                                    a = e;
                                a.icon = q + "/Extensions/cl-HorizontalSelectionBar/lib/images/flags/" + t + ".png", f.push(a)
                            }), i.push({
                                field: a.qListObject.qDimensionInfo.qGroupFieldDefs[0],
                                type: a.listType,
                                id: l,
                                visible: a.listVisible,
                                initSelection: a.initSelection,
                                initSelectionSeparator: a.initSelectionSeparatorComma ? "," : a.initSelectionSeparator,
                                label: o,
                                data: f
                            });
                            break;
                        case "DATERANGE":
                            var m = "",
                                b = null,
                                h = null,
                                g = s.format.DateFormat,
                                S = "DEFAULT" === a.date.displayFormat ? g : a.date.displayFormat,
                                y = D(a.date.rangeMin, g, !0),
                                v = D(a.date.rangeMax, g, !0),
                                x = D(a.date.initSelectionFrom, g, !0),
                                A = D(a.date.initSelectionTo, g, !0),
                                O = D(a.date.initSelection, g, !0),
                                w = isNaN(Number(a.date.today)) ? D(a.date.today, g, !0) : u(),
                                k = a.date.useDateRanges && !a.date.singleDate ? a.date.dateRanges : null,
                                L = a.date.useDateRanges && !a.date.singleDate ? a.date.alwaysShowCalenders : !0,
                                T = a.date.customRangeLabel,
                                _ = !1,
                                I = a.date.singleDate;
                            a.qListObject.qDimensionInfo.qStateCounts.qSelected > 0 ? (a.qListObject.qDimensionInfo.qStateCounts.qSelected < a.date.max - a.date.min + 1 && (_ = !0), b = a.date.singleDate ? D(a.date.min, g) : D(a.date.min, g), h = a.date.singleDate ? D(a.date.min, g) : D(a.date.max, g), m = a.date.singleDate ? D(a.date.min, S) : D(a.date.min, S) + " - " + D(a.date.max, S)) : m = a.date.defaultText, i.push({
                                field: a.qListObject.qDimensionInfo.qGroupFieldDefs[0],
                                type: a.listType,
                                id: l,
                                visible: a.listVisible,
                                dateFromInitSelection: x,
                                dateToInitSelection: A,
                                dateInitSelection: O,
                                dateFormat: g,
                                displayDateFormat: S,
                                displayText: m,
                                isNotARange: _,
                                dateStart: b,
                                dateEnd: h,
                                dateToday: w,
                                dateMin: y,
                                dateMax: v,
                                label: o,
                                dateRanges: k,
                                alwaysShowCalendars: L,
                                customRangeLabel: T,
                                data: r,
                                singleDatePicker: I
                            });
                            break;
                        default:
                            this.$scope.fields[l] = null
                    }
                }), s.options.showLabels = n, s.fields = i
            }, s.selectValue = function(e, t, a, i) {
                e.ctrlKey ? s.selectFieldValues(t, [s.getValue(a)], !1) : s.selectFieldValues(t, [s.getValue(a)], i)
            }, s.selectElemNo = function(e, t, a, i) {
                e.ctrlKey ? s.selectElemNos(t, [a], !1, !1) : s.selectElemNos(t, [a], i, !1)
            }, s.selectElemNos = function(e, t, a) {
                var i = "/kfLists/" + e + "/qListObjectDef";
                s.enigmaModel.selectListObjectValues(i, t, a, !1)
            }, s.selectDateFromAndTo = function(e, t, a, i) {
                e = "=" === e.substring(0, 1) ? e.substring(1, e.length) : e, l.field(e).selectMatch(">=" + t + "<=" + a, i).then(function() {})
            }, s.selectFieldValues = function(e, a, i) {
                e = "=" === e.substring(0, 1) ? e.substring(1, e.length) : e;
                var s = [];
                t.each(a, function(e) {
                    s.push(JSON.parse(e))
                }), l.field(e).selectValues(s, i)["catch"](function(e) {})
            }, s.setVariable = function(e, t) {
                l.variable.setStringValue(e, t).then(function() {})
            }, s.getValue = function(e) {
                return JSON.stringify(isNaN(e.qNum) ? {
                    qText: e.qText
                } : e.qNum)
            }, s.showField = function(e) {
                return e.visible && !t.isEmpty(e.data)
            }, s.changeAlternativeDimensions = function(e, t, a, i) {
                l.getObject(i).then(function(i) {
                    var s = [{
                        qOp: "replace",
                        qPath: "qHyperCubeDef/qDimensions/0",
                        qValue: JSON.stringify(t)
                    }, {
                        qOp: "replace",
                        qPath: "qHyperCubeDef/qLayoutExclude/qHyperCubeDef/qDimensions/" + a,
                        qValue: JSON.stringify(e)
                    }];
                    i.clearSoftPatches(), i.applyPatches(s, !0)
                })
            }, s.prepareAlternativeDimension = function(e) {
                var i = a.navigation.getCurrentSheetId();
                l.getObject(i.sheetId).then(function(a) {
                    var i = [];
                    t.each(a.layout.cells, function(e) {
                        "linechart" === e.type && i.push(e.name)
                    }), t.each(i, function(a) {
                        l.getObjectProperties(a).then(function(i) {
                            l.getObject(a).then(function(n) {
                                if (n.clearSoftPatches(), i.properties.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions && i.properties.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions.length > 0) {
                                    var l = i.properties.qHyperCubeDef.qDimensions[0];
                                    t.each(i.properties.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions, function(t, i) {
                                        t.qLibraryId ? f.getProperties(t.qLibraryId).then(function(n) {
                                            e === n.properties.qDim.title && s.changeAlternativeDimensions(l, t, i, a)
                                        }) : t.qDef.qFieldLabels[0] === e && s.changeAlternativeDimensions(l, t, i, a)
                                    })
                                }
                            })
                        })
                    })
                })
            }, s.checkInitSelections = function() {
                var e = JSON.parse(sessionStorage.getItem(s.sessionStorageId)),
                    t = e ? e.selectionApplied : !1;
                t && "ON_SHEET" !== s.layout.props.initSelectionMode || (s.willApplyInitSelections = !0)
            }, s.setInitSelections = function() {
                if (s.willApplyInitSelections) {
                    t.each(s.fields, function(e) {
                        if ("VARIABLE" !== e.type && "DATERANGE" !== e.type && "" !== e.initSelection) {
                            var a = ["=", "<", ">"];
                            if (a.indexOf(e.initSelection.substring(0, 1)) > -1) l.field(e.field).clear(), l.field(e.field).selectMatch(e.initSelection);
                            else {
                                var i = [],
                                    n = e.initSelection.split(e.initSelectionSeparator ? e.initSelectionSeparator : ";");
                                t.each(n, function(e) {
                                    i.push(isNaN(e) ? '{"qText": "' + e + '"}' : e)
                                }), s.selectFieldValues(e.field, i, !1)
                            }
                        }
                        "VARIABLE" === e.type && "" !== e.initSelection && s.setVariable(e.variable, e.initSelection), "DATERANGE" === e.type && "" !== e.dateFromInitSelection && "" !== e.dateToInitSelection && !e.singleDatePicker && s.selectDateFromAndTo(e.field, e.dateFromInitSelection, e.dateToInitSelection, !1), "DATERANGE" === e.type && "" !== e.dateInitSelection && e.singleDatePicker && s.selectDateFromAndTo(e.field, e.dateInitSelection, e.dateInitSelection, !1)
                    });
                    var e = {
                        selectionApplied: !0
                    };
                    sessionStorage.setItem(s.sessionStorageId, JSON.stringify(e))
                }
                s.initSelectionsApplied = !0, s.willApplyInitSelections = !1
            }, s.checkInitSelections(), s.onActivate = function() {}, s.onSwipeStart = function(t) {
                var a = e(t.target),
                    i = e(t.target).index(),
                    n = a.attr("field");
                s.selections.swipe_idx_min = i, s.selections.swipe_idx_max = i, s.selections.field = n;
                var l = parseInt(a.attr("datavalue"));
                s.selections.selectionsMode = !a.hasClass("S"), "undefined" != typeof l && (s.selections.selectionsMode ? (s.selections.values_to_select.push(l), a.removeClass("A X O"), a.addClass("S")) : (s.selections.values_to_select.push(l), a.removeClass("S"), a.addClass("X")))
            }, s.onSwipeUpdate = function(t) {
                var a = e(t.originalEvent.target),
                    i = a.attr("field");
                if (i === s.selections.field) {
                    var n = e(t.originalEvent.target).index(),
                        l = s.selections.swipe_idx_min > n || s.selections.swipe_idx_max < n;
                    if (l) {
                        s.selections.swipe_idx_min = s.selections.swipe_idx_min > n ? n : s.selections.swipe_idx_min, s.selections.swipe_idx_max = s.selections.swipe_idx_max < n ? n : s.selections.swipe_idx_max;
                        var o = e(t.originalEvent.target.parentElement.children);
                        o.slice(s.selections.swipe_idx_min, s.selections.swipe_idx_max + 1).each(function() {
                            var t = this;
                            if (s.selections.selectionsMode) {
                                if (!e(t).hasClass("S")) {
                                    var a = parseInt(e(t).attr("datavalue")); - 1 === s.selections.values_to_select.indexOf(a) && "undefined" != typeof a && (s.selections.values_to_select.push(a), e(t).removeClass("A X O"), e(t).addClass("S"))
                                }
                            } else if (e(t).hasClass("S")) {
                                var i = parseInt(e(t).attr("datavalue")); - 1 === s.selections.values_to_select.indexOf(i) && "undefined" != typeof i && (s.selections.values_to_select.push(i), e(t).removeClass("S"), e(t).addClass("X"))
                            }
                        })
                    }
                }
            }, s.onSwipeCancel = function() {}, s.onSwipe = function() {
                s.selections.swipe_idx_min = -1, s.selections.swipe_idx_max = -1, s.selections.values_to_select !== [] && (s.selectElemNos(s.selections.field, s.selections.values_to_select, !0), s.selections.values_to_select = []), s.selections.field = ""
            }
        }]
    }
});
