// node_modules/@syncfusion/ej2-base/src/util.js
var instances = "ej2_instances";
var uid = 0;
var isBlazorPlatform = false;
function disableBlazorMode() {
  isBlazorPlatform = false;
}
function createInstance(classFunction, params) {
  var arrayParam = params;
  arrayParam.unshift(void 0);
  return new (Function.prototype.bind.apply(classFunction, arrayParam))();
}
function setImmediate(handler) {
  var unbind;
  var num = new Uint16Array(5);
  var intCrypto = window.msCrypto || window.crypto;
  intCrypto.getRandomValues(num);
  var secret = "ej2" + combineArray(num);
  var messageHandler = function(event) {
    if (event.source === window && typeof event.data === "string" && event.data.length <= 32 && event.data === secret) {
      handler();
      unbind();
    }
  };
  window.addEventListener("message", messageHandler, false);
  window.postMessage(secret, "*");
  return unbind = function() {
    window.removeEventListener("message", messageHandler);
    handler = messageHandler = secret = void 0;
  };
}
function getValue(nameSpace, obj) {
  var value = obj;
  var splits = nameSpace.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  for (var i = 0; i < splits.length && !isUndefined(value); i++) {
    value = value[splits[parseInt(i.toString(), 10)]];
  }
  return value;
}
function setValue(nameSpace, value, obj) {
  var keys2 = nameSpace.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  var start = obj || {};
  var fromObj = start;
  var i;
  var length = keys2.length;
  var key;
  for (i = 0; i < length; i++) {
    key = keys2[parseInt(i.toString(), 10)];
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }
    if (i + 1 === length) {
      fromObj["" + key] = value === void 0 ? {} : value;
    } else if (isNullOrUndefined(fromObj["" + key])) {
      fromObj["" + key] = {};
    }
    fromObj = fromObj["" + key];
  }
  return start;
}
function deleteObject(obj, key) {
  delete obj["" + key];
}
var containerObject = typeof window !== "undefined" ? window : {};
function isObject(obj) {
  var objCon = {};
  return !isNullOrUndefined(obj) && obj.constructor === objCon.constructor;
}
function getEnumValue(enumObject, enumValue) {
  return enumObject["" + enumValue];
}
function merge(source, destination) {
  if (!isNullOrUndefined(destination)) {
    var temrObj = source;
    var tempProp = destination;
    var keys2 = Object.keys(destination);
    var deepmerge = "deepMerge";
    for (var _i = 0, keys_1 = keys2; _i < keys_1.length; _i++) {
      var key = keys_1[_i];
      if (!isNullOrUndefined(temrObj["" + deepmerge]) && temrObj["" + deepmerge].indexOf(key) !== -1 && (isObject(tempProp["" + key]) || Array.isArray(tempProp["" + key]))) {
        extend(temrObj["" + key], temrObj["" + key], tempProp["" + key], true);
      } else {
        temrObj["" + key] = tempProp["" + key];
      }
    }
  }
}
function extend(copied, first, second, deep) {
  var result = copied && typeof copied === "object" ? copied : {};
  var length = arguments.length;
  var args = [copied, first, second, deep];
  if (deep) {
    length = length - 1;
  }
  var _loop_1 = function(i2) {
    if (!args[parseInt(i2.toString(), 10)]) {
      return "continue";
    }
    var obj1 = args[parseInt(i2.toString(), 10)];
    Object.keys(obj1).forEach(function(key) {
      var src = result["" + key];
      var copy = obj1["" + key];
      var clone;
      var isArrayChanged = Array.isArray(copy) && Array.isArray(src) && copy.length !== src.length;
      var blazorEventExtend = isBlazor() ? !(src instanceof Event) && !isArrayChanged : true;
      if (deep && blazorEventExtend && (isObject(copy) || Array.isArray(copy))) {
        if (isObject(copy)) {
          clone = src ? src : {};
          if (Array.isArray(clone) && Object.prototype.hasOwnProperty.call(clone, "isComplexArray")) {
            extend(clone, {}, copy, deep);
          } else {
            result["" + key] = extend(clone, {}, copy, deep);
          }
        } else {
          clone = isBlazor() ? src && Object.keys(copy).length : src ? src : [];
          result["" + key] = extend([], clone, copy, clone && clone.length || copy && copy.length);
        }
      } else {
        result["" + key] = copy;
      }
    });
  };
  for (var i = 1; i < length; i++) {
    _loop_1(i);
  }
  return result;
}
function isNullOrUndefined(value) {
  return value === void 0 || value === null;
}
function isUndefined(value) {
  return "undefined" === typeof value;
}
function getUniqueID(definedName) {
  return definedName + "_" + uid++;
}
function debounce(eventFunction, delay) {
  var out;
  return function() {
    var _this = this;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var later = function() {
      out = null;
      return eventFunction.apply(_this, args);
    };
    clearTimeout(out);
    out = setTimeout(later, delay);
  };
}
function queryParams(data) {
  var array = [];
  var keys2 = Object.keys(data);
  for (var _i = 0, keys_2 = keys2; _i < keys_2.length; _i++) {
    var key = keys_2[_i];
    array.push(encodeURIComponent(key) + "=" + encodeURIComponent("" + data["" + key]));
  }
  return array.join("&");
}
function isObjectArray(value) {
  var parser = Object.prototype.toString;
  if (parser.call(value) === "[object Array]") {
    if (parser.call(value[0]) === "[object Object]") {
      return true;
    }
  }
  return false;
}
function compareElementParent(child, parent) {
  var node = child;
  if (node === parent) {
    return true;
  } else if (node === document || !node) {
    return false;
  } else {
    return compareElementParent(node.parentNode, parent);
  }
}
function throwError(message) {
  try {
    throw new Error(message);
  } catch (e) {
    throw new Error(e.message + "\n" + e.stack);
  }
}
function print(element, printWindow) {
  var div = document.createElement("div");
  var links = [].slice.call(document.getElementsByTagName("head")[0].querySelectorAll("base, link, style"));
  var blinks = [].slice.call(document.getElementsByTagName("body")[0].querySelectorAll("link, style"));
  if (blinks.length) {
    for (var l = 0, len = blinks.length; l < len; l++) {
      links.push(blinks[parseInt(l.toString(), 10)]);
    }
  }
  var reference = "";
  if (isNullOrUndefined(printWindow)) {
    printWindow = window.open("", "print", "height=452,width=1024,tabbar=no");
  }
  div.appendChild(element.cloneNode(true));
  for (var i = 0, len = links.length; i < len; i++) {
    reference += links[parseInt(i.toString(), 10)].outerHTML;
  }
  printWindow.document.write("<!DOCTYPE html> <html><head>" + reference + "</head><body>" + div.innerHTML + "<script> (function() { window.ready = true; })(); <\/script></body></html>");
  printWindow.document.close();
  printWindow.focus();
  var interval = setInterval(function() {
    if (printWindow.ready) {
      printWindow.print();
      printWindow.close();
      clearInterval(interval);
    }
  }, 500);
  return printWindow;
}
function formatUnit(value) {
  var result = value + "";
  if (result.match(/auto|cm|mm|in|px|pt|pc|%|em|ex|ch|rem|vw|vh|vmin|vmax/)) {
    return result;
  }
  return result + "px";
}
function enableBlazorMode() {
  isBlazorPlatform = true;
}
function isBlazor() {
  return isBlazorPlatform;
}
function getElement(element) {
  var xPath = "xPath";
  if (!(element instanceof Node) && isBlazor() && !isNullOrUndefined(element["" + xPath])) {
    return document.evaluate(element["" + xPath], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  return element;
}
function getInstance(element, component) {
  var elem = typeof element === "string" ? document.querySelector(element) : element;
  if (elem["" + instances]) {
    for (var _i = 0, _a = elem["" + instances]; _i < _a.length; _i++) {
      var inst = _a[_i];
      if (inst instanceof component) {
        return inst;
      }
    }
  }
  return null;
}
function addInstance(element, instance) {
  var elem = typeof element === "string" ? document.querySelector(element) : element;
  if (elem["" + instances]) {
    elem["" + instances].push(instance);
  } else {
    elem["" + instances] = [instance];
  }
}
function uniqueID() {
  if (typeof window === "undefined") {
    return;
  }
  var num = new Uint16Array(5);
  var intCrypto = window.msCrypto || window.crypto;
  return intCrypto.getRandomValues(num);
}
function combineArray(num) {
  var ret = "";
  for (var i = 0; i < 5; i++) {
    ret += (i ? "," : "") + num[parseInt(i.toString(), 10)];
  }
  return ret;
}

// node_modules/@syncfusion/ej2-base/src/intl/parser-base.js
var defaultNumberingSystem = {
  "latn": {
    "_digits": "0123456789",
    "_type": "numeric"
  }
};
var defaultNumberSymbols = {
  "decimal": ".",
  "group": ",",
  "percentSign": "%",
  "plusSign": "+",
  "minusSign": "-",
  "infinity": "∞",
  "nan": "NaN",
  "exponential": "E"
};
var latnNumberSystem = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var ParserBase = (
  /** @class */
  function() {
    function ParserBase2() {
    }
    ParserBase2.getMainObject = function(obj, cName) {
      var value = isBlazor() ? cName : "main." + cName;
      return getValue(value, obj);
    };
    ParserBase2.getNumberingSystem = function(obj) {
      return getValue("supplemental.numberingSystems", obj) || this.numberingSystems;
    };
    ParserBase2.reverseObject = function(prop, keys2) {
      var propKeys = keys2 || Object.keys(prop);
      var res = {};
      for (var _i = 0, propKeys_1 = propKeys; _i < propKeys_1.length; _i++) {
        var key = propKeys_1[_i];
        if (!Object.prototype.hasOwnProperty.call(res, prop["" + key])) {
          res[prop["" + key]] = key;
        }
      }
      return res;
    };
    ParserBase2.getSymbolRegex = function(props) {
      var regexStr = props.map(function(str) {
        return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
      }).join("|");
      var regExp3 = RegExp;
      return new regExp3(regexStr, "g");
    };
    ParserBase2.getSymbolMatch = function(prop) {
      var matchKeys = Object.keys(defaultNumberSymbols);
      var ret = {};
      for (var _i = 0, matchKeys_1 = matchKeys; _i < matchKeys_1.length; _i++) {
        var key = matchKeys_1[_i];
        ret[prop["" + key]] = defaultNumberSymbols["" + key];
      }
      return ret;
    };
    ParserBase2.constructRegex = function(val) {
      var len = val.length;
      var ret = "";
      for (var i = 0; i < len; i++) {
        if (i !== len - 1) {
          ret += val[parseInt(i.toString(), 10)] + "|";
        } else {
          ret += val[parseInt(i.toString(), 10)];
        }
      }
      return ret;
    };
    ParserBase2.convertValueParts = function(value, regex, obj) {
      return value.replace(regex, function(str) {
        return obj["" + str];
      });
    };
    ParserBase2.getDefaultNumberingSystem = function(obj) {
      var ret = {};
      ret.obj = getValue("numbers", obj);
      ret.nSystem = getValue("defaultNumberingSystem", ret.obj);
      return ret;
    };
    ParserBase2.getCurrentNumericOptions = function(curObj, numberSystem, needSymbols, blazorMode) {
      var ret = {};
      var cur = this.getDefaultNumberingSystem(curObj);
      if (!isUndefined(cur.nSystem) || blazorMode) {
        var digits = blazorMode ? getValue("obj.mapperDigits", cur) : getValue(cur.nSystem + "._digits", numberSystem);
        if (!isUndefined(digits)) {
          ret.numericPair = this.reverseObject(digits, latnNumberSystem);
          var regExp3 = RegExp;
          ret.numberParseRegex = new regExp3(this.constructRegex(digits), "g");
          ret.numericRegex = "[" + digits[0] + "-" + digits[9] + "]";
          if (needSymbols) {
            ret.numericRegex = digits[0] + "-" + digits[9];
            ret.symbolNumberSystem = getValue(blazorMode ? "numberSymbols" : "symbols-numberSystem-" + cur.nSystem, cur.obj);
            ret.symbolMatch = this.getSymbolMatch(ret.symbolNumberSystem);
            ret.numberSystem = cur.nSystem;
          }
        }
      }
      return ret;
    };
    ParserBase2.getNumberMapper = function(curObj, numberSystem, isNumber) {
      var ret = {
        mapper: {}
      };
      var cur = this.getDefaultNumberingSystem(curObj);
      if (!isUndefined(cur.nSystem)) {
        ret.numberSystem = cur.nSystem;
        ret.numberSymbols = getValue("symbols-numberSystem-" + cur.nSystem, cur.obj);
        ret.timeSeparator = getValue("timeSeparator", ret.numberSymbols);
        var digits = getValue(cur.nSystem + "._digits", numberSystem);
        if (!isUndefined(digits)) {
          for (var _i = 0, latnNumberSystem_1 = latnNumberSystem; _i < latnNumberSystem_1.length; _i++) {
            var i = latnNumberSystem_1[_i];
            ret.mapper[parseInt(i.toString(), 10)] = digits[parseInt(i.toString(), 10)];
          }
        }
      }
      return ret;
    };
    ParserBase2.nPair = "numericPair";
    ParserBase2.nRegex = "numericRegex";
    ParserBase2.numberingSystems = defaultNumberingSystem;
    return ParserBase2;
  }()
);
var blazorCurrencyData = {
  "DJF": "Fdj",
  "ERN": "Nfk",
  "ETB": "Br",
  "NAD": "$",
  "ZAR": "R",
  "XAF": "FCFA",
  "GHS": "GH₵",
  "XDR": "XDR",
  "AED": "د.إ.",
  "BHD": "د.ب.",
  "DZD": "د.ج.",
  "EGP": "ج.م.",
  "ILS": "₪",
  "IQD": "د.ع.",
  "JOD": "د.ا.",
  "KMF": "CF",
  "KWD": "د.ك.",
  "LBP": "ل.ل.",
  "LYD": "د.ل.",
  "MAD": "د.م.",
  "MRU": "أ.م.",
  "OMR": "ر.ع.",
  "QAR": "ر.ق.",
  "SAR": "ر.س.",
  "SDG": "ج.س.",
  "SOS": "S",
  "SSP": "£",
  "SYP": "ل.س.",
  "TND": "د.ت.",
  "YER": "ر.ي.",
  "CLP": "$",
  "INR": "₹",
  "TZS": "TSh",
  "EUR": "€",
  "AZN": "₼",
  "RUB": "₽",
  "BYN": "Br",
  "ZMW": "K",
  "BGN": "лв.",
  "NGN": "₦",
  "XOF": "CFA",
  "BDT": "৳",
  "CNY": "¥",
  "BAM": "КМ",
  "UGX": "USh",
  "USD": "$",
  "CZK": "Kč",
  "GBP": "£",
  "DKK": "kr.",
  "KES": "Ksh",
  "CHF": "CHF",
  "MVR": "ރ.",
  "BTN": "Nu.",
  "XCD": "EC$",
  "AUD": "$",
  "BBD": "$",
  "BIF": "FBu",
  "BMD": "$",
  "BSD": "$",
  "BWP": "P",
  "BZD": "$",
  "CAD": "$",
  "NZD": "$",
  "FJD": "$",
  "FKP": "£",
  "GIP": "£",
  "GMD": "D",
  "GYD": "$",
  "HKD": "$",
  "IDR": "Rp",
  "JMD": "$",
  "KYD": "$",
  "LRD": "$",
  "MGA": "Ar",
  "MOP": "MOP$",
  "MUR": "Rs",
  "MWK": "MK",
  "MYR": "RM",
  "PGK": "K",
  "PHP": "₱",
  "PKR": "Rs",
  "RWF": "RF",
  "SBD": "$",
  "SCR": "SR",
  "SEK": "kr",
  "SGD": "$",
  "SHP": "£",
  "SLL": "Le",
  "ANG": "NAf.",
  "SZL": "E",
  "TOP": "T$",
  "TTD": "$",
  "VUV": "VT",
  "WST": "WS$",
  "ARS": "$",
  "BOB": "Bs",
  "BRL": "R$",
  "COP": "$",
  "CRC": "₡",
  "CUP": "$",
  "DOP": "$",
  "GTQ": "Q",
  "HNL": "L",
  "MXN": "$",
  "NIO": "C$",
  "PAB": "B/.",
  "PEN": "S/",
  "PYG": "₲",
  "UYU": "$",
  "VES": "Bs.S",
  "IRR": "ريال",
  "GNF": "FG",
  "CDF": "FC",
  "HTG": "G",
  "XPF": "FCFP",
  "HRK": "kn",
  "HUF": "Ft",
  "AMD": "֏",
  "ISK": "kr",
  "JPY": "¥",
  "GEL": "₾",
  "CVE": "​",
  "KZT": "₸",
  "KHR": "៛",
  "KPW": "₩",
  "KRW": "₩",
  "KGS": "сом",
  "AOA": "Kz",
  "LAK": "₭",
  "MZN": "MTn",
  "MKD": "ден",
  "MNT": "₮",
  "BND": "$",
  "MMK": "K",
  "NOK": "kr",
  "NPR": "रु",
  "AWG": "Afl.",
  "SRD": "$",
  "PLN": "zł",
  "AFN": "؋",
  "STN": "Db",
  "MDL": "L",
  "RON": "lei",
  "UAH": "₴",
  "LKR": "රු.",
  "ALL": "Lekë",
  "RSD": "дин.",
  "TJS": "смн",
  "THB": "฿",
  "TMT": "m.",
  "TRY": "₺",
  "UZS": "сўм",
  "VND": "₫",
  "TWD": "NT$"
};
function getBlazorCurrencySymbol(currencyCode) {
  return getValue(currencyCode || "", blazorCurrencyData);
}

// node_modules/@syncfusion/ej2-base/src/intl/intl-base.js
var defaultCurrencyCode = "USD";
var NumberFormat = null;
var DateFormat = null;
function setDefaultCurrencyCode(value) {
  defaultCurrencyCode = value;
}
function setNumberFormat(value) {
  NumberFormat = value;
}
function setDateFormat(value) {
  DateFormat = value;
}
var regExp = RegExp;
var blazorCultureFormats = {
  "en-US": {
    "d": "M/d/y",
    "D": "EEEE, MMMM d, y",
    "f": "EEEE, MMMM d, y h:mm a",
    "F": "EEEE, MMMM d, y h:mm:s a",
    "g": "M/d/y h:mm a",
    "G": "M/d/yyyy h:mm:ss tt",
    "m": "MMMM d",
    "M": "MMMM d",
    "r": "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
    "R": "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
    "s": "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
    "t": "h:mm tt",
    "T": "h:m:s tt",
    "u": "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
    "U": "dddd, MMMM d, yyyy h:mm:ss tt",
    "y": "MMMM yyyy",
    "Y": "MMMM yyyy"
  }
};
var IntlBase;
(function(IntlBase2) {
  IntlBase2.negativeDataRegex = /^(('[^']+'|''|[^*#@0,.E])*)(\*.)?((([#,]*[0,]*0+)(\.0*[0-9]*#*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
  IntlBase2.customRegex = /^(('[^']+'|''|[^*#@0,.])*)(\*.)?((([0#,]*[0,]*[0#]*[0# ]*)(\.[0#]*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
  IntlBase2.latnParseRegex = /0|1|2|3|4|5|6|7|8|9/g;
  var fractionRegex = /[0-9]/g;
  IntlBase2.defaultCurrency = "$";
  var mapper3 = ["infinity", "nan", "group", "decimal"];
  var patternRegex = /G|M|L|H|c|'| a|yy|y|EEEE|E/g;
  var patternMatch = {
    "G": "",
    "M": "m",
    "L": "m",
    "H": "h",
    "c": "d",
    "'": '"',
    " a": " AM/PM",
    "yy": "yy",
    "y": "yyyy",
    "EEEE": "dddd",
    "E": "ddd"
  };
  IntlBase2.dateConverterMapper = /dddd|ddd/ig;
  var defaultFirstDay = "sun";
  IntlBase2.islamicRegex = /^islamic/;
  var firstDayMapper = {
    "sun": 0,
    "mon": 1,
    "tue": 2,
    "wed": 3,
    "thu": 4,
    "fri": 5,
    "sat": 6
  };
  IntlBase2.formatRegex = new regExp("(^[ncpae]{1})([0-1]?[0-9]|20)?$", "i");
  IntlBase2.currencyFormatRegex = new regExp("(^[ca]{1})([0-1]?[0-9]|20)?$", "i");
  IntlBase2.curWithoutNumberRegex = /(c|a)$/ig;
  var typeMapper = {
    "$": "isCurrency",
    "%": "isPercent",
    "-": "isNegative",
    0: "nlead",
    1: "nend"
  };
  IntlBase2.dateParseRegex = /([a-z])\1*|'([^']|'')+'|''|./gi;
  IntlBase2.basicPatterns = ["short", "medium", "long", "full"];
  IntlBase2.defaultObject = {
    "dates": {
      "calendars": {
        "gregorian": {
          "months": {
            "stand-alone": {
              "abbreviated": {
                "1": "Jan",
                "2": "Feb",
                "3": "Mar",
                "4": "Apr",
                "5": "May",
                "6": "Jun",
                "7": "Jul",
                "8": "Aug",
                "9": "Sep",
                "10": "Oct",
                "11": "Nov",
                "12": "Dec"
              },
              "narrow": {
                "1": "J",
                "2": "F",
                "3": "M",
                "4": "A",
                "5": "M",
                "6": "J",
                "7": "J",
                "8": "A",
                "9": "S",
                "10": "O",
                "11": "N",
                "12": "D"
              },
              "wide": {
                "1": "January",
                "2": "February",
                "3": "March",
                "4": "April",
                "5": "May",
                "6": "June",
                "7": "July",
                "8": "August",
                "9": "September",
                "10": "October",
                "11": "November",
                "12": "December"
              }
            }
          },
          "days": {
            "stand-alone": {
              "abbreviated": {
                "sun": "Sun",
                "mon": "Mon",
                "tue": "Tue",
                "wed": "Wed",
                "thu": "Thu",
                "fri": "Fri",
                "sat": "Sat"
              },
              "narrow": {
                "sun": "S",
                "mon": "M",
                "tue": "T",
                "wed": "W",
                "thu": "T",
                "fri": "F",
                "sat": "S"
              },
              "short": {
                "sun": "Su",
                "mon": "Mo",
                "tue": "Tu",
                "wed": "We",
                "thu": "Th",
                "fri": "Fr",
                "sat": "Sa"
              },
              "wide": {
                "sun": "Sunday",
                "mon": "Monday",
                "tue": "Tuesday",
                "wed": "Wednesday",
                "thu": "Thursday",
                "fri": "Friday",
                "sat": "Saturday"
              }
            }
          },
          "dayPeriods": {
            "format": {
              "wide": {
                "am": "AM",
                "pm": "PM"
              }
            }
          },
          "eras": {
            "eraNames": {
              "0": "Before Christ",
              "0-alt-variant": "Before Common Era",
              "1": "Anno Domini",
              "1-alt-variant": "Common Era"
            },
            "eraAbbr": {
              "0": "BC",
              "0-alt-variant": "BCE",
              "1": "AD",
              "1-alt-variant": "CE"
            },
            "eraNarrow": {
              "0": "B",
              "0-alt-variant": "BCE",
              "1": "A",
              "1-alt-variant": "CE"
            }
          },
          "dateFormats": {
            "full": "EEEE, MMMM d, y",
            "long": "MMMM d, y",
            "medium": "MMM d, y",
            "short": "M/d/yy"
          },
          "timeFormats": {
            "full": "h:mm:ss a zzzz",
            "long": "h:mm:ss a z",
            "medium": "h:mm:ss a",
            "short": "h:mm a"
          },
          "dateTimeFormats": {
            "full": "{1} 'at' {0}",
            "long": "{1} 'at' {0}",
            "medium": "{1}, {0}",
            "short": "{1}, {0}",
            "availableFormats": {
              "d": "d",
              "E": "ccc",
              "Ed": "d E",
              "Ehm": "E h:mm a",
              "EHm": "E HH:mm",
              "Ehms": "E h:mm:ss a",
              "EHms": "E HH:mm:ss",
              "Gy": "y G",
              "GyMMM": "MMM y G",
              "GyMMMd": "MMM d, y G",
              "GyMMMEd": "E, MMM d, y G",
              "h": "h a",
              "H": "HH",
              "hm": "h:mm a",
              "Hm": "HH:mm",
              "hms": "h:mm:ss a",
              "Hms": "HH:mm:ss",
              "hmsv": "h:mm:ss a v",
              "Hmsv": "HH:mm:ss v",
              "hmv": "h:mm a v",
              "Hmv": "HH:mm v",
              "M": "L",
              "Md": "M/d",
              "MEd": "E, M/d",
              "MMM": "LLL",
              "MMMd": "MMM d",
              "MMMEd": "E, MMM d",
              "MMMMd": "MMMM d",
              "ms": "mm:ss",
              "y": "y",
              "yM": "M/y",
              "yMd": "M/d/y",
              "yMEd": "E, M/d/y",
              "yMMM": "MMM y",
              "yMMMd": "MMM d, y",
              "yMMMEd": "E, MMM d, y",
              "yMMMM": "MMMM y"
            }
          }
        },
        "islamic": {
          "months": {
            "stand-alone": {
              "abbreviated": {
                "1": "Muh.",
                "2": "Saf.",
                "3": "Rab. I",
                "4": "Rab. II",
                "5": "Jum. I",
                "6": "Jum. II",
                "7": "Raj.",
                "8": "Sha.",
                "9": "Ram.",
                "10": "Shaw.",
                "11": "Dhuʻl-Q.",
                "12": "Dhuʻl-H."
              },
              "narrow": {
                "1": "1",
                "2": "2",
                "3": "3",
                "4": "4",
                "5": "5",
                "6": "6",
                "7": "7",
                "8": "8",
                "9": "9",
                "10": "10",
                "11": "11",
                "12": "12"
              },
              "wide": {
                "1": "Muharram",
                "2": "Safar",
                "3": "Rabiʻ I",
                "4": "Rabiʻ II",
                "5": "Jumada I",
                "6": "Jumada II",
                "7": "Rajab",
                "8": "Shaʻban",
                "9": "Ramadan",
                "10": "Shawwal",
                "11": "Dhuʻl-Qiʻdah",
                "12": "Dhuʻl-Hijjah"
              }
            }
          },
          "days": {
            "stand-alone": {
              "abbreviated": {
                "sun": "Sun",
                "mon": "Mon",
                "tue": "Tue",
                "wed": "Wed",
                "thu": "Thu",
                "fri": "Fri",
                "sat": "Sat"
              },
              "narrow": {
                "sun": "S",
                "mon": "M",
                "tue": "T",
                "wed": "W",
                "thu": "T",
                "fri": "F",
                "sat": "S"
              },
              "short": {
                "sun": "Su",
                "mon": "Mo",
                "tue": "Tu",
                "wed": "We",
                "thu": "Th",
                "fri": "Fr",
                "sat": "Sa"
              },
              "wide": {
                "sun": "Sunday",
                "mon": "Monday",
                "tue": "Tuesday",
                "wed": "Wednesday",
                "thu": "Thursday",
                "fri": "Friday",
                "sat": "Saturday"
              }
            }
          },
          "dayPeriods": {
            "format": {
              "wide": {
                "am": "AM",
                "pm": "PM"
              }
            }
          },
          "eras": {
            "eraNames": {
              "0": "AH"
            },
            "eraAbbr": {
              "0": "AH"
            },
            "eraNarrow": {
              "0": "AH"
            }
          },
          "dateFormats": {
            "full": "EEEE, MMMM d, y G",
            "long": "MMMM d, y G",
            "medium": "MMM d, y G",
            "short": "M/d/y GGGGG"
          },
          "timeFormats": {
            "full": "h:mm:ss a zzzz",
            "long": "h:mm:ss a z",
            "medium": "h:mm:ss a",
            "short": "h:mm a"
          },
          "dateTimeFormats": {
            "full": "{1} 'at' {0}",
            "long": "{1} 'at' {0}",
            "medium": "{1}, {0}",
            "short": "{1}, {0}",
            "availableFormats": {
              "d": "d",
              "E": "ccc",
              "Ed": "d E",
              "Ehm": "E h:mm a",
              "EHm": "E HH:mm",
              "Ehms": "E h:mm:ss a",
              "EHms": "E HH:mm:ss",
              "Gy": "y G",
              "GyMMM": "MMM y G",
              "GyMMMd": "MMM d, y G",
              "GyMMMEd": "E, MMM d, y G",
              "h": "h a",
              "H": "HH",
              "hm": "h:mm a",
              "Hm": "HH:mm",
              "hms": "h:mm:ss a",
              "Hms": "HH:mm:ss",
              "M": "L",
              "Md": "M/d",
              "MEd": "E, M/d",
              "MMM": "LLL",
              "MMMd": "MMM d",
              "MMMEd": "E, MMM d",
              "MMMMd": "MMMM d",
              "ms": "mm:ss",
              "y": "y G",
              "yyyy": "y G",
              "yyyyM": "M/y GGGGG",
              "yyyyMd": "M/d/y GGGGG",
              "yyyyMEd": "E, M/d/y GGGGG",
              "yyyyMMM": "MMM y G",
              "yyyyMMMd": "MMM d, y G",
              "yyyyMMMEd": "E, MMM d, y G",
              "yyyyMMMM": "MMMM y G",
              "yyyyQQQ": "QQQ y G",
              "yyyyQQQQ": "QQQQ y G"
            }
          }
        }
      },
      "timeZoneNames": {
        "hourFormat": "+HH:mm;-HH:mm",
        "gmtFormat": "GMT{0}",
        "gmtZeroFormat": "GMT"
      }
    },
    "numbers": {
      "currencies": {
        "USD": {
          "displayName": "US Dollar",
          "symbol": "$",
          "symbol-alt-narrow": "$"
        },
        "EUR": {
          "displayName": "Euro",
          "symbol": "€",
          "symbol-alt-narrow": "€"
        },
        "GBP": {
          "displayName": "British Pound",
          "symbol-alt-narrow": "£"
        }
      },
      "defaultNumberingSystem": "latn",
      "minimumGroupingDigits": "1",
      "symbols-numberSystem-latn": {
        "decimal": ".",
        "group": ",",
        "list": ";",
        "percentSign": "%",
        "plusSign": "+",
        "minusSign": "-",
        "exponential": "E",
        "superscriptingExponent": "×",
        "perMille": "‰",
        "infinity": "∞",
        "nan": "NaN",
        "timeSeparator": ":"
      },
      "decimalFormats-numberSystem-latn": {
        "standard": "#,##0.###"
      },
      "percentFormats-numberSystem-latn": {
        "standard": "#,##0%"
      },
      "currencyFormats-numberSystem-latn": {
        "standard": "¤#,##0.00",
        "accounting": "¤#,##0.00;(¤#,##0.00)"
      },
      "scientificFormats-numberSystem-latn": {
        "standard": "#E0"
      }
    }
  };
  IntlBase2.blazorDefaultObject = {
    "numbers": {
      "mapper": {
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9"
      },
      "mapperDigits": "0123456789",
      "numberSymbols": {
        "decimal": ".",
        "group": ",",
        "plusSign": "+",
        "minusSign": "-",
        "percentSign": "%",
        "nan": "NaN",
        "timeSeparator": ":",
        "infinity": "∞"
      },
      "timeSeparator": ":",
      "currencySymbol": "$",
      "currencypData": {
        "nlead": "$",
        "nend": "",
        "groupSeparator": ",",
        "groupData": {
          "primary": 3
        },
        "maximumFraction": 2,
        "minimumFraction": 2
      },
      "percentpData": {
        "nlead": "",
        "nend": "%",
        "groupSeparator": ",",
        "groupData": {
          "primary": 3
        },
        "maximumFraction": 2,
        "minimumFraction": 2
      },
      "percentnData": {
        "nlead": "-",
        "nend": "%",
        "groupSeparator": ",",
        "groupData": {
          "primary": 3
        },
        "maximumFraction": 2,
        "minimumFraction": 2
      },
      "currencynData": {
        "nlead": "($",
        "nend": ")",
        "groupSeparator": ",",
        "groupData": {
          "primary": 3
        },
        "maximumFraction": 2,
        "minimumFraction": 2
      },
      "decimalnData": {
        "nlead": "-",
        "nend": "",
        "groupData": {
          "primary": 3
        },
        "maximumFraction": 2,
        "minimumFraction": 2
      },
      "decimalpData": {
        "nlead": "",
        "nend": "",
        "groupData": {
          "primary": 3
        },
        "maximumFraction": 2,
        "minimumFraction": 2
      }
    },
    "dates": {
      "dayPeriods": {
        "am": "AM",
        "pm": "PM"
      },
      "dateSeperator": "/",
      "days": {
        "abbreviated": {
          "sun": "Sun",
          "mon": "Mon",
          "tue": "Tue",
          "wed": "Wed",
          "thu": "Thu",
          "fri": "Fri",
          "sat": "Sat"
        },
        "short": {
          "sun": "Su",
          "mon": "Mo",
          "tue": "Tu",
          "wed": "We",
          "thu": "Th",
          "fri": "Fr",
          "sat": "Sa"
        },
        "wide": {
          "sun": "Sunday",
          "mon": "Monday",
          "tue": "Tuesday",
          "wed": "Wednesday",
          "thu": "Thursday",
          "fri": "Friday",
          "sat": "Saturday"
        }
      },
      "months": {
        "abbreviated": {
          "1": "Jan",
          "2": "Feb",
          "3": "Mar",
          "4": "Apr",
          "5": "May",
          "6": "Jun",
          "7": "Jul",
          "8": "Aug",
          "9": "Sep",
          "10": "Oct",
          "11": "Nov",
          "12": "Dec"
        },
        "wide": {
          "1": "January",
          "2": "February",
          "3": "March",
          "4": "April",
          "5": "May",
          "6": "June",
          "7": "July",
          "8": "August",
          "9": "September",
          "10": "October",
          "11": "November",
          "12": "December"
        }
      },
      "eras": {
        "1": "AD"
      }
    }
  };
  IntlBase2.monthIndex = {
    3: "abbreviated",
    4: "wide",
    5: "narrow",
    1: "abbreviated"
  };
  IntlBase2.month = "months";
  IntlBase2.days = "days";
  IntlBase2.patternMatcher = {
    C: "currency",
    P: "percent",
    N: "decimal",
    A: "currency",
    E: "scientific"
  };
  function getResultantPattern(skeleton, dateObject, type, isIslamic, blazorCulture) {
    var resPattern;
    var iType = type || "date";
    if (blazorCulture) {
      resPattern = compareBlazorDateFormats({
        skeleton
      }, blazorCulture).format || compareBlazorDateFormats({
        skeleton: "d"
      }, "en-US").format;
    } else {
      if (IntlBase2.basicPatterns.indexOf(skeleton) !== -1) {
        resPattern = getValue(iType + "Formats." + skeleton, dateObject);
        if (iType === "dateTime") {
          var dPattern = getValue("dateFormats." + skeleton, dateObject);
          var tPattern = getValue("timeFormats." + skeleton, dateObject);
          resPattern = resPattern.replace("{1}", dPattern).replace("{0}", tPattern);
        }
      } else {
        resPattern = getValue("dateTimeFormats.availableFormats." + skeleton, dateObject);
      }
      if (isUndefined(resPattern) && skeleton === "yMd") {
        resPattern = "M/d/y";
      }
    }
    return resPattern;
  }
  IntlBase2.getResultantPattern = getResultantPattern;
  function getDependables(cldr, culture, mode, isNumber) {
    var ret = {};
    var calendartype = mode || "gregorian";
    ret.parserObject = ParserBase.getMainObject(cldr, culture) || (isBlazor() ? IntlBase2.blazorDefaultObject : IntlBase2.defaultObject);
    if (isNumber) {
      ret.numericObject = getValue("numbers", ret.parserObject);
    } else {
      var dateString = isBlazor() ? "dates" : "dates.calendars." + calendartype;
      ret.dateObject = getValue(dateString, ret.parserObject);
    }
    return ret;
  }
  IntlBase2.getDependables = getDependables;
  function getSymbolPattern(type, numSystem, obj, isAccount) {
    return getValue(type + "Formats-numberSystem-" + numSystem + (isAccount ? ".accounting" : ".standard"), obj) || (isAccount ? getValue(type + "Formats-numberSystem-" + numSystem + ".standard", obj) : "");
  }
  IntlBase2.getSymbolPattern = getSymbolPattern;
  function ConvertDateToWeekFormat(format) {
    var convertMapper = format.match(IntlBase2.dateConverterMapper);
    if (convertMapper && isBlazor()) {
      var tempString = convertMapper[0].length === 3 ? "EEE" : "EEEE";
      return format.replace(IntlBase2.dateConverterMapper, tempString);
    }
    return format;
  }
  IntlBase2.ConvertDateToWeekFormat = ConvertDateToWeekFormat;
  function compareBlazorDateFormats(formatOptions, culture) {
    var format = formatOptions.format || formatOptions.skeleton;
    var curFormatMapper = getValue((culture || "en-US") + "." + format, blazorCultureFormats);
    if (!curFormatMapper) {
      curFormatMapper = getValue("en-US." + format, blazorCultureFormats);
    }
    if (curFormatMapper) {
      curFormatMapper = ConvertDateToWeekFormat(curFormatMapper);
      formatOptions.format = curFormatMapper.replace(/tt/, "a");
    }
    return formatOptions;
  }
  IntlBase2.compareBlazorDateFormats = compareBlazorDateFormats;
  function getProperNumericSkeleton(skeleton) {
    var matches2 = skeleton.match(IntlBase2.formatRegex);
    var ret = {};
    var pattern = matches2[1].toUpperCase();
    ret.isAccount = pattern === "A";
    ret.type = IntlBase2.patternMatcher["" + pattern];
    if (skeleton.length > 1) {
      ret.fractionDigits = parseInt(matches2[2], 10);
    }
    return ret;
  }
  IntlBase2.getProperNumericSkeleton = getProperNumericSkeleton;
  function getFormatData(pattern, needFraction, cSymbol, fractionOnly) {
    var nData = fractionOnly ? {} : {
      nlead: "",
      nend: ""
    };
    var match = pattern.match(IntlBase2.customRegex);
    if (match) {
      if (!fractionOnly) {
        nData.nlead = changeCurrencySymbol(match[1], cSymbol);
        nData.nend = changeCurrencySymbol(match[10], cSymbol);
        nData.groupPattern = match[4];
      }
      var fraction = match[7];
      if (fraction && needFraction) {
        var fmatch = fraction.match(fractionRegex);
        if (!isNullOrUndefined(fmatch)) {
          nData.minimumFraction = fmatch.length;
        } else {
          nData.minimumFraction = 0;
        }
        nData.maximumFraction = fraction.length - 1;
      }
    }
    return nData;
  }
  IntlBase2.getFormatData = getFormatData;
  function changeCurrencySymbol(val, sym) {
    if (val) {
      val = val.replace(IntlBase2.defaultCurrency, sym);
      return sym === "" ? val.trim() : val;
    }
    return "";
  }
  IntlBase2.changeCurrencySymbol = changeCurrencySymbol;
  function getCurrencySymbol(numericObject, currencyCode, altSymbol, ignoreCurrency) {
    var symbol = altSymbol ? "." + altSymbol : ".symbol";
    var getCurrency = ignoreCurrency ? "$" : getValue("currencies." + currencyCode + symbol, numericObject) || getValue("currencies." + currencyCode + ".symbol-alt-narrow", numericObject) || "$";
    return getCurrency;
  }
  IntlBase2.getCurrencySymbol = getCurrencySymbol;
  function customFormat(format, dOptions, obj) {
    var options = {};
    var formatSplit = format.split(";");
    var data = ["pData", "nData", "zeroData"];
    for (var i = 0; i < formatSplit.length; i++) {
      options["" + data[parseInt(i.toString(), 10)]] = customNumberFormat(formatSplit[parseInt(i.toString(), 10)], dOptions, obj);
    }
    if (isNullOrUndefined(options.nData)) {
      options.nData = extend({}, options.pData);
      options.nData.nlead = isNullOrUndefined(dOptions) ? "-" + options.nData.nlead : dOptions.minusSymbol + options.nData.nlead;
    }
    return options;
  }
  IntlBase2.customFormat = customFormat;
  function customNumberFormat(format, dOptions, numObject) {
    var cOptions = {
      type: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    };
    var pattern = format.match(IntlBase2.customRegex);
    if (isNullOrUndefined(pattern) || pattern[5] === "" && format !== "N/A") {
      cOptions.type = void 0;
      return cOptions;
    }
    cOptions.nlead = pattern[1];
    cOptions.nend = pattern[10];
    var integerPart = pattern[6];
    var spaceCapture = integerPart.match(/ $/g) ? true : false;
    var spaceGrouping = integerPart.replace(/ $/g, "").indexOf(" ") !== -1;
    cOptions.useGrouping = integerPart.indexOf(",") !== -1 || spaceGrouping;
    integerPart = integerPart.replace(/,/g, "");
    integerPart = /\s$/.test(integerPart) ? integerPart.replace(/ /g, "") : integerPart;
    var fractionPart = pattern[7];
    if (integerPart.indexOf("0") !== -1) {
      cOptions.minimumIntegerDigits = integerPart.length - integerPart.indexOf("0");
    }
    if (!isNullOrUndefined(fractionPart)) {
      cOptions.minimumFractionDigits = fractionPart.lastIndexOf("0");
      cOptions.maximumFractionDigits = fractionPart.lastIndexOf("#");
      if (cOptions.minimumFractionDigits === -1) {
        cOptions.minimumFractionDigits = 0;
      }
      if (cOptions.maximumFractionDigits === -1 || cOptions.maximumFractionDigits < cOptions.minimumFractionDigits) {
        cOptions.maximumFractionDigits = cOptions.minimumFractionDigits;
      }
    }
    if (!isNullOrUndefined(dOptions)) {
      dOptions.isCustomFormat = true;
      extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], "$", dOptions.currencySymbol));
      if (!cOptions.isCurrency) {
        extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], "%", dOptions.percentSymbol));
      }
    } else {
      extend(cOptions, isCurrencyPercent([cOptions.nlead, cOptions.nend], "%", "%"));
    }
    if (!isNullOrUndefined(numObject)) {
      var symbolPattern = getSymbolPattern(cOptions.type, dOptions.numberMapper.numberSystem, numObject, false);
      if (cOptions.useGrouping) {
        cOptions.groupSeparator = spaceGrouping ? " " : dOptions.numberMapper.numberSymbols[mapper3[2]];
        cOptions.groupData = NumberFormat.getGroupingDetails(symbolPattern.split(";")[0]);
      }
      cOptions.nlead = cOptions.nlead.replace(/'/g, "");
      cOptions.nend = spaceCapture ? " " + cOptions.nend.replace(/'/g, "") : cOptions.nend.replace(/'/g, "");
    }
    return cOptions;
  }
  IntlBase2.customNumberFormat = customNumberFormat;
  function isCurrencyPercent(parts, actual, symbol) {
    var options = {
      nlead: parts[0],
      nend: parts[1]
    };
    for (var i = 0; i < 2; i++) {
      var part = parts[parseInt(i.toString(), 10)];
      var loc = part.indexOf(actual);
      if (loc !== -1 && (loc < part.indexOf("'") || loc > part.lastIndexOf("'"))) {
        options["" + typeMapper[parseInt(i.toString(), 10)]] = part.substr(0, loc) + symbol + part.substr(loc + 1);
        options["" + typeMapper["" + actual]] = true;
        options.type = options.isCurrency ? "currency" : "percent";
        break;
      }
    }
    return options;
  }
  IntlBase2.isCurrencyPercent = isCurrencyPercent;
  function getDateSeparator(dateObj) {
    var value = (getValue("dateFormats.short", dateObj) || "").match(/[dM]([^dM])[dM]/i);
    return value ? value[1] : "/";
  }
  IntlBase2.getDateSeparator = getDateSeparator;
  function getActualDateTimeFormat(culture, options, cldr, isExcelFormat) {
    var dependable = getDependables(cldr, culture, options.calendar);
    if (isBlazor()) {
      options = compareBlazorDateFormats(options, culture);
    }
    var actualPattern = options.format || getResultantPattern(options.skeleton, dependable.dateObject, options.type);
    if (isExcelFormat) {
      actualPattern = actualPattern.replace(patternRegex, function(pattern2) {
        return patternMatch["" + pattern2];
      });
      if (actualPattern.indexOf("z") !== -1) {
        var tLength = actualPattern.match(/z/g).length;
        var timeZonePattern = void 0;
        var options_1 = {
          "timeZone": {}
        };
        options_1.numMapper = ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr));
        options_1.timeZone = getValue("dates.timeZoneNames", dependable.parserObject);
        var value = /* @__PURE__ */ new Date();
        var timezone = value.getTimezoneOffset();
        var pattern = tLength < 4 ? "+H;-H" : options_1.timeZone.hourFormat;
        pattern = pattern.replace(/:/g, options_1.numMapper.timeSeparator);
        if (timezone === 0) {
          timeZonePattern = options_1.timeZone.gmtZeroFormat;
        } else {
          timeZonePattern = DateFormat.getTimeZoneValue(timezone, pattern);
          timeZonePattern = options_1.timeZone.gmtFormat.replace(/\{0\}/, timeZonePattern);
        }
        actualPattern = actualPattern.replace(/[z]+/, '"' + timeZonePattern + '"');
      }
      actualPattern = actualPattern.replace(/ $/, "");
    }
    return actualPattern;
  }
  IntlBase2.getActualDateTimeFormat = getActualDateTimeFormat;
  function processSymbol(actual, option) {
    if (actual.indexOf(",") !== -1) {
      var split = actual.split(",");
      actual = split[0] + getValue("numberMapper.numberSymbols.group", option) + split[1].replace(".", getValue("numberMapper.numberSymbols.decimal", option));
    } else {
      actual = actual.replace(".", getValue("numberMapper.numberSymbols.decimal", option));
    }
    return actual;
  }
  IntlBase2.processSymbol = processSymbol;
  function getActualNumberFormat(culture, options, cldr, isExcel) {
    var dependable = getDependables(cldr, culture, "", true);
    var parseOptions = {
      custom: true
    };
    var numrericObject = dependable.numericObject;
    var minFrac;
    var curObj = {};
    var curMatch = (options.format || "").match(IntlBase2.currencyFormatRegex);
    var type = IntlBase2.formatRegex.test(options.format) ? getProperNumericSkeleton(options.format || "N") : {};
    var dOptions = {};
    if (curMatch) {
      dOptions.numberMapper = isBlazor() ? extend({}, dependable.numericObject) : ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr), true);
      var curCode = isBlazor() ? getValue("currencySymbol", dependable.numericObject) : getCurrencySymbol(dependable.numericObject, options.currency || defaultCurrencyCode, options.altSymbol);
      var symbolPattern = getSymbolPattern("currency", dOptions.numberMapper.numberSystem, dependable.numericObject, /a/i.test(options.format));
      symbolPattern = symbolPattern.replace(/\u00A4/g, curCode);
      var split = symbolPattern.split(";");
      curObj.hasNegativePattern = isBlazor() ? true : split.length > 1;
      curObj.nData = isBlazor() ? getValue(type.type + "nData", numrericObject) : getFormatData(split[1] || "-" + split[0], true, curCode);
      curObj.pData = isBlazor() ? getValue(type.type + "pData", numrericObject) : getFormatData(split[0], false, curCode);
      if (!curMatch[2] && !options.minimumFractionDigits && !options.maximumFractionDigits) {
        minFrac = getFormatData(symbolPattern.split(";")[0], true, "", true).minimumFraction;
      }
    }
    var actualPattern;
    if (IntlBase2.formatRegex.test(options.format) || !options.format) {
      extend(parseOptions, getProperNumericSkeleton(options.format || "N"));
      parseOptions.custom = false;
      actualPattern = "###0";
      if (parseOptions.fractionDigits || options.minimumFractionDigits || options.maximumFractionDigits || minFrac) {
        var defaultMinimum = 0;
        if (parseOptions.fractionDigits) {
          options.minimumFractionDigits = options.maximumFractionDigits = parseOptions.fractionDigits;
        }
        actualPattern = fractionDigitsPattern(actualPattern, minFrac || parseOptions.fractionDigits || options.minimumFractionDigits || defaultMinimum, options.maximumFractionDigits || defaultMinimum);
      }
      if (options.minimumIntegerDigits) {
        actualPattern = minimumIntegerPattern(actualPattern, options.minimumIntegerDigits);
      }
      if (options.useGrouping) {
        actualPattern = groupingPattern(actualPattern);
      }
      if (parseOptions.type === "currency" || parseOptions.type && isBlazor()) {
        if (isBlazor() && parseOptions.type !== "currency") {
          curObj.pData = getValue(parseOptions.type + "pData", numrericObject);
          curObj.nData = getValue(parseOptions.type + "nData", numrericObject);
        }
        var cPattern = actualPattern;
        actualPattern = curObj.pData.nlead + cPattern + curObj.pData.nend;
        if (curObj.hasNegativePattern || isBlazor()) {
          actualPattern += ";" + curObj.nData.nlead + cPattern + curObj.nData.nend;
        }
      }
      if (parseOptions.type === "percent" && !isBlazor()) {
        actualPattern += " %";
      }
    } else {
      actualPattern = options.format.replace(/'/g, '"');
    }
    if (Object.keys(dOptions).length > 0) {
      actualPattern = !isExcel ? processSymbol(actualPattern, dOptions) : actualPattern;
    }
    return actualPattern;
  }
  IntlBase2.getActualNumberFormat = getActualNumberFormat;
  function fractionDigitsPattern(pattern, minDigits, maxDigits) {
    pattern += ".";
    for (var a = 0; a < minDigits; a++) {
      pattern += "0";
    }
    if (minDigits < maxDigits) {
      var diff = maxDigits - minDigits;
      for (var b = 0; b < diff; b++) {
        pattern += "#";
      }
    }
    return pattern;
  }
  IntlBase2.fractionDigitsPattern = fractionDigitsPattern;
  function minimumIntegerPattern(pattern, digits) {
    var temp = pattern.split(".");
    var integer = "";
    for (var x = 0; x < digits; x++) {
      integer += "0";
    }
    return temp[1] ? integer + "." + temp[1] : integer;
  }
  IntlBase2.minimumIntegerPattern = minimumIntegerPattern;
  function groupingPattern(pattern) {
    var temp = pattern.split(".");
    var integer = temp[0];
    var no = 3 - integer.length % 3;
    var hash = no && no === 1 ? "#" : no === 2 ? "##" : "";
    integer = hash + integer;
    pattern = "";
    for (var x = integer.length - 1; x > 0; x = x - 3) {
      pattern = "," + integer[x - 2] + integer[x - 1] + integer[parseInt(x.toString(), 10)] + pattern;
    }
    pattern = pattern.slice(1);
    return temp[1] ? pattern + "." + temp[1] : pattern;
  }
  IntlBase2.groupingPattern = groupingPattern;
  function getWeekData(culture, cldr) {
    var firstDay = defaultFirstDay;
    var mapper4 = getValue("supplemental.weekData.firstDay", cldr);
    var iCulture = culture;
    if (/en-/.test(iCulture)) {
      iCulture = iCulture.slice(3);
    }
    iCulture = iCulture.slice(0, 2).toUpperCase() + iCulture.substr(2);
    if (mapper4) {
      firstDay = mapper4["" + iCulture] || mapper4[iCulture.slice(0, 2)] || defaultFirstDay;
    }
    return firstDayMapper["" + firstDay];
  }
  IntlBase2.getWeekData = getWeekData;
  function replaceBlazorCurrency(pData, aCurrency, rCurrency) {
    var iCurrency = getBlazorCurrencySymbol(rCurrency);
    if (aCurrency !== iCurrency) {
      for (var _i = 0, pData_1 = pData; _i < pData_1.length; _i++) {
        var data = pData_1[_i];
        data.nend = data.nend.replace(aCurrency, iCurrency);
        data.nlead = data.nlead.replace(aCurrency, iCurrency);
      }
    }
  }
  IntlBase2.replaceBlazorCurrency = replaceBlazorCurrency;
  function getWeekOfYear(date, firstDayOfWeek) {
    var newYear = new Date(date.getFullYear(), 0, 1);
    var day = newYear.getDay();
    var weeknum;
    day = day >= 0 ? day : day + 7;
    var daynum = Math.floor((date.getTime() - newYear.getTime() - (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 6e4) / 864e5) + 1;
    if (day < 4) {
      weeknum = Math.floor((daynum + day - firstDayOfWeek - 1) / 7) + 1;
      if (weeknum > 52) {
        var nYear = new Date(date.getFullYear() + 1, 0, 1);
        var nday = nYear.getDay();
        nday = nday >= 0 ? nday : nday + 7;
        weeknum = nday < 4 ? 1 : 53;
      }
    } else {
      weeknum = Math.floor((daynum + day - firstDayOfWeek - 1) / 7);
    }
    return weeknum;
  }
  IntlBase2.getWeekOfYear = getWeekOfYear;
})(IntlBase || (IntlBase = {}));

// node_modules/@syncfusion/ej2-base/src/ajax.js
var headerRegex = /^(.*?):[ \t]*([^\r\n]*)$/gm;
var defaultType = "GET";
var Ajax = (
  /** @class */
  function() {
    function Ajax2(options, type, async, contentType) {
      this.mode = true;
      this.emitError = true;
      this.options = {};
      if (typeof options === "string") {
        this.url = options;
        this.type = type ? type.toUpperCase() : defaultType;
        this.mode = !isNullOrUndefined(async) ? async : true;
      } else if (typeof options === "object") {
        this.options = options;
        merge(this, this.options);
      }
      this.type = this.type ? this.type.toUpperCase() : defaultType;
      this.contentType = this.contentType !== void 0 ? this.contentType : contentType;
    }
    Ajax2.prototype.send = function(data) {
      var _this = this;
      this.data = isNullOrUndefined(data) ? this.data : data;
      var eventArgs = {
        cancel: false,
        httpRequest: null
      };
      var promise = new Promise(function(resolve, reject) {
        _this.httpRequest = new XMLHttpRequest();
        _this.httpRequest.onreadystatechange = function() {
          _this.stateChange(resolve, reject);
        };
        if (!isNullOrUndefined(_this.onLoad)) {
          _this.httpRequest.onload = _this.onLoad;
        }
        if (!isNullOrUndefined(_this.onProgress)) {
          _this.httpRequest.onprogress = _this.onProgress;
        }
        if (!isNullOrUndefined(_this.onAbort)) {
          _this.httpRequest.onabort = _this.onAbort;
        }
        if (!isNullOrUndefined(_this.onError)) {
          _this.httpRequest.onerror = _this.onError;
        }
        if (!isNullOrUndefined(_this.onUploadProgress)) {
          _this.httpRequest.upload.onprogress = _this.onUploadProgress;
        }
        _this.httpRequest.open(_this.type, _this.url, _this.mode);
        if (!isNullOrUndefined(_this.data) && _this.contentType !== null) {
          _this.httpRequest.setRequestHeader("Content-Type", _this.contentType || "application/json; charset=utf-8");
        }
        if (_this.beforeSend) {
          eventArgs.httpRequest = _this.httpRequest;
          _this.beforeSend(eventArgs);
        }
        if (!eventArgs.cancel) {
          _this.httpRequest.send(!isNullOrUndefined(_this.data) ? _this.data : null);
        }
      });
      return promise;
    };
    Ajax2.prototype.successHandler = function(data) {
      if (this.onSuccess) {
        this.onSuccess(data, this);
      }
      return data;
    };
    Ajax2.prototype.failureHandler = function(reason) {
      if (this.onFailure) {
        this.onFailure(this.httpRequest);
      }
      return reason;
    };
    Ajax2.prototype.stateChange = function(resolve, reject) {
      var data = this.httpRequest.responseText;
      if (this.dataType && this.dataType.toLowerCase() === "json") {
        if (data === "") {
          data = void 0;
        } else {
          try {
            data = JSON.parse(data);
          } catch (error) {
          }
        }
      }
      if (this.httpRequest.readyState === 4) {
        if (this.httpRequest.status >= 200 && this.httpRequest.status <= 299 || this.httpRequest.status === 304) {
          resolve(this.successHandler(data));
        } else {
          if (this.emitError) {
            reject(new Error(this.failureHandler(this.httpRequest.statusText)));
          } else {
            resolve();
          }
        }
      }
    };
    Ajax2.prototype.getResponseHeader = function(key) {
      var responseHeaders = {};
      var headers = headerRegex.exec(this.httpRequest.getAllResponseHeaders());
      while (headers) {
        responseHeaders[headers[1].toLowerCase()] = headers[2];
        headers = headerRegex.exec(this.httpRequest.getAllResponseHeaders());
      }
      var header = responseHeaders[key.toLowerCase()];
      return isNullOrUndefined(header) ? null : header;
    };
    return Ajax2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/fetch.js
var Fetch = (
  /** @class */
  function() {
    function Fetch2(options, type, contentType) {
      this.type = "GET";
      this.emitError = true;
      if (typeof options === "string") {
        this.url = options;
        this.type = !isNullOrUndefined(type) ? type.toUpperCase() : this.type;
        this.contentType = contentType;
      } else if (isObject(options) && Object.keys(options).length > 0) {
        merge(this, options);
      }
      this.contentType = !isNullOrUndefined(this.contentType) ? this.contentType : "application/json; charset=utf-8";
    }
    Fetch2.prototype.send = function(data) {
      var _this = this;
      var contentTypes = {
        "application/json": "json",
        "multipart/form-data": "formData",
        "application/octet-stream": "blob",
        "application/x-www-form-urlencoded": "formData"
      };
      try {
        if (isNullOrUndefined(this.fetchRequest) && this.type === "GET") {
          this.fetchRequest = new Request(this.url, {
            method: this.type
          });
        } else if (isNullOrUndefined(this.fetchRequest)) {
          this.data = !isNullOrUndefined(data) ? data : this.data;
          this.fetchRequest = new Request(this.url, {
            method: this.type,
            headers: {
              "Content-Type": this.contentType
            },
            body: this.data
          });
        }
        var eventArgs = {
          cancel: false,
          fetchRequest: this.fetchRequest
        };
        this.triggerEvent(this["beforeSend"], eventArgs);
        if (eventArgs.cancel) {
          return null;
        }
        this.fetchResponse = fetch(this.fetchRequest);
        return this.fetchResponse.then(function(response) {
          _this.triggerEvent(_this["onLoad"], response);
          if (!response.ok) {
            throw response;
          }
          var responseType = "text";
          for (var _i = 0, _a = Object.keys(contentTypes); _i < _a.length; _i++) {
            var key = _a[_i];
            if (response.headers.get("Content-Type") && response.headers.get("Content-Type").indexOf(key) !== -1) {
              responseType = contentTypes[key];
            }
          }
          return response[responseType]();
        }).then(function(data2) {
          _this.triggerEvent(_this["onSuccess"], data2, _this);
          return data2;
        }).catch(function(error) {
          var returnVal = {};
          if (_this.emitError) {
            _this.triggerEvent(_this["onFailure"], error);
            returnVal = Promise.reject(error);
          }
          return returnVal;
        });
      } catch (error) {
        return error;
      }
    };
    Fetch2.prototype.triggerEvent = function(callback, data, instance) {
      if (!isNullOrUndefined(callback) && typeof callback === "function") {
        callback(data, instance);
      }
    };
    return Fetch2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/browser.js
var REGX_MOBILE = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
var REGX_IE = /msie|trident/i;
var REGX_IE11 = /Trident\/7\./;
var REGX_IOS = /(ipad|iphone|ipod touch)/i;
var REGX_IOS7 = /(ipad|iphone|ipod touch);.*os 7_\d|(ipad|iphone|ipod touch);.*os 8_\d/i;
var REGX_ANDROID = /android/i;
var REGX_WINDOWS = /trident|windows phone|edge/i;
var REGX_VERSION = /(version)[ /]([\w.]+)/i;
var REGX_BROWSER = {
  OPERA: /(opera|opr)(?:.*version|)[ /]([\w.]+)/i,
  EDGE: /(edge)(?:.*version|)[ /]([\w.]+)/i,
  CHROME: /(chrome|crios)[ /]([\w.]+)/i,
  PANTHOMEJS: /(phantomjs)[ /]([\w.]+)/i,
  SAFARI: /(safari)[ /]([\w.]+)/i,
  WEBKIT: /(webkit)[ /]([\w.]+)/i,
  MSIE: /(msie|trident) ([\w.]+)/i,
  MOZILLA: /(mozilla)(?:.*? rv:([\w.]+)|)/i
};
if (typeof window !== "undefined") {
  window.browserDetails = window.browserDetails || {};
}
var Browser = (
  /** @class */
  function() {
    function Browser2() {
    }
    Browser2.extractBrowserDetail = function() {
      var browserInfo = {
        culture: {}
      };
      var keys2 = Object.keys(REGX_BROWSER);
      var clientInfo = [];
      for (var _i = 0, keys_1 = keys2; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        clientInfo = Browser2.userAgent.match(REGX_BROWSER["" + key]);
        if (clientInfo) {
          browserInfo.name = clientInfo[1].toLowerCase() === "opr" ? "opera" : clientInfo[1].toLowerCase();
          browserInfo.name = clientInfo[1].toLowerCase() === "crios" ? "chrome" : browserInfo.name;
          browserInfo.version = clientInfo[2];
          browserInfo.culture.name = browserInfo.culture.language = navigator.language;
          if (Browser2.userAgent.match(REGX_IE11)) {
            browserInfo.name = "msie";
            break;
          }
          var version = Browser2.userAgent.match(REGX_VERSION);
          if (browserInfo.name === "safari" && version) {
            browserInfo.version = version[2];
          }
          break;
        }
      }
      return browserInfo;
    };
    Browser2.getEvent = function(event) {
      var events = {
        start: {
          isPointer: "pointerdown",
          isTouch: "touchstart",
          isDevice: "mousedown"
        },
        move: {
          isPointer: "pointermove",
          isTouch: "touchmove",
          isDevice: "mousemove"
        },
        end: {
          isPointer: "pointerup",
          isTouch: "touchend",
          isDevice: "mouseup"
        },
        cancel: {
          isPointer: "pointercancel",
          isTouch: "touchcancel",
          isDevice: "mouseleave"
        }
      };
      return Browser2.isPointer ? events["" + event].isPointer : Browser2.isTouch ? events["" + event].isTouch + (!Browser2.isDevice ? " " + events["" + event].isDevice : "") : events["" + event].isDevice;
    };
    Browser2.getTouchStartEvent = function() {
      return Browser2.getEvent("start");
    };
    Browser2.getTouchEndEvent = function() {
      return Browser2.getEvent("end");
    };
    Browser2.getTouchMoveEvent = function() {
      return Browser2.getEvent("move");
    };
    Browser2.getTouchCancelEvent = function() {
      return Browser2.getEvent("cancel");
    };
    Browser2.isSafari = function() {
      return Browser2.isDevice && Browser2.isIos && Browser2.isTouch && typeof window !== "undefined" && window.navigator.userAgent.toLowerCase().indexOf("iphone") === -1 && window.navigator.userAgent.toLowerCase().indexOf("safari") > -1;
    };
    Browser2.getValue = function(key, regX) {
      var browserDetails = typeof window !== "undefined" ? window.browserDetails : {};
      if (typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && Browser2.isTouch === true && !REGX_BROWSER.CHROME.test(navigator.userAgent)) {
        browserDetails["isIos"] = true;
        browserDetails["isDevice"] = true;
        browserDetails["isTouch"] = true;
        browserDetails["isPointer"] = true;
        browserDetails["isPointer"] = "pointerEnabled" in window.navigator;
      }
      if (typeof window !== "undefined" && window.Capacitor && window.Capacitor.getPlatform() === "ios") {
        browserDetails["isPointer"] = false;
      }
      if ("undefined" === typeof browserDetails["" + key]) {
        return browserDetails["" + key] = regX.test(Browser2.userAgent);
      }
      return browserDetails["" + key];
    };
    Object.defineProperty(Browser2, "userAgent", {
      get: function() {
        return Browser2.uA;
      },
      //Properties
      /**
       * Property specifies the userAgent of the browser. Default userAgent value is based on the browser.
       * Also we can set our own userAgent.
       *
       * @param {string} uA ?
       */
      set: function(uA) {
        Browser2.uA = uA;
        window.browserDetails = {};
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "info", {
      //Read Only Properties
      /**
       * Property is to get the browser information like Name, Version and Language
       *
       * @returns {BrowserInfo} ?
       */
      get: function() {
        if (isUndefined(window.browserDetails.info)) {
          return window.browserDetails.info = Browser2.extractBrowserDetail();
        }
        return window.browserDetails.info;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isIE", {
      /**
       * Property is to get whether the userAgent is based IE.
       *
       * @returns {boolean} ?
       */
      get: function() {
        return Browser2.getValue("isIE", REGX_IE);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isTouch", {
      /**
       * Property is to get whether the browser has touch support.
       *
       * @returns {boolean} ?
       */
      get: function() {
        if (isUndefined(window.browserDetails.isTouch)) {
          return window.browserDetails.isTouch = "ontouchstart" in window.navigator || window && window.navigator && window.navigator.maxTouchPoints > 0 || "ontouchstart" in window;
        }
        return window.browserDetails.isTouch;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isPointer", {
      /**
       * Property is to get whether the browser has Pointer support.
       *
       * @returns {boolean} ?
       */
      get: function() {
        if (isUndefined(window.browserDetails.isPointer)) {
          return window.browserDetails.isPointer = "pointerEnabled" in window.navigator;
        }
        return window.browserDetails.isPointer;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isMSPointer", {
      /**
       * Property is to get whether the browser has MSPointer support.
       *
       * @returns {boolean} ?
       */
      get: function() {
        if (isUndefined(window.browserDetails.isMSPointer)) {
          return window.browserDetails.isMSPointer = "msPointerEnabled" in window.navigator;
        }
        return window.browserDetails.isMSPointer;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isDevice", {
      /**
       * Property is to get whether the userAgent is device based.
       *
       * @returns {boolean} ?
       */
      get: function() {
        return Browser2.getValue("isDevice", REGX_MOBILE);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isIos", {
      /**
       * Property is to get whether the userAgent is IOS.
       *
       * @returns {boolean} ?
       */
      get: function() {
        return Browser2.getValue("isIos", REGX_IOS);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isIos7", {
      /**
       * Property is to get whether the userAgent is Ios7.
       *
       * @returns {boolean} ?
       */
      get: function() {
        return Browser2.getValue("isIos7", REGX_IOS7);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isAndroid", {
      /**
       * Property is to get whether the userAgent is Android.
       *
       * @returns {boolean} ?
       */
      get: function() {
        return Browser2.getValue("isAndroid", REGX_ANDROID);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isWebView", {
      /**
       * Property is to identify whether application ran in web view.
       *
       * @returns {boolean} ?
       */
      get: function() {
        if (isUndefined(window.browserDetails.isWebView)) {
          window.browserDetails.isWebView = !(isUndefined(window.cordova) && isUndefined(window.PhoneGap) && isUndefined(window.phonegap) && window.forge !== "object");
          return window.browserDetails.isWebView;
        }
        return window.browserDetails.isWebView;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "isWindows", {
      /**
       * Property is to get whether the userAgent is Windows.
       *
       * @returns {boolean} ?
       */
      get: function() {
        return Browser2.getValue("isWindows", REGX_WINDOWS);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "touchStartEvent", {
      /**
       * Property is to get the touch start event. It returns event name based on browser.
       *
       * @returns {string} ?
       */
      get: function() {
        if (isUndefined(window.browserDetails.touchStartEvent)) {
          return window.browserDetails.touchStartEvent = Browser2.getTouchStartEvent();
        }
        return window.browserDetails.touchStartEvent;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "touchMoveEvent", {
      /**
       * Property is to get the touch move event. It returns event name based on browser.
       *
       * @returns {string} ?
       */
      get: function() {
        if (isUndefined(window.browserDetails.touchMoveEvent)) {
          return window.browserDetails.touchMoveEvent = Browser2.getTouchMoveEvent();
        }
        return window.browserDetails.touchMoveEvent;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "touchEndEvent", {
      /**
       * Property is to get the touch end event. It returns event name based on browser.
       *
       * @returns {string} ?
       */
      get: function() {
        if (isUndefined(window.browserDetails.touchEndEvent)) {
          return window.browserDetails.touchEndEvent = Browser2.getTouchEndEvent();
        }
        return window.browserDetails.touchEndEvent;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Browser2, "touchCancelEvent", {
      /**
       * Property is to cancel the touch end event.
       *
       * @returns {string} ?
       */
      get: function() {
        if (isUndefined(window.browserDetails.touchCancelEvent)) {
          return window.browserDetails.touchCancelEvent = Browser2.getTouchCancelEvent();
        }
        return window.browserDetails.touchCancelEvent;
      },
      enumerable: true,
      configurable: true
    });
    Browser2.uA = typeof navigator !== "undefined" ? navigator.userAgent : "";
    return Browser2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/event-handler.js
var EventHandler = (
  /** @class */
  function() {
    function EventHandler2() {
    }
    EventHandler2.addOrGetEventData = function(element) {
      if ("__eventList" in element) {
        return element.__eventList.events;
      } else {
        element.__eventList = {};
        return element.__eventList.events = [];
      }
    };
    EventHandler2.add = function(element, eventName, listener, bindTo, intDebounce) {
      var eventData = EventHandler2.addOrGetEventData(element);
      var debounceListener;
      if (intDebounce) {
        debounceListener = debounce(listener, intDebounce);
      } else {
        debounceListener = listener;
      }
      if (bindTo) {
        debounceListener = debounceListener.bind(bindTo);
      }
      var event = eventName.split(" ");
      for (var i = 0; i < event.length; i++) {
        eventData.push({
          name: event[parseInt(i.toString(), 10)],
          listener,
          debounce: debounceListener
        });
        if (Browser.isIE) {
          element.addEventListener(event[parseInt(i.toString(), 10)], debounceListener);
        } else {
          element.addEventListener(event[parseInt(i.toString(), 10)], debounceListener, {
            passive: false
          });
        }
      }
      return debounceListener;
    };
    EventHandler2.remove = function(element, eventName, listener) {
      var eventData = EventHandler2.addOrGetEventData(element);
      var event = eventName.split(" ");
      var _loop_1 = function(j2) {
        var index = -1;
        var debounceListener;
        if (eventData && eventData.length !== 0) {
          eventData.some(function(x, i) {
            return x.name === event[parseInt(j2.toString(), 10)] && x.listener === listener ? (index = i, debounceListener = x.debounce, true) : false;
          });
        }
        if (index !== -1) {
          eventData.splice(index, 1);
        }
        if (debounceListener) {
          element.removeEventListener(event[parseInt(j2.toString(), 10)], debounceListener);
        }
      };
      for (var j = 0; j < event.length; j++) {
        _loop_1(j);
      }
    };
    EventHandler2.clearEvents = function(element) {
      var eventData = EventHandler2.addOrGetEventData(element);
      var copyData = extend([], void 0, eventData);
      for (var i = 0; i < copyData.length; i++) {
        var parseValue = copyData[parseInt(i.toString(), 10)];
        element.removeEventListener(parseValue.name, parseValue.debounce);
        eventData.shift();
      }
    };
    EventHandler2.trigger = function(element, eventName, eventProp) {
      var eventData = EventHandler2.addOrGetEventData(element);
      for (var _i = 0, eventData_1 = eventData; _i < eventData_1.length; _i++) {
        var event_1 = eventData_1[_i];
        if (event_1.name === eventName) {
          event_1.debounce.call(this, eventProp);
        }
      }
    };
    return EventHandler2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/dom.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var SVG_REG = /^svg|^path|^g/;
function createElement(tagName, properties) {
  var element = SVG_REG.test(tagName) ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName);
  if (typeof properties === "undefined") {
    return element;
  }
  element.innerHTML = properties.innerHTML ? properties.innerHTML : "";
  if (properties.className !== void 0) {
    element.className = properties.className;
  }
  if (properties.id !== void 0) {
    element.id = properties.id;
  }
  if (properties.styles !== void 0) {
    element.style.cssText = properties.styles;
  }
  if (properties.attrs !== void 0) {
    attributes(element, properties.attrs);
  }
  return element;
}
function updateCSSText(element, cssText) {
  var existingStyles = element.style.cssText.split(";").reduce(function(styles, style) {
    var _a = style.split(":"), key = _a[0], value = _a[1];
    if (key && value) {
      styles[key.trim()] = value.trim();
    }
    return styles;
  }, {});
  var newStyles = cssText.split(";").reduce(function(styles, style) {
    var _a = style.split(":"), key = _a[0], value = _a[1];
    if (key && value) {
      styles[key.trim()] = value.trim();
    }
    return styles;
  }, {});
  var styleElement = document.createElement("div");
  Object.keys(__assign({}, existingStyles, newStyles)).forEach(function(key) {
    styleElement.style.setProperty(key, newStyles[key] || existingStyles[key]);
  });
  element.style.cssText = styleElement.style.cssText;
}
function addClass(elements, classes) {
  var classList2 = getClassList(classes);
  var regExp3 = RegExp;
  for (var _i = 0, _a = elements; _i < _a.length; _i++) {
    var ele = _a[_i];
    for (var _b = 0, classList_1 = classList2; _b < classList_1.length; _b++) {
      var className = classList_1[_b];
      if (isObject(ele)) {
        var curClass = getValue("attributes.className", ele);
        if (isNullOrUndefined(curClass)) {
          setValue("attributes.className", className, ele);
        } else if (!new regExp3("\\b" + className + "\\b", "i").test(curClass)) {
          setValue("attributes.className", curClass + " " + className, ele);
        }
      } else {
        if (!ele.classList.contains(className)) {
          ele.classList.add(className);
        }
      }
    }
  }
  return elements;
}
function removeClass(elements, classes) {
  var classList2 = getClassList(classes);
  for (var _i = 0, _a = elements; _i < _a.length; _i++) {
    var ele = _a[_i];
    var flag = isObject(ele);
    var canRemove = flag ? getValue("attributes.className", ele) : ele.className !== "";
    if (canRemove) {
      for (var _b = 0, classList_2 = classList2; _b < classList_2.length; _b++) {
        var className = classList_2[_b];
        if (flag) {
          var classes_1 = getValue("attributes.className", ele);
          var classArr = classes_1.split(" ");
          var index = classArr.indexOf(className);
          if (index !== -1) {
            classArr.splice(index, 1);
          }
          setValue("attributes.className", classArr.join(" "), ele);
        } else {
          ele.classList.remove(className);
        }
      }
    }
  }
  return elements;
}
function getClassList(classes) {
  var classList2 = [];
  if (typeof classes === "string") {
    classList2.push(classes);
  } else {
    classList2 = classes;
  }
  return classList2;
}
function isVisible(element) {
  var ele = element;
  return ele.style.visibility === "" && ele.offsetWidth > 0;
}
function prepend(fromElements, toElement, isEval) {
  var docFrag = document.createDocumentFragment();
  for (var _i = 0, _a = fromElements; _i < _a.length; _i++) {
    var ele = _a[_i];
    docFrag.appendChild(ele);
  }
  toElement.insertBefore(docFrag, toElement.firstElementChild);
  if (isEval) {
    executeScript(toElement);
  }
  return fromElements;
}
function append(fromElements, toElement, isEval) {
  var docFrag = document.createDocumentFragment();
  if (fromElements instanceof NodeList) {
    while (fromElements.length > 0) {
      docFrag.appendChild(fromElements[0]);
    }
  } else {
    for (var _i = 0, _a = fromElements; _i < _a.length; _i++) {
      var ele = _a[_i];
      docFrag.appendChild(ele);
    }
  }
  toElement.appendChild(docFrag);
  if (isEval) {
    executeScript(toElement);
  }
  return fromElements;
}
function executeScript(ele) {
  var eleArray = ele.querySelectorAll("script");
  eleArray.forEach(function(element) {
    var script = document.createElement("script");
    script.text = element.innerHTML;
    document.head.appendChild(script);
    detach(script);
  });
}
function detach(element) {
  var parentNode = element.parentNode;
  if (parentNode) {
    return parentNode.removeChild(element);
  }
}
function remove(element) {
  var parentNode = element.parentNode;
  EventHandler.clearEvents(element);
  parentNode.removeChild(element);
}
function attributes(element, attributes2) {
  var keys2 = Object.keys(attributes2);
  var ele = element;
  for (var _i = 0, keys_1 = keys2; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    if (isObject(ele)) {
      var iKey = key;
      if (key === "tabindex") {
        iKey = "tabIndex";
      }
      ele.attributes["" + iKey] = attributes2["" + key];
    } else {
      ele.setAttribute(key, attributes2["" + key]);
    }
  }
  return ele;
}
function select(selector, context, needsVDOM) {
  if (context === void 0) {
    context = document;
  }
  selector = querySelectId(selector);
  return context.querySelector(selector);
}
function selectAll(selector, context, needsVDOM) {
  if (context === void 0) {
    context = document;
  }
  selector = querySelectId(selector);
  var nodeList = context.querySelectorAll(selector);
  return nodeList;
}
function querySelectId(selector) {
  var charRegex = /(!|"|\$|%|&|'|\(|\)|\*|\/|:|;|<|=|\?|@|\]|\^|`|{|}|\||\+|~)/g;
  if (selector.match(/#[0-9]/g) || selector.match(charRegex)) {
    var idList = selector.split(",");
    for (var i = 0; i < idList.length; i++) {
      var list = idList[parseInt(i.toString(), 10)].split(" ");
      for (var j = 0; j < list.length; j++) {
        if (list[parseInt(j.toString(), 10)].indexOf("#") > -1) {
          if (!list[parseInt(j.toString(), 10)].match(/\[.*\]/)) {
            var splitId = list[parseInt(j.toString(), 10)].split("#");
            if (splitId[1].match(/^\d/) || splitId[1].match(charRegex)) {
              var setId = list[parseInt(j.toString(), 10)].split(".");
              setId[0] = setId[0].replace(/#/, "[id='") + "']";
              list[parseInt(j.toString(), 10)] = setId.join(".");
            }
          }
        }
      }
      idList[parseInt(i.toString(), 10)] = list.join(" ");
    }
    return idList.join(",");
  }
  return selector;
}
function closest(element, selector) {
  var el = element;
  if (typeof el.closest === "function") {
    return el.closest(selector);
  }
  while (el && el.nodeType === 1) {
    if (matches(el, selector)) {
      return el;
    }
    el = el.parentNode;
  }
  return null;
}
function siblings(element) {
  var siblings2 = [];
  var childNodes = Array.prototype.slice.call(element.parentNode.childNodes);
  for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
    var curNode = childNodes_1[_i];
    if (curNode.nodeType === Node.ELEMENT_NODE && element !== curNode) {
      siblings2.push(curNode);
    }
  }
  return siblings2;
}
function getAttributeOrDefault(element, property, value) {
  var attrVal;
  var isObj = isObject(element);
  if (isObj) {
    attrVal = getValue("attributes." + property, element);
  } else {
    attrVal = element.getAttribute(property);
  }
  if (isNullOrUndefined(attrVal) && value) {
    if (!isObj) {
      element.setAttribute(property, value.toString());
    } else {
      element.attributes["" + property] = value;
    }
    attrVal = value;
  }
  return attrVal;
}
function setStyleAttribute(element, attrs) {
  if (attrs !== void 0) {
    Object.keys(attrs).forEach(function(key) {
      element.style["" + key] = attrs["" + key];
    });
  }
}
function classList(element, addClasses, removeClasses) {
  addClass([element], addClasses);
  removeClass([element], removeClasses);
}
function matches(element, selector) {
  var matches2 = element.matches || element.msMatchesSelector || element.webkitMatchesSelector;
  if (matches2) {
    return matches2.call(element, selector);
  } else {
    return [].indexOf.call(document.querySelectorAll(selector), element) !== -1;
  }
}
function includeInnerHTML(ele, innerHTML) {
  ele.innerHTML = innerHTML;
}
function containsClass(ele, className) {
  if (isObject(ele)) {
    var regExp3 = RegExp;
    return new regExp3("\\b" + className + "\\b", "i").test(ele.attributes.className);
  } else {
    return ele.classList.contains(className);
  }
}
function cloneNode(element, deep) {
  if (isObject(element)) {
    if (deep) {
      return extend({}, {}, element, true);
    }
  } else {
    return element.cloneNode(deep);
  }
}

// node_modules/@syncfusion/ej2-base/src/observer.js
var Observer = (
  /** @class */
  function() {
    function Observer2(context) {
      this.ranArray = [];
      this.boundedEvents = {};
      if (isNullOrUndefined(context)) {
        return;
      }
      this.context = context;
    }
    Observer2.prototype.on = function(property, handler, context, id) {
      if (isNullOrUndefined(handler)) {
        return;
      }
      var cntxt = context || this.context;
      if (this.notExist(property)) {
        this.boundedEvents["" + property] = [{
          handler,
          context: cntxt,
          id
        }];
        return;
      }
      if (!isNullOrUndefined(id)) {
        if (this.ranArray.indexOf(id) === -1) {
          this.ranArray.push(id);
          this.boundedEvents["" + property].push({
            handler,
            context: cntxt,
            id
          });
        }
      } else if (!this.isHandlerPresent(this.boundedEvents["" + property], handler)) {
        this.boundedEvents["" + property].push({
          handler,
          context: cntxt
        });
      }
    };
    Observer2.prototype.off = function(property, handler, id) {
      if (this.notExist(property)) {
        return;
      }
      var curObject = getValue(property, this.boundedEvents);
      if (handler) {
        for (var i = 0; i < curObject.length; i++) {
          if (id) {
            if (curObject[parseInt(i.toString(), 10)].id === id) {
              curObject.splice(i, 1);
              var indexLocation = this.ranArray.indexOf(id);
              if (indexLocation !== -1) {
                this.ranArray.splice(indexLocation, 1);
              }
              break;
            }
          } else if (handler === curObject[parseInt(i.toString(), 10)].handler) {
            curObject.splice(i, 1);
            break;
          }
        }
      } else {
        delete this.boundedEvents["" + property];
      }
    };
    Observer2.prototype.notify = function(property, argument, successHandler, errorHandler) {
      if (this.notExist(property)) {
        if (successHandler) {
          successHandler.call(this, argument);
        }
        return;
      }
      if (argument) {
        argument.name = property;
      }
      var blazor = "Blazor";
      var curObject = getValue(property, this.boundedEvents).slice(0);
      if (window["" + blazor]) {
        return this.blazorCallback(curObject, argument, successHandler, errorHandler, 0);
      } else {
        for (var _i = 0, curObject_1 = curObject; _i < curObject_1.length; _i++) {
          var cur = curObject_1[_i];
          cur.handler.call(cur.context, argument);
        }
        if (successHandler) {
          successHandler.call(this, argument);
        }
      }
    };
    Observer2.prototype.blazorCallback = function(objs, argument, successHandler, errorHandler, index) {
      var _this = this;
      var isTrigger = index === objs.length - 1;
      if (index < objs.length) {
        var obj_1 = objs[parseInt(index.toString(), 10)];
        var promise = obj_1.handler.call(obj_1.context, argument);
        if (promise && typeof promise.then === "function") {
          if (!successHandler) {
            return promise;
          }
          promise.then(function(data) {
            data = typeof data === "string" && _this.isJson(data) ? JSON.parse(data, _this.dateReviver) : data;
            extend(argument, argument, data, true);
            if (successHandler && isTrigger) {
              successHandler.call(obj_1.context, argument);
            } else {
              return _this.blazorCallback(objs, argument, successHandler, errorHandler, index + 1);
            }
          }).catch(function(data) {
            if (errorHandler) {
              errorHandler.call(obj_1.context, typeof data === "string" && _this.isJson(data) ? JSON.parse(data, _this.dateReviver) : data);
            }
          });
        } else if (successHandler && isTrigger) {
          successHandler.call(obj_1.context, argument);
        } else {
          return this.blazorCallback(objs, argument, successHandler, errorHandler, index + 1);
        }
      }
    };
    Observer2.prototype.dateReviver = function(key, value) {
      var dPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (isBlazor && typeof value === "string" && value.match(dPattern) !== null) {
        return new Date(value);
      }
      return value;
    };
    Observer2.prototype.isJson = function(value) {
      try {
        JSON.parse(value);
      } catch (e) {
        return false;
      }
      return true;
    };
    Observer2.prototype.destroy = function() {
      this.boundedEvents = this.context = void 0;
    };
    Observer2.prototype.offIntlEvents = function() {
      var eventsArr = this.boundedEvents["notifyExternalChange"];
      if (eventsArr) {
        for (var i = 0; i < eventsArr.length; i++) {
          var curContext = eventsArr[parseInt(i.toString(), 10)].context;
          if (curContext && curContext.detectFunction && curContext.randomId && curContext.isReactMock) {
            this.off("notifyExternalChange", curContext.detectFunction, curContext.randomId);
            i--;
          }
        }
        if (!this.boundedEvents["notifyExternalChange"].length) {
          delete this.boundedEvents["notifyExternalChange"];
        }
      }
    };
    Observer2.prototype.notExist = function(prop) {
      return Object.prototype.hasOwnProperty.call(this.boundedEvents, prop) === false || this.boundedEvents["" + prop].length <= 0;
    };
    Observer2.prototype.isHandlerPresent = function(boundedEvents, handler) {
      for (var _i = 0, boundedEvents_1 = boundedEvents; _i < boundedEvents_1.length; _i++) {
        var cur = boundedEvents_1[_i];
        if (cur.handler === handler) {
          return true;
        }
      }
      return false;
    };
    return Observer2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/base.js
var isColEName = new RegExp("]");
var Base = (
  /** @class */
  function() {
    function Base2(options, element) {
      this.isRendered = false;
      this.isComplexArraySetter = false;
      this.isServerRendered = false;
      this.allowServerDataBinding = true;
      this.isProtectedOnChange = true;
      this.properties = {};
      this.changedProperties = {};
      this.oldProperties = {};
      this.bulkChanges = {};
      this.refreshing = false;
      this.ignoreCollectionWatch = false;
      this.finalUpdate = function() {
      };
      this.childChangedProperties = {};
      this.modelObserver = new Observer(this);
      if (!isUndefined(element)) {
        if ("string" === typeof element) {
          this.element = document.querySelector(element);
        } else {
          this.element = element;
        }
        if (!isNullOrUndefined(this.element)) {
          this.isProtectedOnChange = false;
          this.addInstance();
        }
      }
      if (!isUndefined(options)) {
        this.setProperties(options, true);
      }
      this.isDestroyed = false;
    }
    Base2.prototype.setProperties = function(prop, muteOnChange) {
      var prevDetection = this.isProtectedOnChange;
      this.isProtectedOnChange = !!muteOnChange;
      merge(this, prop);
      if (muteOnChange !== true) {
        merge(this.changedProperties, prop);
        this.dataBind();
      } else if (isBlazor() && this.isRendered) {
        this.serverDataBind(prop);
      }
      this.finalUpdate();
      this.changedProperties = {};
      this.oldProperties = {};
      this.isProtectedOnChange = prevDetection;
    };
    Base2.callChildDataBind = function(obj, parent) {
      var keys2 = Object.keys(obj);
      for (var _i = 0, keys_1 = keys2; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (parent["" + key] instanceof Array) {
          for (var _a = 0, _b = parent["" + key]; _a < _b.length; _a++) {
            var obj_1 = _b[_a];
            if (obj_1.dataBind !== void 0) {
              obj_1.dataBind();
            }
          }
        } else {
          parent["" + key].dataBind();
        }
      }
    };
    Base2.prototype.clearChanges = function() {
      this.finalUpdate();
      this.changedProperties = {};
      this.oldProperties = {};
      this.childChangedProperties = {};
    };
    Base2.prototype.dataBind = function() {
      Base2.callChildDataBind(this.childChangedProperties, this);
      if (Object.getOwnPropertyNames(this.changedProperties).length) {
        var prevDetection = this.isProtectedOnChange;
        var newChanges = this.changedProperties;
        var oldChanges = this.oldProperties;
        this.clearChanges();
        this.isProtectedOnChange = true;
        this.onPropertyChanged(newChanges, oldChanges);
        this.isProtectedOnChange = prevDetection;
      }
    };
    Base2.prototype.serverDataBind = function(newChanges) {
      if (!isBlazor()) {
        return;
      }
      newChanges = newChanges ? newChanges : {};
      extend(this.bulkChanges, {}, newChanges, true);
      var sfBlazor = "sfBlazor";
      if (this.allowServerDataBinding && window["" + sfBlazor].updateModel) {
        window["" + sfBlazor].updateModel(this);
        this.bulkChanges = {};
      }
    };
    Base2.prototype.saveChanges = function(key, newValue, oldValue) {
      if (isBlazor()) {
        var newChanges = {};
        newChanges["" + key] = newValue;
        this.serverDataBind(newChanges);
      }
      if (this.isProtectedOnChange) {
        return;
      }
      this.oldProperties["" + key] = oldValue;
      this.changedProperties["" + key] = newValue;
      this.finalUpdate();
      this.finalUpdate = setImmediate(this.dataBind.bind(this));
    };
    Base2.prototype.addEventListener = function(eventName, handler) {
      this.modelObserver.on(eventName, handler);
    };
    Base2.prototype.removeEventListener = function(eventName, handler) {
      this.modelObserver.off(eventName, handler);
    };
    Base2.prototype.trigger = function(eventName, eventProp, successHandler, errorHandler) {
      var _this = this;
      if (this.isDestroyed !== true) {
        var prevDetection = this.isProtectedOnChange;
        this.isProtectedOnChange = false;
        var data = this.modelObserver.notify(eventName, eventProp, successHandler, errorHandler);
        if (isColEName.test(eventName)) {
          var handler = getValue(eventName, this);
          if (handler) {
            var blazor = "Blazor";
            if (window["" + blazor]) {
              var promise = handler.call(this, eventProp);
              if (promise && typeof promise.then === "function") {
                if (!successHandler) {
                  data = promise;
                } else {
                  promise.then(function(data2) {
                    if (successHandler) {
                      data2 = typeof data2 === "string" && _this.modelObserver.isJson(data2) ? JSON.parse(data2) : data2;
                      successHandler.call(_this, data2);
                    }
                  }).catch(function(data2) {
                    if (errorHandler) {
                      data2 = typeof data2 === "string" && _this.modelObserver.isJson(data2) ? JSON.parse(data2) : data2;
                      errorHandler.call(_this, data2);
                    }
                  });
                }
              } else if (successHandler) {
                successHandler.call(this, eventProp);
              }
            } else {
              handler.call(this, eventProp);
              if (successHandler) {
                successHandler.call(this, eventProp);
              }
            }
          } else if (successHandler) {
            successHandler.call(this, eventProp);
          }
        }
        this.isProtectedOnChange = prevDetection;
        return data;
      }
    };
    Base2.prototype.addInstance = function() {
      var moduleClass = "e-" + this.getModuleName().toLowerCase();
      addClass([this.element], ["e-lib", moduleClass]);
      if (!isNullOrUndefined(this.element.ej2_instances)) {
        this.element.ej2_instances.push(this);
      } else {
        setValue("ej2_instances", [this], this.element);
      }
    };
    Base2.prototype.destroy = function() {
      var _this = this;
      this.element.ej2_instances = this.element.ej2_instances ? this.element.ej2_instances.filter(function(i) {
        if (proxyToRaw) {
          return proxyToRaw(i) !== proxyToRaw(_this);
        }
        return i !== _this;
      }) : [];
      removeClass([this.element], ["e-" + this.getModuleName()]);
      if (this.element.ej2_instances.length === 0) {
        removeClass([this.element], ["e-lib"]);
      }
      this.clearChanges();
      this.modelObserver.destroy();
      this.isDestroyed = true;
    };
    return Base2;
  }()
);
function getComponent(elem, comp) {
  var instance;
  var i;
  var ele = typeof elem === "string" ? document.getElementById(elem) : elem;
  if (ele && ele.ej2_instances) {
    for (i = 0; i < ele.ej2_instances.length; i++) {
      instance = ele.ej2_instances[parseInt(i.toString(), 10)];
      if (typeof comp === "string") {
        var compName = instance.getModuleName();
        if (comp === compName) {
          return instance;
        }
      } else {
        if (instance instanceof comp) {
          return instance;
        }
      }
    }
  }
  return void 0;
}
function removeChildInstance(element) {
  var childEle = [].slice.call(element.getElementsByClassName("e-control"));
  for (var i = 0; i < childEle.length; i++) {
    var compName = childEle[parseInt(i.toString(), 10)].classList[1].split("e-")[1];
    var compInstance = getComponent(childEle[parseInt(i.toString(), 10)], compName);
    if (!isUndefined(compInstance)) {
      compInstance.destroy();
    }
  }
}
var proxyToRaw;
var setProxyToRaw = function(toRaw) {
  proxyToRaw = toRaw;
};

// node_modules/@syncfusion/ej2-base/src/notify-property-change.js
function getObject(instance, curKey, defaultValue, type) {
  if (!Object.prototype.hasOwnProperty.call(instance.properties, curKey) || !(instance.properties["" + curKey] instanceof type)) {
    instance.properties["" + curKey] = createInstance(type, [instance, curKey, defaultValue]);
  }
  return instance.properties["" + curKey];
}
function getObjectArray(instance, curKey, defaultValue, type, isSetter, isFactory) {
  var result = [];
  var len = defaultValue ? defaultValue.length : 0;
  for (var i = 0; i < len; i++) {
    var curType = type;
    if (isFactory) {
      curType = type(defaultValue[parseInt(i.toString(), 10)], instance);
    }
    if (isSetter) {
      var inst = createInstance(curType, [instance, curKey, {}, true]);
      inst.setProperties(defaultValue[parseInt(i.toString(), 10)], true);
      result.push(inst);
    } else {
      result.push(createInstance(curType, [instance, curKey, defaultValue[parseInt(i.toString(), 10)], false]));
    }
  }
  return result;
}
function propertyGetter(defaultValue, curKey) {
  return function() {
    if (!Object.prototype.hasOwnProperty.call(this.properties, curKey)) {
      this.properties["" + curKey] = defaultValue;
    }
    return this.properties["" + curKey];
  };
}
function propertySetter(defaultValue, curKey) {
  return function(newValue) {
    if (this.properties["" + curKey] !== newValue) {
      var oldVal = Object.prototype.hasOwnProperty.call(this.properties, curKey) ? this.properties["" + curKey] : defaultValue;
      this.saveChanges(curKey, newValue, oldVal);
      this.properties["" + curKey] = newValue;
    }
  };
}
function complexGetter(defaultValue, curKey, type) {
  return function() {
    return getObject(this, curKey, defaultValue, type);
  };
}
function complexSetter(defaultValue, curKey, type) {
  return function(newValue) {
    getObject(this, curKey, defaultValue, type).setProperties(newValue);
  };
}
function complexFactoryGetter(defaultValue, curKey, type) {
  return function() {
    var curType = type({});
    if (Object.prototype.hasOwnProperty.call(this.properties, curKey)) {
      return this.properties["" + curKey];
    } else {
      return getObject(this, curKey, defaultValue, curType);
    }
  };
}
function complexFactorySetter(defaultValue, curKey, type) {
  return function(newValue) {
    var curType = type(newValue, this);
    getObject(this, curKey, defaultValue, curType).setProperties(newValue);
  };
}
function complexArrayGetter(defaultValue, curKey, type) {
  return function() {
    var _this = this;
    if (!Object.prototype.hasOwnProperty.call(this.properties, curKey)) {
      var defCollection = getObjectArray(this, curKey, defaultValue, type, false);
      this.properties["" + curKey] = defCollection;
    }
    var ignore = this.controlParent !== void 0 && this.controlParent.ignoreCollectionWatch || this.ignoreCollectionWatch;
    if (!Object.prototype.hasOwnProperty.call(this.properties["" + curKey], "push") && !ignore) {
      ["push", "pop"].forEach(function(extendFunc) {
        var descriptor = {
          value: complexArrayDefinedCallback(extendFunc, curKey, type, _this.properties["" + curKey]).bind(_this),
          configurable: true
        };
        Object.defineProperty(_this.properties["" + curKey], extendFunc, descriptor);
      });
    }
    if (!Object.prototype.hasOwnProperty.call(this.properties["" + curKey], "isComplexArray")) {
      Object.defineProperty(this.properties["" + curKey], "isComplexArray", {
        value: true
      });
    }
    return this.properties["" + curKey];
  };
}
function complexArraySetter(defaultValue, curKey, type) {
  return function(newValue) {
    this.isComplexArraySetter = true;
    var oldValueCollection = getObjectArray(this, curKey, defaultValue, type, false);
    var newValCollection = getObjectArray(this, curKey, newValue, type, true);
    this.isComplexArraySetter = false;
    this.saveChanges(curKey, newValCollection, oldValueCollection);
    this.properties["" + curKey] = newValCollection;
  };
}
function complexArrayFactorySetter(defaultValue, curKey, type) {
  return function(newValue) {
    var oldValueCollection = Object.prototype.hasOwnProperty.call(this.properties, curKey) ? this.properties["" + curKey] : defaultValue;
    var newValCollection = getObjectArray(this, curKey, newValue, type, true, true);
    this.saveChanges(curKey, newValCollection, oldValueCollection);
    this.properties["" + curKey] = newValCollection;
  };
}
function complexArrayFactoryGetter(defaultValue, curKey, type) {
  return function() {
    var curType = type({});
    if (!Object.prototype.hasOwnProperty.call(this.properties, curKey)) {
      var defCollection = getObjectArray(this, curKey, defaultValue, curType, false);
      this.properties["" + curKey] = defCollection;
    }
    return this.properties["" + curKey];
  };
}
function complexArrayDefinedCallback(dFunc, curKey, type, prop) {
  return function() {
    var newValue = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newValue[_i] = arguments[_i];
    }
    var keyString = this.propName ? this.getParentKey() + "." + curKey + "-" : curKey + "-";
    switch (dFunc) {
      case "push":
        for (var i = 0; i < newValue.length; i++) {
          var newValueParse = newValue[parseInt(i.toString(), 10)];
          Array.prototype["" + dFunc].apply(prop, [newValueParse]);
          var model = getArrayModel(keyString + (prop.length - 1), newValueParse, !this.controlParent, dFunc);
          this.serverDataBind(model, newValue[parseInt(i.toString(), 10)], false, dFunc);
        }
        break;
      case "pop": {
        Array.prototype["" + dFunc].apply(prop);
        var model = getArrayModel(keyString + prop.length, null, !this.controlParent, dFunc);
        this.serverDataBind(model, {
          ejsAction: "pop"
        }, false, dFunc);
        break;
      }
    }
    return prop;
  };
}
function getArrayModel(keyString, value, isControlParent, arrayFunction) {
  var modelObject = keyString;
  if (isControlParent) {
    modelObject = {};
    modelObject["" + keyString] = value;
    if (value && typeof value === "object") {
      var action = "ejsAction";
      modelObject["" + keyString]["" + action] = arrayFunction;
    }
  }
  return modelObject;
}
function Property(defaultValue) {
  return function(target, key) {
    var propertyDescriptor = {
      set: propertySetter(defaultValue, key),
      get: propertyGetter(defaultValue, key),
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(target, key, propertyDescriptor);
    addPropertyCollection(target, key, "prop", defaultValue);
  };
}
function Complex(defaultValue, type) {
  return function(target, key) {
    var propertyDescriptor = {
      set: complexSetter(defaultValue, key, type),
      get: complexGetter(defaultValue, key, type),
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(target, key, propertyDescriptor);
    addPropertyCollection(target, key, "complexProp", defaultValue, type);
  };
}
function ComplexFactory(type) {
  return function(target, key) {
    var propertyDescriptor = {
      set: complexFactorySetter({}, key, type),
      get: complexFactoryGetter({}, key, type),
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(target, key, propertyDescriptor);
    addPropertyCollection(target, key, "complexProp", {}, type);
  };
}
function Collection(defaultValue, type) {
  return function(target, key) {
    var propertyDescriptor = {
      set: complexArraySetter(defaultValue, key, type),
      get: complexArrayGetter(defaultValue, key, type),
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(target, key, propertyDescriptor);
    addPropertyCollection(target, key, "colProp", defaultValue, type);
  };
}
function CollectionFactory(type) {
  return function(target, key) {
    var propertyDescriptor = {
      set: complexArrayFactorySetter([], key, type),
      get: complexArrayFactoryGetter([], key, type),
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(target, key, propertyDescriptor);
    addPropertyCollection(target, key, "colProp", {}, type);
  };
}
function Event2() {
  return function(target, key) {
    var eventDescriptor = {
      set: function(newValue) {
        var oldValue = this.properties["" + key];
        if (oldValue !== newValue) {
          var finalContext = getParentContext(this, key);
          if (isUndefined(oldValue) === false) {
            finalContext.context.removeEventListener(finalContext.prefix, oldValue);
          }
          finalContext.context.addEventListener(finalContext.prefix, newValue);
          this.properties["" + key] = newValue;
        }
      },
      get: propertyGetter(void 0, key),
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(target, key, eventDescriptor);
    addPropertyCollection(target, key, "event");
  };
}
function NotifyPropertyChanges(classConstructor) {
}
function addPropertyCollection(target, key, propertyType, defaultValue, type) {
  if (isUndefined(target.propList)) {
    target.propList = {
      props: [],
      complexProps: [],
      colProps: [],
      events: [],
      propNames: [],
      complexPropNames: [],
      colPropNames: [],
      eventNames: []
    };
  }
  target.propList[propertyType + "s"].push({
    propertyName: key,
    defaultValue,
    type
  });
  target.propList[propertyType + "Names"].push(key);
}
function getBuilderProperties(component) {
  if (isUndefined(component.prototype.builderObject)) {
    component.prototype.builderObject = {
      properties: {},
      propCollections: [],
      add: function() {
        this.isPropertyArray = true;
        this.propCollections.push(extend({}, this.properties, {}));
      }
    };
    var rex = /complex/;
    for (var _i = 0, _a = Object.keys(component.prototype.propList); _i < _a.length; _i++) {
      var key = _a[_i];
      var _loop_1 = function(prop2) {
        if (rex.test(key)) {
          component.prototype.builderObject[prop2.propertyName] = function(value) {
            var childType = {};
            merge(childType, getBuilderProperties(prop2.type));
            value(childType);
            var tempValue;
            if (!childType.isPropertyArray) {
              tempValue = extend({}, childType.properties, {});
            } else {
              tempValue = childType.propCollections;
            }
            this.properties[prop2.propertyName] = tempValue;
            childType.properties = {};
            childType.propCollections = [];
            childType.isPropertyArray = false;
            return this;
          };
        } else {
          component.prototype.builderObject[prop2.propertyName] = function(value) {
            this.properties[prop2.propertyName] = value;
            return this;
          };
        }
      };
      for (var _b = 0, _c = component.prototype.propList["" + key]; _b < _c.length; _b++) {
        var prop = _c[_b];
        _loop_1(prop);
      }
    }
  }
  return component.prototype.builderObject;
}
function CreateBuilder(component) {
  var builderFunction = function(element) {
    this.element = element;
    return this;
  };
  var instanceFunction = function(element) {
    if (!Object.prototype.hasOwnProperty.call(builderFunction, "create")) {
      builderFunction.prototype = getBuilderProperties(component);
      builderFunction.prototype.create = function() {
        var temp = extend({}, {}, this.properties);
        this.properties = {};
        return new component(temp, this.element);
      };
    }
    return new builderFunction(element);
  };
  return instanceFunction;
}
function getParentContext(context, prefix) {
  if (Object.prototype.hasOwnProperty.call(context, "parentObj") === false) {
    return {
      context,
      prefix
    };
  } else {
    var curText = getValue("propName", context);
    if (curText) {
      prefix = curText + "-" + prefix;
    }
    return getParentContext(getValue("parentObj", context), prefix);
  }
}

// node_modules/@syncfusion/ej2-base/src/animation.js
var __extends = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Animation = (
  /** @class */
  function(_super) {
    __extends(Animation2, _super);
    function Animation2(options) {
      var _this = _super.call(this, options, void 0) || this;
      _this.easing = {
        ease: "cubic-bezier(0.250, 0.100, 0.250, 1.000)",
        linear: "cubic-bezier(0.250, 0.250, 0.750, 0.750)",
        easeIn: "cubic-bezier(0.420, 0.000, 1.000, 1.000)",
        easeOut: "cubic-bezier(0.000, 0.000, 0.580, 1.000)",
        easeInOut: "cubic-bezier(0.420, 0.000, 0.580, 1.000)",
        elasticInOut: "cubic-bezier(0.5,-0.58,0.38,1.81)",
        elasticIn: "cubic-bezier(0.17,0.67,0.59,1.81)",
        elasticOut: "cubic-bezier(0.7,-0.75,0.99,1.01)"
      };
      return _this;
    }
    Animation_1 = Animation2;
    Animation2.prototype.animate = function(element, options) {
      options = !options ? {} : options;
      var model = this.getModel(options);
      if (typeof element === "string") {
        var elements = Array.prototype.slice.call(selectAll(element, document));
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
          var element_1 = elements_1[_i];
          model.element = element_1;
          Animation_1.delayAnimation(model);
        }
      } else {
        model.element = element;
        Animation_1.delayAnimation(model);
      }
    };
    Animation2.stop = function(element, model) {
      element.style.animation = "";
      element.removeAttribute("e-animate");
      var animationId = element.getAttribute("e-animation-id");
      if (animationId) {
        var frameId = parseInt(animationId, 10);
        cancelAnimationFrame(frameId);
        element.removeAttribute("e-animation-id");
      }
      if (model && model.end) {
        model.end.call(this, model);
      }
    };
    Animation2.delayAnimation = function(model) {
      if (animationMode === "Disable" || animationMode === GlobalAnimationMode.Disable) {
        if (model.begin) {
          model.begin.call(this, model);
        }
        if (model.end) {
          model.end.call(this, model);
        }
      } else {
        if (model.delay) {
          setTimeout(function() {
            Animation_1.applyAnimation(model);
          }, model.delay);
        } else {
          Animation_1.applyAnimation(model);
        }
      }
    };
    Animation2.applyAnimation = function(model) {
      var _this = this;
      model.timeStamp = 0;
      var step = 0;
      var timerId = 0;
      var prevTimeStamp = 0;
      var duration = model.duration;
      model.element.setAttribute("e-animate", "true");
      var startAnimation = function(timeStamp) {
        try {
          if (timeStamp) {
            prevTimeStamp = prevTimeStamp === 0 ? timeStamp : prevTimeStamp;
            model.timeStamp = timeStamp + model.timeStamp - prevTimeStamp;
            prevTimeStamp = timeStamp;
            if (!step && model.begin) {
              model.begin.call(_this, model);
            }
            step = step + 1;
            var avg = model.timeStamp / step;
            if (model.timeStamp < duration && model.timeStamp + avg < duration && model.element.getAttribute("e-animate")) {
              model.element.style.animation = model.name + " " + model.duration + "ms " + model.timingFunction;
              if (model.progress) {
                model.progress.call(_this, model);
              }
              requestAnimationFrame(startAnimation);
            } else {
              cancelAnimationFrame(timerId);
              model.element.removeAttribute("e-animation-id");
              model.element.removeAttribute("e-animate");
              model.element.style.animation = "";
              if (model.end) {
                model.end.call(_this, model);
              }
            }
          } else {
            timerId = requestAnimationFrame(startAnimation);
            model.element.setAttribute("e-animation-id", timerId.toString());
          }
        } catch (e) {
          cancelAnimationFrame(timerId);
          model.element.removeAttribute("e-animation-id");
          if (model.fail) {
            model.fail.call(_this, e);
          }
        }
      };
      startAnimation();
    };
    Animation2.prototype.getModel = function(options) {
      return {
        name: options.name || this.name,
        delay: options.delay || this.delay,
        duration: options.duration !== void 0 ? options.duration : this.duration,
        begin: options.begin || this.begin,
        end: options.end || this.end,
        fail: options.fail || this.fail,
        progress: options.progress || this.progress,
        timingFunction: this.easing[options.timingFunction] ? this.easing[options.timingFunction] : options.timingFunction || this.easing[this.timingFunction]
      };
    };
    Animation2.prototype.onPropertyChanged = function(newProp, oldProp) {
    };
    Animation2.prototype.getModuleName = function() {
      return "animation";
    };
    Animation2.prototype.destroy = function() {
    };
    var Animation_1;
    __decorate([Property("FadeIn")], Animation2.prototype, "name", void 0);
    __decorate([Property(400)], Animation2.prototype, "duration", void 0);
    __decorate([Property("ease")], Animation2.prototype, "timingFunction", void 0);
    __decorate([Property(0)], Animation2.prototype, "delay", void 0);
    __decorate([Event2()], Animation2.prototype, "progress", void 0);
    __decorate([Event2()], Animation2.prototype, "begin", void 0);
    __decorate([Event2()], Animation2.prototype, "end", void 0);
    __decorate([Event2()], Animation2.prototype, "fail", void 0);
    Animation2 = Animation_1 = __decorate([NotifyPropertyChanges], Animation2);
    return Animation2;
  }(Base)
);
function rippleEffect(element, rippleOptions, done) {
  var rippleModel = getRippleModel(rippleOptions);
  if (rippleModel.rippleFlag === false || rippleModel.rippleFlag === void 0 && !isRippleEnabled) {
    return function() {
    };
  }
  element.setAttribute("data-ripple", "true");
  EventHandler.add(element, "mousedown", rippleHandler, {
    parent: element,
    rippleOptions: rippleModel
  });
  EventHandler.add(element, "mouseup", rippleUpHandler, {
    parent: element,
    rippleOptions: rippleModel,
    done
  });
  EventHandler.add(element, "mouseleave", rippleLeaveHandler, {
    parent: element,
    rippleOptions: rippleModel
  });
  if (Browser.isPointer) {
    EventHandler.add(element, "transitionend", rippleLeaveHandler, {
      parent: element,
      rippleOptions: rippleModel
    });
  }
  return function() {
    element.removeAttribute("data-ripple");
    EventHandler.remove(element, "mousedown", rippleHandler);
    EventHandler.remove(element, "mouseup", rippleUpHandler);
    EventHandler.remove(element, "mouseleave", rippleLeaveHandler);
    EventHandler.remove(element, "transitionend", rippleLeaveHandler);
  };
}
function getRippleModel(rippleOptions) {
  var rippleModel = {
    selector: rippleOptions && rippleOptions.selector ? rippleOptions.selector : null,
    ignore: rippleOptions && rippleOptions.ignore ? rippleOptions.ignore : null,
    rippleFlag: rippleOptions && rippleOptions.rippleFlag,
    isCenterRipple: rippleOptions && rippleOptions.isCenterRipple,
    duration: rippleOptions && rippleOptions.duration ? rippleOptions.duration : 350
  };
  return rippleModel;
}
function rippleHandler(e) {
  var target = e.target;
  var selector = this.rippleOptions.selector;
  var element = selector ? closest(target, selector) : target;
  if (!element || this.rippleOptions && closest(target, this.rippleOptions.ignore)) {
    return;
  }
  var offset = element.getBoundingClientRect();
  var offsetX = e.pageX - document.body.scrollLeft;
  var offsetY = e.pageY - (!document.body.scrollTop && document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop);
  var pageX = Math.max(Math.abs(offsetX - offset.left), Math.abs(offsetX - offset.right));
  var pageY = Math.max(Math.abs(offsetY - offset.top), Math.abs(offsetY - offset.bottom));
  var radius = Math.sqrt(pageX * pageX + pageY * pageY);
  var diameter = radius * 2 + "px";
  var x = offsetX - offset.left - radius;
  var y = offsetY - offset.top - radius;
  if (this.rippleOptions && this.rippleOptions.isCenterRipple) {
    x = 0;
    y = 0;
    diameter = "100%";
  }
  element.classList.add("e-ripple");
  var duration = this.rippleOptions.duration.toString();
  var styles = "width: " + diameter + ";height: " + diameter + ";left: " + x + "px;top: " + y + "px;transition-duration: " + duration + "ms;";
  var rippleElement = createElement("div", {
    className: "e-ripple-element",
    styles
  });
  element.appendChild(rippleElement);
  window.getComputedStyle(rippleElement).getPropertyValue("opacity");
  rippleElement.style.transform = "scale(1)";
  if (element !== this.parent) {
    EventHandler.add(element, "mouseleave", rippleLeaveHandler, {
      parent: this.parent,
      rippleOptions: this.rippleOptions
    });
  }
}
function rippleUpHandler(e) {
  removeRipple(e, this);
}
function rippleLeaveHandler(e) {
  removeRipple(e, this);
}
function removeRipple(e, eventArgs) {
  var duration = eventArgs.rippleOptions.duration;
  var target = e.target;
  var selector = eventArgs.rippleOptions.selector;
  var element = selector ? closest(target, selector) : target;
  if (!element || element && element.className.indexOf("e-ripple") === -1) {
    return;
  }
  var rippleElements = selectAll(".e-ripple-element", element);
  var rippleElement = rippleElements[rippleElements.length - 1];
  if (rippleElement) {
    rippleElement.style.opacity = "0.5";
  }
  if (eventArgs.parent !== element) {
    EventHandler.remove(element, "mouseleave", rippleLeaveHandler);
  }
  setTimeout(function() {
    if (rippleElement && rippleElement.parentNode) {
      rippleElement.parentNode.removeChild(rippleElement);
    }
    if (!element.getElementsByClassName("e-ripple-element").length) {
      element.classList.remove("e-ripple");
    }
    if (eventArgs.done) {
      eventArgs.done(e);
    }
  }, duration);
}
var isRippleEnabled = false;
function enableRipple(isRipple) {
  isRippleEnabled = isRipple;
  return isRippleEnabled;
}
var animationMode;
function setGlobalAnimation(value) {
  animationMode = value;
}
var GlobalAnimationMode;
(function(GlobalAnimationMode2) {
  GlobalAnimationMode2["Default"] = "Default";
  GlobalAnimationMode2["Enable"] = "Enable";
  GlobalAnimationMode2["Disable"] = "Disable";
})(GlobalAnimationMode || (GlobalAnimationMode = {}));

// node_modules/@syncfusion/ej2-base/src/module-loader.js
var MODULE_SUFFIX = "Module";
var ModuleLoader = (
  /** @class */
  function() {
    function ModuleLoader2(parent) {
      this.loadedModules = [];
      this.parent = parent;
    }
    ModuleLoader2.prototype.inject = function(requiredModules, moduleList) {
      var reqLength = requiredModules.length;
      if (reqLength === 0) {
        this.clean();
        return;
      }
      if (this.loadedModules.length) {
        this.clearUnusedModule(requiredModules);
      }
      for (var i = 0; i < reqLength; i++) {
        var modl = requiredModules[parseInt(i.toString(), 10)];
        for (var _i = 0, moduleList_1 = moduleList; _i < moduleList_1.length; _i++) {
          var module = moduleList_1[_i];
          var modName = modl.member;
          if (module && module.prototype.getModuleName() === modl.member && !this.isModuleLoaded(modName)) {
            var moduleObject = createInstance(module, modl.args);
            var memberName = this.getMemberName(modName);
            if (modl.isProperty) {
              setValue(memberName, module, this.parent);
            } else {
              setValue(memberName, moduleObject, this.parent);
            }
            var loadedModule = modl;
            loadedModule.member = memberName;
            this.loadedModules.push(loadedModule);
          }
        }
      }
    };
    ModuleLoader2.prototype.clean = function() {
      for (var _i = 0, _a = this.loadedModules; _i < _a.length; _i++) {
        var modules = _a[_i];
        if (!modules.isProperty) {
          getValue(modules.member, this.parent).destroy();
        }
      }
      this.loadedModules = [];
    };
    ModuleLoader2.prototype.getNonInjectedModules = function(requiredModules) {
      var _this = this;
      return requiredModules.filter(function(module) {
        return !_this.isModuleLoaded(module.member);
      });
    };
    ModuleLoader2.prototype.clearUnusedModule = function(moduleList) {
      var _this = this;
      var usedModules = moduleList.map(function(arg) {
        return _this.getMemberName(arg.member);
      });
      var removableModule = this.loadedModules.filter(function(module) {
        return usedModules.indexOf(module.member) === -1;
      });
      for (var _i = 0, removableModule_1 = removableModule; _i < removableModule_1.length; _i++) {
        var mod = removableModule_1[_i];
        if (!mod.isProperty) {
          getValue(mod.member, this.parent).destroy();
        }
        this.loadedModules.splice(this.loadedModules.indexOf(mod), 1);
        deleteObject(this.parent, mod.member);
      }
    };
    ModuleLoader2.prototype.getMemberName = function(name) {
      return name[0].toLowerCase() + name.substring(1) + MODULE_SUFFIX;
    };
    ModuleLoader2.prototype.isModuleLoaded = function(modName) {
      for (var _i = 0, _a = this.loadedModules; _i < _a.length; _i++) {
        var mod = _a[_i];
        if (mod.member === this.getMemberName(modName)) {
          return true;
        }
      }
      return false;
    };
    return ModuleLoader2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/child-property.js
var ChildProperty = (
  /** @class */
  function() {
    function ChildProperty2(parent, propName, defaultValue, isArray) {
      this.isComplexArraySetter = false;
      this.properties = {};
      this.changedProperties = {};
      this.childChangedProperties = {};
      this.oldProperties = {};
      this.finalUpdate = function() {
      };
      this.callChildDataBind = getValue("callChildDataBind", Base);
      this.parentObj = parent;
      this.controlParent = this.parentObj.controlParent || this.parentObj;
      this.propName = propName;
      this.isParentArray = isArray;
      this.setProperties(defaultValue, true);
    }
    ChildProperty2.prototype.updateChange = function(val, propName) {
      if (val === true) {
        this.parentObj.childChangedProperties["" + propName] = val;
      } else {
        delete this.parentObj.childChangedProperties["" + propName];
      }
      if (this.parentObj.updateChange) {
        this.parentObj.updateChange(val, this.parentObj.propName);
      }
    };
    ChildProperty2.prototype.updateTimeOut = function() {
      if (this.parentObj.updateTimeOut) {
        this.parentObj.finalUpdate();
        this.parentObj.updateTimeOut();
      } else {
        var changeTime_1 = setTimeout(this.parentObj.dataBind.bind(this.parentObj));
        var clearUpdate = function() {
          clearTimeout(changeTime_1);
        };
        this.finalUpdate = clearUpdate;
      }
    };
    ChildProperty2.prototype.clearChanges = function() {
      this.finalUpdate();
      this.updateChange(false, this.propName);
      this.oldProperties = {};
      this.changedProperties = {};
    };
    ChildProperty2.prototype.setProperties = function(prop, muteOnChange) {
      if (muteOnChange === true) {
        merge(this, prop);
        this.updateChange(false, this.propName);
        this.clearChanges();
      } else {
        merge(this, prop);
      }
    };
    ChildProperty2.prototype.dataBind = function() {
      this.callChildDataBind(this.childChangedProperties, this);
      if (this.isParentArray) {
        var curIndex = this.parentObj[this.propName].indexOf(this);
        if (Object.keys(this.changedProperties).length) {
          setValue(this.propName + "." + curIndex, this.changedProperties, this.parentObj.changedProperties);
          setValue(this.propName + "." + curIndex, this.oldProperties, this.parentObj.oldProperties);
        }
      } else {
        this.parentObj.changedProperties[this.propName] = this.changedProperties;
        this.parentObj.oldProperties[this.propName] = this.oldProperties;
      }
      this.clearChanges();
    };
    ChildProperty2.prototype.saveChanges = function(key, newValue, oldValue, restrictServerDataBind) {
      if (this.controlParent.isProtectedOnChange) {
        return;
      }
      if (!restrictServerDataBind) {
        this.serverDataBind(key, newValue, true);
      }
      this.oldProperties["" + key] = oldValue;
      this.changedProperties["" + key] = newValue;
      this.updateChange(true, this.propName);
      this.finalUpdate();
      this.updateTimeOut();
    };
    ChildProperty2.prototype.serverDataBind = function(key, value, isSaveChanges, action) {
      if (isBlazor() && !this.parentObj.isComplexArraySetter) {
        var parent_1;
        var newChanges = {};
        var parentKey = isSaveChanges ? this.getParentKey(true) + "." + key : key;
        if (parentKey.indexOf(".") !== -1) {
          var complexKeys = parentKey.split(".");
          parent_1 = newChanges;
          for (var i = 0; i < complexKeys.length; i++) {
            var isFinal = i === complexKeys.length - 1;
            parent_1[complexKeys[parseInt(i.toString(), 10)]] = isFinal ? value : {};
            parent_1 = isFinal ? parent_1 : parent_1[complexKeys[parseInt(i.toString(), 10)]];
          }
        } else {
          newChanges["" + parentKey] = {};
          parent_1 = newChanges["" + parentKey];
          newChanges["" + parentKey]["" + key] = value;
        }
        if (this.isParentArray) {
          var actionProperty = "ejsAction";
          parent_1["" + actionProperty] = action ? action : "none";
        }
        this.controlParent.serverDataBind(newChanges);
      }
    };
    ChildProperty2.prototype.getParentKey = function(isSaveChanges) {
      var index = "";
      var propName = this.propName;
      if (this.isParentArray) {
        index = this.parentObj[this.propName].indexOf(this);
        var valueLength = this.parentObj[this.propName].length;
        valueLength = isSaveChanges ? valueLength : valueLength > 0 ? valueLength - 1 : 0;
        index = index !== -1 ? "-" + index : "-" + valueLength;
        propName = propName + index;
      }
      if (this.controlParent !== this.parentObj) {
        propName = this.parentObj.getParentKey() + "." + this.propName + index;
      }
      return propName;
    };
    return ChildProperty2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/hijri-parser.js
var HijriParser;
(function(HijriParser2) {
  var dateCorrection = [28607, 28636, 28665, 28695, 28724, 28754, 28783, 28813, 28843, 28872, 28901, 28931, 28960, 28990, 29019, 29049, 29078, 29108, 29137, 29167, 29196, 29226, 29255, 29285, 29315, 29345, 29375, 29404, 29434, 29463, 29492, 29522, 29551, 29580, 29610, 29640, 29669, 29699, 29729, 29759, 29788, 29818, 29847, 29876, 29906, 29935, 29964, 29994, 30023, 30053, 30082, 30112, 30141, 30171, 30200, 30230, 30259, 30289, 30318, 30348, 30378, 30408, 30437, 30467, 30496, 30526, 30555, 30585, 30614, 30644, 30673, 30703, 30732, 30762, 30791, 30821, 30850, 30880, 30909, 30939, 30968, 30998, 31027, 31057, 31086, 31116, 31145, 31175, 31204, 31234, 31263, 31293, 31322, 31352, 31381, 31411, 31441, 31471, 31500, 31530, 31559, 31589, 31618, 31648, 31676, 31706, 31736, 31766, 31795, 31825, 31854, 31884, 31913, 31943, 31972, 32002, 32031, 32061, 32090, 32120, 32150, 32180, 32209, 32239, 32268, 32298, 32327, 32357, 32386, 32416, 32445, 32475, 32504, 32534, 32563, 32593, 32622, 32652, 32681, 32711, 32740, 32770, 32799, 32829, 32858, 32888, 32917, 32947, 32976, 33006, 33035, 33065, 33094, 33124, 33153, 33183, 33213, 33243, 33272, 33302, 33331, 33361, 33390, 33420, 33450, 33479, 33509, 33539, 33568, 33598, 33627, 33657, 33686, 33716, 33745, 33775, 33804, 33834, 33863, 33893, 33922, 33952, 33981, 34011, 34040, 34069, 34099, 34128, 34158, 34187, 34217, 34247, 34277, 34306, 34336, 34365, 34395, 34424, 34454, 34483, 34512, 34542, 34571, 34601, 34631, 34660, 34690, 34719, 34749, 34778, 34808, 34837, 34867, 34896, 34926, 34955, 34985, 35015, 35044, 35074, 35103, 35133, 35162, 35192, 35222, 35251, 35280, 35310, 35340, 35370, 35399, 35429, 35458, 35488, 35517, 35547, 35576, 35605, 35635, 35665, 35694, 35723, 35753, 35782, 35811, 35841, 35871, 35901, 35930, 35960, 35989, 36019, 36048, 36078, 36107, 36136, 36166, 36195, 36225, 36254, 36284, 36314, 36343, 36373, 36403, 36433, 36462, 36492, 36521, 36551, 36580, 36610, 36639, 36669, 36698, 36728, 36757, 36786, 36816, 36845, 36875, 36904, 36934, 36963, 36993, 37022, 37052, 37081, 37111, 37141, 37170, 37200, 37229, 37259, 37288, 37318, 37347, 37377, 37406, 37436, 37465, 37495, 37524, 37554, 37584, 37613, 37643, 37672, 37701, 37731, 37760, 37790, 37819, 37849, 37878, 37908, 37938, 37967, 37997, 38027, 38056, 38085, 38115, 38144, 38174, 38203, 38233, 38262, 38292, 38322, 38351, 38381, 38410, 38440, 38469, 38499, 38528, 38558, 38587, 38617, 38646, 38676, 38705, 38735, 38764, 38794, 38823, 38853, 38882, 38912, 38941, 38971, 39001, 39030, 39059, 39089, 39118, 39148, 39178, 39208, 39237, 39267, 39297, 39326, 39355, 39385, 39414, 39444, 39473, 39503, 39532, 39562, 39592, 39621, 39650, 39680, 39709, 39739, 39768, 39798, 39827, 39857, 39886, 39916, 39946, 39975, 40005, 40035, 40064, 40094, 40123, 40153, 40182, 40212, 40241, 40271, 40300, 40330, 40359, 40389, 40418, 40448, 40477, 40507, 40536, 40566, 40595, 40625, 40655, 40685, 40714, 40744, 40773, 40803, 40832, 40862, 40892, 40921, 40951, 40980, 41009, 41039, 41068, 41098, 41127, 41157, 41186, 41216, 41245, 41275, 41304, 41334, 41364, 41393, 41422, 41452, 41481, 41511, 41540, 41570, 41599, 41629, 41658, 41688, 41718, 41748, 41777, 41807, 41836, 41865, 41894, 41924, 41953, 41983, 42012, 42042, 42072, 42102, 42131, 42161, 42190, 42220, 42249, 42279, 42308, 42337, 42367, 42397, 42426, 42456, 42485, 42515, 42545, 42574, 42604, 42633, 42662, 42692, 42721, 42751, 42780, 42810, 42839, 42869, 42899, 42929, 42958, 42988, 43017, 43046, 43076, 43105, 43135, 43164, 43194, 43223, 43253, 43283, 43312, 43342, 43371, 43401, 43430, 43460, 43489, 43519, 43548, 43578, 43607, 43637, 43666, 43696, 43726, 43755, 43785, 43814, 43844, 43873, 43903, 43932, 43962, 43991, 44021, 44050, 44080, 44109, 44139, 44169, 44198, 44228, 44258, 44287, 44317, 44346, 44375, 44405, 44434, 44464, 44493, 44523, 44553, 44582, 44612, 44641, 44671, 44700, 44730, 44759, 44788, 44818, 44847, 44877, 44906, 44936, 44966, 44996, 45025, 45055, 45084, 45114, 45143, 45172, 45202, 45231, 45261, 45290, 45320, 45350, 45380, 45409, 45439, 45468, 45498, 45527, 45556, 45586, 45615, 45644, 45674, 45704, 45733, 45763, 45793, 45823, 45852, 45882, 45911, 45940, 45970, 45999, 46028, 46058, 46088, 46117, 46147, 46177, 46206, 46236, 46265, 46295, 46324, 46354, 46383, 46413, 46442, 46472, 46501, 46531, 46560, 46590, 46620, 46649, 46679, 46708, 46738, 46767, 46797, 46826, 46856, 46885, 46915, 46944, 46974, 47003, 47033, 47063, 47092, 47122, 47151, 47181, 47210, 47240, 47269, 47298, 47328, 47357, 47387, 47417, 47446, 47476, 47506, 47535, 47565, 47594, 47624, 47653, 47682, 47712, 47741, 47771, 47800, 47830, 47860, 47890, 47919, 47949, 47978, 48008, 48037, 48066, 48096, 48125, 48155, 48184, 48214, 48244, 48273, 48303, 48333, 48362, 48392, 48421, 48450, 48480, 48509, 48538, 48568, 48598, 48627, 48657, 48687, 48717, 48746, 48776, 48805, 48834, 48864, 48893, 48922, 48952, 48982, 49011, 49041, 49071, 49100, 49130, 49160, 49189, 49218, 49248, 49277, 49306, 49336, 49365, 49395, 49425, 49455, 49484, 49514, 49543, 49573, 49602, 49632, 49661, 49690, 49720, 49749, 49779, 49809, 49838, 49868, 49898, 49927, 49957, 49986, 50016, 50045, 50075, 50104, 50133, 50163, 50192, 50222, 50252, 50281, 50311, 50340, 50370, 50400, 50429, 50459, 50488, 50518, 50547, 50576, 50606, 50635, 50665, 50694, 50724, 50754, 50784, 50813, 50843, 50872, 50902, 50931, 50960, 50990, 51019, 51049, 51078, 51108, 51138, 51167, 51197, 51227, 51256, 51286, 51315, 51345, 51374, 51403, 51433, 51462, 51492, 51522, 51552, 51582, 51611, 51641, 51670, 51699, 51729, 51758, 51787, 51816, 51846, 51876, 51906, 51936, 51965, 51995, 52025, 52054, 52083, 52113, 52142, 52171, 52200, 52230, 52260, 52290, 52319, 52349, 52379, 52408, 52438, 52467, 52497, 52526, 52555, 52585, 52614, 52644, 52673, 52703, 52733, 52762, 52792, 52822, 52851, 52881, 52910, 52939, 52969, 52998, 53028, 53057, 53087, 53116, 53146, 53176, 53205, 53235, 53264, 53294, 53324, 53353, 53383, 53412, 53441, 53471, 53500, 53530, 53559, 53589, 53619, 53648, 53678, 53708, 53737, 53767, 53796, 53825, 53855, 53884, 53913, 53943, 53973, 54003, 54032, 54062, 54092, 54121, 54151, 54180, 54209, 54239, 54268, 54297, 54327, 54357, 54387, 54416, 54446, 54476, 54505, 54535, 54564, 54593, 54623, 54652, 54681, 54711, 54741, 54770, 54800, 54830, 54859, 54889, 54919, 54948, 54977, 55007, 55036, 55066, 55095, 55125, 55154, 55184, 55213, 55243, 55273, 55302, 55332, 55361, 55391, 55420, 55450, 55479, 55508, 55538, 55567, 55597, 55627, 55657, 55686, 55716, 55745, 55775, 55804, 55834, 55863, 55892, 55922, 55951, 55981, 56011, 56040, 56070, 56100, 56129, 56159, 56188, 56218, 56247, 56276, 56306, 56335, 56365, 56394, 56424, 56454, 56483, 56513, 56543, 56572, 56601, 56631, 56660, 56690, 56719, 56749, 56778, 56808, 56837, 56867, 56897, 56926, 56956, 56985, 57015, 57044, 57074, 57103, 57133, 57162, 57192, 57221, 57251, 57280, 57310, 57340, 57369, 57399, 57429, 57458, 57487, 57517, 57546, 57576, 57605, 57634, 57664, 57694, 57723, 57753, 57783, 57813, 57842, 57871, 57901, 57930, 57959, 57989, 58018, 58048, 58077, 58107, 58137, 58167, 58196, 58226, 58255, 58285, 58314, 58343, 58373, 58402, 58432, 58461, 58491, 58521, 58551, 58580, 58610, 58639, 58669, 58698, 58727, 58757, 58786, 58816, 58845, 58875, 58905, 58934, 58964, 58994, 59023, 59053, 59082, 59111, 59141, 59170, 59200, 59229, 59259, 59288, 59318, 59348, 59377, 59407, 59436, 59466, 59495, 59525, 59554, 59584, 59613, 59643, 59672, 59702, 59731, 59761, 59791, 59820, 59850, 59879, 59909, 59939, 59968, 59997, 60027, 60056, 60086, 60115, 60145, 60174, 60204, 60234, 60264, 60293, 60323, 60352, 60381, 60411, 60440, 60469, 60499, 60528, 60558, 60588, 60618, 60648, 60677, 60707, 60736, 60765, 60795, 60824, 60853, 60883, 60912, 60942, 60972, 61002, 61031, 61061, 61090, 61120, 61149, 61179, 61208, 61237, 61267, 61296, 61326, 61356, 61385, 61415, 61445, 61474, 61504, 61533, 61563, 61592, 61621, 61651, 61680, 61710, 61739, 61769, 61799, 61828, 61858, 61888, 61917, 61947, 61976, 62006, 62035, 62064, 62094, 62123, 62153, 62182, 62212, 62242, 62271, 62301, 62331, 62360, 62390, 62419, 62448, 62478, 62507, 62537, 62566, 62596, 62625, 62655, 62685, 62715, 62744, 62774, 62803, 62832, 62862, 62891, 62921, 62950, 62980, 63009, 63039, 63069, 63099, 63128, 63157, 63187, 63216, 63246, 63275, 63305, 63334, 63363, 63393, 63423, 63453, 63482, 63512, 63541, 63571, 63600, 63630, 63659, 63689, 63718, 63747, 63777, 63807, 63836, 63866, 63895, 63925, 63955, 63984, 64014, 64043, 64073, 64102, 64131, 64161, 64190, 64220, 64249, 64279, 64309, 64339, 64368, 64398, 64427, 64457, 64486, 64515, 64545, 64574, 64603, 64633, 64663, 64692, 64722, 64752, 64782, 64811, 64841, 64870, 64899, 64929, 64958, 64987, 65017, 65047, 65076, 65106, 65136, 65166, 65195, 65225, 65254, 65283, 65313, 65342, 65371, 65401, 65431, 65460, 65490, 65520, 65549, 65579, 65608, 65638, 65667, 65697, 65726, 65755, 65785, 65815, 65844, 65874, 65903, 65933, 65963, 65992, 66022, 66051, 66081, 66110, 66140, 66169, 66199, 66228, 66258, 66287, 66317, 66346, 66376, 66405, 66435, 66465, 66494, 66524, 66553, 66583, 66612, 66641, 66671, 66700, 66730, 66760, 66789, 66819, 66849, 66878, 66908, 66937, 66967, 66996, 67025, 67055, 67084, 67114, 67143, 67173, 67203, 67233, 67262, 67292, 67321, 67351, 67380, 67409, 67439, 67468, 67497, 67527, 67557, 67587, 67617, 67646, 67676, 67705, 67735, 67764, 67793, 67823, 67852, 67882, 67911, 67941, 67971, 68e3, 68030, 68060, 68089, 68119, 68148, 68177, 68207, 68236, 68266, 68295, 68325, 68354, 68384, 68414, 68443, 68473, 68502, 68532, 68561, 68591, 68620, 68650, 68679, 68708, 68738, 68768, 68797, 68827, 68857, 68886, 68916, 68946, 68975, 69004, 69034, 69063, 69092, 69122, 69152, 69181, 69211, 69240, 69270, 69300, 69330, 69359, 69388, 69418, 69447, 69476, 69506, 69535, 69565, 69595, 69624, 69654, 69684, 69713, 69743, 69772, 69802, 69831, 69861, 69890, 69919, 69949, 69978, 70008, 70038, 70067, 70097, 70126, 70156, 70186, 70215, 70245, 70274, 70303, 70333, 70362, 70392, 70421, 70451, 70481, 70510, 70540, 70570, 70599, 70629, 70658, 70687, 70717, 70746, 70776, 70805, 70835, 70864, 70894, 70924, 70954, 70983, 71013, 71042, 71071, 71101, 71130, 71159, 71189, 71218, 71248, 71278, 71308, 71337, 71367, 71397, 71426, 71455, 71485, 71514, 71543, 71573, 71602, 71632, 71662, 71691, 71721, 71751, 71781, 71810, 71839, 71869, 71898, 71927, 71957, 71986, 72016, 72046, 72075, 72105, 72135, 72164, 72194, 72223, 72253, 72282, 72311, 72341, 72370, 72400, 72429, 72459, 72489, 72518, 72548, 72577, 72607, 72637, 72666, 72695, 72725, 72754, 72784, 72813, 72843, 72872, 72902, 72931, 72961, 72991, 73020, 73050, 73080, 73109, 73139, 73168, 73197, 73227, 73256, 73286, 73315, 73345, 73375, 73404, 73434, 73464, 73493, 73523, 73552, 73581, 73611, 73640, 73669, 73699, 73729, 73758, 73788, 73818, 73848, 73877, 73907, 73936, 73965, 73995, 74024, 74053, 74083, 74113, 74142, 74172, 74202, 74231, 74261, 74291, 74320, 74349, 74379, 74408, 74437, 74467, 74497, 74526, 74556, 74586, 74615, 74645, 74675, 74704, 74733, 74763, 74792, 74822, 74851, 74881, 74910, 74940, 74969, 74999, 75029, 75058, 75088, 75117, 75147, 75176, 75206, 75235, 75264, 75294, 75323, 75353, 75383, 75412, 75442, 75472, 75501, 75531, 75560, 75590, 75619, 75648, 75678, 75707, 75737, 75766, 75796, 75826, 75856, 75885, 75915, 75944, 75974, 76003, 76032, 76062, 76091, 76121, 76150, 76180, 76210, 76239, 76269, 76299, 76328, 76358, 76387, 76416, 76446, 76475, 76505, 76534, 76564, 76593, 76623, 76653, 76682, 76712, 76741, 76771, 76801, 76830, 76859, 76889, 76918, 76948, 76977, 77007, 77036, 77066, 77096, 77125, 77155, 77185, 77214, 77243, 77273, 77302, 77332, 77361, 77390, 77420, 77450, 77479, 77509, 77539, 77569, 77598, 77627, 77657, 77686, 77715, 77745, 77774, 77804, 77833, 77863, 77893, 77923, 77952, 77982, 78011, 78041, 78070, 78099, 78129, 78158, 78188, 78217, 78247, 78277, 78307, 78336, 78366, 78395, 78425, 78454, 78483, 78513, 78542, 78572, 78601, 78631, 78661, 78690, 78720, 78750, 78779, 78808, 78838, 78867, 78897, 78926, 78956, 78985, 79015, 79044, 79074, 79104, 79133, 79163, 79192, 79222, 79251, 79281, 79310, 79340, 79369, 79399, 79428, 79458, 79487, 79517, 79546, 79576, 79606, 79635, 79665, 79695, 79724, 79753, 79783, 79812, 79841, 79871, 79900, 79930, 79960, 79990];
  function getHijriDate(gDate) {
    var day = gDate.getDate();
    var month2 = gDate.getMonth();
    var year = gDate.getFullYear();
    var tMonth = month2 + 1;
    var tYear = year;
    if (tMonth < 3) {
      tYear -= 1;
      tMonth += 12;
    }
    var yPrefix = Math.floor(tYear / 100);
    var julilanOffset = yPrefix - Math.floor(yPrefix / 4) - 2;
    var julianNumber = Math.floor(365.25 * (tYear + 4716)) + Math.floor(30.6001 * (tMonth + 1)) + day - julilanOffset - 1524;
    yPrefix = Math.floor((julianNumber - 186721625e-2) / 36524.25);
    julilanOffset = yPrefix - Math.floor(yPrefix / 4) + 1;
    var b = julianNumber + julilanOffset + 1524;
    var c = Math.floor((b - 122.1) / 365.25);
    var d = Math.floor(365.25 * c);
    var tempMonth = Math.floor((b - d) / 30.6001);
    day = b - d - Math.floor(30.6001 * tempMonth);
    month2 = Math.floor((b - d) / 20.6001);
    if (month2 > 13) {
      c += 1;
      month2 -= 12;
    }
    month2 -= 1;
    year = c - 4716;
    var modifiedJulianDate = julianNumber - 24e5;
    var iyear = 10631 / 30;
    var z = julianNumber - 1948084;
    var cyc = Math.floor(z / 10631);
    z = z - 10631 * cyc;
    var j = Math.floor((z - 0.1335) / iyear);
    var iy = 30 * cyc + j;
    z = z - Math.floor(j * iyear + 0.1335);
    var im = Math.floor((z + 28.5001) / 29.5);
    if (im === 13) {
      im = 12;
    }
    var tempDay = z - Math.floor(29.5001 * im - 29);
    var i = 0;
    for (; i < dateCorrection.length; i++) {
      if (dateCorrection[parseInt(i.toString(), 10)] > modifiedJulianDate) {
        break;
      }
    }
    var iln = i + 16260;
    var ii = Math.floor((iln - 1) / 12);
    var hYear = ii + 1;
    var hmonth = iln - 12 * ii;
    var hDate = modifiedJulianDate - dateCorrection[i - 1] + 1;
    if ((hDate + "").length > 2) {
      hDate = tempDay;
      hmonth = im;
      hYear = iy;
    }
    return {
      year: hYear,
      month: hmonth,
      date: hDate
    };
  }
  HijriParser2.getHijriDate = getHijriDate;
  function toGregorian(year, month2, day) {
    var iy = year;
    var im = month2;
    var id = day;
    var ii = iy - 1;
    var iln = ii * 12 + 1 + (im - 1);
    var i = iln - 16260;
    var mcjdn = id + dateCorrection[i - 1] - 1;
    var julianDate = mcjdn + 24e5;
    var z = Math.floor(julianDate + 0.5);
    var a = Math.floor((z - 186721625e-2) / 36524.25);
    a = z + 1 + a - Math.floor(a / 4);
    var b = a + 1524;
    var c = Math.floor((b - 122.1) / 365.25);
    var d = Math.floor(365.25 * c);
    var e = Math.floor((b - d) / 30.6001);
    var gDay = b - d - Math.floor(e * 30.6001);
    var gMonth = e - (e > 13.5 ? 13 : 1);
    var gYear = c - (gMonth > 2.5 ? 4716 : 4715);
    if (gYear <= 0) {
      gMonth--;
    }
    return /* @__PURE__ */ new Date(gYear + "/" + gMonth + "/" + gDay);
  }
  HijriParser2.toGregorian = toGregorian;
})(HijriParser || (HijriParser = {}));

// node_modules/@syncfusion/ej2-base/src/intl/date-formatter.js
var abbreviateRegexGlobal = /\/MMMMM|MMMM|MMM|a|LLLL|LLL|EEEEE|EEEE|E|K|cccc|ccc|WW|W|G+|z+/gi;
var standalone = "stand-alone";
var weekdayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var timeSetter = {
  m: "getMinutes",
  h: "getHours",
  H: "getHours",
  s: "getSeconds",
  d: "getDate",
  f: "getMilliseconds"
};
var datePartMatcher = {
  "M": "month",
  "d": "day",
  "E": "weekday",
  "c": "weekday",
  "y": "year",
  "m": "minute",
  "h": "hour",
  "H": "hour",
  "s": "second",
  "L": "month",
  "a": "designator",
  "z": "timeZone",
  "Z": "timeZone",
  "G": "era",
  "f": "milliseconds"
};
var timeSeparator = "timeSeparator";
var DateFormat2 = (
  /** @class */
  function() {
    function DateFormat3() {
    }
    DateFormat3.dateFormat = function(culture, option, cldr) {
      var _this = this;
      var dependable = IntlBase.getDependables(cldr, culture, option.calendar);
      var numObject = getValue("parserObject.numbers", dependable);
      var dateObject = dependable.dateObject;
      var formatOptions = {
        isIslamic: IntlBase.islamicRegex.test(option.calendar)
      };
      formatOptions.firstDayOfWeek = IntlBase.getWeekData(culture, cldr);
      if (isBlazor() && option.isServerRendered) {
        option = IntlBase.compareBlazorDateFormats(option, culture);
      }
      var resPattern = option.format || IntlBase.getResultantPattern(option.skeleton, dependable.dateObject, option.type, false, isBlazor() ? culture : "");
      formatOptions.dateSeperator = isBlazor() ? getValue("dateSeperator", dateObject) : IntlBase.getDateSeparator(dependable.dateObject);
      if (isUndefined(resPattern)) {
        throwError("Format options or type given must be invalid");
      } else {
        resPattern = IntlBase.ConvertDateToWeekFormat(resPattern);
        if (isBlazor()) {
          resPattern = resPattern.replace(/tt/, "a");
        }
        formatOptions.pattern = resPattern;
        formatOptions.numMapper = isBlazor() ? extend({}, numObject) : ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr));
        var patternMatch = resPattern.match(abbreviateRegexGlobal) || [];
        for (var _i = 0, patternMatch_1 = patternMatch; _i < patternMatch_1.length; _i++) {
          var str = patternMatch_1[_i];
          var len = str.length;
          var char = str[0];
          if (char === "K") {
            char = "h";
          }
          switch (char) {
            case "E":
            case "c":
              if (isBlazor()) {
                formatOptions.weekday = getValue("days." + IntlBase.monthIndex["" + len], dateObject);
              } else {
                formatOptions.weekday = dependable.dateObject["" + IntlBase.days]["" + standalone][IntlBase.monthIndex["" + len]];
              }
              break;
            case "M":
            case "L":
              if (isBlazor()) {
                formatOptions.month = getValue("months." + IntlBase.monthIndex["" + len], dateObject);
              } else {
                formatOptions.month = dependable.dateObject["" + IntlBase.month]["" + standalone][IntlBase.monthIndex["" + len]];
              }
              break;
            case "a":
              formatOptions.designator = isBlazor() ? getValue("dayPeriods", dateObject) : getValue("dayPeriods.format.wide", dateObject);
              break;
            case "G": {
              var eText = len <= 3 ? "eraAbbr" : len === 4 ? "eraNames" : "eraNarrow";
              formatOptions.era = isBlazor() ? getValue("eras", dateObject) : getValue("eras." + eText, dependable.dateObject);
              break;
            }
            case "z":
              formatOptions.timeZone = getValue("dates.timeZoneNames", dependable.parserObject);
              break;
          }
        }
      }
      return function(value) {
        if (isNaN(value.getDate())) {
          return null;
        }
        return _this.intDateFormatter(value, formatOptions);
      };
    };
    DateFormat3.intDateFormatter = function(value, options) {
      var pattern = options.pattern;
      var ret = "";
      var matches2 = pattern.match(IntlBase.dateParseRegex);
      var dObject = this.getCurrentDateValue(value, options.isIslamic);
      for (var _i = 0, matches_1 = matches2; _i < matches_1.length; _i++) {
        var match = matches_1[_i];
        var length_1 = match.length;
        var char = match[0];
        if (char === "K") {
          char = "h";
        }
        var curval = void 0;
        var curvalstr = "";
        var isNumber = void 0;
        var processNumber = void 0;
        var curstr = "";
        switch (char) {
          case "M":
          case "L":
            curval = dObject.month;
            if (length_1 > 2) {
              ret += options.month["" + curval];
            } else {
              isNumber = true;
            }
            break;
          case "E":
          case "c":
            ret += options.weekday["" + weekdayKey[value.getDay()]];
            break;
          case "H":
          case "h":
          case "m":
          case "s":
          case "d":
          case "f":
            isNumber = true;
            if (char === "d") {
              curval = dObject.date;
            } else if (char === "f") {
              isNumber = false;
              processNumber = true;
              curvalstr = value["" + timeSetter["" + char]]().toString();
              curvalstr = curvalstr.substring(0, length_1);
              var curlength = curvalstr.length;
              if (length_1 !== curlength) {
                if (length_1 > 3) {
                  continue;
                }
                for (var i = 0; i < length_1 - curlength; i++) {
                  curvalstr = "0" + curvalstr.toString();
                }
              }
              curstr += curvalstr;
            } else {
              curval = value["" + timeSetter["" + char]]();
            }
            if (char === "h") {
              curval = curval % 12 || 12;
            }
            break;
          case "y":
            processNumber = true;
            curstr += dObject.year;
            if (length_1 === 2) {
              curstr = curstr.substr(curstr.length - 2);
            }
            break;
          case "a": {
            var desig = value.getHours() < 12 ? "am" : "pm";
            ret += options.designator["" + desig];
            break;
          }
          case "G": {
            var dec = value.getFullYear() < 0 ? 0 : 1;
            var retu = options.era["" + dec];
            if (isNullOrUndefined(retu)) {
              retu = options.era[dec ? 0 : 1];
            }
            ret += retu || "";
            break;
          }
          case "'":
            ret += match === "''" ? "'" : match.replace(/'/g, "");
            break;
          case "z": {
            var timezone = value.getTimezoneOffset();
            var pattern_1 = length_1 < 4 ? "+H;-H" : options.timeZone.hourFormat;
            pattern_1 = pattern_1.replace(/:/g, options.numMapper.timeSeparator);
            if (timezone === 0) {
              ret += options.timeZone.gmtZeroFormat;
            } else {
              processNumber = true;
              curstr = this.getTimeZoneValue(timezone, pattern_1);
            }
            curstr = options.timeZone.gmtFormat.replace(/\{0\}/, curstr);
            break;
          }
          case ":":
            ret += options.numMapper.numberSymbols["" + timeSeparator];
            break;
          case "/":
            ret += options.dateSeperator;
            break;
          case "W":
            isNumber = true;
            curval = IntlBase.getWeekOfYear(value, options.firstDayOfWeek);
            break;
          default:
            ret += match;
        }
        if (isNumber) {
          processNumber = true;
          curstr = this.checkTwodigitNumber(curval, length_1);
        }
        if (processNumber) {
          ret += ParserBase.convertValueParts(curstr, IntlBase.latnParseRegex, options.numMapper.mapper);
        }
      }
      return ret;
    };
    DateFormat3.getCurrentDateValue = function(value, isIslamic) {
      if (isIslamic) {
        return HijriParser.getHijriDate(value);
      }
      return {
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        date: value.getDate()
      };
    };
    DateFormat3.checkTwodigitNumber = function(val, len) {
      var ret = val + "";
      if (len === 2 && ret.length !== 2) {
        return "0" + ret;
      }
      return ret;
    };
    DateFormat3.getTimeZoneValue = function(tVal, pattern) {
      var _this = this;
      var splt = pattern.split(";");
      var curPattern = splt[tVal > 0 ? 1 : 0];
      var no = Math.abs(tVal);
      return curPattern = curPattern.replace(/HH?|mm/g, function(str) {
        var len = str.length;
        var ishour = str.indexOf("H") !== -1;
        return _this.checkTwodigitNumber(Math.floor(ishour ? no / 60 : no % 60), len);
      });
    };
    return DateFormat3;
  }()
);
setDateFormat(DateFormat2);

// node_modules/@syncfusion/ej2-base/src/intl/number-formatter.js
var errorText = {
  "ms": "minimumSignificantDigits",
  "ls": "maximumSignificantDigits",
  "mf": "minimumFractionDigits",
  "lf": "maximumFractionDigits"
};
var percentSign = "percentSign";
var minusSign = "minusSign";
var mapper = ["infinity", "nan", "group", "decimal", "exponential"];
var NumberFormat2 = (
  /** @class */
  function() {
    function NumberFormat3() {
    }
    NumberFormat3.numberFormatter = function(culture, option, cldr) {
      var _this = this;
      var fOptions = extend({}, option);
      var cOptions = {};
      var dOptions = {};
      var symbolPattern;
      var dependable = IntlBase.getDependables(cldr, culture, "", true);
      var numObject = dependable.numericObject;
      dOptions.numberMapper = isBlazor() ? extend({}, numObject) : ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr), true);
      dOptions.currencySymbol = isBlazor() ? getValue("currencySymbol", numObject) : IntlBase.getCurrencySymbol(dependable.numericObject, fOptions.currency || defaultCurrencyCode, option.altSymbol, option.ignoreCurrency);
      dOptions.percentSymbol = isBlazor() ? getValue("numberSymbols.percentSign", numObject) : dOptions.numberMapper.numberSymbols["" + percentSign];
      dOptions.minusSymbol = isBlazor() ? getValue("numberSymbols.minusSign", numObject) : dOptions.numberMapper.numberSymbols["" + minusSign];
      var symbols = dOptions.numberMapper.numberSymbols;
      if (option.format && !IntlBase.formatRegex.test(option.format)) {
        cOptions = IntlBase.customFormat(option.format, dOptions, dependable.numericObject);
        if (!isUndefined(fOptions.useGrouping) && fOptions.useGrouping) {
          fOptions.useGrouping = cOptions.pData.useGrouping;
        }
      } else {
        extend(fOptions, IntlBase.getProperNumericSkeleton(option.format || "N"));
        fOptions.isCurrency = fOptions.type === "currency";
        fOptions.isPercent = fOptions.type === "percent";
        if (!isBlazor()) {
          symbolPattern = IntlBase.getSymbolPattern(fOptions.type, dOptions.numberMapper.numberSystem, dependable.numericObject, fOptions.isAccount);
        }
        fOptions.groupOne = this.checkValueRange(fOptions.maximumSignificantDigits, fOptions.minimumSignificantDigits, true);
        this.checkValueRange(fOptions.maximumFractionDigits, fOptions.minimumFractionDigits, false, true);
        if (!isUndefined(fOptions.fractionDigits)) {
          fOptions.minimumFractionDigits = fOptions.maximumFractionDigits = fOptions.fractionDigits;
        }
        if (isUndefined(fOptions.useGrouping)) {
          fOptions.useGrouping = true;
        }
        if (fOptions.isCurrency && !isBlazor()) {
          symbolPattern = symbolPattern.replace(/\u00A4/g, IntlBase.defaultCurrency);
        }
        if (!isBlazor()) {
          var split = symbolPattern.split(";");
          cOptions.nData = IntlBase.getFormatData(split[1] || "-" + split[0], true, dOptions.currencySymbol);
          cOptions.pData = IntlBase.getFormatData(split[0], false, dOptions.currencySymbol);
          if (fOptions.useGrouping) {
            fOptions.groupSeparator = symbols[mapper[2]];
            fOptions.groupData = this.getGroupingDetails(split[0]);
          }
        } else {
          cOptions.nData = extend({}, {}, getValue(fOptions.type + "nData", numObject));
          cOptions.pData = extend({}, {}, getValue(fOptions.type + "pData", numObject));
          if (fOptions.type === "currency" && option.currency) {
            IntlBase.replaceBlazorCurrency([cOptions.pData, cOptions.nData], dOptions.currencySymbol, option.currency);
          }
        }
        var minFrac = isUndefined(fOptions.minimumFractionDigits);
        if (minFrac) {
          fOptions.minimumFractionDigits = cOptions.nData.minimumFraction;
        }
        if (isUndefined(fOptions.maximumFractionDigits)) {
          var mval = cOptions.nData.maximumFraction;
          fOptions.maximumFractionDigits = isUndefined(mval) && fOptions.isPercent ? 0 : mval;
        }
        var mfrac = fOptions.minimumFractionDigits;
        var lfrac = fOptions.maximumFractionDigits;
        if (!isUndefined(mfrac) && !isUndefined(lfrac)) {
          if (mfrac > lfrac) {
            fOptions.maximumFractionDigits = mfrac;
          }
        }
      }
      extend(cOptions.nData, fOptions);
      extend(cOptions.pData, fOptions);
      return function(value) {
        if (isNaN(value)) {
          return symbols[mapper[1]];
        } else if (!isFinite(value)) {
          return symbols[mapper[0]];
        }
        return _this.intNumberFormatter(value, cOptions, dOptions, option);
      };
    };
    NumberFormat3.getGroupingDetails = function(pattern) {
      var ret = {};
      var match = pattern.match(IntlBase.negativeDataRegex);
      if (match && match[4]) {
        var pattern_1 = match[4];
        var p = pattern_1.lastIndexOf(",");
        if (p !== -1) {
          var temp = pattern_1.split(".")[0];
          ret.primary = temp.length - p - 1;
          var s = pattern_1.lastIndexOf(",", p - 1);
          if (s !== -1) {
            ret.secondary = p - 1 - s;
          }
        }
      }
      return ret;
    };
    NumberFormat3.checkValueRange = function(val1, val2, checkbothExist, isFraction) {
      var decide = isFraction ? "f" : "s";
      var dint = 0;
      var str1 = errorText["l" + decide];
      var str2 = errorText["m" + decide];
      if (!isUndefined(val1)) {
        this.checkRange(val1, str1, isFraction);
        dint++;
      }
      if (!isUndefined(val2)) {
        this.checkRange(val2, str2, isFraction);
        dint++;
      }
      if (dint === 2) {
        if (val1 < val2) {
          throwError(str2 + "specified must be less than the" + str1);
        } else {
          return true;
        }
      } else if (checkbothExist && dint === 1) {
        throwError("Both" + str2 + "and" + str2 + "must be present");
      }
      return false;
    };
    NumberFormat3.checkRange = function(val, text, isFraction) {
      var range = isFraction ? [0, 20] : [1, 21];
      if (val < range[0] || val > range[1]) {
        throwError(text + "value must be within the range" + range[0] + "to" + range[1]);
      }
    };
    NumberFormat3.intNumberFormatter = function(value, fOptions, dOptions, option) {
      var curData;
      if (isUndefined(fOptions.nData.type)) {
        return void 0;
      } else {
        if (value < 0) {
          value = value * -1;
          curData = fOptions.nData;
        } else if (value === 0) {
          curData = fOptions.zeroData || fOptions.pData;
        } else {
          curData = fOptions.pData;
        }
        var fValue = "";
        if (curData.isPercent) {
          value = value * 100;
        }
        if (curData.groupOne) {
          fValue = this.processSignificantDigits(value, curData.minimumSignificantDigits, curData.maximumSignificantDigits);
        } else {
          fValue = this.processFraction(value, curData.minimumFractionDigits, curData.maximumFractionDigits, option);
          if (curData.minimumIntegerDigits) {
            fValue = this.processMinimumIntegers(fValue, curData.minimumIntegerDigits);
          }
          if (dOptions.isCustomFormat && curData.minimumFractionDigits < curData.maximumFractionDigits && /\d+\.\d+/.test(fValue)) {
            var temp = fValue.split(".");
            var decimalPart = temp[1];
            var len = decimalPart.length;
            for (var i = len - 1; i >= 0; i--) {
              if (decimalPart[parseInt(i.toString(), 10)] === "0" && i >= curData.minimumFractionDigits) {
                decimalPart = decimalPart.slice(0, i);
              } else {
                break;
              }
            }
            fValue = temp[0] + "." + decimalPart;
          }
        }
        if (curData.type === "scientific") {
          fValue = value.toExponential(curData.maximumFractionDigits);
          fValue = fValue.replace("e", dOptions.numberMapper.numberSymbols[mapper[4]]);
        }
        fValue = fValue.replace(".", dOptions.numberMapper.numberSymbols[mapper[3]]);
        fValue = curData.format === "#,###,,;(#,###,,)" ? this.customPivotFormat(parseInt(fValue, 10)) : fValue;
        if (curData.useGrouping) {
          fValue = this.groupNumbers(fValue, curData.groupData.primary, curData.groupSeparator || ",", dOptions.numberMapper.numberSymbols[mapper[3]] || ".", curData.groupData.secondary);
        }
        fValue = ParserBase.convertValueParts(fValue, IntlBase.latnParseRegex, dOptions.numberMapper.mapper);
        if (curData.nlead === "N/A") {
          return curData.nlead;
        } else {
          if (fValue === "0" && option && option.format === "0") {
            return fValue + curData.nend;
          }
          return curData.nlead + fValue + curData.nend;
        }
      }
    };
    NumberFormat3.processSignificantDigits = function(value, min, max) {
      var temp = value + "";
      var tn;
      var length = temp.length;
      if (length < min) {
        return value.toPrecision(min);
      } else {
        temp = value.toPrecision(max);
        tn = +temp;
        return tn + "";
      }
    };
    NumberFormat3.groupNumbers = function(val, level1, sep, decimalSymbol, level2) {
      var flag = !isNullOrUndefined(level2) && level2 !== 0;
      var split = val.split(decimalSymbol);
      var prefix = split[0];
      var length = prefix.length;
      var str = "";
      while (length > level1) {
        str = prefix.slice(length - level1, length) + (str.length ? sep + str : "");
        length -= level1;
        if (flag) {
          level1 = level2;
          flag = false;
        }
      }
      split[0] = prefix.slice(0, length) + (str.length ? sep : "") + str;
      return split.join(decimalSymbol);
    };
    NumberFormat3.processFraction = function(value, min, max, option) {
      var temp = (value + "").split(".")[1];
      var length = temp ? temp.length : 0;
      if (min && length < min) {
        var ret = "";
        if (length === 0) {
          ret = value.toFixed(min);
        } else {
          ret += value;
          for (var j = 0; j < min - length; j++) {
            ret += "0";
          }
          return ret;
        }
        return value.toFixed(min);
      } else if (!isNullOrUndefined(max) && (length > max || max === 0)) {
        return value.toFixed(max);
      }
      var str = value + "";
      if (str[0] === "0" && option && option.format === "###.00") {
        str = str.slice(1);
      }
      return str;
    };
    NumberFormat3.processMinimumIntegers = function(value, min) {
      var temp = value.split(".");
      var lead = temp[0];
      var len = lead.length;
      if (len < min) {
        for (var i = 0; i < min - len; i++) {
          lead = "0" + lead;
        }
        temp[0] = lead;
      }
      return temp.join(".");
    };
    NumberFormat3.customPivotFormat = function(value) {
      if (value >= 5e5) {
        value /= 1e6;
        var _a = value.toString().split("."), integer = _a[0], decimal = _a[1];
        return decimal && +decimal.substring(0, 1) >= 5 ? Math.ceil(value).toString() : Math.floor(value).toString();
      }
      return "";
    };
    return NumberFormat3;
  }()
);
setNumberFormat(NumberFormat2);

// node_modules/@syncfusion/ej2-base/src/intl/date-parser.js
var standalone2 = "stand-alone";
var latnRegex = /^[0-9]*$/;
var timeSetter2 = {
  minute: "setMinutes",
  hour: "setHours",
  second: "setSeconds",
  day: "setDate",
  month: "setMonth",
  milliseconds: "setMilliseconds"
};
var month = "months";
var DateParser = (
  /** @class */
  function() {
    function DateParser2() {
    }
    DateParser2.dateParser = function(culture, option, cldr) {
      var _this = this;
      var dependable = IntlBase.getDependables(cldr, culture, option.calendar);
      var numOptions = ParserBase.getCurrentNumericOptions(dependable.parserObject, ParserBase.getNumberingSystem(cldr), false, isBlazor());
      var parseOptions = {};
      if (isBlazor() && option.isServerRendered) {
        option = IntlBase.compareBlazorDateFormats(option, culture);
      }
      var resPattern = option.format || IntlBase.getResultantPattern(option.skeleton, dependable.dateObject, option.type, false, isBlazor() ? culture : "");
      var regexString = "";
      var hourOnly;
      if (isUndefined(resPattern)) {
        throwError("Format options or type given must be invalid");
      } else {
        resPattern = IntlBase.ConvertDateToWeekFormat(resPattern);
        parseOptions = {
          isIslamic: IntlBase.islamicRegex.test(option.calendar),
          pattern: resPattern,
          evalposition: {},
          culture
        };
        var patternMatch = resPattern.match(IntlBase.dateParseRegex) || [];
        var length_1 = patternMatch.length;
        var gmtCorrection = 0;
        var zCorrectTemp = 0;
        var isgmtTraversed = false;
        var nRegx = numOptions.numericRegex;
        var numMapper = isBlazor() ? dependable.parserObject.numbers : ParserBase.getNumberMapper(dependable.parserObject, ParserBase.getNumberingSystem(cldr));
        for (var i = 0; i < length_1; i++) {
          var str = patternMatch[parseInt(i.toString(), 10)];
          var len = str.length;
          var char = str[0] === "K" ? "h" : str[0];
          var isNumber = void 0;
          var canUpdate = void 0;
          var charKey = datePartMatcher["" + char];
          var optional = len === 2 ? "" : "?";
          if (isgmtTraversed) {
            gmtCorrection = zCorrectTemp;
            isgmtTraversed = false;
          }
          switch (char) {
            case "E":
            case "c": {
              var weekData = void 0;
              if (isBlazor()) {
                weekData = getValue("days." + IntlBase.monthIndex["" + len], dependable.dateObject);
              } else {
                weekData = dependable.dateObject["" + IntlBase.days]["" + standalone2][IntlBase.monthIndex["" + len]];
              }
              var weekObject = ParserBase.reverseObject(weekData);
              regexString += "(" + Object.keys(weekObject).join("|") + ")";
              break;
            }
            case "M":
            case "L":
            case "d":
            case "m":
            case "s":
            case "h":
            case "H":
            case "f":
              canUpdate = true;
              if ((char === "M" || char === "L") && len > 2) {
                var monthData = void 0;
                if (isBlazor()) {
                  monthData = getValue("months." + IntlBase.monthIndex["" + len], dependable.dateObject);
                } else {
                  monthData = dependable.dateObject["" + month]["" + standalone2][IntlBase.monthIndex["" + len]];
                }
                parseOptions["" + charKey] = ParserBase.reverseObject(monthData);
                regexString += "(" + Object.keys(parseOptions["" + charKey]).join("|") + ")";
              } else if (char === "f") {
                if (len > 3) {
                  continue;
                }
                isNumber = true;
                regexString += "(" + nRegx + nRegx + "?" + nRegx + "?)";
              } else {
                isNumber = true;
                regexString += "(" + nRegx + nRegx + optional + ")";
              }
              if (char === "h") {
                parseOptions.hour12 = true;
              }
              break;
            case "W": {
              var opt = len === 1 ? "?" : "";
              regexString += "(" + nRegx + opt + nRegx + ")";
              break;
            }
            case "y":
              canUpdate = isNumber = true;
              if (len === 2) {
                regexString += "(" + nRegx + nRegx + ")";
              } else {
                regexString += "(" + nRegx + "{" + len + ",})";
              }
              break;
            case "a": {
              canUpdate = true;
              var periodValur = isBlazor() ? getValue("dayPeriods", dependable.dateObject) : getValue("dayPeriods.format.wide", dependable.dateObject);
              parseOptions["" + charKey] = ParserBase.reverseObject(periodValur);
              regexString += "(" + Object.keys(parseOptions["" + charKey]).join("|") + ")";
              break;
            }
            case "G": {
              canUpdate = true;
              var eText = len <= 3 ? "eraAbbr" : len === 4 ? "eraNames" : "eraNarrow";
              parseOptions["" + charKey] = ParserBase.reverseObject(isBlazor() ? getValue("eras", dependable.dateObject) : getValue("eras." + eText, dependable.dateObject));
              regexString += "(" + Object.keys(parseOptions["" + charKey]).join("|") + "?)";
              break;
            }
            case "z": {
              var tval = (/* @__PURE__ */ new Date()).getTimezoneOffset();
              canUpdate = tval !== 0;
              parseOptions["" + charKey] = getValue("dates.timeZoneNames", dependable.parserObject);
              var tzone = parseOptions["" + charKey];
              hourOnly = len < 4;
              var hpattern = hourOnly ? "+H;-H" : tzone.hourFormat;
              hpattern = hpattern.replace(/:/g, numMapper.timeSeparator);
              regexString += "(" + this.parseTimeZoneRegx(hpattern, tzone, nRegx) + ")?";
              isgmtTraversed = true;
              zCorrectTemp = hourOnly ? 6 : 12;
              break;
            }
            case "'": {
              var iString = str.replace(/'/g, "");
              regexString += "(" + iString + ")?";
              break;
            }
            default:
              regexString += "([\\D])";
              break;
          }
          if (canUpdate) {
            parseOptions.evalposition["" + charKey] = {
              isNumber,
              pos: i + 1 + gmtCorrection,
              hourOnly
            };
          }
          if (i === length_1 - 1 && !isNullOrUndefined(regexString)) {
            var regExp3 = RegExp;
            parseOptions.parserRegex = new regExp3("^" + regexString + "$", "i");
          }
        }
      }
      return function(value) {
        var parsedDateParts = _this.internalDateParse(value, parseOptions, numOptions);
        if (isNullOrUndefined(parsedDateParts) || !Object.keys(parsedDateParts).length) {
          return null;
        }
        if (parseOptions.isIslamic) {
          var dobj = {};
          var tYear = parsedDateParts.year;
          var tDate = parsedDateParts.day;
          var tMonth = parsedDateParts.month;
          var ystrig = tYear ? tYear + "" : "";
          var is2DigitYear = ystrig.length === 2;
          if (!tYear || !tMonth || !tDate || is2DigitYear) {
            dobj = HijriParser.getHijriDate(/* @__PURE__ */ new Date());
          }
          if (is2DigitYear) {
            tYear = parseInt((dobj.year + "").slice(0, 2) + ystrig, 10);
          }
          var dateObject = HijriParser.toGregorian(tYear || dobj.year, tMonth || dobj.month, tDate || dobj.date);
          parsedDateParts.year = dateObject.getFullYear();
          parsedDateParts.month = dateObject.getMonth() + 1;
          parsedDateParts.day = dateObject.getDate();
        }
        return _this.getDateObject(parsedDateParts);
      };
    };
    DateParser2.getDateObject = function(options, value) {
      var res = value || /* @__PURE__ */ new Date();
      res.setMilliseconds(0);
      var tKeys = ["hour", "minute", "second", "milliseconds", "month", "day"];
      var y = options.year;
      var desig = options.designator;
      var tzone = options.timeZone;
      if (!isUndefined(y)) {
        var len = (y + "").length;
        if (len <= 2) {
          var century = Math.floor(res.getFullYear() / 100) * 100;
          y += century;
        }
        res.setFullYear(y);
      }
      for (var _i = 0, tKeys_1 = tKeys; _i < tKeys_1.length; _i++) {
        var key = tKeys_1[_i];
        var tValue = options["" + key];
        if (isUndefined(tValue) && key === "day") {
          res.setDate(1);
        }
        if (!isUndefined(tValue)) {
          if (key === "month") {
            tValue -= 1;
            if (tValue < 0 || tValue > 11) {
              return /* @__PURE__ */ new Date("invalid");
            }
            var pDate = res.getDate();
            res.setDate(1);
            res[timeSetter2["" + key]](tValue);
            var lDate = new Date(res.getFullYear(), tValue + 1, 0).getDate();
            res.setDate(pDate < lDate ? pDate : lDate);
          } else {
            if (key === "day") {
              var lastDay = new Date(res.getFullYear(), res.getMonth() + 1, 0).getDate();
              if (tValue < 1 || tValue > lastDay) {
                return null;
              }
            }
            res["" + timeSetter2["" + key]](tValue);
          }
        }
      }
      if (!isUndefined(desig)) {
        var hour = res.getHours();
        if (desig === "pm") {
          res.setHours(hour + (hour === 12 ? 0 : 12));
        } else if (hour === 12) {
          res.setHours(0);
        }
      }
      if (!isUndefined(tzone)) {
        var tzValue = tzone - res.getTimezoneOffset();
        if (tzValue !== 0) {
          res.setMinutes(res.getMinutes() + tzValue);
        }
      }
      return res;
    };
    DateParser2.internalDateParse = function(value, parseOptions, num) {
      var matches2 = value.match(parseOptions.parserRegex);
      var retOptions = {
        "hour": 0,
        "minute": 0,
        "second": 0
      };
      if (isNullOrUndefined(matches2)) {
        return null;
      } else {
        var props = Object.keys(parseOptions.evalposition);
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
          var prop = props_1[_i];
          var curObject = parseOptions.evalposition["" + prop];
          var matchString = matches2[curObject.pos];
          if (curObject.isNumber) {
            retOptions["" + prop] = this.internalNumberParser(matchString, num);
          } else {
            if (prop === "timeZone" && !isUndefined(matchString)) {
              var pos = curObject.pos;
              var val = void 0;
              var tmatch = matches2[pos + 1];
              var flag = !isUndefined(tmatch);
              if (curObject.hourOnly) {
                val = this.getZoneValue(flag, tmatch, matches2[pos + 4], num) * 60;
              } else {
                val = this.getZoneValue(flag, tmatch, matches2[pos + 7], num) * 60;
                val += this.getZoneValue(flag, matches2[pos + 4], matches2[pos + 10], num);
              }
              if (!isNullOrUndefined(val)) {
                retOptions["" + prop] = val;
              }
            } else {
              var cultureOptions = ["en-US", "en-MH", "en-MP"];
              matchString = prop === "month" && !parseOptions.isIslamic && (parseOptions.culture === "en" || parseOptions.culture === "en-GB" || parseOptions.culture === "en-US") ? matchString[0].toUpperCase() + matchString.substring(1).toLowerCase() : matchString;
              matchString = prop !== "month" && prop === "designator" && parseOptions.culture && parseOptions.culture.indexOf("en-") !== -1 && cultureOptions.indexOf(parseOptions.culture) === -1 ? matchString.toLowerCase() : matchString;
              retOptions["" + prop] = parseOptions["" + prop]["" + matchString];
            }
          }
        }
        if (parseOptions.hour12) {
          retOptions.hour12 = true;
        }
      }
      return retOptions;
    };
    DateParser2.internalNumberParser = function(value, option) {
      value = ParserBase.convertValueParts(value, option.numberParseRegex, option.numericPair);
      if (latnRegex.test(value)) {
        return +value;
      }
      return null;
    };
    DateParser2.parseTimeZoneRegx = function(hourFormat, tZone, nRegex) {
      var pattern = tZone.gmtFormat;
      var ret;
      var cRegex = "(" + nRegex + ")(" + nRegex + ")";
      ret = hourFormat.replace("+", "\\+");
      if (hourFormat.indexOf("HH") !== -1) {
        ret = ret.replace(/HH|mm/g, "(" + cRegex + ")");
      } else {
        ret = ret.replace(/H|m/g, "(" + cRegex + "?)");
      }
      var splitStr = ret.split(";").map(function(str) {
        return pattern.replace("{0}", str);
      });
      ret = splitStr.join("|") + "|" + tZone.gmtZeroFormat;
      return ret;
    };
    DateParser2.getZoneValue = function(flag, val1, val2, num) {
      var ival = flag ? val1 : val2;
      if (!ival) {
        return 0;
      }
      var value = this.internalNumberParser(ival, num);
      if (flag) {
        return -value;
      }
      return value;
    };
    return DateParser2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/intl/number-parser.js
var regExp2 = RegExp;
var parseRegex = new regExp2("^([^0-9]*)(([0-9,]*[0-9]+)(.[0-9]+)?)([Ee][+-]?[0-9]+)?([^0-9]*)$");
var groupRegex = /,/g;
var keys = ["minusSign", "infinity"];
var NumberParser = (
  /** @class */
  function() {
    function NumberParser2() {
    }
    NumberParser2.numberParser = function(culture, option, cldr) {
      var _this = this;
      var dependable = IntlBase.getDependables(cldr, culture, "", true);
      var parseOptions = {
        custom: true
      };
      if (IntlBase.formatRegex.test(option.format) || !option.format) {
        extend(parseOptions, IntlBase.getProperNumericSkeleton(option.format || "N"));
        parseOptions.custom = false;
        if (!parseOptions.fractionDigits) {
          if (option.maximumFractionDigits) {
            parseOptions.maximumFractionDigits = option.maximumFractionDigits;
          }
        }
      } else {
        extend(parseOptions, IntlBase.customFormat(option.format, null, null));
      }
      var numbers = getValue("numbers", dependable.parserObject);
      var numOptions = ParserBase.getCurrentNumericOptions(dependable.parserObject, ParserBase.getNumberingSystem(cldr), true, isBlazor());
      parseOptions.symbolRegex = ParserBase.getSymbolRegex(Object.keys(numOptions.symbolMatch));
      parseOptions.infinity = numOptions.symbolNumberSystem[keys[1]];
      var symbolpattern;
      if (!isBlazor()) {
        symbolpattern = IntlBase.getSymbolPattern(parseOptions.type, numOptions.numberSystem, dependable.numericObject, parseOptions.isAccount);
        if (symbolpattern) {
          symbolpattern = symbolpattern.replace(/\u00A4/g, IntlBase.defaultCurrency);
          var split = symbolpattern.split(";");
          parseOptions.nData = IntlBase.getFormatData(split[1] || "-" + split[0], true, "");
          parseOptions.pData = IntlBase.getFormatData(split[0], true, "");
        }
      } else {
        parseOptions.nData = extend({}, {}, getValue(parseOptions.type + "nData", numbers));
        parseOptions.pData = extend({}, {}, getValue(parseOptions.type + "pData", numbers));
        if (parseOptions.type === "currency" && option.currency) {
          IntlBase.replaceBlazorCurrency([parseOptions.pData, parseOptions.nData], getValue("currencySymbol", numbers), option.currency);
        }
      }
      return function(value) {
        return _this.getParsedNumber(value, parseOptions, numOptions);
      };
    };
    NumberParser2.getParsedNumber = function(value, options, numOptions) {
      var isNegative;
      var isPercent;
      var tempValue;
      var lead;
      var end;
      var ret;
      if (value.indexOf(options.infinity) !== -1) {
        return Infinity;
      } else {
        value = ParserBase.convertValueParts(value, options.symbolRegex, numOptions.symbolMatch);
        value = ParserBase.convertValueParts(value, numOptions.numberParseRegex, numOptions.numericPair);
        value = value.indexOf("-") !== -1 ? value.replace("-.", "-0.") : value;
        if (value.indexOf(".") === 0) {
          value = "0" + value;
        }
        var matches2 = value.match(parseRegex);
        if (isNullOrUndefined(matches2)) {
          return NaN;
        }
        lead = matches2[1];
        tempValue = matches2[2];
        var exponent = matches2[5];
        end = matches2[6];
        isNegative = options.custom ? lead === options.nData.nlead && end === options.nData.nend : lead.indexOf(options.nData.nlead) !== -1 && end.indexOf(options.nData.nend) !== -1;
        isPercent = isNegative ? options.nData.isPercent : options.pData.isPercent;
        tempValue = tempValue.replace(groupRegex, "");
        if (exponent) {
          tempValue += exponent;
        }
        ret = +tempValue;
        if (options.type === "percent" || isPercent) {
          ret = ret / 100;
        }
        if (options.custom || options.fractionDigits) {
          ret = parseFloat(ret.toFixed(options.custom ? isNegative ? options.nData.maximumFractionDigits : options.pData.maximumFractionDigits : options.fractionDigits));
        }
        if (options.maximumFractionDigits) {
          ret = this.convertMaxFracDigits(tempValue, options, ret, isNegative);
        }
        if (isNegative) {
          ret *= -1;
        }
        return ret;
      }
    };
    NumberParser2.convertMaxFracDigits = function(value, options, ret, isNegative) {
      var decimalSplitValue = value.split(".");
      if (decimalSplitValue[1] && decimalSplitValue[1].length > options.maximumFractionDigits) {
        ret = +ret.toFixed(options.custom ? isNegative ? options.nData.maximumFractionDigits : options.pData.maximumFractionDigits : options.maximumFractionDigits);
      }
      return ret;
    };
    return NumberParser2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/internationalization.js
var onIntlChange = new Observer();
var rightToLeft = false;
var cldrData = {};
var defaultCulture = "en-US";
var mapper2 = ["numericObject", "dateObject"];
var Internationalization = (
  /** @class */
  function() {
    function Internationalization2(cultureName) {
      if (cultureName) {
        this.culture = cultureName;
      }
    }
    Internationalization2.prototype.getDateFormat = function(options) {
      return DateFormat2.dateFormat(this.getCulture(), options || {
        type: "date",
        skeleton: "short"
      }, cldrData);
    };
    Internationalization2.prototype.getNumberFormat = function(options) {
      if (options && !options.currency) {
        options.currency = defaultCurrencyCode;
      }
      if (isBlazor() && options && !options.format) {
        options.minimumFractionDigits = 0;
      }
      return NumberFormat2.numberFormatter(this.getCulture(), options || {}, cldrData);
    };
    Internationalization2.prototype.getDateParser = function(options) {
      return DateParser.dateParser(this.getCulture(), options || {
        skeleton: "short",
        type: "date"
      }, cldrData);
    };
    Internationalization2.prototype.getNumberParser = function(options) {
      if (isBlazor() && options && !options.format) {
        options.minimumFractionDigits = 0;
      }
      return NumberParser.numberParser(this.getCulture(), options || {
        format: "N"
      }, cldrData);
    };
    Internationalization2.prototype.formatNumber = function(value, option) {
      return this.getNumberFormat(option)(value);
    };
    Internationalization2.prototype.formatDate = function(value, option) {
      return this.getDateFormat(option)(value);
    };
    Internationalization2.prototype.parseDate = function(value, option) {
      return this.getDateParser(option)(value);
    };
    Internationalization2.prototype.parseNumber = function(value, option) {
      return this.getNumberParser(option)(value);
    };
    Internationalization2.prototype.getDatePattern = function(option, isExcelFormat) {
      return IntlBase.getActualDateTimeFormat(this.getCulture(), option, cldrData, isExcelFormat);
    };
    Internationalization2.prototype.getNumberPattern = function(option, isExcel) {
      return IntlBase.getActualNumberFormat(this.getCulture(), option, cldrData, isExcel);
    };
    Internationalization2.prototype.getFirstDayOfWeek = function() {
      return IntlBase.getWeekData(this.getCulture(), cldrData);
    };
    Internationalization2.prototype.getCulture = function() {
      return this.culture || defaultCulture;
    };
    return Internationalization2;
  }()
);
function setCulture(cultureName) {
  defaultCulture = cultureName;
  onIntlChange.notify("notifyExternalChange", {
    "locale": defaultCulture
  });
}
function setCurrencyCode(currencyCode) {
  setDefaultCurrencyCode(currencyCode);
  onIntlChange.notify("notifyExternalChange", {
    "currencyCode": defaultCurrencyCode
  });
}
function loadCldr() {
  var data = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    data[_i] = arguments[_i];
  }
  for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
    var obj = data_1[_a];
    extend(cldrData, obj, {}, true);
  }
}
function enableRtl(status) {
  if (status === void 0) {
    status = true;
  }
  rightToLeft = status;
  onIntlChange.notify("notifyExternalChange", {
    enableRtl: rightToLeft
  });
}
function getNumericObject(locale, type) {
  var numObject = IntlBase.getDependables(cldrData, locale, "", true)[mapper2[0]];
  var dateObject = IntlBase.getDependables(cldrData, locale, "")[mapper2[1]];
  var numSystem = getValue("defaultNumberingSystem", numObject);
  var symbPattern = isBlazor() ? getValue("numberSymbols", numObject) : getValue("symbols-numberSystem-" + numSystem, numObject);
  var pattern = IntlBase.getSymbolPattern(type || "decimal", numSystem, numObject, false);
  return extend(symbPattern, IntlBase.getFormatData(pattern, true, "", true), {
    "dateSeparator": IntlBase.getDateSeparator(dateObject)
  });
}
function getNumberDependable(locale, currency) {
  var numObject = IntlBase.getDependables(cldrData, locale, "", true);
  return IntlBase.getCurrencySymbol(numObject.numericObject, currency);
}
function getDefaultDateObject(mode) {
  return IntlBase.getDependables(cldrData, "", mode, false)[mapper2[1]];
}

// node_modules/@syncfusion/ej2-base/src/validate-lic.js
var componentList = ["grid", "pivotview", "treegrid", "spreadsheet", "rangeNavigator", "DocumentEditor", "listbox", "inplaceeditor", "PdfViewer", "richtexteditor", "DashboardLayout", "chart", "stockChart", "circulargauge", "diagram", "heatmap", "lineargauge", "maps", "slider", "smithchart", "barcode", "sparkline", "treemap", "bulletChart", "kanban", "daterangepicker", "schedule", "gantt", "signature", "query-builder", "drop-down-tree", "carousel", "filemanager", "uploader", "accordion", "tab", "treeview"];
var bypassKey = [115, 121, 110, 99, 102, 117, 115, 105, 111, 110, 46, 105, 115, 76, 105, 99, 86, 97, 108, 105, 100, 97, 116, 101, 100];
var accountURL;
var LicenseValidator = (
  /** @class */
  function() {
    function LicenseValidator2(key) {
      this.isValidated = false;
      this.isLicensed = true;
      this.version = "29";
      this.platform = /JavaScript|ASPNET|ASPNETCORE|ASPNETMVC|FileFormats|essentialstudio/i;
      this.errors = {
        noLicense: "<span>This application was built using a trial version of Syncfusion<sup>®</sup> Essential Studio<sup>®</sup>. To remove the license validation message permanently, a valid license key must be included.</span>",
        trailExpired: "<span>This application was built using a trial version of Syncfusion<sup>®</sup> Essential Studio<sup>®</sup>. To remove the license validation message permanently, a valid license key must be included.</span>",
        versionMismatched: "<span>The included Syncfusion<sup>®</sup> license key is invalid.</span>",
        platformMismatched: "<span>The included Syncfusion<sup>®</sup> license key is invalid.</span>",
        invalidKey: "<span>The included Syncfusion<sup>®</sup> license key is invalid.</span>"
      };
      this.minVersion = null;
      this.manager = /* @__PURE__ */ function() {
        var licKey = null;
        function set(key2) {
          licKey = key2;
        }
        function get() {
          return licKey;
        }
        return {
          setKey: set,
          getKey: get
        };
      }();
      this.npxManager = /* @__PURE__ */ function() {
        var npxLicKey = "npxKeyReplace";
        function get() {
          return npxLicKey;
        }
        return {
          getKey: get
        };
      }();
      this.manager.setKey(key);
    }
    LicenseValidator2.prototype.validate = function() {
      var contentKey = [115, 121, 110, 99, 102, 117, 115, 105, 111, 110, 46, 108, 105, 99, 101, 110, 115, 101, 67, 111, 110, 116, 101, 110, 116];
      var URLKey = [115, 121, 110, 99, 102, 117, 115, 105, 111, 110, 46, 99, 108, 97, 105, 109, 65, 99, 99, 111, 117, 110, 116, 85, 82, 76];
      if (!this.isValidated && containerObject && !getValue(convertToChar(bypassKey), containerObject) && !getValue("Blazor", containerObject)) {
        var validateMsg = void 0;
        var validateURL = void 0;
        if (this.manager && this.manager.getKey() || this.npxManager && this.npxManager.getKey() !== "npxKeyReplace") {
          var result = this.getInfoFromKey();
          if (result && result.length) {
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
              var res = result_1[_i];
              if (!this.platform.test(res.platform) || res.invalidPlatform) {
                validateMsg = this.errors.platformMismatched;
              } else {
                if (res.minVersion >= res.lastValue && res.minVersion !== res.lastValue || res.lastValue < parseInt(this.version, 10)) {
                  validateMsg = this.errors.versionMismatched;
                  validateMsg = validateMsg.replace("##LicenseVersion", res.version);
                  validateMsg = validateMsg.replace("##Requireversion", this.version + ".x");
                } else {
                  if (res.lastValue == null || isNaN(res.lastValue)) {
                    validateMsg = this.errors.versionMismatched;
                    validateMsg = validateMsg.replace("##LicenseVersion", res.version);
                    validateMsg = validateMsg.replace("##Requireversion", this.version + ".x");
                  }
                }
                if (res.expiryDate) {
                  var expDate = new Date(res.expiryDate);
                  var currDate = /* @__PURE__ */ new Date();
                  if (expDate !== currDate && expDate < currDate) {
                    validateMsg = this.errors.trailExpired;
                  } else {
                    break;
                  }
                }
              }
            }
          } else {
            validateMsg = this.errors.invalidKey;
          }
        } else {
          var licenseContent = getValue(convertToChar(contentKey), containerObject);
          validateURL = getValue(convertToChar(URLKey), containerObject);
          if (licenseContent && licenseContent !== "") {
            validateMsg = licenseContent;
          } else {
            validateMsg = this.errors.noLicense;
          }
        }
        if (validateMsg && typeof document !== "undefined" && !isNullOrUndefined(document)) {
          accountURL = validateURL && validateURL !== "" ? validateURL : "https://www.syncfusion.com/account/claim-license-key?pl=SmF2YVNjcmlwdA==&vs=Mjk=&utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information";
          var errorDiv = createElement("div", {
            innerHTML: `<img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzE5OV80KSI+CjxwYXRoIGQ9Ik0xMiAyMUMxNi45NzA2IDIxIDIxIDE2Ljk3MDYgMjEgMTJDMjEgNy4wMjk0NCAxNi45NzA2IDMgMTIgM0M3LjAyOTQ0IDMgMyA3LjAyOTQ0IDMgMTJDMyAxNi45NzA2IDcuMDI5NDQgMjEgMTIgMjFaIiBzdHJva2U9IiM3MzczNzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMS4yNSAxMS4yNUgxMlYxNi41SDEyLjc1IiBmaWxsPSIjNjE2MDYzIi8+CjxwYXRoIGQ9Ik0xMS4yNSAxMS4yNUgxMlYxNi41SDEyLjc1IiBzdHJva2U9IiM3MzczNzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMS44MTI1IDlDMTIuNDMzOCA5IDEyLjkzNzUgOC40OTYzMiAxMi45Mzc1IDcuODc1QzEyLjkzNzUgNy4yNTM2OCAxMi40MzM4IDYuNzUgMTEuODEyNSA2Ljc1QzExLjE5MTIgNi43NSAxMC42ODc1IDcuMjUzNjggMTAuNjg3NSA3Ljg3NUMxMC42ODc1IDguNDk2MzIgMTEuMTkxMiA5IDExLjgxMjUgOVoiIGZpbGw9IiM3MzczNzMiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8xOTlfNCI+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K' style="top: 6px;
                    position: absolute;
                    left: 16px;
                    width: 24px;
                    height: 24px;"/>` + validateMsg + ' <a style="text-decoration: none;color: #0D6EFD;font-weight: 500;" href=' + accountURL + ">Claim your free account</a>"
          });
          errorDiv.setAttribute("style", "position: fixed;\n                top: 10px;\n                left: 10px;\n                right: 10px;\n                font-size: 14px;\n                background: #EEF2FF;\n                color: #222222;\n                z-index: 999999999;\n                text-align: left;\n                border: 1px solid #EEEEEE;\n                padding: 10px 11px 10px 50px;\n                border-radius: 8px;\n                font-family: Helvetica Neue, Helvetica, Arial;");
          document.body.appendChild(errorDiv);
          this.isLicensed = false;
        }
        this.isValidated = true;
        setValue(convertToChar(bypassKey), this.isValidated, containerObject);
      }
      return this.isLicensed;
    };
    LicenseValidator2.prototype.getDecryptedData = function(key) {
      try {
        return atob(key);
      } catch (error) {
        return "";
      }
    };
    LicenseValidator2.prototype.getInfoFromKey = function() {
      try {
        var licKey = "";
        var pkey = [5439488, 7929856, 5111808, 6488064, 4587520, 7667712, 5439488, 6881280, 5177344, 7208960, 4194304, 4456448, 6619136, 7733248, 5242880, 7077888, 6356992, 7602176, 4587520, 7274496, 7471104, 7143424];
        var decryptedStr = [];
        var resultArray = [];
        var invalidPlatform = false;
        var isNpxKey = false;
        if (this.manager.getKey()) {
          licKey = this.manager.getKey();
        } else {
          isNpxKey = true;
          licKey = this.npxManager.getKey().split("npxKeyReplace")[1];
        }
        var licKeySplit = licKey.split(";");
        for (var _i = 0, licKeySplit_1 = licKeySplit; _i < licKeySplit_1.length; _i++) {
          var lKey = licKeySplit_1[_i];
          var decodeStr = this.getDecryptedData(lKey);
          if (!decodeStr) {
            continue;
          }
          var k = 0;
          var buffr = "";
          if (!isNpxKey) {
            for (var i = 0; i < decodeStr.length; i++, k++) {
              if (k === pkey.length) {
                k = 0;
              }
              var c = decodeStr.charCodeAt(i);
              buffr += String.fromCharCode(c ^ pkey[parseInt(k.toString(), 10)] >> 16);
            }
          } else {
            var charKey = decodeStr[decodeStr.length - 1];
            var decryptedKey = [];
            for (var i = 0; i < decodeStr.length; i++) {
              decryptedKey[parseInt(i.toString(), 10)] = decodeStr[parseInt(i.toString(), 10)].charCodeAt(0) - charKey.charCodeAt(0);
            }
            for (var i = 0; i < decryptedKey.length; i++) {
              buffr += String.fromCharCode(decryptedKey[parseInt(i.toString(), 10)]);
            }
          }
          if (this.platform.test(buffr)) {
            decryptedStr = buffr.split(";");
            invalidPlatform = false;
            if (decryptedStr.length > 3) {
              var minVersion = parseInt(decryptedStr[1].split(".")[0], 10);
              var lastValue = parseInt(decryptedStr[4], 10);
              resultArray.push({
                platform: decryptedStr[0],
                version: decryptedStr[1],
                expiryDate: decryptedStr[2],
                lastValue,
                minVersion
              });
            }
          } else if (buffr && buffr.split(";").length > 3) {
            invalidPlatform = true;
          }
        }
        if (invalidPlatform && !resultArray.length) {
          return [{
            invalidPlatform
          }];
        } else {
          return resultArray.length ? resultArray : null;
        }
      } catch (error) {
        return null;
      }
    };
    return LicenseValidator2;
  }()
);
var licenseValidator = new LicenseValidator();
function convertToChar(cArr) {
  var ret = "";
  for (var _i = 0, cArr_1 = cArr; _i < cArr_1.length; _i++) {
    var arr = cArr_1[_i];
    ret += String.fromCharCode(arr);
  }
  return ret;
}
function registerLicense(key) {
  licenseValidator = new LicenseValidator(key);
}
var validateLicense = function(key) {
  if (key) {
    registerLicense(key);
  }
  return licenseValidator.validate();
};
var getVersion = function() {
  return licenseValidator.version;
};
var createLicenseOverlay = function() {
  var bannerTemplate = '\n    <div style="\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: rgba(0, 0, 0, 0.5);\n    z-index: 99999;\n    ">\n        <div style="\n    background: #FFFFFF;\n    height: 455px;\n    width: 840px;\n    font-family: Helvetica Neue, Helvetica, Arial;\n    color: #000000;\n    box-shadow: 0px 4.8px 14.4px rgb(0 0 0 / 18%), 0px 25.6px 57.6px rgb(0 0 0 / 22%);\n    display: block;\n    margin: 8% auto;\n    border-radius: 20px;\n    ">\n            <div style="\n    position: absolute;\nwidth: 838px;\nheight: 62px;\nbackground-color: #F9F9F9;\nborder: 1px solid #EEEEEE;\nborder-top-left-radius: 20px;\nborder-top-right-radius: 20px;\n">\n                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ2IiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTQ2IDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNDAuNTk2NSAxNS4wMDc4SDMyLjQyNUMzMS41NTU3IDE1LjAwNzggMzAuOTAzNyAxNS4xODEyIDMwLjUxMjUgMTUuNDg0NkMzMC4xMjEzIDE1LjgzMTQgMjkuOTA0IDE2LjMwODIgMjkuOTA0IDE3LjA0NTFDMjkuOTA0IDE3LjYwODYgMzAuMDc3OCAxOC4wNDIxIDMwLjQyNTYgMTguMzAyMkMzMC43NzMzIDE4LjYwNTYgMzEuMjk0OSAxOC43MzU2IDMxLjk5MDMgMTguNzM1NkgzNi4zMzY5QzM4LjExODkgMTguNzM1NiAzOS40MjI5IDE5LjA4MjQgNDAuMTYxOCAxOS43MzI2QzQwLjk0NDIgMjAuNDI2MiA0MS4yOTE5IDIxLjU1MzIgNDEuMjkxOSAyMy4xMTM3QzQxLjI5MTkgMjQuNzE3NiA0MC44NTcyIDI1Ljg4OCAzOS45ODc5IDI2LjY2ODJDMzkuMTE4NiAyNy40MDUxIDM3LjcyNzcgMjcuNzk1MyAzNS44NTg3IDI3Ljc5NTNIMjcuMDc4N1YyNS4wMjFIMzUuMzM3MkMzNi4yOTM0IDI1LjAyMSAzNi45NDU0IDI0Ljg5MSAzNy4zMzY2IDI0LjYzMDlDMzcuNzI3NyAyNC4zNzA4IDM3LjkwMTYgMjMuODk0IDM3LjkwMTYgMjMuMjg3MUMzNy45MDE2IDIyLjYzNjkgMzcuNzI3NyAyMi4xNjAxIDM3LjM4IDIxLjlDMzcuMDMyMyAyMS42Mzk5IDM2LjQyMzggMjEuNDY2NSAzNS41NTQ1IDIxLjQ2NjVIMzEuNjQyNkMyOS44NjA1IDIxLjQ2NjUgMjguNTEzMSAyMS4xMTk4IDI3LjY4NzMgMjAuMzgyOEMyNi44NjE0IDE5LjY0NTkgMjYuNDI2OCAxOC41MTg5IDI2LjQyNjggMTcuMDAxN0MyNi40MjY4IDE1LjM1NDUgMjYuODYxNCAxNC4xNDA4IDI3LjczMDcgMTMuMzYwNkMyOC42IDEyLjU4MDMgMjkuOTkwOSAxMi4yMzM1IDMxLjkwMzQgMTIuMjMzNUg0MC41OTY1VjE1LjAwNzhaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik00OC4wNzI3IDI1LjI4MTFINTAuNTA2OFYxNi4zOTQ5SDUzLjU0OTNWMjcuNTM1MkM1My41NDkzIDI5LjA1MjQgNTMuMjAxNiAzMC4xNzk0IDUyLjUwNjIgMzAuOTE2M0M1MS44MTA3IDMxLjY1MzIgNTAuNzI0MSAzMiA0OS4yNDYzIDMySDQzLjMzNVYyOS42NTkySDQ4LjcyNDdDNDkuMjg5NyAyOS42NTkyIDQ5Ljc2NzkgMjkuNTI5MiA1MC4wNzIxIDI5LjIyNThDNTAuMzc2NCAyOC45NjU3IDUwLjU1MDIgMjguNTMyMiA1MC41NTAyIDI4LjAxMlYyNy44Mzg2SDQ3Ljg5ODlDNDYuMjAzNyAyNy44Mzg2IDQ0Ljk0MzIgMjcuNDkxOSA0NC4yNDc4IDI2Ljg0MTZDNDMuNTA4OSAyNi4xNDgxIDQzLjE2MTEgMjUuMDY0NCA0My4xNjExIDIzLjQ2MDVWMTYuMzk0OUg0Ni4xNjAyVjIzLjIwMDVDNDYuMTYwMiAyNC4wNjc0IDQ2LjI5MDYgMjQuNjMwOSA0Ni41NTE0IDI0Ljg5MUM0Ni43MjUzIDI1LjE1MTEgNDcuMjQ2OSAyNS4yODExIDQ4LjA3MjcgMjUuMjgxMVoiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTU1Ljg5NjUgMTYuMzk0OUg2MS41OTA0QzYzLjMyOTEgMTYuMzk0OSA2NC41NDYxIDE2LjY5ODMgNjUuMjg1IDE3LjM0ODVDNjYuMDIzOSAxNy45OTg4IDY2LjM3MTYgMTkuMDgyNCA2Ni4zNzE2IDIwLjU1NjNWMjcuNzk1M0g2My4zMjkxVjIwLjk0NjRDNjMuMzI5MSAyMC4wNzk0IDYzLjE5ODcgMTkuNTE1OSA2Mi45Mzc5IDE5LjI5OTJDNjIuNjc3MSAxOS4wMzkxIDYyLjE1NTUgMTguOTA5MSA2MS4zMjk3IDE4LjkwOTFINTguODk1NlYyNy44Mzg2SDU1Ljg1M1YxNi4zOTQ5SDU1Ljg5NjVaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik03NC45MzQyIDI1LjM2NzhINzguMTUwNlYyNy43OTUySDc0LjAyMTRDNzIuOTc4MiAyNy43OTUyIDcyLjEwODkgMjcuNjY1MiA3MS40NTcgMjcuNDkxOEM3MC44MDUgMjcuMjc1IDcwLjE5NjUgMjYuOTI4MyA2OS43MTgzIDI2LjQ1MTRDNjkuMTk2OCAyNS45MzEzIDY4Ljc2MjEgMjUuMjgxMSA2OC40NTc4IDI0LjU0NDJDNjguMTUzNiAyMy44MDcyIDY4LjAyMzIgMjIuOTgzNiA2OC4wMjMyIDIyLjE2QzY4LjAyMzIgMjEuMjkzMSA2OC4xNTM2IDIwLjQ2OTUgNjguNDU3OCAxOS42ODkyQzY4Ljc2MjEgMTguOTA5IDY5LjE1MzMgMTguMzAyMSA2OS43MTgzIDE3Ljc4MTlDNzAuMjM5OSAxNy4zMDUxIDcwLjgwNSAxNi45NTgzIDcxLjUwMDQgMTYuNzQxNkM3Mi4xOTU5IDE2LjUyNDkgNzMuMDIxNyAxNi40MzgyIDc0LjA2NDkgMTYuNDM4Mkg3OC4xOTQxVjE4LjkwOUg3NC45MzQyQzczLjQ5OTggMTguOTA5IDcyLjU0MzYgMTkuMTY5MSA3MS45Nzg1IDE5LjY0NTlDNzEuNDU2OSAyMC4xMjI3IDcxLjE1MjcgMjAuOTg5NyA3MS4xNTI3IDIyLjIwMzRDNzEuMTUyNyAyMi44OTY5IDcxLjI4MzEgMjMuNDYwNSA3MS41MDA0IDIzLjkzNzNDNzEuNzE3NyAyNC40MTQxIDcyLjA2NTUgMjQuNzYwOSA3Mi41MDAxIDI1LjA2NDNDNzIuNzE3NCAyNS4xOTQ0IDcyLjk3ODIgMjUuMjgxMSA3My4yODI1IDI1LjM2NzhDNzMuNjMwMiAyNS4zMjQ0IDc0LjE1MTggMjUuMzY3OCA3NC45MzQyIDI1LjM2NzhaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik04MC44NDU2IDE4LjY0ODlINzguNjcyNFYxNi4zNTE1SDgwLjg0NTZWMTUuMTgxMUM4MC44NDU2IDE0LjAxMDggODEuMDYzIDEzLjIzMDUgODEuNDk3NiAxMi44NDA0QzgxLjkzMjMgMTIuNDUwMyA4Mi43NTgxIDEyLjIzMzUgODMuOTc1MSAxMi4yMzM1SDg2Ljg0MzhWMTQuNDAwOUg4NS40MDk1Qzg0Ljg4NzkgMTQuNDAwOSA4NC41NDAyIDE0LjQ4NzYgODQuMzIyOSAxNC42NjFDODQuMTA1NSAxNC44MzQ0IDgzLjk3NTEgMTUuMDk0NSA4My45NzUxIDE1LjQ0MTJWMTYuMzUxNUg4Ni44NDM4VjE4LjY0ODlIODMuOTc1MVYyNy43OTUzSDgwLjg0NTZWMTguNjQ4OVoiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTk4LjQwNTYgMjcuNzk1M0g5Mi43MTE2QzkxLjAxNjUgMjcuNzk1MyA4OS44NDI5IDI3LjQ0ODUgODkuMDYwNSAyNi43OTgzQzg4LjMyMTYgMjYuMTQ4MSA4Ny45MzA0IDI1LjA2NDQgODcuOTMwNCAyMy41OTA2VjE2LjM5NDlIOTAuOTI5NVYyMy40MTcyQzkwLjkyOTUgMjQuMTk3NCA5MS4wNTk5IDI0LjY3NDMgOTEuMzIwNyAyNC45MzQ0QzkxLjU4MTUgMjUuMTk0NCA5Mi4xMDMxIDI1LjMyNDUgOTIuOTI4OSAyNS4zMjQ1SDk1LjM2M1YxNi4zOTQ5SDk4LjQwNTZWMjcuNzk1M1oiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTEwMC42MjIgMjUuNDExMkgxMDcuMDExQzEwNy41NzcgMjUuNDExMiAxMDguMDExIDI1LjMyNDUgMTA4LjI3MiAyNS4xNTExQzEwOC41MzMgMjQuOTc3NyAxMDguNjYzIDI0LjY3NDMgMTA4LjY2MyAyNC4zMjc1QzEwOC42NjMgMjMuOTM3NCAxMDguNTMzIDIzLjY3NzMgMTA4LjI3MiAyMy40NjA1QzEwOC4wMTEgMjMuMjg3MSAxMDcuNTc3IDIzLjIwMDUgMTA3LjA1NSAyMy4yMDA1SDEwNC40NDdDMTAyLjg4MiAyMy4yMDA1IDEwMS44MzkgMjIuOTgzNyAxMDEuMzE4IDIyLjUwNjlDMTAwLjc1MiAyMi4wMzAxIDEwMC40OTIgMjEuMjA2NSAxMDAuNDkyIDE5Ljk5MjdDMTAwLjQ5MiAxOC43NzkgMTAwLjgzOSAxNy44Njg3IDEwMS40OTEgMTcuMjYxOEMxMDIuMTQzIDE2LjY5ODMgMTAzLjE4NyAxNi4zOTQ5IDEwNC41MzQgMTYuMzk0OUgxMTEuMDU0VjE4Ljc3OUgxMDUuNzA4QzEwNC44MzggMTguNzc5IDEwNC4yNzMgMTguODY1NyAxMDQuMDEyIDE4Ljk5NTdDMTAzLjc1MiAxOS4xNjkxIDEwMy42MjEgMTkuNDI5MiAxMDMuNjIxIDE5LjgxOTRDMTAzLjYyMSAyMC4xNjYxIDEwMy43NTIgMjAuNDI2MiAxMDMuOTY5IDIwLjU5OTZDMTA0LjE4NiAyMC43NzMgMTA0LjU3NyAyMC44NTk3IDEwNS4wNTYgMjAuODU5N0gxMDcuNzk0QzEwOS4wNTQgMjAuODU5NyAxMTAuMDExIDIxLjE2MzEgMTEwLjY2MyAyMS43MjY2QzExMS4zMTUgMjIuMjkwMiAxMTEuNjYyIDIzLjE1NzEgMTExLjY2MiAyNC4yNDA4QzExMS42NjIgMjUuMjgxMSAxMTEuMzU4IDI2LjE0ODEgMTEwLjc5MyAyNi43OTgzQzExMC4yMjggMjcuNDQ4NSAxMDkuNDQ2IDI3Ljc5NTMgMTA4LjUzMyAyNy43OTUzSDEwMC43MDlWMjUuNDExMkgxMDAuNjIyWiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMTE2LjU3NCAxNS4wOTQ0SDExMy40MDFWMTIuMjc2OUgxMTYuNTc0VjE1LjA5NDRaTTExNi41NzQgMjcuNzk1M0gxMTMuNDAxVjE2LjM5NDlIMTE2LjU3NFYyNy43OTUzWiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMTMwLjMwOSAyMi4xMTY3QzEzMC4zMDkgMjMuODkzOSAxMjkuNzQ0IDI1LjMyNDQgMTI4LjY1NyAyNi40MDgxQzEyNy41NzEgMjcuNDkxOCAxMjYuMDkzIDI4LjAxMiAxMjQuMjI0IDI4LjAxMkMxMjIuMzU1IDI4LjAxMiAxMjAuODc3IDI3LjQ5MTggMTE5Ljc5IDI2LjQwODFDMTE4LjcwNCAyNS4zMjQ0IDExOC4xMzkgMjMuODkzOSAxMTguMTM5IDIyLjExNjdDMTE4LjEzOSAyMC4zMzk0IDExOC43MDQgMTguOTA5IDExOS43OSAxNy44MjUzQzEyMC44NzcgMTYuNzQxNiAxMjIuMzk4IDE2LjIyMTQgMTI0LjIyNCAxNi4yMjE0QzEyNi4wNDkgMTYuMjIxNCAxMjcuNTI3IDE2Ljc0MTYgMTI4LjY1NyAxNy44MjUzQzEyOS43NDQgMTguODY1NiAxMzAuMzA5IDIwLjI5NjEgMTMwLjMwOSAyMi4xMTY3Wk0xMjEuMjY4IDIyLjExNjdDMTIxLjI2OCAyMy4yMDA0IDEyMS41MjkgMjQuMDY3MyAxMjIuMDUxIDI0LjY3NDJDMTIyLjU3MiAyNS4yODExIDEyMy4yNjggMjUuNTg0NSAxMjQuMTggMjUuNTg0NUMxMjUuMDkzIDI1LjU4NDUgMTI1Ljc4OSAyNS4yODExIDEyNi4zMSAyNC42NzQyQzEyNi44MzIgMjQuMDY3MyAxMjcuMDkzIDIzLjIwMDQgMTI3LjA5MyAyMi4xMTY3QzEyNy4wOTMgMjEuMDMzIDEyNi44MzIgMjAuMTY2MSAxMjYuMzEgMTkuNjAyNUMxMjUuNzg5IDE4Ljk5NTcgMTI1LjA5MyAxOC42OTIyIDEyNC4xMzcgMTguNjkyMkMxMjMuMjI0IDE4LjY5MjIgMTIyLjUyOSAxOC45OTU3IDEyMi4wMDcgMTkuNjAyNUMxMjEuNTI5IDIwLjE2NjEgMTIxLjI2OCAyMS4wMzMgMTIxLjI2OCAyMi4xMTY3WiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMTMxLjc4NyAxNi4zOTQ5SDEzNy40ODFDMTM5LjIxOSAxNi4zOTQ5IDE0MC40MzYgMTYuNjk4MyAxNDEuMTc1IDE3LjM0ODVDMTQxLjkxNCAxNy45OTg4IDE0Mi4yNjIgMTkuMDgyNCAxNDIuMjYyIDIwLjU1NjNWMjcuNzk1M0gxMzkuMjE5VjIwLjk0NjRDMTM5LjIxOSAyMC4wNzk0IDEzOS4wODkgMTkuNTE1OSAxMzguODI4IDE5LjI5OTJDMTM4LjU2NyAxOS4wMzkxIDEzOC4wNDYgMTguOTA5MSAxMzcuMjIgMTguOTA5MUgxMzQuNzg2VjI3LjgzODZIMTMxLjc0M1YxNi4zOTQ5SDEzMS43ODdaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik03LjEyODMxIDMuNzM3NDNIMFYxMC44NDY0SDcuMTI4MzFWMy43Mzc0M1oiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTIzLjI1MTMgLTIuMTU3MjVlLTA1TDE4LjU1MTMgNS41MTY4NUwyNC4wODMxIDEwLjIwNDFMMjguNzgzMSA0LjY4NzI1TDIzLjI1MTMgLTIuMTU3MjVlLTA1WiIgZmlsbD0iI0ZGODYwMCIvPgo8cGF0aCBkPSJNMTUuNjA0MSAzLjczNzQzSDguNDc1ODNWMTAuODQ2NEgxNS42MDQxVjMuNzM3NDNaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik03LjEyODMxIDEyLjE5MDJIMFYxOS4yOTkySDcuMTI4MzFWMTIuMTkwMloiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTE1LjYwNDEgMTIuMTkwMkg4LjQ3NTgzVjE5LjI5OTJIMTUuNjA0MVYxMi4xOTAyWiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMjQuMDc5NyAxMi4xOTAySDE2Ljk1MTRWMTkuMjk5MkgyNC4wNzk3VjEyLjE5MDJaIiBmaWxsPSIjRkY4NjAwIi8+CjxwYXRoIGQ9Ik03LjEyODMxIDIwLjY4NjNIMFYyNy43OTUzSDcuMTI4MzFWMjAuNjg2M1oiIGZpbGw9IiMzNTQzQTgiLz4KPHBhdGggZD0iTTE1LjYwNDEgMjAuNjg2M0g4LjQ3NTgzVjI3Ljc5NTNIMTUuNjA0MVYyMC42ODYzWiIgZmlsbD0iIzM1NDNBOCIvPgo8cGF0aCBkPSJNMjQuMTIzMiAyMC42ODYzSDE2Ljk5NDlWMjcuNzk1M0gyNC4xMjMyVjIwLjY4NjNaIiBmaWxsPSIjMzU0M0E4Ii8+CjxwYXRoIGQ9Ik0xNDYgMTUuODMxM0MxNDYgMTYuODcxNyAxNDUuMTc0IDE3LjY5NTMgMTQ0LjEzMSAxNy42OTUzQzE0My4wODggMTcuNjk1MyAxNDIuMjYyIDE2Ljg3MTcgMTQyLjI2MiAxNS44MzEzQzE0Mi4yNjIgMTQuNzkxIDE0My4wODggMTQuMDEwNyAxNDQuMTMxIDE0LjAxMDdDMTQ1LjEzMSAxMy45Njc0IDE0NiAxNC43OTEgMTQ2IDE1LjgzMTNaTTE0Mi45NTcgMTQuNzkxQzE0Mi42OTcgMTUuMDUxMSAxNDIuNTY2IDE1LjQ0MTIgMTQyLjU2NiAxNS44MzEzQzE0Mi41NjYgMTYuNjk4MyAxNDMuMjYyIDE3LjM5MTggMTQ0LjEzMSAxNy4zOTE4QzE0NSAxNy4zOTE4IDE0NS42OTYgMTYuNjk4MyAxNDUuNjk2IDE1LjgzMTNDMTQ1LjY5NiAxNS4wMDc3IDE0NSAxNC4yNzA4IDE0NC4xNzQgMTQuMjcwOEMxNDMuNjUzIDE0LjI3MDggMTQzLjI2MiAxNC40NDQyIDE0Mi45NTcgMTQuNzkxWk0xNDQuODcgMTYuOTE1SDE0NC40NzlMMTQzLjkxNCAxNi4wOTE0VjE2LjkxNUgxNDMuNjA5VjE0Ljc0NzZIMTQzLjk1N0MxNDQuNDM1IDE0Ljc0NzYgMTQ0LjY1MyAxNC45NjQ0IDE0NC42NTMgMTUuMzU0NUMxNDQuNjUzIDE1LjY1NzkgMTQ0LjQ3OSAxNS44NzQ3IDE0NC4xNzQgMTUuOTYxNEwxNDQuODcgMTYuOTE1Wk0xNDQuMDQ0IDE1LjY1NzlDMTQ0LjI2MSAxNS42NTc5IDE0NC4zOTIgMTUuNTI3OSAxNDQuMzkyIDE1LjM1NDVDMTQ0LjM5MiAxNS4xMzc4IDE0NC4yNjEgMTUuMDUxMSAxNDQuMDAxIDE1LjA1MTFIMTQzLjkxNFYxNS42NTc5SDE0NC4wNDRaIiBmaWxsPSIjMzU0M0E4Ii8+Cjwvc3ZnPgo=" style="\n    text-align: left;\n    width: 146px;\n    position: absolute;\n    top: 14px;\n    left: 31px;\n">\n            </div>\n            <div style="\n    position: relative;\n    top: 80px;\n    left: 32px;\n    font-size: 20px;\n    text-align: left;\n    font-weight: 700;\n    letter-spacing: 0.02em;\n    font-style: normal;\n    line-height: 125%;\n    ">Claim your FREE account and get a key in less than a minute</div>\n            <ul style="\n        font-size: 15px;\n        font-weight: 400;\n        color: #333333;\n        letter-spacing: 0.01em;\n        position: relative;\n        left: 32px;\n        top: 88px;\n        line-height: 180%;\n        ">\n                <li><span>Access to a 30-day free trial of any of our products.</span></li>\n                <li><span>Access to 24x5 support by developers via the <a href="https://support.syncfusion.com/create?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information" style="text-decoration: none;\n                color: #0D6EFD;\n                font-weight: 500;">support tickets</a>, <a href="https://www.syncfusion.com/forums?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information" style="text-decoration: none;\n                color: #0D6EFD;\n                font-weight: 500;">forum</a>, <a href="https://www.syncfusion.com/feedback?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information\n                " style="text-decoration: none;\n                color: #0D6EFD;\n                font-weight: 500;">feature &amp; feedback page</a> and chat.</span></li>\n                <li><span>200+ <a href="https://www.syncfusion.com/succinctly-free-ebooks?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information" style="text-decoration: none;\n                color: #0D6EFD;\n                font-weight: 500;">ebooks </a>on the latest technologies, industry trends, and research topics.</span>\n                </li>\n                <li><span>Largest collection of over 7500 flat and wireframe icons for free with Syncfusion<sup>®</sup> <a href="https://www.syncfusion.com/downloads/metrostudio?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information\n                " style="text-decoration: none;\n                color: #0D6EFD;\n                font-weight: 500;">Metro Studio.</a></span></li>\n                <li><span>Free and unlimited access to Syncfusion<sup>®</sup> technical <a href="https://www.syncfusion.com/blogs/?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information\n                " style="text-decoration: none;\n                color: #0D6EFD;\n                font-weight: 500;">blogs</a> and <a href="https://www.syncfusion.com/resources/techportal/whitepapers?utm_source=es_license_validation_banner&utm_medium=listing&utm_campaign=license-information" style="text-decoration: none;\n                color: #0D6EFD;\n                font-weight: 500;">whitepapers.</a></span></li>\n            </ul>\n            <div style="\n            font-size: 18px;\n            font-weight: 700;\n            position: relative;\n            line-height: 125%;\n            letter-spacing: 0.02em;\n            top: 90px;\n            left: 32px;\n    ">Syncfusion is trusted by 29,000+ businesses worldwide</div>\n            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIyMzAiIGhlaWdodD0iMTU2Ij4KPHBhdGggZD0iTTAgMCBDMTAuMjAxNTE3OTEgOC44MjE1MTgwNSAxNi4yMjU4NjAxNyAxOS4zODQ1MTIyMiAxNy4yODEyNSAzMi45NzI2NTYyNSBDMTcuNDE3OTUwMTYgNDUuOTc2MjU4NTUgMTMuMTkyNTE4MDQgNTcuNjM2ODk1NzMgNC4yNDYwOTM3NSA2Ny4xMzI4MTI1IEMtNS44MzQzNzk4NyA3Ni42NDQzNzA1IC0xNi43MjM2MTUyMyA4MC40NzU4MTc3IC0zMC40MTAxNTYyNSA4MC4yMjI2NTYyNSBDLTQzLjEyNjA0NDAyIDc5LjI2MTgzMzU2IC01NC4yMDMwOTQ1MyA3My40MDM0NzMyNCAtNjIuNzE4NzUgNjMuOTcyNjU2MjUgQy03MS4xNDgwNjkyNSA1MS44OTg2NTk5MiAtNzMuMTk0NzM3MSA0MC4zOTM3NzYxNCAtNzEuNzE4NzUgMjUuOTcyNjU2MjUgQy02OS4wOTkxNjQzNyAxNC41NTg3NDc0NCAtNjIuMzc0NTczNzggNC42NDI1NDI1NiAtNTIuNzE4NzUgLTIuMDI3MzQzNzUgQy0zNS45MDE4NDE2MSAtMTEuOTUyMDc2NTcgLTE1Ljg5MjUyMDU5IC0xMi4xNTE1ODYzNiAwIDAgWiAiIGZpbGw9IiMwODY4NDIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzODguNzE4NzUsNDIuMDI3MzQzNzUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzcuMzY3MjM5MTYgNC4wNDIzMjQxMSAxMS4xMDI1Mzc1MyAxMS4zOTA0MDEzMyAxNCAxOSBDMTQuMzg5NjU4MjYgMjAuOTg5NzkzMzQgMTQuNzQwMDUyODkgMjIuOTg5MTQ0ODEgMTUgMjUgQzE1LjY2IDI1IDE2LjMyIDI1IDE3IDI1IEMxNy4xMDA1NDY4NyAyNC4xNDQwNjI1IDE3LjIwMTA5Mzc1IDIzLjI4ODEyNSAxNy4zMDQ2ODc1IDIyLjQwNjI1IEMxOC45MTc0Mjc1NSAxNC41MDU2MzU4IDIzLjYwODM5NDI3IDUuNzcxNDMyNzMgMzAuMTc5Njg3NSAwLjg5NDUzMTI1IEMzMy43MzEzMzY1NCAtMC44NTA4MDcwMSAzNi4wNzI1NTM3NiAtMC42MjM0MDQxNyA0MCAwIEM0Ny43ODg2NDkxMyAzLjU4Mjc3ODYgNTEuMzQ3MDc2MTEgMTAuOTI1MDE3NDYgNTQuMzUyNzgzMiAxOC41ODg4NjcxOSBDNjAuNjYxMjYyNjMgMzUuNzMzMjUxOTkgNjMuMjM3ODY0ODggNTQuNDE0MDMxNTkgNjMuMDYyNSA3Mi42MjUgQzYzLjA1Nzk4ODI4IDczLjUzMzc4OTA2IDYzLjA1MzQ3NjU2IDc0LjQ0MjU3ODEyIDYzLjA0ODgyODEyIDc1LjM3ODkwNjI1IEM2My4wMzcyMTIwMiA3Ny41ODU5NjY5NSA2My4wMTkyODQ1MyA3OS43OTI5OTI5OSA2MyA4MiBDNTkuMDQgODIgNTUuMDggODIgNTEgODIgQzUwLjkzMDA2ODM2IDgwLjkwMzQ5MTIxIDUwLjg2MDEzNjcyIDc5LjgwNjk4MjQyIDUwLjc4ODA4NTk0IDc4LjY3NzI0NjA5IEM1MC4zMzA4MzIxNSA0MS45ODYzMDU3MyA1MC4zMzA4MzIxNSA0MS45ODYzMDU3MyAzOSA4IEMzOC4wMSA3LjY3IDM3LjAyIDcuMzQgMzYgNyBDMjUuMTQyMTkxNjggMTYuMjQ0MTIxMzEgMjQuODI2NDcwMzkgMzguNDA3NTg2NzUgMjMuNjgzNTkzNzUgNTEuNjcyMzYzMjggQzIzLjA0MTM0NzcxIDU5Ljc3NjY1NDY5IDIyLjUwMDE0OTM2IDY3Ljg4NTgxMjE3IDIyIDc2IEMxOC4wNCA3NiAxNC4wOCA3NiAxMCA3NiBDOS44OTUxMDI1NCA3NC40NzU4NDQ3MyA5Ljg5NTEwMjU0IDc0LjQ3NTg0NDczIDkuNzg4MDg1OTQgNzIuOTIwODk4NDQgQzkuMjg4Njk2MTIgMzkuNjQwNjkzMTMgOS4yODg2OTYxMiAzOS42NDA2OTMxMyAtMSA5IEMtMy4wMzU2NDA0IDcuNzQxNDM2NTkgLTMuMDM1NjQwNCA3Ljc0MTQzNjU5IC01IDcgQy0xNS44NDgzODY5NyAxNi40OTIzMzg2IC0xNi4wNTg3MjYyNSA0MC4yNTk3NTY0MSAtMTcgNTQgQy0xNy40NzQyMTEwMiA2My4zMjgyOTc4NCAtMTcuNzQ3NjYxNTkgNzIuNjYzNDc4NzQgLTE4IDgyIEMtMjIuMjkgODIgLTI2LjU4IDgyIC0zMSA4MiBDLTMxLjg5MjU5MjA1IDU1LjgxNzI5OTc3IC0yOS45NTA2NDQ2MiAyMi44Mzc1NTI0MSAtMTIgMiBDLTguNDczMzg5NDMgLTAuNjQ0OTU3OTMgLTQuMjE5NTgzOTggLTAuOTU4OTk2MzYgMCAwIFogIiBmaWxsPSIjRkZDQzAwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MjgsMzcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzUuODg3MjkwNzMgMS40NDk4NTUxOCA5LjE2NjM4NTEzIDEuMjgxNTYyNTYgMTQuNzUgLTAuODM5ODQzNzUgQzIwLjM1Nzc0OTYyIC0yLjU0NjE0OTE0IDI1LjU0MDY3MjkyIC0xLjM4Mjk1NTEgMzAuNjI1IDEuMjUgQzMyLjkzNzM1MDYzIDMuMjczMzA2OCAzNC4xMDM0MzU0MiA0LjU3NzExOTE4IDM1LjEyNSA3LjQzNzUgQzM0LjM0MTI1IDguMTggMzMuNTU3NSA4LjkyMjUgMzIuNzUgOS42ODc1IEMyOS4xMTkwMTcwMyAxMy40OTEzODY5MiAyOC4yMzgzODk0NyAxNS4wMzE0NzA1OCAyNy44MTI1IDIwLjMxMjUgQzI3Ljk2MDg4MjA0IDI1LjAxNzA4MzQ0IDI5LjE5MzUzOTM2IDI4LjU3NDg0NDU4IDMyLjY2MDE1NjI1IDMxLjkxNzk2ODc1IEMzNC4xMDgzOTEwMSAzMy4xNDAyMzc4IDM1LjYxMjk3ODE1IDM0LjI5NTA4MzQ5IDM3LjEyNSAzNS40Mzc1IEMzNi4wNzAxOTM1MiA0Mi40Njk1NDMyIDMyLjAzNjA5MDQ5IDQ3Ljk3MzE5OTEgMjcuNzUgNTMuNSBDMjQuMjczODU5MzcgNTYuMDY1NzIyODUgMjEuNDA5Njc2NTkgNTYuNjI0MTU5MTggMTcuMTI1IDU2LjQzNzUgQzE1LjExMjc3OTUzIDU1LjgwODY4MTEgMTMuMTEyMjMyNjggNTUuMTQxMzExNTcgMTEuMTI1IDU0LjQzNzUgQzcuMTMyMjAwNjEgNTQuMDEwODUwMDcgMy44Njk5NzIwNCA1NC4xNzkwNDAzMSAwLjA2MjUgNTUuNSBDLTMuNzQ1OTgyNzYgNTYuNzE1NDczMjIgLTYuMDIwMDcxMDYgNTYuNDcwMDcwMjUgLTkuODc1IDU1LjQzNzUgQy0xNy44OTY4MjA0OCA1MC4zNjI0NzA3MiAtMjMuMjI0ODkxNjcgNDAuMjQ1NjM5MjYgLTI1LjQzMzU5Mzc1IDMxLjEzMjgxMjUgQy0yNi42OTE4Nzk2IDIzLjQ0OTQ3NDE1IC0yNy4zMTA4Njc4MiAxNC4yMDI1NjkzMiAtMjIuODc1IDcuNDM3NSBDLTE5LjE4NzExNTEzIDMuMTY0NjQwMjkgLTE0Ljk1ODc1MDk1IC0wLjQ2NDczMTYxIC05LjI2NTYyNSAtMS41NzQyMTg3NSBDLTYuMDIyMDAxNTYgLTEuNTU4MzE4NjQgLTMuMTQ1MDkxMDYgLTAuNzc5NDY1MjEgMCAwIFogIiBmaWxsPSIjMDAwMDAwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMjIuODc1LDU1LjU2MjUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzYuOTk4NjY1NzYgNi41NjU2MTQ1OCAxMy4yMzU0MjQ3IDEzLjIxNDc1OTU1IDE0LjE3OTY4NzUgMjMuMTg3NSBDMTMuOTYxMTk2MzQgMjguMjczOTc0MSAxMi4yNTY2NDk1NCAzMi4wNjY5ODMyNiA5LjAzNTE1NjI1IDM1Ljk3NjU2MjUgQzAuNTMzMzg4MDQgNDMuNTgzNDA3NzQgLTguOTc3NTY4MjUgNDUuMDAzODkwNjcgLTE5Ljg1NTQ2ODc1IDQ0Ljg5ODQzNzUgQy0yMS4xODA5NDcyNyA0NC44OTE2Njk5MiAtMjEuMTgwOTQ3MjcgNDQuODkxNjY5OTIgLTIyLjUzMzIwMzEyIDQ0Ljg4NDc2NTYyIEMtMjQuNzAzMTU0MzQgNDQuODczMDM2MTYgLTI2Ljg3MzA3MDQ3IDQ0Ljg1NTEwMjQ1IC0yOS4wNDI5Njg3NSA0NC44MzU5Mzc1IEMtMjkuMzcyOTY4NzUgNDUuNDk1OTM3NSAtMjkuNzAyOTY4NzUgNDYuMTU1OTM3NSAtMzAuMDQyOTY4NzUgNDYuODM1OTM3NSBDLTMyLjQxNzk2ODc1IDQ2Ljk2MDkzNzUgLTMyLjQxNzk2ODc1IDQ2Ljk2MDkzNzUgLTM1LjA0Mjk2ODc1IDQ2LjgzNTkzNzUgQy0zNy4wNDI5Njg3NSA0NC44MzU5Mzc1IC0zNy4wNDI5Njg3NSA0NC44MzU5Mzc1IC0zNy40MTQwNjI1IDQyLjM1NTQ2ODc1IEMtMzcuNzgyMzI5OTcgMzkuNzMzNjQ1MzEgLTM3Ljc4MjMyOTk3IDM5LjczMzY0NTMxIC0zOS44MjgxMjUgMzguNTM1MTU2MjUgQy00MC41Nzk2NDg0NCAzOC4yMDEyODkwNiAtNDEuMzMxMTcxODcgMzcuODY3NDIxODcgLTQyLjEwNTQ2ODc1IDM3LjUyMzQzNzUgQy00Ny4zNTI0NjU4MyAzNC44NTM3NjUzOCAtNTEuNDU1NzUyNzEgMzEuNTMwNDMxOTUgLTU1LjA0Mjk2ODc1IDI2LjgzNTkzNzUgQy01Ni4wNDI5Njg3NSAyMy4zMzU5Mzc1IC01Ni4wNDI5Njg3NSAyMy4zMzU5Mzc1IC01Ni4wNDI5Njg3NSAyMC44MzU5Mzc1IEMtNTEuMzM2NTk3OTUgMTYuMTI5NTY2NyAtNDUuMzAzOTE4MTcgMTQuNTc0NTc2MzMgLTM5LjA0Mjk2ODc1IDEyLjgzNTkzNzUgQy0zOC4zODI5Njg3NSAxMi44MzU5Mzc1IC0zNy43MjI5Njg3NSAxMi44MzU5Mzc1IC0zNy4wNDI5Njg3NSAxMi44MzU5Mzc1IEMtMzYuOTIxNzk2ODggMTEuOTA5MTAxNTYgLTM2LjgwMDYyNSAxMC45ODIyNjU2MiAtMzYuNjc1NzgxMjUgMTAuMDI3MzQzNzUgQy0zNi41MDgyMDMxMyA4LjgyOTgwNDY5IC0zNi4zNDA2MjUgNy42MzIyNjU2MyAtMzYuMTY3OTY4NzUgNi4zOTg0Mzc1IEMtMzYuMDA1NTQ2ODggNS4yMDM0NzY1NiAtMzUuODQzMTI1IDQuMDA4NTE1NjMgLTM1LjY3NTc4MTI1IDIuNzc3MzQzNzUgQy0zNS40NjY5NTMxMyAxLjgwNjY3OTY5IC0zNS4yNTgxMjUgMC44MzYwMTU2MyAtMzUuMDQyOTY4NzUgLTAuMTY0MDYyNSBDLTM0LjM4Mjk2ODc1IC0wLjQ5NDA2MjUgLTMzLjcyMjk2ODc1IC0wLjgyNDA2MjUgLTMzLjA0Mjk2ODc1IC0xLjE2NDA2MjUgQy0zMC4wNzc2OTExNyAxLjI4MTI3NiAtMjkuNDg3MTQ2NjEgMy4yODE5NjA5NyAtMjguODU1NDY4NzUgNy4wMjM0Mzc1IEMtMjguNjk2OTE0MDYgNy45MjQ0OTIxOSAtMjguNTM4MzU5MzggOC44MjU1NDY4OCAtMjguMzc1IDkuNzUzOTA2MjUgQy0yOC4yNjU0Mjk2OSAxMC40NDA5NzY1NiAtMjguMTU1ODU5MzcgMTEuMTI4MDQ2ODcgLTI4LjA0Mjk2ODc1IDExLjgzNTkzNzUgQy0yNy4xMjUxNTYyNSAxMS45MzM5MDYyNSAtMjYuMjA3MzQzNzUgMTIuMDMxODc1IC0yNS4yNjE3MTg3NSAxMi4xMzI4MTI1IEMtMTguMDQ1MDgyNTkgMTMuMDEyMTUwNTIgLTEyLjIzNzYzMDI1IDEzLjk0OTA5MTA3IC02LjA0Mjk2ODc1IDE3LjgzNTkzNzUgQy00LjY2MTcxODU3IDIwLjU5ODQzNzg2IC00Ljg1MjE3NTY5IDIyLjc4MzI0ODQ5IC01LjA0Mjk2ODc1IDI1LjgzNTkzNzUgQy03LjA0Mjk2ODc1IDI3LjgzNTkzNzUgLTcuMDQyOTY4NzUgMjcuODM1OTM3NSAtMTAuNjY3OTY4NzUgMjcuOTYwOTM3NSBDLTExLjc4MTcxODc1IDI3LjkxOTY4NzUgLTEyLjg5NTQ2ODc1IDI3Ljg3ODQzNzUgLTE0LjA0Mjk2ODc1IDI3LjgzNTkzNzUgQy0xMy4zODI5Njg3NSAyNi41MTU5Mzc1IC0xMi43MjI5Njg3NSAyNS4xOTU5Mzc1IC0xMi4wNDI5Njg3NSAyMy44MzU5Mzc1IEMtMTUuNzk1MjI3MTUgMjIuMTc5MDk2MTMgLTE5LjMwNjQ5OTM2IDIxLjMzMzg1NTg3IC0yMy4zNTU0Njg3NSAyMC43MTA5Mzc1IEMtMjUuMjMyMzQzNzUgMjAuNDIyMTg3NSAtMjcuMTA5MjE4NzUgMjAuMTMzNDM3NSAtMjkuMDQyOTY4NzUgMTkuODM1OTM3NSBDLTI4LjU0Nzk2ODc1IDI4LjI1MDkzNzUgLTI4LjU0Nzk2ODc1IDI4LjI1MDkzNzUgLTI4LjA0Mjk2ODc1IDM2LjgzNTkzNzUgQy0xMi4wNjE3Nzk5MSAzNy4zODI2NDE3MiAtMTIuMDYxNzc5OTEgMzcuMzgyNjQxNzIgMi4wODIwMzEyNSAzMC42NDg0Mzc1IEM0Ljc2MDcwNTQxIDI2LjYzMDQyNjI2IDQuNzc1MjY3NDcgMjMuNTI1MDYwNDMgMy45NTcwMzEyNSAxOC44MzU5Mzc1IEMxLjAxMTM1NTYzIDguNTI2MDcyODEgLTguODY3NTEyMiAyLjM4NDg3MDU4IC0xNy43MzQzNzUgLTIuNTYyNSBDLTMxLjY3NjMzMzk0IC05LjMxMTI2NDA3IC00NS42NDMxNzQyMiAtMTEuNTY4NzI4NjMgLTYxLjA0Mjk2ODc1IC0xMS4xNjQwNjI1IEMtNjEuMDQyOTY4NzUgLTEwLjE3NDA2MjUgLTYxLjA0Mjk2ODc1IC05LjE4NDA2MjUgLTYxLjA0Mjk2ODc1IC04LjE2NDA2MjUgQy02My4wMjI5Njg3NSAtOC4xNjQwNjI1IC02NS4wMDI5Njg3NSAtOC4xNjQwNjI1IC02Ny4wNDI5Njg3NSAtOC4xNjQwNjI1IEMtNjcuNzkyOTY4NzUgLTkuOTE0MDYyNSAtNjcuNzkyOTY4NzUgLTkuOTE0MDYyNSAtNjguMDQyOTY4NzUgLTEyLjE2NDA2MjUgQy02NS45Njg1NDMxOCAtMTUuNTIyNjU2MjggLTYzLjQ3ODY1NTM5IC0xNi41NTA0NzkzNSAtNTkuNzkyOTY4NzUgLTE3LjQ3NjU2MjUgQy0zOS4xODA0NTMyNSAtMjAuODM2MzExNzIgLTE1Ljg1MjQ2NDU2IC0xMy4zOTczMDI3NCAwIDAgWiBNLTQ3LjM1NTQ2ODc1IDIwLjgzNTkzNzUgQy00OC4yMzg0NzY1NiAyMS4wMjE1NjI1IC00OS4xMjE0ODQzOCAyMS4yMDcxODc1IC01MC4wMzEyNSAyMS4zOTg0Mzc1IEMtNTAuNjk1MTE3MTkgMjEuNTQyODEyNSAtNTEuMzU4OTg0MzcgMjEuNjg3MTg3NSAtNTIuMDQyOTY4NzUgMjEuODM1OTM3NSBDLTUyLjUwMDI0MDQ0IDI1LjcyNDc4Mzk5IC01Mi41MDAyNDA0NCAyNS43MjQ3ODM5OSAtNTAuNTAzOTA2MjUgMjcuNDY4NzUgQy00Ni40NjI2MDg1IDMwLjM1OTcxNTgxIC00Mi45NDE1MjEwNyAzMi42MTEyOTk0MiAtMzguMDQyOTY4NzUgMzMuODM1OTM3NSBDLTM2LjcwMzk1MDgzIDMyLjcyNDY3MDkxIC0zNi43MDM5NTA4MyAzMi43MjQ2NzA5MSAtMzYuOTQ1MzEyNSAyOS44OTQ1MzEyNSBDLTM2Ljk1NjkxNDA2IDI4LjY5OTU3MDMxIC0zNi45Njg1MTU2MyAyNy41MDQ2MDkzOCAtMzYuOTgwNDY4NzUgMjYuMjczNDM3NSBDLTM2Ljk4OTQ5MjE5IDI1LjA3NTg5ODQ0IC0zNi45OTg1MTU2MiAyMy44NzgzNTkzOCAtMzcuMDA3ODEyNSAyMi42NDQ1MzEyNSBDLTM3LjAxOTQxNDA2IDIxLjcxNzY5NTMxIC0zNy4wMzEwMTU2MyAyMC43OTA4NTkzNyAtMzcuMDQyOTY4NzUgMTkuODM1OTM3NSBDLTQwLjYzODE2MTY3IDE5LjczMjI5MjMgLTQzLjg0MDg2MTA3IDIwLjA4NjE1NDUzIC00Ny4zNTU0Njg3NSAyMC44MzU5Mzc1IFogIiBmaWxsPSIjMjIxRTIwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTEuMDQyOTY4NzUsNTguMTY0MDYyNSkiLz4KPHBhdGggZD0iTTAgMCBDMy4zIDAgNi42IDAgMTAgMCBDMTMuOTk1NTQ4MTcgOC40NTIxMjExMyAxNi45NDE0Njg4MSAxNy4xNzE5NjY3OSAyMCAyNiBDMjAuMzMgMTcuNDIgMjAuNjYgOC44NCAyMSAwIEMyNC42MyAwIDI4LjI2IDAgMzIgMCBDMzIgMTguNDggMzIgMzYuOTYgMzIgNTYgQzI4IDU3IDI4IDU3IDIwIDU3IEMxNy4zNiA0OS40MSAxNC43MiA0MS44MiAxMiAzNCBDMTEuNjcgNDIuMjUgMTEuMzQgNTAuNSAxMSA1OSBDNS41NTUgNTkuNDk1IDUuNTU1IDU5LjQ5NSAwIDYwIEMwIDQwLjIgMCAyMC40IDAgMCBaICIgZmlsbD0iI0Q4MUYyNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTk1LDUyKSIvPgo8cGF0aCBkPSJNMCAwIEMxLjE3MDQ2ODc1IDAuMDI3MDcwMzEgMi4zNDA5Mzc1IDAuMDU0MTQwNjMgMy41NDY4NzUgMC4wODIwMzEyNSBDNC40Mzg5MDYyNSAwLjExNjgzNTk0IDUuMzMwOTM3NSAwLjE1MTY0MDYyIDYuMjUgMC4xODc1IEM3LjUzODE4NzMxIDYuMjE4NDU0OTcgOC44MTk3NDQ4OSAxMi4yNTA3NjY0NyAxMC4wOTUyMTQ4NCAxOC4yODQ0MjM4MyBDMTAuNTI5OTIzMzUgMjAuMzM2MjQxNDggMTAuOTY2NDMxOTEgMjIuMzg3Njc4NjMgMTEuNDA0Nzg1MTYgMjQuNDM4NzIwNyBDMTIuMDM1MDI5NTggMjcuMzg5MTUwNjYgMTIuNjU4NzU5NzQgMzAuMzQwODk0MzcgMTMuMjgxMjUgMzMuMjkyOTY4NzUgQzEzLjQ3ODExNDAxIDM0LjIwNzczNDgzIDEzLjY3NDk3ODAzIDM1LjEyMjUwMDkyIDEzLjg3NzgwNzYyIDM2LjA2NDk4NzE4IEMxNC4wNTc5OTQzOCAzNi45MjU1MDE4NiAxNC4yMzgxODExNSAzNy43ODYwMTY1NCAxNC40MjM4MjgxMiAzOC42NzI2MDc0MiBDMTQuNTgzNzEyMTYgMzkuNDI1Mzk0NzQgMTQuNzQzNTk2MTkgNDAuMTc4MTgyMDcgMTQuOTA4MzI1MiA0MC45NTM3ODExMyBDMTUuMjUgNDMuMTg3NSAxNS4yNSA0My4xODc1IDE1LjI1IDQ4LjE4NzUgQzExLjI5IDQ4LjE4NzUgNy4zMyA0OC4xODc1IDMuMjUgNDguMTg3NSBDMi45MiA0NS44Nzc1IDIuNTkgNDMuNTY3NSAyLjI1IDQxLjE4NzUgQy0yLjcgNDEuNTE3NSAtNy42NSA0MS44NDc1IC0xMi43NSA0Mi4xODc1IEMtMTMuNDEgNDQuMTY3NSAtMTQuMDcgNDYuMTQ3NSAtMTQuNzUgNDguMTg3NSBDLTE5LjM3IDQ4LjE4NzUgLTIzLjk5IDQ4LjE4NzUgLTI4Ljc1IDQ4LjE4NzUgQy0yNi44MDgzMTEyNiA0Mi4yMDY0MzQ4NSAtMjQuNzAyMzE0NTggMzYuMzU1OTk3NzMgLTIyLjMxNjQwNjI1IDMwLjUzOTA2MjUgQy0yMS45OTcxOTcxMSAyOS43NTk4NTQ0MyAtMjEuNjc3OTg3OTggMjguOTgwNjQ2MzYgLTIxLjM0OTEwNTgzIDI4LjE3NzgyNTkzIEMtMjAuNjc5NDY4MTMgMjYuNTQ4NjI2IC0yMC4wMDc5ODYzNCAyNC45MjAxODI4OSAtMTkuMzM0NzE2OCAyMy4yOTI0ODA0NyBDLTE4LjY0OTcxMDY3IDIxLjYzMDYwMDMgLTE3Ljk3MDA3MDg4IDE5Ljk2NjQ5ODY1IC0xNy4yOTU2NTQzIDE4LjMwMDI5Mjk3IEMtMTYuMzEzOTk1MTggMTUuODc1MDE3NSAtMTUuMzE3MDg2OTUgMTMuNDU2NTQxMzggLTE0LjMxNjQwNjI1IDExLjAzOTA2MjUgQy0xNC4wMTgzNTU4NyAxMC4yOTUzMjM3OSAtMTMuNzIwMzA1NDggOS41NTE1ODUwOCAtMTMuNDEzMjIzMjcgOC43ODUzMDg4NCBDLTEwLjMyNjYxNzczIDEuNDMzOTIzMTMgLTcuOTE5NDc2MjUgLTAuMjM3NTg0MjkgMCAwIFogTS0zLjc1IDE1LjE4NzUgQy01LjQgMjAuMTM3NSAtNy4wNSAyNS4wODc1IC04Ljc1IDMwLjE4NzUgQy02LjExIDMwLjE4NzUgLTMuNDcgMzAuMTg3NSAtMC43NSAzMC4xODc1IEMtMS40MDM0OTYzMyAyMi42MzcxMTU3OCAtMS40MDM0OTYzMyAyMi42MzcxMTU3OCAtMi43NSAxNS4xODc1IEMtMy4wOCAxNS4xODc1IC0zLjQxIDE1LjE4NzUgLTMuNzUgMTUuMTg3NSBaICIgZmlsbD0iIzIzNDM5QSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjc1LDUzLjgxMjUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzIuNzg5Mjg3NzggMi4zMDgzNzYwOSAzLjc1MTc2ODg4IDQuMjY1OTI4MzQgNC4yNzM0Mzc1IDcuOTEwMTU2MjUgQzQuNjM2ODE4NzQgMTUuNjExMDQzMzQgMS45NDAyMDM5IDIxLjI4NjM5NDY0IC0yLjc5Njg3NSAyNy4yNjk1MzEyNSBDLTkuMDAxNDUwMzQgMzMuOTU4MDYzNDcgLTE1LjA5NjEwOTIxIDM3LjE0MTAyMzg5IC0yNC4yNSAzNy41IEMtMjguMDQyMTE1NTYgMzcuMzY0OTExOTEgLTI5Ljc2NDgxODA0IDM3LjEzMTcwMTkgLTMzLjEyNSAzNS4yNSBDLTM2LjYxNDUyNjY5IDMxLjA2MjU2Nzk3IC0zNy40NTgyNTE2IDI3Ljc5OTc2MzM3IC0zNy4zMDg1OTM3NSAyMi40Mjk2ODc1IEMtMzYuMzE4MDI0MjMgMTQuNjMwNTE5ODYgLTMxLjc1MTQwMDU4IDguMTU2MDQwNzUgLTI2IDMgQy0xNy42OTY1MDc2NiAtMi42NTI1NDYzMSAtOS4yMjAwNTQ5MyAtNS42NTc3NjA5OCAwIDAgWiAiIGZpbGw9IiMwNjg4MkYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNDUsNzkpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuNzQ5ODUzMjUgLTAuMDg3MTc0NyA3LjQ5OTQ0NTU1IC0wLjE0MDQ1MDAzIDExLjI1IC0wLjE4NzUgQzEyLjMxMzQ3NjU2IC0wLjIxMjYzNjcyIDEzLjM3Njk1MzEyIC0wLjIzNzc3MzQ0IDE0LjQ3MjY1NjI1IC0wLjI2MzY3MTg4IEMxNS40OTc0NjA5NCAtMC4yNzMzMzk4NCAxNi41MjIyNjU2MyAtMC4yODMwMDc4MSAxNy41NzgxMjUgLTAuMjkyOTY4NzUgQzE4LjUyMDc1MTk1IC0wLjMwODY3OTIgMTkuNDYzMzc4OTEgLTAuMzI0Mzg5NjUgMjAuNDM0NTcwMzEgLTAuMzQwNTc2MTcgQzIzLjU2MjEwMzM5IDAuMDc0NjIyNTkgMjQuODI1NjM1MDMgMC43MTY2NzQ2NSAyNyAzIEMyNy45MTMwODU5NCA1LjYzNTQ5ODA1IDI3LjkxMzA4NTk0IDUuNjM1NDk4MDUgMjguNDg0Mzc1IDguNzYxNzE4NzUgQzI4LjgwMzQxNzk3IDEwLjQzOTExMTMzIDI4LjgwMzQxNzk3IDEwLjQzOTExMTMzIDI5LjEyODkwNjI1IDEyLjE1MDM5MDYyIEMyOS4zMzM4NjcxOSAxMy4zMTc2MzY3MiAyOS41Mzg4MjgxMiAxNC40ODQ4ODI4MSAyOS43NSAxNS42ODc1IEMyOS45NzA0Mjk2OSAxNi44NjYzNDc2NiAzMC4xOTA4NTkzOCAxOC4wNDUxOTUzMSAzMC40MTc5Njg3NSAxOS4yNTk3NjU2MiBDMzAuOTYwMTAyNjQgMjIuMTcwNzg4OTEgMzEuNDg2NzY4MjIgMjUuMDgzNzY2MzEgMzIgMjggQzM1LjA3NTc1MDg3IDIxLjMyMzQ4NDU3IDM4LjA0NTYyMTcyIDE0LjYyMjgwNzQ2IDQwLjgxMjUgNy44MTI1IEM0MS4xMjM4MDg1OSA3LjA1MTMwODU5IDQxLjQzNTExNzE5IDYuMjkwMTE3MTkgNDEuNzU1ODU5MzggNS41MDU4NTkzOCBDNDIuNTA1ODE1MTcgMy42NzEzNTIxMyA0My4yNTMxOTk4MiAxLjgzNTc5NDExIDQ0IDAgQzQ4LjI5IDAgNTIuNTggMCA1NyAwIEM1NS44NzQ5NzQ1OCA2Ljc1MDE1MjU0IDU1Ljg3NDk3NDU4IDYuNzUwMTUyNTQgNTQuMzQxNzk2ODggMTAuMzIxMjg5MDYgQzU0LjAwNDc0NzMxIDExLjExNTIxMDU3IDUzLjY2NzY5Nzc1IDExLjkwOTEzMjA4IDUzLjMyMDQzNDU3IDEyLjcyNzExMTgyIEM1Mi45NTY4Nzg2NiAxMy41NjQ4MjExNyA1Mi41OTMzMjI3NSAxNC40MDI1MzA1MiA1Mi4yMTg3NSAxNS4yNjU2MjUgQzUxLjg0NTIwMzg2IDE2LjE0MDIzMzc2IDUxLjQ3MTY1NzcxIDE3LjAxNDg0MjUzIDUxLjA4Njc5MTk5IDE3LjkxNTk1NDU5IEM0OS44OTczNDQ2IDIwLjY5NjY1Mjc4IDQ4LjY5ODc0NTQ1IDIzLjQ3MzI5OTM5IDQ3LjUgMjYuMjUgQzQ2LjY5MzQyMDAxIDI4LjEzMjU1OTY1IDQ1Ljg4NzQyNDAyIDMwLjAxNTM2OTYzIDQ1LjA4MjAzMTI1IDMxLjg5ODQzNzUgQzQzLjYxMDkxMDIyIDM1LjMzMjU2NDA1IDQyLjEzODAzMjE4IDM4Ljc2NTkwNDg3IDQwLjY1ODIwMzEyIDQyLjE5NjI4OTA2IEM0MC4zNjE0MzY3NyA0Mi44ODQzNDYzMSA0MC4wNjQ2NzA0MSA0My41NzI0MDM1NiAzOS43NTg5MTExMyA0NC4yODEzMTEwNCBDMzkuMjA1MDIxMiA0NS41MzU2OTMxMSAzOC42MTMyMzIxNyA0Ni43NzM1MzU2NyAzOCA0OCBDMzMuMzggNDggMjguNzYgNDggMjQgNDggQzIzLjcxODAxNzU4IDQ2Ljg2OTgxNDQ1IDIzLjQzNjAzNTE2IDQ1LjczOTYyODkxIDIzLjE0NTUwNzgxIDQ0LjU3NTE5NTMxIEMyMi4wOTM1MjM1MyA0MC4zNzQ2MTE1MyAyMS4wMjMxNzA3NiAzNi4xNzg4ODk2NSAxOS45NDcyNjU2MiAzMS45ODQzNzUgQzE5LjQ4NDU3MjAzIDMwLjE2OTg5MDMxIDE5LjAyNjgzOTQ1IDI4LjM1NDEzMjkyIDE4LjU3NDIxODc1IDI2LjUzNzEwOTM4IEMxNy45MjE5MzU4OSAyMy45MjIyNTYxNiAxNy4yNTE4MjE4MSAyMS4zMTI1MzE3MyAxNi41NzgxMjUgMTguNzAzMTI1IEMxNi4yODA5ODYwMiAxNy40ODcyODcyOSAxNi4yODA5ODYwMiAxNy40ODcyODcyOSAxNS45Nzc4NDQyNCAxNi4yNDY4ODcyMSBDMTQuODEwMjA5MzQgMTEuODA0OTMzNDYgMTMuNzk5Njc2MzYgOC44OTA1NzQxMSAxMCA2IEM3LjQ0MzcyNDc1IDQuODk3OTA2NjcgNy40NDM3MjQ3NSA0Ljg5NzkwNjY3IDQuNzUgNC4yNSBDMy44NTc5Njg3NSA0LjAwNzY1NjI1IDIuOTY1OTM3NSAzLjc2NTMxMjUgMi4wNDY4NzUgMy41MTU2MjUgQzEuMzcxNDA2MjUgMy4zNDU0Njg3NSAwLjY5NTkzNzUgMy4xNzUzMTI1IDAgMyBDMCAyLjAxIDAgMS4wMiAwIDAgWiAiIGZpbGw9IiMyMTI5NjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM2LDU0KSIvPgo8cGF0aCBkPSJNMCAwIEMzLjYzIDAgNy4yNiAwIDExIDAgQzE1IDkuNjI1IDE1IDkuNjI1IDE1IDEzIEMxNS42NiAxMyAxNi4zMiAxMyAxNyAxMyBDMTcuMTkzMzU5MzggMTIuMzk2NzE4NzUgMTcuMzg2NzE4NzUgMTEuNzkzNDM3NSAxNy41ODU5Mzc1IDExLjE3MTg3NSBDMTcuODQ2MzI4MTIgMTAuMzcyNjU2MjUgMTguMTA2NzE4NzUgOS41NzM0Mzc1IDE4LjM3NSA4Ljc1IEMxOC43NTc4NTE1NiA3LjU2NjY0MDYyIDE4Ljc1Nzg1MTU2IDcuNTY2NjQwNjIgMTkuMTQ4NDM3NSA2LjM1OTM3NSBDMjAgNCAyMCA0IDIyIDAgQzI1LjYzIDAgMjkuMjYgMCAzMyAwIEMzMS42MTIzNzc3OCA0LjQ4OTM2NjAxIDMwLjA5OTAyNzU4IDguODM1MTMyMDUgMjguMjA3MDMxMjUgMTMuMTM2NzE4NzUgQzI3LjcyNjY1NDA1IDE0LjI0Mjg1NTIyIDI3LjcyNjY1NDA1IDE0LjI0Mjg1NTIyIDI3LjIzNjU3MjI3IDE1LjM3MTMzNzg5IEMyNi41ODgzNzkzNiAxNi44NTIwMjc5OSAyNS45MjY0NjI4MyAxOC4zMjY4MDAwNiAyNS4yNDk3NTU4NiAxOS43OTQ2Nzc3MyBDMjEuMjM0Nzg2MTQgMjkuMDI3NTEyNzMgMjUuMDc1MDY3NzkgMzYuMzYzMTg5NTkgMjguNTYyNSA0NS4yNSBDMjkuNDAxNTk1MTQgNDcuMzk5MzA1OTEgMzAuMjM2NDQwNzggNDkuNTUwMjc3MTYgMzEuMDY2NDA2MjUgNTEuNzAzMTI1IEMzMS40MzcwOTIyOSA1Mi42NDgzMzAwOCAzMS44MDc3NzgzMiA1My41OTM1MzUxNiAzMi4xODk2OTcyNyA1NC41NjczODI4MSBDMzMgNTcgMzMgNTcgMzMgNjAgQzMxLjU2MTYzMjQ5IDU5Ljg4NTQxMzA3IDMwLjEyNDI5MDM0IDU5Ljc1NzkwODg0IDI4LjY4NzUgNTkuNjI1IEMyNy44ODY5OTIxOSA1OS41NTUzOTA2MyAyNy4wODY0ODQzOCA1OS40ODU3ODEyNSAyNi4yNjE3MTg3NSA1OS40MTQwNjI1IEMyNCA1OSAyNCA1OSAyMSA1NyBDMTkuNjEzMjgxMjUgNTMuOTYwOTM3NSAxOS42MTMyODEyNSA1My45NjA5Mzc1IDE4LjMxMjUgNTAuMzc1IEMxNy44NzU1MDc4MSA0OS4xODY0ODQzNyAxNy40Mzg1MTU2MyA0Ny45OTc5Njg3NSAxNi45ODgyODEyNSA0Ni43NzM0Mzc1IEMxNi42NjIxNDg0NCA0NS44NTgyMDMxMyAxNi4zMzYwMTU2MyA0NC45NDI5Njg3NSAxNiA0NCBDMTQuMjExNzgyMjYgNDYuNjgyMzI2NjEgMTIuNzk4NTczOTYgNDkuMzAyODg5NjEgMTEuMzc1IDUyLjE4NzUgQzEwLjkyODk4NDM4IDUzLjA4ODU1NDY5IDEwLjQ4Mjk2ODc1IDUzLjk4OTYwOTM4IDEwLjAyMzQzNzUgNTQuOTE3OTY4NzUgQzkuNjg1NzAzMTIgNTUuNjA1MDM5MDYgOS4zNDc5Njg3NSA1Ni4yOTIxMDkzNyA5IDU3IEM1LjcgNTYuNjcgMi40IDU2LjM0IC0xIDU2IEMtMC4zOTQ5ODQ5MyA0OS4xNzY3NzQ1NCAyLjkyNjY1MjAyIDQzLjQ2Njc3Nzg3IDUuOTM3NSAzNy40MzE2NDA2MiBDOC40NDU2MTQ0IDMyLjE0NzgyNjM3IDkuNzA2Nzk0NDIgMjguODM0MjUxNjYgOCAyMyBDNi43NTQ5MDE0NiAxOS41MzQxMTc5NSA1LjM3Mjc0NjExIDE2LjE0MTA0NzgxIDMuOTM3NSAxMi43NSBDMy4xOTE5Mjc4NyAxMC45NzU5MjA2OSAyLjQ1MDgyOTQ5IDkuMTk5OTUyNjcgMS43MTQ4NDM3NSA3LjQyMTg3NSBDMS4zODYwNTIyNSA2LjY0NDI0ODA1IDEuMDU3MjYwNzQgNS44NjY2MjEwOSAwLjcxODUwNTg2IDUuMDY1NDI5NjkgQzAgMyAwIDMgMCAwIFogIiBmaWxsPSIjRDgxRTI1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTgzLDUyKSIvPgo8cGF0aCBkPSJNMCAwIEMtMC42NiAzLjYzIC0xLjMyIDcuMjYgLTIgMTEgQy0yLjgyNSAxMC44MzUgLTMuNjUgMTAuNjcgLTQuNSAxMC41IEMtMTEuNDA5NDk0MjQgOS40MzI1NTU0MyAtMTEuNDA5NDk0MjQgOS40MzI1NTU0MyAtMTggMTEgQy0xNy45MDQ4MDU0NiAxMi44OTU3NjM2NiAtMTcuOTA0ODA1NDYgMTIuODk1NzYzNjYgLTE3IDE1IEMtMTQuNTcyODYxMyAxNi44NzM4MTgyMSAtMTQuNTcyODYxMyAxNi44NzM4MTgyMSAtMTEuNjI1IDE4LjUgQy03LjkzODczNzE5IDIwLjYzOTc4MzE2IC01LjIyOTM2OTIyIDIyLjMxNTc1MDIyIC0zIDI2IEMtMS41MDg4MTc1MSAzMS42NDUxOTA4NSAtMi4xNzg0MTgzNiAzNC45MjExNTMwNiAtNSA0MCBDLTkuMzQ2NDcyNTcgNDUuMTQ3MTM4NTcgLTEzLjQ5MjA4MjkgNDcuMDc2ODA4NDEgLTIwLjEyNSA0Ny43NSBDLTI1Ljk4NTQzMDQyIDQ4LjIyMDQyOTExIC0zMS4zMDM1NDk3NiA0Ny4zMzMyMTE3NiAtMzcgNDYgQy0zOC4wOTg5ODcwMiA0Mi43MDMwMzg5NSAtMzcuODcxMjQ0NDQgNDEuNTk1MDUwOTcgLTM3LjA2MjUgMzguMzEyNSBDLTM2Ljg2Nzg1MTU2IDM3LjUwNDI1NzgxIC0zNi42NzMyMDMxMyAzNi42OTYwMTU2MyAtMzYuNDcyNjU2MjUgMzUuODYzMjgxMjUgQy0zNi4zMTY2Nzk2OSAzNS4yNDgzOTg0NCAtMzYuMTYwNzAzMTIgMzQuNjMzNTE1NjMgLTM2IDM0IEMtMzQuODQ1IDM0LjMzIC0zMy42OSAzNC42NiAtMzIuNSAzNSBDLTI4LjE4MjA3NzU3IDM2LjA3MzcyODQ5IC0yNC40NDM3NDM0NCAzNi4zMDEyNzA3NCAtMjAgMzYgQy0xOS4wMSAzNS4zNCAtMTguMDIgMzQuNjggLTE3IDM0IEMtMTcuMTc4MjU1OTkgMzIuMDY3MDg1MjEgLTE3LjE3ODI1NTk5IDMyLjA2NzA4NTIxIC0xOCAzMCBDLTE5LjkwMzM3ODEzIDI4LjYwODcxNTU2IC0xOS45MDMzNzgxMyAyOC42MDg3MTU1NiAtMjIuMjUgMjcuNTYyNSBDLTMxLjA3MTA4MzE3IDIyLjkxMzE3MTEzIC0zMS4wNzEwODMxNyAyMi45MTMxNzExMyAtMzIuNjYwMTU2MjUgMTcuOTI5Njg3NSBDLTMzLjUwOTcyNjg3IDEzLjA2MzIxNTAxIC0zMy4wODExMzgwMSA5LjYxMDg4NDM3IC0zMC4yOTI5Njg3NSA1LjUgQy0yMi4zNjg4Mzc3IC0zLjY5Mjk0OTYyIC0xMC42NjIyMzUzMyAtMi42NjU1NTg4MyAwIDAgWiAiIGZpbGw9IiMyMjM5ODUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0Niw1NSkiLz4KPHBhdGggZD0iTTAgMCBDNC4yNTM4MDEzOCAxLjUxOTIxNDc4IDUuODUwNjA1NjkgNC4xMzEwOTAyNCA4IDggQzEwLjIxNjIxNjM0IDE0LjEzODE3MjIyIDExLjE3ODUwNDM3IDIwLjIzMzA3NjcgOC41NjI1IDI2LjM3NSBDNyAyOSA3IDI5IDYgMzAgQzMuNjM2NzE4NzUgMzAuMjk2ODc1IDMuNjM2NzE4NzUgMzAuMjk2ODc1IDEgMzAgQy0wLjczMDQ2ODc1IDI4LjM5MDYyNSAtMC43MzA0Njg3NSAyOC4zOTA2MjUgLTIuMTg3NSAyNi4yNSBDLTIuOTIwMzMyMDMgMjUuMjA1ODU5MzggLTIuOTIwMzMyMDMgMjUuMjA1ODU5MzggLTMuNjY3OTY4NzUgMjQuMTQwNjI1IEMtNC45MTMwODMwNCAyMi4xMzk2Nzg4OCAtNS45ODkwNDQ2MiAyMC4xMjczMTg0MyAtNyAxOCBDLTcuMTk5MTYwMTYgMTkuMjY0NTcwMzEgLTcuMTk5MTYwMTYgMTkuMjY0NTcwMzEgLTcuNDAyMzQzNzUgMjAuNTU0Njg3NSBDLTcuNTc4OTQ1MzEgMjEuNjUwMzkwNjIgLTcuNzU1NTQ2ODggMjIuNzQ2MDkzNzUgLTcuOTM3NSAyMy44NzUgQy04LjExMTUyMzQ0IDI0Ljk2NTU0Njg4IC04LjI4NTU0Njg4IDI2LjA1NjA5Mzc1IC04LjQ2NDg0Mzc1IDI3LjE3OTY4NzUgQy05IDMwIC05IDMwIC0xMCAzMiBDLTExLjg3NSAzMS43NSAtMTEuODc1IDMxLjc1IC0xNCAzMSBDLTE1LjI1IDI4LjkzNzUgLTE1LjI1IDI4LjkzNzUgLTE2IDI3IEMtMTYuNDMzMTI1IDI3LjQ3NDM3NSAtMTYuODY2MjUgMjcuOTQ4NzUgLTE3LjMxMjUgMjguNDM3NSBDLTIxLjI2ODUzMTg1IDMyLjEwMDQ5MjQ1IC0yNi43NTQ4NDI1IDMxLjMyNjM3NjY4IC0zMS44MjAzMTI1IDMxLjI4MTI1IEMtMzYuMjA3MDY0MDkgMzAuODkzMjMyNjYgLTM3LjkwMzMwOTI4IDMwLjA5NjY5MDcyIC00MSAyNyBDLTQyLjU2MjUgMjQuNSAtNDIuNTYyNSAyNC41IC00MyAyMiBDLTQxLjYyNSAxOS42ODc1IC00MS42MjUgMTkuNjg3NSAtNDAgMTggQy00MS4zMiAxNy4wMSAtNDIuNjQgMTYuMDIgLTQ0IDE1IEMtNDQgMTEuNzUgLTQ0IDExLjc1IC00MyA4IEMtMzcuODIzNzMwOTQgMy44MDUyMDc0OSAtMzIuMDE2MTEwNTQgMy40NTA1OTcyMiAtMjUuNjI1IDMuNjg3NSBDLTI0LjgxOTMzNTk0IDMuNjk3MTY3OTcgLTI0LjAxMzY3MTg4IDMuNzA2ODM1OTQgLTIzLjE4MzU5Mzc1IDMuNzE2Nzk2ODggQy0xNy4zNDEzMjczMSAzLjgyOTMzNjM1IC0xNy4zNDEzMjczMSAzLjgyOTMzNjM1IC0xNSA1IEMtMTUuMzEyNSA2LjkzNzUgLTE1LjMxMjUgNi45Mzc1IC0xNiA5IEMtMjAuMjg5NzAxMzQgMTAuNDI5OTAwNDUgLTI0LjU3MTM0MzI0IDEwLjQzODEyMTc2IC0yOS4wNjY0MDYyNSAxMC43MTg3NSBDLTMxLjkzMTY1NzQ2IDEwLjgxNTkwNjYxIC0zMS45MzE2NTc0NiAxMC44MTU5MDY2MSAtMzQgMTIgQy0zMy4wMzU3ODEyNSAxMi4xMDk1NzAzMSAtMzIuMDcxNTYyNSAxMi4yMTkxNDA2MiAtMzEuMDc4MTI1IDEyLjMzMjAzMTI1IEMtMjkuODE0ODQzNzUgMTIuNDkwNTg1OTQgLTI4LjU1MTU2MjUgMTIuNjQ5MTQwNjMgLTI3LjI1IDEyLjgxMjUgQy0yNS4zNzA1NDY4NyAxMy4wMzg3MzA0NyAtMjUuMzcwNTQ2ODcgMTMuMDM4NzMwNDcgLTIzLjQ1MzEyNSAxMy4yNjk1MzEyNSBDLTIwLjA1NDQ1OTUzIDEzLjk4ODQ3OTcxIC0xOC40MjUxMDM5MSAxNC41NjkwMDk5MSAtMTYgMTcgQy0xNS42NyAxNy45OSAtMTUuMzQgMTguOTggLTE1IDIwIEMtMTQuODc4ODI4MTMgMTkuMzI0NTMxMjUgLTE0Ljc1NzY1NjI1IDE4LjY0OTA2MjUgLTE0LjYzMjgxMjUgMTcuOTUzMTI1IEMtMTQuNDY1MjM0MzggMTcuMDYxMDkzNzUgLTE0LjI5NzY1NjI1IDE2LjE2OTA2MjUgLTE0LjEyNSAxNS4yNSBDLTEzLjk2MjU3ODEzIDE0LjM2ODI4MTI1IC0xMy44MDAxNTYyNSAxMy40ODY1NjI1IC0xMy42MzI4MTI1IDEyLjU3ODEyNSBDLTEzLjAzMjAzNzM2IDEwLjEzMDUyMjU2IC0xMi4yMjAwMjg4MyA4LjE5NDAwMTQzIC0xMSA2IEMtOC43Njk1MzEyNSA2LjEyMTA5Mzc1IC04Ljc2OTUzMTI1IDYuMTIxMDkzNzUgLTYgNyBDLTMuNzYxNzE4NzUgOS43MjI2NTYyNSAtMy43NjE3MTg3NSA5LjcyMjY1NjI1IC0xLjY4NzUgMTMuMDYyNSBDLTAuOTkwMTE3MTkgMTQuMTY3MjI2NTYgLTAuMjkyNzM0MzggMTUuMjcxOTUzMTIgMC40MjU3ODEyNSAxNi40MTAxNTYyNSBDMS4yMDUwMTk1MyAxNy42OTIxMjg5MSAxLjIwNTAxOTUzIDE3LjY5MjEyODkxIDIgMTkgQzEuODAwODM5ODQgMTcuODA1MDM5MDYgMS44MDA4Mzk4NCAxNy44MDUwMzkwNiAxLjU5NzY1NjI1IDE2LjU4NTkzNzUgQzEuMDY1MTA0MTcgMTMuMzkwNjI1IDAuNTMyNTUyMDggMTAuMTk1MzEyNSAwIDcgQy0wLjIwNzUzOTA2IDUuODk5MTQwNjMgLTAuNDE1MDc4MTMgNC43OTgyODEyNSAtMC42Mjg5MDYyNSAzLjY2NDA2MjUgQy0wLjc1MTM2NzE5IDIuNzg0OTIxODcgLTAuODczODI4MTMgMS45MDU3ODEyNSAtMSAxIEMtMC42NyAwLjY3IC0wLjM0IDAuMzQgMCAwIFogTS0yOCAxOCBDLTI2LjE4Nzc3NDY2IDIwLjA2MjQ5OTQgLTI2LjE4Nzc3NDY2IDIwLjA2MjQ5OTQgLTI0IDIyIEMtMjMuMDEgMjIgLTIyLjAyIDIyIC0yMSAyMiBDLTIxLjMzIDIxLjAxIC0yMS42NiAyMC4wMiAtMjIgMTkgQy0yNC45NyAxOC41MDUgLTI0Ljk3IDE4LjUwNSAtMjggMTggWiBNLTM5IDIyIEMtMzkgMjIuNjYgLTM5IDIzLjMyIC0zOSAyNCBDLTM2LjAzIDI0LjMzIC0zMy4wNiAyNC42NiAtMzAgMjUgQy0zMi4zNTk2ODc0NCAyMi45MDI1MDAwNSAtMzMuNTQ2MTY5OTQgMjIuMDMwOTQyOTYgLTM2Ljc1IDIxLjgxMjUgQy0zNy40OTI1IDIxLjg3NDM3NSAtMzguMjM1IDIxLjkzNjI1IC0zOSAyMiBaICIgZmlsbD0iIzIyMUUyMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjIwLDY3KSIvPgo8cGF0aCBkPSJNMCAwIEMyLjA1NDY4NzUgLTAuMTk5MjE4NzUgMi4wNTQ2ODc1IC0wLjE5OTIxODc1IDUuODY3MTg3NSAwLjM2MzI4MTI1IEM4LjI4Mjg5NDcyIDIuNDI4NzM2NjggMTAuMDk2NDE2NDkgNC43MzM5NTQ2IDExLjg2NzE4NzUgNy4zNjMyODEyNSBDMTIuMTQ5NDkyMTkgNi44NDYzNjcxOSAxMi40MzE3OTY4NyA2LjMyOTQ1MzEzIDEyLjcyMjY1NjI1IDUuNzk2ODc1IEMxNC4yNzE2ODgxMyAzLjQ3NTU5ODQ4IDE1LjU3MTg3NDIgMS45NzEyNTAyOCAxNy44NjcxODc1IDAuMzYzMjgxMjUgQzI2LjQ3NDM3MzUgLTAuNzg0MzQzNTUgMzQuOTQxNzAyNzcgMi4yOTMwNDg0MyA0Mi44NjcxODc1IDUuMzYzMjgxMjUgQzQxLjE2MTc1MzAxIDkuMTA0MjM0MzIgMzkuMjkzODYwOCAxMS4wMjMxMTQxMiAzNS44NjcxODc1IDEzLjM2MzI4MTI1IEMzNC44NzcxODc1IDEzLjM2MzI4MTI1IDMzLjg4NzE4NzUgMTMuMzYzMjgxMjUgMzIuODY3MTg3NSAxMy4zNjMyODEyNSBDMzIuMjA3MTg3NSAxMi4zNzMyODEyNSAzMS41NDcxODc1IDExLjM4MzI4MTI1IDMwLjg2NzE4NzUgMTAuMzYzMjgxMjUgQzI4LjY3MjY0MDY5IDkuNzgzMzQ0MjYgMjguNjcyNjQwNjkgOS43ODMzNDQyNiAyNi4yNDIxODc1IDkuNjc1NzgxMjUgQzI1LjQyNDkyMTg4IDkuNjEwMDM5MDYgMjQuNjA3NjU2MjUgOS41NDQyOTY4OCAyMy43NjU2MjUgOS40NzY1NjI1IEMyMi44MjU4OTg0NCA5LjQyMDQ4ODI4IDIyLjgyNTg5ODQ0IDkuNDIwNDg4MjggMjEuODY3MTg3NSA5LjM2MzI4MTI1IEMyMS43NTg4NzYwNCA5Ljk5OTk5MjUyIDIxLjY1MDU2NDU4IDEwLjYzNjcwMzggMjEuNTM4OTcwOTUgMTEuMjkyNzA5MzUgQzIwLjQxMzg1NTQzIDE3Ljg5NjI5MTI1IDE5LjI3NjQ4MDM1IDI0LjQ5NzY3NjE0IDE4LjEzMTgzNTk0IDMxLjA5NzkwMDM5IEMxNy43MDU4MDczNiAzMy41NjQxNTA1NiAxNy4yODI5NDkwNyAzNi4wMzA5NTA1MSAxNi44NjMyODEyNSAzOC40OTgyOTEwMiBDMTYuMjYwODYwODcgNDIuMDM2ODAwMzYgMTUuNjQ3MjEwNTMgNDUuNTczMjAwOSAxNS4wMzEyNSA0OS4xMDkzNzUgQzE0Ljg0NDcwODU2IDUwLjIxOTc3NjQ2IDE0LjY1ODE2NzExIDUxLjMzMDE3NzkyIDE0LjQ2NTk3MjkgNTIuNDc0MjI3OTEgQzE0LjI4NTkzNzE5IDUzLjQ5NTIxMDcyIDE0LjEwNTkwMTQ5IDU0LjUxNjE5MzU0IDEzLjkyMDQxMDE2IDU1LjU2ODExNTIzIEMxMy42ODcyNDU5NCA1Ni45MjM3OTg2IDEzLjY4NzI0NTk0IDU2LjkyMzc5ODYgMTMuNDQ5MzcxMzQgNTguMzA2ODY5NTEgQzEzLjI1NzI1MDY3IDU4Ljk4NTQ4NTM4IDEzLjA2NTEzIDU5LjY2NDEwMTI2IDEyLjg2NzE4NzUgNjAuMzYzMjgxMjUgQzExLjg3NzE4NzUgNjAuODU4MjgxMjUgMTEuODc3MTg3NSA2MC44NTgyODEyNSAxMC44NjcxODc1IDYxLjM2MzI4MTI1IEM5LjU4MDQ1Mjg0IDU0LjQ1OTA5MjQzIDguMjk5Mjc3MDIgNDcuNTUzODg4ODYgNy4wMjE5NzI2NiA0MC42NDc5NDkyMiBDNi41ODY3MzE3NyAzOC4yOTg0Mjc0MSA2LjE1MDIxNTc5IDM1Ljk0OTE0MTQ1IDUuNzEyNDAyMzQgMzMuNjAwMDk3NjYgQzUuMDgzNTYyMzcgMzAuMjI0ODk1MzcgNC40NTkzMDI5NCAyNi44NDg4NzMzNSAzLjgzNTkzNzUgMjMuNDcyNjU2MjUgQzMuNTQwNjQxNDggMjEuODk1OTAxMTggMy41NDA2NDE0OCAyMS44OTU5MDExOCAzLjIzOTM3OTg4IDIwLjI4NzI5MjQ4IEMzLjA1OTE5MzEyIDE5LjMwNjU3Nzc2IDIuODc5MDA2MzUgMTguMzI1ODYzMDQgMi42OTMzNTkzOCAxNy4zMTU0Mjk2OSBDMi41MzM0NzUzNCAxNi40NTM4MzI0IDIuMzczNTkxMzEgMTUuNTkyMjM1MTEgMi4yMDg4NjIzIDE0LjcwNDUyODgxIEMxLjg2NzE4NzUgMTIuMzYzMjgxMjUgMS44NjcxODc1IDEyLjM2MzI4MTI1IDEuODY3MTg3NSA4LjM2MzI4MTI1IEMtMS43NjI4MTI1IDkuMDIzMjgxMjUgLTUuMzkyODEyNSA5LjY4MzI4MTI1IC05LjEzMjgxMjUgMTAuMzYzMjgxMjUgQy05LjQ2MjgxMjUgMTEuMzUzMjgxMjUgLTkuNzkyODEyNSAxMi4zNDMyODEyNSAtMTAuMTMyODEyNSAxMy4zNjMyODEyNSBDLTE1LjA4OTc3ODMxIDEyLjEyNDAzOTggLTE3LjI0OTM5NzE2IDEwLjU3NzUwMzY3IC0yMC4xMzI4MTI1IDYuMzYzMjgxMjUgQy0xMy40NzU0Nzc3IDMuMTIxMTc0OTQgLTcuMjY2ODA3MzkgMS4yMzc3NTI5MSAwIDAgWiAiIGZpbGw9IiNFODIwMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3NzUuMTMyODEyNSwzNS42MzY3MTg3NSkiLz4KPHBhdGggZD0iTTAgMCBDOC41OCAwIDE3LjE2IDAgMjYgMCBDMjYgMy4zIDI2IDYuNiAyNiAxMCBDMjAuNzIgMTAgMTUuNDQgMTAgMTAgMTAgQzEwIDEzLjYzIDEwIDE3LjI2IDEwIDIxIEMxMy45NiAyMSAxNy45MiAyMSAyMiAyMSBDMjIgMjQuMyAyMiAyNy42IDIyIDMxIEMxOC4wNCAzMSAxNC4wOCAzMSAxMCAzMSBDMTAgMzUuMjkgMTAgMzkuNTggMTAgNDQgQzE3LjkyIDQzLjUwNSAxNy45MiA0My41MDUgMjYgNDMgQzI2IDQ2LjMgMjYgNDkuNiAyNiA1MyBDMjIuODY0NjI0MDIgNTQuMDQ1MTI1MzMgMjAuMjI4NTQ5MDIgNTQuMzE1Mzc3MTMgMTYuOTM3NSA1NC41NjI1IEMxNS44NzQwMjM0NCA1NC42NDYyODkwNiAxNC44MTA1NDY4OCA1NC43MzAwNzgxMyAxMy43MTQ4NDM3NSA1NC44MTY0MDYyNSBDOS4xNDgzOTI5NSA1NS4wNDIwODc4NCA0LjU3MjAyNDE4IDU1IDAgNTUgQzAgMzYuODUgMCAxOC43IDAgMCBaICIgZmlsbD0iI0Q4MUUyNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAzNSw1MikiLz4KPHBhdGggZD0iTTAgMCBDMS45MTAxNTYyNSAwLjgyMDMxMjUgMS45MTAxNTYyNSAwLjgyMDMxMjUgNC41MzUxNTYyNSAyLjMyMDMxMjUgQzQuNTM1MTU2MjUgNC45NjAzMTI1IDQuNTM1MTU2MjUgNy42MDAzMTI1IDQuNTM1MTU2MjUgMTAuMzIwMzEyNSBDMS43NzIzOTQ0OCA5Ljc5NzYyNzg0IC0wLjc5MDkzMTM1IDkuMjExNjE2NjMgLTMuNDY0ODQzNzUgOC4zMjAzMTI1IEMtNS4wMjYwMjgwMyA4LjI1MjkwMzg1IC02LjU4OTg2ODk1IDguMjM1MTY3OTQgLTguMTUyMzQzNzUgOC4yNTc4MTI1IEMtOC45NjA1ODU5NCA4LjI2NjgzNTk0IC05Ljc2ODgyODEzIDguMjc1ODU5MzcgLTEwLjYwMTU2MjUgOC4yODUxNTYyNSBDLTExLjIxNjQ0NTMxIDguMjk2NzU3ODEgLTExLjgzMTMyODEzIDguMzA4MzU5MzggLTEyLjQ2NDg0Mzc1IDguMzIwMzEyNSBDLTEyLjc5NDg0Mzc1IDkuMzEwMzEyNSAtMTMuMTI0ODQzNzUgMTAuMzAwMzEyNSAtMTMuNDY0ODQzNzUgMTEuMzIwMzEyNSBDLTEyLjU4NDQxNDA2IDExLjcwNzAzMTI1IC0xMS43MDM5ODQzNyAxMi4wOTM3NSAtMTAuNzk2ODc1IDEyLjQ5MjE4NzUgQy05LjYzNTQyOTY5IDEzLjAxMjk2ODc1IC04LjQ3Mzk4NDM4IDEzLjUzMzc1IC03LjI3NzM0Mzc1IDE0LjA3MDMxMjUgQy01LjU1NDUxMTcyIDE0LjgzNjAxNTYzIC01LjU1NDUxMTcyIDE0LjgzNjAxNTYzIC0zLjc5Njg3NSAxNS42MTcxODc1IEMwLjI0MTM3MzEyIDE3LjY4MTI4NjE5IDMuNTY0NTg1NyAxOS42ODc5ODkzIDUuOTEwMTU2MjUgMjMuNjMyODEyNSBDNi45OTYzOTk0NiAyOC4zMDM2NTgzIDYuMzE4NTczOSAzMS44ODQwNDY4MSA0LjAzNTE1NjI1IDM2LjA3MDMxMjUgQy0wLjE5NDIwMDc5IDM5Ljg3NjczMzg0IC00LjYxMjE4MDA4IDQxLjI1NzA5NTU4IC0xMC4yODUxNTYyNSA0MS4zODI4MTI1IEMtMTUuNjc4ODQ0MzEgNDEuMDMwMDkxNzUgLTE5Ljg2NjQ0MTQ4IDQwLjE3ODc3ODc4IC0yNC40NjQ4NDM3NSAzNy4zMjAzMTI1IEMtMjQuNDY0ODQzNzUgMzQuMDIwMzEyNSAtMjQuNDY0ODQzNzUgMzAuNzIwMzEyNSAtMjQuNDY0ODQzNzUgMjcuMzIwMzEyNSBDLTIzLjE2NTQ2ODc1IDI3Ljk4MDMxMjUgLTIxLjg2NjA5Mzc1IDI4LjY0MDMxMjUgLTIwLjUyNzM0Mzc1IDI5LjMyMDMxMjUgQy0xNS41OTQwNTE2OSAzMS41NDQyMDkyNCAtMTEuODI1MTI2MDMgMzEuNjYwNjQ3ODggLTYuNDY0ODQzNzUgMzEuMzIwMzEyNSBDLTYuNDY0ODQzNzUgMzAuMDAwMzEyNSAtNi40NjQ4NDM3NSAyOC42ODAzMTI1IC02LjQ2NDg0Mzc1IDI3LjMyMDMxMjUgQy03LjQxNzQ2MDk0IDI2Ljk1Njc5Njg3IC04LjM3MDA3ODEyIDI2LjU5MzI4MTI1IC05LjM1MTU2MjUgMjYuMjE4NzUgQy0yMi40OTU3MTQwNSAyMS4wMzAxNzczIC0yMi40OTU3MTQwNSAyMS4wMzAxNzczIC0yNS40NjQ4NDM3NSAxNS4zMjAzMTI1IEMtMjYuMjE3MDIwNTkgMTEuNDI4OTQ4NjQgLTI1LjgyMjM5NTM5IDguMjE0MTkxNTkgLTI0LjMzOTg0Mzc1IDQuNTA3ODEyNSBDLTE4LjQ5MTUxODczIC0yLjMxNTIzMzM1IC04LjEzNzk4MzIgLTIuMjQ0MDcxNDQgMCAwIFogIiBmaWxsPSIjMDA4NDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTY5LjQ2NDg0Mzc1LDQwLjY3OTY4NzUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzguOTEgMCAxNy44MiAwIDI3IDAgQzI3IDMuMyAyNyA2LjYgMjcgMTAgQzIxLjM5IDEwIDE1Ljc4IDEwIDEwIDEwIEMxMCAxMy42MyAxMCAxNy4yNiAxMCAyMSBDMTQuMjkgMjEgMTguNTggMjEgMjMgMjEgQzIzIDI0LjMgMjMgMjcuNiAyMyAzMSBDMTguNzEgMzEgMTQuNDIgMzEgMTAgMzEgQzEwIDM3LjkzIDEwIDQ0Ljg2IDEwIDUyIEM2LjcgNTIgMy40IDUyIDAgNTIgQzAgMzQuODQgMCAxNy42OCAwIDAgWiAiIGZpbGw9IiNEODFFMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMDEsNTIpIi8+CjxwYXRoIGQ9Ik0wIDAgQzIuOTcgMCA1Ljk0IDAgOSAwIEM5IDEzLjUzIDkgMjcuMDYgOSA0MSBDNS4zNyA0MSAxLjc0IDQxIC0yIDQxIEMtMy4yMTY4NzUgNDEuMjQ3NSAtNC40MzM3NSA0MS40OTUgLTUuNjg3NSA0MS43NSBDLTEwLjMxMDAyNjQxIDQyLjA5ODg2OTkyIC0xMy4zMDg5OTE4NSA0MC43MzUwMDM3OSAtMTcgMzggQy0yMC42ODY4MTg5NSAzMy4xNjEwNTAxMyAtMjAuNjk0NzYzNjEgMjcuODUzMTQ1NTEgLTIwIDIyIEMtMTguNzI2MDcyMzggMTguMzEyMzE0NzcgLTE3Ljc0NDY5MDYyIDE2LjU4MzY3NjQzIC0xNC42ODc1IDE0LjE4NzUgQy05LjYzMTE5NDU5IDExLjk1MzMxODU0IC02LjQ1NjIyNjA3IDExLjkwODc1NDc5IC0xIDEzIEMtMC42NyA4LjcxIC0wLjM0IDQuNDIgMCAwIFogTS05LjQzNzUgMjEuMDYyNSBDLTExLjI1OTI1OTU5IDI0LjQ4NzQwODAyIC0xMS42MzY3NDE4MyAyNi4xNzk1NDkgLTExIDMwIEMtOS40NTY2NDk3MSAzMi45NTA0NzU1MyAtOS40NTY2NDk3MSAzMi45NTA0NzU1MyAtNyAzNSBDLTQuNDE0MTc4NzIgMzUuNTg0MDIxMzMgLTQuNDE0MTc4NzIgMzUuNTg0MDIxMzMgLTIgMzUgQzAuMzI4NjYyMjkgMzMuMTExNTM4MTcgMC4zMjg2NjIyOSAzMy4xMTE1MzgxNyAwLjE5NTMxMjUgMjkuOTYwOTM3NSBDMC4xNzIxMDkzOCAyOC43Nzc1NzgxMiAwLjE0ODkwNjI1IDI3LjU5NDIxODc1IDAuMTI1IDI2LjM3NSBDMC4xMDY5NTMxMyAyNS4xODY0ODQzNyAwLjA4ODkwNjI1IDIzLjk5Nzk2ODc1IDAuMDcwMzEyNSAyMi43NzM0Mzc1IEMwLjA0NzEwOTM4IDIxLjg1ODIwMzEzIDAuMDIzOTA2MjUgMjAuOTQyOTY4NzUgMCAyMCBDLTUuMTAxNDUzNyAxOC41Nzg2MzU2MiAtNS4xMDE0NTM3IDE4LjU3ODYzNTYyIC05LjQzNzUgMjEuMDYyNSBaICIgZmlsbD0iIzAwODQyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjEzMSw0MCkiLz4KPHBhdGggZD0iTTAgMCBDOS45IDAgMTkuOCAwIDMwIDAgQzMwIDMuMyAzMCA2LjYgMzAgMTAgQzI2LjcgMTAgMjMuNCAxMCAyMCAxMCBDMjAgMjMuODYgMjAgMzcuNzIgMjAgNTIgQzE1LjA1IDUyLjQ5NSAxNS4wNSA1Mi40OTUgMTAgNTMgQzEwIDM4LjgxIDEwIDI0LjYyIDEwIDEwIEM2LjcgMTAgMy40IDEwIDAgMTAgQzAgNi43IDAgMy40IDAgMCBaICIgZmlsbD0iI0Q4MUUyNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTA2Niw1MikiLz4KPHBhdGggZD0iTTAgMCBDLTAuNDgxMTQ5MSA1Ljc3Mzc4OTI1IC0yLjE4NDY3MTgxIDkuOTU4NTk4MzYgLTUgMTUgQy00LjMxOTM3NSAxNC4yOTg3NSAtMy42Mzg3NSAxMy41OTc1IC0yLjkzNzUgMTIuODc1IEMtMS45NjMyMDUxNCAxMS45MTE3MTQxMyAtMC45ODM1MTk0NiAxMC45NTM4NjU2MSAwIDEwIEMwLjU1NDI5Njg3IDkuNDYxMTcxODggMS4xMDg1OTM3NSA4LjkyMjM0Mzc1IDEuNjc5Njg3NSA4LjM2NzE4NzUgQzUuMjUwOTM2OCA1LjA4MTYzODE0IDcuODk2NjgzMzIgMi44ODQwMTU1MyAxMyAzIEMxNS4wMDY0OTYwNyA0LjUzNjM3NTAxIDE1Ljg3Mzg5MDQ5IDUuNTg4MTQ4NyAxNi42MTcxODc1IDguMDE1NjI1IEMxNy4yNTE1NjExIDEzLjUxMzUyOTUzIDE2Ljg0OTMwMTA3IDE3LjA2MTIxMTQ3IDE0IDIyIEMxMS4wNTUwNzk0MyAyNS40MDk5MDgwMyA4LjEyMTcwMjE1IDI4LjEzNTQyMDQ2IDQgMzAgQzEuNjY3MTQ1MiAzMC4wNDcyNTM5OSAtMC42NjcyNDM5MyAzMC4wNTE4OTk3MyAtMyAzMCBDLTMuMjY1NTQ2ODggMzEuMDczNzg5MDYgLTMuNTMxMDkzNzUgMzIuMTQ3NTc4MTIgLTMuODA0Njg3NSAzMy4yNTM5MDYyNSBDLTQuMTYxMzk0MjEgMzQuNjkwMTIwMSAtNC41MTgxNjg2NiAzNi4xMjYzMTcxMiAtNC44NzUgMzcuNTYyNSBDLTUuMDQ5MDIzNDQgMzguMjY2OTcyNjYgLTUuMjIzMDQ2ODggMzguOTcxNDQ1MzEgLTUuNDAyMzQzNzUgMzkuNjk3MjY1NjIgQy02LjUxMjk0ODE1IDQ0LjE2MDI0OTk4IC03LjcxMjAxMjE2IDQ4LjU4NDg3MDUyIC05IDUzIEMtMTMuODc1IDUxLjI1IC0xMy44NzUgNTEuMjUgLTE1IDQ5IEMtMTUuODA3NzM2NjkgNDEuNjExMTk1NTcgLTE0LjQ0MzM4Mzc0IDM1LjkyMzE3NjkzIC0xMS44NzEwOTM3NSAyOS4wNDI5Njg3NSBDLTEwLjkzNjk5MDk5IDI1Ljc3OTg5MjMxIC0xMC44OTM4OTA4MiAyMy4yNTE1MDY5MSAtMTEuMDYyNSAxOS44NzUgQy0xMS4zNDcwMDEzMyAxMi4zOTk0ODI0MiAtOC41MjkxMDMxNSA3LjAzNDkyMzc4IC0zLjgxMjUgMS4zNzUgQy0yIDAgLTIgMCAwIDAgWiBNMTAgMTAgQzcuOTU1NDM5NDEgMTIuMTcyNjQ2NTUgNy45NTU0Mzk0MSAxMi4xNzI2NDY1NSA1Ljg3NSAxNC44NzUgQzUuMTUwNTQ2ODggMTUuNzc5OTIxODcgNC40MjYwOTM3NSAxNi42ODQ4NDM3NSAzLjY3OTY4NzUgMTcuNjE3MTg3NSBDMS44MDc5NDc2NiAxOS43ODY1NTgxMSAxLjgwNzk0NzY2IDE5Ljc4NjU1ODExIDIgMjIgQzYuMDE1MzA1MDUgMjEuMDg3NDMwNjcgNy43MTEyODI3NSAyMC4zNDk0OTk4MyAxMC4zNzUgMTcuMTI1IEMxMi4zMDc1Njg0OSAxMy45OTU1NjM5MiAxMi4zMDc1Njg0OSAxMy45OTU1NjM5MiAxMiAxMCBDMTEuMzQgMTAgMTAuNjggMTAgMTAgMTAgWiAiIGZpbGw9IiMyMjFFMjAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY2NSw3MCkiLz4KPHBhdGggZD0iTTAgMCBDMy4zIDAgNi42IDAgMTAgMCBDMTAgMTQuMTkgMTAgMjguMzggMTAgNDMgQzEzLjk2IDQzIDE3LjkyIDQzIDIyIDQzIEMyMy4zMiA0My4zMyAyNC42NCA0My42NiAyNiA0NCBDMjYgNDcuMyAyNiA1MC42IDI2IDU0IEMxMy4xMyA1My41MDUgMTMuMTMgNTMuNTA1IDAgNTMgQzAgMzUuNTEgMCAxOC4wMiAwIDAgWiAiIGZpbGw9IiNEODFFMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExMzMsNTIpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuMyAwIDYuNiAwIDEwIDAgQzEwLjMzIDQuNjIgMTAuNjYgOS4yNCAxMSAxNCBDMTIuNTQ2ODc1IDEzLjQ0MzEyNSAxMi41NDY4NzUgMTMuNDQzMTI1IDE0LjEyNSAxMi44NzUgQzE4LjM5OTA1MzgzIDExLjkwOTg5MTA3IDIwLjEwMjI4MDU4IDEyLjEzOTcyNDgyIDI0IDE0IEMyNS45NTA0Njk0MiAxNS42MTQxODE1OSAyNi44NzAxODY5MyAxNi43NDAzNzM4NiAyOCAxOSBDMjguMDcxODE4MjEgMjEuNzE3NjAxMDggMjguMDkyOTk1MDYgMjQuNDA4NTkzODggMjguMDYyNSAyNy4xMjUgQzI4LjA1Nzk4ODI4IDI3Ljg3OTEwMTU2IDI4LjA1MzQ3NjU2IDI4LjYzMzIwMzEyIDI4LjA0ODgyODEyIDI5LjQxMDE1NjI1IEMyOC4wMzcwMzQ5OSAzMS4yNzM0NzEyNyAyOC4wMTkwOTk0MiAzMy4xMzY3NDU1NSAyOCAzNSBDMjMuNTQ1IDM1LjQ5NSAyMy41NDUgMzUuNDk1IDE5IDM2IEMxOC45Mzk0MTQwNiAzNS4wODQ3NjU2MyAxOC44Nzg4MjgxMiAzNC4xNjk1MzEyNSAxOC44MTY0MDYyNSAzMy4yMjY1NjI1IEMxOC43MzI2MTcxOSAzMi4wMzgwNDY4NyAxOC42NDg4MjgxMiAzMC44NDk1MzEyNSAxOC41NjI1IDI5LjYyNSBDMTguNDgxMjg5MDYgMjguNDQxNjQwNjMgMTguNDAwMDc4MTIgMjcuMjU4MjgxMjUgMTguMzE2NDA2MjUgMjYuMDM5MDYyNSBDMTguMTg5MTUwNjQgMjMuMDg0ODEwOTkgMTguMTg5MTUwNjQgMjMuMDg0ODEwOTkgMTcgMjEgQzE1LjMzMzg4MDk1IDIwLjk1NzI3OSAxMy42NjYxNzExNSAyMC45NTkzNjE2OCAxMiAyMSBDMTAuNDUwNDk3MzIgMjIuNTQ5NTAyNjggMTAuNzgzNDQ4MDcgMjQuMDk5OTA1OTQgMTAuNjgzNTkzNzUgMjYuMjUzOTA2MjUgQzEwLjY0MTY5OTIyIDI3LjEwNzkxMDE2IDEwLjU5OTgwNDY5IDI3Ljk2MTkxNDA2IDEwLjU1NjY0MDYyIDI4Ljg0MTc5Njg4IEMxMC41MTczMjQyMiAyOS43Mzk2Mjg5MSAxMC40NzgwMDc4MSAzMC42Mzc0NjA5NCAxMC40Mzc1IDMxLjU2MjUgQzEwLjM5NDMxNjQxIDMyLjQ2NDE5OTIyIDEwLjM1MTEzMjgxIDMzLjM2NTg5ODQ0IDEwLjMwNjY0MDYyIDM0LjI5NDkyMTg4IEMxMC4yMDAyMjAxNiAzNi41Mjk3NTE1NiAxMC4wOTk1NzUxOSAzOC43NjQ4NTQ4NiAxMCA0MSBDNi43IDQxIDMuNCA0MSAwIDQxIEMwIDI3LjQ3IDAgMTMuOTQgMCAwIFogIiBmaWxsPSIjMDA4NDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDA1LDQwKSIvPgo8cGF0aCBkPSJNMCAwIEM0LjI5IDAgOC41OCAwIDEzIDAgQzkuOTk1NDE0NiAxNi4wODQxMjA5OCA2Ljc1MDQyOTQ2IDMyLjA3MjY0NDI3IDMgNDggQy0xLjI5IDQ4IC01LjU4IDQ4IC0xMCA0OCBDLTkuMzUyMDc5OTYgNDIuMjQzMTY0OTggLTguMzkyNDE1OTEgMzYuNjQxMDIxMyAtNy4xODc1IDMwLjk3NjU2MjUgQy03LjAxMzcxODI2IDMwLjE0OTE3NTcyIC02LjgzOTkzNjUyIDI5LjMyMTc4ODk0IC02LjY2MDg4ODY3IDI4LjQ2OTMyOTgzIEMtNi4yOTYwMjY4NiAyNi43MzYyMTU3NCAtNS45Mjk1NTA3IDI1LjAwMzQ0MDc3IC01LjU2MTUyMzQ0IDIzLjI3MDk5NjA5IEMtNC45OTczNjgxOSAyMC42MTI1OTg0NyAtNC40Mzk3NTU1NCAxNy45NTI4ODU2NSAtMy44ODI4MTI1IDE1LjI5Mjk2ODc1IEMtMy41MjY0Mjg0MSAxMy42MDQwODUwMSAtMy4xNjk2NzA5OSAxMS45MTUyOCAtMi44MTI1IDEwLjIyNjU2MjUgQy0yLjY0NTgwODExIDkuNDMwNzc3ODkgLTIuNDc5MTE2MjEgOC42MzQ5OTMyOSAtMi4zMDczNzMwNSA3LjgxNTA5Mzk5IEMtMS4xMTUxOTMxMyAyLjIzMDM4NjI2IC0xLjExNTE5MzEzIDIuMjMwMzg2MjYgMCAwIFogIiBmaWxsPSIjMjIzMTc1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5OCw1NCkiLz4KPHBhdGggZD0iTTAgMCBDMCAzIDAgMyAtMSA1IEMtMS4yMTM3NzcyMSAxMC42MDcwMzIxMyAtMS4yMTM3NzcyMSAxMC42MDcwMzIxMyAwIDE2IEMwLjc1NDE0MjM1IDIyLjQ5MDU2OTM3IC0wLjI2NzY1MDE5IDI1LjU4MjA3Mjg1IC00IDMxIEMtMy45Mjc0OTIxNCAzNC41NTI4ODQ5NCAtMy4zMTc3NDE2NCAzNi40OTE2MTMzNyAtMS40Mzc1IDM5LjUgQzAuNDMyMjMyNTQgNDIuNzUxNzA4NzYgMC40OTI4MjA0OCA0NC4yNjg2NDQ5NCAwIDQ4IEMtMS4xNzkwNDA1IDUxLjQwNDQxNTYzIC0yLjU0MTk2MzU0IDU0LjcwNjM5OTc4IC00IDU4IEMtMTMuMDQyMzMyOTIgNTUuOTEzMzA3NzkgLTE5LjIzMTExMzk5IDQ5LjIyNDI2NTc5IC0yNC42ODc1IDQyLjExMzI4MTI1IEMtMjUuOTc2NzY1MDIgNDAuMDM3NDExMDkgLTI2LjU2ODUwMjU3IDM4LjM4OTQxNzA0IC0yNyAzNiBDLTIyLjM3NSAzMyAtMjIuMzc1IDMzIC0xOSAzMyBDLTE5IDMzLjk5IC0xOSAzNC45OCAtMTkgMzYgQy0xNi4wMjk4MjMwNiAzNS4zNzE4OTgyNyAtMTYuMDI5ODIzMDYgMzUuMzcxODk4MjcgLTEzIDM0IEMtMTEuODAxNjE3OTEgMzEuNjcxNDU1MzcgLTExLjgwMTYxNzkxIDMxLjY3MTQ1NTM3IC0xMSAyOSBDLTEwLjMyMzI0MjE5IDI4LjI5NDg4MjgxIC05LjY0NjQ4NDM4IDI3LjU4OTc2NTYyIC04Ljk0OTIxODc1IDI2Ljg2MzI4MTI1IEMtNi4yODY2NTkzNyAyMi45NTIxNDY5MyAtNi42NDc5NDA5OCAyMC4wOTMyNzg3OCAtNi45Mzc1IDE1LjUgQy03LjQ2Nzc4NzQgNi4zMzQ3MzQyNSAtNy40Njc3ODc0IDYuMzM0NzM0MjUgLTQgMiBDLTEuODEyNSAwLjY4NzUgLTEuODEyNSAwLjY4NzUgMCAwIFogIiBmaWxsPSIjMTg3MjRFIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzQ4LDYwKSIvPgo8cGF0aCBkPSJNMCAwIEM0LjIyNzM1OTE0IDUuMDI2MTMzNCA0LjM0Mzc1IDYuNjc1NjQ0OTEgNC4zNDM3NSAxMy41OTc2NTYyNSBDLTEuOTI2MjUgMTMuNTk3NjU2MjUgLTguMTk2MjUgMTMuNTk3NjU2MjUgLTE0LjY1NjI1IDEzLjU5NzY1NjI1IEMtMTIuMzAwNDg3NzkgMTguNzcwMzg3NjYgLTEyLjMwMDQ4Nzc5IDE4Ljc3MDM4NzY2IC04LjUzMTI1IDE5LjU5NzY1NjI1IEMtMy43NTI5OTc1NyAxOS41OTc2NTYyNSAtMC4wNTEzNDIxNSAxOC4zNjE2NzI4MyA0LjM0Mzc1IDE2LjU5NzY1NjI1IEM0LjY1NjI1IDE5LjQxMDE1NjI1IDQuNjU2MjUgMTkuNDEwMTU2MjUgNC4zNDM3NSAyMi41OTc2NTYyNSBDMC45MDEyMjIwNSAyNS45MjU0MzMyNyAtMy40MTQ1NjU0OCAyNi4zMjk5Njg0IC04LjAyMzQzNzUgMjYuNjYwMTU2MjUgQy0xMy42ODcyNjY0IDI2LjUyNTcwMzM0IC0xOC4xMzQxNTE4MiAyNS4xMTk3NTQ0MyAtMjIuMTU2MjUgMjEuMDk3NjU2MjUgQy0yNC43NzM1ODM1MyAxNi43MzU0MzM3IC0yNS4zMTY1NTAzOCAxMi41OTU3NjMyOCAtMjQuNjU2MjUgNy41OTc2NTYyNSBDLTIzLjI5NDg1NjcgMy44NjEyMjM1NSAtMjEuNDAxMzMxNDIgMS4xNzA3OTU4IC0xOC4yMTg3NSAtMS4yNzczNDM3NSBDLTEyLjMxODQ0Njg5IC0zLjg2NzcyMDcyIC01LjI1NTA1Mjk0IC00LjQ0OTQ0MzQxIDAgMCBaIE0tMTMuNjU2MjUgNC41OTc2NTYyNSBDLTEzLjk4NjI1IDUuOTE3NjU2MjUgLTE0LjMxNjI1IDcuMjM3NjU2MjUgLTE0LjY1NjI1IDguNTk3NjU2MjUgQy0xMS4wMjYyNSA4LjU5NzY1NjI1IC03LjM5NjI1IDguNTk3NjU2MjUgLTMuNjU2MjUgOC41OTc2NTYyNSBDLTQuOTgzMjM1NTkgMy42NzQ2NDYzMyAtNC45ODMyMzU1OSAzLjY3NDY0NjMzIC03LjUzMTI1IDIuNjYwMTU2MjUgQy0xMC4yMTA5NzMzNSAyLjU4MTM0MDg2IC0xMS40ODU2NTkxNSAzLjAyNTg0OTA4IC0xMy42NTYyNSA0LjU5NzY1NjI1IFogIiBmaWxsPSIjMDA4NDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDkxLjY1NjI1LDU1LjQwMjM0Mzc1KSIvPgo8cGF0aCBkPSJNMCAwIEMzLjUyMDkwNTk1IDQuNTExMTYwNzUgMyA2LjQxMTcwNDg5IDMgMTIuNTYyNSBDLTMuMjcgMTIuNTYyNSAtOS41NCAxMi41NjI1IC0xNiAxMi41NjI1IEMtMTMuNjQ0MjM3NzkgMTcuNzM1MjMxNDEgLTEzLjY0NDIzNzc5IDE3LjczNTIzMTQxIC05Ljg3NSAxOC41NjI1IEMtNS4wOTY3NDc1NyAxOC41NjI1IC0xLjM5NTA5MjE1IDE3LjMyNjUxNjU4IDMgMTUuNTYyNSBDMy4zMTI1IDE4LjM3NSAzLjMxMjUgMTguMzc1IDMgMjEuNTYyNSBDLTAuNDQyNTI3OTUgMjQuODkwMjc3MDIgLTQuNzU4MzE1NDggMjUuMjk0ODEyMTUgLTkuMzY3MTg3NSAyNS42MjUgQy0xNS4wMzEwMTY0IDI1LjQ5MDU0NzA5IC0xOS40Nzc5MDE4MiAyNC4wODQ1OTgxOCAtMjMuNSAyMC4wNjI1IEMtMjYuMTE3MzMzNTMgMTUuNzAwMjc3NDUgLTI2LjY2MDMwMDM4IDExLjU2MDYwNzAzIC0yNiA2LjU2MjUgQy0yNC42Mzg2MDY3IDIuODI2MDY3MyAtMjIuNzQ1MDgxNDIgMC4xMzU2Mzk1NSAtMTkuNTYyNSAtMi4zMTI1IEMtMTIuNjA1NTU1NjYgLTUuMzY2NzY4MjUgLTUuOTgyNDU3MiAtNC44NjA3NDY0OCAwIDAgWiBNLTE1IDMuNTYyNSBDLTE1LjMzIDQuODgyNSAtMTUuNjYgNi4yMDI1IC0xNiA3LjU2MjUgQy0xMi4zNyA3LjU2MjUgLTguNzQgNy41NjI1IC01IDcuNTYyNSBDLTYuMzI2OTg1NTkgMi42Mzk0OTAwOCAtNi4zMjY5ODU1OSAyLjYzOTQ5MDA4IC04Ljg3NSAxLjYyNSBDLTExLjU1NDcyMzM1IDEuNTQ2MTg0NjEgLTEyLjgyOTQwOTE1IDEuOTkwNjkyODMgLTE1IDMuNTYyNSBaICIgZmlsbD0iIzAwODQyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjE2OSw1Ni40Mzc1KSIvPgo8cGF0aCBkPSJNMCAwIEMzLjMgMCA2LjYgMCAxMCAwIEMxMCAxOC4xNSAxMCAzNi4zIDEwIDU1IEM3LjAzIDU1IDQuMDYgNTUgMSA1NSBDMCA1NCAwIDU0IC0wLjEyMDI1NDUyIDUxLjgyOTY5NjY2IEMtMC4xMTgwMzM5MSA1MC44NzI2MTMwNyAtMC4xMTU4MTMyOSA0OS45MTU1Mjk0OCAtMC4xMTM1MjUzOSA0OC45Mjk0NDMzNiBDLTAuMTEzNDQ5ODYgNDcuODQ4Mzk4MjggLTAuMTEzMzc0MzMgNDYuNzY3MzUzMjEgLTAuMTEzMjk2NTEgNDUuNjUzNTQ5MTkgQy0wLjEwODEzNTIyIDQ0LjQ3NzUyNjQgLTAuMTAyOTczOTQgNDMuMzAxNTAzNiAtMC4wOTc2NTYyNSA0Mi4wODk4NDM3NSBDLTAuMDk2MjQxMyA0MC44OTI2NzIyNyAtMC4wOTQ4MjYzNSAzOS42OTU1MDA3OSAtMC4wOTMzNjg1MyAzOC40NjIwNTEzOSBDLTAuMDg3NzQ5NzkgMzQuNjIwNTA5MzQgLTAuMDc1MTk0MTEgMzAuNzc5MDI0NTcgLTAuMDYyNSAyNi45Mzc1IEMtMC4wNTc0ODc0MSAyNC4zNDA0OTU2MyAtMC4wNTI5MjQwOSAyMS43NDM0OTAzNSAtMC4wNDg4MjgxMiAxOS4xNDY0ODQzOCBDLTAuMDM3Nzc0MjcgMTIuNzY0MzAwNjggLTAuMDIwNDk3MDggNi4zODIxNjAwNyAwIDAgWiAiIGZpbGw9IiNEODFGMjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExNjYsNTIpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuMyAwIDYuNiAwIDEwIDAgQzEwIDAuNjYgMTAgMS4zMiAxMCAyIEMxMC45OSAxLjM0IDExLjk4IDAuNjggMTMgMCBDMTYuMzkyMTAyODcgLTAuNTQ2MTg2MDYgMTkuNjA2NTQzNSAtMC41MzU4MDg5MiAyMyAwIEMyNi42MTk5NTgyMSAyLjY1OTU2MTEzIDI4LjIwNjgzODE3IDQuNjQ4NDIzNTEgMjkgOSBDMjkuMDc4MTg2MzYgMTAuNTEzOTU2OTYgMjkuMTA3ODk5MDkgMTIuMDMwOTM1MDcgMjkuMDk3NjU2MjUgMTMuNTQ2ODc1IEMyOS4wOTQ0MzM1OSAxNC4zOTEyMTA5NCAyOS4wOTEyMTA5NCAxNS4yMzU1NDY4NyAyOS4wODc4OTA2MiAxNi4xMDU0Njg3NSBDMjkuMDc5NTExNzIgMTYuOTc4MTY0MDYgMjkuMDcxMTMyODEgMTcuODUwODU5MzcgMjkuMDYyNSAxOC43NSBDMjkuMDU3OTg4MjggMTkuNjM4MTY0MDYgMjkuMDUzNDc2NTYgMjAuNTI2MzI4MTIgMjkuMDQ4ODI4MTIgMjEuNDQxNDA2MjUgQzI5LjAzNzA3NDIyIDIzLjYyNzYzMzE2IDI5LjAxOTEzOTY2IDI1LjgxMzgyNTI4IDI5IDI4IEMyNS43IDI4IDIyLjQgMjggMTkgMjggQzE4LjUwNSAxOC4xIDE4LjUwNSAxOC4xIDE4IDggQzE2LjY4IDcuNjcgMTUuMzYgNy4zNCAxNCA3IEMxMy4wMSA3LjY2IDEyLjAyIDguMzIgMTEgOSBDMTAuNDE0MDczNjYgMTIuMTE2MTA1NTQgMTAuNDE0MDczNjYgMTIuMTE2MTA1NTQgMTAuMzEyNSAxNS42MjUgQzEwLjI0Njc1NzgxIDE2LjgxMzUxNTYzIDEwLjE4MTAxNTYzIDE4LjAwMjAzMTI1IDEwLjExMzI4MTI1IDE5LjIyNjU2MjUgQzEwLjA3NTg5ODQ0IDIwLjE0MTc5Njg3IDEwLjAzODUxNTYyIDIxLjA1NzAzMTI1IDEwIDIyIEM2LjcgMjEuNjcgMy40IDIxLjM0IDAgMjEgQzAgMTQuMDcgMCA3LjE0IDAgMCBaICIgZmlsbD0iIzAwODQyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAzNiw1MykiLz4KPHBhdGggZD0iTTAgMCBDNy44MjQzNDA1OCAtMC4xMTcwMzA3NCA3LjgyNDM0MDU4IC0wLjExNzAzMDc0IDEwLjQ4ODI4MTI1IDIuNDE0MDYyNSBDMTIuNzg3NDM3MTMgNi4yMDk3NTk4NSAxMy43NDA2OTg2IDkuNTU1ODA4MzkgMTMgMTQgQzExLjk1MTAwNjYgMTUuNzE2NTM0NjYgMTAuOTAxMjc3MjcgMTcuNDMyNzI1OTggOS44MzIwMzEyNSAxOS4xMzY3MTg3NSBDOC4yODEzNDc3OCAyMi42MDkzNzYxMSA5LjE2NDUxNTkyIDI1LjM1OTY3NjUzIDEwIDI5IEMxMC4zNTA2MjUgMjkuNzAxMjUgMTAuNzAxMjUgMzAuNDAyNSAxMS4wNjI1IDMxLjEyNSBDMTIuMzk2NjM0OTIgMzMuNzkzMjY5ODUgMTIuMTk1NTczOTMgMzYuMDY2MzkwOTggMTIgMzkgQzExIDQwIDExIDQwIDguMTI4OTA2MjUgNDAuMTMyODEyNSBDNi45NTE5OTIxOSA0MC4xMzAyMzQzOCA1Ljc3NTA3ODEyIDQwLjEyNzY1NjI1IDQuNTYyNSA0MC4xMjUgQzMuMzg4MTY0MDYgNDAuMTI3NTc4MTIgMi4yMTM4MjgxMiA0MC4xMzAxNTYyNSAxLjAwMzkwNjI1IDQwLjEzMjgxMjUgQy0yIDQwIC0yIDQwIC00IDM5IEMtMy4yNDgxNzUxOCAzMS40ODE3NTE4MiAtMy4yNDgxNzUxOCAzMS40ODE3NTE4MiAtMS45Mzc1IDI4LjkzNzUgQy0wLjQzNzQ4NjY0IDI1LjgzNzQ3MjM5IC0wLjY0OTM5MDYgMjMuMzg5MjI0MiAtMSAyMCBDLTIuMzE0MzE2OTUgMTcuOTg3NDUyMTggLTMuNjQ3MjE4ODUgMTUuOTg2ODk3MzEgLTUgMTQgQy01Ljg1NTE0NzQgOS42MjkyNDY2MSAtNC43NjA4MzQzNiA3LjI4MzU1ODE3IC0yLjUgMy42MjUgQy0xLjY3OTQ5NTggMi40MDc5MTg3NiAtMC44NTAyODE2NCAxLjE5NjQ2NzczIDAgMCBaICIgZmlsbD0iI0ZBRkJGQiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM1Nyw4MikiLz4KPHBhdGggZD0iTTAgMCBDMy45MDkzODcwMyAzLjczOTQxMzY4IDMuOTA5Mzg3MDMgMy43Mzk0MTM2OCA0LjEzMjgxMjUgNi44NDc2NTYyNSBDNC4xMzAyMzQzOCA3LjU3ODU1NDY5IDQuMTI3NjU2MjUgOC4zMDk0NTMxMyA0LjEyNSA5LjA2MjUgQzQuMTIzNzEwOTQgOS44NjU1ODU5NCA0LjEyMjQyMTg4IDEwLjY2ODY3MTg4IDQuMTIxMDkzNzUgMTEuNDk2MDkzNzUgQzQuMDAyNzk5MjggMTMuOTQyMTE4MSAzLjYyMDk4NDQgMTYuMjE4MTI5NDkgMy4xODc1IDE4LjYyNSBDMi43MDMyNTg3MiAyMi4yNzU5MjQ0MiAzLjIxMzk4MTIzIDIzLjg4MzIwMTQgNS40Mzc1IDI2LjgxMjUgQzUuOTEwNTg1OTQgMjcuMzM0NTcwMzEgNi4zODM2NzE4NyAyNy44NTY2NDA2MiA2Ljg3MTA5Mzc1IDI4LjM5NDUzMTI1IEM4IDMwIDggMzAgOCAzNCBDOC42NiAzNCA5LjMyIDM0IDEwIDM0IEM3Ljk4MzAzMjM0IDI5LjA1NjczNDA2IDcuOTgzMDMyMzQgMjkuMDU2NzM0MDYgNS4yNSAyNC41IEMzLjUwMjExMTMyIDIxLjAwNDIyMjYzIDQuMzAxODA1ODYgMTguODA4MzMxNjUgNSAxNSBDNS4yMjA5MzE1MSAxMC40OTc1NjgxMyA1LjIzOTU1NzQ5IDYuMzU4MTI2NzUgNCAyIEM3LjQ0NTAwNjYgNC45MzU2NjQyMyA3LjU3NDgyNDY0IDcuMjU3NDQyOTQgNy45Njg3NSAxMS41OTc2NTYyNSBDNy45OTg4MzUyIDEzLjkxMDQ1NTggNy43MDc4ODYzOCAxNS44NjYzODczNSA3LjI1IDE4LjEyNSBDNi45ODQxMjA2MSAyMi4yNDYxMzA1MyA3LjEwOTg0MDQyIDIyLjY4NTU3NDIyIDkuNDM3NSAyNS43NSBDOS45MTA1ODU5NCAyNi4yODEwOTM3NSAxMC4zODM2NzE4NyAyNi44MTIxODc1IDEwLjg3MTA5Mzc1IDI3LjM1OTM3NSBDMTIgMjkgMTIgMjkgMTIgMzMgQzE0LjMxIDMzLjY2IDE2LjYyIDM0LjMyIDE5IDM1IEMxOSAzNS45OSAxOSAzNi45OCAxOSAzOCBDMTkuNjM5Mzc1IDM4LjI4ODc1IDIwLjI3ODc1IDM4LjU3NzUgMjAuOTM3NSAzOC44NzUgQzIzIDQwIDIzIDQwIDI0IDQyIEMxOS4yNDAwNTc5OSA0OC4wNjgxMzc5OSAxMy45MjU3ODgzNiA1My40MjgxMzM2MyA3IDU3IEM0IDU2IDQgNTYgMi43OTY4NzUgNTMuOTI1NzgxMjUgQy0wLjc2MDI4NTczIDQ1LjA0NjE1MjQyIC0wLjc2MDI4NTczIDQ1LjA0NjE1MjQyIDEgNDAgQzEuNTE1NjI1IDM5LjE3NSAyLjAzMTI1IDM4LjM1IDIuNTYyNSAzNy41IEM0LjM4NzAyNzU2IDM0LjMyNjkwODU4IDQuNTE2NDQxMTggMzIuNjE1MDg4MjUgNCAyOSBDMy4zNCAyOC4wMzA2MjUgMi42OCAyNy4wNjEyNSAyIDI2LjA2MjUgQy0wLjQxMDU3NzgyIDIyLjM3MTMwMjcyIC0wLjQwODMyNzU1IDIwLjMyODI3MTk5IDAgMTYgQzAuMzMgMTUuMDEgMC42NiAxNC4wMiAxIDEzIEMxLjA5MjQ3MzgxIDExLjUyMzEzODg5IDEuMTI5OTkwNzEgMTAuMDQyMjQ0OTkgMS4xMjUgOC41NjI1IEMxLjEyODg2NzE5IDcuNDE5NzQ2MDkgMS4xMjg4NjcxOSA3LjQxOTc0NjA5IDEuMTMyODEyNSA2LjI1MzkwNjI1IEMxLjAwMjc2MDE1IDQuMDQ2ODQxNDEgMC42MDg1NjE5OSAyLjEyMDMwNzI0IDAgMCBaICIgZmlsbD0iIzI5N0Q1QiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM3NCw2MSkiLz4KPHBhdGggZD0iTTAgMCBDMCAyLjY0IDAgNS4yOCAwIDggQy0wLjk5IDcuNjcgLTEuOTggNy4zNCAtMyA3IEMtNi41NTg4MDA1MSA2LjYyNjg5OTk1IC05LjgyNzU4NTIyIDYuMzQwNTE2NjkgLTEzIDguMTI1IEMtMTQuNDYyMjEyMTcgMTAuODY2NjQ3ODEgLTE0LjMxODMzNzMzIDEyLjk0Mzk2MTYyIC0xNCAxNiBDLTEyLjMyMDg1NTg1IDE5LjIyNTQwMTU2IC0xMi4zMjA4NTU4NSAxOS4yMjU0MDE1NiAtOS4zMTI1IDE5Ljc1IEMtNS43MDcwOTgyNCAyMC4wMjIxMDU3OSAtMi41NTAxMDA2NiAxOS42MzkwMTgxMiAxIDE5IEMxIDIxLjMxIDEgMjMuNjIgMSAyNiBDLTYuMzQ1MjM2NzIgMjguMjcwMzQ1ODkgLTEyLjM4MTY4ODY4IDI4Ljg3NjE2MTQyIC0xOS4zNzUgMjUuMjUgQy0yMi44MjkzNDgyMSAyMi4yODkxMzAxIC0yNC42OTA4NzcyNCAyMC4yNzgzNDkyMiAtMjUuMzE2NDA2MjUgMTUuNjY3OTY4NzUgQy0yNS41ODIxMzY1MiA5Ljk1MDQ4MTkxIC0yNC45Njg0NzE1MiA2LjM5NzQ5NTQ3IC0yMSAyIEMtMTQuMTcwMDE0MTEgLTMuMjEyMzU3NjUgLTcuODE4OTkzNjcgLTEuODY5NzU5MzYgMCAwIFogIiBmaWxsPSIjMDA4NDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDAyLDU0KSIvPgo8cGF0aCBkPSJNMCAwIEMzIDMuMTkwMzcxOTkgMyAzLjE5MDM3MTk5IDMgNiBDLTAuMDkyNjI3NjcgNy41NDYzMTM4NCAtMy4zNjcwODkxIDcuMzkwNjA3MTYgLTYuNzg1MTU2MjUgNy42MjEwOTM3NSBDLTcuODgxNTAzOTEgNy44MDg2NTIzNCAtNy44ODE1MDM5MSA3LjgwODY1MjM0IC05IDggQy05LjMzIDguNjYgLTkuNjYgOS4zMiAtMTAgMTAgQy03LjY5IDEwLjMzIC01LjM4IDEwLjY2IC0zIDExIEMtMi40Mzc1IDEyLjkzNzUgLTIuNDM3NSAxMi45Mzc1IC0yIDE1IEMtMyAxNiAtMyAxNiAtNS4yODUxNTYyNSAxNi4wOTc2NTYyNSBDLTYuNjU5OTQxNDEgMTYuMDgwMjUzOTEgLTYuNjU5OTQxNDEgMTYuMDgwMjUzOTEgLTguMDYyNSAxNi4wNjI1IEMtOC45ODE2MDE1NiAxNi4wNTM0NzY1NiAtOS45MDA3MDMxMiAxNi4wNDQ0NTMxMyAtMTAuODQ3NjU2MjUgMTYuMDM1MTU2MjUgQy0xMS41NTc5Mjk2OSAxNi4wMjM1NTQ2OSAtMTIuMjY4MjAzMTMgMTYuMDExOTUzMTMgLTEzIDE2IEMtMTMuMzMgMTcuNjUgLTEzLjY2IDE5LjMgLTE0IDIxIEMtMTIuNzYyNSAyMC42NDkzNzUgLTExLjUyNSAyMC4yOTg3NSAtMTAuMjUgMTkuOTM3NSBDLTcuMDk2NzA4IDE5LjA0NDA2NzI3IC01LjEzMjI1ODM2IDE4Ljk5MTE4NzA2IC0yIDIwIEMtMS42NyAyMS4zMiAtMS4zNCAyMi42NCAtMSAyNCBDLTcuMDgzMDUwMzggMjguMTkwNTQ1ODIgLTExLjYyMjE1Nzc3IDI5Ljk3NTQ2ODkgLTE5IDI5IEMtMjEuMDYyNSAyNy4zNzUgLTIxLjA2MjUgMjcuMzc1IC0yMiAyNSBDLTIyLjU2NDA4OTkgMjAuMDM2MDA4OTIgLTIxLjQ2ODAwNjg0IDE1LjcxMzA3NDU4IC0yMCAxMSBDLTE4LjM3NSA5IC0xOC4zNzUgOSAtMTcgOCBDLTE3LjQ5NSA3LjU2Njg3NSAtMTcuOTkgNy4xMzM3NSAtMTguNSA2LjY4NzUgQy0yMCA1IC0yMCA1IC0yMCAyIEMtNi4wODE1NDUwNiAtMS4zMTY3MzgyIC02LjA4MTU0NTA2IC0xLjMxNjczODIgMCAwIFogIiBmaWxsPSIjMjIxRTIwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NTIsNzEpIi8+CjxwYXRoIGQ9Ik0wIDAgQzIgMiAyIDIgMi4zMTI1IDUuMTg3NSBDMS45Njk4MjgxOCA5LjM2ODA5NjIyIDAuNjY2NjA4NjQgMTIuMTgwNjg4NTMgLTEgMTYgQy0xLjU4NzYzMjQ0IDIwLjExMzQyNzEgLTEuMzMwNDM1NTggMjEuNTA0MzQ2NjQgMSAyNSBDMy4zMzQ1ODYzNSAyOC41MDE4Nzk1MyAzLjY3MjYwNzI3IDI5Ljg4MDI4MDQ3IDMgMzQgQzEuOTUxMDA2NiAzNS43MTY1MzQ2NiAwLjkwMTI3NzI3IDM3LjQzMjcyNTk4IC0wLjE2Nzk2ODc1IDM5LjEzNjcxODc1IEMtMS43MTg2NTIyMiA0Mi42MDkzNzYxMSAtMC44MzU0ODQwOCA0NS4zNTk2NzY1MyAwIDQ5IEMwLjM1MDYyNSA0OS43MDEyNSAwLjcwMTI1IDUwLjQwMjUgMS4wNjI1IDUxLjEyNSBDMi4zODM4NTAwOCA1My43Njc3MDAxNyAyLjEzMjA5ODM3IDU2LjA5MzgzNTkxIDIgNTkgQzEuMDEgNTkgMC4wMiA1OSAtMSA1OSBDLTEuMjg4NzUgNTcuNzgzMTI1IC0xLjU3NzUgNTYuNTY2MjUgLTEuODc1IDU1LjMxMjUgQy0yLjQ4MDE5MTExIDUyLjgzMDc4MTA3IC0zLjEwNzk3MDM0IDUwLjc2NzAxMTM3IC00LjE4NzUgNDguNDM3NSBDLTUuMzQyMzE4NDQgNDQuOTczMDQ0NjggLTQuODE4NjU2ODYgNDIuNTI2NTIxODcgLTQgMzkgQy0zLjIyNjU2MjUgMzcuNzMxNTYyNSAtMy4yMjY1NjI1IDM3LjczMTU2MjUgLTIuNDM3NSAzNi40Mzc1IEMtMC42MTEwNTMyMSAzMy4zNDA0ODE1MiAtMC41NTY2MDA4MSAzMS41NDcxOTM1MyAtMSAyOCBDLTIuNDI2MjE2ODQgMjUuMjg4NzM2MTYgLTIuNDI2MjE2ODQgMjUuMjg4NzM2MTYgLTQgMjMgQy00IDIyLjM0IC00IDIxLjY4IC00IDIxIEMtNi45NyAyMSAtOS45NCAyMSAtMTMgMjEgQy0xNi44OTY3Nzg1MSAyNy4wMDIyMTQ0NSAtMTYuODk2Nzc4NTEgMjcuMDAyMjE0NDUgLTE3IDM0IEMtMTYuMzQgMzQuOTY5Mzc1IC0xNS42OCAzNS45Mzg3NSAtMTUgMzYuOTM3NSBDLTEyLjUzNTY0NjkzIDQwLjcxMTA0MDY0IC0xMi40NTUwODUxNiA0Mi41NjI4MzYyOCAtMTMgNDcgQy0xMy45MzU3ODk5NSA0OS4zNTk4MTgxMyAtMTQuOTMzNDc4MDggNTEuNjk2MzEyNjQgLTE2IDU0IEMtMTYuNjkxNDA1MjIgNTYuNzc4ODg2MTMgLTE2LjY5MTQwNTIyIDU2Ljc3ODg4NjEzIC0xNyA1OSBDLTE3Ljk5IDU5IC0xOC45OCA1OSAtMjAgNTkgQy0yMC4yNTgxMzMwMiA1NS4zODYxMzc3NCAtMjAuMTY4MTU2NjcgNTMuMzI5MzA2OCAtMTguNSA1MC4wNjI1IEMtMTYuNjczNDE0OTMgNDYuMzMzMjIyMTUgLTE2LjQ4NjE3MTMzIDQ0LjExMDYyOTM5IC0xNyA0MCBDLTE4LjMxNDMxNjk1IDM3Ljk4NzQ1MjE4IC0xOS42NDcyMTg4NSAzNS45ODY4OTczMSAtMjEgMzQgQy0yMS41IDMxIC0yMS41IDMxIC0yMSAyOCBDLTIwLjMxOTM3NSAyNy4wNzE4NzUgLTE5LjYzODc1IDI2LjE0Mzc1IC0xOC45Mzc1IDI1LjE4NzUgQy0xNi4yOTQzMTIzNCAyMC44MzkwMjk5NyAtMTYuODYxMjA4MTUgMTcuODI0MTczMzMgLTE4IDEzIEMtMTguNjU5OTY3OSAxMS4zMzA2Njk0MiAtMTkuMzI1NTg4NjkgOS42NjM1NDc5IC0yMCA4IEMtMjAuMTI1IDQuNjg3NSAtMjAuMTI1IDQuNjg3NSAtMjAgMiBDLTE5LjM0IDIgLTE4LjY4IDIgLTE4IDIgQy0xOCAyLjY2IC0xOCAzLjMyIC0xOCA0IEMtMTYuNjggNCAtMTUuMzYgNCAtMTQgNCBDLTE0IDQuNjYgLTE0IDUuMzIgLTE0IDYgQy0xNC45OSA2IC0xNS45OCA2IC0xNyA2IEMtMTUuOTcwMjgxNCAxMS4yMzU1MDE3NyAtMTUuOTcwMjgxNCAxMS4yMzU1MDE3NyAtMTMuNzUgMTYgQy0xMC45NzQxNDAxOSAxNy41ODYyMDU2MSAtOS4xMjcxMzUyNSAxNy41MTA1NTI2OSAtNiAxNyBDLTIuMzk2ODM5NzggMTMuNjg4OTg3OTEgLTEuNDQ3Mjk0NzYgMTAuODA4NDE4NyAtMSA2IEMtMy4zMSA2LjMzIC01LjYyIDYuNjYgLTggNyBDLTguMDQyNzIxIDUuMzMzODgwOTUgLTguMDQwNjM4MzIgMy42NjYxNzExNSAtOCAyIEMtNS45NTQ0Nzk1OCAtMC4wNDU1MjA0MiAtMi43Mjk0MTkxNCAwLjIzOTQyMjczIDAgMCBaICIgZmlsbD0iIzIyNzg1NSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM3MCw2MikiLz4KPHBhdGggZD0iTTAgMCBDMC45NDg3NSAwLjY2IDEuODk3NSAxLjMyIDIuODc1IDIgQzMuMzAxNTM3MjcgNi4zNTA2ODAxOCAzLjQ1MjcyODcyIDguMjkzODg3MTIgMC42MjUgMTEuNzUgQy0wLjI4MjUgMTIuNDkyNSAtMS4xOSAxMy4yMzUgLTIuMTI1IDE0IEMtMi43MDYzNjcxOSAxNC41MTY5MTQwNiAtMy4yODc3MzQzOCAxNS4wMzM4MjgxMiAtMy44ODY3MTg3NSAxNS41NjY0MDYyNSBDLTYuNzk2MjA2MzYgMTcuNDI5OTAwMDYgLTkuMjc0ODQ0NzUgMTcuNzMzMjU1NzkgLTEyLjY4NzUgMTguMTg3NSBDLTEzLjgyMzE2NDA2IDE4LjM0NjA1NDY5IC0xNC45NTg4MjgxMiAxOC41MDQ2MDkzOCAtMTYuMTI4OTA2MjUgMTguNjY3OTY4NzUgQy0xOS4xMjUgMTkgLTE5LjEyNSAxOSAtMjIuMTI1IDE5IEMtMjMuOTMxNDYxMTggMTUuMzg3MDc3NjQgLTI1LjEyNSAxMi45OTMwMDYgLTI1LjEyNSA4LjkzNzUgQy0yMy41NjkwNzIyNyA0LjM2Njk2MjI5IC0yMS4wMzM3Mjg5IDEuMTk5NzcyNDUgLTE2LjkzNzUgLTEuMzc1IEMtMTEuMDE1MDAyNTMgLTIuNjkxMTEwNTUgLTUuMzkzODE5MTMgLTMuMDkxNTc5MjYgMCAwIFogTS0xOC4xMjUgNSBDLTE4Ljc4NSA2LjMyIC0xOS40NDUgNy42NCAtMjAuMTI1IDkgQy0xOC44MDUgNy42OCAtMTcuNDg1IDYuMzYgLTE2LjEyNSA1IEMtMTYuNzg1IDUgLTE3LjQ0NSA1IC0xOC4xMjUgNSBaIE0tMTIuMTI1IDkgQy0xMy45NTgwMDkwOSAxMS4xMDU3NTY0MyAtMTMuOTU4MDA5MDkgMTEuMTA1NzU2NDMgLTE1LjEyNSAxMyBDLTkuMzI4NzM4OTMgMTIuNjAwMjU3ODYgLTUuNzEwMjc1MzcgMTEuODk3NDg0MDcgLTEuMTI1IDggQy0xLjEyNSA3LjAxIC0xLjEyNSA2LjAyIC0xLjEyNSA1IEMtNS45NTc3NzI2OCA0LjQzMTQzODUxIC04LjM2ODA4Njg2IDYuMDU5ODA3MTEgLTEyLjEyNSA5IFogIiBmaWxsPSIjMjIxRTIwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1ODUuMTI1LDQ5KSIvPgo8cGF0aCBkPSJNMCAwIEMyLjk3IDAgNS45NCAwIDkgMCBDOS4zMyAxLjMyIDkuNjYgMi42NCAxMCA0IEMxMC41MTU2MjUgMy4zNCAxMS4wMzEyNSAyLjY4IDExLjU2MjUgMiBDMTQuODI2NDEzMTkgLTAuNjc4MDgyNjIgMTYuODgzOTk1MjUgLTAuMzgxMTExNTUgMjEgMCBDMjEuNjYgMC4zMyAyMi4zMiAwLjY2IDIzIDEgQzIyLjY3IDMuNjQgMjIuMzQgNi4yOCAyMiA5IEMxOSAxMCAxOSAxMCAxNy4wNjI1IDkuMzEyNSBDMTYuMzgxODc1IDkuMjA5Mzc1IDE1LjcwMTI1IDkuMTA2MjUgMTUgOSBDMTEuNjQ5OTE3OTUgMTEuNzc1NzgyMjcgMTAuMTM2Mzk1ODYgMTMuNjg5OTI2MiA5LjY4MzU5Mzc1IDE4LjAzOTA2MjUgQzkuNjAyMzgyODEgMTkuMjIyNDIxODcgOS41MjExNzE4OCAyMC40MDU3ODEyNSA5LjQzNzUgMjEuNjI1IEM5LjM1MzcxMDk0IDIyLjgxMzUxNTYzIDkuMjY5OTIxODcgMjQuMDAyMDMxMjUgOS4xODM1OTM3NSAyNS4yMjY1NjI1IEM5LjEyMzAwNzgxIDI2LjE0MTc5Njg3IDkuMDYyNDIxODcgMjcuMDU3MDMxMjUgOSAyOCBDNi4wMyAyOCAzLjA2IDI4IDAgMjggQzAgMTguNzYgMCA5LjUyIDAgMCBaICIgZmlsbD0iIzAwODQyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjE3Niw1MykiLz4KPHBhdGggZD0iTTAgMCBDMC40OTUgMS40ODUgMC40OTUgMS40ODUgMSAzIEMwLjAxIDMuOTkgLTAuOTggNC45OCAtMiA2IEMtMi43MjcwMzEyNSA1LjczNDQ1MzEzIC0zLjQ1NDA2MjUgNS40Njg5MDYyNSAtNC4yMDMxMjUgNS4xOTUzMTI1IEMtMjUuMTQ4Njk1MTMgLTIuMTYyNDkwMzQgLTQ1LjE2MzM2MjQ5IC0xLjA2MjQxOCAtNjYgNiBDLTY2LjMzIDQuMzUgLTY2LjY2IDIuNyAtNjcgMSBDLTQ4Ljc3Mzk1ODUzIC05LjkzNTYyNDg4IC0xOC43MTE0Nzg5MyAtOC4zODU4NDYyMiAwIDAgWiAiIGZpbGw9IiNFODIwMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4MjAsMzUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuNjYgMCAxLjMyIDAgMiAwIEMyLjMzIDEuNjUgMi42NiAzLjMgMyA1IEM0LjY1IDUgNi4zIDUgOCA1IEM3LjAxIDYuNDg1IDcuMDEgNi40ODUgNiA4IEM1LjgzMjg2NDMxIDEwLjYyNTMxNTI0IDUuODMyODY0MzEgMTAuNjI1MzE1MjQgNiAxMyBDNi45MDc1IDEyLjQ4NDM3NSA3LjgxNSAxMS45Njg3NSA4Ljc1IDExLjQzNzUgQzEyIDEwIDEyIDEwIDE0LjM3NSAxMC4zMTI1IEMxNC45MTEyNSAxMC41MzkzNzUgMTUuNDQ3NSAxMC43NjYyNSAxNiAxMSBDMTUuNjcgMTIuMzIgMTUuMzQgMTMuNjQgMTUgMTUgQzE2Ljk4IDE0LjY3IDE4Ljk2IDE0LjM0IDIxIDE0IEMxOS42OCAxNi42NCAxOC4zNiAxOS4yOCAxNyAyMiBDMTYuMjM4MTY0MDYgMjEuNzgzNDM3NSAxNS40NzYzMjgxMyAyMS41NjY4NzUgMTQuNjkxNDA2MjUgMjEuMzQzNzUgQzMuNTQ5MjExNDUgMTguMzM5MTEzMiAtMy45OTQ5NjA1MyAxOC41NDQyMTE5MSAtMTUgMjIgQy0xNi4zMiAxOS4zNiAtMTcuNjQgMTYuNzIgLTE5IDE0IEMtMTYuNjkgMTQuMzMgLTE0LjM4IDE0LjY2IC0xMiAxNSBDLTEyLjY2IDEzLjM1IC0xMy4zMiAxMS43IC0xNCAxMCBDLTEwLjI4MTExNzYxIDEwLjUwNzEyMDMzIC03LjI2NTQ1NzYxIDExLjExNjA4MjE1IC00IDEzIEMtMy43OTkxMzU1NyA5LjI4NDAwODA5IC0zLjg0ODA1NjMgOC4yMjc5MTU1NSAtNiA1IEMtNC4zNSA1IC0yLjcgNSAtMSA1IEMtMC42NyAzLjM1IC0wLjM0IDEuNyAwIDAgWiAiIGZpbGw9IiNGM0Y4RjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNjAsMzcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzEuNzQyMTY3OTcgMC4wNTQxNDA2MyAxLjc0MjE2Nzk3IDAuMDU0MTQwNjMgMy41MTk1MzEyNSAwLjEwOTM3NSBDNC4zOTk5NjA5NCAwLjE1NTc4MTI1IDUuMjgwMzkwNjMgMC4yMDIxODc1IDYuMTg3NSAwLjI1IEM1Ljg1NzUgMS45IDUuNTI3NSAzLjU1IDUuMTg3NSA1LjI1IEMzLjIwNzUgNS41OCAxLjIyNzUgNS45MSAtMC44MTI1IDYuMjUgQy0xLjA1MDMzMjAzIDcuMzU0MDgyMDMgLTEuMDUwMzMyMDMgNy4zNTQwODIwMyAtMS4yOTI5Njg3NSA4LjQ4MDQ2ODc1IEMtMi43NDE2MTc3NyAxNC41MzkxODMxOCAtMy44MTM2MDk0MSAxOC40MDQ2OTk1NSAtOC44MTI1IDIyLjI1IEMtMTEuNTc3MDIwMzMgMjMuNjMyMjYwMTYgLTEzLjg1ODYzNjMgMjMuMzQ1MjUzODcgLTE2LjkzNzUgMjMuMzEyNSBDLTE4LjAzMzIwMzEyIDIzLjMwMzQ3NjU2IC0xOS4xMjg5MDYyNSAyMy4yOTQ0NTMxMyAtMjAuMjU3ODEyNSAyMy4yODUxNTYyNSBDLTIxLjUyMjM4MjgxIDIzLjI2Nzc1MzkxIC0yMS41MjIzODI4MSAyMy4yNjc3NTM5MSAtMjIuODEyNSAyMy4yNSBDLTIyLjQ4MjUgMjEuNiAtMjIuMTUyNSAxOS45NSAtMjEuODEyNSAxOC4yNSBDLTE5LjgzMjUgMTcuOTIgLTE3Ljg1MjUgMTcuNTkgLTE1LjgxMjUgMTcuMjUgQy0xNS41ODE3NTc4MSAxNi4zNTc5Njg3NSAtMTUuMzUxMDE1NjIgMTUuNDY1OTM3NSAtMTUuMTEzMjgxMjUgMTQuNTQ2ODc1IEMtMTQuNzg3MTQ4NDQgMTMuMzc2NDA2MjUgLTE0LjQ2MTAxNTYzIDEyLjIwNTkzNzUgLTE0LjEyNSAxMSBDLTEzLjgxMTc1NzgxIDkuODM5ODQzNzUgLTEzLjQ5ODUxNTYyIDguNjc5Njg3NSAtMTMuMTc1NzgxMjUgNy40ODQzNzUgQy0xMC40NDExMzY5OSAwLjk5NjQ1MTA5IC02Ljc2ODAwODc1IC0wLjI3MzQ1NDkgMCAwIFogIiBmaWxsPSIjRjVGOUY2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDM2LjgxMjUsODQuNzUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzIuOTcgMCA1Ljk0IDAgOSAwIEM5IDkuMjQgOSAxOC40OCA5IDI4IEM2LjAzIDI4IDMuMDYgMjggMCAyOCBDMCAxOC43NiAwIDkuNTIgMCAwIFogIiBmaWxsPSIjMDA4NDJBIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDk5LDUzKSIvPgo8cGF0aCBkPSJNMCAwIEM0LjgwODE5NTIyIDAuMDEzNzU3MzUgNC44MDgxOTUyMiAwLjAxMzc1NzM1IDcuODEyNSAyLjg3NSBDOC40OTMxMjUgNC4xMTI1IDguNDkzMTI1IDQuMTEyNSA5LjE4NzUgNS4zNzUgQzYuODc3NSA1LjcwNSA0LjU2NzUgNi4wMzUgMi4xODc1IDYuMzc1IEMxLjg1NzUgOC4wMjUgMS41Mjc1IDkuNjc1IDEuMTg3NSAxMS4zNzUgQzQuNjUyNSAxMC44OCA0LjY1MjUgMTAuODggOC4xODc1IDEwLjM3NSBDOC42ODA5ODE3NSAxNC41MjAyNDY3MSA4LjMyNjA0MzA3IDE2LjE1NDk2MSA2LjA2MjUgMTkuNzUgQzMuMTg3NSAyMi4zNzUgMy4xODc1IDIyLjM3NSAwLjE4NzUgMjMuMTI1IEMtNC4xMzU1MDE1OSAyMi4wNDQyNDk2IC01LjQ3Mjc4ODMxIDIwLjA5MTAxMjY4IC03LjgxMjUgMTYuMzc1IEMtOC4xMjUgMTMgLTguMTI1IDEzIC03LjgxMjUgMTAuMzc1IEMtNS41MDI1IDEwLjM3NSAtMy4xOTI1IDEwLjM3NSAtMC44MTI1IDEwLjM3NSBDLTEuMTQyNSA5LjA1NSAtMS40NzI1IDcuNzM1IC0xLjgxMjUgNi4zNzUgQy00Ljc4MjUgNS44OCAtNC43ODI1IDUuODggLTcuODEyNSA1LjM3NSBDLTUuNjI4MjEwMTUgMC44NjA4MDA5NyAtNS4wOTkzMDg2NyAwLjE5NDExNzE3IDAgMCBaICIgZmlsbD0iI0U1RUZFQiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM2MC44MTI1LDU3LjYyNSkiLz4KPHBhdGggZD0iTTAgMCBDMTUuNTEgMCAzMS4wMiAwIDQ3IDAgQzQ3IDEuNjUgNDcgMy4zIDQ3IDUgQzMxLjQ5IDUgMTUuOTggNSAwIDUgQzAgMy4zNSAwIDEuNyAwIDAgWiAiIGZpbGw9IiMxRTcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1OTUsNzIpIi8+CjxwYXRoIGQ9Ik0wIDAgQzQuNjIgMCA5LjI0IDAgMTQgMCBDMTQgMS4zMiAxNCAyLjY0IDE0IDQgQzEwLjcgNCA3LjQgNCA0IDQgQzQgNS45OCA0IDcuOTYgNCAxMCBDNy4zIDEwIDEwLjYgMTAgMTQgMTAgQzE0IDExLjMyIDE0IDEyLjY0IDE0IDE0IEMxMC43IDE0IDcuNCAxNCA0IDE0IEM0IDE1Ljk4IDQgMTcuOTYgNCAyMCBDNy4zIDIwIDEwLjYgMjAgMTQgMjAgQzE0LjMzIDIxLjMyIDE0LjY2IDIyLjY0IDE1IDI0IEMxMC4wNSAyNCA1LjEgMjQgMCAyNCBDMCAxNi4wOCAwIDguMTYgMCAwIFogIiBmaWxsPSIjMDA4NDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDU2LDg1KSIvPgo8cGF0aCBkPSJNMCAwIEMxNC41MiAwIDI5LjA0IDAgNDQgMCBDNDMuMzQgMS42NSA0Mi42OCAzLjMgNDIgNSBDMjguMTQgNSAxNC4yOCA1IDAgNSBDMCAzLjM1IDAgMS43IDAgMCBaICIgZmlsbD0iIzFFNzBDMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU0MSw5NCkiLz4KPHBhdGggZD0iTTAgMCBDMTMuODYgMCAyNy43MiAwIDQyIDAgQzQyLjY2IDEuNjUgNDMuMzIgMy4zIDQ0IDUgQzI5LjQ4IDUgMTQuOTYgNSAwIDUgQzAgMy4zNSAwIDEuNyAwIDAgWiAiIGZpbGw9IiMxRTcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1NDEsNTcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzEuOTUxOTMyMjEgNS44NTU3OTY2MyAzLjYyOTIyNzk1IDE1LjU1OTg2NzYxIDAuOTE0MDYyNSAyMS4yOTI5Njg3NSBDMC40NDc0MjE4NyAyMS44MzU2NjQwNiAtMC4wMTkyMTg3NSAyMi4zNzgzNTkzOCAtMC41IDIyLjkzNzUgQy0zLjIyMjkwNTM0IDI1LjY1Mjg1NDI2IC0zLjIyMjkwNTM0IDI1LjY1Mjg1NDI2IC0zLjExMzI4MTI1IDI4LjQwNjI1IEMtMi44NDc1MjI1NiAzMC42NDI3NjQ2OSAtMi41MDI2MTIyNCAzMi44MDU0MjU3OCAtMiAzNSBDLTYuNjI1IDM4IC02LjYyNSAzOCAtMTAgMzggQy0xMC4zMyAzOS4zMiAtMTAuNjYgNDAuNjQgLTExIDQyIEMtMTIuMzIgNDIgLTEzLjY0IDQyIC0xNSA0MiBDLTE2LjcwMzEyNSA0MC4xMDE1NjI1IC0xNi43MDMxMjUgNDAuMTAxNTYyNSAtMTguMjUgMzcuNjI1IEMtMTguNzcwNzgxMjUgMzYuODEyODkwNjIgLTE5LjI5MTU2MjUgMzYuMDAwNzgxMjUgLTE5LjgyODEyNSAzNS4xNjQwNjI1IEMtMjEgMzMgLTIxIDMzIC0yMSAzMSBDLTE4LjA5NDUxMTE4IDI4Ljk1ODMwNTE1IC0xNi41OTg1Nzk1NCAyOCAtMTMgMjggQy0xMyAyOC45OSAtMTMgMjkuOTggLTEzIDMxIEMtMTAuMDI5ODIzMDYgMzAuMzcxODk4MjcgLTEwLjAyOTgyMzA2IDMwLjM3MTg5ODI3IC03IDI5IEMtNS44MDE2MTc5MSAyNi42NzE0NTUzNyAtNS44MDE2MTc5MSAyNi42NzE0NTUzNyAtNSAyNCBDLTQuMzI1ODIwMzEgMjMuMjk4NzUgLTMuNjUxNjQwNjMgMjIuNTk3NSAtMi45NTcwMzEyNSAyMS44NzUgQy0wLjI3MTkxNzk2IDE3LjkzMDQwMjQ0IC0wLjU4MDIxNDc2IDE0Ljk1NDI2NzczIC0wLjgxMjUgMTAuMzEyNSBDLTEuMDkwOTg5MDUgMi4xODE5NzgxMSAtMS4wOTA5ODkwNSAyLjE4MTk3ODExIDAgMCBaICIgZmlsbD0iI0VCRjNFRiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM0Miw2NSkiLz4KPHBhdGggZD0iTTAgMCBDLTAuNDAyODE3NzEgNS44NDA4NTY3NCAtMS4xMTI3NzkgOS4zNzczNTg4MSAtNSAxNCBDLTguMjkwNzY2NiAxNi43MTg0NTkzNyAtMTAuMDk2NDA4NjQgMTcuOTMzMDY3MzEgLTE0LjM3NSAxOC4yNSBDLTE1LjI0MTI1IDE4LjE2NzUgLTE2LjEwNzUgMTguMDg1IC0xNyAxOCBDLTE2LjY2ODA5NTE4IDExLjY5MzgwODQyIC0xNS41MDUxNjQ5NyA3LjU2NTU1NTkzIC0xMSAzIEMtNy4yMTg5MzIxOCAwLjU1ODA2MDM3IC00LjQ5MzYzOTc2IC0wLjM5NjQ5NzYzIDAgMCBaICIgZmlsbD0iIzAwMDAwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQ1LDM3KSIvPgo8cGF0aCBkPSJNMCAwIEM0Ljc1MDUzNTExIC0wLjA3NDM1MjIyIDkuNTAwNzI4ODcgLTAuMTI4Njk2OTEgMTQuMjUxNzA4OTggLTAuMTY0Nzk0OTIgQzE1Ljg2NjY3Nzg5IC0wLjE3OTg0ODc2IDE3LjQ4MTYwNjEzIC0wLjIwMDI5NjQ4IDE5LjA5NjQzNTU1IC0wLjIyNjMxODM2IEMyMS40MjI0NjU1NSAtMC4yNjI4NTI4NiAyMy43NDc5NTM0MSAtMC4yNzk3NjAxNSAyNi4wNzQyMTg3NSAtMC4yOTI5Njg3NSBDMjcuMTUxMDcxODUgLTAuMzE2MTk0NTMgMjcuMTUxMDcxODUgLTAuMzE2MTk0NTMgMjguMjQ5Njc5NTcgLTAuMzM5ODg5NTMgQzMyLjY1ODMwNTk5IC0wLjM0MTM1Nzg4IDM1LjUyNjI3Nzc5IDAuMjE1ODYwOTQgMzkgMyBDMzkgMy42NiAzOSA0LjMyIDM5IDUgQzI2LjEzIDUgMTMuMjYgNSAwIDUgQzAgMy4zNSAwIDEuNyAwIDAgWiAiIGZpbGw9IiMxRTcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1NDEsNTApIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuNjYgMCAxLjMyIDAgMiAwIEM1LjE4NDE5OTU5IDMuNzk2NTQ1NjcgNS4zODczNDU0OCA3LjExNjc2MjIgNS4yMzgyODEyNSAxMS44NjMyODEyNSBDNC45NDYwNDkxMyAxNC40ODM3ODg5NyA0LjA0MjM4MTk1IDE2LjU4OTQ5MTczIDMgMTkgQzIuNDgyMDk2ODIgMjMuMDU2OTA4MjUgMi42OTk5NDI5NCAyNC41NDk5MTQ0MSA1IDI4IEM3LjMzNDU4NjM1IDMxLjUwMTg3OTUzIDcuNjcyNjA3MjcgMzIuODgwMjgwNDcgNyAzNyBDNi4zNDg5OTE3IDM4LjE2Njk1MjY0IDUuNjU4MzE0NjEgMzkuMzEyMzI1OTggNC45Mzc1IDQwLjQzNzUgQzMuMTY4MTQxMTcgNDMuMjg2MDQyMjIgMi45OTk2OTkxNiA0My45ODI4NTIyOSAzLjA2MjUgNDcuNTYyNSBDNC4wMDI5NTg2MSA1MS4wMTA4NDgyMyA1LjM3ODg4Njc3IDUzLjgyODI1NjcyIDcgNTcgQzcgNTguMzIgNyA1OS42NCA3IDYxIEM1LjAyIDYxLjQ5NSA1LjAyIDYxLjQ5NSAzIDYyIEMyLjcxMTI1IDYwLjc4MzEyNSAyLjQyMjUgNTkuNTY2MjUgMi4xMjUgNTguMzEyNSBDMS41MTk4MDg4OSA1NS44MzA3ODEwNyAwLjg5MjAyOTY2IDUzLjc2NzAxMTM3IC0wLjE4NzUgNTEuNDM3NSBDLTEuMzQyMzE4NDQgNDcuOTczMDQ0NjggLTAuODE4NjU2ODYgNDUuNTI2NTIxODcgMCA0MiBDMC43NzM0Mzc1IDQwLjczMTU2MjUgMC43NzM0Mzc1IDQwLjczMTU2MjUgMS41NjI1IDM5LjQzNzUgQzMuNDExMzY2MjEgMzYuMzAyNDY1OTkgMy41MTMyNzU5MiAzNC41OTI5MzE0MSAzIDMxIEMyLjM0IDMwLjAxIDEuNjggMjkuMDIgMSAyOCBDLTEuMzMwNDM1NTggMjQuNTA0MzQ2NjQgLTEuNTg3NjMyNDQgMjMuMTEzNDI3MSAtMSAxOSBDLTAuNTA1IDE3Ljg2NTYyNSAtMC4wMSAxNi43MzEyNSAwLjUgMTUuNTYyNSBDMi41NDM3NjAwOCAxMC43MDg1Njk4MSAyLjY5NzAxMDU0IDcuMDQ3NDY4NDUgMSAyLjA2MjUgQzAuNjcgMS4zODE4NzUgMC4zNCAwLjcwMTI1IDAgMCBaICIgZmlsbD0iI0U5RjFFRSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM2OSw1OSkiLz4KPHBhdGggZD0iTTAgMCBDMS4zMiAwLjMzIDIuNjQgMC42NiA0IDEgQzUuMTU2NjQ3MzcgNi40ODI2OTA2OSA1LjExNDE2MjU1IDExLjgwMzM5Mjc0IDUuMDYyNSAxNy4zNzUgQzUuMDU3OTg4MjggMTguMzAxODM1OTQgNS4wNTM0NzY1NiAxOS4yMjg2NzE4OCA1LjA0ODgyODEyIDIwLjE4MzU5Mzc1IEM1LjAzNzExNTc0IDIyLjQ1NTc5NzA5IDUuMDIwNzEzNzIgMjQuNzI3ODYzODggNSAyNyBDMy4zNSAyNy4zMyAxLjcgMjcuNjYgMCAyOCBDLTIuNjA1MTM5NTkgMjQuMDkyMjkwNjIgLTIuMjkzNjc1NjUgMjAuNzc3NzA5MjEgLTIuMjUgMTYuMjUgQy0yLjI1NzczNDM4IDE1LjQ2MzY3MTg4IC0yLjI2NTQ2ODc1IDE0LjY3NzM0Mzc1IC0yLjI3MzQzNzUgMTMuODY3MTg3NSBDLTIuMjU2ODM4MzYgOC44NzA4NDc1NSAtMS41OTU2NjE5NSA0LjczNjMyOTkxIDAgMCBaICIgZmlsbD0iIzIyMUUyMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTY5LDcxKSIvPgo8cGF0aCBkPSJNMCAwIEMxLjY3NTQyOTc2IDAuMjg2MDQ4OTggMy4zNDM4NTM0MyAwLjYxNzgxMjMzIDUgMSBDNi4wNjgwODM3NCA3LjI3NDk5MTk3IDcuMDQzNjc4MzkgMTMuODY4OTY0ODMgNSAyMCBDNC40NDQ5NTIwOSAyNS44ODM1MDc4OCA1Ljc0ODA2MTcyIDI4LjIyMzcxNTY1IDkgMzMgQzkuNjgyNDU2MDcgMzcuMDA5NDI5NCA5LjA2MjU0MzA2IDM5LjEyMDM1OTYxIDYuOTM3NSA0Mi40Mzc1IEM1LjE4NzQ3ODQxIDQ1LjI2MTExNjM5IDQuOTk5MzU1NTggNDUuOTYzOTEyNyA1LjA2MjUgNDkuNSBDNi4wNjQxNTYzNSA1My4yMzk1MTcwMiA3LjQxMDgyMDg0IDU2LjQ3NjE2Nzk1IDkgNjAgQzkgNjAuNjYgOSA2MS4zMiA5IDYyIEM4LjAxIDYyIDcuMDIgNjIgNiA2MiBDNS4xMjcyMDEzOCA2MC4xMzM2MDAxOSA0LjI3NzQ4OTczIDU4LjI1NjM5Mzg5IDMuNDM3NSA1Ni4zNzUgQzIuOTYxODM1OTQgNTUuMzMwODU5MzggMi40ODYxNzE4OCA1NC4yODY3MTg3NSAxLjk5NjA5Mzc1IDUzLjIxMDkzNzUgQzAuODc4NDcyMzMgNDkuNjA4MjUxOTcgMS4wMTg2Mjk2NiA0Ny42MDg1ODA1MSAyIDQ0IEMyLjUxNTYyNSA0My4xNzUgMy4wMzEyNSA0Mi4zNSAzLjU2MjUgNDEuNSBDNS4zODcwMjc1NiAzOC4zMjY5MDg1OCA1LjUxNjQ0MTE4IDM2LjYxNTA4ODI1IDUgMzMgQzQuMzE5Mzc1IDMyLjA3MTg3NSAzLjYzODc1IDMxLjE0Mzc1IDIuOTM3NSAzMC4xODc1IEMwLjMyMzM1MDI2IDI1Ljg4NjgwMjA0IDAuODgyMTgxNzcgMjIuNzc3MDAxIDIgMTggQzIuMzMgMTcuMzQgMi42NiAxNi42OCAzIDE2IEMzLjQxNzQwMjY4IDExLjA1OTExNzE1IDMuNDg3NDY4NzMgNi40MjIxNjY2NCAxIDIgQzAuMzQgMS42NyAtMC4zMiAxLjM0IC0xIDEgQy0wLjY3IDAuNjcgLTAuMzQgMC4zNCAwIDAgWiAiIGZpbGw9IiMxRDc1NTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNzAsNTcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuMzMgMC42NiAwLjY2IDEuMzIgMSAyIEMwLjY3IDIuNjYgMC4zNCAzLjMyIDAgNCBDMC4wMjM3OTA0IDYuMzExMDc4NzggMC4wMjM3OTA0IDYuMzExMDc4NzggMC4zMTI1IDguODc1IEMwLjM5MTEzMjgxIDkuNzM4NjcxODcgMC40Njk3NjU2MyAxMC42MDIzNDM3NSAwLjU1MDc4MTI1IDExLjQ5MjE4NzUgQzEuMDAzMjA3MjQgMTQuMDE3OTA0NzUgMS44MTI2MDgzMyAxNS43NDgyMTM0IDMgMTggQzMuNzA0NDkyODkgMjMuNDAxMTEyMTcgMS45Mjk0NDIzOSAyNS42MDU4MzY0MiAtMSAzMCBDLTEuNjc4NzgwNTkgMzQuMDcyNjgzNTYgLTEuMzQxNzI0MDYgMzUuNDk4MDkyNzkgMSAzOC45Mzc1IEMzLjQ1MjU5MTI5IDQyLjY5MzAzMDQxIDMuNTUxNTQyOTEgNDQuNTg3NjU2NyAzIDQ5IEMyLjA2NTUzNDY1IDUxLjAzMTQ0NjQxIDEuMDY3NzUyMjQgNTMuMDM1MzM1ODcgMCA1NSBDLTAuNjk5MDc0MTQgNTcuNzM1NzI1ODUgLTAuNjk5MDc0MTQgNTcuNzM1NzI1ODUgLTEgNjAgQy0yLjMyIDU5LjY3IC0zLjY0IDU5LjM0IC01IDU5IEMtNC41MjI2OTE2MiA1Ny41NDEwNTc0IC00LjA0MzA4OTU4IDU2LjA4Mjg2NTA0IC0zLjU2MjUgNTQuNjI1IEMtMy4xNjIyNDYwOSA1My40MDY4MzU5NCAtMy4xNjIyNDYwOSA1My40MDY4MzU5NCAtMi43NTM5MDYyNSA1Mi4xNjQwNjI1IEMtMiA1MCAtMiA1MCAtMSA0OCBDLTAuNTQzMTA3NzYgNDQuMDcwNzI2NzUgLTAuOTU5NzA3MDkgNDEuNzM5NDU4MTMgLTMgMzguNDM3NSBDLTUuNzU4MjkzODQgMzMuNjk2NjgyNDYgLTUuNzU4MjkzODQgMzMuNjk2NjgyNDYgLTUgMzAgQy00LjM0IDI5LjA1MTI1IC0zLjY4IDI4LjEwMjUgLTMgMjcuMTI1IEMtMC41ODgzOTUzIDIzLjM1Njg2NzY2IC0wLjUyMDEwNzIzIDIxLjM5OTAxNzAyIC0xIDE3IEMtMS4zMyAxNi4xOTU2MjUgLTEuNjYgMTUuMzkxMjUgLTIgMTQuNTYyNSBDLTMuNDY1MDU4MjkgMTAuODA4Mjg4MTIgLTMuMzIwMjAxNTkgOC4wMzQ1NDAwMiAtMyA0IEMtMS41IDEuNSAtMS41IDEuNSAwIDAgWiAiIGZpbGw9IiNGMUY2RjQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNTEsNjApIi8+CjxwYXRoIGQ9Ik0wIDAgQzMgMSAzIDEgNSA0IEM1IDQuOTkgNSA1Ljk4IDUgNyBDNS42NiA2LjY3IDYuMzIgNi4zNCA3IDYgQzguNTQwMjM5OTYgNS45MzA0OTQ1OSAxMC4wODMzNDk4OCA1LjkxNTQ3NjQzIDExLjYyNSA1LjkzNzUgQzEyLjg1MDg5ODQ0IDUuOTUxMDM1MTYgMTIuODUwODk4NDQgNS45NTEwMzUxNiAxNC4xMDE1NjI1IDUuOTY0ODQzNzUgQzE1LjA0MTI4OTA2IDUuOTgyMjQ2MDkgMTUuMDQxMjg5MDYgNS45ODIyNDYwOSAxNiA2IEMxNS4yMzY4NzUgNi43NDI1IDE0LjQ3Mzc1IDcuNDg1IDEzLjY4NzUgOC4yNSBDMTEuMDU1OTU5NzIgMTAuNzU4MDE3NDUgMTEuMDU1OTU5NzIgMTAuNzU4MDE3NDUgOS42NTIzNDM3NSAxMy4wOTc2NTYyNSBDNy41MTM0ODk4OSAxNS41NjAxMTkyIDYuMDYwMDUxNDUgMTUuNzE4NTYzODUgMi44NzUgMTYuMTg3NSBDLTAuMzYzMTQzNTQgMTYuNDU4MzM3OTMgLTAuMzYzMTQzNTQgMTYuNDU4MzM3OTMgLTMgMTggQy00LjY2NjE3MTE1IDE4LjA0MDYzODMyIC02LjMzMzg4MDk1IDE4LjA0MjcyMSAtOCAxOCBDLTcuMjU5NDMzNTkgMTYuOTMwNzIyNjYgLTcuMjU5NDMzNTkgMTYuOTMwNzIyNjYgLTYuNTAzOTA2MjUgMTUuODM5ODQzNzUgQy0xLjU0NzYwNyA4LjUwMTAxOTAzIC0xLjU0NzYwNyA4LjUwMTAxOTAzIDAgMCBaICIgZmlsbD0iI0VGRjVGMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMyNiw1NSkiLz4KPHBhdGggZD0iTTAgMCBDMS44NzUgMS4xMjUgMS44NzUgMS4xMjUgMyAzIEMzLjY4NzUgNi4xODc1IDMuNjg3NSA2LjE4NzUgNCA5IEMwLjM3IDkgLTMuMjYgOSAtNyA5IEMtNi4wMSA5Ljk5IC01LjAyIDEwLjk4IC00IDEyIEMtMC4zNTQ1ODE1NSAxMS43NjUyMjgwMSAtMC4zNTQ1ODE1NSAxMS43NjUyMjgwMSAzIDExIEMyLjY3IDEyLjY1IDIuMzQgMTQuMyAyIDE2IEMtNC4yNDE1OTc5NyAxNy4zNDYyMjcwMSAtNC4yNDE1OTc5NyAxNy4zNDYyMjcwMSAtNy44NzUgMTUuNjg3NSBDLTEwIDE0IC0xMCAxNCAtMTEgMTIgQy0xMS41NzE0Mjg1NyA0LjkxNDI4NTcxIC0xMS41NzE0Mjg1NyA0LjkxNDI4NTcxIC05LjQzNzUgMS41IEMtNi4wODk2NTY1MSAtMC41NjAyMTEzOCAtMy44NTk4NTc1MyAtMC40OTEyNTQ1OSAwIDAgWiBNLTUgMyBDLTUuOTkgNC40ODUgLTUuOTkgNC40ODUgLTcgNiBDLTQuNjkgNiAtMi4zOCA2IDAgNiBDLTAuNjYgNS4wMSAtMS4zMiA0LjAyIC0yIDMgQy0yLjk5IDMgLTMuOTggMyAtNSAzIFogIiBmaWxsPSIjMDA4NDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTAwLDkzKSIvPgo8cGF0aCBkPSJNMCAwIEMxMC44OSAwIDIxLjc4IDAgMzMgMCBDMzIuNjcgMS4zMiAzMi4zNCAyLjY0IDMyIDQgQzI5LjA3ODAyMzEgNS40NjA5ODg0NSAyNi41MDEwNjUyNSA1LjExMTM0OTAxIDIzLjI0MjE4NzUgNS4wOTc2NTYyNSBDMjIuMjQ3NjEwMzIgNS4wOTU1MzM4MyAyMi4yNDc2MTAzMiA1LjA5NTUzMzgzIDIxLjIzMjk0MDY3IDUuMDkzMzY4NTMgQzE5LjExMzU4MTM3IDUuMDg3NzY3NTQgMTYuOTk0MzI3NDEgNS4wNzUyMTUgMTQuODc1IDUuMDYyNSBDMTMuNDM4ODAzNjEgNS4wNTc0ODUxMiAxMi4wMDI2MDU1NiA1LjA1MjkyMjE5IDEwLjU2NjQwNjI1IDUuMDQ4ODI4MTIgQzcuMDQ0MjM2NTUgNS4wMzc3OTc4MiAzLjUyMjEyODU1IDUuMDIwNTMyNTkgMCA1IEMwIDMuMzUgMCAxLjcgMCAwIFogIiBmaWxsPSIjMUU3MEMwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTQ5LDcyKSIvPgo8cGF0aCBkPSJNMCAwIEM0LjIxNzQ5MjE5IC0wLjA3NDE5MTM0IDguNDM0NjM4MTEgLTAuMTI4NjIwNCAxMi42NTI1ODc4OSAtMC4xNjQ3OTQ5MiBDMTQuMDg3MjI1NTIgLTAuMTc5ODc1ODkgMTUuNTIxODE3MDggLTAuMjAwMzQzOCAxNi45NTYyOTg4MyAtMC4yMjYzMTgzNiBDMTkuMDE5MTU4NTkgLTAuMjYyNzM0MzcgMjEuMDgxNDA4NTggLTAuMjc5NzMyNDMgMjMuMTQ0NTMxMjUgLTAuMjkyOTY4NzUgQzI1LjAwNjIxOTQ4IC0wLjMxNjUzNDQyIDI1LjAwNjIxOTQ4IC0wLjMxNjUzNDQyIDI2LjkwNTUxNzU4IC0wLjM0MDU3NjE3IEMzMCAwIDMwIDAgMzEuOTI4NDY2OCAxLjM5MzMxMDU1IEMzMyAzIDMzIDMgMzMgNSBDMjIuMTEgNSAxMS4yMiA1IDAgNSBDMCAzLjM1IDAgMS43IDAgMCBaICIgZmlsbD0iIzFGNzBDMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU0OSw3OSkiLz4KPHBhdGggZD0iTTAgMCBDMC42NiAwIDEuMzIgMCAyIDAgQzIuMDg2MzY3MTkgMC41Njg0NzY1NiAyLjE3MjczNDM3IDEuMTM2OTUzMTIgMi4yNjE3MTg3NSAxLjcyMjY1NjI1IEMzLjM1MjcwNTM2IDcuNzE4MDc4MSA1LjI4MTQzMTU2IDExLjIwNTAwMzg1IDkgMTYgQzkgMTYuNjYgOSAxNy4zMiA5IDE4IEM4LjI3NTU0Njg3IDE3Ljg0NjYwMTU2IDcuNTUxMDkzNzUgMTcuNjkzMjAzMTIgNi44MDQ2ODc1IDE3LjUzNTE1NjI1IEM0LjA3MzM2NjA3IDE2Ljk3MzE0OTc3IDQuMDczMzY2MDcgMTYuOTczMTQ5NzcgMS41NzAzMTI1IDE2Ljc0NjA5Mzc1IEMtNC45MDkwNjM1OCAxNS45Mjg0MDg5MSAtNy44MDY5NTYzOCAxMy44OTExMzYyMyAtMTEuODIwMzEyNSA4Ljc3NzM0Mzc1IEMtMTMgNyAtMTMgNyAtMTMgNiBDLTYuMzc1IDUuODc1IC02LjM3NSA1Ljg3NSAtMyA3IEMtMi44NzYyNSA2LjQwMTg3NSAtMi43NTI1IDUuODAzNzUgLTIuNjI1IDUuMTg3NSBDLTIgMyAtMiAzIDAgMCBaICIgZmlsbD0iI0YyRjdGNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM5NCw1NSkiLz4KPHBhdGggZD0iTTAgMCBDMSAyIDEgMiAwLjkzNzUgNS44MTI1IEMwLjg3OTY0ODA4IDkuMzg2NDYzMTggMS42NDA2MzE3NyAxMS42ODY1Mzk5NCAzIDE1IEMzLjQ3NzIyODgxIDE5LjM3NDU5NzM5IDMuNDk4NjQwNDQgMjEuMjg5ODE1MTMgMC45Mzc1IDI0LjkzNzUgQy0xLjA1MTY1MDY5IDI4LjA4MTY0MTQxIC0xLjI4MzkwMDM2IDI4LjY1NDU4MTU5IC0wLjkzNzUgMzIuMTI1IEMtMC4wNDE1OTEyMiAzNS44MjgwODk2MSAwLjc4Mzk2MDg3IDM3LjEwOTUxNDE4IDMgNDAgQzMuNjQwNzA0NzggNDQuOTEyMDY5OTQgMi4yODAwNjUxNiA0Ny43MTM0Nzc1IDAgNTIgQy0wLjY5OTA3NDE0IDU0LjczNTcyNTg1IC0wLjY5OTA3NDE0IDU0LjczNTcyNTg1IC0xIDU3IEMtMS45OSA1NyAtMi45OCA1NyAtNCA1NyBDLTMuMjQ3ODEzNDEgNTAuNDgxMDQ5NTYgLTMuMjQ3ODEzNDEgNTAuNDgxMDQ5NTYgLTEuOTM3NSA0Ny45Mzc1IEMtMC41NTU0NjYzNyA0NS4wODEyOTcxNyAtMC42Mjk3ODY4MiA0My4xNDY4MTIgLTEgNDAgQy0xLjkyMzQ0MjExIDM4LjIzNzkyNDggLTEuOTIzNDQyMTEgMzguMjM3OTI0OCAtMy4wNjI1IDM2LjUgQy00LjcyOTM3MDExIDMzLjgyMjM2ODIyIC01LjAwMjU5OTI2IDMzLjEzMjU2MjEgLTQuOTM3NSAyOS44MTI1IEMtNCAyNyAtNCAyNyAtMi40Mzc1IDI1LjE4NzUgQy0wLjE2NjczOTU4IDIxLjczMTk5NTAyIC0wLjYxNDU0MzE5IDE4LjAyNTA1ODY1IC0xIDE0IEMtMS4zMyAxMy4wMSAtMS42NiAxMi4wMiAtMiAxMSBDLTIuMTY3OTY4NzUgOS4wNjI1IC0yLjE2Nzk2ODc1IDkuMDYyNSAtMi4xODc1IDcgQy0yLjIwMTY3OTY5IDYuMzE5Mzc1IC0yLjIxNTg1OTM4IDUuNjM4NzUgLTIuMjMwNDY4NzUgNC45Mzc1IEMtMiAzIC0yIDMgMCAwIFogIiBmaWxsPSIjMTQ3MDRCIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzQ4LDYyKSIvPgo8cGF0aCBkPSJNMCAwIEMxMi44NyAwIDI1Ljc0IDAgMzkgMCBDMzUuMDM1MDk2OTkgMy45NjQ5MDMwMSAzNS4wMzUwOTY5OSAzLjk2NDkwMzAxIDMwLjY1MTg1NTQ3IDQuMTEzNTI1MzkgQzI5LjIyMzYyMzAzIDQuMTEzMzY2ODggMjcuNzk1Mzg0NTggNC4xMDc3MDczNSAyNi4zNjcxODc1IDQuMDk3NjU2MjUgQzI1LjIzOTQzNDA1IDQuMDk1NTMzODMgMjUuMjM5NDM0MDUgNC4wOTU1MzM4MyAyNC4wODg4OTc3MSA0LjA5MzM2ODUzIEMyMS42ODQyMjQ5IDQuMDg3NzY0NjUgMTkuMjc5NjQ0NzMgNC4wNzUyMTE1NyAxNi44NzUgNC4wNjI1IEMxNS4yNDYwOTUwOSA0LjA1NzQ4NTUgMTMuNjE3MTg4NzMgNC4wNTI5MjI1IDExLjk4ODI4MTI1IDQuMDQ4ODI4MTIgQzcuOTkyMTUxNzMgNC4wMzc3OTM5NyAzLjk5NjA5MTU4IDQuMDIwNTI2NzkgMCA0IEMwIDIuNjggMCAxLjM2IDAgMCBaICIgZmlsbD0iIzFGNzBDMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU0MSwxMDIpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuNDQ1MDA2NiAyLjkzNTY2NDIzIDMuNTc0ODI0NjQgNS4yNTc0NDI5NCAzLjk2ODc1IDkuNTk3NjU2MjUgQzMuOTk4ODM1MiAxMS45MTA0NTU4IDMuNzA3ODg2MzggMTMuODY2Mzg3MzUgMy4yNSAxNi4xMjUgQzIuOTg0MTIwNjEgMjAuMjQ2MTMwNTMgMy4xMDk4NDA0MiAyMC42ODU1NzQyMiA1LjQzNzUgMjMuNzUgQzUuOTEwNTg1OTQgMjQuMjgxMDkzNzUgNi4zODM2NzE4NyAyNC44MTIxODc1IDYuODcxMDkzNzUgMjUuMzU5Mzc1IEM4IDI3IDggMjcgOCAzMSBDMTAuMzEgMzEuNjYgMTIuNjIgMzIuMzIgMTUgMzMgQzE1IDMzLjk5IDE1IDM0Ljk4IDE1IDM2IEMxNi4zMiAzNi42NiAxNy42NCAzNy4zMiAxOSAzOCBDMTkgMzguOTkgMTkgMzkuOTggMTkgNDEgQzE3LjkxNzE4NzUgNDAuNDc0MDYyNSAxNy45MTcxODc1IDQwLjQ3NDA2MjUgMTYuODEyNSAzOS45Mzc1IEMxNC4wNzY4ODc3IDM4Ljc1NjQ4MjEyIDE0LjA3Njg4NzcgMzguNzU2NDgyMTIgMTEuNSAzOS41NjI1IEM5IDQwIDkgNDAgNi4xODc1IDM4LjU2MjUgQzUuNDY1NjI1IDM4LjA0Njg3NSA0Ljc0Mzc1IDM3LjUzMTI1IDQgMzcgQzQuMTk1MjkyOTcgMzYuMTY0Njg3NSA0LjE5NTI5Mjk3IDM2LjE2NDY4NzUgNC4zOTQ1MzEyNSAzNS4zMTI1IEM1LjMwMzg2MTMxIDMwLjQ2NzI5MzAxIDUuMzAzODYxMzEgMzAuNDY3MjkzMDEgMy45MTc5Njg3NSAyNS44NjcxODc1IEMyLjk3NDUwMDc2IDI0LjU0MTY1Mzk2IDIuMDI5MTkzNjQgMjMuMjE3NDI3NDggMS4wODIwMzEyNSAyMS44OTQ1MzEyNSBDLTAuNjgwNTA5NzQgMTguODA4NDkzNzggMC4yMzQyODE5NyAxNi4zNTczNzkwNyAxIDEzIEMxLjA4MjI5MTcgMTEuNDM5MTEyMjkgMS4xMjI0NDU5OSA5Ljg3NTU1MzM3IDEuMTI1IDguMzEyNSBDMS4xMjg4NjcxOSA3LjIyMzg4NjcyIDEuMTI4ODY3MTkgNy4yMjM4ODY3MiAxLjEzMjgxMjUgNi4xMTMyODEyNSBDMC45OTc4MDczMiAzLjk2NTExMDU5IDAuNTg3NzI5NCAyLjA2NjM4MTk1IDAgMCBaICIgZmlsbD0iI0VGRjVGMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM3OCw2MykiLz4KPHBhdGggZD0iTTAgMCBDOS4yNCAwIDE4LjQ4IDAgMjggMCBDMjggMS42NSAyOCAzLjMgMjggNSBDMTguNzYgNSA5LjUyIDUgMCA1IEMwIDMuMzUgMCAxLjcgMCAwIFogIiBmaWxsPSIjMUU3MEMxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTEwLDk0KSIvPgo8cGF0aCBkPSJNMCAwIEM5LjI0IDAgMTguNDggMCAyOCAwIEMyOCAxLjY1IDI4IDMuMyAyOCA1IEMxOC43NiA1IDkuNTIgNSAwIDUgQzAgMy4zNSAwIDEuNyAwIDAgWiAiIGZpbGw9IiMxRTcwQzEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MTAsNTcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzkuMjQgMCAxOC40OCAwIDI4IDAgQzI4IDEuNjUgMjggMy4zIDI4IDUgQzE4Ljc2IDUgOS41MiA1IDAgNSBDMCAzLjM1IDAgMS43IDAgMCBaICIgZmlsbD0iIzFGNzBDMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUxMCw1MCkiLz4KPHBhdGggZD0iTTAgMCBDMCAzIDAgMyAtMSA1IEMtMS4yMTM3NzcyMSAxMC42MDcwMzIxMyAtMS4yMTM3NzcyMSAxMC42MDcwMzIxMyAwIDE2IEMwLjc1NDE0MjM1IDIyLjQ5MDU2OTM3IC0wLjI2NzY1MDE5IDI1LjU4MjA3Mjg1IC00IDMxIEMtMy45Mjc0OTIxNCAzNC41NTI4ODQ5NCAtMy4zMTc3NDE2NCAzNi40OTE2MTMzNyAtMS40Mzc1IDM5LjUgQzAuNDMyMjMyNTQgNDIuNzUxNzA4NzYgMC40OTI4MjA0OCA0NC4yNjg2NDQ5NCAwIDQ4IEMtMS4xNzkwNDA1IDUxLjQwNDQxNTYzIC0yLjU0MTk2MzU0IDU0LjcwNjM5OTc4IC00IDU4IEMtNC45OSA1Ny42NyAtNS45OCA1Ny4zNCAtNyA1NyBDLTYuNTc1MjcyMSA1NC40NTE2MzI2IC02LjE4NjYwNjY3IDUyLjM0MDI4Mjc1IC00LjkzNzUgNTAuMDYyNSBDLTMuNjI5MDkzODEgNDcuMTg0MDA2MzkgLTMuNjg2MTgxNDMgNDUuMTM4MTg1NzMgLTQgNDIgQy00LjQ5NSA0MS4wMSAtNC45OSA0MC4wMiAtNS41IDM5IEMtNy4yMTc0NTA3IDM1LjU2NTA5ODYgLTcuNTUyMzU3MzMgMzMuNzg3NTkzMTMgLTcgMzAgQy01Ljk4MjkyOTY5IDI4LjY2Nzc1MzkxIC01Ljk4MjkyOTY5IDI4LjY2Nzc1MzkxIC00Ljk0NTMxMjUgMjcuMzA4NTkzNzUgQy0yLjU3NzgwMDU3IDIzLjI4MTkyMTg1IC0yLjgyMDAzNjc0IDIwLjUwMjM1NDg2IC0zLjQzNzUgMTYuMDYyNSBDLTQuMjQwNTQ3MzkgMTAuMDc2NjY0NDYgLTMuNzgyNzc2OTMgNi4zMjc0MTg5MSAtMSAxIEMtMC42NyAwLjY3IC0wLjM0IDAuMzQgMCAwIFogIiBmaWxsPSIjRTRFRUVBIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzQ4LDYwKSIvPgo8cGF0aCBkPSJNMCAwIEMzLjkwOTM4NzAzIDMuNzM5NDEzNjggMy45MDkzODcwMyAzLjczOTQxMzY4IDQuMTMyODEyNSA2Ljg0NzY1NjI1IEM0LjEzMDIzNDM4IDcuNTc4NTU0NjkgNC4xMjc2NTYyNSA4LjMwOTQ1MzEzIDQuMTI1IDkuMDYyNSBDNC4xMjI0MjE4OCA5Ljg2MzAwNzgxIDQuMTE5ODQzNzUgMTAuNjYzNTE1NjMgNC4xMTcxODc1IDExLjQ4ODI4MTI1IEM0LjAwMTcwMTk1IDEzLjk2MzUyMTY0IDMuNjUxMDI0NzkgMTYuMzA3MDIyNDggMy4yNSAxOC43NSBDMi43NjIwMjY5NSAyMi40MjA4OTQxOCAyLjc2MjAyNjk1IDIyLjQyMDg5NDE4IDQuOTM3NSAyNS41NjI1IEM1Ljk1ODQzNzUgMjYuNzY5MDYyNSA1Ljk1ODQzNzUgMjYuNzY5MDYyNSA3IDI4IEM4LjA0NzU1MTk0IDMzLjMxNDE0MzcgNi44NDIyMzI0NCAzNi40OTk3OTg2MyA0IDQxIEMzLjM3MDk3MDM5IDQ1LjkyNzM5ODU3IDQuNzQ3ODkzNDUgNDguNjgzNDYyNDQgNyA1MyBDNyA1NC4zMiA3IDU1LjY0IDcgNTcgQzQgNTYgNCA1NiAyLjc5Njg3NSA1My45MjU3ODEyNSBDLTAuNzYwMjg1NzMgNDUuMDQ2MTUyNDIgLTAuNzYwMjg1NzMgNDUuMDQ2MTUyNDIgMSA0MCBDMS41MTU2MjUgMzkuMTc1IDIuMDMxMjUgMzguMzUgMi41NjI1IDM3LjUgQzQuMzg3MDI3NTYgMzQuMzI2OTA4NTggNC41MTY0NDExOCAzMi42MTUwODgyNSA0IDI5IEMzLjM0IDI4LjAzMDYyNSAyLjY4IDI3LjA2MTI1IDIgMjYuMDYyNSBDLTAuNDEwNTc3ODIgMjIuMzcxMzAyNzIgLTAuNDA4MzI3NTUgMjAuMzI4MjcxOTkgMCAxNiBDMC4zMyAxNS4wMSAwLjY2IDE0LjAyIDEgMTMgQzEuMDkyNDczODEgMTEuNTIzMTM4ODkgMS4xMjk5OTA3MSAxMC4wNDIyNDQ5OSAxLjEyNSA4LjU2MjUgQzEuMTI4ODY3MTkgNy40MTk3NDYwOSAxLjEyODg2NzE5IDcuNDE5NzQ2MDkgMS4xMzI4MTI1IDYuMjUzOTA2MjUgQzEuMDAyNzYwMTUgNC4wNDY4NDE0MSAwLjYwODU2MTk5IDIuMTIwMzA3MjQgMCAwIFogIiBmaWxsPSIjRTZGMEVDIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzc0LDYxKSIvPgo8cGF0aCBkPSJNMCAwIEM4LjI1IDAgMTYuNSAwIDI1IDAgQzI1LjY2IDEuNjUgMjYuMzIgMy4zIDI3IDUgQzE4LjA5IDUgOS4xOCA1IDAgNSBDMCAzLjM1IDAgMS43IDAgMCBaICIgZmlsbD0iIzFFNzBDMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU4Nyw1NykiLz4KPHBhdGggZD0iTTAgMCBDOC4yNSAwIDE2LjUgMCAyNSAwIEMyNSAxLjY1IDI1IDMuMyAyNSA1IEMxNi40MiA1IDcuODQgNSAtMSA1IEMtMC42NyAzLjM1IC0wLjM0IDEuNyAwIDAgWiAiIGZpbGw9IiMxRTcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2MjQsNTcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuNjYgMCAxLjMyIDAgMiAwIEMyLjMzIDEuNjUgMi42NiAzLjMgMyA1IEM0LjY1IDUgNi4zIDUgOCA1IEM3LjAxIDYuNDg1IDcuMDEgNi40ODUgNiA4IEM1LjgzMjg2NDMxIDEwLjYyNTMxNTI0IDUuODMyODY0MzEgMTAuNjI1MzE1MjQgNiAxMyBDNi42NiAxMy4zMyA3LjMyIDEzLjY2IDggMTQgQzcuMzQgMTQgNi42OCAxNCA2IDE0IEM2IDE0LjY2IDYgMTUuMzIgNiAxNiBDMi43IDE2IC0wLjYgMTYgLTQgMTYgQy00IDE1LjM0IC00IDE0LjY4IC00IDE0IEMtNC42NiAxMy42NyAtNS4zMiAxMy4zNCAtNiAxMyBDLTUuMzQgMTMgLTQuNjggMTMgLTQgMTMgQy0zLjc5OTEzNTU3IDkuMjg0MDA4MDkgLTMuODQ4MDU2MyA4LjIyNzkxNTU1IC02IDUgQy00LjM1IDUgLTIuNyA1IC0xIDUgQy0wLjY3IDMuMzUgLTAuMzQgMS43IDAgMCBaICIgZmlsbD0iI0Q4RTdFMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM2MCwzNykiLz4KPHBhdGggZD0iTTAgMCBDMCAxLjY1IDAgMy4zIDAgNSBDLTAuNzYzMTI1IDQuNzczMTI1IC0xLjUyNjI1IDQuNTQ2MjUgLTIuMzEyNSA0LjMxMjUgQy0zLjE5OTM3NSA0LjIwOTM3NSAtNC4wODYyNSA0LjEwNjI1IC01IDQgQy02LjgzNTQ3OTkgNS4zMzM3ODU3NSAtNi44MzU0Nzk5IDUuMzMzNzg1NzUgLTggNyBDLTcuMzQgOC42NSAtNi42OCAxMC4zIC02IDEyIEMtMy42OSAxMiAtMS4zOCAxMiAxIDEyIEMxIDEzLjMyIDEgMTQuNjQgMSAxNiBDLTUuMjAwODE5NjcgMTcuMzM3NDMxNjkgLTUuMjAwODE5NjcgMTcuMzM3NDMxNjkgLTguODEyNSAxNS44MTI1IEMtMTEuMTQwMzY2MTcgMTMuODgzNjk2NiAtMTIuMTcyMjU2MTEgMTIuODk3MTAzNjEgLTEzIDEwIEMtMTIuODU1NzAyNCA2LjUzNjg1NzUgLTEyLjM0NTYyNDk3IDQuNTI1MzQ5OTYgLTEwLjQzNzUgMS42MjUgQy02Ljg1NzUyODY3IC0wLjc2MTY0NzU1IC00LjI0ODUyOTc0IC0wLjI4MzIzNTMyIDAgMCBaICIgZmlsbD0iIzAwODQyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjE5Miw5MykiLz4KPHBhdGggZD0iTTAgMCBDMCAwLjk5IDAgMS45OCAwIDMgQzEuNjUgMyAzLjMgMyA1IDMgQzUgNC4zMiA1IDUuNjQgNSA3IEMzLjM1IDcgMS43IDcgMCA3IEMwIDkuOTcgMCAxMi45NCAwIDE2IEMxLjY1IDE1LjY3IDMuMyAxNS4zNCA1IDE1IEM1IDE2LjMyIDUgMTcuNjQgNSAxOSBDMS43MTMwMzc2NyAxOS43OTk1MzEzOCAwLjI4OTc2ODA4IDIwLjA5NjU4OTM2IC0zIDE5IEMtNC4yNjIzNzczMSAxNi40NzUyNDUzOCAtNC4wOTg1NjQwNCAxNC42ODc5OTUzNCAtNC4wNjI1IDExLjg3NSBDLTQuMDUzNDc2NTYgMTAuOTY0OTIxODggLTQuMDQ0NDUzMTMgMTAuMDU0ODQzNzUgLTQuMDM1MTU2MjUgOS4xMTcxODc1IEMtNC4wMjM1NTQ2OSA4LjQxODUxNTYyIC00LjAxMTk1MzEzIDcuNzE5ODQzNzUgLTQgNyBDLTQuOTkgNyAtNS45OCA3IC03IDcgQy0zLjg2MjA2ODk3IDAgLTMuODYyMDY4OTcgMCAwIDAgWiAiIGZpbGw9IiMwMDg0MjkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIxMzcsOTApIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuMzMgMS42NSAwLjY2IDMuMyAxIDUgQzAuMDUxMjUgNC43OTM3NSAtMC44OTc1IDQuNTg3NSAtMS44NzUgNC4zNzUgQy0zLjQyMTg3NSA0LjE4OTM3NSAtMy40MjE4NzUgNC4xODkzNzUgLTUgNCBDLTcuMzQ5NzM4MTggNS44OTc1NTE0NCAtNy4zNDk3MzgxOCA1Ljg5NzU1MTQ0IC03LjEyNSA5LjEyNSBDLTcuMDYzMTI1IDEwLjU0ODEyNSAtNy4wNjMxMjUgMTAuNTQ4MTI1IC03IDEyIEMtNC4zNiAxMiAtMS43MiAxMiAxIDEyIEMxIDEzLjMyIDEgMTQuNjQgMSAxNiBDLTUuMzI5OTc5ODggMTcuMjE3MzAzODIgLTUuMzI5OTc5ODggMTcuMjE3MzAzODIgLTguMzEyNSAxNi4yNSBDLTEwIDE1IC0xMCAxNSAtMTIgMTIgQy0xMi40NDUwNTU3NiA3Ljk5NDQ5ODEzIC0xMi4zNDMxOTE2NyA1LjY3MjA4MzY5IC0xMC41IDIuMDYyNSBDLTYuODg4MjI0MDkgLTAuOTE3MjE1MTMgLTQuNTg5MTk0MjEgLTAuMzgyNDMyODUgMCAwIFogIiBmaWxsPSIjMDA4NDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTIyLDkzKSIvPgo8cGF0aCBkPSJNMCAwIEM3LjU5IDAgMTUuMTggMCAyMyAwIEMyMy4zMyAxLjY1IDIzLjY2IDMuMyAyNCA1IEMxNi4wOCA1IDguMTYgNSAwIDUgQzAgMy4zNSAwIDEuNyAwIDAgWiAiIGZpbGw9IiMxRjcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1ODcsNTApIi8+CjxwYXRoIGQ9Ik0wIDAgQzcuMjYgMCAxNC41MiAwIDIyIDAgQzIyIDEuNjUgMjIgMy4zIDIyIDUgQzE0LjQxIDUgNi44MiA1IC0xIDUgQy0wLjY3IDMuMzUgLTAuMzQgMS43IDAgMCBaICIgZmlsbD0iIzFGNzBDMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYyNyw1MCkiLz4KPHBhdGggZD0iTTAgMCBDMy45NiAwIDcuOTIgMCAxMiAwIEMxMiAzLjY2NjY2NjY3IDEyIDcuMzMzMzMzMzMgMTIgMTEgQzguMDQgMTEgNC4wOCAxMSAwIDExIEMwIDcuMzMzMzMzMzMgMCAzLjY2NjY2NjY3IDAgMCBaICIgZmlsbD0iI0U4MjAyNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTc4MiwxMTYpIi8+CjxwYXRoIGQ9Ik0wIDAgQzkuMjQgMCAxOC40OCAwIDI4IDAgQzI4IDEuMzIgMjggMi42NCAyOCA0IEMxOC43NiA0IDkuNTIgNCAwIDQgQzAgMi42OCAwIDEuMzYgMCAwIFogIiBmaWxsPSIjMUU3MEMwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTEwLDEwMikiLz4KPHBhdGggZD0iTTAgMCBDMCAxLjY1IDAgMy4zIDAgNSBDLTAuNTU1NTg1OTQgNC41MTQwMjM0NCAtMS4xMTExNzE4OCA0LjAyODA0Njg4IC0xLjY4MzU5Mzc1IDMuNTI3MzQzNzUgQy00LjM3OTY1MzUgMS43NDk2NzE5NyAtNS44NjQwNjM4NiAxLjU2NzMyNDE5IC05LjA2MjUgMS41NjI1IEMtOS45MTk3MjY1NiAxLjU0MzE2NDA2IC0xMC43NzY5NTMxMyAxLjUyMzgyODEzIC0xMS42NjAxNTYyNSAxLjUwMzkwNjI1IEMtMTQuMTc3NTgwNDEgMS43OTY0NDEzNyAtMTQuMTc3NTgwNDEgMS43OTY0NDEzNyAtMTUuODA4NTkzNzUgNC4wMjczNDM3NSBDLTE2LjM5ODMzOTg0IDUuMDAzODA4NTkgLTE2LjM5ODMzOTg0IDUuMDAzODA4NTkgLTE3IDYgQy0xNS4wMiA2IC0xMy4wNCA2IC0xMSA2IEMtMTAuNjcgNy42NSAtMTAuMzQgOS4zIC0xMCAxMSBDLTExLjMyIDExIC0xMi42NCAxMSAtMTQgMTEgQy0xNCAxMC4zNCAtMTQgOS42OCAtMTQgOSBDLTE1LjMyIDkgLTE2LjY0IDkgLTE4IDkgQy0xOC4zMyA3LjM1IC0xOC42NiA1LjcgLTE5IDQgQy0xOS42NiA0LjY2IC0yMC4zMiA1LjMyIC0yMSA2IEMtMjEgNC4wMiAtMjEgMi4wNCAtMjEgMCBDLTEzLjk3OTM2NDY0IC0yLjM5MDAwMzUzIC02Ljg1MjIxNDU0IC0zLjUzNjYyNjg2IDAgMCBaICIgZmlsbD0iIzE5NzM0RiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM3MCw1NykiLz4KPHBhdGggZD0iTTAgMCBDNi45MyAwIDEzLjg2IDAgMjEgMCBDMjEgMS42NSAyMSAzLjMgMjEgNSBDMTQuMDcgNSA3LjE0IDUgMCA1IEMwIDMuMzUgMCAxLjcgMCAwIFogIiBmaWxsPSIjMUU3MEMwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjI5LDk0KSIvPgo8cGF0aCBkPSJNMCAwIEMwIDAuOTkgMCAxLjk4IDAgMyBDLTAuOTkgMyAtMS45OCAzIC0zIDMgQy0zIDMuNjYgLTMgNC4zMiAtMyA1IEMtMi4wMSA1LjMzIC0xLjAyIDUuNjYgMCA2IEMwIDcuMzIgMCA4LjY0IDAgMTAgQy02LjYyNSAxMi44NzUgLTYuNjI1IDEyLjg3NSAtMTAgMTQgQy0xMS4xOTI4NzQxMSAxMC4xMjMxNTkxMyAtMTIgNy4wODM3ODA3NyAtMTIgMyBDLTEwLjc1MzM2NjY5IDIuNDkxNjY0MDkgLTkuNTAyNTA2MTMgMS45OTM2ODg1NSAtOC4yNSAxLjUgQy03LjU1MzkwNjI1IDEuMjIxNTYyNSAtNi44NTc4MTI1IDAuOTQzMTI1IC02LjE0MDYyNSAwLjY1NjI1IEMtNCAwIC00IDAgMCAwIFogIiBmaWxsPSIjMUM3NTUxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzI5LDgwKSIvPgo8cGF0aCBkPSJNMCAwIEM2LjYgMCAxMy4yIDAgMjAgMCBDMjAgMS42NSAyMCAzLjMgMjAgNSBDMTMuNCA1IDYuOCA1IDAgNSBDMCAzLjM1IDAgMS43IDAgMCBaICIgZmlsbD0iIzFFNzBDMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU4Nyw5NCkiLz4KPHBhdGggZD0iTTAgMCBDMS4zMiAwIDIuNjQgMCA0IDAgQzQgNy45MiA0IDE1Ljg0IDQgMjQgQzIuNjggMjQgMS4zNiAyNCAwIDI0IEMwIDE2LjA4IDAgOC4xNiAwIDAgWiAiIGZpbGw9IiMwMDg0MjkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNzcsODUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzEuNjA4NzUgLTAuMDIwNjI1IDMuMjE3NSAtMC4wNDEyNSA0Ljg3NSAtMC4wNjI1IEM1Ljc3OTkyMTg4IC0wLjA3NDEwMTU2IDYuNjg0ODQzNzUgLTAuMDg1NzAzMTIgNy42MTcxODc1IC0wLjA5NzY1NjI1IEMxMCAwIDEwIDAgMTIgMSBDMTEuMzQgMi4zMiAxMC42OCAzLjY0IDEwIDUgQzguMzUgNSA2LjcgNSA1IDUgQzQuNjcgOC42MyA0LjM0IDEyLjI2IDQgMTYgQzIuNjggMTYgMS4zNiAxNiAwIDE2IEMwIDEwLjcyIDAgNS40NCAwIDAgWiAiIGZpbGw9IiMwMDg0MjkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIxNDksOTMpIi8+CjxwYXRoIGQ9Ik0wIDAgQzYuMjcgMCAxMi41NCAwIDE5IDAgQzE4LjY3IDEuNjUgMTguMzQgMy4zIDE4IDUgQzEyLjM5IDUgNi43OCA1IDEgNSBDMC42NyAzLjM1IDAuMzQgMS43IDAgMCBaICIgZmlsbD0iIzFGNzBDMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYwOSw3OSkiLz4KPHBhdGggZD0iTTAgMCBDNi45MyAwIDEzLjg2IDAgMjEgMCBDMjEgMS4zMiAyMSAyLjY0IDIxIDQgQzEzLjc0IDQgNi40OCA0IC0xIDQgQy0wLjY3IDIuNjggLTAuMzQgMS4zNiAwIDAgWiAiIGZpbGw9IiMxRTcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2MjEsNjUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuODEyNSAyLjE4NzUgMC44MTI1IDIuMTg3NSAxIDUgQy0xLjEyNSA3Ljg3NSAtMS4xMjUgNy44NzUgLTQgMTAgQy02LjgxMjUgOS44MTI1IC02LjgxMjUgOS44MTI1IC05IDkgQy05Ljc1IDYuNzUgLTkuNzUgNi43NSAtMTAgNCBDLTcuMTk2NDEzNTIgLTAuMTQ5MzA3OTkgLTQuODI5NDYzOCAtMC40MzkwNDIxNiAwIDAgWiAiIGZpbGw9IiMwMDg0MjkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIxMDgsNDApIi8+CjxwYXRoIGQ9Ik0wIDAgQzYuOTMgMCAxMy44NiAwIDIxIDAgQzIxIDEuMzIgMjEgMi42NCAyMSA0IEMxNC4wNyA0IDcuMTQgNCAwIDQgQzAgMi42OCAwIDEuMzYgMCAwIFogIiBmaWxsPSIjMUU3MEMwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjI5LDEwMikiLz4KPHBhdGggZD0iTTAgMCBDNi42IDAgMTMuMiAwIDIwIDAgQzIwLjMzIDEuMzIgMjAuNjYgMi42NCAyMSA0IEMxNC4wNyA0IDcuMTQgNCAwIDQgQzAgMi42OCAwIDEuMzYgMCAwIFogIiBmaWxsPSIjMUU3MEMwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTk1LDY1KSIvPgo8cGF0aCBkPSJNMCAwIEM2LjYgMCAxMy4yIDAgMjAgMCBDMjAgMS4zMiAyMCAyLjY0IDIwIDQgQzEzLjQgNCA2LjggNCAwIDQgQzAgMi42OCAwIDEuMzYgMCAwIFogIiBmaWxsPSIjMUU3MEMxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTg3LDEwMikiLz4KPHBhdGggZD0iTTAgMCBDMC4zMyAwLjY2IDAuNjYgMS4zMiAxIDIgQzAuNjcgMi42NiAwLjM0IDMuMzIgMCA0IEMwLjAyMzc5MDQgNi4zMTEwNzg3OCAwLjAyMzc5MDQgNi4zMTEwNzg3OCAwLjMxMjUgOC44NzUgQzAuMzkxMTMyODEgOS43Mzg2NzE4NyAwLjQ2OTc2NTYzIDEwLjYwMjM0Mzc1IDAuNTUwNzgxMjUgMTEuNDkyMTg3NSBDMS4wMDMyMDcyNCAxNC4wMTc5MDQ3NSAxLjgxMjYwODMzIDE1Ljc0ODIxMzQgMyAxOCBDMy42ODc1MDI5NCAyMy4yNzA4NTU4NiAyLjE2OTQxODg1IDI1Ljg0MDEzNzc1IC0xIDMwIEMtMS42NiAyOS42NyAtMi4zMiAyOS4zNCAtMyAyOSBDLTIuNTA1IDI3Ljk3OTA2MjUgLTIuNTA1IDI3Ljk3OTA2MjUgLTIgMjYuOTM3NSBDLTAuNTQwNjAwMTQgMjIuNjUwNTEyOSAtMC4yNjA1MDE3MyAxOC44MDI1MjcwNCAtMiAxNC41NjI1IEMtMy40NjUwNTgyOSAxMC44MDgyODgxMiAtMy4zMjAyMDE1OSA4LjAzNDU0MDAyIC0zIDQgQy0xLjUgMS41IC0xLjUgMS41IDAgMCBaICIgZmlsbD0iI0U1RUZFQiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM1MSw2MCkiLz4KPHBhdGggZD0iTTAgMCBDMC4zMyAwIDAuNjYgMCAxIDAgQzAuOTg4Mzk4NDQgMC43NTAyMzQzNyAwLjk3Njc5Njg3IDEuNTAwNDY4NzUgMC45NjQ4NDM3NSAyLjI3MzQzNzUgQzAuOTE5NjU0NTMgNy4zOTkxODY2NiAwLjk4NDI4NjYxIDEyLjMwMTE4MTk1IDEuNzUgMTcuMzc1IEMyLjE5NjY0NjM5IDIxLjE0NzM1MTI3IDIuMTA3NDI3NTkgMjEuODEwMjExMjYgMC4xMjUgMjUuMzEyNSBDLTAuOTI2ODc1IDI2LjY0MjgxMjUgLTAuOTI2ODc1IDI2LjY0MjgxMjUgLTIgMjggQy0yLjc4MjE1NTg4IDMwLjcyODI1MDQgLTIuNzgyMTU1ODggMzAuNzI4MjUwNCAtMyAzMyBDLTMuOTkgMzMgLTQuOTggMzMgLTYgMzMgQy01LjY2Mzk0OTIgMjkuMzg3NDUzODUgLTUuNDU0NzA0MzIgMjcuNDg1NTg5OSAtMi45Mjk2ODc1IDI0Ljc4OTA2MjUgQy0wLjM4MTE3MzczIDIxLjEwNTU4MzA5IC0wLjgyNDUyNDMzIDE4LjI5NzIzMDcyIC0xLjM3NSAxNC4wNjI1IEMtMS45OTMyNTI0NiA4Ljg4OTQ2NTc5IC0yLjA0NDM3NzU4IDQuOTExMTE3NTYgMCAwIFogIiBmaWxsPSIjMkE3RDVDIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzQ0LDYyKSIvPgo8cGF0aCBkPSJNMCAwIEMzLjE2MTE1Nzc2IDEuMzY5ODM1MDMgMy45OTI3MDkyIDEuOTg5MDYzOCA2IDUgQzYuNTMwNzQ3NDEgMTAuNTE5NzczMDggNS4zMDE0OTUxMSAxNC4wMjg3NzA1NSAzIDE5IEMyLjMwODU5NDc4IDIxLjc3ODg4NjEzIDIuMzA4NTk0NzggMjEuNzc4ODg2MTMgMiAyNCBDMS4wMSAyNCAwLjAyIDI0IC0xIDI0IEMtMS4yNTgxMzMwMiAyMC4zODYxMzc3NCAtMS4xNjgxNTY2NyAxOC4zMjkzMDY4IDAuNSAxNS4wNjI1IEMyLjczMzE5NzQyIDEwLjUwMzA1NTI2IDIuNjIzNDM0NjEgNi44MzEzMzkxNiAxIDIuMDYyNSBDMC42NyAxLjM4MTg3NSAwLjM0IDAuNzAxMjUgMCAwIFogIiBmaWxsPSIjMTc3MjREIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzUxLDk3KSIvPgo8cGF0aCBkPSJNMCAwIEMwLjMzIDAuOTkgMC42NiAxLjk4IDEgMyBDMC41MDUgMy45MDc1IDAuMDEgNC44MTUgLTAuNSA1Ljc1IEMtMi4zNzE1ODI0MSA5LjgwNTA5NTIzIC0yLjA1NTkwNDQyIDExLjcwMDk2MDU3IC0xIDE2IEMtMC4wODA4Mzc4IDE4LjM3NzMwOTU2IDAuOTUxMzM0NzMgMjAuNjc0Njk4NzUgMiAyMyBDMiAyMy42NiAyIDI0LjMyIDIgMjUgQzEuMDEgMjUgMC4wMiAyNSAtMSAyNSBDLTEuODcyNzk4NjIgMjMuMTMzNjAwMTkgLTIuNzIyNTEwMjcgMjEuMjU2MzkzODkgLTMuNTYyNSAxOS4zNzUgQy00LjI3NTk5NjA5IDE3LjgwODc4OTA2IC00LjI3NTk5NjA5IDE3LjgwODc4OTA2IC01LjAwMzkwNjI1IDE2LjIxMDkzNzUgQy02LjEzMjU2NzY4IDEyLjU3MjY2NDE5IC02LjAzOTIzNjQyIDEwLjYzNzMyNzQ1IC01IDcgQy0zLjU1NDMxMTQ1IDQuNDMwOTQwMzUgLTEuODIzMDY5ODYgMi4zMzcyNjkwNSAwIDAgWiAiIGZpbGw9IiMxMzZGNEEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNzcsOTQpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuNjYgMCAxLjMyIDAgMiAwIEM1LjE4NDE5OTU5IDMuNzk2NTQ1NjcgNS4zODczNDU0OCA3LjExNjc2MjIgNS4yMzgyODEyNSAxMS44NjMyODEyNSBDNC45NDYwNDkxMyAxNC40ODM3ODg5NyA0LjA0MjM4MTk1IDE2LjU4OTQ5MTczIDMgMTkgQzIuNzkzNDQ5MzQgMjIuNDQyNTEwOTcgMi45MDYxNjA2OSAyNC43MTg0ODIwOCA0IDI4IEMyLjA2MjUgMjcuNjI1IDIuMDYyNSAyNy42MjUgMCAyNyBDLTEuNDIxNTEzNDUgMjQuMTU2OTczMDkgLTEuMjM5MjI2MDYgMjIuMTY5NzQ1MjggLTEgMTkgQy0wLjUwNSAxNy44NjU2MjUgLTAuMDEgMTYuNzMxMjUgMC41IDE1LjU2MjUgQzIuNTQzNzYwMDggMTAuNzA4NTY5ODEgMi42OTcwMTA1NCA3LjA0NzQ2ODQ1IDEgMi4wNjI1IEMwLjY3IDEuMzgxODc1IDAuMzQgMC43MDEyNSAwIDAgWiAiIGZpbGw9IiNEREVBRTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNjksNTkpIi8+CjxwYXRoIGQ9Ik0wIDAgQzIgMiAyIDIgMi4yNSA1LjMxMjUgQzIuMDE4NjM0NTIgOC43MjUxNDA4NCAxLjQ3NjUyODggMTAuOTU0NjU5MzUgMCAxNCBDLTAuNjYgMTMuMzQgLTEuMzIgMTIuNjggLTIgMTIgQy0xLjYyNSA4Ljg3NSAtMS42MjUgOC44NzUgLTEgNiBDLTMuMzEgNi4zMyAtNS42MiA2LjY2IC04IDcgQy04LjA0MjcyMSA1LjMzMzg4MDk1IC04LjA0MDYzODMyIDMuNjY2MTcxMTUgLTggMiBDLTUuOTU0NDc5NTggLTAuMDQ1NTIwNDIgLTIuNzI5NDE5MTQgMC4yMzk0MjI3MyAwIDAgWiAiIGZpbGw9IiMwQzZCNDUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNzAsNjIpIi8+CjxwYXRoIGQ9Ik0wIDAgQzQuMjkgMCA4LjU4IDAgMTMgMCBDMTMgMS42NSAxMyAzLjMgMTMgNSBDOC43MSA1IDQuNDIgNSAwIDUgQzAgMy4zNSAwIDEuNyAwIDAgWiAiIGZpbGw9IiMxRTcwQzEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2MjksNzkpIi8+CjxwYXRoIGQ9Ik0wIDAgQzEuMzIgMCAyLjY0IDAgNCAwIEM0IDUuMjggNCAxMC41NiA0IDE2IEMyLjY4IDE2IDEuMzYgMTYgMCAxNiBDMCAxMC43MiAwIDUuNDQgMCAwIFogIiBmaWxsPSIjMDA4NDI5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTY5LDkzKSIvPgo8cGF0aCBkPSJNMCAwIEM0LjI5IDAgOC41OCAwIDEzIDAgQzEyLjY3IDAuOTkgMTIuMzQgMS45OCAxMiAzIEMxMC42OCAzIDkuMzYgMyA4IDMgQzggNS42NCA4IDguMjggOCAxMSBDNy4wMSAxMSA2LjAyIDExIDUgMTEgQzUgOC4zNiA1IDUuNzIgNSAzIEMzLjM1IDIuNjcgMS43IDIuMzQgMCAyIEMwIDEuMzQgMCAwLjY4IDAgMCBaICIgZmlsbD0iI0U4MjAyNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTc0OSwxMTYpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuOTYgMCA3LjkyIDAgMTIgMCBDMTIgMS42NSAxMiAzLjMgMTIgNSBDOC4wNCA1IDQuMDggNSAwIDUgQzAgMy4zNSAwIDEuNyAwIDAgWiAiIGZpbGw9IiMxRTcwQzEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1OTUsNzkpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuOTYgMCA3LjkyIDAgMTIgMCBDMTIgMS42NSAxMiAzLjMgMTIgNSBDOC4wNCA1IDQuMDggNSAwIDUgQzAgMy4zNSAwIDEuNyAwIDAgWiAiIGZpbGw9IiMxRTcwQzEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MTgsNzkpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuOTYgMCA3LjkyIDAgMTIgMCBDMTIgMS42NSAxMiAzLjMgMTIgNSBDOC4wNCA1IDQuMDggNSAwIDUgQzAgMy4zNSAwIDEuNyAwIDAgWiAiIGZpbGw9IiMxRjcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MTgsNzIpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuOTkgMCAxLjk4IDAgMyAwIEMzIDIuNjQgMyA1LjI4IDMgOCBDNS42NCA4IDguMjggOCAxMSA4IEMxMC42NyA4Ljk5IDEwLjM0IDkuOTggMTAgMTEgQzYuNyAxMSAzLjQgMTEgMCAxMSBDMCA3LjM3IDAgMy43NCAwIDAgWiAiIGZpbGw9IiNFODIwMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3OTgsMTE2KSIvPgo8cGF0aCBkPSJNMCAwIEMwLjEyMTE3MTg4IDAuNjAzMjgxMjUgMC4yNDIzNDM3NSAxLjIwNjU2MjUgMC4zNjcxODc1IDEuODI4MTI1IEMwLjUzNDc2NTYzIDIuNjI3MzQzNzUgMC43MDIzNDM3NSAzLjQyNjU2MjUgMC44NzUgNC4yNSBDMS4wMzc0MjE4OCA1LjAzODkwNjI1IDEuMTk5ODQzNzUgNS44Mjc4MTI1IDEuMzY3MTg3NSA2LjY0MDYyNSBDMS45MTcxMzYxNyA5LjAxNDkwNDM4IDEuOTE3MTM2MTcgOS4wMTQ5MDQzOCAzLjA2MjUgMTEuMDkzNzUgQzQuMzcxMjUzNjQgMTMuNzU0ODgyNCA0LjEzMjY4NDUxIDE2LjA4MDk0MDc2IDQgMTkgQzMuMDEgMTkgMi4wMiAxOSAxIDE5IEMwLjcxMTI1IDE3Ljc4MzEyNSAwLjQyMjUgMTYuNTY2MjUgMC4xMjUgMTUuMzEyNSBDLTAuNDgzNjM3NyAxMi44NDMxNjk5MSAtMS4xMzkxMzY4MSAxMC42Njc2MTc2MyAtMi4xMjUgOC4zMTI1IEMtMy4xMDE2MzIyIDUuNzMxNDAwNjMgLTMuMTU2Mzg1NjggMy43MzY3NDk0NSAtMyAxIEMtMSAwIC0xIDAgMCAwIFogIiBmaWxsPSIjMEU2QzQ3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzY4LDEwMikiLz4KPHBhdGggZD0iTTAgMCBDNC45NSAwIDkuOSAwIDE1IDAgQzE0LjM0IDEuMzIgMTMuNjggMi42NCAxMyA0IEM5LjA0IDQgNS4wOCA0IDEgNCBDMC42NyAyLjY4IDAuMzQgMS4zNiAwIDAgWiAiIGZpbGw9IiMxRTcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2MTEsODcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuNjI1NDM5MjIgMC41MTc5MTk4OSA3LjI1MDczNjc2IDEuMDM2Mzk3MjcgMTAuODc1IDEuNTYyNSBDMTIuOTMwODIyNzEgMS44NzcxMDUwMiAxMi45MzA4MjI3MSAxLjg3NzEwNTAyIDE1IDIgQzE1IDMuNjUgMTUgNS4zIDE1IDcgQzkuNTQ1MjA4MTUgNi40MzE3OTI1MiA1LjA4OTQwNzQ0IDUuMDUzNjIwNTUgMCAzIEMwIDIuMDEgMCAxLjAyIDAgMCBaICIgZmlsbD0iI0VFRjRGMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM5MSw3MykiLz4KPHBhdGggZD0iTTAgMCBDMy42MyAwIDcuMjYgMCAxMSAwIEMxMSAyLjMxIDExIDQuNjIgMTEgNyBDMTAuMzQgNyA5LjY4IDcgOSA3IEM5IDUuNjggOSA0LjM2IDkgMyBDNy4wMiAzIDUuMDQgMyAzIDMgQzIuNjcgNC4zMiAyLjM0IDUuNjQgMiA3IEMxLjM0IDcgMC42OCA3IDAgNyBDMCA0LjY5IDAgMi4zOCAwIDAgWiAiIGZpbGw9IiNFODIwMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4MTMsMTIwKSIvPgo8cGF0aCBkPSJNMCAwIEM0LjI5IDAgOC41OCAwIDEzIDAgQzEzIDEuMzIgMTMgMi42NCAxMyA0IEM4LjcxIDQgNC40MiA0IDAgNCBDMCAyLjY4IDAgMS4zNiAwIDAgWiAiIGZpbGw9IiMxRjcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2MjksODcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuOTYgMCA3LjkyIDAgMTIgMCBDMTIuMzMgMS4zMiAxMi42NiAyLjY0IDEzIDQgQzguNzEgNCA0LjQyIDQgMCA0IEMwIDIuNjggMCAxLjM2IDAgMCBaICIgZmlsbD0iIzFFNzBDMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU3Miw4NykiLz4KPHBhdGggZD0iTTAgMCBDMy40NDQ0NzI5OSAyLjkzNTIwOTUxIDMuNTc3ODc2MSA1LjI1NjU4Mjc0IDMuOTY0ODQzNzUgOS41OTc2NTYyNSBDMy45OTg0NTQwNiAxMS44OTQzNjEgMy43Mzc5MTUwOSAxMy44NzUxMjQzMyAzLjMxMjUgMTYuMTI1IEMyLjkwNDY5NjM3IDIxLjE4MTc2NSA0LjE4MDYwNDkgMjIuODk5MDYxNjcgNyAyNyBDNi4zNCAyNy4zMyA1LjY4IDI3LjY2IDUgMjggQy0wLjA2ODA5Mzg0IDIxLjI0ODM4NzEgLTAuMDY4MDkzODQgMjEuMjQ4Mzg3MSAwLjE4NzUgMTYuNTYyNSBDMC40NTU2MjUgMTUuMzg2ODc1IDAuNzIzNzUgMTQuMjExMjUgMSAxMyBDMS4wODIyOTE3IDExLjQzOTExMjI5IDEuMTIyNDQ1OTkgOS44NzU1NTMzNyAxLjEyNSA4LjMxMjUgQzEuMTI4ODY3MTkgNy4yMjM4ODY3MiAxLjEyODg2NzE5IDcuMjIzODg2NzIgMS4xMzI4MTI1IDYuMTEzMjgxMjUgQzAuOTk3ODA3MzIgMy45NjUxMTA1OSAwLjU4NzcyOTQgMi4wNjYzODE5NSAwIDAgWiAiIGZpbGw9IiNEMEUyREIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNzgsNjMpIi8+CjxwYXRoIGQ9Ik0wIDAgQzQuMjkgMCA4LjU4IDAgMTMgMCBDMTIuNjcgMS4zMiAxMi4zNCAyLjY0IDEyIDQgQzguMDQgNCA0LjA4IDQgMCA0IEMwIDIuNjggMCAxLjM2IDAgMCBaICIgZmlsbD0iIzFFNzBDMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU3Miw2NSkiLz4KPHBhdGggZD0iTTAgMCBDMCAwLjk5IDAgMS45OCAwIDMgQy0xLjU3OTY3ODA3IDMuNjc1MjgyMjMgLTMuMTYzOTE5MDMgNC4zMzk4OTY5NCAtNC43NSA1IEMtNi4wNzI1NzgxMyA1LjU1Njg3NSAtNi4wNzI1NzgxMyA1LjU1Njg3NSAtNy40MjE4NzUgNi4xMjUgQy0xMCA3IC0xMCA3IC0xNCA3IEMtMTQgNS42OCAtMTQgNC4zNiAtMTQgMyBDLTQuNTg5OTc3MjIgLTAuNDQ0MTkxMzQgLTQuNTg5OTc3MjIgLTAuNDQ0MTkxMzQgMCAwIFogIiBmaWxsPSIjRUZGNUYzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzMxLDczKSIvPgo8cGF0aCBkPSJNMCAwIEMzLjk2IDAgNy45MiAwIDEyIDAgQzEyIDEuMzIgMTIgMi42NCAxMiA0IEM4LjA0IDQgNC4wOCA0IDAgNCBDMCAyLjY4IDAgMS4zNiAwIDAgWiAiIGZpbGw9IiMxRTcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1OTUsODcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuOTYgMCA3LjkyIDAgMTIgMCBDMTIgMS4zMiAxMiAyLjY0IDEyIDQgQzguMDQgNCA0LjA4IDQgMCA0IEMwIDIuNjggMCAxLjM2IDAgMCBaICIgZmlsbD0iIzFFNzBDMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU0OSw4NykiLz4KPHBhdGggZD0iTTAgMCBDMy45NiAwIDcuOTIgMCAxMiAwIEMxMiAxLjMyIDEyIDIuNjQgMTIgNCBDOC4wNCA0IDQuMDggNCAwIDQgQzAgMi42OCAwIDEuMzYgMCAwIFogIiBmaWxsPSIjMUU3MEMwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTE4LDg3KSIvPgo8cGF0aCBkPSJNMCAwIEMzLjk2IDAgNy45MiAwIDEyIDAgQzEyIDEuMzIgMTIgMi42NCAxMiA0IEM4LjA0IDQgNC4wOCA0IDAgNCBDMCAyLjY4IDAgMS4zNiAwIDAgWiAiIGZpbGw9IiMxRTcwQzAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1NDksNjUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuOTYgMCA3LjkyIDAgMTIgMCBDMTIgMS4zMiAxMiAyLjY0IDEyIDQgQzguMDQgNCA0LjA4IDQgMCA0IEMwIDIuNjggMCAxLjM2IDAgMCBaICIgZmlsbD0iIzFFNzBDMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUxOCw2NSkiLz4KPHBhdGggZD0iTTAgMCBDMy4zNzQ2MjcxNSAwLjU0NzIzNjgzIDUuMDgyMzUgMS4wNTQ5IDggMyBDNy4zNCA0Ljk4IDYuNjggNi45NiA2IDkgQzQgOCAyIDcgMCA2IEMwIDQuMDIgMCAyLjA0IDAgMCBaICIgZmlsbD0iIzFENzY1MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM5Myw5MykiLz4KPHBhdGggZD0iTTAgMCBDMCAzIDAgMyAtMSA1IEMtMS4yMTM3NzcyMSAxMC42MDcwMzIxMyAtMS4yMTM3NzcyMSAxMC42MDcwMzIxMyAwIDE2IEMwLjEyNzgxNzg2IDE4LjY3Mzk0OTY0IDAuMDQzOTE4NzEgMjEuMzIwOTU4NTcgMCAyNCBDLTAuNjYgMjQgLTEuMzIgMjQgLTIgMjQgQy0zLjcyNzI5MzA0IDE3LjI5MDY3OTkxIC00Ljc4MjM1NDYyIDEwLjgxODQwMzYgLTMgNCBDLTEuNDQ5MjE4NzUgMS43MTA5Mzc1IC0xLjQ0OTIxODc1IDEuNzEwOTM3NSAwIDAgWiAiIGZpbGw9IiNEOUU4RTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNDgsNjApIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuMzMgMCAwLjY2IDAgMSAwIEMxIDEuNjUgMSAzLjMgMSA1IEMxLjg4Njg3NSA0LjY5MDYyNSAyLjc3Mzc1IDQuMzgxMjUgMy42ODc1IDQuMDYyNSBDOS4xNjA2NzE0NiAyLjMwNjk1NDQ0IDkuMTYwNjcxNDYgMi4zMDY5NTQ0NCAxMiAyIEMxMi45OSAyLjY2IDEzLjk4IDMuMzIgMTUgNCBDMTQuNjcgNC42NiAxNC4zNCA1LjMyIDE0IDYgQzExLjY4MDI1NzY2IDYuNDE3NTUzNjIgOS4zNDIxNDIwNyA2LjczNTU2NDYgNyA3IEM1LjA1MDkzNzUgNy4yNzg0Mzc1IDUuMDUwOTM3NSA3LjI3ODQzNzUgMy4wNjI1IDcuNTYyNSBDMi4wNTE4NzUgNy43MDY4NzUgMS4wNDEyNSA3Ljg1MTI1IDAgOCBDMCA1LjM2IDAgMi43MiAwIDAgWiAiIGZpbGw9IiMxODcyNEUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzMTcsNjgpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuMzMzMzMzMzMgMCA2LjY2NjY2NjY3IDAgMTAgMCBDMTAgMS45OCAxMCAzLjk2IDEwIDYgQzcuMzYgNiA0LjcyIDYgMiA2IEMyIDQuNjggMiAzLjM2IDIgMiBDMS4zNCAyIDAuNjggMiAwIDIgQzAgMS4zNCAwIDAuNjggMCAwIFogIiBmaWxsPSIjMDA2NDNDIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzg1LDExNykiLz4KPHBhdGggZD0iTTAgMCBDMi45NyAwIDUuOTQgMCA5IDAgQzguNjcgMS42NSA4LjM0IDMuMyA4IDUgQzUuNjkgNSAzLjM4IDUgMSA1IEMwLjY3IDMuMzUgMC4zNCAxLjcgMCAwIFogIiBmaWxsPSIjMUU3MEMxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjE0LDk0KSIvPgo8cGF0aCBkPSJNMCAwIEMwIDAuOTkgMCAxLjk4IDAgMyBDLTMuNjMgNC4zMiAtNy4yNiA1LjY0IC0xMSA3IEMtMTEuMzMgNS42OCAtMTEuNjYgNC4zNiAtMTIgMyBDLTEwLjc1MzM2NjY5IDIuNDkxNjY0MDkgLTkuNTAyNTA2MTMgMS45OTM2ODg1NSAtOC4yNSAxLjUgQy03LjU1MzkwNjI1IDEuMjIxNTYyNSAtNi44NTc4MTI1IDAuOTQzMTI1IC02LjE0MDYyNSAwLjY1NjI1IEMtNCAwIC00IDAgMCAwIFogIiBmaWxsPSIjRUZGNUYyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzI5LDgwKSIvPgo8cGF0aCBkPSJNMCAwIEMxLjA3MDc3Mzc1IDMuMjEyMzIxMjUgMSA1LjYzOTM3ODA3IDEgOSBDMS4zMyA5Ljk5IDEuNjYgMTAuOTggMiAxMiBDMS4wMSAxMiAwLjAyIDEyIC0xIDEyIEMtMS4zMyAxMC4zNSAtMS42NiA4LjcgLTIgNyBDLTMuOTggNyAtNS45NiA3IC04IDcgQy03LjIzNjg3NSA2LjQwMTg3NSAtNi40NzM3NSA1LjgwMzc1IC01LjY4NzUgNS4xODc1IEMtMy42NTE2NDI1IDMuNTMwNDA2NjggLTEuODAyMTcyMSAxLjg5NzAyMzI2IDAgMCBaICIgZmlsbD0iIzBENkI0NSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM2OCw3NSkiLz4KPHBhdGggZD0iTTAgMCBDMS4yMDE1NzEzMSAzLjYwNDcxMzkzIDEuNTQ5ODEzNDggNy4xMTUwMzA4OCAxLjg3NSAxMC44NzUgQzEuOTYwMDc4MTMgMTEuNTgyNjk1MzEgMi4wNDUxNTYyNSAxMi4yOTAzOTA2MyAyLjEzMjgxMjUgMTMuMDE5NTMxMjUgQzIuNDc2OTI2MjggMTcuMjE5MjgzNTEgMi4yMzk3Mzc5MiAxOC43MTA2NjExMyAtMC40OTIxODc1IDIyLjAwNzgxMjUgQy0xLjMxOTc2NTYyIDIyLjY2NTIzNDM3IC0yLjE0NzM0Mzc1IDIzLjMyMjY1NjI1IC0zIDI0IEMtMi4xMjUgMjAuMTI1IC0yLjEyNSAyMC4xMjUgLTEgMTkgQy0wLjkzOTY4OTYzIDE1LjM4NTE0NzQyIC0wLjk4MDA1NDkzIDExLjc4NDEzNTc2IC0xLjAzOTA2MjUgOC4xNjk5MjE4OCBDLTEuMTAwMTMzMTUgMi4yMDAyNjYyOSAtMS4xMDAxMzMxNSAyLjIwMDI2NjI5IDAgMCBaICIgZmlsbD0iI0RERUFFNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM0Miw2NSkiLz4KPHBhdGggZD0iTTAgMCBDMSAyIDEgMiAwLjkzNzUgNS42ODc1IEMwLjg2OTQ3NzA3IDkuODIxNzgyMyAxLjY5NjU0Mzg5IDEzLjA4OTYzMTY4IDMgMTcgQzIuMzQgMTcgMS42OCAxNyAxIDE3IEMwLjY3IDE4LjMyIDAuMzQgMTkuNjQgMCAyMSBDLTEuMzk3NzM2NjEgMTQuOTA5ODYxOSAtMi40MzkxOTg3NCA5LjI1ODU4MjExIC0yIDMgQy0xLjM0IDIuMDEgLTAuNjggMS4wMiAwIDAgWiAiIGZpbGw9IiMyMTc4NTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNDgsNjIpIi8+CjxwYXRoIGQ9Ik0wIDAgQzQuMTk0Njk1NzEgMC41OTkyNDIyNCA4LjAwOTk5ODM0IDEuNTc0OTk5NDEgMTIgMyBDMTIgMy45OSAxMiA0Ljk4IDEyIDYgQzcuNjgyMjU0MiA1LjQ5MjAyOTkxIDMuOTY2OTc4ODYgNC44MDMxNzIyMSAwIDMgQzAgMi4wMSAwIDEuMDIgMCAwIFogIiBmaWxsPSIjRTdGMEVDIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzkzLDgwKSIvPgo8cGF0aCBkPSJNMCAwIEMxLjY3NTQyOTc2IDAuMjg2MDQ4OTggMy4zNDM4NTM0MyAwLjYxNzgxMjMzIDUgMSBDNS44NDY4MTEzMyA2LjA4MDg2Nzk2IDYuMDkwMzgwOTkgMTAuODQ4MjgzNzcgNiAxNiBDNS4zNCAxNiA0LjY4IDE2IDQgMTYgQzMuOTUxMDE1NjMgMTUuNDA4MzIwMzEgMy45MDIwMzEyNSAxNC44MTY2NDA2MyAzLjg1MTU2MjUgMTQuMjA3MDMxMjUgQzMuMjYxOTU4IDcuODg5NzQ5MDkgMy4yNjE5NTggNy44ODk3NDkwOSAxIDIgQzAuMzQgMS42NyAtMC4zMiAxLjM0IC0xIDEgQy0wLjY3IDAuNjcgLTAuMzQgMC4zNCAwIDAgWiAiIGZpbGw9IiMxNzcyNEUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNzAsNTcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuNjA4ODEzMSAwLjgzNTA2MTE3IDMuNjA4ODEzMSAwLjgzNTA2MTE3IDUuODEyNSAtMC41IEM1LjgxMjUgMS4xNSA1LjgxMjUgMi44IDUuODEyNSA0LjUgQzMuNDc5MTY2NjcgNC4xNjY2NjY2NyAxLjE0NTgzMzMzIDMuODMzMzMzMzMgLTEuMTg3NSAzLjUgQy0yLjQ2NjI1IDMuMzU1NjI1IC0zLjc0NSAzLjIxMTI1IC01LjA2MjUgMy4wNjI1IEMtNi4wOTM3NSAyLjg3Njg3NSAtNy4xMjUgMi42OTEyNSAtOC4xODc1IDIuNSBDLTguNTE3NSAxLjg0IC04Ljg0NzUgMS4xOCAtOS4xODc1IDAuNSBDLTUuOTIyMjU5MDcgLTAuNDE4MzQ5MDEgLTMuMzE1NTMyMDkgLTAuNDc3MDk4NDIgMCAwIFogIiBmaWxsPSIjMUI3NDUxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzk5LjE4NzUsNzEuNSkiLz4KPHBhdGggZD0iTTAgMCBDMi45NyAwIDUuOTQgMCA5IDAgQzguNjcgMS4zMiA4LjM0IDIuNjQgOCA0IEM1LjAzIDQgMi4wNiA0IC0xIDQgQy0wLjY3IDIuNjggLTAuMzQgMS4zNiAwIDAgWiAiIGZpbGw9IiNEQ0VERTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNDAsOTIpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuOTYgMCA3LjkyIDAgMTIgMCBDMTEuNjcgMC45OSAxMS4zNCAxLjk4IDExIDMgQzcuNyAzIDQuNCAzIDEgMyBDMC42NyAyLjAxIDAuMzQgMS4wMiAwIDAgWiAiIGZpbGw9IiNFNzIwMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3NjYsMTIwKSIvPgo8cGF0aCBkPSJNMCAwIEMzLjk2IDAgNy45MiAwIDEyIDAgQzExLjY3IDAuOTkgMTEuMzQgMS45OCAxMSAzIEM3LjcgMyA0LjQgMyAxIDMgQzAuNjcgMi4wMSAwLjM0IDEuMDIgMCAwIFogIiBmaWxsPSIjRTkyMDI2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzY2LDExNikiLz4KPHBhdGggZD0iTTAgMCBDOS40MTAwMjI3OCAtMC4zNjkwMjA1IDkuNDEwMDIyNzggLTAuMzY5MDIwNSAxNCAyIEMxNCAzLjY1IDE0IDUuMyAxNCA3IEMxMy41MDUgNi41MjU2MjUgMTMuMDEgNi4wNTEyNSAxMi41IDUuNTYyNSBDOS45MzI3MzUyOSAzLjk1Nzk1OTU1IDguODAwMzY5MDkgMy43NDk5ODYwOSA1Ljg3NSAzLjUgQzQuNTk2MjUgMy4zMzUgMy4zMTc1IDMuMTcgMiAzIEMxLjM0IDIuMDEgMC42OCAxLjAyIDAgMCBaICIgZmlsbD0iIzNEODk2QiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM1Niw1NSkiLz4KPHBhdGggZD0iTTAgMCBDMC4yODQ4ODI4MSAwLjU3NDkyMTg4IDAuNTY5NzY1NjIgMS4xNDk4NDM3NSAwLjg2MzI4MTI1IDEuNzQyMTg3NSBDMS41OTM5MzI5NyAzLjE5MzQ0NzYyIDIuMzQwMTUwNTEgNC42MzcwMzEgMy4xMDU0Njg3NSA2LjA3MDMxMjUgQzMuNDYyNTM5MDYgNi43NDgzNTkzOCAzLjgxOTYwOTM4IDcuNDI2NDA2MjUgNC4xODc1IDguMTI1IEM0LjU1MjMwNDY5IDguODA4MjAzMTMgNC45MTcxMDkzOCA5LjQ5MTQwNjI1IDUuMjkyOTY4NzUgMTAuMTk1MzEyNSBDNS41MjYyODkwNiAxMC43OTA4NTkzNyA1Ljc1OTYwOTM4IDExLjM4NjQwNjI1IDYgMTIgQzUuNjcgMTIuNjYgNS4zNCAxMy4zMiA1IDE0IEM0LjM0IDE0IDMuNjggMTQgMyAxNCBDLTEuMDc4Nzc0NjIgNS45NjQ5ODkwNiAtMS4wNzg3NzQ2MiA1Ljk2NDk4OTA2IC0wLjc1IDEuOTM3NSBDLTAuNTAyNSAxLjI5ODEyNSAtMC4yNTUgMC42NTg3NSAwIDAgWiAiIGZpbGw9IiMwQzZCNDUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNzgsMTAzKSIvPgo8cGF0aCBkPSJNMCAwIEMzLjk2IDAgNy45MiAwIDEyIDAgQzExLjAxIDEuNDg1IDExLjAxIDEuNDg1IDEwIDMgQzguMTI1IDMuMzI4MTI1IDguMTI1IDMuMzI4MTI1IDYgMy4yNSBDNS4yOTg3NSAzLjIzNDUzMTI1IDQuNTk3NSAzLjIxOTA2MjUgMy44NzUgMy4yMDMxMjUgQzIgMyAyIDMgMCAyIEMwIDEuMzQgMCAwLjY4IDAgMCBaICIgZmlsbD0iI0U4MjAyNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTc2NiwxMjQpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuNjMgMCA3LjI2IDAgMTEgMCBDMTAuNjcgMC45OSAxMC4zNCAxLjk4IDEwIDMgQzcuMDMgMyA0LjA2IDMgMSAzIEMwLjY3IDIuMDEgMC4zNCAxLjAyIDAgMCBaICIgZmlsbD0iI0U4MjAyNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTgxMywxMTYpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuNDk1IDAuMzkxODc1IDAuOTkgMC43ODM3NSAxLjUgMS4xODc1IEMwLjE2NjY2NjY3IDEuODU0MTY2NjcgLTEuMTY2NjY2NjcgMi41MjA4MzMzMyAtMi41IDMuMTg3NSBDLTMuNDkgMy43NDQzNzUgLTMuNDkgMy43NDQzNzUgLTQuNSA0LjMxMjUgQy02LjUgNS4xODc1IC02LjUgNS4xODc1IC0xMC41IDUuMTg3NSBDLTEwLjUgNC4xOTc1IC0xMC41IDMuMjA3NSAtMTAuNSAyLjE4NzUgQy0zLjI4Nzc0NjE3IC0xLjA2ODUxNzUxIC0zLjI4Nzc0NjE3IC0xLjA2ODUxNzUxIDAgMCBaICIgZmlsbD0iIzEyNkY0QSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMyNy41LDc3LjgxMjUpIi8+CjxwYXRoIGQ9Ik0wIDAgQzIuNjQgMCA1LjI4IDAgOCAwIEM3LjY3IDEuMzIgNy4zNCAyLjY0IDcgNCBDNC42OSA0IDIuMzggNCAwIDQgQzAgMi42OCAwIDEuMzYgMCAwIFogIiBmaWxsPSIjRDdFQkRFIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDA5LDk2KSIvPgo8cGF0aCBkPSJNMCAwIEMzLjU1NzgwMTk2IDAuNjA5OTA4OTEgNi42ODI4NTg5IDEuNTc4MzY4MSAxMCAzIEM5LjY3IDMuOTkgOS4zNCA0Ljk4IDkgNiBDNS44NTI2MjgxOCA1LjMwMDU4NDA0IDIuOTc0MTExMjQgNC4yMzkyMTMwMiAwIDMgQzAgMi4wMSAwIDEuMDIgMCAwIFogIiBmaWxsPSIjREZFQkU2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzk0LDg3KSIvPgo8cGF0aCBkPSJNMCAwIEMtMSAzIC0xIDMgLTIuODQ3NjU2MjUgNC4xNjc5Njg3NSBDLTMuNTc4NTU0NjkgNC41MDQ0MTQwNiAtNC4zMDk0NTMxMiA0Ljg0MDg1OTM3IC01LjA2MjUgNS4xODc1IEMtNS43OTU5NzY1NiA1LjUzMTY3OTY5IC02LjUyOTQ1MzEyIDUuODc1ODU5MzggLTcuMjg1MTU2MjUgNi4yMzA0Njg3NSBDLTguMTM0MDAzOTEgNi42MTEzODY3MiAtOC4xMzQwMDM5MSA2LjYxMTM4NjcyIC05IDcgQy05LjMzIDUuNjggLTkuNjYgNC4zNiAtMTAgMyBDLTYuMjcwMzQ4NjEgMC45NjU2NDQ2OSAtNC4zMzA5NDk1OCAwIDAgMCBaICIgZmlsbD0iI0U4RjFFRCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMyOCw4NykiLz4KPHBhdGggZD0iTTAgMCBDMi4zOTI3MzIzNSAzLjU4OTA5ODUzIDMuMTUzMTA5ODYgNS4yNjMxMzQ3OCAzLjE4NzUgOS41IEMzLjIwMTY3OTY5IDEwLjI5NDA2MjUgMy4yMTU4NTkzOCAxMS4wODgxMjUgMy4yMzA0Njg3NSAxMS45MDYyNSBDMyAxNCAzIDE0IDEgMTYgQy0wLjE1NzAzOTggMTIuNTI4ODgwNTkgLTAuMDMzOTY0ODkgOS43NzM2ODM0NiAwLjA2MjUgNi4xNTYyNSBDMC4wOTg0MjE3OSAzLjgxNDI1MTIzIDAuMDk4NDIxNzkgMy44MTQyNTEyMyAtMSAxIEMtMC42NyAwLjY3IC0wLjM0IDAuMzQgMCAwIFogIiBmaWxsPSIjMjI3OTU2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzc3LDYyKSIvPgo8cGF0aCBkPSJNMCAwIEMwLjY2IDAuMzMgMS4zMiAwLjY2IDIgMSBDMS4zNCAzLjk3IDAuNjggNi45NCAwIDEwIEMtMC45OSA5LjY3IC0xLjk4IDkuMzQgLTMgOSBDLTIuNDQyNzEwODcgNS42NTYyNjUyNSAtMS42NDgyNjExMSAyLjk2Njg3MDAxIDAgMCBaICIgZmlsbD0iI0RDRUFFNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM0NCwxMDgpIi8+CjxwYXRoIGQ9Ik0wIDAgQzMuMjcyODY2ODIgMi43ODE5MzY4IDQuOTY0Mjc2OTcgNi4yNzk1NDA2NyA3IDEwIEM2LjAxIDEwLjMzIDUuMDIgMTAuNjYgNCAxMSBDMy4zMjU5MTY5MiA5LjczMzA4NDkzIDIuNjYwOTk1MDMgOC40NjEyOTI1MSAyIDcuMTg3NSBDMS42Mjg3NSA2LjQ3OTgwNDY5IDEuMjU3NSA1Ljc3MjEwOTM3IDAuODc1IDUuMDQyOTY4NzUgQzAgMyAwIDMgMCAwIFogIiBmaWxsPSIjRDVFNURGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzc5LDEwNCkiLz4KPHBhdGggZD0iTTAgMCBDMi42NCAwIDUuMjggMCA4IDAgQzcuMzQgMS4zMiA2LjY4IDIuNjQgNiA0IEMzLjAzIDMuNTA1IDMuMDMgMy41MDUgMCAzIEMwIDIuMDEgMCAxLjAyIDAgMCBaICIgZmlsbD0iI0ZDRkRGQyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAzOCw5OSkiLz4KPHBhdGggZD0iTTAgMCBDMCAwLjk5IDAgMS45OCAwIDMgQy0zLjQ2NSA0LjQ4NSAtMy40NjUgNC40ODUgLTcgNiBDLTcuMzMgNS4wMSAtNy42NiA0LjAyIC04IDMgQy0zLjM3NSAwIC0zLjM3NSAwIDAgMCBaICIgZmlsbD0iI0Q2RTZERiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMyOSw5MykiLz4KPHBhdGggZD0iTTAgMCBDLTAuNzUgNy43NSAtMC43NSA3Ljc1IC0zIDEwIEMtNC40NzgzMjI2IDcuMDQzMzU0ODEgLTQuMDYwMzI3ODMgNC4yNTc3MDI2MyAtNCAxIEMtMiAwIC0yIDAgMCAwIFogIiBmaWxsPSIjMkM3RTVEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzcyLDY2KSIvPgo8cGF0aCBkPSJNMCAwIEMwLjkzMDQ1OTMzIDIuNTUxNDQ4MjQgMS4wODU2NDA5MSAzLjc0MDA2NDc4IDAuMjIyNjU2MjUgNi4zNTkzNzUgQy0wLjE2MDE5NTMxIDcuMTQ4MjgxMjUgLTAuNTQzMDQ2ODggNy45MzcxODc1IC0wLjkzNzUgOC43NSBDLTEuNTA3OTEwMTYgOS45NDg4MjgxMyAtMS41MDc5MTAxNiA5Ljk0ODgyODEzIC0yLjA4OTg0Mzc1IDExLjE3MTg3NSBDLTIuMzkwMTk1MzEgMTEuNzc1MTU2MjUgLTIuNjkwNTQ2ODggMTIuMzc4NDM3NSAtMyAxMyBDLTMuNjYgMTIuNjcgLTQuMzIgMTIuMzQgLTUgMTIgQy00LjQ2MjMxMTI4IDguMTI4NjQxMiAtMy40MjI1MjcgNi4wMjgxNTg3NSAtMSAzIEMtMC42NyAyLjAxIC0wLjM0IDEuMDIgMCAwIFogIiBmaWxsPSIjRENFOUU0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzQyLDEwMykiLz4KPHBhdGggZD0iTTAgMCBDMC45OSAwLjMzIDEuOTggMC42NiAzIDEgQzIuNTQ2MjUgMS43NDI1IDIuMDkyNSAyLjQ4NSAxLjYyNSAzLjI1IEMwLjMxMzU5MjA0IDUuNDY5MzA1NzggLTAuODgyODA4MDMgNy42Nzk2NzgyMiAtMiAxMCBDLTMuMDYzNTE2NzUgNi42MTYwODMwNyAtMy4yMTQ0Mjk4MiA1LjQxOTUzNjYgLTEuNTYyNSAyLjE4NzUgQy0xLjA0Njg3NSAxLjQ2NTYyNSAtMC41MzEyNSAwLjc0Mzc1IDAgMCBaICIgZmlsbD0iI0RCRTlFMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM3OCw5NikiLz4KPHBhdGggZD0iTTAgMCBDMCAwLjk5IDAgMS45OCAwIDMgQy0yLjUgNC42ODc1IC0yLjUgNC42ODc1IC01IDYgQy01LjY2IDUuMDEgLTYuMzIgNC4wMiAtNyAzIEMtMy4zNzUgMCAtMy4zNzUgMCAwIDAgWiAiIGZpbGw9IiMwRDZDNDYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzMjksOTYpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuNjYgMCAxLjMyIDAgMiAwIEMyIDAuNjYgMiAxLjMyIDIgMiBDMy4zMiAyIDQuNjQgMiA2IDIgQzYgMi42NiA2IDMuMzIgNiA0IEM0LjY4IDQgMy4zNiA0IDIgNCBDMS42NyA1LjMyIDEuMzQgNi42NCAxIDggQy0wLjM1NDM5NjY4IDUuMjkxMjA2NjUgLTAuMDY1MDE0NTEgMi45OTA2NjczMiAwIDAgWiAiIGZpbGw9IiMxOTczNEYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNTAsNjQpIi8+CjxwYXRoIGQ9Ik0wIDAgQzEuMzIgMC42NiAyLjY0IDEuMzIgNCAyIEM0IDIuOTkgNCAzLjk4IDQgNSBDMSA1IDEgNSAtMC42ODc1IDMuNSBDLTEuMTIwNjI1IDMuMDA1IC0xLjU1Mzc1IDIuNTEgLTIgMiBDLTEuMzQgMS4zNCAtMC42OCAwLjY4IDAgMCBaICIgZmlsbD0iIzE1NzI0QyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM5MiwxMDEpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuOTkgMC4zMyAxLjk4IDAuNjYgMyAxIEMyLjM0IDMuOTcgMS42OCA2Ljk0IDEgMTAgQzAuMDEgOS4wMSAtMC45OCA4LjAyIC0yIDcgQy0xLjM0IDQuNjkgLTAuNjggMi4zOCAwIDAgWiAiIGZpbGw9IiMyOTdENUIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNzMsNzMpIi8+CjxwYXRoIGQ9Ik0wIDAgQzIgMC42NjY2NjY2NyA0IDEuMzMzMzMzMzMgNiAyIEM1LjY3IDIuNjYgNS4zNCAzLjMyIDUgNCBDMi4zNTEzOTU3MyA0LjU5MzU1NjE0IC0wLjI5MTk3MzIyIDQuNzQyMDkyNjkgLTMgNSBDLTIuNjI1IDMuMDYyNSAtMi42MjUgMy4wNjI1IC0yIDEgQy0xLjM0IDAuNjcgLTAuNjggMC4zNCAwIDAgWiAiIGZpbGw9IiMzMzgzNjMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzMjYsNzApIi8+CjxwYXRoIGQ9Ik0wIDAgQzIuMzEgMCA0LjYyIDAgNyAwIEM3IDEuMzIgNyAyLjY0IDcgNCBDNS42OCA0IDQuMzYgNCAzIDQgQzMgMy4zNCAzIDIuNjggMyAyIEMyLjAxIDIgMS4wMiAyIDAgMiBDMCAxLjM0IDAgMC42OCAwIDAgWiAiIGZpbGw9IiM2N0EyOEEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNTMsNjQpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuOTkgMCAxLjk4IDAgMyAwIEMyLjY4NzUgMS44NzUgMi42ODc1IDEuODc1IDIgNCBDMS4wMSA0LjY2IDAuMDIgNS4zMiAtMSA2IEMtMS42MjUgNC4xMjUgLTEuNjI1IDQuMTI1IC0yIDIgQy0xLjM0IDEuMzQgLTAuNjggMC42OCAwIDAgWiAiIGZpbGw9IiMxNDcwNEIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzMjgsMTAxKSIvPgo8cGF0aCBkPSJNMCAwIEM0Ljc1IDEuODc1IDQuNzUgMS44NzUgNyAzIEM2LjY3IDMuOTkgNi4zNCA0Ljk4IDYgNiBDMy45NjE2NjU3NiA0LjcyNjA0MTEgMS45NjE0Nzg3NCAzLjM4OTM4MDc3IDAgMiBDMCAxLjM0IDAgMC42OCAwIDAgWiAiIGZpbGw9IiNFOEYxRUUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzOTQsOTMpIi8+CjxwYXRoIGQ9Ik0wIDAgQzEuOTggMCAzLjk2IDAgNiAwIEM2IDAuOTkgNiAxLjk4IDYgMyBDMy42OSAzIDEuMzggMyAtMSAzIEMtMC42NyAyLjAxIC0wLjM0IDEuMDIgMCAwIFogIiBmaWxsPSIjRjhGQkY5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDEyLDkwKSIvPgo8cGF0aCBkPSJNMCAwIEMwLjMzIDEuMzIgMC42NiAyLjY0IDEgNCBDMS42NiA0IDIuMzIgNCAzIDQgQzMuNjYgNS42NSA0LjMyIDcuMyA1IDkgQzMuMDYyNSA4LjYyNSAzLjA2MjUgOC42MjUgMSA4IEMtMC4zNTQzOTY2OCA1LjI5MTIwNjY1IC0wLjA2NTAxNDUxIDIuOTkwNjY3MzIgMCAwIFogIiBmaWxsPSIjRDRFNERFIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzY4LDc4KSIvPgo8cGF0aCBkPSJNMCAwIEMwLjk5IDAuMzMgMS45OCAwLjY2IDMgMSBDMi4zNCAzLjMxIDEuNjggNS42MiAxIDggQzAuMzQgOCAtMC4zMiA4IC0xIDggQy0xLjEyNSAyLjI1IC0xLjEyNSAyLjI1IDAgMCBaICIgZmlsbD0iI0VGRjVGMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM3MCw3NCkiLz4KPHBhdGggZD0iTTAgMCBDMi4wMDcyMDkyMyAwLjI4Njc0NDE4IDQuMDA4NTk0NCAwLjYxODY2NzAxIDYgMSBDNiAxLjY2IDYgMi4zMiA2IDMgQzQuMzUgMyAyLjcgMyAxIDMgQzEgMy45OSAxIDQuOTggMSA2IEMwLjM0IDYgLTAuMzIgNiAtMSA2IEMtMS4wNDI3MjEgNC4zMzM4ODA5NSAtMS4wNDA2MzgzMiAyLjY2NjE3MTE1IC0xIDEgQy0wLjY3IDAuNjcgLTAuMzQgMC4zNCAwIDAgWiAiIGZpbGw9IiM3MkE5OTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEzNjMsNjMpIi8+CjxwYXRoIGQ9Ik0wIDAgQzEuOTM3NSAwLjY4NzUgMS45Mzc1IDAuNjg3NSA0IDIgQzQuNzUgNC42MjUgNC43NSA0LjYyNSA1IDcgQzQuMzQgNyAzLjY4IDcgMyA3IEMwIDIuNjE1Mzg0NjIgMCAyLjYxNTM4NDYyIDAgMCBaICIgZmlsbD0iIzBDNkI0NSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTM1MSw5NykiLz4KPHBhdGggZD0iTTAgMCBDMS4zMiAwIDIuNjQgMCA0IDAgQzQgMC45OSA0IDEuOTggNCAzIEMyLjAyIDMuNjYgMC4wNCA0LjMyIC0yIDUgQy0xLjM0IDMuMzUgLTAuNjggMS43IDAgMCBaICIgZmlsbD0iI0U2RjBFQyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMyNSw4MCkiLz4KPHBhdGggZD0iTTAgMCBDMS4zMiAwIDIuNjQgMCA0IDAgQzMuNjcgMS4zMiAzLjM0IDIuNjQgMyA0IEMyLjAxIDQgMS4wMiA0IDAgNCBDMCAyLjY4IDAgMS4zNiAwIDAgWiAiIGZpbGw9IiMwMDg0MjgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIxNjksODcpIi8+CjxwYXRoIGQ9Ik0wIDAgQzAuOTkgMCAxLjk4IDAgMyAwIEMyLjM0IDEuMzIgMS42OCAyLjY0IDEgNCBDMC42NyAyLjY4IDAuMzQgMS4zNiAwIDAgWiAiIGZpbGw9IiMxRTcwQzEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2MTcsMTAyKSIvPgo8L3N2Zz4K" style="\n            width: 742.5px;\n            position: relative;\n            top: 107px;\n            left: 32px;\n            ">\n            <a href=' + accountURL + ' style="\n        float: left;\n        border-radius: 56px;\n        background: #0D6EFD;\n        padding-top: 8px;\n        width: 280px;\n        height: 38px;\n        text-align: center;\n        position: relative;\n        top: 127px;\n        left: 274px;\n        font-size: 16px;\n        color: white;\n        text-decoration: none;\n        letter-spacing: 0.02em;\n    ">Claim your FREE account</a>\n            <div style="\n    font-size: 14px;\n    position: relative;\n    top: 180px;\n    left: 19px;\n    letter-spacing: 0.02em;\n    font-weight: 500;\n    line-height: 125%;\n">have a Syncfusion<sup>®</sup> account? <a href="https://www.syncfusion.com/account/login?ReturnUrl=/account/login" style="text-decoration: none;\ncolor: #0D6EFD;\nfont-weight: 500;">Sign In</a></div>\n        </div>\n    </div>';
  if (typeof document !== "undefined" && !isNullOrUndefined(document)) {
    var errorBackground = createElement("div", {
      innerHTML: bannerTemplate
    });
    document.body.appendChild(errorBackground);
  }
};

// node_modules/@syncfusion/ej2-base/src/component.js
var __extends2 = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var componentCount = 0;
var lastPageID;
var lastHistoryLen = 0;
var instancecount = 0;
var isvalid = true;
var isBannerAdded = false;
var versionBasedStatePersistence = false;
function enableVersionBasedPersistence(status) {
  versionBasedStatePersistence = status;
}
var Component = (
  /** @class */
  function(_super) {
    __extends2(Component2, _super);
    function Component2(options, selector) {
      var _this = _super.call(this, options, selector) || this;
      _this.randomId = uniqueID();
      _this.isStringTemplate = false;
      _this.needsID = false;
      _this.isReactHybrid = false;
      _this.isAngular = false;
      _this.isReact = false;
      _this.isVue = false;
      if (isNullOrUndefined(_this.enableRtl)) {
        _this.setProperties({
          "enableRtl": rightToLeft
        }, true);
      }
      if (isNullOrUndefined(_this.locale)) {
        _this.setProperties({
          "locale": defaultCulture
        }, true);
      }
      _this.moduleLoader = new ModuleLoader(_this);
      _this.localObserver = new Observer(_this);
      onIntlChange.on("notifyExternalChange", _this.detectFunction, _this, _this.randomId);
      if (typeof window !== "undefined" && typeof document !== "undefined" && !validateLicense()) {
        if (componentList.indexOf(_this.getModuleName()) !== -1) {
          instancecount = instancecount + 1;
          if (instancecount > 5) {
            isvalid = false;
          }
        }
      }
      if (!isUndefined(selector)) {
        _this.appendTo();
      }
      return _this;
    }
    Component2.prototype.requiredModules = function() {
      return [];
    };
    Component2.prototype.destroy = function() {
      if (this.isDestroyed) {
        return;
      }
      if (this.enablePersistence) {
        this.setPersistData();
        this.detachUnloadEvent();
      }
      this.localObserver.destroy();
      if (this.refreshing) {
        return;
      }
      removeClass([this.element], ["e-control"]);
      this.trigger("destroyed", {
        cancel: false
      });
      _super.prototype.destroy.call(this);
      this.moduleLoader.clean();
      onIntlChange.off("notifyExternalChange", this.detectFunction, this.randomId);
    };
    Component2.prototype.refresh = function() {
      this.refreshing = true;
      this.moduleLoader.clean();
      this.destroy();
      this.clearChanges();
      this.localObserver = new Observer(this);
      this.preRender();
      this.injectModules();
      this.render();
      this.refreshing = false;
    };
    Component2.prototype.accessMount = function() {
      if (this.mount && !this.isReactHybrid) {
        this.mount();
      }
    };
    Component2.prototype.getRootElement = function() {
      if (this.isReactHybrid) {
        return this.actualElement;
      } else {
        return this.element;
      }
    };
    Component2.prototype.getLocalData = function() {
      var eleId = this.getModuleName() + this.element.id;
      if (versionBasedStatePersistence) {
        return window.localStorage.getItem(eleId + this.ej2StatePersistenceVersion);
      } else {
        return window.localStorage.getItem(eleId);
      }
    };
    Component2.prototype.attachUnloadEvent = function() {
      this.handleUnload = this.handleUnload.bind(this);
      window.addEventListener("pagehide", this.handleUnload);
    };
    Component2.prototype.handleUnload = function() {
      this.setPersistData();
    };
    Component2.prototype.detachUnloadEvent = function() {
      window.removeEventListener("pagehide", this.handleUnload);
    };
    Component2.prototype.appendTo = function(selector) {
      if (!isNullOrUndefined(selector) && typeof selector === "string") {
        this.element = select(selector, document);
      } else if (!isNullOrUndefined(selector)) {
        this.element = selector;
      }
      if (!isNullOrUndefined(this.element)) {
        var moduleClass = "e-" + this.getModuleName().toLowerCase();
        addClass([this.element], ["e-control", moduleClass]);
        this.isProtectedOnChange = false;
        if (this.needsID && !this.element.id) {
          this.element.id = this.getUniqueID(this.getModuleName());
        }
        if (this.enablePersistence) {
          this.mergePersistData();
          this.attachUnloadEvent();
        }
        var inst = getValue("ej2_instances", this.element);
        if (!inst || inst.indexOf(this) === -1) {
          _super.prototype.addInstance.call(this);
        }
        this.preRender();
        this.injectModules();
        var ignoredComponents = {
          schedule: "all",
          diagram: "all",
          PdfViewer: "all",
          grid: ["logger"],
          richtexteditor: ["link", "table", "image", "audio", "video", "formatPainter", "emojiPicker", "pasteCleanup", "htmlEditor", "toolbar", "importExport"],
          treegrid: ["filter"],
          gantt: ["tooltip"],
          chart: ["Export", "Zoom"],
          accumulationchart: ["Export"],
          "query-builder": "all"
        };
        var component = this.getModuleName();
        if (this.requiredModules && (!ignoredComponents["" + component] || ignoredComponents["" + component] !== "all")) {
          var modulesRequired = this.requiredModules();
          for (var _i = 0, _a = this.moduleLoader.getNonInjectedModules(modulesRequired); _i < _a.length; _i++) {
            var module = _a[_i];
            var moduleName = module.name ? module.name : module.member;
            if (ignoredComponents["" + component] && ignoredComponents["" + component].indexOf(module.member) !== -1) {
              continue;
            }
            var componentName = component.charAt(0).toUpperCase() + component.slice(1);
            console.warn('[WARNING] :: Module "' + moduleName + '" is not available in ' + componentName + " component! You either misspelled the module name or forgot to load it.");
          }
        }
        if (!isvalid && !isBannerAdded) {
          createLicenseOverlay();
          isBannerAdded = true;
        }
        this.render();
        if (!this.mount) {
          this.trigger("created");
        } else {
          this.accessMount();
        }
      }
    };
    Component2.prototype.renderComplete = function(wrapperElement) {
      if (isBlazor()) {
        var sfBlazor = "sfBlazor";
        window["" + sfBlazor].renderComplete(this.element, wrapperElement);
      }
      this.isRendered = true;
    };
    Component2.prototype.dataBind = function() {
      this.injectModules();
      _super.prototype.dataBind.call(this);
    };
    Component2.prototype.on = function(event, handler, context) {
      if (typeof event === "string") {
        this.localObserver.on(event, handler, context);
      } else {
        for (var _i = 0, event_1 = event; _i < event_1.length; _i++) {
          var arg = event_1[_i];
          this.localObserver.on(arg.event, arg.handler, arg.context);
        }
      }
    };
    Component2.prototype.off = function(event, handler) {
      if (typeof event === "string") {
        this.localObserver.off(event, handler);
      } else {
        for (var _i = 0, event_2 = event; _i < event_2.length; _i++) {
          var arg = event_2[_i];
          this.localObserver.off(arg.event, arg.handler);
        }
      }
    };
    Component2.prototype.notify = function(property, argument) {
      if (this.isDestroyed !== true) {
        this.localObserver.notify(property, argument);
      }
    };
    Component2.prototype.getInjectedModules = function() {
      return this.injectedModules;
    };
    Component2.Inject = function() {
      var moduleList = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        moduleList[_i] = arguments[_i];
      }
      if (!this.prototype.injectedModules) {
        this.prototype.injectedModules = [];
      }
      for (var i = 0; i < moduleList.length; i++) {
        if (this.prototype.injectedModules.indexOf(moduleList[parseInt(i.toString(), 10)]) === -1) {
          this.prototype.injectedModules.push(moduleList[parseInt(i.toString(), 10)]);
        }
      }
    };
    Component2.prototype.createElement = function(tagName, prop, isVDOM) {
      return createElement(tagName, prop);
    };
    Component2.prototype.triggerStateChange = function(handler, argument) {
      if (this.isReactHybrid) {
        this.setState();
        this.currentContext = {
          calls: handler,
          args: argument
        };
      }
    };
    Component2.prototype.injectModules = function() {
      if (this.injectedModules && this.injectedModules.length) {
        this.moduleLoader.inject(this.requiredModules(), this.injectedModules);
      }
    };
    Component2.prototype.detectFunction = function(args) {
      var prop = Object.keys(args);
      if (prop.length) {
        this[prop[0]] = args[prop[0]];
      }
    };
    Component2.prototype.mergePersistData = function() {
      var data;
      if (versionBasedStatePersistence) {
        data = window.localStorage.getItem(this.getModuleName() + this.element.id + this.ej2StatePersistenceVersion);
      } else {
        data = window.localStorage.getItem(this.getModuleName() + this.element.id);
      }
      if (!(isNullOrUndefined(data) || data === "")) {
        this.setProperties(JSON.parse(data), true);
      }
    };
    Component2.prototype.setPersistData = function() {
      if (!this.isDestroyed) {
        if (versionBasedStatePersistence) {
          window.localStorage.setItem(this.getModuleName() + this.element.id + this.ej2StatePersistenceVersion, this.getPersistData());
        } else {
          window.localStorage.setItem(this.getModuleName() + this.element.id, this.getPersistData());
        }
      }
    };
    Component2.prototype.renderReactTemplates = function(callback) {
      if (!isNullOrUndefined(callback)) {
        callback();
      }
    };
    Component2.prototype.clearTemplate = function(templateName, index) {
    };
    Component2.prototype.getUniqueID = function(definedName) {
      if (this.isHistoryChanged()) {
        componentCount = 0;
      }
      lastPageID = this.pageID(location.href);
      lastHistoryLen = history.length;
      return definedName + "_" + lastPageID + "_" + componentCount++;
    };
    Component2.prototype.pageID = function(url) {
      var hash = 0;
      if (url.length === 0) {
        return hash;
      }
      for (var i = 0; i < url.length; i++) {
        var char = url.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    };
    Component2.prototype.isHistoryChanged = function() {
      return lastPageID !== this.pageID(location.href) || lastHistoryLen !== history.length;
    };
    Component2.prototype.addOnPersist = function(options) {
      var _this = this;
      var persistObj = {};
      for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
        var key = options_1[_i];
        var objValue = getValue(key, this);
        if (!isUndefined(objValue)) {
          setValue(key, this.getActualProperties(objValue), persistObj);
        }
      }
      return JSON.stringify(persistObj, function(key2, value) {
        return _this.getActualProperties(value);
      });
    };
    Component2.prototype.getActualProperties = function(obj) {
      if (obj instanceof ChildProperty) {
        return getValue("properties", obj);
      } else {
        return obj;
      }
    };
    Component2.prototype.ignoreOnPersist = function(options) {
      return JSON.stringify(this.iterateJsonProperties(this.properties, options));
    };
    Component2.prototype.iterateJsonProperties = function(obj, ignoreList) {
      var newObj = {};
      var _loop_1 = function(key2) {
        if (ignoreList.indexOf(key2) === -1) {
          var value = obj["" + key2];
          if (typeof value === "object" && !(value instanceof Array)) {
            var newList = ignoreList.filter(function(str) {
              var regExp3 = RegExp;
              return new regExp3(key2 + ".").test(str);
            }).map(function(str) {
              return str.replace(key2 + ".", "");
            });
            newObj["" + key2] = this_1.iterateJsonProperties(this_1.getActualProperties(value), newList);
          } else {
            newObj["" + key2] = value;
          }
        }
      };
      var this_1 = this;
      for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var key = _a[_i];
        _loop_1(key);
      }
      return newObj;
    };
    __decorate2([Property(false)], Component2.prototype, "enablePersistence", void 0);
    __decorate2([Property()], Component2.prototype, "enableRtl", void 0);
    __decorate2([Property()], Component2.prototype, "locale", void 0);
    Component2 = __decorate2([NotifyPropertyChanges], Component2);
    return Component2;
  }(Base)
);
(function() {
  if (typeof window !== "undefined") {
    window.addEventListener(
      "popstate",
      /* istanbul ignore next */
      function() {
        componentCount = 0;
      }
    );
  }
})();

// node_modules/@syncfusion/ej2-base/src/draggable.js
var __extends3 = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __decorate3 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var defaultPosition = {
  left: 0,
  top: 0,
  bottom: 0,
  right: 0
};
var isDraggedObject = {
  isDragged: false
};
var Position = (
  /** @class */
  function(_super) {
    __extends3(Position2, _super);
    function Position2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate3([Property(0)], Position2.prototype, "left", void 0);
    __decorate3([Property(0)], Position2.prototype, "top", void 0);
    return Position2;
  }(ChildProperty)
);
var Draggable = (
  /** @class */
  function(_super) {
    __extends3(Draggable2, _super);
    function Draggable2(element, options) {
      var _this = _super.call(this, options, element) || this;
      _this.dragLimit = Draggable_1.getDefaultPosition();
      _this.borderWidth = Draggable_1.getDefaultPosition();
      _this.padding = Draggable_1.getDefaultPosition();
      _this.diffX = 0;
      _this.prevLeft = 0;
      _this.prevTop = 0;
      _this.dragProcessStarted = false;
      _this.eleTop = 0;
      _this.tapHoldTimer = 0;
      _this.externalInitialize = false;
      _this.diffY = 0;
      _this.parentScrollX = 0;
      _this.parentScrollY = 0;
      _this.droppables = {};
      _this.bind();
      return _this;
    }
    Draggable_1 = Draggable2;
    Draggable2.prototype.bind = function() {
      this.toggleEvents();
      if (Browser.isIE) {
        addClass([this.element], "e-block-touch");
      }
      this.droppables[this.scope] = {};
    };
    Draggable2.getDefaultPosition = function() {
      return extend({}, defaultPosition);
    };
    Draggable2.prototype.toggleEvents = function(isUnWire) {
      var ele;
      if (!isUndefined(this.handle)) {
        ele = select(this.handle, this.element);
      }
      var handler = this.enableTapHold && Browser.isDevice && Browser.isTouch ? this.mobileInitialize : this.initialize;
      if (isUnWire) {
        EventHandler.remove(ele || this.element, Browser.isSafari() ? "touchstart" : Browser.touchStartEvent, handler);
      } else {
        EventHandler.add(ele || this.element, Browser.isSafari() ? "touchstart" : Browser.touchStartEvent, handler, this);
      }
    };
    Draggable2.prototype.mobileInitialize = function(evt) {
      var _this = this;
      var target = evt.currentTarget;
      this.tapHoldTimer = setTimeout(function() {
        _this.externalInitialize = true;
        _this.removeTapholdTimer();
        _this.initialize(evt, target);
      }, this.tapHoldThreshold);
      EventHandler.add(document, Browser.isSafari() ? "touchmove" : Browser.touchMoveEvent, this.removeTapholdTimer, this);
      EventHandler.add(document, Browser.isSafari() ? "touchend" : Browser.touchEndEvent, this.removeTapholdTimer, this);
    };
    Draggable2.prototype.removeTapholdTimer = function() {
      clearTimeout(this.tapHoldTimer);
      EventHandler.remove(document, Browser.isSafari() ? "touchmove" : Browser.touchMoveEvent, this.removeTapholdTimer);
      EventHandler.remove(document, Browser.isSafari() ? "touchend" : Browser.touchEndEvent, this.removeTapholdTimer);
    };
    Draggable2.prototype.getScrollableParent = function(element, axis) {
      var scroll = {
        "vertical": "scrollHeight",
        "horizontal": "scrollWidth"
      };
      var client = {
        "vertical": "clientHeight",
        "horizontal": "clientWidth"
      };
      if (isNullOrUndefined(element)) {
        return null;
      }
      if (element[scroll["" + axis]] > element[client["" + axis]]) {
        if (axis === "vertical" ? element.scrollTop > 0 : element.scrollLeft > 0) {
          if (axis === "vertical") {
            this.parentScrollY = this.parentScrollY + (this.parentScrollY === 0 ? element.scrollTop : element.scrollTop - this.parentScrollY);
            this.tempScrollHeight = element.scrollHeight;
          } else {
            this.parentScrollX = this.parentScrollX + (this.parentScrollX === 0 ? element.scrollLeft : element.scrollLeft - this.parentScrollX);
            this.tempScrollWidth = element.scrollWidth;
          }
          if (!isNullOrUndefined(element)) {
            return this.getScrollableParent(element.parentNode, axis);
          } else {
            return element;
          }
        } else {
          return this.getScrollableParent(element.parentNode, axis);
        }
      } else {
        return this.getScrollableParent(element.parentNode, axis);
      }
    };
    Draggable2.prototype.getScrollableValues = function() {
      this.parentScrollX = 0;
      this.parentScrollY = 0;
      var isModalDialog = this.element.classList.contains("e-dialog") && this.element.classList.contains("e-dlg-modal");
      var verticalScrollParent = this.getScrollableParent(this.element.parentNode, "vertical");
      var horizontalScrollParent = this.getScrollableParent(this.element.parentNode, "horizontal");
    };
    Draggable2.prototype.initialize = function(evt, curTarget) {
      this.currentStateTarget = evt.target;
      if (this.isDragStarted()) {
        return;
      } else {
        this.isDragStarted(true);
        this.externalInitialize = false;
      }
      this.target = evt.currentTarget || curTarget;
      this.dragProcessStarted = false;
      if (this.abort) {
        var abortSelectors = this.abort;
        if (typeof abortSelectors === "string") {
          abortSelectors = [abortSelectors];
        }
        for (var i = 0; i < abortSelectors.length; i++) {
          if (!isNullOrUndefined(closest(evt.target, abortSelectors[parseInt(i.toString(), 10)]))) {
            if (this.isDragStarted()) {
              this.isDragStarted(true);
            }
            return;
          }
        }
      }
      if (this.preventDefault && !isUndefined(evt.changedTouches) && evt.type !== "touchstart") {
        evt.preventDefault();
      }
      this.element.setAttribute("aria-grabbed", "true");
      var intCoord = this.getCoordinates(evt);
      this.initialPosition = {
        x: intCoord.pageX,
        y: intCoord.pageY
      };
      if (!this.clone) {
        var pos = this.element.getBoundingClientRect();
        this.getScrollableValues();
        if (evt.clientX === evt.pageX) {
          this.parentScrollX = 0;
        }
        if (evt.clientY === evt.pageY) {
          this.parentScrollY = 0;
        }
        this.relativeXPosition = intCoord.pageX - (pos.left + this.parentScrollX);
        this.relativeYPosition = intCoord.pageY - (pos.top + this.parentScrollY);
      }
      if (this.externalInitialize) {
        this.intDragStart(evt);
      } else {
        EventHandler.add(document, Browser.isSafari() ? "touchmove" : Browser.touchMoveEvent, this.intDragStart, this);
        EventHandler.add(document, Browser.isSafari() ? "touchend" : Browser.touchEndEvent, this.intDestroy, this);
      }
      this.toggleEvents(true);
      if (evt.type !== "touchstart" && this.isPreventSelect) {
        document.body.classList.add("e-prevent-select");
      }
      this.externalInitialize = false;
      EventHandler.trigger(document.documentElement, Browser.isSafari() ? "touchstart" : Browser.touchStartEvent, evt);
    };
    Draggable2.prototype.intDragStart = function(evt) {
      this.removeTapholdTimer();
      var isChangeTouch = !isUndefined(evt.changedTouches);
      if (isChangeTouch && evt.changedTouches.length !== 1) {
        return;
      }
      var intCordinate = this.getCoordinates(evt);
      var pos;
      var styleProp = getComputedStyle(this.element);
      this.margin = {
        left: parseInt(styleProp.marginLeft, 10),
        top: parseInt(styleProp.marginTop, 10),
        right: parseInt(styleProp.marginRight, 10),
        bottom: parseInt(styleProp.marginBottom, 10)
      };
      var element = this.element;
      if (this.clone && this.dragTarget) {
        var intClosest = closest(evt.target, this.dragTarget);
        if (!isNullOrUndefined(intClosest)) {
          element = intClosest;
        }
      }
      if (this.isReplaceDragEle) {
        element = this.currentStateCheck(evt.target, element);
      }
      this.offset = this.calculateParentPosition(element);
      this.position = this.getMousePosition(evt, this.isDragScroll);
      var x = this.initialPosition.x - intCordinate.pageX;
      var y = this.initialPosition.y - intCordinate.pageY;
      var distance = Math.sqrt(x * x + y * y);
      if (distance >= this.distance || this.externalInitialize) {
        var ele = this.getHelperElement(evt);
        if (!ele || isNullOrUndefined(ele)) {
          return;
        }
        if (isChangeTouch) {
          evt.preventDefault();
        }
        var dragTargetElement = this.helperElement = ele;
        this.parentClientRect = this.calculateParentPosition(dragTargetElement.offsetParent);
        if (this.dragStart) {
          var curTarget = this.getProperTargetElement(evt);
          var args = {
            event: evt,
            element,
            target: curTarget,
            bindEvents: isBlazor() ? this.bindDragEvents.bind(this) : null,
            dragElement: dragTargetElement
          };
          this.trigger("dragStart", args);
        }
        if (this.dragArea) {
          this.setDragArea();
        } else {
          this.dragLimit = {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
          };
          this.borderWidth = {
            top: 0,
            left: 0
          };
        }
        pos = {
          left: this.position.left - this.parentClientRect.left,
          top: this.position.top - this.parentClientRect.top
        };
        if (this.clone && !this.enableTailMode) {
          this.diffX = this.position.left - this.offset.left;
          this.diffY = this.position.top - this.offset.top;
        }
        this.getScrollableValues();
        var styles = getComputedStyle(element);
        var marginTop = parseFloat(styles.marginTop);
        if (this.clone && marginTop !== 0) {
          pos.top += marginTop;
        }
        this.eleTop = !isNaN(parseFloat(styles.top)) ? parseFloat(styles.top) - this.offset.top : 0;
        if (this.enableScrollHandler && !this.clone) {
          pos.top -= this.parentScrollY;
          pos.left -= this.parentScrollX;
        }
        var posValue = this.getProcessedPositionValue({
          top: pos.top - this.diffY + "px",
          left: pos.left - this.diffX + "px"
        });
        if (this.dragArea && typeof this.dragArea !== "string" && this.dragArea.classList.contains("e-kanban-content") && this.dragArea.style.position === "relative") {
          pos.top += this.dragArea.scrollTop;
        }
        this.dragElePosition = {
          top: pos.top,
          left: pos.left
        };
        setStyleAttribute(dragTargetElement, this.getDragPosition({
          position: "absolute",
          left: posValue.left,
          top: posValue.top
        }));
        EventHandler.remove(document, Browser.isSafari() ? "touchmove" : Browser.touchMoveEvent, this.intDragStart);
        EventHandler.remove(document, Browser.isSafari() ? "touchend" : Browser.touchEndEvent, this.intDestroy);
        if (!isBlazor()) {
          this.bindDragEvents(dragTargetElement);
        }
      }
    };
    Draggable2.prototype.bindDragEvents = function(dragTargetElement) {
      if (isVisible(dragTargetElement)) {
        EventHandler.add(document, Browser.isSafari() ? "touchmove" : Browser.touchMoveEvent, this.intDrag, this);
        EventHandler.add(document, Browser.isSafari() ? "touchend" : Browser.touchEndEvent, this.intDragStop, this);
        this.setGlobalDroppables(false, this.element, dragTargetElement);
      } else {
        this.toggleEvents();
        document.body.classList.remove("e-prevent-select");
      }
    };
    Draggable2.prototype.elementInViewport = function(el) {
      this.top = el.offsetTop;
      this.left = el.offsetLeft;
      this.width = el.offsetWidth;
      this.height = el.offsetHeight;
      while (el.offsetParent) {
        el = el.offsetParent;
        this.top += el.offsetTop;
        this.left += el.offsetLeft;
      }
      return this.top >= window.pageYOffset && this.left >= window.pageXOffset && this.top + this.height <= window.pageYOffset + window.innerHeight && this.left + this.width <= window.pageXOffset + window.innerWidth;
    };
    Draggable2.prototype.getProcessedPositionValue = function(value) {
      if (this.queryPositionInfo) {
        return this.queryPositionInfo(value);
      }
      return value;
    };
    Draggable2.prototype.calculateParentPosition = function(ele) {
      if (isNullOrUndefined(ele)) {
        return {
          left: 0,
          top: 0
        };
      }
      var rect = ele.getBoundingClientRect();
      var style = getComputedStyle(ele);
      return {
        left: rect.left + window.pageXOffset - parseInt(style.marginLeft, 10),
        top: rect.top + window.pageYOffset - parseInt(style.marginTop, 10)
      };
    };
    Draggable2.prototype.intDrag = function(evt) {
      if (!isUndefined(evt.changedTouches) && evt.changedTouches.length !== 1) {
        return;
      }
      if (this.clone && evt.changedTouches && Browser.isDevice && Browser.isTouch) {
        evt.preventDefault();
      }
      var left;
      var top;
      this.position = this.getMousePosition(evt, this.isDragScroll);
      var docHeight = this.getDocumentWidthHeight("Height");
      if (docHeight < this.position.top) {
        this.position.top = docHeight;
      }
      var docWidth = this.getDocumentWidthHeight("Width");
      if (docWidth < this.position.left) {
        this.position.left = docWidth;
      }
      if (this.drag) {
        var curTarget = this.getProperTargetElement(evt);
        this.trigger("drag", {
          event: evt,
          element: this.element,
          target: curTarget
        });
      }
      var eleObj = this.checkTargetElement(evt);
      if (eleObj.target && eleObj.instance) {
        var flag = true;
        if (this.hoverObject) {
          if (this.hoverObject.instance !== eleObj.instance) {
            this.triggerOutFunction(evt, eleObj);
          } else {
            flag = false;
          }
        }
        if (flag) {
          eleObj.instance.dragData[this.scope] = this.droppables[this.scope];
          eleObj.instance.intOver(evt, eleObj.target);
          this.hoverObject = eleObj;
        }
      } else if (this.hoverObject) {
        this.triggerOutFunction(evt, eleObj);
      }
      var helperElement = this.droppables[this.scope].helper;
      this.parentClientRect = this.calculateParentPosition(this.helperElement.offsetParent);
      var tLeft = this.parentClientRect.left;
      var tTop = this.parentClientRect.top;
      var intCoord = this.getCoordinates(evt);
      var pagex = intCoord.pageX;
      var pagey = intCoord.pageY;
      var dLeft = this.position.left - this.diffX;
      var dTop = this.position.top - this.diffY;
      var styles = getComputedStyle(helperElement);
      if (this.dragArea) {
        if (this.enableAutoScroll) {
          this.setDragArea();
        }
        if (this.pageX !== pagex || this.skipDistanceCheck) {
          var helperWidth = helperElement.offsetWidth + (parseFloat(styles.marginLeft) + parseFloat(styles.marginRight));
          if (this.dragLimit.left > dLeft && dLeft > 0) {
            left = this.dragLimit.left;
          } else if (this.dragLimit.right + window.pageXOffset < dLeft + helperWidth && dLeft > 0) {
            left = dLeft - (dLeft - this.dragLimit.right) + window.pageXOffset - helperWidth;
          } else {
            left = dLeft < 0 ? this.dragLimit.left : dLeft;
          }
        }
        if (this.pageY !== pagey || this.skipDistanceCheck) {
          var helperHeight = helperElement.offsetHeight + (parseFloat(styles.marginTop) + parseFloat(styles.marginBottom));
          if (this.dragLimit.top > dTop && dTop > 0) {
            top = this.dragLimit.top;
          } else if (this.dragLimit.bottom + window.pageYOffset < dTop + helperHeight && dTop > 0) {
            top = dTop - (dTop - this.dragLimit.bottom) + window.pageYOffset - helperHeight;
          } else {
            top = dTop < 0 ? this.dragLimit.top : dTop;
          }
        }
      } else {
        left = dLeft;
        top = dTop;
      }
      var iTop = tTop + this.borderWidth.top;
      var iLeft = tLeft + this.borderWidth.left;
      if (this.dragProcessStarted) {
        if (isNullOrUndefined(top)) {
          top = this.prevTop;
        }
        if (isNullOrUndefined(left)) {
          left = this.prevLeft;
        }
      }
      var draEleTop;
      var draEleLeft;
      if (this.helperElement.classList.contains("e-treeview")) {
        if (this.dragArea) {
          this.dragLimit.top = this.clone ? this.dragLimit.top : 0;
          draEleTop = top - iTop < 0 ? this.dragLimit.top : top - this.borderWidth.top;
          draEleLeft = left - iLeft < 0 ? this.dragLimit.left : left - this.borderWidth.left;
        } else {
          draEleTop = top - this.borderWidth.top;
          draEleLeft = left - this.borderWidth.left;
        }
      } else {
        if (this.dragArea) {
          var isDialogEle = this.helperElement.classList.contains("e-dialog");
          this.dragLimit.top = this.clone ? this.dragLimit.top : 0;
          draEleTop = top - iTop < 0 ? this.dragLimit.top : top - iTop;
          draEleLeft = left - iLeft < 0 ? isDialogEle ? left - (iLeft - this.borderWidth.left) : this.dragElePosition.left : left - iLeft;
        } else {
          draEleTop = top - iTop;
          draEleLeft = left - iLeft;
        }
      }
      var marginTop = parseFloat(getComputedStyle(this.element).marginTop);
      if (marginTop > 0) {
        if (this.clone) {
          draEleTop += marginTop;
          if (dTop < 0) {
            if (marginTop + dTop >= 0) {
              draEleTop = marginTop + dTop;
            } else {
              draEleTop -= marginTop;
            }
          }
          if (this.dragArea) {
            draEleTop = this.dragLimit.bottom < draEleTop ? this.dragLimit.bottom : draEleTop;
          }
        }
        if (top - iTop < 0) {
          if (dTop + marginTop + (helperElement.offsetHeight - iTop) >= 0) {
            var tempDraEleTop = this.dragLimit.top + dTop - iTop;
            if (tempDraEleTop + marginTop + iTop < 0) {
              draEleTop -= marginTop + iTop;
            } else {
              draEleTop = tempDraEleTop;
            }
          } else {
            draEleTop -= marginTop + iTop;
          }
        }
      }
      if (this.dragArea && this.helperElement.classList.contains("e-treeview")) {
        var helperHeight = helperElement.offsetHeight + (parseFloat(styles.marginTop) + parseFloat(styles.marginBottom));
        draEleTop = draEleTop + helperHeight > this.dragLimit.bottom ? this.dragLimit.bottom - helperHeight : draEleTop;
      }
      if (this.enableScrollHandler && !this.clone) {
        draEleTop -= this.parentScrollY;
        draEleLeft -= this.parentScrollX;
      }
      if (this.dragArea && typeof this.dragArea !== "string" && this.dragArea.classList.contains("e-kanban-content") && this.dragArea.style.position === "relative") {
        draEleTop += this.dragArea.scrollTop;
      }
      var dragValue = this.getProcessedPositionValue({
        top: draEleTop + "px",
        left: draEleLeft + "px"
      });
      if (this.isPreventScroll) {
        dragValue = this.getProcessedPositionValue({
          top: this.position.top - this.parentClientRect.top - 2 + "px",
          left: this.position.left - this.parentClientRect.left - 2 + "px"
        });
      }
      setStyleAttribute(helperElement, this.getDragPosition(dragValue));
      if (!this.elementInViewport(helperElement) && this.enableAutoScroll && !this.helperElement.classList.contains("e-treeview")) {
        this.helperElement.scrollIntoView();
      }
      var elements = document.querySelectorAll(":hover");
      if (this.enableAutoScroll && this.helperElement.classList.contains("e-treeview")) {
        if (elements.length === 0) {
          elements = this.getPathElements(evt);
        }
        var scrollParent = this.getScrollParent(elements, false);
        if (this.elementInViewport(this.helperElement)) {
          this.getScrollPosition(scrollParent, draEleTop);
        } else if (!this.elementInViewport(this.helperElement)) {
          elements = [].slice.call(document.querySelectorAll(":hover"));
          if (elements.length === 0) {
            elements = this.getPathElements(evt);
          }
          scrollParent = this.getScrollParent(elements, true);
          this.getScrollPosition(scrollParent, draEleTop);
        }
      }
      this.dragProcessStarted = true;
      this.prevLeft = left;
      this.prevTop = top;
      this.position.left = left;
      this.position.top = top;
      this.pageX = pagex;
      this.pageY = pagey;
    };
    Draggable2.prototype.getScrollParent = function(node, reverse) {
      var nodeEl = reverse ? node.reverse() : node;
      var hasScroll;
      for (var i = nodeEl.length - 1; i >= 0; i--) {
        hasScroll = window.getComputedStyle(nodeEl[parseInt(i.toString(), 10)])["overflow-y"];
        if ((hasScroll === "auto" || hasScroll === "scroll") && nodeEl[parseInt(i.toString(), 10)].scrollHeight > nodeEl[parseInt(i.toString(), 10)].clientHeight) {
          return nodeEl[parseInt(i.toString(), 10)];
        }
      }
      hasScroll = window.getComputedStyle(document.scrollingElement)["overflow-y"];
      if (hasScroll === "visible") {
        document.scrollingElement.style.overflow = "auto";
        return document.scrollingElement;
      }
    };
    Draggable2.prototype.getScrollPosition = function(nodeEle, draEleTop) {
      if (nodeEle && nodeEle === document.scrollingElement) {
        if (nodeEle.clientHeight + document.scrollingElement.scrollTop - this.helperElement.clientHeight < draEleTop && nodeEle.getBoundingClientRect().height + this.parentClientRect.top > draEleTop) {
          nodeEle.scrollTop += this.helperElement.clientHeight;
        } else if (nodeEle.scrollTop > draEleTop - this.helperElement.clientHeight) {
          nodeEle.scrollTop -= this.helperElement.clientHeight;
        }
      } else if (nodeEle && nodeEle !== document.scrollingElement) {
        var docScrollTop = document.scrollingElement.scrollTop;
        var helperClientHeight = this.helperElement.clientHeight;
        if (nodeEle.clientHeight + nodeEle.getBoundingClientRect().top - helperClientHeight + docScrollTop < draEleTop) {
          nodeEle.scrollTop += this.helperElement.clientHeight;
        } else if (nodeEle.getBoundingClientRect().top > draEleTop - helperClientHeight - docScrollTop) {
          nodeEle.scrollTop -= this.helperElement.clientHeight;
        }
      }
    };
    Draggable2.prototype.getPathElements = function(evt) {
      var elementTop = evt.clientX > 0 ? evt.clientX : 0;
      var elementLeft = evt.clientY > 0 ? evt.clientY : 0;
      return document.elementsFromPoint(elementTop, elementLeft);
    };
    Draggable2.prototype.triggerOutFunction = function(evt, eleObj) {
      this.hoverObject.instance.intOut(evt, eleObj.target);
      this.hoverObject.instance.dragData[this.scope] = null;
      this.hoverObject = null;
    };
    Draggable2.prototype.getDragPosition = function(dragValue) {
      var temp = extend({}, dragValue);
      if (this.axis) {
        if (this.axis === "x") {
          delete temp.top;
        } else if (this.axis === "y") {
          delete temp.left;
        }
      }
      return temp;
    };
    Draggable2.prototype.getDocumentWidthHeight = function(str) {
      var docBody = document.body;
      var docEle = document.documentElement;
      var returnValue = Math.max(docBody["scroll" + str], docEle["scroll" + str], docBody["offset" + str], docEle["offset" + str], docEle["client" + str]);
      return returnValue;
    };
    Draggable2.prototype.intDragStop = function(evt) {
      this.dragProcessStarted = false;
      if (!isUndefined(evt.changedTouches) && evt.changedTouches.length !== 1) {
        return;
      }
      var type = ["touchend", "pointerup", "mouseup"];
      if (type.indexOf(evt.type) !== -1) {
        if (this.dragStop) {
          var curTarget = this.getProperTargetElement(evt);
          this.trigger("dragStop", {
            event: evt,
            element: this.element,
            target: curTarget,
            helper: this.helperElement
          });
        }
        this.intDestroy(evt);
      } else {
        this.element.setAttribute("aria-grabbed", "false");
      }
      var eleObj = this.checkTargetElement(evt);
      if (eleObj.target && eleObj.instance) {
        eleObj.instance.dragStopCalled = true;
        eleObj.instance.dragData[this.scope] = this.droppables[this.scope];
        eleObj.instance.intDrop(evt, eleObj.target);
      }
      this.setGlobalDroppables(true);
      document.body.classList.remove("e-prevent-select");
    };
    Draggable2.prototype.intDestroy = function(evt) {
      this.dragProcessStarted = false;
      this.toggleEvents();
      document.body.classList.remove("e-prevent-select");
      this.element.setAttribute("aria-grabbed", "false");
      EventHandler.remove(document, Browser.isSafari() ? "touchmove" : Browser.touchMoveEvent, this.intDragStart);
      EventHandler.remove(document, Browser.isSafari() ? "touchend" : Browser.touchEndEvent, this.intDragStop);
      EventHandler.remove(document, Browser.isSafari() ? "touchend" : Browser.touchEndEvent, this.intDestroy);
      EventHandler.remove(document, Browser.isSafari() ? "touchmove" : Browser.touchMoveEvent, this.intDrag);
      if (this.isDragStarted()) {
        this.isDragStarted(true);
      }
    };
    Draggable2.prototype.onPropertyChanged = function(newProp, oldProp) {
    };
    Draggable2.prototype.getModuleName = function() {
      return "draggable";
    };
    Draggable2.prototype.isDragStarted = function(change) {
      if (change) {
        isDraggedObject.isDragged = !isDraggedObject.isDragged;
      }
      return isDraggedObject.isDragged;
    };
    Draggable2.prototype.setDragArea = function() {
      var eleWidthBound;
      var eleHeightBound;
      var top = 0;
      var left = 0;
      var ele;
      var type = typeof this.dragArea;
      if (type === "string") {
        ele = select(this.dragArea);
      } else {
        ele = this.dragArea;
      }
      if (ele) {
        var elementArea = ele.getBoundingClientRect();
        eleWidthBound = ele.scrollWidth ? ele.scrollWidth : elementArea.right - elementArea.left;
        eleHeightBound = ele.scrollHeight ? this.dragArea && !isNullOrUndefined(this.helperElement) && this.helperElement.classList.contains("e-treeview") ? ele.clientHeight : ele.scrollHeight : elementArea.bottom - elementArea.top;
        var keys2 = ["Top", "Left", "Bottom", "Right"];
        var styles = getComputedStyle(ele);
        for (var i = 0; i < keys2.length; i++) {
          var key = keys2[parseInt(i.toString(), 10)];
          var tborder = styles["border" + key + "Width"];
          var tpadding = styles["padding" + key];
          var lowerKey = key.toLowerCase();
          this.borderWidth["" + lowerKey] = isNaN(parseFloat(tborder)) ? 0 : parseFloat(tborder);
          this.padding["" + lowerKey] = isNaN(parseFloat(tpadding)) ? 0 : parseFloat(tpadding);
        }
        if (this.dragArea && !isNullOrUndefined(this.helperElement) && this.helperElement.classList.contains("e-treeview")) {
          top = elementArea.top + document.scrollingElement.scrollTop;
        } else {
          top = elementArea.top;
        }
        left = elementArea.left;
        this.dragLimit.left = left + this.borderWidth.left + this.padding.left;
        this.dragLimit.top = ele.offsetTop + this.borderWidth.top + this.padding.top;
        this.dragLimit.right = left + eleWidthBound - (this.borderWidth.right + this.padding.right);
        this.dragLimit.bottom = top + eleHeightBound - (this.borderWidth.bottom + this.padding.bottom);
      }
    };
    Draggable2.prototype.getProperTargetElement = function(evt) {
      var intCoord = this.getCoordinates(evt);
      var ele;
      var prevStyle = this.helperElement.style.pointerEvents || "";
      var isPointer = evt.type.indexOf("pointer") !== -1 && Browser.info.name === "safari" && parseInt(Browser.info.version, 10) > 12;
      if (compareElementParent(evt.target, this.helperElement) || evt.type.indexOf("touch") !== -1 || isPointer) {
        this.helperElement.style.pointerEvents = "none";
        ele = document.elementFromPoint(intCoord.clientX, intCoord.clientY);
        this.helperElement.style.pointerEvents = prevStyle;
      } else {
        ele = evt.target;
      }
      return ele;
    };
    Draggable2.prototype.currentStateCheck = function(ele, oldEle) {
      var elem;
      if (!isNullOrUndefined(this.currentStateTarget) && this.currentStateTarget !== ele) {
        elem = this.currentStateTarget;
      } else {
        elem = !isNullOrUndefined(oldEle) ? oldEle : ele;
      }
      return elem;
    };
    Draggable2.prototype.getMousePosition = function(evt, isdragscroll) {
      var dragEle = evt.srcElement !== void 0 ? evt.srcElement : evt.target;
      var intCoord = this.getCoordinates(evt);
      var pageX;
      var pageY;
      var isOffsetParent = isNullOrUndefined(dragEle.offsetParent);
      if (isdragscroll) {
        pageX = this.clone ? intCoord.pageX : intCoord.pageX + (isOffsetParent ? 0 : dragEle.offsetParent.scrollLeft) - this.relativeXPosition;
        pageY = this.clone ? intCoord.pageY : intCoord.pageY + (isOffsetParent ? 0 : dragEle.offsetParent.scrollTop) - this.relativeYPosition;
      } else {
        pageX = this.clone ? intCoord.pageX : intCoord.pageX + window.pageXOffset - this.relativeXPosition;
        pageY = this.clone ? intCoord.pageY : intCoord.pageY + window.pageYOffset - this.relativeYPosition;
      }
      if (document.scrollingElement && !isdragscroll && !this.clone) {
        var ele = document.scrollingElement;
        var isVerticalScroll = ele.scrollHeight > 0 && ele.scrollHeight > ele.clientHeight && ele.scrollTop > 0;
        var isHorrizontalScroll = ele.scrollWidth > 0 && ele.scrollWidth > ele.clientWidth && ele.scrollLeft > 0;
        pageX = isHorrizontalScroll ? pageX - ele.scrollLeft : pageX;
        pageY = isVerticalScroll ? pageY - ele.scrollTop : pageY;
      }
      return {
        left: pageX - (this.margin.left + this.cursorAt.left),
        top: pageY - (this.margin.top + this.cursorAt.top)
      };
    };
    Draggable2.prototype.getCoordinates = function(evt) {
      if (evt.type.indexOf("touch") > -1) {
        return evt.changedTouches[0];
      }
      return evt;
    };
    Draggable2.prototype.getHelperElement = function(evt) {
      var element;
      if (this.clone) {
        if (this.helper) {
          element = this.helper({
            sender: evt,
            element: this.target,
            currentTargetElement: this.currentStateTarget
          });
        } else {
          element = createElement("div", {
            className: "e-drag-helper e-block-touch",
            innerHTML: "Draggable"
          });
          document.body.appendChild(element);
        }
      } else {
        element = this.element;
      }
      return element;
    };
    Draggable2.prototype.setGlobalDroppables = function(reset, drag, helper) {
      this.droppables[this.scope] = reset ? null : {
        draggable: drag,
        helper,
        draggedElement: this.element
      };
    };
    Draggable2.prototype.checkTargetElement = function(evt) {
      var target = this.getProperTargetElement(evt);
      var dropIns = this.getDropInstance(target);
      if (!dropIns && target && !isNullOrUndefined(target.parentNode)) {
        var parent_1 = closest(target.parentNode, ".e-droppable") || target.parentElement;
        if (parent_1) {
          dropIns = this.getDropInstance(parent_1);
        }
      }
      return {
        target,
        instance: dropIns
      };
    };
    Draggable2.prototype.getDropInstance = function(ele) {
      var name = "getModuleName";
      var drop;
      var eleInst = ele && ele.ej2_instances;
      if (eleInst) {
        for (var _i = 0, eleInst_1 = eleInst; _i < eleInst_1.length; _i++) {
          var inst = eleInst_1[_i];
          if (inst["" + name]() === "droppable") {
            drop = inst;
            break;
          }
        }
      }
      return drop;
    };
    Draggable2.prototype.destroy = function() {
      this.toggleEvents(true);
      _super.prototype.destroy.call(this);
    };
    var Draggable_1;
    __decorate3([Complex({}, Position)], Draggable2.prototype, "cursorAt", void 0);
    __decorate3([Property(true)], Draggable2.prototype, "clone", void 0);
    __decorate3([Property()], Draggable2.prototype, "dragArea", void 0);
    __decorate3([Property()], Draggable2.prototype, "isDragScroll", void 0);
    __decorate3([Property()], Draggable2.prototype, "isReplaceDragEle", void 0);
    __decorate3([Property(true)], Draggable2.prototype, "isPreventSelect", void 0);
    __decorate3([Property(false)], Draggable2.prototype, "isPreventScroll", void 0);
    __decorate3([Event2()], Draggable2.prototype, "drag", void 0);
    __decorate3([Event2()], Draggable2.prototype, "dragStart", void 0);
    __decorate3([Event2()], Draggable2.prototype, "dragStop", void 0);
    __decorate3([Property(1)], Draggable2.prototype, "distance", void 0);
    __decorate3([Property()], Draggable2.prototype, "handle", void 0);
    __decorate3([Property()], Draggable2.prototype, "abort", void 0);
    __decorate3([Property()], Draggable2.prototype, "helper", void 0);
    __decorate3([Property("default")], Draggable2.prototype, "scope", void 0);
    __decorate3([Property("")], Draggable2.prototype, "dragTarget", void 0);
    __decorate3([Property()], Draggable2.prototype, "axis", void 0);
    __decorate3([Property()], Draggable2.prototype, "queryPositionInfo", void 0);
    __decorate3([Property(false)], Draggable2.prototype, "enableTailMode", void 0);
    __decorate3([Property(false)], Draggable2.prototype, "skipDistanceCheck", void 0);
    __decorate3([Property(true)], Draggable2.prototype, "preventDefault", void 0);
    __decorate3([Property(false)], Draggable2.prototype, "enableAutoScroll", void 0);
    __decorate3([Property(false)], Draggable2.prototype, "enableTapHold", void 0);
    __decorate3([Property(750)], Draggable2.prototype, "tapHoldThreshold", void 0);
    __decorate3([Property(false)], Draggable2.prototype, "enableScrollHandler", void 0);
    Draggable2 = Draggable_1 = __decorate3([NotifyPropertyChanges], Draggable2);
    return Draggable2;
  }(Base)
);

// node_modules/@syncfusion/ej2-base/src/droppable.js
var __extends4 = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __decorate4 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Droppable = (
  /** @class */
  function(_super) {
    __extends4(Droppable2, _super);
    function Droppable2(element, options) {
      var _this = _super.call(this, options, element) || this;
      _this.mouseOver = false;
      _this.dragData = {};
      _this.dragStopCalled = false;
      _this.bind();
      return _this;
    }
    Droppable2.prototype.bind = function() {
      this.wireEvents();
    };
    Droppable2.prototype.wireEvents = function() {
      EventHandler.add(this.element, Browser.isSafari() ? "touchend" : Browser.touchEndEvent, this.intDrop, this);
    };
    Droppable2.prototype.onPropertyChanged = function(newProp, oldProp) {
    };
    Droppable2.prototype.getModuleName = function() {
      return "droppable";
    };
    Droppable2.prototype.intOver = function(event, element) {
      if (!this.mouseOver) {
        var drag = this.dragData[this.scope];
        this.trigger("over", {
          event,
          target: element,
          dragData: drag
        });
        this.mouseOver = true;
      }
    };
    Droppable2.prototype.intOut = function(event, element) {
      if (this.mouseOver) {
        this.trigger("out", {
          evt: event,
          target: element
        });
        this.mouseOver = false;
      }
    };
    Droppable2.prototype.intDrop = function(evt, element) {
      if (!this.dragStopCalled) {
        return;
      } else {
        this.dragStopCalled = false;
      }
      var accept = true;
      var drag = this.dragData[this.scope];
      var isDrag = drag ? drag.helper && isVisible(drag.helper) : false;
      var area;
      if (isDrag) {
        area = this.isDropArea(evt, drag.helper, element);
        if (this.accept) {
          accept = matches(drag.helper, this.accept);
        }
      }
      if (isDrag && this.drop && area.canDrop && accept) {
        this.trigger("drop", {
          event: evt,
          target: area.target,
          droppedElement: drag.helper,
          dragData: drag
        });
      }
      this.mouseOver = false;
    };
    Droppable2.prototype.isDropArea = function(evt, helper, element) {
      var area = {
        canDrop: true,
        target: element || evt.target
      };
      var isTouch = evt.type === "touchend";
      if (isTouch || area.target === helper) {
        helper.style.display = "none";
        var coord = isTouch ? evt.changedTouches[0] : evt;
        var ele = document.elementFromPoint(coord.clientX, coord.clientY);
        area.canDrop = false;
        area.canDrop = compareElementParent(ele, this.element);
        if (area.canDrop) {
          area.target = ele;
        }
        helper.style.display = "";
      }
      return area;
    };
    Droppable2.prototype.destroy = function() {
      EventHandler.remove(this.element, Browser.isSafari() ? "touchend" : Browser.touchEndEvent, this.intDrop);
      _super.prototype.destroy.call(this);
    };
    __decorate4([Property()], Droppable2.prototype, "accept", void 0);
    __decorate4([Property("default")], Droppable2.prototype, "scope", void 0);
    __decorate4([Event2()], Droppable2.prototype, "drop", void 0);
    __decorate4([Event2()], Droppable2.prototype, "over", void 0);
    __decorate4([Event2()], Droppable2.prototype, "out", void 0);
    Droppable2 = __decorate4([NotifyPropertyChanges], Droppable2);
    return Droppable2;
  }(Base)
);

// node_modules/@syncfusion/ej2-base/src/keyboard.js
var __extends5 = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __decorate5 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var keyCode = {
  "backspace": 8,
  "tab": 9,
  "enter": 13,
  "shift": 16,
  "control": 17,
  "alt": 18,
  "pause": 19,
  "capslock": 20,
  "space": 32,
  "escape": 27,
  "pageup": 33,
  "pagedown": 34,
  "end": 35,
  "home": 36,
  "leftarrow": 37,
  "uparrow": 38,
  "rightarrow": 39,
  "downarrow": 40,
  "insert": 45,
  "delete": 46,
  "f1": 112,
  "f2": 113,
  "f3": 114,
  "f4": 115,
  "f5": 116,
  "f6": 117,
  "f7": 118,
  "f8": 119,
  "f9": 120,
  "f10": 121,
  "f11": 122,
  "f12": 123,
  "semicolon": 186,
  "plus": 187,
  "comma": 188,
  "minus": 189,
  "dot": 190,
  "forwardslash": 191,
  "graveaccent": 192,
  "openbracket": 219,
  "backslash": 220,
  "closebracket": 221,
  "singlequote": 222
};
var KeyboardEvents = (
  /** @class */
  function(_super) {
    __extends5(KeyboardEvents2, _super);
    function KeyboardEvents2(element, options) {
      var _this = _super.call(this, options, element) || this;
      _this.keyPressHandler = function(e) {
        var isAltKey = e.altKey;
        var isCtrlKey = e.ctrlKey;
        var isShiftKey = e.shiftKey;
        var curkeyCode = e.which;
        var keys2 = Object.keys(_this.keyConfigs);
        for (var _i = 0, keys_1 = keys2; _i < keys_1.length; _i++) {
          var key = keys_1[_i];
          var configCollection = _this.keyConfigs["" + key].split(",");
          for (var _a = 0, configCollection_1 = configCollection; _a < configCollection_1.length; _a++) {
            var rconfig = configCollection_1[_a];
            var rKeyObj = KeyboardEvents_1.getKeyConfigData(rconfig.trim());
            if (isAltKey === rKeyObj.altKey && isCtrlKey === rKeyObj.ctrlKey && isShiftKey === rKeyObj.shiftKey && curkeyCode === rKeyObj.keyCode) {
              e.action = key;
              if (_this.keyAction) {
                _this.keyAction(e);
              }
            }
          }
        }
      };
      _this.bind();
      return _this;
    }
    KeyboardEvents_1 = KeyboardEvents2;
    KeyboardEvents2.prototype.destroy = function() {
      this.unwireEvents();
      _super.prototype.destroy.call(this);
    };
    KeyboardEvents2.prototype.onPropertyChanged = function(newProp, oldProp) {
    };
    KeyboardEvents2.prototype.bind = function() {
      this.wireEvents();
    };
    KeyboardEvents2.prototype.getModuleName = function() {
      return "keyboard";
    };
    KeyboardEvents2.prototype.wireEvents = function() {
      this.element.addEventListener(this.eventName, this.keyPressHandler);
    };
    KeyboardEvents2.prototype.unwireEvents = function() {
      this.element.removeEventListener(this.eventName, this.keyPressHandler);
    };
    KeyboardEvents2.getKeyConfigData = function(config) {
      if (config in this.configCache) {
        return this.configCache["" + config];
      }
      var keys2 = config.toLowerCase().split("+");
      var keyData = {
        altKey: keys2.indexOf("alt") !== -1 ? true : false,
        ctrlKey: keys2.indexOf("ctrl") !== -1 ? true : false,
        shiftKey: keys2.indexOf("shift") !== -1 ? true : false,
        keyCode: null
      };
      if (keys2[keys2.length - 1].length > 1 && !!Number(keys2[keys2.length - 1])) {
        keyData.keyCode = Number(keys2[keys2.length - 1]);
      } else {
        keyData.keyCode = KeyboardEvents_1.getKeyCode(keys2[keys2.length - 1]);
      }
      KeyboardEvents_1.configCache["" + config] = keyData;
      return keyData;
    };
    KeyboardEvents2.getKeyCode = function(keyVal) {
      return keyCode["" + keyVal] || keyVal.toUpperCase().charCodeAt(0);
    };
    var KeyboardEvents_1;
    KeyboardEvents2.configCache = {};
    __decorate5([Property({})], KeyboardEvents2.prototype, "keyConfigs", void 0);
    __decorate5([Property("keyup")], KeyboardEvents2.prototype, "eventName", void 0);
    __decorate5([Event2()], KeyboardEvents2.prototype, "keyAction", void 0);
    KeyboardEvents2 = KeyboardEvents_1 = __decorate5([NotifyPropertyChanges], KeyboardEvents2);
    return KeyboardEvents2;
  }(Base)
);

// node_modules/@syncfusion/ej2-base/src/l10n.js
var L10n = (
  /** @class */
  function() {
    function L10n2(controlName, localeStrings, locale) {
      this.controlName = controlName;
      this.localeStrings = localeStrings;
      this.setLocale(locale || defaultCulture);
    }
    L10n2.prototype.setLocale = function(locale) {
      var intLocale = this.intGetControlConstant(L10n2.locale, locale);
      this.currentLocale = intLocale || this.localeStrings;
    };
    L10n2.load = function(localeObject) {
      this.locale = extend(this.locale, localeObject, {}, true);
    };
    L10n2.prototype.getConstant = function(prop) {
      if (!isNullOrUndefined(this.currentLocale["" + prop])) {
        return this.currentLocale["" + prop];
      } else {
        return this.localeStrings["" + prop] || "";
      }
    };
    L10n2.prototype.intGetControlConstant = function(curObject, locale) {
      if (curObject["" + locale]) {
        return curObject["" + locale][this.controlName];
      }
      return null;
    };
    L10n2.locale = {};
    return L10n2;
  }()
);

// node_modules/@syncfusion/ej2-base/src/touch.js
var __extends6 = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __decorate6 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SwipeSettings = (
  /** @class */
  function(_super) {
    __extends6(SwipeSettings2, _super);
    function SwipeSettings2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate6([Property(50)], SwipeSettings2.prototype, "swipeThresholdDistance", void 0);
    return SwipeSettings2;
  }(ChildProperty)
);
var swipeRegex = /(Up|Down)/;
var Touch = (
  /** @class */
  function(_super) {
    __extends6(Touch2, _super);
    function Touch2(element, options) {
      var _this = _super.call(this, options, element) || this;
      _this.touchAction = true;
      _this.tapCount = 0;
      _this.startEvent = function(evt) {
        if (_this.touchAction === true) {
          var point = _this.updateChangeTouches(evt);
          if (evt.changedTouches !== void 0) {
            _this.touchAction = false;
          }
          _this.isTouchMoved = false;
          _this.movedDirection = "";
          _this.startPoint = _this.lastMovedPoint = {
            clientX: point.clientX,
            clientY: point.clientY
          };
          _this.startEventData = point;
          _this.hScrollLocked = _this.vScrollLocked = false;
          _this.tStampStart = Date.now();
          _this.timeOutTapHold = setTimeout(function() {
            _this.tapHoldEvent(evt);
          }, _this.tapHoldThreshold);
          EventHandler.add(_this.element, Browser.touchMoveEvent, _this.moveEvent, _this);
          EventHandler.add(_this.element, Browser.touchEndEvent, _this.endEvent, _this);
          EventHandler.add(_this.element, Browser.touchCancelEvent, _this.cancelEvent, _this);
        }
      };
      _this.moveEvent = function(evt) {
        var point = _this.updateChangeTouches(evt);
        _this.movedPoint = point;
        _this.isTouchMoved = !(point.clientX === _this.startPoint.clientX && point.clientY === _this.startPoint.clientY);
        var eScrollArgs = {};
        if (_this.isTouchMoved) {
          clearTimeout(_this.timeOutTapHold);
          _this.calcScrollPoints(evt);
          var scrollArg = {
            startEvents: _this.startEventData,
            originalEvent: evt,
            startX: _this.startPoint.clientX,
            startY: _this.startPoint.clientY,
            distanceX: _this.distanceX,
            distanceY: _this.distanceY,
            scrollDirection: _this.scrollDirection,
            velocity: _this.getVelocity(point)
          };
          eScrollArgs = extend(eScrollArgs, {}, scrollArg);
          _this.trigger("scroll", eScrollArgs);
          _this.lastMovedPoint = {
            clientX: point.clientX,
            clientY: point.clientY
          };
        }
      };
      _this.cancelEvent = function(evt) {
        clearTimeout(_this.timeOutTapHold);
        clearTimeout(_this.timeOutTap);
        _this.tapCount = 0;
        _this.swipeFn(evt);
        EventHandler.remove(_this.element, Browser.touchCancelEvent, _this.cancelEvent);
      };
      _this.endEvent = function(evt) {
        _this.swipeFn(evt);
        if (!_this.isTouchMoved) {
          if (typeof _this.tap === "function") {
            _this.trigger("tap", {
              originalEvent: evt,
              tapCount: ++_this.tapCount
            });
            _this.timeOutTap = setTimeout(function() {
              _this.tapCount = 0;
            }, _this.tapThreshold);
          }
        }
        _this.modeclear();
      };
      _this.swipeFn = function(evt) {
        clearTimeout(_this.timeOutTapHold);
        clearTimeout(_this.timeOutTap);
        var point = _this.updateChangeTouches(evt);
        var diffX = point.clientX - _this.startPoint.clientX;
        var diffY = point.clientY - _this.startPoint.clientY;
        diffX = Math.floor(diffX < 0 ? -1 * diffX : diffX);
        diffY = Math.floor(diffY < 0 ? -1 * diffY : diffX);
        _this.isTouchMoved = diffX > 1 || diffY > 1;
        var isFirefox = /Firefox/.test(Browser.userAgent);
        if (isFirefox && point.clientX === 0 && point.clientY === 0 && evt.type === "mouseup") {
          _this.isTouchMoved = false;
        }
        _this.endPoint = point;
        _this.calcPoints(evt);
        var swipeArgs = {
          originalEvent: evt,
          startEvents: _this.startEventData,
          startX: _this.startPoint.clientX,
          startY: _this.startPoint.clientY,
          distanceX: _this.distanceX,
          distanceY: _this.distanceY,
          swipeDirection: _this.movedDirection,
          velocity: _this.getVelocity(point)
        };
        if (_this.isTouchMoved) {
          var tDistance = _this.swipeSettings.swipeThresholdDistance;
          var eSwipeArgs = extend(void 0, _this.defaultArgs, swipeArgs);
          var canTrigger = false;
          var ele = _this.element;
          var scrollBool = _this.isScrollable(ele);
          var moved = swipeRegex.test(_this.movedDirection);
          if (tDistance < _this.distanceX && !moved || tDistance < _this.distanceY && moved) {
            if (!scrollBool) {
              canTrigger = true;
            } else {
              canTrigger = _this.checkSwipe(ele, moved);
            }
          }
          if (canTrigger) {
            _this.trigger("swipe", eSwipeArgs);
          }
        }
        _this.modeclear();
      };
      _this.modeclear = function() {
        _this.modeClear = setTimeout(function() {
          _this.touchAction = true;
        }, typeof _this.tap !== "function" ? 0 : 20);
        _this.lastTapTime = (/* @__PURE__ */ new Date()).getTime();
        EventHandler.remove(_this.element, Browser.touchMoveEvent, _this.moveEvent);
        EventHandler.remove(_this.element, Browser.touchEndEvent, _this.endEvent);
        EventHandler.remove(_this.element, Browser.touchCancelEvent, _this.cancelEvent);
      };
      _this.bind();
      return _this;
    }
    Touch2.prototype.onPropertyChanged = function(newProp, oldProp) {
    };
    Touch2.prototype.bind = function() {
      this.wireEvents();
      if (Browser.isIE) {
        this.element.classList.add("e-block-touch");
      }
    };
    Touch2.prototype.destroy = function() {
      this.unwireEvents();
      _super.prototype.destroy.call(this);
    };
    Touch2.prototype.wireEvents = function() {
      EventHandler.add(this.element, Browser.touchStartEvent, this.startEvent, this);
    };
    Touch2.prototype.unwireEvents = function() {
      EventHandler.remove(this.element, Browser.touchStartEvent, this.startEvent);
    };
    Touch2.prototype.getModuleName = function() {
      return "touch";
    };
    Touch2.prototype.isScrollable = function(element) {
      var eleStyle = getComputedStyle(element);
      var style = eleStyle.overflow + eleStyle.overflowX + eleStyle.overflowY;
      if (/(auto|scroll)/.test(style)) {
        return true;
      }
      return false;
    };
    Touch2.prototype.tapHoldEvent = function(evt) {
      this.tapCount = 0;
      this.touchAction = true;
      EventHandler.remove(this.element, Browser.touchMoveEvent, this.moveEvent);
      EventHandler.remove(this.element, Browser.touchEndEvent, this.endEvent);
      var eTapArgs = {
        originalEvent: evt
      };
      this.trigger("tapHold", eTapArgs);
      EventHandler.remove(this.element, Browser.touchCancelEvent, this.cancelEvent);
    };
    Touch2.prototype.calcPoints = function(evt) {
      var point = this.updateChangeTouches(evt);
      this.defaultArgs = {
        originalEvent: evt
      };
      this.distanceX = Math.abs(Math.abs(point.clientX) - Math.abs(this.startPoint.clientX));
      this.distanceY = Math.abs(Math.abs(point.clientY) - Math.abs(this.startPoint.clientY));
      if (this.distanceX > this.distanceY) {
        this.movedDirection = point.clientX > this.startPoint.clientX ? "Right" : "Left";
      } else {
        this.movedDirection = point.clientY < this.startPoint.clientY ? "Up" : "Down";
      }
    };
    Touch2.prototype.calcScrollPoints = function(evt) {
      var point = this.updateChangeTouches(evt);
      this.defaultArgs = {
        originalEvent: evt
      };
      this.distanceX = Math.abs(Math.abs(point.clientX) - Math.abs(this.lastMovedPoint.clientX));
      this.distanceY = Math.abs(Math.abs(point.clientY) - Math.abs(this.lastMovedPoint.clientY));
      if ((this.distanceX > this.distanceY || this.hScrollLocked === true) && this.vScrollLocked === false) {
        this.scrollDirection = point.clientX > this.lastMovedPoint.clientX ? "Right" : "Left";
        this.hScrollLocked = true;
      } else {
        this.scrollDirection = point.clientY < this.lastMovedPoint.clientY ? "Up" : "Down";
        this.vScrollLocked = true;
      }
    };
    Touch2.prototype.getVelocity = function(pnt) {
      var newX = pnt.clientX;
      var newY = pnt.clientY;
      var newT = Date.now();
      var xDist = newX - this.startPoint.clientX;
      var yDist = newY - this.startPoint.clientX;
      var interval = newT - this.tStampStart;
      return Math.sqrt(xDist * xDist + yDist * yDist) / interval;
    };
    Touch2.prototype.checkSwipe = function(ele, flag) {
      var keys2 = ["scroll", "offset"];
      var temp = flag ? ["Height", "Top"] : ["Width", "Left"];
      if (ele[keys2[0] + temp[0]] <= ele[keys2[1] + temp[0]]) {
        return true;
      }
      return ele[keys2[0] + temp[1]] === 0 || ele[keys2[1] + temp[0]] + ele[keys2[0] + temp[1]] >= ele[keys2[0] + temp[0]];
    };
    Touch2.prototype.updateChangeTouches = function(evt) {
      var point = evt.changedTouches && evt.changedTouches.length !== 0 ? evt.changedTouches[0] : evt;
      return point;
    };
    __decorate6([Event2()], Touch2.prototype, "tap", void 0);
    __decorate6([Event2()], Touch2.prototype, "tapHold", void 0);
    __decorate6([Event2()], Touch2.prototype, "swipe", void 0);
    __decorate6([Event2()], Touch2.prototype, "scroll", void 0);
    __decorate6([Property(350)], Touch2.prototype, "tapThreshold", void 0);
    __decorate6([Property(750)], Touch2.prototype, "tapHoldThreshold", void 0);
    __decorate6([Complex({}, SwipeSettings)], Touch2.prototype, "swipeSettings", void 0);
    Touch2 = __decorate6([NotifyPropertyChanges], Touch2);
    return Touch2;
  }(Base)
);

// node_modules/@syncfusion/ej2-base/src/template.js
var LINES = new RegExp("\\n|\\r|\\s\\s+", "g");
var QUOTES = new RegExp(/'|"/g);
var IF_STMT = new RegExp("if ?\\(");
var ELSEIF_STMT = new RegExp("else if ?\\(");
var ELSE_STMT = new RegExp("else");
var FOR_STMT = new RegExp("for ?\\(");
var IF_OR_FOR = new RegExp("(/if|/for)");
var CALL_FUNCTION = new RegExp("\\((.*)\\)", "");
var NOT_NUMBER = new RegExp("^[0-9]+$", "g");
var WORD = new RegExp(`[\\w"'.\\s+]+`, "g");
var DBL_QUOTED_STR = new RegExp('"(.*?)"', "g");
var WORDIF = new RegExp(`[\\w"'@#$.\\s-+]+`, "g");
var exp = new RegExp("\\${([^}]*)}", "g");
var ARR_OBJ = /^\..*/gm;
var SINGLE_SLASH = /\\/gi;
var DOUBLE_SLASH = /\\\\/gi;
var WORDFUNC = new RegExp(`[\\w"'@#$.\\s+]+`, "g");
var WINDOWFUNC = /\window\./gm;
function compile(template, helper, ignorePrefix) {
  if (typeof template === "function") {
    return template;
  } else {
    var argName = "data";
    var evalExpResult = evalExp(template, argName, helper, ignorePrefix);
    var condtion = `var valueRegEx = (/value=\\'([A-Za-z0-9 _]*)((.)([\\w)(!-;?-■\\s]+)['])/g);
        var hrefRegex = (/(?:href)([\\s='"./]+)([\\w-./?=&\\\\#"]+)((.)([\\w)(!-;/?-■\\s]+)['])/g);
        if(str.match(valueRegEx)){
            var check = str.match(valueRegEx);
            var str1 = str;
            for (var i=0; i < check.length; i++) {
                var check1 = str.match(valueRegEx)[i].split('value=')[1];
                var change = check1.match(/^'/) !== null ? check1.replace(/^'/, '"') : check1;
                change =change.match(/.$/)[0] === '\\'' ? change.replace(/.$/,'"') : change;
                str1 = str1.replace(check1, change);
            }
            str = str.replace(str, str1);
        }
        else if (str.match(/(?:href='')/) === null) {
            if(str.match(hrefRegex)) {
                var check = str.match(hrefRegex);
                var str1 = str;
                for (var i=0; i < check.length; i++) {
                    var check1 = str.match(hrefRegex)[i].split('href=')[1];
                    if (check1) {
                        var change = check1.match(/^'/) !== null ? check1.replace(/^'/, '"') : check1;
                        change =change.match(/.$/)[0] === '\\'' ? change.replace(/.$/,'"') : change;
                        str1 = str1.replace(check1, change);
                    }
                }
                str = str.replace(str, str1);
            }
        }
        `;
    var fnCode = 'var str="' + evalExpResult + '";' + condtion + " return str;";
    var fn = new Function(argName, fnCode);
    return fn.bind(helper);
  }
}
function evalExp(str, nameSpace, helper, ignorePrefix) {
  var varCOunt = 0;
  var localKeys = [];
  var isClass = str.match(/class="([^"]+|)\s{2}/g);
  var singleSpace = "";
  if (isClass) {
    isClass.forEach(function(value) {
      singleSpace = value.replace(/\s\s+/g, " ");
      str = str.replace(value, singleSpace);
    });
  }
  if (exp.test(str)) {
    var insideBraces = false;
    var outputString = "";
    for (var i = 0; i < str.length; i++) {
      if (str[i + ""] === "$" && str[i + 1] === "{") {
        insideBraces = true;
      } else if (str[i + ""] === "}") {
        insideBraces = false;
      }
      outputString += str[i + ""] === '"' && !insideBraces ? '\\"' : str[i + ""];
    }
    str = outputString;
  } else {
    str = str.replace(/\\?"/g, '\\"');
  }
  return str.replace(LINES, "").replace(DBL_QUOTED_STR, "'$1'").replace(exp, function(match, cnt, offset, matchStr) {
    var SPECIAL_CHAR = /@|#|\$/gm;
    var matches2 = cnt.match(CALL_FUNCTION);
    if (matches2) {
      var rlStr = matches2[1];
      if (ELSEIF_STMT.test(cnt)) {
        cnt = '";} ' + cnt.replace(matches2[1], rlStr.replace(WORD, function(str2) {
          str2 = str2.trim();
          return addNameSpace(str2, !QUOTES.test(str2) && localKeys.indexOf(str2) === -1, nameSpace, localKeys, ignorePrefix);
        })) + '{ \n str = str + "';
      } else if (IF_STMT.test(cnt)) {
        cnt = '"; ' + cnt.replace(matches2[1], rlStr.replace(WORDIF, function(strs) {
          return HandleSpecialCharArrObj(strs, nameSpace, localKeys, ignorePrefix);
        })) + '{ \n str = str + "';
      } else if (FOR_STMT.test(cnt)) {
        var rlStr_1 = matches2[1].split(" of ");
        cnt = '"; ' + cnt.replace(matches2[1], function(mtc) {
          localKeys.push(rlStr_1[0]);
          localKeys.push(rlStr_1[0] + "Index");
          varCOunt = varCOunt + 1;
          return "var i" + varCOunt + "=0; i" + varCOunt + " < " + addNameSpace(rlStr_1[1], true, nameSpace, localKeys, ignorePrefix) + ".length; i" + varCOunt + "++";
        }) + "{ \n " + rlStr_1[0] + "= " + addNameSpace(rlStr_1[1], true, nameSpace, localKeys, ignorePrefix) + "[i" + varCOunt + "]; \n var " + rlStr_1[0] + "Index=i" + varCOunt + '; \n str = str + "';
      } else {
        var fnStr = cnt.split("(");
        var fNameSpace = helper && Object.prototype.hasOwnProperty.call(helper, fnStr[0]) ? "this." : "global";
        fNameSpace = /\./.test(fnStr[0]) ? "" : fNameSpace;
        var ftArray = matches2[1].split(",");
        if (matches2[1].length !== 0 && !/data/.test(ftArray[0]) && !/window./.test(ftArray[0])) {
          matches2[1] = fNameSpace === "global" ? nameSpace + "." + matches2[1] : matches2[1];
        }
        var splRegexp = /@|\$|#/gm;
        var arrObj = /\]\./gm;
        if (WINDOWFUNC.test(cnt) && arrObj.test(cnt) || splRegexp.test(cnt)) {
          var splArrRegexp = /@|\$|#|\]\./gm;
          if (splArrRegexp.test(cnt)) {
            cnt = '"+ ' + (fNameSpace === "global" ? "" : fNameSpace) + cnt.replace(matches2[1], rlStr.replace(WORDFUNC, function(strs) {
              return HandleSpecialCharArrObj(strs, nameSpace, localKeys, ignorePrefix);
            })) + '+ "';
          }
        } else {
          cnt = '" + ' + (fNameSpace === "global" ? "" : fNameSpace) + cnt.replace(rlStr, addNameSpace(matches2[1].replace(/,( |)data.|,/gi, "," + nameSpace + ".").replace(/,( |)data.window/gi, ",window"), fNameSpace === "global" ? false : true, nameSpace, localKeys, ignorePrefix)) + '+"';
        }
      }
    } else if (ELSE_STMT.test(cnt)) {
      cnt = '"; ' + cnt.replace(ELSE_STMT, '} else { \n str = str + "');
    } else if (cnt.match(IF_OR_FOR)) {
      cnt = cnt.replace(IF_OR_FOR, '"; \n } \n str = str + "');
    } else if (SPECIAL_CHAR.test(cnt)) {
      if (cnt.match(SINGLE_SLASH)) {
        cnt = SlashReplace(cnt);
      }
      cnt = '"+' + NameSpaceForspecialChar(cnt, localKeys.indexOf(cnt) === -1, nameSpace, localKeys) + '"]+"';
    } else {
      if (cnt.match(SINGLE_SLASH)) {
        cnt = SlashReplace(cnt);
        cnt = '"+' + NameSpaceForspecialChar(cnt, localKeys.indexOf(cnt) === -1, nameSpace, localKeys) + '"]+"';
      } else {
        cnt = cnt !== "" ? '"+' + addNameSpace(cnt.replace(/,/gi, "+" + nameSpace + "."), localKeys.indexOf(cnt) === -1, nameSpace, localKeys, ignorePrefix) + '+"' : "${}";
      }
    }
    return cnt;
  });
}
function addNameSpace(str, addNS, nameSpace, ignoreList, ignorePrefix) {
  return addNS && !NOT_NUMBER.test(str) && ignoreList.indexOf(str.split(".")[0]) === -1 && !ignorePrefix && str !== "true" && str !== "false" ? nameSpace + "." + str : str;
}
function NameSpaceArrObj(str, addNS, nameSpace, ignoreList) {
  var arrObjReg = /^\..*/gm;
  return addNS && !NOT_NUMBER.test(str) && ignoreList.indexOf(str.split(".")[0]) === -1 && !arrObjReg.test(str) ? nameSpace + "." + str : str;
}
function NameSpaceForspecialChar(str, addNS, nameSpace, ignoreList) {
  return addNS && !NOT_NUMBER.test(str) && ignoreList.indexOf(str.split(".")[0]) === -1 ? nameSpace + '["' + str : str;
}
function SlashReplace(tempStr) {
  var double = "\\\\";
  if (tempStr.match(DOUBLE_SLASH)) {
    return tempStr;
  } else {
    return tempStr.replace(SINGLE_SLASH, double);
  }
}
function HandleSpecialCharArrObj(str, nameSpaceNew, keys2, ignorePrefix) {
  str = str.trim();
  var windowFunc = /\window\./gm;
  if (!windowFunc.test(str)) {
    var quotes = /'|"/gm;
    var splRegexp = /@|\$|#/gm;
    if (splRegexp.test(str)) {
      str = NameSpaceForspecialChar(str, keys2.indexOf(str) === -1, nameSpaceNew, keys2) + '"]';
    }
    if (ARR_OBJ.test(str)) {
      return NameSpaceArrObj(str, !quotes.test(str) && keys2.indexOf(str) === -1, nameSpaceNew, keys2);
    } else {
      return addNameSpace(str, !quotes.test(str) && keys2.indexOf(str) === -1, nameSpaceNew, keys2, ignorePrefix);
    }
  } else {
    return str;
  }
}

// node_modules/@syncfusion/ej2-base/src/template-engine.js
var HAS_ROW = /^[\n\r.]+<tr|^<tr/;
var HAS_SVG = /^[\n\r.]+<svg|^<path|^<g/;
var blazorTemplates = {};
function getRandomId() {
  return "-" + Math.random().toString(36).substr(2, 5);
}
function compile2(templateString, helper, ignorePrefix) {
  var compiler = engineObj.compile(templateString, helper, ignorePrefix);
  return function(data, component, propName, templateId, isStringTemplate, index, element, root) {
    var result = compiler(data, component, propName, element, root);
    var blazorTemplateId = "BlazorTemplateId";
    if (isBlazor() && !isStringTemplate) {
      var randomId = getRandomId();
      var blazorId = templateId + randomId;
      if (!blazorTemplates["" + templateId]) {
        blazorTemplates["" + templateId] = [];
      }
      if (!isNullOrUndefined(index)) {
        var keys2 = Object.keys(blazorTemplates["" + templateId][parseInt(index.toString(), 10)]);
        for (var _i = 0, keys_1 = keys2; _i < keys_1.length; _i++) {
          var key = keys_1[_i];
          if (key !== blazorTemplateId && data["" + key]) {
            blazorTemplates["" + templateId][parseInt(index.toString(), 10)]["" + key] = data["" + key];
          }
          if (key === blazorTemplateId) {
            blazorId = blazorTemplates["" + templateId][parseInt(index.toString(), 10)]["" + key];
          }
        }
      } else {
        data["" + blazorTemplateId] = blazorId;
        blazorTemplates["" + templateId].push(data);
      }
      return propName === "rowTemplate" ? [createElement("tr", {
        id: blazorId,
        className: "e-blazor-template"
      })] : [createElement("div", {
        id: blazorId,
        className: "e-blazor-template"
      })];
    }
    if (typeof result === "string") {
      if (HAS_SVG.test(result)) {
        var ele = createElement("svg", {
          innerHTML: result
        });
        return ele.childNodes;
      } else {
        var ele = createElement(HAS_ROW.test(result) ? "table" : "div", {
          innerHTML: result
        });
        return ele.childNodes;
      }
    } else {
      return result;
    }
  };
}
function updateBlazorTemplate(templateId, templateName, comp, isEmpty, callBack) {
  if (isBlazor()) {
    var ejsIntrop = "sfBlazor";
    window["" + ejsIntrop].updateTemplate(templateName, blazorTemplates["" + templateId], templateId, comp, callBack);
    if (isEmpty !== false) {
      blazorTemplates["" + templateId] = [];
    }
  }
}
function resetBlazorTemplate(templateId, templateName, index) {
  var templateDiv = document.getElementById(templateId);
  if (templateDiv) {
    var innerTemplates = templateDiv.getElementsByClassName("blazor-inner-template");
    for (var i = 0; i < innerTemplates.length; i++) {
      var tempId = " ";
      if (!isNullOrUndefined(index)) {
        tempId = innerTemplates[parseInt(index.toString(), 10)].getAttribute("data-templateId");
      } else {
        tempId = innerTemplates[parseInt(i.toString(), 10)].getAttribute("data-templateId");
      }
      var tempElement = document.getElementById(tempId);
      if (tempElement) {
        var length_1 = tempElement.childNodes.length;
        for (var j = 0; j < length_1; j++) {
          if (!isNullOrUndefined(index)) {
            innerTemplates[parseInt(index.toString(), 10)].appendChild(tempElement.childNodes[0]);
            i = innerTemplates.length;
          } else {
            innerTemplates[parseInt(i.toString(), 10)].appendChild(tempElement.childNodes[0]);
          }
        }
      }
    }
  }
}
function setTemplateEngine(classObj) {
  engineObj.compile = classObj.compile;
}
function getTemplateEngine() {
  return engineObj.compile;
}
function initializeCSPTemplate(template, helper) {
  var boundFunc;
  template.prototype.CSPTemplate = true;
  if (!isNullOrUndefined(helper)) {
    boundFunc = template.bind(helper);
    boundFunc.prototype = Object.create(template.prototype);
  } else {
    boundFunc = template;
  }
  return boundFunc;
}
var Engine = (
  /** @class */
  function() {
    function Engine2() {
    }
    Engine2.prototype.compile = function(templateString, helper, ignorePrefix) {
      if (helper === void 0) {
        helper = {};
      }
      return compile(templateString, helper);
    };
    return Engine2;
  }()
);
var engineObj = {
  compile: new Engine().compile
};

// node_modules/@syncfusion/ej2-base/src/sanitize-helper.js
var removeTags = ["script", "style", "iframe[src]", 'link[href*="javascript:"]', 'object[type="text/x-scriptlet"]', 'object[data^="data:text/html;base64"]', 'img[src^="data:text/html;base64"]', '[src^="javascript:"]', '[dynsrc^="javascript:"]', '[lowsrc^="javascript:"]', '[type^="application/x-shockwave-flash"]'];
var removeAttrs = [{
  attribute: "href",
  selector: '[href*="javascript:"]'
}, {
  attribute: "href",
  selector: "a[href]"
}, {
  attribute: "background",
  selector: '[background^="javascript:"]'
}, {
  attribute: "style",
  selector: '[style*="javascript:"]'
}, {
  attribute: "style",
  selector: '[style*="expression("]'
}, {
  attribute: "href",
  selector: 'a[href^="data:text/html;base64"]'
}];
var jsEvents = ["onchange", "onclick", "onmouseover", "onmouseout", "onkeydown", "onload", "onerror", "onblur", "onfocus", "onbeforeload", "onbeforeunload", "onkeyup", "onsubmit", "onafterprint", "onbeforeonload", "onbeforeprint", "oncanplay", "oncanplaythrough", "oncontextmenu", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onformchange", "onforminput", "onhaschange", "oninput", "oninvalid", "onkeypress", "onloadeddata", "onloadedmetadata", "onloadstart", "onmessage", "onmousedown", "onmousemove", "onmouseup", "onmousewheel", "onoffline", "onoine", "ononline", "onpagehide", "onpageshow", "onpause", "onplay", "onplaying", "onpopstate", "onprogress", "onratechange", "onreadystatechange", "onredo", "onresize", "onscroll", "onseeked", "onseeking", "onselect", "onstalled", "onstorage", "onsuspend", "ontimeupdate", "onundo", "onunload", "onvolumechange", "onwaiting", "onmouseenter", "onmouseleave", "onstart", "onpropertychange", "oncopy", "ontoggle", "onpointerout", "onpointermove", "onpointerleave", "onpointerenter", "onpointerrawupdate", "onpointerover", "onbeforecopy", "onbeforecut", "onbeforeinput"];
var SanitizeHtmlHelper = (
  /** @class */
  function() {
    function SanitizeHtmlHelper2() {
    }
    SanitizeHtmlHelper2.beforeSanitize = function() {
      return {
        selectors: {
          tags: removeTags,
          attributes: removeAttrs
        }
      };
    };
    SanitizeHtmlHelper2.sanitize = function(value) {
      if (isNullOrUndefined(value)) {
        return value;
      }
      var item = this.beforeSanitize();
      var output = this.serializeValue(item, value);
      return output;
    };
    SanitizeHtmlHelper2.serializeValue = function(item, value) {
      this.removeAttrs = item.selectors.attributes;
      this.removeTags = item.selectors.tags;
      this.wrapElement = document.createElement("div");
      this.wrapElement.innerHTML = value;
      this.removeXssTags();
      this.removeJsEvents();
      this.removeXssAttrs();
      var tempEleValue = this.wrapElement.innerHTML;
      this.removeElement();
      this.wrapElement = null;
      return tempEleValue.replace(/&amp;/g, "&");
    };
    SanitizeHtmlHelper2.removeElement = function() {
      var nodes = this.wrapElement.children;
      for (var j = 0; j < nodes.length; j++) {
        var attribute = nodes[parseInt(j.toString(), 10)].attributes;
        for (var i = 0; i < attribute.length; i++) {
          this.wrapElement.children[parseInt(j.toString(), 10)].removeAttribute(attribute[parseInt(i.toString(), 10)].localName);
        }
      }
    };
    SanitizeHtmlHelper2.removeXssTags = function() {
      var elements = this.wrapElement.querySelectorAll(this.removeTags.join(","));
      if (elements.length > 0) {
        elements.forEach(function(element) {
          detach(element);
        });
      } else {
        return;
      }
    };
    SanitizeHtmlHelper2.removeJsEvents = function() {
      var elements = this.wrapElement.querySelectorAll("[" + jsEvents.join("],[") + "]");
      if (elements.length > 0) {
        elements.forEach(function(element) {
          jsEvents.forEach(function(attr) {
            if (element.hasAttribute(attr)) {
              element.removeAttribute(attr);
            }
          });
        });
      } else {
        return;
      }
    };
    SanitizeHtmlHelper2.removeXssAttrs = function() {
      var _this = this;
      this.removeAttrs.forEach(function(item, index) {
        var elements = _this.wrapElement.querySelectorAll(item.selector);
        if (elements.length > 0) {
          if (item.selector === "a[href]") {
            elements.forEach(function(element) {
              if (element.getAttribute(item.attribute).replace(/\t|\s|&/, "").indexOf("javascript:alert") !== -1) {
                element.removeAttribute(item.attribute);
              }
            });
          } else {
            elements.forEach(function(element) {
              element.removeAttribute(item.attribute);
            });
          }
        }
      });
    };
    return SanitizeHtmlHelper2;
  }()
);

export {
  disableBlazorMode,
  createInstance,
  setImmediate,
  getValue,
  setValue,
  deleteObject,
  containerObject,
  isObject,
  getEnumValue,
  merge,
  extend,
  isNullOrUndefined,
  isUndefined,
  getUniqueID,
  debounce,
  queryParams,
  isObjectArray,
  compareElementParent,
  throwError,
  print,
  formatUnit,
  enableBlazorMode,
  isBlazor,
  getElement,
  getInstance,
  addInstance,
  uniqueID,
  defaultCurrencyCode,
  setDefaultCurrencyCode,
  setNumberFormat,
  setDateFormat,
  blazorCultureFormats,
  IntlBase,
  Ajax,
  Fetch,
  Browser,
  EventHandler,
  createElement,
  updateCSSText,
  addClass,
  removeClass,
  isVisible,
  prepend,
  append,
  detach,
  remove,
  attributes,
  select,
  selectAll,
  closest,
  siblings,
  getAttributeOrDefault,
  setStyleAttribute,
  classList,
  matches,
  includeInnerHTML,
  containsClass,
  cloneNode,
  Observer,
  Base,
  getComponent,
  removeChildInstance,
  proxyToRaw,
  setProxyToRaw,
  Property,
  Complex,
  ComplexFactory,
  Collection,
  CollectionFactory,
  Event2 as Event,
  NotifyPropertyChanges,
  CreateBuilder,
  Animation,
  rippleEffect,
  isRippleEnabled,
  enableRipple,
  animationMode,
  setGlobalAnimation,
  GlobalAnimationMode,
  ModuleLoader,
  ChildProperty,
  HijriParser,
  onIntlChange,
  rightToLeft,
  cldrData,
  defaultCulture,
  Internationalization,
  setCulture,
  setCurrencyCode,
  loadCldr,
  enableRtl,
  getNumericObject,
  getNumberDependable,
  getDefaultDateObject,
  componentList,
  registerLicense,
  validateLicense,
  getVersion,
  createLicenseOverlay,
  versionBasedStatePersistence,
  enableVersionBasedPersistence,
  Component,
  Position,
  Draggable,
  Droppable,
  KeyboardEvents,
  L10n,
  SwipeSettings,
  Touch,
  blazorTemplates,
  getRandomId,
  compile2 as compile,
  updateBlazorTemplate,
  resetBlazorTemplate,
  setTemplateEngine,
  getTemplateEngine,
  initializeCSPTemplate,
  SanitizeHtmlHelper
};
//# sourceMappingURL=chunk-4OJ7KAJU.js.map
