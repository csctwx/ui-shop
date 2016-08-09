(function() {
    var phoneModule = angular.module('phone-directives', []);
    var directiveSetting = {
        moduleName: "phone",
        items: "container,hotspots,hotspots_list,hotspots_list_item,hotspots_device,hotspots_plans,deals,acc_phones,acc_list,list,list_banner,list_legal,list_reason,list_filter,list_sort,list_sort_mini,list_item,details,details_accessories,details_images,details_dialog,hotspots_details_dialog,details_base,details_other,details_features,$details_plans,details_legal,compare,$genie,list_compare_mini,review,write_review,see_detail_modal"
    };
    if (appName == 'bst' || appName == 'vmu') {
        directiveSetting.items += ",$accessories_type";
    }
    appUtil.ui.buildModuleDirective(phoneModule, directiveSetting);
})();

appModule.controller('phoneController', ['$http', '$scope', '$sce', function($http, $scope, $sce) {
    var phoneController = this;
    this.selectedTab = "";
    this.IB = false;
    this.shopPhoneBanner = {};
    this.shopPhoneBanner2 = {};
    var filterOptions = {
        onSale: { label: "On Sale", matchExp: "item.hasDiscount" },
        bestSellers: { label: "Best Sellers", matchExp: "item.bestSellerCounter>0" },
        New: {},
        PreOwned: { label: "Pre-Owned" },
        iPhone: { label: "iPhone&reg;", matchExp: "item.type.toLowerCase().indexOf('iphone')>-1" },
        Android: { label: "Android&trade;", matchExp: "item.type.toLowerCase().indexOf('android')>-1", toolTip: "More \"pocket-sized computer\" then \"phone,\" an Android&trade; smartphone has the brains to text, email, instant message, surf the web, watch videos, play games and more." },
        Windows: { matchExp: "item.type.toLowerCase().indexOf('windows')>-1" },
        Basic: { matchExp: "item.type.toLowerCase().indexOf('basic')>-1", toolTip: "Want to call and text friends from just about anywhere? Yep, you can do that and a whole lot more on our basic phones." },
        Unlimited: { label: "Virgin Mobile Unlimited Plans", matchExp: "item.planType.planTypeId.indexOf('beyond-talk')>-1", toolTip: "Check out our Virgin Mobile Unlimited plans and choose your unlimited - data, talk or text.  No Contract." },
        PayLo: { label: "payLo Talk & Text Plans", matchExp: "item.planType.planTypeId.indexOf('paylo')>-1", toolTip: "Say more, don\'t pay more. 3 Simple Plans starting at $20. Nationwide Sprint<sup>&#174;</sup> Network. No Contract." },
        Bar: {},
        Slider: {},
        Flip: {},
        rate1: { label: "&#9733; <span class='rating-label'>&amp; Up</span>", value: 1, matchExp: "item.rate>1" },
        rate2: { label: "&#9733; &#9733; <span class='rating-label'>&amp; Up</span>", value: 2, matchExp: "item.rate>2" },
        rate3: { label: "&#9733; &#9733; &#9733; <span class='rating-label'>&amp; Up</span>", value: 3, matchExp: "item.rate>3" },
        rate4: { label: "&#9733; &#9733; &#9733; &#9733; <span class='rating-label'>&amp; Up</span>", value: 4, matchExp: "item.rate>4" },
        TouchScreen: { label: "Touchscreen" },
        Qwerty: { label: "QWERTY Keyboard" },
        Camera: { hiddenOnUnexist: true },
        FrontFacingCamera: { label: "Front-facing Camera" },
        GPS: { label: "GPS/Navigation" },
        Music: { hiddenOnUnexist: true },
        Wifi: { label: "Wi-Fi&reg;" },
        Bluetooth: { hiddenOnUnexist: true, label: "Bluetooth&reg;" },
        //SpeakerPhone:{label:"Speakerphone"},
        "4GLTE": { label: "4G LTE Compatible" },
        //Text:{label:"Text Messaging"},
        Video: { hiddenOnUnexist: true },
        HotSpot: { label: "Hotspot", hiddenOnUnexist: true },
        HtmlBrowser: { label: "HTML Browser" },
        UleCertified: { label: "ULE Certified" }
    };
    for (var k in filterOptions) {
        var o = filterOptions[k];
        if (!o.label) {
            o.label = k;
            o.value = k;
            o.matchMap = {};
        }
        o.id = k;
    }
    this.sortList = function(sort, listData) {
        if (sort) {
            var sortFn = null;
            if (sort == "featured") {
                sortFn = "a.genieOrder>b.genieOrder?1:-1";
            } else if (sort == "timeZA") {
                sortFn = "a.generalAvailabilityDate>b.generalAvailabilityDate?-1:1";
            } else if (sort == "priceAZ") {
                sortFn = "a.selectedVariant.price>b.selectedVariant.price?1:-1";
            } else if (sort == "priceZA") {
                sortFn = "a.selectedVariant.price>b.selectedVariant.price?-1:1";
            } else if (sort == "rateZA") {
                sortFn = "a.rate>b.rate?-1:1";
            } else if (sort == "nameAZ") {
                sortFn = "(a.brand + ' ' + a.name + ' ' + a.phoneCondition).toLowerCase()>(b.brand + ' ' + b.name + ' ' + b.phoneCondition).toLowerCase()?1:-1";
            } else {
                return listData;
            }
            var sortMethod = function(a, b) {
                return eval(sortFn);
            };
            listData.sort(sortMethod);
            //      analysisManager.sendWidgetData("Order by phone <"+sort+">");
        }
        return listData;
    };
    this.list = {
        data: [],
        message: {},
        legals: [],
        filter: {
            urlHash: {
                value: null,
                updateTimestamp: new Date().getTime(),
                initSelectedOptions: function(filterHash) {

                    var hasExtend = false;
                    var hash = "," + filterHash + ",";
                    for (var k in phoneController.list.filter.data.map) {
                        var group = phoneController.list.filter.data.map[k];
                        group.extend = false;
                        for (var i = 0; i < group.options.length; i++) {
                            var id = encodeURIComponent(group.options[i].id);
                            if (hash.indexOf("," + group.options[i].id + ",") >= 0 || hash.indexOf("," + id + ",") >= 0) {
                                group.options[i].checked = true;
                                group.extend = true;
                                hasExtend = true;
                            } else {
                                group.options[i].checked = false;
                            }
                        }
                    }
                    if (!hasExtend) {
                        phoneController.list.filter.data.map.condition.extend = true;
                    }
                },
                needLoadData: function() {
                    return location.hash != this.value || new Date().getTime() - this.updateTimestamp > 5000;
                }
            },
            selectedItems: [],
            data: {
                noFilter: true,
                map: {
                    special: { options: [filterOptions.onSale, filterOptions.bestSellers] },
                    condition: { title: "Condition", extend: true, options: [filterOptions.New, filterOptions.PreOwned] },
                    //          phoneTypes:{title:"Phone Types",buildByData:true,options:[],matchField:"item.type"},
                    phoneTypes: { title: "Phone Types", options: [filterOptions.Android, filterOptions.iPhone, filterOptions.Windows, filterOptions.Basic] },
                    planTypes: { title: "No Contract Plans", styleClass: "planTypes", options: [filterOptions.Unlimited, filterOptions.PayLo] },
                    //planTypes:{title:"No Contract Plans",buildByData:true,options:[],matchField:"item.planType.title"},
                    customerRating: {
                        title: "Customer Rating",
                        styleClass: "rating",
                        selectSingle: true,
                        options: [
                            filterOptions.rate4,
                            filterOptions.rate3,
                            filterOptions.rate2,
                            filterOptions.rate1
                        ]
                    },
                    brands: { title: "Brands", buildByData: true, relation: "or", options: [], matchField: "item.brand", doOptionSort: true },
                    features: {
                        title: "Features",
                        relation: "and",
                        options: [
                            filterOptions.TouchScreen,
                            filterOptions.Qwerty,
                            filterOptions.Camera,
                            filterOptions.FrontFacingCamera,
                            filterOptions.GPS,
                            filterOptions.Music,
                            filterOptions.Wifi,
                            filterOptions.Bluetooth,
                            //filterOptions.SpeakerPhone,
                            filterOptions["4GLTE"],
                            //filterOptions.Text,
                            filterOptions.Video,
                            filterOptions.HotSpot,
                            filterOptions.HtmlBrowser,
                            filterOptions.UleCertified
                        ]
                    },
                    phoneStyles: { title: "Phone Styles", relation: "or", options: [filterOptions.Bar, filterOptions.Slider, filterOptions.Flip] }
                },
                init: function() {
                    if (appName == 'bst') {
                        this.uiSort = [this.map.condition, this.map.phoneTypes, this.map.customerRating, this.map.brands, this.map.features, this.map.phoneStyles];
                        this.filterAnd = [this.map.special, this.map.customerRating, this.map.features];
                    } else if (appName == 'vmu') {
                        this.uiSort = [this.map.condition, this.map.phoneTypes, this.map.planTypes, this.map.customerRating, this.map.brands, this.map.features, this.map.phoneStyles];
                        this.filterAnd = [this.map.special, this.map.customerRating, this.map.features];
                    } else {
                        this.uiSort = [this.map.condition, this.map.phoneTypes, this.map.brands, this.map.features, this.map.phoneStyles];
                        this.filterAnd = [this.map.special, this.map.customerRating, this.map.features];
                    }
                    this.filterOr = [this.map.condition, this.map.phoneTypes, this.map.planTypes, this.map.brands, this.map.phoneStyles];
                }
            },
            init: function(phoneList, filterHash) {
                //init filter data
                if (!this.data.uiSort) {
                    this.data.init();
                }

                for (var k in this.data.map) {
                    for (var n = 0; n < this.data.map[k].options.length; n++) {
                        this.data.map[k].options[n].matchMap = {};
                    }
                }

                //assign match data
                this.phoneMap = {};
                for (var p = 0; p < phoneList.length; p++) {
                    var item = phoneList[p];
                    this.phoneMap[item.id] = item;

                    for (var k in filterOptions) {
                        try {
                            if (filterOptions[k].matchExp && eval(filterOptions[k].matchExp)) {
                                this.addMatchData(filterOptions[k], item);
                            }
                        } catch (e) {}
                    }
                    for (var k in this.data.map) {
                        if (this.data.map[k].matchField) {
                            var vs = eval(this.data.map[k].matchField);
                            vs = vs.split("|");
                            for (var vi = 0; vi < vs.length; vi++) {
                                var v = vs[vi];
                                var option = null;
                                for (var i = 0; i < this.data.map[k].options.length; i++) {
                                    if (this.data.map[k].options[i].label == v) {
                                        option = this.data.map[k].options[i];
                                    }
                                }
                                if (option == null) {
                                    option = { label: v, matchMap: {}, id: v.replace(/ /g, '_') };
                                    this.data.map[k].options.push(option);
                                }
                                this.addMatchData(option, item);
                            }
                        }
                    }

                    for (var i = 0; i < item.filters.length; i++) {
                        var f = item.filters[i];
                        if (filterOptions[f]) {
                            this.addMatchData(filterOptions[f], item);
                        }
                    }
                    if (!filterOptions.PreOwned.matchMap[item.id]) {
                        this.addMatchData(filterOptions.New, item);
                    }
                }

                //hidden unexist options
                for (var k in this.data.map) {
                    var group = this.data.map[k];
                    var removeList = [];
                    for (var i = 0; i < group.options.length; i++) {
                        var o = group.options[i];
                        if (JSON.stringify(o.matchMap) == "{}") {
                            if (group.buildByData) {
                                removeList.push(i);
                            } else {
                                o.disabled = true;
                            }
                            o.checked = false;
                        } else {
                            o.hidden = false;
                        }
                    }
                    for (var i = removeList.length - 1; i >= 0; i--) {
                        group.options.splice(removeList[i], 1);
                    }
                }
                this.urlHash.initSelectedOptions(filterHash);
            },
            getFilterResult: function() {
                if (!this.phoneMap) {
                    return;
                }
                this.urlHash.value = "";
                this.data.noFilter = true;
                var map = this.phoneMap;
                //get filter result by "And" option groups
                for (var i = 0; i < this.data.filterAnd.length; i++) {
                    var andGroup = this.data.filterAnd[i];
                    for (var n = 0; n < andGroup.options.length; n++) {
                        var option = andGroup.options[n];
                        if (option.checked) {
                            if (andGroup.selectSingle) {
                                if (andGroup.lastSelection == null) {
                                    andGroup.lastSelection = option;
                                } else if (andGroup.lastSelection != option) {
                                    andGroup.lastSelection.checked = false;
                                    andGroup.lastSelection = option;
                                }
                            }
                            this.data.noFilter = false;
                            this.urlHash.value += "," + encodeURIComponent(option.id);
                            map = appUtil.data.retrieveIntersection(map, option.matchMap);
                        } else if (option == andGroup.lastSelection) {
                            andGroup.lastSelection = null;
                        }
                    }
                }

                //get filter result by "Or" option groups
                for (var i = 0; i < this.data.filterOr.length; i++) {
                    var orGroup = this.data.filterOr[i];
                    //disable each "Or" group option by current filter result and other "Or" group options
                    var tmpUnionMap = map;
                    for (var ii = i + 1; ii < this.data.filterOr.length; ii++) {
                        var tmpOrGroup = this.data.filterOr[ii];
                        if (tmpOrGroup == orGroup) {
                            continue;
                        }
                        tmpUnionMap = this.retrieveOptionsUnion(tmpOrGroup.options, tmpUnionMap);
                    }
                    for (var n = 0; n < orGroup.options.length; n++) {
                        var option = orGroup.options[n];
                        if (appUtil.data.hasIntersection(tmpUnionMap, option.matchMap)) {
                            option.disabled = false;
                        } else {
                            option.disabled = true;
                            option.checked = false;
                        }
                        if (option.checked) {
                            this.data.noFilter = false;
                            this.urlHash.value += "," + encodeURIComponent(option.id);
                        }
                    }
                    //get union result
                    map = this.retrieveOptionsUnion(orGroup.options, map);
                }

                //disable "And" group options by final result
                for (var i = 0; i < this.data.filterAnd.length; i++) {
                    var andGroup = this.data.filterAnd[i];
                    for (var n = 0; n < andGroup.options.length; n++) {
                        var option = andGroup.options[n];
                        if (!option.checked) {
                            option.disabled = !appUtil.data.hasIntersection(map, option.matchMap);
                        }
                    }
                }
                //transfer to array 
                var list = [];
                for (var k in map) {
                    list.push(map[k]);
                }
                if (this.urlHash.value) {
                    this.urlHash.value = pathMap._phones._hash + "@" + this.urlHash.value.substring(1) + "/";
                } else {
                    this.urlHash.value = pathMap._phones._hash;
                }
                this.urlHash.updateTimestamp = new Date().getTime();
                appUtil.net.setUrlHash(this.urlHash.value);


                while (phoneController.list.filter.selectedItems.length > 0) {
                    phoneController.list.filter.selectedItems.splice(0, 1);
                }
                for (var k in phoneController.list.filter.data.map) {
                    var group = phoneController.list.filter.data.map[k];
                    for (var i = 0; i < group.options.length; i++) {
                        var id = encodeURIComponent(group.options[i].id);
                        if (group.options[i].checked) {
                            phoneController.list.filter.selectedItems.push(group.options[i].label);
                        }
                    }
                }
                return list;
            },
            retrieveOptionsUnion: function(options, map) {
                var tmpUnion = null;
                for (var i = 0; i < options.length; i++) {
                    if (options[i].checked) {
                        tmpUnion = appUtil.data.retrieveUnion(options[i].matchMap, tmpUnion);
                    }
                }
                if (tmpUnion != null) {
                    map = appUtil.data.retrieveIntersection(tmpUnion, map);
                }
                return map;
            },
            addMatchData: function(filterOption, data) {
                filterOption.matchMap[data.id] = data;
            },
            removeAll: function() {
                noFilter = true;

                for (var k in this.data.map) {
                    var group = this.data.map[k];
                    if (group.selectSingle) {
                        group.lastSelection = null;
                    }
                    for (var n = 0; n < group.options.length; n++) {
                        var option = group.options[n];
                        option.checked = false;
                        option.disabled = JSON.stringify(option.matchMap) == "{}";
                    }
                }
            },
            compareFilter: function(a, b) {
                if (a.label < b.label) {
                    return -1;
                }
                if (a.label > b.label) {
                    return 1;
                }
                return 0;
            },
            getFilterOptions: function(f) {
                for (var i = 0; i < phoneController.list.filter.data.uiSort.length; i++) {
                    if (f.title == phoneController.list.filter.data.uiSort[i].title) {
                        if (phoneController.list.filter.data.uiSort[i].doOptionSort) {
                            return phoneController.list.filter.data.uiSort[i].options.sort(phoneController.list.filter.compareFilter);
                        }
                        return phoneController.list.filter.data.uiSort[i].options;
                    }
                }
                return [];
            }
        },
        sort: "featured",
        getResultList: function() {
            if (location.hash.indexOf(pathMap._phones._hash) != 0 || !pathMap._phones._match(pathMap._formatedLocationHash) || phoneController.status == "init") {
                return;
            }
            return this.getSortedList(this.filter.getFilterResult());
        },
        getSortedList: function(listData) {
            phoneController.sortList(this.sort, listData);
            return listData;
        },
        getAccPhoneList: function() {
            var tempList = {};
            var phoneList = [];
            for (var i = 0; i < this.data.length; i++) {
                if (tempList[this.data[i].name]) {
                    if (this.data[i].phoneCondition == "new") {
                        tempList[this.data[i].name] = this.data[i];
                    }
                } else {
                    tempList[this.data[i].name] = this.data[i];
                }
            }
            var keys = Object.keys(tempList);
            for (var i = 0; i < keys.length; i++) {
                phoneList.push(tempList[keys[i]]);
            }
            phoneList = phoneController.sortList("nameAZ", phoneList);
            return phoneList;
        }
    };
    this.deals = {
        defaultPromoIndex: -1,
        discounts: [],
        promotions: [],
        scrubData: function(data) {
            data = appUtil.data.simplifyObject(data);
            data.discountedDevices = appUtil.data.toArray(data.discountedDevices);
            data.promotions = appUtil.data.toArray(data.promotions);
            var arrayPhoneDeviceType = [];
            var arrayAccessoryDeviceType = [];
            for (var i = 0; i < data.discountedDevices.length; i++) {
                appUtil.data.rename(data.discountedDevices[i], "externalUrl", "id");
                appUtil.data.rename(data.discountedDevices[i], "manufacturerName", "brand");
                appUtil.data.rename(data.discountedDevices[i], "shopGridPicture", "gridImage");
                appUtil.data.rename(data.discountedDevices[i], "checkOutImage", "checkoutImage");

                if (data.discountedDevices[i].gridImage) {
                    data.discountedDevices[i].gridImage = appUtil.data.formatImagePath(data.discountedDevices[i].gridImage.uRI);
                }
                if (data.discountedDevices[i].deviceType == "accessory") {
                    appUtil.data.rename(data.discountedDevices[i], "name", "label");
                    data.discountedDevices[i].checkoutImage.uRI = appUtil.data.formatImagePath(data.discountedDevices[i].checkoutImage.uRI);
                    if (data.discountedDevices[i].inventory == "out-of-stock" || data.discountedDevices[i].inventory == "end-of-life") {
                        data.discountedDevices[i].noMore = true;
                        data.discountedDevices[i].cartLabel = "Out of Stock";
                    } else if (data.discountedDevices[i].inventory == "pre-order") {
                        data.discountedDevices[i].cartLabel = "Pre Order";
                    } else if (data.discountedDevices[i].inventory == "back-order") {
                        data.discountedDevices[i].cartLabel = "Back Order";
                    } else {
                        data.discountedDevices[i].cartLabel = "Add to Cart";
                    }
                    arrayAccessoryDeviceType.push(data.discountedDevices[i]);
                } else {
                    arrayPhoneDeviceType.push(data.discountedDevices[i]);
                }
            }
            data.discountedDevices = arrayPhoneDeviceType.concat(arrayAccessoryDeviceType);
            for (var i = 0; i < data.promotions.length; i++) {
                if (data.promotions[i].isDefault) {
                    phoneController.deals.defaultPromoIndex = i;
                }
                if (data.promotions[i].banners) {
                    data.promotions[i].banners = appUtil.data.toArray(data.promotions[i].banners);
                    for (var j = 0; j < data.promotions[i].banners.length; j++) {
                        data.promotions[i].banners[j].imageUrl = appUtil.data.formatImagePath(data.promotions[i].banners[j].imageUrl);
                    }
                }
                if (data.promotions[i].devices) {
                    data.promotions[i].devices = appUtil.data.toArray(data.promotions[i].devices);
                    arrayPhoneDeviceType = [];
                    arrayAccessoryDeviceType = [];
                    for (var j = 0; j < data.promotions[i].devices.length; j++) {
                        appUtil.data.rename(data.promotions[i].devices[j], "externalUrl", "id");
                        appUtil.data.rename(data.promotions[i].devices[j], "manufacturerName", "brand");
                        appUtil.data.rename(data.promotions[i].devices[j], "shopGridPicture", "gridImage");
                        appUtil.data.rename(data.promotions[i].devices[j], "checkOutImage", "checkoutImage");
                        if (data.promotions[i].devices[j].gridImage) {
                            data.promotions[i].devices[j].gridImage = appUtil.data.formatImagePath(data.promotions[i].devices[j].gridImage.uRI);
                        }
                        if (data.promotions[i].devices[j].deviceType == "accessory") {
                            appUtil.data.rename(data.promotions[i].devices[j], "name", "label");
                            data.promotions[i].devices[j].checkoutImage.uRI = appUtil.data.formatImagePath(data.promotions[i].devices[j].checkoutImage.uRI);
                            if (data.promotions[i].devices[j].inventory == "out-of-stock" || data.promotions[i].devices[j].inventory == "end-of-life") {
                                data.promotions[i].devices[j].noMore = true;
                                data.promotions[i].devices[j].cartLabel = "Out of Stock";
                            } else if (data.promotions[i].devices[j].inventory == "pre-order") {
                                data.promotions[i].devices[j].cartLabel = "Pre Order";
                            } else if (data.promotions[i].devices[j].inventory == "back-order") {
                                data.promotions[i].devices[j].cartLabel = "Back Order";
                            } else {
                                data.promotions[i].devices[j].cartLabel = "Add to Cart";
                            }
                            arrayAccessoryDeviceType.push(data.promotions[i].devices[j]);
                        } else {
                            arrayPhoneDeviceType.push(data.promotions[i].devices[j]);
                        }
                    }
                    data.promotions[i].devices = arrayPhoneDeviceType.concat(arrayAccessoryDeviceType);
                }
            }
            phoneController.deals.discounts = data.discountedDevices;
            phoneController.deals.promotions = data.promotions;
        },
        init: function() {
            appUtil.net.getData($http, "shop_get_deals").success(function(data) {
                if (data.responses.response[0].getDealsResponse) {
                    phoneController.deals.scrubData(data.responses.response[0].getDealsResponse);
                }
            });
        }
    };
    this.inStoreOffers = {
        data: [],
        getList: function() {
            return this.data;
        }
    };
    this.accList = {
        id: "",
        phone: {},
        accessories: [],
        setPhone: function() {
            for (var i = 0; i < phoneController.list.data.length; i++) {
                if (phoneController.accList.id == phoneController.list.data[i].id) {
                    phoneController.accList.phone = phoneController.list.data[i];
                    //pathMap._accessoriesList._extendTitle=phoneController.accList.phone.brand+" "+phoneController.accList.phone.name;
                }
            }
        },
        init: function(id) {
            this.id = id;
            this.phone = {};
            this.accessories = [];

            if (phoneController.list.data.length == 0) {
                phoneController.loadList(this.id, this.setPhone);
            } else {
                this.setPhone();
            }
            pathMap._accessoriesList._adobeData.page.name = 'Accessories - ' + id;
            appUtil.net.getData($http, "shop_get_accessory_list", "?phoneId=" + this.id).success(function(data) {
                if (data.responses.response[0].accessoryResponse) {
                    phoneController.scrubAccessoriesData(data.responses.response[0].accessoryResponse.accessories);
                    phoneController.accList.accessories = data.responses.response[0].accessoryResponse.accessories.accessory;
                } else {
                    phoneController.accList.accessory = [];
                }
            })
        },
        accDiscountClass: function(data) {
            var discount = 0;
            var name = "";
            try {
                discount = parseInt(data.discount * 100) / 100;
                if (data.promotions) {
                    for (var i = 0; i < data.promotions.length; i++) {
                        if (data.promotions[i].webOnly) {
                            name = "onSale webOnly";
                        }
                    }
                }
                if (discount) {
                    //discount_name=(""+discount).replace("\.","_");
                    discount_name = Math.ceil(discount);
                    name = " onSale " + "discount_" + discount_name;
                }
            } catch (e) {}
            return name;
        }
    };
    this.scrubPhoneData = function(item) {
        item = appUtil.data.simplifyObject(item);
        appUtil.data.rename(item, "externalUrl", "id");
        appUtil.data.rename(item, "phoneName", "name");
        appUtil.data.rename(item, "phoneType", "type");
        appUtil.data.rename(item, "manufacturerName", "brand");
        item.displayBrand = item.brand;
        item.displayBrand = ["motorola"].indexOf(item.brand.toLowerCase()) >= 0 ? 'Moto' : item.brand;
        item.displayBrand = (item.id.indexOf("boost") > -1 ? "Boost" : item.displayBrand);
        item.displayBrand = ("Microsoft|Nokia" == item.brand ? "Lumia" : item.displayBrand);
        appUtil.data.rename(item, "associatedAccessoryId", "accessoryIds");
        item.rate = null;
        item.review = null;
        if (item.ReviewStatistics) {
            item.rate = item.ReviewStatistics.AverageOverallRating;
            item.review = item.ReviewStatistics.TotalReviewCount;
            delete item.ReviewStatistics;
        }
        if (item.phoneViewImages) {
            appUtil.data.rename(item, "phoneViewImages", "images");
            item.images = appUtil.data.toArray(item.images.phoneViewImage);
            for (var i = 0; i < item.images.length; i++) {
                item.images[i] = appUtil.data.formatImagePath(item.images[i].uRI);
            }
        }
        if (item.phoneCondition && item.phoneCondition == "preowned" && appName != 'vmu') {
            item.description += " This phone is <a href='#!/support/faq/phones-devices/certified-pre-owned-phones/'>certified pre-owned</a>."
        }
        if (item.phoneVideos) {
            appUtil.data.rename(item, "phoneVideos", "videos");
            item.videos = appUtil.data.toArray(item.videos.phoneVideo);
            for (var i = 0; i < item.videos.length; i++) {
                item.videos[i] = appUtil.data.formatImagePath(item.videos[i].uRI);
            }
        }
        if (item.filters) {
            item.filters = appUtil.data.toArray(item.filters.feature);
        }
        if (item.genieDetailImage) {
            item.genieDetailImage = appUtil.data.formatImagePath(item.genieDetailImage.uRI);
        }
        appUtil.data.rename(item, "phoneVariants", "variants");
        item.variants = appUtil.data.toArray(item.variants.phoneVariant);
        if (!item.features) {
            item.features = {};
        }
        if (!item.accessories) {
            item.accessories = {};
        }
        var tmpMemoryOptions = {};
        item.colorOptions = [];
        item.colorValues = {};
        item.memoryOptions = [];
        item.variantMap = {};
        var selectedVariant = null;
        var selectedWeight = -1;
        item.genieImage = null;
        var minPrice = item.variants[0].price;
        var maxPrice = item.variants[0].price;
        var minMSRP = -1;
        var maxMSRP = -1;
        if (item.variants[0].msrp) {
            minMSRP = item.variants[0].msrp;
            maxMSRP = item.variants[0].msrp;
        }
        for (j = 0; j < item.variants.length; j++) {
            var variant = item.variants[j];
            appUtil.data.rename(variant, "shopGridPicture", "gridImage");
            if (variant.gridImage) {
                variant.gridImage = appUtil.data.formatImagePath(variant.gridImage.uRI);
                if (!item.genieImage) {
                    item.genieImage = variant.gridImage;
                }
            }
            if (variant.heroImage) {
                variant.heroImage.uRI = appUtil.data.formatImagePath(variant.heroImage.uRI);
            }
            if (variant.colorVariant && variant.gradientColor) {
                appUtil.data.rename(variant, "colorVariant", "color");
                variant.color = appUtil.data.capitalize(variant.color);
                if (variant.color.toLowerCase() == "rosegold") {
                    variant.color = "Rose Gold";
                }
                item.colorValues[variant.color] = variant.gradientColor;
            }
            if (variant.memoryVariant) {
                appUtil.data.rename(variant, "memoryVariant", "memory");                
                tmpMemoryOptions[variant.memory] = variant.memory;
            }
            var tmpWeight = 0;
            if (variant.discount) {
                item.hasDiscount = true;
                tmpWeight += 1;
            }
            if (variant.isDefault) {
                tmpWeight += 2;
            }
            if (variant.parent) {
                item.defaultSku = variant.sku;
                if (variant.gridImage) {
                    item.genieImage = variant.gridImage;
                } else if (variant.heroImage) {
                    item.genieImage = variant.heroImage;
                }
            }
            if (variant.inventory == "in-stock") {
                tmpWeight += 4;
            }
            if (selectedWeight < tmpWeight) {
                selectedWeight = tmpWeight;
                item.selectedVariant = variant;
            }
            if (item.phoneDataFeature) {  
                if(Array.isArray(item.phoneDataFeature)){
                    for (var i = 0; i < item.phoneDataFeature.length; i++) {
                        if (item.phoneDataFeature[i] == '3G') {
                            item.is3g = true;
                        }
                        if (item.phoneDataFeature[i] == '4G' || item.phoneDataFeature[i] == '4GLTE') {
                            item.is4g = true;
                        }
                    }
                }
                else{
                    if (item.phoneDataFeature == '3G') {
                            item.is3g = true;
                        }
                    if (item.phoneDataFeature == '4G' || item.phoneDataFeature == '4GLTE') {
                        item.is4g = true;
                    }
                }             
                        
            }
            if (variant.inventory == "out-of-stock" || variant.inventory == "end-of-life") {
                variant.noMore = true;
                variant.cartLabel = "Out of Stock";
            } else if (variant.inventory == "pre-order") {
                variant.cartLabel = "Pre Order";
            } else if (variant.inventory == "back-order") {
                variant.cartLabel = "Back Order";
            } else {
                if (variant.hiddenPrice && appName == 'spp') {
                    variant.cartLabel = "Add to Cart to see price";
                } else {
                    variant.cartLabel = "Add to Cart";
                }
            }

            if (minPrice > variant.price) {
                minPrice = variant.price;
            }
            if (maxPrice < variant.price) {
                maxPrice = variant.price;
            }
            if (variant.msrp && minMSRP > variant.msrp) {
                minMSRP = variant.msrp;
            }
            if (variant.msrp && maxMSRP < variant.msrp) {
                maxMSRP = variant.msrp;
            }
        }
        if (minMSRP > -1) {
            item.minMSRP = minMSRP;
            item.maxMSRP = maxMSRP;
        }
        if (item.selectedVariant) {
            item.selectedVariant.minPrice = minPrice;
            item.selectedVariant.maxPrice = maxPrice;
            if (!item.selectedVariant.color) {
                item.selectedVariant.color = "";
            }
            if (!item.selectedVariant.memory) {
                item.selectedVariant.memory = "";
            }
            item.selectedColor = item.selectedVariant.color;
            item.selectedMemory = item.selectedVariant.memory;
        }

        item.colorOptions = Object.keys(item.colorValues).sort();
        item.memoryOptions = Object.keys(tmpMemoryOptions).sort(function(a, b) {
            return parseInt(a) > parseInt(b);
        });
        item.getHash = function(c, m, t) {
            if (!c) {
                c = this.selectedColor;
            }
            if (!m) {
                m = this.selectedMemory;
            }
            if (c) {
                c += m ? "," + m + "/" : "/";
            } else if (m) {
                c = m + "/";
            }
            if (c) {
                c = "/" + c;
            } else {
                c = "/";
            }
            return pathMap._phoneDetails._hash + this.id + "/" + t + c;
        };
        item.setHash = function(c, m) {
            var h = this.getHash(c, m, phoneController.selectedTab)
            if (this.prevColor != this.selectedVariant.color) {
                this.prevColor = this.selectedVariant.color;
                $('#carousel-phone-details').carousel(0);
            }
            appUtil.net.setUrlHash(h);
        };
        item.updateSelectedVariant = function() {
            for (var i = 0; i < this.variants.length; i++) {
                if (!this.variants[i].memory) {
                    this.variants[i].memory = "";
                }
                if (!this.variants[i].color) {
                    this.variants[i].color = "";
                }
                if (this.selectedColor == this.variants[i].color && (this.selectedMemory == this.variants[i].memory)) {
                    this.selectedVariant = this.variants[i];
                    pathMap._phoneDetails._sendAnalysisData(this);
                    break;
                }
            }
        };
        item.getVariantByOptions = function(c, m) {
            for (var i = 0; i < this.variants.length; i++) {
                if (c == this.variants[i].color && (m == this.variants[i].memory)) {
                    return this.variants[i];
                }
            }
        };
        if (item.compareImages) {
            var cImages = appUtil.data.toArray(item.compareImages.compareImage);
            for (var i = 0; i < cImages.length; i++) {
                item[cImages[i].fileName + "_img"] = appUtil.data.formatImagePath(cImages[i].uRI);
            }
            delete item.compareImages;
        }
        item.promoIndex = -1;
        if (item.promotions) {
            item.promotions = appUtil.data.toArray(item.promotions.promotion);
            for (var i = 0; i < item.promotions.length; i++) {
                if (item.promoIndex == -1) {
                    item.promoIndex = i;
                } else if (!item.promotions[i].isDefault) {
                    item.promoIndex = i;
                }
                if (item.promotions[i].message) {
                    item.message = item.promotions[i].message;
                    if (item.promotions[i].isDefault) {
                        this.list.message = item.promotions[i].message;
                    }
                }
                if (item.promotions[i].legal) {
                    var found = false;
                    for (var j = 0; j < this.list.legals.length; j++) {
                        if (item.promotions[i].legal == this.list.legals[j]) {
                            found = true;
                            continue;
                        }
                    }
                    if (!found) {
                        this.list.legals.push(item.promotions[i].legal);
                    }
                }
                if (item.promotions[i].banners) {
                    item.promotions[i].banners = appUtil.data.toArray(item.promotions[i].banners);
                    for (var j = 0; j < item.promotions[i].banners.length; j++) {
                        item.promotions[i].banners[j].imageUrl = appUtil.data.formatImagePath(item.promotions[i].banners[j].imageUrl);
                    }
                }
                if (item.promotions[i].tagImage && item.promotions[i].tagImage.uRI) {
                    if (item.genieBanner) {
                        if (!item.promotions[i].isDefault) {
                            item.genieBanner = appUtil.data.formatImagePath(item.promotions[i].tagImage.uRI);
                        }
                    } else {
                        item.genieBanner = appUtil.data.formatImagePath(item.promotions[i].tagImage.uRI);
                    }
                }
            }
        }
    };
    this.scrubFeaturesData = function(item) {
        var data = item.features;
        appUtil.data.rename(data, "generalFeatures", "general");
        appUtil.data.simplifyObject(data.general);
        for (var i = 0; data.general && i < data.general.length; i++) {
            var d = data.general[i];
            if (d.ule) {
                d.ule.average *= 10;
                for (var n = 0; n < d.ule.items.entry.length; n++) {
                    var v = d.ule.items.entry[n];
                    d.ule[v.key] = v.value * 10;
                    if (d.ule[v.key] < 10) {
                        d.ule[v.key] = "0" + d.ule[v.key];
                    }
                }
                delete d.ule.items;
                break;
            }

        }
        if (!data.general) {
            $http.get(appUtil.net.formatDataUrl("/primary/shop_get_secondary_features", "?phone-name=" + item.id)).success(function(d) {
                var o = $(d).find(".container_default_msdp");
                if (appUtil.isLocal()) {
                    var src = o.find('img')[0].attributes.src.value;
                    o.find('img')[0].attributes.src.value = 'http://vm7-msdp.test.virginmobileusa.com/' + src;
                }
                data.secondary_features = o[0].innerHTML;
                setTimeout("windowResizeObjMap.mapImgFun();", 1000);
            });
        }
        appUtil.data.rename(data, "specialFeatures", "special");
        appUtil.data.simplifyObject(data.special);
        appUtil.data.rename(data, "technicalFeatures", "technical");
        var group = appUtil.data.toArray(data.technical.group);
        var os = data.technical.os.$;
        var processor = data.technical.processor ? appUtil.ui.htmlToText(data.technical.processor.$) : null;
        var memory = data.technical.memory ? appUtil.ui.htmlToText(data.technical.memory.$) : null;
        var tmpTechnical = { os: os, processor: processor, memory: memory };
        for (var i = 0; i < group.length; i++) {
            var tmpSpecs = tmpTechnical[group[i]["@id"]] = {};
            var specs = appUtil.data.toArray(group[i].specs.spec);
            if ("whats_included" == group[i]["@id"]) {
                tmpTechnical.whats_included = appUtil.data.simplifyObject(specs);
            } else {
                for (var n = 0; n < specs.length; n++) {
                    tmpSpecs[specs[n]["@type"]] = appUtil.ui.htmlToText(specs[n].$);
                }
            }
        }
        data.technical = tmpTechnical;
        if (data.specificationImage) {
            data.specificationImage = appUtil.data.formatImagePath(data.specificationImage.uRI.$);
        }
        if (data.iiboxImage) {
            data.iiboxImage = appUtil.data.formatImagePath(data.iiboxImage.uRI.$);
        }
    };
    this.scrubAccessoriesData = function(data) {
        data.accessory = appUtil.data.toArray(data.accessory);
        appUtil.data.simplifyObject(data);
        for (var i = 0; i < data.accessory.length; i++) {
            data.accessory[i].accessoryInd = true;
            if (data.accessory[i].inventory == "out-of-stock" || data.accessory[i].inventory == "end-of-life") {
                data.accessory[i].noMore = true;
                data.accessory[i].cartLabel = "Out of Stock";
            } else if (data.accessory[i].inventory == "pre-order") {
                data.accessory[i].cartLabel = "Pre Order";
            } else if (data.accessory[i].inventory == "back-order") {
                data.accessory[i].cartLabel = "Back Order";
            } else {
                if (data.accessory[i].hiddenPrice && appName == 'spp') {
                    data.accessory[i].cartLabel = "Add to Cart to see price";
                } else {
                    data.accessory[i].cartLabel = "Add to Cart";
                }
            }
            if (data.accessory[i].shopImage && data.accessory[i].shopImage.uRI) {
                data.accessory[i].shopImage.uRI = appUtil.data.formatImagePath(data.accessory[i].shopImage.uRI);
            }
            if (data.accessory[i].checkoutIMage && data.accessory[i].checkoutIMage.uRI) {
                data.accessory[i].checkoutIMage.uRI = appUtil.data.formatImagePath(data.accessory[i].checkoutIMage.uRI);
            }
            appUtil.data.rename(data.accessory[i], "checkoutIMage", "checkoutImage");
            if (data.accessory[i].promotions) {
                data.accessory[i].promotions = appUtil.data.toArray(data.accessory[i].promotions.promotion);
            }
        }
    }
    this.attachAccessories = function(item) {
        if (jQuery.isEmptyObject(item.accessories)) {
            appUtil.net.getData($http, "shop_get_accessory_list", "?phoneId=" + item.id).success(function(data) {
                if (data.responses.response[0].accessoryResponse) {
                    if (jQuery.isEmptyObject(item.accessories)) {
                        angular.extend(item.accessories, data.responses.response[0].accessoryResponse.accessories);
                    }
                    phoneController.scrubAccessoriesData(item.accessories);
                } else {
                    item.accessories = { "accessory": [], "type": "" };
                };
            });
        }
    }
    this.attachFeatures = function(item) {
        if (jQuery.isEmptyObject(item.features)) {
            appUtil.net.getData($http, "shop_get_features_by_external_url", "?phoneId=" + item.id).success(function(data) {
                if (data.responses.response[0].getFeaturesResponse) {
                    if (jQuery.isEmptyObject(item.features)) {
                        angular.extend(item.features, data.responses.response[0].getFeaturesResponse.phoneFeatures);
                        phoneController.scrubFeaturesData(item);
                    }
                }
            });
        }
    }
    this.attachPhoneData = function(obj, id, bAttachFeatures, fun) {
        if (jQuery.isEmptyObject(obj)) {
            var extraHeaders = {};
            if (phoneController.IB && Boolean(phoneController.ibToken)) {
                extraHeaders["ibToken"] = phoneController.ibToken;
            }
            appUtil.net.getData($http, "shop_get_phone_by_external_url", "?phoneId=" + id, extraHeaders).success(function(data) {
                if (jQuery.isEmptyObject(obj)) {
                    try {
                        //            a=a;
                        var tmpObj = appUtil.data.simplifyObject(data.responses.response[0].getPhoneDetailsResponse.phoneDetails.phoneDetail);
                        if (angular.isArray(tmpObj)) {
                            for (var i = 0; i < tmpObj.length; i++) {
                                if (angular.isArray(tmpObj[i].phoneVariants.phoneVariant)) {
                                    tmpObj = tmpObj[i];
                                    break;
                                }
                            }
                            if (angular.isArray(tmpObj)) {
                                tmpObj = tmpObj[0];
                            }
                        }
                        phoneController.planType = '';
                        if (!!tmpObj.planType && tmpObj.planType.planTypeId == 'beyond-talk') {
                            phoneController.planType = 'UNLIMITED';
                        } else if (!!tmpObj.planType && tmpObj.planType.planTypeId == 'paylo') {
                            phoneController.planType = 'PAYLO';
                        }
                        angular.extend(obj, tmpObj);
                        phoneController.scrubPhoneData(obj);
                        appUtil.ui.refreshContent();
                        obj.id = id;
                        if (bAttachFeatures) {
                            phoneController.attachFeatures(obj);
                            phoneController.attachAccessories(obj);
                        }
                        appUtil.exeFun(fun);
                        var tabs = ["features", "plans", "reviews", "write_reviews", "accessories"];
                        if (tabs.indexOf(phoneController.selectedTab) < 0 && phoneController.selectedTab) {
                            appUtil.net.setUrlHash(pathMap._phoneDetails._hash + id + "/" + tabs[0] + "/");
                            return;
                        }
                    } catch (e) {
                        if (tmpObj) {
                            pathMap._pageNotFound = true;
                            appUtil.ui.refreshContent();
                        } else {
                            appUtil.$scope.pageController.buildContext(location.hash.substring(3));
                        }
                        return;
                    }
                }
                phoneController.details.updateMeta();
            });
        }
    }
    this.scrubCompareFeaturesData = function(data) {
        var group = appUtil.data.toArray(data.technicalFeatures.group);
        var tmpTechnical = [];
        for (var i = 0; i < group.length; i++) {
            if (group[i]["@id"] == "dimensions" || group[i]["@id"] == "battery") {
                var tmpSpecs = tmpTechnical[group[i]["@id"]] = [];
                var specs = appUtil.data.toArray(group[i].specs.spec);
                for (var j = 0; j < specs.length; j++) {
                    tmpTechnical.push({ "title": appUtil.ui.htmlToText(specs[j].$), "type": appUtil.ui.htmlToText(specs[j]["@type"]) });
                }
            }
        }
        data.technicalFeatures = tmpTechnical;
        appUtil.data.simplifyObject(data);
        for (var i = 0; i < data.generalFeatures.length; i++) {
            if (data.generalFeatures[i].type == "android") data.generalFeatures[i].type = "os";
            else if (data.generalFeatures[i].type == "mobilehotspot") data.generalFeatures[i].type = "hotspot";
            else if (data.generalFeatures[i].type == "flash-player") data.generalFeatures[i].type = "flashPlayer";
            else if (data.generalFeatures[i].type == "music-player") data.generalFeatures[i].type = "musicPlayer";
            else if (data.generalFeatures[i].type == "web-browser") data.generalFeatures[i].type = "webBrowser";
            else if (data.generalFeatures[i].type == "qwerty-keyboard") data.generalFeatures[i].type = "qwertyKeyboard";
            else if (data.generalFeatures[i].type == "4g") data.generalFeatures[i].type = "fourG";
            else if (data.generalFeatures[i].type == "3g") data.generalFeatures[i].type = "threeG";
            else if (data.generalFeatures[i].type == "touchscreen") data.generalFeatures[i].type = "display";
        }
    }
    this.attachCompareFeatures = function(item) {
        appUtil.net.getData($http, "shop_phone_compare", "?phones=" + item.id).success(function(data) {
            data = data.responses.response[0].comparePhoneResponse.comparePhoneList.comparePhone;
            phoneController.scrubCompareFeaturesData(data);
            phoneController.compareItems.fillData(item, data);
        });
    }
    this.details = {
        data: {},
        planPage: null,
        plans: {},
        updateMeta: function() {
            if (this.data && this.data.meta) {
                appUtil.ui.setMetaInfo("title", this.data.meta.title);
                appUtil.ui.setMetaInfo("description", this.data.meta.description);
                appUtil.ui.setMetaInfo("keywords", this.data.meta.keywords);
            }
            pathMap._phoneDetails._extendTitle = this.data.name;
            if (this.data.phoneCondition && this.data.phoneCondition == "preowned") {
                pathMap._phoneDetails._extendTitle += " Pre-owned";
            }

        },
        updateVariantByOptions: function(c, m) {
            var tmp = this.data.getVariantByOptions(c, m);
            if (tmp) {
                this.data.selectedColor = c;
                this.data.selectedMemory = m;
                this.data.selectedVariant = tmp;
                appUtil.ui.refreshContent(true);
                phoneController.details.updateMeta();
                return true;
            } else {
                this.data.setHash();
                return false;
            }
        },
        init: function(id, tab, exopt, exId) {
            pathMap._phoneDetails._titleAlt = $sce.trustAsHtml('<span class="titleAlt phonedetail"><i class="glyphicon glyphicon glyphicon-chevron-left"></i><a href="' + pathMap._phones._hash + '|Nav:Shop:AllPhones">Return to shop phones</a></span>');
            phoneController.selectedTab = tab;
            phoneController.exId = exId;
            var c = "";
            var m = "";
            if (exopt) {
                exopt = exopt.replace(/%20/g, " ");
                c = exopt.split(",")[0];
                m = exopt.split(",")[1];
            } else {
                exId = exopt;
            }
            if (id == this.data.id) {
                if (this.updateVariantByOptions(c, m)) {
                    pathMap._phoneDetails._sendAnalysisData(this.data, tab);
                    pathMap._phoneDetails._setMetas();
                }
            } else {
                this.data = {};
                tab = tab == "reviews" ? tab : "features";
                phoneController.attachPhoneData(this.data, id, true, "appUtil.$scope.phoneController.details.afterAttachExec('" + c + "','" + m + "','" + tab + "')");
            }
        },
        getAllPlans: function() {
            var monthlyPlanName = phoneController.details.data.promotions[0].monthlyPlan ? phoneController.details.data.promotions[0].monthlyPlan : '';
            var dailyPlanName = phoneController.details.data.promotions[0].dailyPlan ? phoneController.details.data.promotions[0].dailyPlan : '';
            if (monthlyPlanName == "BasicMonthlyPlan") {
                monthlyPlanName = "monthlyplan";
            }
            phoneController.details.getPlans(monthlyPlanName, 'monthlyplan');
            //phoneController.details.getPlans(dailyPlanName, 'dailyplan');
            return;
        },
        getPlans: function(planName, planKey) {
            $http.get(appUtil.net.formatDataUrl("/primary/shop_get_promotion_plan_page_content", "?plan-name=" + planName)).success(function(data) {
                try {
                    var planHtml = $sce.trustAsHtml($("<div " + data.split("<body ")[1].split("</body>")[0] + "</div>").find("#page_shop_get_promotion_plan_page_content").html());
                    var planTitle = "";
                    if (planKey == 'monthlyplan') {
                        planTitle = "Monthly Plans";
                    } else if (planKey == 'dailyplan') {
                        planTitle = "Daily Plans";
                    }
                    phoneController.details.plans[planKey] = { name: planTitle, html: planHtml };
                    return;
                } catch (e) {}
            }).error(function() {
                appUtil.ui.alert(appMsg[appName].sysError);
                appUtil.ui.autoHideWaiting();
            });
            return;
        },
        getPlansSPP: function() {
            var planName = phoneController.details.data.promotions[0].monthlyPlan ? phoneController.details.data.promotions[0].monthlyPlan : '';
            $http.get(appUtil.net.formatDataUrl("/primary/shop_get_promotion_plan_page_content", "?plan-name=" + planName)).success(function(data) {
                try {
                    //phoneController.details.planPage = $sce.trustAsHtml($("<div "+data.split("<body ")[1].split("</body>")[0]+"</div>").find(".tab-pane").html());
                    phoneController.details.planPage = $sce.trustAsHtml($("<div " + data.split("<body ")[1].split("</body>")[0] + "</div>").find("#page_shop_get_promotion_plan_page_content").html());
                    return;
                } catch (e) {}
            }).error(function() {
                appUtil.ui.alert(appMsg[appName].sysError);
                appUtil.ui.autoHideWaiting();
            });
            return;

        },
        afterAttachExec: function(c, m, tab) {
            if (appName == "bst") {
                phoneController.details.getAllPlans();
            } else if (appName == "spp") {
                phoneController.details.getPlansSPP();
            }
            pathMap._phoneDetails._setMetas();
            phoneController.details.updateVariantByOptions(c, m) ? pathMap._phoneDetails._sendAnalysisData(phoneController.details.data, tab) : '';
        },
        zoomImages: function(id, detail_hash) {
            /*
            setTimeout(function(){
              location.hash = detail_hash;
            }, 1500); 
            */
            this.showImages(id);
        },
        showImages: function(id) {

            if (this.data.id == id) {
                $(function() {
                    $("#phoneImageDialog").modal();
                });
                appUtil.ui.refreshContent(true);
            } else {
                this.data = {};
                phoneController.attachPhoneData(this.data, id, false, "appUtil.$scope.phoneController.details.showImages('" + id + "')");
            }
        },
        getDisplayTitle: function(item) {
            return item.name + " " + item.selectedColor + " " + item.selectedMemory;
        }
    };
    this.showReview = function(sku) {
        appUtil.$scope.stopAutoRefreshContent = true;
        var hash = location.hash.replace("/reviews/", "/write_reviews/");
        $BV.configure("global", { submissionContainerUrl: hash });
        $BV.ui("rr", "show_reviews", { productId: sku });
        setTimeout("appUtil.$scope.phoneController.setWriteReviewBtnEvent('" + sku + "')", 100);
    }
    this.setWriteReviewBtnEvent = function(sku) {
        var o = $("[name='BV_TrackingTag_QuickTakeSummary_WriteReview_" + sku + "']");
        if (o.length == 0) {
            o = $("[name='BV_TrackingTag_Review_Display_WriteReview']");
            if (o.length == 0) {
                setTimeout("appUtil.$scope.phoneController.setWriteReviewBtnEvent('" + sku + "')", 100);
                return;
            }
        }
        var hash = location.hash.replace("/reviews/", "/write_reviews/");
        o[0].href = hash;
        o.mousedown(
            function() {
                location.hash = hash;
                return false;
            }
        );
        o.click(function(e) {
            e.preventDefault();
        });
        if (!this.bindReviewEvent) {
            this.bindReviewEvent = true;
            $("#phoneController").on("mousedown", ".BVDIFooter.BVDI_COFooterBody a,.BVDIHeader.BVDI_COHeader a", function() {
                var d = $(this).attr("data-bvjsref");
                if (d) {
                    d = d.split("/review/");
                    if (d.length > 1) {
                        d = d[1].split("/")[0];
                        var hash = location.hash.replace("/reviews/", "/write_reviews/") + d + "/";
                        location.hash = hash;
                    }
                }
            });
            $("#phoneController").on("click", ".BVDIFooter.BVDI_COFooterBody a,.BVDIHeader.BVDI_COHeader a", function(e) {
                var d = $(this).attr("data-bvjsref");
                if (d) {
                    d = d.split("/review/");
                    if (d.length > 1) {
                        e.preventDefault();
                    }
                }
            });
        }
    }
    this.showReviewWriter = function(sku) {
        var rId = this.exId;
        appUtil.$scope.stopAutoRefreshContent = true;
        $BV.configure("global", {
            facebookXdChannelUrl: "//www.alencorp.com/facebook_xd_receiver.asp"
        });
        if (rId) {
            $BV.ui("submission_container", { userToken: "", submissionContainerBvParameters: "?bvdisplaycode=8149-en_us&bvappcode=rr&bvproductid=" + sku + "&bvpage=%2F%2Fboost.ugc.bazaarvoice.com%2F8149-en_us%2F" + sku + "%2Freview%2F" + rId + "%2Fsubmitcomment.htm%3Fformat%3Dembedded%26sessionparams%3D__BVSESSIONPARAMS__%26return%3D&bvcontenttype=REVIEW_COMMENT_SUBMISSION&bvauthenticateuser=false" })
        } else {
            $BV.ui("submission_container", { userToken: "", submissionContainerBvParameters: "?bvappcode=rr&bvproductid=" + sku + "&bvpage=%2F%2Fboost.ugc.bazaarvoice.com%2F8149-en_us%2F" + sku + "%2Fsubmitreview.htm%3Fformat%3Dembedded%26campaignid%3DBV_RATING_SUMMARY%26sessionparams%3D__BVSESSIONPARAMS__%26return%3D&bvcontenttype=REVIEW_SUBMISSION&bvauthenticateuser=false&bvdisplaycode=8149-en_us" })
        }
    }
    this.compareItems = {
        COMPARE_SIZE: 4,
        featureItems: [{
                key: "os",
                title: "Phone Type/OS",
                description: "Your phone's operating system is what makes it work. A more advanced OS lets your phone do more - so you can make it work for you."
            }, {
                key: "display",
                title: "Display",
                description: "Backlit display phones use keys and buttons, while touchscreens let you swipe and tap your way around."
            }, {
                key: "camera",
                title: "Camera",
                description: "Take pictures with your phone. Look for higher megapixels (MP) for better image quality."
            }, {
                key: "wifi",
                title: "Wi-Fi",
                description: "A Wi-Fi-enabled phone lets you link to the same high-speed wireless networks used by laptops and tablets."
            }, {
                key: "fourG",
                title: "Sprint 4G Network",
                description: "Connect superfast on the Sprint 4G Network available in select cities."
            }, {
                key: "hotspot",
                /*        description:"Turn your phone into a Wi-Fi® hotspot. Add-ons start at $3/day."*/
                title: "Hotspot Capable"
            }, {
                key: "qwertyKeyboard",
                title: "QWERTY Keyboard",
                description: "A QWERTY keyboard looks just like your computer keyboard, but in miniature. With a 'physical' keyboard, you're actually pushing real buttons. With the 'virtual' version, it's a touchscreen."
            }, {
                key: "webBrowser",
                title: "Web Browser",
                description: "HTML browsers display websites the same way they'd appear on a computer screen. WAP browsers show those same web pages but in a more phone-friendly version."
            },
            /*
            {
              key:"flashPlayer",
              booleanType:true,
              title:"Flash Player",
              description:"Some of the coolest videos and online content only work on phones with a Flash Player."
            },
            */
            {
                key: "email",
                title: "Email",
                description: "Most phones let you send and receive emails - but some make it super easy by linking directly to your email for one-click access."
            }, {
                key: "video",
                title: "Video",
                description: "Turn your phone into a mini video camera with the touch of a button."
            }, {
                key: "musicPlayer",
                title: "Music Player",
                description: "Play your music right from your phone. Create playlists and listen through earbuds or even stereo Bluetooth, depending on the phone."
            }, {
                key: "gps",
                title: "Navigation Services",
                description: "GPS navigation gives you interactive maps and turn-by-turn instructions to keep you on the right path."
            }, {
                key: "speakerphone",
                title: "Speakerphone",
                description: "Put your phone on speaker and free up your hands for other things. Some phones even have voice recognition, so you can make calls just by telling it who to dial."
            }, {
                key: "memory",
                title: "Memory",
                description: "Portion of memory occupied by existing content."
            }, {
                key: "processor",
                title: "Processor",
                description: "A good processor makes your phone work fast. A great one lets it work even faster and play cool games and videos."
            }, {
                key: "calendar",
                title: "Calendar",
                description: "A calendar right on your phone helps you track appointments, tasks and important dates."
            }, {
                key: "voicemail",
                title: "Visual Voicemail",
                description: "Get a text version of your voice messages sent right to your phone's screen. This saves you from listening to calls you'd rather skip or replaying messages to hear key details."
            }, {
                key: "threeG",
                title: "Nationwide Sprint <br/>3G Network",
                description: "3G makes your phone work lightning-fast with high-speed wireless service. Because who has time to wait around?"
            }, {
                key: "bluetooth",
                title: "Bluetooth",
                description: "Bluetooth lets you take calls and listen to music without wires, share files over the air and more."
            }
        ],
        ItemData: {
            display: { value: "N/A" },
            touchscreen: { value: "N/A" },
            camera: { value: "N/A" },
            webBrowser: { value: "N/A" },
            processor: { value: "N/A" },
            fourG: { value: "N/A" }
        },
        data: { version: $scope.app.config.DATA_VERSION, items: [] },
        setItemAttr: function(item, data) {
            if (data.type) {
                var t = data.type;
            } else if (data["@type"]) {
                var t = data["@type"];
            } else {
                return;
            }
            item[t] = data.title;
        },
        fillData: function(item, data) {
            if (data.generalFeatures) {
                data.generalFeatures = appUtil.data.toArray(data.generalFeatures);
                for (var i = 0; i < data.generalFeatures.length; i++) {
                    var d = data.generalFeatures[i];
                    if (!d.type) {
                        continue;
                    }
                    this.setItemAttr(item, d);
                }
            }
            if (data.technicalFeatures) {
                data.technicalFeatures = appUtil.data.toArray(data.technicalFeatures);
                for (var i = 0; i < data.technicalFeatures.length; i++) {
                    var d = data.technicalFeatures[i];
                    if (!d.type) {
                        continue;
                    }
                    this.setItemAttr(item, d);
                }
            }
            this.save()
        },
        init: function() {
            var data = appUtil.data.retrieveFromLocal("phones_compare");
            var indexBluetooth = -1;
            if (appName == 'spp') {
                for (var i = 0; i < this.featureItems.length; i++) {
                    if (this.featureItems[i].key == "bluetooth") {
                        indexBluetooth = i;
                    }
                }
                if (indexBluetooth > -1) {
                    this.featureItems.splice(indexBluetooth, 1);
                }
            }
            if (this.data) {
                while (this.data.items.length > 0) {
                    this.data.items.splice(0, 1);
                }
            } else {
                this.data = { items: [], version: $scope.app.config.DATA_VERSION };
            }
            if (data && data.version == $scope.app.config.DATA_VERSION) {
                for (var i = 0; i < data.items.length; i++) {
                    this.data.items.push(data.items[i]);
                }
            }
            this.save();
        },
        getTitle: function() {
            var title = "";
            for (var i = 0; i < this.data.items.length; i++) {
                title += this.data.items[i].getPhone().name;
                if (this.data.items.length > 1) {
                    if (i < this.data.items.length - 2) {
                        title += ", ";
                    } else if (i == this.data.items.length - 2) {
                        title += " and ";
                    }
                }
            }
            if (!title) {
                title = "No comparing item";
            } else {
                title = "Compare the " + title;
            }
            return title;
        },
        getValueById: function(idx, attrs) {
            var item = this.data.items[idx];
            if (!item) {
                return null;
            }
            var value = null;
            attrs = appUtil.data.toArray(attrs);
            if (item) {
                for (var i = 0; i < attrs.length; i++) {
                    try {
                        if (attrs[i].indexOf("[") >= 0) {
                            value = eval("item" + attrs[i]);
                        } else {
                            value = eval("item." + attrs[i]);
                        }
                    } catch (e) {
                        value = undefined;
                    }
                }
                if (value == undefined || value == false || (value + "").toLowerCase() == "no" || (value + "").toLowerCase() == "n/a") {
                    if (["displayBrand", "review"].indexOf(attrs[0]) < 0) {
                        value = "Not Available";
                    } else if (["review"].indexOf(attrs[0]) >= 0) {
                        value = 0;
                    } else {
                        value = "";
                    }
                } else if ((value + "").toLowerCase() == "yes") {
                    value = true;
                }
            }
            if (value != true) {
                value = $("<div>" + value + "</div>").text();
            }
            return value;
        },
        addItem: function(item) {
            if (this.isInclude(item)) {
                return;
            }
            if (this.hasSpace()) {
                if (!item.compareFeatures) {
                    item.compareFeatures = {};
                    var d = item.compareFeatures;
                    d.id = item.id;
                    d.sku = item.selectedVariant.sku;
                    d.brand = item.brand;
                    d.displayBrand = item.displayBrand;
                    d.name = item.name;
                    d.price = item.selectedVariant.price;
                    if (item.compare_thumb_img) {
                        d.compare_thumb_img = item.compare_thumb_img;
                    } else {
                        d.compare_thumb_img = item.selectedVariant.gridImage;
                    }
                    if (item.compare_thumb_img) {
                        d.compare_img = item.compare_img;
                    } else {
                        d.compare_img = item.selectedVariant.gridImage;
                    }

                    d.rate = item.rate;
                    d.review = item.review;

                    phoneController.attachCompareFeatures(d);
                }
                this.data.items.push(item.compareFeatures);
                this.save();
            } else {
                $scope.showMessage("You can only compare up to " + this.COMPARE_SIZE + " items", "warning");
                var chks = $("#phoneListArea").find("input[type='checkbox']");
                for (var i = 0; i < chks.length; i++) {
                    var chk = $("#phoneListArea").find("input[type='checkbox']")[i];
                    txt = ($(chk).parent().text()).trim();
                    if ($(chk).prop('checked') && txt != "Remove") {
                        $(chk).prop('checked', false);
                    }
                }
            }
        },
        removeItem: function(idx) {
            this.data.items.splice(idx, 1);
            this.save();
        },
        clean: function() {
            while (this.data.items.length > 0) {
                this.data.items.splice(0, 1);
            }
            this.save();
        },
        handleItem: function(item) {
            if (this.isInclude(item)) {
                var idx = $.map(this.data.items, function(obj, id) {
                    if (item.id == obj.id) {
                        return id;
                    }
                });
                this.removeItem(idx);
            } else {
                this.addItem(item);
            }
        },
        save: function() {
            appUtil.data.storeToLocal("phones_compare", this.data);
            pathMap._phoneCompare._generateAnalysisData(this.data.items);
        },
        hasSpace: function() {
            return this.data.items.length < this.COMPARE_SIZE;
        },
        isInclude: function(item) {
            for (var i = 0; i < this.data.items.length; i++) {
                if (this.data.items[i].id == item.id) {
                    return true;
                }
            }
            return false;
        }
    };
    this.compareItems.init();
    $scope.pushAutoRefresh("$scope.phoneController.compareItems.init()");
    this.loadList = function(parameter, fun) {
        var extraHeaders = {};
        if (!phoneController.list.filter.urlHash.needLoadData()) {
            appUtil.ui.refreshContent(true);
            return;
        }

        if (phoneController.status == "init") {
            return;
        }
        phoneController.status = "init";
        if (phoneController.IB && Boolean(phoneController.ibToken)) {
            extraHeaders["ibToken"] = phoneController.ibToken;
        }
        appUtil.net.getData($http, "shop_get_phones_by_brand_id", null, extraHeaders).success(function(data, status, headers, config) {
            if (data.responses.response[0].getListPhonesResponse && data.responses.response[0].getListPhonesResponse.phones) {
                phoneController.status = "ready";
                phoneController.list.data = data.responses.response[0].getListPhonesResponse.phones.phone;
                phoneController.list.data = appUtil.data.toArray(phoneController.list.data);
                for (var i = 0; i < phoneController.list.data.length; i++) {
                    phoneController.scrubPhoneData(phoneController.list.data[i]);
                }
                if (parameter != null) {
                    phoneController.list.filter.init(phoneController.list.data, parameter.replace("@", ""));
                }
                if (ibToken) {
                    appUtil.$scope.app.userFirstName = data.responses.response[0].getListPhonesResponse.userFirstName.$;
                    appUtil.$scope.app.userLastName = data.responses.response[0].getListPhonesResponse.userLastName.$;
                    appUtil.$scope.app.mdn = appUtil.data.formatMDN(data.responses.response[0].getListPhonesResponse.mdn.$);
                    appUtil.$scope.app.lastInstallmentDueDate = data.responses.response[0].getListPhonesResponse.lastInstallmentDueDate.$.substring(0, 10);
                    appUtil.$scope.checkoutController.data.contractInfo.mdnNumber = appUtil.$scope.app.mdn;
                }
                appUtil.exeFun(fun);
                appUtil.ui.refreshContent();
            }
        });
    }
    this.hasAndroid = false;
    this.hasIphone = false;
    this.filterMenu = function() {
        var extraHeaders = {};
        if (Boolean(phoneController.ibToken)) {
            extraHeader["ibToken"] = phoneController.ibToken;
        }
        appUtil.net.getData($http, "shop_get_phones_by_brand_id", null, extraHeaders).success(function(data) {

            data = data.responses.response[0].getListPhonesResponse.phones.phone;
            data = appUtil.data.toArray(data);
            for (var i = 0; i < data.length; i++) {
                phoneController.scrubPhoneData(data[i]);
                phoneController.hasAndroid = phoneController.hasAndroid || data[i].type == "Android";
                phoneController.hasIphone = phoneController.hasIphone || data[i].type == "iPhone";
            }
        });
    };
    if (appName == "spp") {
        this.filterMenu();
    }
    this.hotspots = {
        page: 0,
        list: [],
        device: {},
        deviceImgData: {},
        features: {},
        scrubFeaturesData: function(data) {
            var group = appUtil.data.toArray(data.technicalFeatures.group);
            var tmpTech = {};
            for (var i = 0; i < group.length; i++) {
                var specs = appUtil.data.toArray(group[i].specs.spec),
                    fieldName = group[i]["@id"];
                tmpTech[fieldName] = {};
                if (fieldName == 'whats_included') {
                    tmpTech[fieldName] = specs;
                } else {
                    for (var n = 0; n < specs.length; n++) {
                        tmpTech[fieldName][specs[n]["@type"]] = appUtil.ui.htmlToText(specs[n].$);
                    }
                }
            }
      phoneController.hotspots.device.technicalFeatures=tmpTech;
      appUtil.data.simplifyObject(data);
      phoneController.hotspots.device.generalFeatures=appUtil.data.toArray(data.generalFeatures);
      phoneController.hotspots.device.os=data.technicalFeatures.os;
      phoneController.hotspots.device.processor=data.technicalFeatures.processor;
      phoneController.hotspots.device.memory=data.technicalFeatures.memory;
      phoneController.hotspots.device.specialFeatures=appUtil.data.toArray(data.specialFeatures);
      if(data.specificationImage){
        phoneController.hotspots.device.specificationImage=appUtil.data.formatImagePath(data.specificationImage.uRI);
      }
      if(data.iiboxImage){
          phoneController.hotspots.device.iiboxImage=appUtil.data.formatImagePath(data.iiboxImage.uRI);
      }
    },
    getFeatures:function(){
      var pData="?deviceType=mbb&deviceId="+phoneController.hotspots.device.sku;
      appUtil.net.getData($http,"shop_get_device_features",pData).success(function(data){
        if(data.responses.response[0].deviceFeatureResponse && data.responses.response[0].deviceFeatureResponse.deviceFeature){
          phoneController.hotspots.scrubFeaturesData(data.responses.response[0].deviceFeatureResponse.deviceFeature);
        }
      });
    },
    scrubDetailsData:function(data){
      appUtil.data.simplifyObject(data);
      appUtil.data.rename(phoneController.hotspots.device,"manufacturerName","brand");
      if(data.ReviewStatistics){
        phoneController.hotspots.device.rate=data.ReviewStatistics.AverageOverallRating;
        phoneController.hotspots.device.review=data.ReviewStatistics.TotalReviewCount;
        delete data.ReviewStatistics;
      }
      phoneController.hotspots.device.id=data.id;
      phoneController.hotspots.device.isRedVentures=data.isRedVentures;
      phoneController.hotspots.device.disclaimerMini=data.disclaimerMini;
      phoneController.hotspots.device.extendedDescription=data.extendedDescription;
      phoneController.hotspots.device.meta=data.meta;
      if($.isArray(data.deviceViewImages.deviceViewImage)){
        phoneController.hotspots.device.images=data.deviceViewImages.deviceViewImage;
      }
      else{
        phoneController.hotspots.device.images = [data.deviceViewImages.deviceViewImage];        
      }
      
      phoneController.hotspots.device.checkoutImage={uRI:appUtil.data.formatImagePath(data.checkoutImage.uRI)};
      for(var i=0;i<phoneController.hotspots.device.images.length;i++){
        phoneController.hotspots.device.images[i].uRI=appUtil.data.formatImagePath(phoneController.hotspots.device.images[i].uRI);
      }
    },
    getDetails:function(index){
      pathMap._hotspotDetails._titleAlt=$sce.trustAsHtml('<span class="titleAlt phonedetail"><i class="glyphicon glyphicon glyphicon-chevron-left"></i><a href="'+pathMap._shop._hash+'hotspots">Return to hotspots shop</a></span>');
      phoneController.hotspots.device=phoneController.hotspots.list[index];


            // if(id==this.data.id){
            //   // if(this.updateVariantByOptions(c,m)){
            //   //   pathMap._phoneDetails._sendAnalysisData(this.data,tab);
            //   // }
            // }
            // else{
            //$http.get('http://vm4-msdp.test.boostmobile.com/primary/shop_get_promotion_plan_page_content?plan-name=monthlyplan').success(function(data){
            $http.get(appUtil.net.formatDataUrl("/primary/shop_get_promotion_plan_page_content", "?plan-name=mbbplan")).success(function(data) {
                try {
                    phoneController.hotspots.device.mbbPlan = $sce.trustAsHtml($("<div " + data.split("<body ")[1].split("</body>")[0] + "</div>").find("#page_shop_get_promotion_plan_page_content").html());
                    return;
                } catch (e) {}
            }).error(function() {
                appUtil.ui.alert(appMsg[appName].sysError);
                appUtil.ui.autoHideWaiting();
            });
            // }

            var pData="?deviceType=mbb&deviceId="+phoneController.hotspots.device.sku;
      appUtil.net.getData($http,"shop_get_device",pData).success(function(data){
        if(data.responses.response[0].deviceDetailsResponse && data.responses.response[0].deviceDetailsResponse.deviceDetails && data.responses.response[0].deviceDetailsResponse.deviceDetails.deviceDetail){
          phoneController.hotspots.scrubDetailsData(data.responses.response[0].deviceDetailsResponse.deviceDetails.deviceDetail);
          phoneController.hotspots.getFeatures();
        }
        pathMap._hotspotDetails._title=phoneController.hotspots.device.name;
        appUtil.ui.setMetaInfo("title",pathMap._hotspotDetails._title);

        if (phoneController.hotspots.device.meta)
          appUtil.ui.setMetaInfo("title",phoneController.hotspots.device.meta.title);
          appUtil.ui.setMetaInfo("description",phoneController.hotspots.device.meta.description);
          appUtil.ui.setMetaInfo("keywords",phoneController.hotspots.device.meta.keywords);
      });
    },
    scrubListData:function(data){
      appUtil.data.simplifyObject(appUtil.data.toArray(data));
      phoneController.hotspots.list=appUtil.data.toArray(data);
      for(var i=0;i<phoneController.hotspots.list.length;i++){
        if(phoneController.hotspots.list[i].heroImage){
          phoneController.hotspots.list[i].heroImage.uRI=appUtil.data.formatImagePath(phoneController.hotspots.list[i].heroImage.uRI);
        }
        if(phoneController.hotspots.list[i].checkoutImage){
          phoneController.hotspots.list[i].checkoutImage.uRI=appUtil.data.formatImagePath(phoneController.hotspots.list[i].checkoutImage.uRI);
        }
        if(phoneController.hotspots.list[i].inventory=="out-of-stock" || phoneController.hotspots.list[i].inventory=="end-of-life"){
          phoneController.hotspots.list[i].noMore=true;
          phoneController.hotspots.list[i].cartLabel="Out of Stock";
        }else if(phoneController.hotspots.list[i].inventory=="pre-order"){
          phoneController.hotspots.list[i].cartLabel="Pre Order";
        }else if(phoneController.hotspots.list[i].inventory=="back-order"){
          phoneController.hotspots.list[i].cartLabel="Back Order";
        }else{
          if(phoneController.hotspots.list[i].hiddenPrice && appName=='spp'){
            phoneController.hotspots.list[i].cartLabel="Add to Cart to see price";
          }else{
            phoneController.hotspots.list[i].cartLabel="Add to Cart";
          }
        }
      }
    },
    init:function(id,tab,exId){

            phoneController.selectedTab = tab;
            $scope.$apply()
            if (phoneController.hotspots.device.id != id) {
                phoneController.exId = exId;
                phoneController.hotspots.device.id = id;
                var pData = "?deviceType=mbb";
                appUtil.net.getData($http, "shop_get_devices", pData).success(function(data, id) {
                    if (data.responses.response[0].deviceResponse.mbbList) {
                        phoneController.hotspots.scrubListData(data.responses.response[0].deviceResponse.mbbList.mbb);
                        if (!phoneController.exId) {
                            if (phoneController.hotspots.list.length == 1) {
                                phoneController.hotspots.page = 2;
                                phoneController.hotspots.getDetails(0);
                            } else if (phoneController.hotspots.list.length > 1) {
                                var curPath = phoneController.hotspots.device.id;
                                var index = -1;
                                for (var i = 0; i < phoneController.hotspots.list.length; i++) {
                                    if (phoneController.hotspots.list[i].externalUrl == curPath) {
                                        index = i;
                                    }
                                }
                                if (index >= 0) {
                                    phoneController.hotspots.page = 2;
                                    phoneController.hotspots.getDetails(index);
                                } else {
                                    phoneController.hotspots.page = 1;
                                }


                            } else {
                                // To be done later when there are more than a single hotpot device ...
                                phoneController.hotspots.page = 1;
                            }
                        } else {
                            var index;
                            for (var i = 0; i < phoneController.hotspots.list.length; i++) {
                                if (phoneController.hotspots.list[i].sku == phoneController.exId) {
                                    index = i;
                                    break;
                                }
                            }
                            if (index >= 0) {
                                phoneController.hotspots.page = 2;
                                phoneController.hotspots.getDetails(index);
                            }
                        }
                    }
                });
            }

        

},
    deviceSelected: function (index){
      var len = location.href.indexOf('!'),
          relativeUrl = location.href.substr(0, ++len),
          device = phoneController.hotspots.list[index],
          deviceName = device.name.toLowerCase().replace(/ /g, '-');
      appUtil.net.setUrlHash(pathMap._hotspotDetails._hash+deviceName);
    },
    isAvailable: function (index) {

      if (index != null){
        var device = phoneController.hotspots.list[index];
        return device.inventory == 'in-stock'
      } else
        return true;

    },
    getHash: function(f){
      return pathMap._phoneDetails._hash+this.id+"/"+t+c;
    },
    zoomImages: function (sku){

            if (phoneController.hotspots.deviceImgData && phoneController.hotspots.deviceImgData.sku == sku) {
                $(function() {
                    $("#hotspotsImageDialog").modal();
                });
                appUtil.ui.refreshContent(true);
            } else {
                phoneController.hotspots.attachHotspotsData(sku);
            }
        },
        attachHotspotsData: function(sku) {


            var pData="?deviceType=mbb&deviceId="+sku;
        appUtil.net.getData($http,"shop_get_device",pData).success(function(data){
          var response = data.responses.response[0].deviceDetailsResponse;
          if (response.description.$ == 'SUCCESS'){
            phoneController.hotspots.deviceImgData = appUtil.data.simplifyObject(response.deviceDetails.deviceDetail);
            for (var i = 0; i < phoneController.hotspots.deviceImgData.deviceViewImages.deviceViewImage.length; i++) {
              phoneController.hotspots.deviceImgData.deviceViewImages.deviceViewImage[i].uRI = appUtil.data.formatImagePath(phoneController.hotspots.deviceImgData.deviceViewImages.deviceViewImage[i].uRI);
            }
            $(function() {
              $("#hotspotsImageDialog").modal();
            });
            appUtil.ui.refreshContent(true);
          }
            });

        }
    };
    this.setContext = function(key, parameter) {
        parameter = parameter.split("/");
        if (key == pathMap._phones._formatedHash) {
            this.loadList(parameter[0]);
        } else if (key == pathMap._phoneDetails._formatedHash) {
            if (parameter.length > 3) {
                phoneController.details.init(parameter[0], parameter[1], parameter[2], parameter[3]);
            } else {
                phoneController.details.init(parameter[0], parameter[1], parameter[2]);
            }
        } else if (key == pathMap._phoneCompare._formatedHash) {
            phoneController.compareItems.init();
            appUtil.ui.refreshContent();
            $(function() {
                $('[data-toggle="tooltip"]').tooltip()
            })
            $('.sticker').affix({
                offset: {
                    top: $('.sticker').offset().top - 125
                }
            });
        } else if (key == pathMap._phoneAccessories._formatedHash) {
            this.loadList(parameter[0]);
        } else if (key == pathMap._accessoriesList._formatedHash) {
            phoneController.accList.init(parameter[0]);
        } else if (key == pathMap._phoneDeals._formatedHash) {
            phoneController.deals.init();
            appUtil.ui.refreshContent();
        } else if (key == pathMap._hotspots._formatedHash) {
            appUtil.net.setUrlHash(pathMap._hotspotDetails._hash + parameter[0]);
            phoneController.hotspots.init(parameter[0], parameter[1], parameter[2]);
            return;
        } else if (key == pathMap._hotspotDetails._formatedHash) {
            var tabs = ["features", "plans", "reviews", "write_reviews"];
            if (parameter.length < 2 || tabs.indexOf(parameter[1]) < 0) {
                appUtil.net.setUrlHash(pathMap._hotspotDetails._hash + parameter[0] + "/" + tabs[0] + "/");
                return;
            }
            phoneController.hotspots.init(parameter[0], parameter[1], parameter[2]);
        }
    };
    this.getRateStarClass = function(v) {
        if (!v) {
            v = 0;
        }
        var i = parseInt(v);
        var d = v - i >= 0.5 ? 5 : 0;
        var c = "star" + i + "point" + d;
        return c + " phoneRating";
        return appUtil.ui.trustAsHtml("<span class='" + c + " phoneRating'><span>" + v + "</span><span>/5</span></span>");
    };
    this.getDiscountClass = function(data) {
        var discount = 0;
        var name = "";
        try {
            if (data.selectedVariant.inventory == "end-of-life") {
                return name;
            }
            discount = parseInt(data.selectedVariant.discount * 100) / 100;
            if (data.promotions) {
                for (var i = 0; i < data.promotions.length; i++) {
                    if (data.promotions[i].webOnly) {
                        name = "onSale webOnly";
                    }
                }
            }
            if (discount) {
                //discount_name=(""+discount).replace("\.","_");
                discount_name = Math.ceil(discount);
                name = " onSale " + "discount_" + discount_name;
            }

        } catch (e) {}
        return name;
    }
    this.ib = {
        curItem: {},
        setCurItem: function(item, event) {
            this.curItem = item;
            var wWidth = $(window).width();
            $("#ibModal").show();
            var mLeft = event.pageX;
            var mTop = event.pageY;
            var w = $("#ibModal")[0].clientWidth;
            var h = $("#ibModal")[0].clientHeight;
            var o = $("#ibModal").parent().offset();
            var pLeft = mLeft - o.left;
            if ((mLeft + w) > wWidth) {
                pLeft = mLeft - o.left - w;
            }
            var pTop = mTop - h - o.top;
            if (o.left >= wWidth / 2) {
                pLeft = 0 - w / 2;
            } else {
                pLeft = w / 2;
            }

            if (pLeft > (wWidth - w) / 2) {
                pLeft = (wWidth - w) / 2
            }

            if (wWidth <= 468) {
                w = wWidth;
                pLeft = 'auto';
            }


            $("#ibModal").css({
                top: pTop,
                left: pLeft,
                width: w
            });
        },
        closeIbModal: function(item, event) {
            if (event.type == 'click') {
                $("#ibModal").hide();
            }
        }
    }
    this.genie = {
        data: [],
        pages: null,
        sort: "featured",
        filtered: "featured",
        lastSort: null,
        filterOptions: {
            featured: "item",
            newArrivals: "oldDate<item.date",
            topRate: "item.rate>=4",
            preowned: "item.phoneCondition=='preowned'",
            bestSell: "item.bestSellerCounter"
        },
        loadGenieList: function() {
            if (this.pages == null) {
                this.pages = [];
                appUtil.net.getData($http, "shop_phone_get_genie").success(function(data) {
                    if (data.responses.response[0].phoneGenieListResponse && data.responses.response[0].phoneGenieListResponse.phone) {
                        phoneController.genie.data = appUtil.data.simplifyObject(appUtil.data.toArray(data.responses.response[0].phoneGenieListResponse.phone));
                        for (var i = 0; i < phoneController.genie.data.length; i++) {
                            phoneController.scrubPhoneData(phoneController.genie.data[i]);
                        }
                        if (appName == "spp") {
                            phoneController.genie.getSortPages();
                        } else {
                            phoneController.genie.buildFilterPages();
                            phoneController.genie.getFilterPages();
                        }
                    }
                });
            }
        },
        setCurItem: function(item, event) {
            this.curItem = item;
            var curFeatures = new Object();
            curFeatures.phoneCondition = item.phoneCondition;
            if (this.curItem.generalFeatures && this.curItem.generalFeatures.generalFeature) {
                var curGeneralFeatures = this.curItem.generalFeatures.generalFeature;
                $.each(curGeneralFeatures, function(index, feature) {
                    if (feature.type == 'android') {
                        curFeatures['os'] = feature.title;
                    } else if (feature.type == 'os') {
                        curFeatures[feature.type] = feature.title;
                    } else if (feature.type == '4g') {
                        curFeatures['g4'] = feature.title;
                    } else {
                        curFeatures[feature.type] = feature.title;
                    }
                });
            }

            curFeatures['class'] = ('genie3-modal-' + this.curItem.type.toLowerCase()).replace(/[^a-zA-Z0-9\-]/gi, '');
            this.curItem.curFeatures = curFeatures;
            appUtil.ui.openPopTip("#curGenie", event);
        },
        getSortPages: function() {
            if (this.lastSort == this.sort) {
                return this.pages;
            }
            this.lastSort = this.sort;
            phoneController.sortList(this.sort, this.data);
            var page = [];
            this.pages = [];
            for (var i = 0; i < this.data.length; i++) {
                if (i % 3 == 0) {
                    page = [];
                    this.pages.push(page);
                }
                page.push(this.data[i]);
            }
            return this.pages;
        },
        buildFilterPages: function() {
            this.filterMap = {};
            var oldDate = new Date(new Date() - 180 * 24 * 3600 * 1000);

            for (var k in this.filterOptions) {
                var data = [];
                var pages = [];
                this.filterMap[k] = { pages: pages, data: data };
                for (var i = 0; i < this.data.length; i++) {
                    var item = this.data[i];
                    if (!item.date) {
                        item.date = item.generalAvailabilityDate + "";
                        item.date = new Date(item.date.substring(0, 4) + "-" + item.date.substring(4, 6) + "-" + item.date.substring(6));
                    }
                    var code = eval(this.filterOptions[k]);
                    if (code) {
                        data.push(item);
                    }
                }
                for (var i = 0; i < data.length; i++) {
                    if (i % 3 == 0) {
                        page = [];
                        pages.push(page);
                    }
                    page.push(data[i]);
                }
            }
        },
        getFilterPages: function() {
            if (this.lastFilter == this.filtered) {
                return this.pages;
            }
            this.lastFilter = this.filtered;

            this.pages = this.filterMap[this.filtered].pages;
            this.data = this.filterMap[this.filtered].data;
        },
        showItem: function(item) {
            this.curItem = item;
            $("#genieDialog").modal();
        }
    }
    this.init = function() {
        if (appName == 'bst') {
            phoneController.shopPhoneBanner.img = "bst/img/banner-02.jpg";
            phoneController.shopPhoneBanner.url = pathMap._phones._hash;
        } else if (appName == 'spp') {
            phoneController.shopPhoneBanner.img = "spp/img/bannerShopPhones.png";
            phoneController.shopPhoneBanner.url = pathMap._plan._hash + "|Nav:Plans:AllPlans";
        } else if (appName == 'vmu') {
            phoneController.shopPhoneBanner.img = "vmu/img/banner/banner-more-time-to-pay.png";
            phoneController.shopPhoneBanner2.img = "vmu/img/banner/banner-live-without-borders.png";
        }
        if(appUtil.inDev()){
            ibToken = 'asdf';
        }
        if (ibToken) {
            phoneController.IB = true;
            phoneController.ibToken = ibToken; // remove this after debugging ... used in templates/phone/list.html
        }
        appUtil.log('ibToken-------->' + ibToken);
    };
    phoneController.showModal = function() {
        var newWin = window.open("https://www.securecheckout.billmelater.com/paycapture-content/fetch?hash=AU826TU8&content=/bmlweb/ppwpsiw.html&", "", "width=650, height=600");
        if (!newWin || newWin.closed || typeof newWin.closed == 'undefined')
            $window.location.href = 'https://www.securecheckout.billmelater.com/paycapture-content/fetch?hash=AU826TU8&content=/bmlweb/ppwpsiw.html&';
    };
    this.init();
}]);

appModule.filter('memoryFilter', function() {

  return function(input) {
      if(appName == 'vmu')
    return input.replace("GB", "");
      else return input;
  };
});

function changeLinkText(){
    if ($("a.fullfeatures").html().indexOf('Show') > -1)
        $("a.fullfeatures").html('Hide Full Features<b class="caret"></b>');
    else
        $("a.fullfeatures").html('Show Full Features<b class="caret"></b>');
}
