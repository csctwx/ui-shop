(function() {
    var checkoutModule = angular.module('checkout-directives', []);
    var directiveSetting = {
        moduleName: "checkout",
        items: "order_status,step0,step1,step4,item_list,delivery,contract_form,promo_form,billing_form,billing_form_ib,payment_form,agreement,summary,summary_info,$step2,promo_info,billing_info,payment_info,shipping_form,shipping_info,cancel,$step3,step3_in_error,other_info,container,legal"
    };
    appUtil.ui.buildModuleDirective(checkoutModule, directiveSetting);
})();

appModule.controller('checkoutController', ['$http', '$scope', 'AnalysisService', function($http, $scope, AnalysisService) {
    var checkoutController = this;
    this.step = 0;
    this.popBlacks = "";
    this.emjcdString = "";
    this.errorMsg = "Your Cart is empty";
    this.popShippingAddress = [];
    this.skuQuantityList = {};
    this.IB = false; // set by existing of ibToken cookie ... not use?  may remove later
    this.ibPayment = false; // indicates using Installment Billing payment on this device
    this.ibCart = false; // indicates cart contains an Installment Billing device
    this.dataOptions = {
        shipping: [],
        creditCardYear: [
            new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2, new Date().getFullYear() + 3, new Date().getFullYear() + 4, new Date().getFullYear() + 5, new Date().getFullYear() + 6, new Date().getFullYear() + 7, new Date().getFullYear() + 8, new Date().getFullYear() + 9
        ],
        paymentCardType: [
            { id: "cc1", name: "DISCOVER" },
            { id: "cc2", name: "MASTERCARD" },
            { id: "cc3", name: "VISA" },
            { id: "cc4", name: "AMEX" }
        ]
    };
    this.defaultShippingOption = null;
    this.data = {};
    this.changeStatus = {};
    this.orderStatus = {};
    this.initData = function() {
        if (ibToken) {
            checkoutController.IB = true;
            checkoutController.ibToken = ibToken;
        }
        this.data = {
            orderConfirmationNumber: "",
            error: false,
            errorText: "",
            accPromoCodes: {},
            rejPromoCodes: {},
            contractLanguage: "default",
            contractLink: "",
            loanNumber: "",
            signatureDisable: true,
            promoCode: {
                value: null,
                status: -1,
                /* -1: not apply, 0: valid, others: invalid*/
                message: null
            },
            orderCodes: [],
            orderStatus: {
                date: null,
                number: null,
                total: null,
                status: null,
                items: null,
                address: null
            },
            billingInfo: {
                firstName: null,
                lastName: null,
                address1: null,
                address2: null,
                city: null,
                zipCode: null,
                state: null,
                phoneNumber: null,
                email: null,
                validateEmail: null,
            },
            contractInfo: {
                firstName: null,
                lastName: null,
                address1: null,
                address2: null,
                city: null,
                zipCode: null,
                state: null,
                email: null,
                validateEmail: null,
                driversLicenseNumber: null,
                dob: null,
                mdnNumber: appUtil.$scope.app.mdn,
                ssn: null
            },
            shippingInfo: {
                firstName: null,
                lastName: null,
                address1: null,
                address2: null,
                city: null,
                zipCode: null,
                state: null,
                phoneNumber: null,
                email: null,
                validateEmail: null
            },
            shippingOption: null,
            paymentInfo: {
                CardType: "CREDIT",
                cardNumber: null,
                expirationMonth: null,
                expirationYear: null,
                securityCode: null,
                paymentCardType: null
            },
            equipments: [],
            equipmentError: false,
            agree: false,
            summary: {
                shipping: function() {
                    for (var i = 0; i < checkoutController.data.orderCodes.length; i++) {
                        if (checkoutController.data.shippingOption && (typeof checkoutController.data.orderCodes[i].promoShippingFee != "undefined") && checkoutController.data.orderCodes[i].promoShippingFee < checkoutController.data.shippingOption.shippingFee) {
                            return checkoutController.data.orderCodes[i].promoShippingFee;
                        }
                    }
                    if (checkoutController.data.shippingOption) {
                        return checkoutController.data.shippingOption.shippingFee;
                    }
                    return 0;
                },
                tax: function() {
                    var taxAmt = 0;
                    for (var i = 0; i < checkoutController.data.equipments.length; i++) {
                        var item = checkoutController.data.equipments[i];
                        if (item.tax && (item.tax != 0)) {
                            //tax+=item.equipmentTaxAmt*item.quantity;
                            taxAmt += Number(item.tax);
                        }
                    }
                    return taxAmt;
                },
                subtotal: function() {
                    var subtotal = 0;
                    if(checkoutController.data.equipments.length >= 0){
                        if (checkoutController.ibCart) {
                            if(typeof checkoutController.data.equipments[0] != "undefined" && ('downPaymentAmount' in checkoutController.data.equipments[0])){
                               subtotal = checkoutController.data.equipments[0].downPaymentAmount; // + checkoutController.data.equipments[0].ibEmi; 
                            }
                            else {
                                return subtotal;
                            }
                            
                        } else {
                            for (var i = 0; i < checkoutController.data.equipments.length; i++) {
                                var item = checkoutController.data.equipments[i];
                                if (item.quantity) {
                                    subtotal += item.modelPrice * item.quantity;
                                }
                            }
                        }
                    } 
                    return subtotal;
                },
                total: function() {
                    if (checkoutController.data.totalAmt) {
                        return Number(checkoutController.data.totalAmt);
                    } else {
                        return Number(this.shipping()) + Number(this.tax()) + Number(this.subtotal() - Number(checkoutController.data.promoCode.totalDiscount));
                    }
                }
            }
        };
        this.changeStatus = {};
        appUtil.data.initObjValue(this.data, this.changeStatus, "valueObj", "changed", false);
        if (this.defaultShippingOption) {
            this.data.shippingOption = this.defaultShippingOption;
        }
        this.data.shippingInfo = this.data.billingInfo;
		 //ADDED BY IBM FOR  IM3581019 Continue Shopping link 06-13-2016
        /*if(appUtil.isProd()) {
    		if(appName=="bst"){
                pathMap._phones._hash = "https://www.boostmobile.com/shop/phones/";
            }  
        }*/
		//END 	
    };
    this.scrubDeviceData = function(item) {
        appUtil.data.simplifyObject(item);
        appUtil.data.rename(item, "externalUrl", "id");
        appUtil.data.rename(item, "manufacturerName", "brand");
        if (item.phoneCondition && item.phoneCondition == "pre-owned") {
            item.condition = "Pre-Owned";
        } else {
            item.condition = "";
        }
        item.checkoutText = "";
        if (item.promotions) {
            item.promotions = appUtil.data.toArray(item.promotions.promotion);
            for (var i = 0; i < item.promotions.length; i++) {
                if (item.promotions[i].checkoutText) {
                    item.checkoutText = item.promotions[i].checkoutText;
                }
            }
        }
        item.checkoutImage = appUtil.data.formatImagePath(item.checkoutImage.uRI);
        if (item.deviceType == "phone") {
            appUtil.data.rename(item, "phoneName", "name");
            item.accessoryInd = false;
			//Modified by IBM-for Phone img link
			if(appName=="bst"){				
				item.myUrl = "https://www.boostmobile.com/shop/phones/"+item.id + "/features/";
			}else if (appName != "bst"){				
				item.myUrl = pathMap._phoneDetails._hash +item.id + "/features/";
			}
			//End here 			
          //  item.myUrl = pathMap._phoneDetails._hash + item.id + "/features/";
            item.ibPayment = checkoutController.ibPayment;
        } else if (item.deviceType == "mbb") {
            item.color = "";
            item.memory = "";
            item.checkoutText = "";
            item.condition = "";
            item.accessoryInd = false;
            item.myUrl = pathMap._hotspots._hash + item.id + "/features/";
            item.ibPayment = false;
        } else if (item.deviceType == "accessory") {
            appUtil.data.rename(item, "label", "name");
            item.id = "";
            item.brand = "";
            item.color = "";
            item.memory = "";
            item.checkoutText = "";
            item.condition = "";
            item.accessoryInd = true;
            item.myUr = "";
            item.ibPayment = false;
        }
        if (checkoutController.skuQuantityList[item.sku]) {
            item.quantity = checkoutController.skuQuantityList[item.sku];
            delete checkoutController.skuQuantityList[item.sku];
        } else {
            item.quantity = 0;
        }
    };
    this.addToCart = function() {
        if (pathMap._lastHash == '#!/shop/checkout/' && pathMap._formatedLocationHash.indexOf('addToCart') >= 0) {
            window.history.back();
            return;
        }
        var extraHeaders = {};
        if (checkoutController.IB && this.ibPayment) {
            var itemCount = 0;
            for (var sku in this.skuQuantityList) {
                itemCount += this.skuQuantityList[sku];
            }
            if (itemCount > 1) {
                $scope.showMessage("You cannot have more than 1 device in cart for Installment Billing.", "warning");
                return;
            }
            extraHeaders["ibToken"] = checkoutController.ibToken;
        }
        for (var sku in this.skuQuantityList) {
            appUtil.net.getData($http, "shop_get_device", "?deviceId=" + sku, extraHeaders).success(function(data) {
                if (data.responses.response[0].deviceDetailsResponse) {
                    if (data.responses.response[0].deviceDetailsResponse.deviceDetails) {
                        var item = data.responses.response[0].deviceDetailsResponse.deviceDetails.deviceDetail;
                        item.subscriberId = data.responses.response[0].deviceDetailsResponse.subscriberId;
                        checkoutController.scrubDeviceData(item);
                        if (item.quantity) {
                            if (item.ibPayment) {
                                if (!item.ibEligibilityInd) {
                                    $scope.showMessage("We're sorry, this device is not eligible for installment billing.", "error");
                                    return;
                                }
                            }
                            var verifyData = "?modelId=" + sku;
                            if (item.inventory == "in-stock") {
                                verifyData = verifyData + "&ispreorder=false";
                            } else if (item.inventory == "pre-order") {
                                verifyData = verifyData + "&ispreorder=true";
                            } else {
                                $scope.showMessage("We're sorry, this device is not available at this time.", "error");
                                return;
                            }
                            appUtil.net.getData($http, "shop_get_equipment_availability", verifyData)
                                .success(function(data, status, headers, config) {
                                    if (data.responses.response[0].equipmentAvailabilityResponse.status.$ == "0" &&
                                        ((data.responses.response[0].equipmentAvailabilityResponse.equipmentAvailability.availableForSaleIndicator.$ == "true") ||
                                            (checkoutController.data.equipments[0].inventory == "pre-order" && data.responses.response[0].equipmentAvailabilityResponse.equipmentAvailability.preOrderIndicator.$ == "true"))) {
                                        $scope.cartController.addDeviceToCart(item);
                                    } else {
                                        $scope.showMessage("We're sorry, this device is not available at this time.", "error");
                                    }
                                });
                        }
                    } else {
                        $scope.showMessage("We're sorry, this device is not available at this time.", "error");
                        return;
                    }
                }
            });
        }
    };
    this.verifyOrderAvailability = function() {
        checkoutController.data.equipmentError = false;
        for (var i = 0; i < this.data.equipments.length; i++) {
            var data = "?modelId=" + this.data.equipments[i].sku;
            if (this.data.equipments[i].inventory == "in-stock") {
                data = data + "&ispreorder=false";
            } else if (this.data.equipments[i].inventory == "pre-order") {
                data = data + "&ispreorder=true";
            } else { // out-of-stock || back-order || end-of-life
                checkoutController.data.equipments[i].errorMessage = "We're sorry, this device is not available at this time.";
                checkoutController.data.equipmentError = true;
                return;
            }
            appUtil.net.getData($http, "shop_get_equipment_availability", data)
                .success(function(data, status, headers, config) {
                    for (var j = 0; j < checkoutController.data.equipments.length; j++) {
                        if (checkoutController.data.equipments[j].sku == data.responses.response[0].equipmentAvailabilityResponse.modelId.$) {
                            if (data.responses.response[0].equipmentAvailabilityResponse.status.$ == "0" &&
                                ((data.responses.response[0].equipmentAvailabilityResponse.equipmentAvailability.availableForSaleIndicator.$ == "true") ||
                                    (checkoutController.data.equipments[j].inventory == "pre-order" && data.responses.response[0].equipmentAvailabilityResponse.equipmentAvailability.preOrderIndicator.$ == "true"))) {
                                checkoutController.data.equipments[j].errorMessage = "";
                                return;
                            } else {
                                checkoutController.data.equipments[j].errorMessage = "We're sorry, this device is not available at this time.";
                                checkoutController.data.equipmentError = true;
                            }
                        }
                    }
                });
        }
    }
    this.initTax = function() {
        for (var i = 0; i < checkoutController.data.equipments.length; i++) {
            var item = checkoutController.data.equipments[i];
            if (item.tax) {
                item.tax = 0;
            }
        }
    };
    this.initPaymentInfo = function() {
        this.data.paymentInfo = {
            CardType: "CREDIT",
            cardNumber: null,
            expirationMonth: null,
            expirationYear: null,
            securityCode: null,
            paymentCardType: null
        };
        appUtil.data.initObjValue(this.data.paymentInfo, this.changeStatus.paymentInfo, "valueObj", "changed", false);
    }


    this.initShipping = function() {
        appUtil.net.getData($http, "shop_get_shipping_by_brand_id").success(function(data) {
            if (data.responses.response[0].shippingListResponse && data.responses.response[0].shippingListResponse.shippingList) {
                data = appUtil.data.toArray(appUtil.data.simplifyObject(data.responses.response[0].shippingListResponse.shippingList.shipping));
                for (var i = 0; i < data.length; i++) {
                    appUtil.data.rename(data[i], "shippingMethod", "shippingOption");
                    appUtil.data.rename(data[i], "shippingTypeCode", "shippingType");
                    if (data[i].default) {
                        checkoutController.defaultShippingOption = data[i];
                        if (checkoutController.data && !appUtil.cusSto.getItem("sprintShop-shippingBilling")) {
                            checkoutController.data.shippingOption = data[i];
                        }
                    }
                    if (JSON.parse(appUtil.cusSto.getItem("sprintShop-shippingBilling"))) {
                        var shippingBilling = JSON.parse(appUtil.cusSto.getItem("sprintShop-shippingBilling"));
                        checkoutController.data.shippingOption = shippingBilling.shippingOption;
                    }
                }
                checkoutController.dataOptions.shipping = data;
            }
        });

    }
    this.cleanPromoStatus = function() {
        this.data.promoCode.status = -1;
        this.data.promoCode.message = "";
        this.data.promoCode.totalDiscountedPrice = 0;
        this.data.promoCode.totalDiscount = 0;
        this.data.accPromoCodes = {};
        this.data.rejPromoCodes = {};
        this.data.orderCodes = [];
        for (var i = 0; i < checkoutController.data.equipments.length; i++) {
            checkoutController.data.equipments[i].promoCodes = [];
            checkoutController.data.equipments[i].discountEligibleQuantity = 0;
            checkoutController.data.equipments[i].discountAmount = 0;
            checkoutController.data.equipments[i].discountTotal = 0;
        }
    }
    this.getAccPromoCodeKeys = function() {
        return Object.keys(checkoutController.data.accPromoCodes);
    }
    this.getRejPromoCodeKeys = function() {
        return Object.keys(checkoutController.data.rejPromoCodes);
    }
    this.getAllPromoCodeKeys = function() {
        return Object.keys(checkoutController.data.accPromoCodes).concat(Object.keys(checkoutController.data.rejPromoCodes));
    }
    this.applyPromoCode = function() {
        var data = {
            promoCodes: [],
            equipments: []
        };
        var pc = {};
        for (var i = 0; i < this.data.equipments.length; i++) {
            var d = {
                modelId: this.data.equipments[i].sku,
                modelPrice: this.data.equipments[i].modelPrice,
                quantity: this.data.equipments[i].quantity
            }
            data.equipments.push(d);
        }
        data.promoCodes = this.getAllPromoCodeKeys();
        data.promoCodes.push(checkoutController.data.promoCode.value);
        appUtil.net.postData($http, "shop_validate_promo_code_service", data).
        success(function(data, status, headers, config) {
            checkoutController.data.accPromoCodes = {};
            checkoutController.data.rejPromoCodes = {};
            if (data.status == 0) {
                for (var i = 0; i < data.equipments.length; i++) {
                    for (var j = 0; j < checkoutController.data.equipments.length; j++) {
                        if (checkoutController.data.equipments[j].sku == data.equipments[i].modelId) {
                            checkoutController.data.equipments[j].modelPrice = data.equipments[i].modelPrice;
                            checkoutController.data.equipments[j].subTotal = data.equipments[i].subTotal;
                            checkoutController.data.equipments[j].discountAmount = data.equipments[i].modelPrice - data.equipments[i].subTotal;
                            checkoutController.data.equipments[j].discountTotal = (data.equipments[i].quantity * data.equipments[i].modelPrice) - data.equipments[i].subTotal;
                            checkoutController.data.equipments[j].promoCodes = [];
                            if (data.equipments[i].promoCodes) {
                                for (var k = 0; k < data.equipments[i].promoCodes.length; k++) {
                                    checkoutController.data.equipments[j].promoCodes.push(data.equipments[i].promoCodes[k]);
                                    checkoutController.data.accPromoCodes[data.equipments[i].promoCodes[k].promoCode] = {
                                        "name": data.equipments[i].promoCodes[k].promotionName,
                                        "legal": data.equipments[i].promoCodes[k].promoLegalese,
                                        "quantity": data.equipments[i].promoCodes[k].eligibleQuantity,
                                        "amout": data.equipments[i].promoCodes[k].discountAmount
                                    }
                                }
                            }
                        }
                    }
                }
                if (data.orderCodes) {
                    for (var i = 0; i < data.orderCodes.length; i++) {
                        checkoutController.data.orderCodes.push(data.orderCodes[i]);
                        checkoutController.data.accPromoCodes[data.orderCodes[i].promoCode] = {
                            "name": data.orderCodes[i].promoName,
                            "legal": data.orderCodes[i].promoLegalese,
                            "shippingFee": data.orderCodes[i].promoShippingFee
                        }
                    }
                } else {
                    checkoutController.data.orderCodes = [];
                }
                if (data.rejectedPromoCodes) {
                    for (var i = 0; i < data.rejectedPromoCodes.length; i++) {
                        if (data.rejectedPromoCodes[i].failureCode != "E001") { // E001 is code not found so lets not include it in our list at all
                            checkoutController.data.rejPromoCodes[data.rejectedPromoCodes[i].promoCode] = {
                                "code": data.rejectedPromoCodes[i].failureCode,
                                "reason": data.rejectedPromoCodes[i].failureReason
                            }
                        }
                    }
                } else {
                    checkoutController.data.rejectedPromoCodes = [];
                }
                checkoutController.data.promoCode.status = data.status;
                checkoutController.data.promoCode.message = data.successMessage;
                checkoutController.data.promoCode.totalOriginalPrice = data.totalOriginalPrice;
                checkoutController.data.promoCode.totalDiscountedPrice = data.totalDiscountedPrice;
                checkoutController.data.promoCode.totalDiscount = data.totalOriginalPrice - data.totalDiscountedPrice;
                if (checkoutController.getAccPromoCodeKeys().length == 0) {
                    checkoutController.data.promoCode.status = 1;
                    checkoutController.data.promoCode.message = "The promo code you entered is invalid.  Please try again.";
                }
            } else {
                checkoutController.cleanPromoStatus();
                checkoutController.data.promoCode.message = "The promo code you entered is invalid. Please try again.";
            }
            $scope.cartController.save();

            var analysisData = {
                page: {
                    message: checkoutController.data.promoCode.message,
                },
                shop: {
                    cart: {
                        productList: pathMap._checkout._generateAnalysisProductList(checkoutController.data.equipments),
                        promoCodes: checkoutController.getAllPromoCodeKeys(),
                        promoCodeStatus: checkoutController.data.promoCode.status,
                        promoCodeDiscountAmt: checkoutController.data.promoCode.totalDiscount
                    }
                }
            }
            pathMap._checkout._generateAnalysisData(analysisData);
            analysisManager.sendWidgetData("applyPromoCode");
        }).
        error(function(data, status, headers, config) {
            checkoutController.cleanPromoStatus();
            checkoutController.data.promoCode.status = -1;
            checkoutController.data.promoCode.message = "The promo code you entered is invalid. Please try again.";
        });
    };
    this.copyShippingOptionData = function(data) {
        data.shippingInfo.shippingOption = this.data.shippingOption.shippingOption;
        data.shippingInfo.shippingType = this.data.shippingOption.shippingType;
        data.shippingInfo.shippingFee = this.data.shippingOption.shippingFee;

    };
    this.back = function() {
        history.back();
    };
    this.doContract = function() {
        if (!this.data.contractInfo.address2) {
            this.data.contractInfo.address2 = null;
        }
        checkoutController.data.billingInfo.email = this.data.contractInfo.email;
        checkoutController.data.billingInfo.validateEmail = this.data.contractInfo.email;
        checkoutController.data.billingInfo.phoneNumber = appUtil.data.unformatMDN(checkoutController.data.contractInfo.mdnNumber);
        
        checkoutController.data.shippingInfo.email = this.data.contractInfo.email;
        checkoutController.data.shippingInfo.validateEmail = this.data.contractInfo.email;
        checkoutController.data.shippingInfo.phoneNumber = appUtil.data.unformatMDN(checkoutController.data.contractInfo.mdnNumber);
        
        checkoutController.data.contractInfo.mdnNumber = appUtil.data.unformatMDN(checkoutController.data.contractInfo.mdnNumber);
        checkoutController.data.contractInfo.ssn = checkoutController.data.contractInfo.ssn ? appUtil.data.unformatMDN(checkoutController.data.contractInfo.ssn) : '';
        var data = {
            subscriberContractInfo: {
                firstName: checkoutController.data.contractInfo.firstName,
                lastName: checkoutController.data.contractInfo.lastName,
                address1: checkoutController.data.contractInfo.address1,
                address2: checkoutController.data.contractInfo.address2,
                city: checkoutController.data.contractInfo.city,
                zipCode: checkoutController.data.contractInfo.zipCode,
                state: checkoutController.data.contractInfo.state,
                phoneNumber: appUtil.data.unformatMDN(checkoutController.data.contractInfo.mdnNumber),
                email: checkoutController.data.contractInfo.email,
                driversLicenseNumber: checkoutController.data.contractInfo.driversLicenseNumber,
                dob: checkoutController.data.contractInfo.dob,
                mdn: appUtil.data.unformatMDN(checkoutController.data.contractInfo.mdnNumber),
                ssn: checkoutController.data.contractInfo.ssn
            }
        }
        this.checkConsumerCredit(data);   
    };

    this.doReviewOrder = function() {
        if (!this.data.billingInfo.address2) {
            this.data.billingInfo.address2 = null;
        }
        var data = {
            billingInfo: angular.copy(this.data.billingInfo),
            shippingInfo: angular.copy(this.data.shippingInfo),
            shippingOption: checkoutController.data.shippingOption,
            paymentInfo: this.data.paymentInfo,
            equipments: [],
            orderCodes: angular.copy(this.data.orderCodes), 
            contractInfo: angular.copy(this.data.contractInfo)           
        };
        this.copyShippingOptionData(data);
        delete data.billingInfo.validateEmail;
        delete data.shippingInfo.validateEmail;

        for (var i = 0; i < this.data.equipments.length; i++) {
            var d = {
                modelId: this.data.equipments[i].sku,
                modelPrice: this.data.equipments[i].modelPrice,
                orderLineId: i + 1,
                accessoryInd: this.data.equipments[i].accessoryInd,
                quantity: this.data.equipments[i].quantity,
                promoCodes: angular.copy(this.data.equipments[i].promoCodes)                
            }
            if(this.ibCart){
                d.loanInfo = {
                    loanNumber: this.data.loanNumber,
                    loanAmount: this.data.equipments[i].loanAmount,
                    loanDownPayment: this.data.equipments[i].downPaymentAmount,
                    installmentAmount: this.data.equipments[i].ibEmi,
                    lastInstallmentAmount: this.data.equipments[i].lastInstallmentAmount,
                    loanTerm: this.data.equipments[i].loanTerm
                };
            }

            data.equipments.push(d);
        }
        if (data.paymentInfo.paymentCardType == "PAYPAL") {

            appUtil.net.postData($http, "shop_get_paypal_token_service", { "amount": checkoutController.data.summary.total() }).success(function(paypalData) {
                if (paypalData.paypalToken && paypalData.description == "SUCCESS") {
                    appUtil.cusSto.setItem("sprintShop-paypalInfo", JSON.stringify(paypalData));
                    appUtil.cusSto.setItem("sprintShop-shippingBilling", JSON.stringify(data));
                    $('#loading').show();
                    var url = paypal.checkout.urlPrefix + paypalData.paypalToken;
                    paypal.checkout.startFlow(url);
                } else if (paypalData.description != "SUCCESS") {
                    checkoutController.data.errorText = paypalData.description;
                    checkoutController.data.error = true;
                    $scope.showMessage(checkoutController.data.errorText, "error");
                }
            });
        } else {            
            checkoutController.saveShippingBilling(data);
        }

    };
    this.clearError = function() {
        checkoutController.data.errorText = "";
        checkoutController.data.error = false;
    };

    this.restartCheckout = function(type) {
        checkoutController.data.errorText = "";
        checkoutController.data.error = false;
        checkoutController.data.totalAmt = 0;
        checkoutController.ibCart = false;
        for (var i = 0; i < checkoutController.data.equipments.length; i++) {
            if (checkoutController.data.equipments[i].ibPayment) {
                checkoutController.ibCart = true;
                console.log("==>restartCheckout() found IB device, setting ibCart to " + checkoutController.ibCart);
            }
        }
        checkoutController.initTax();
        var shippingBilling = JSON.parse(appUtil.cusSto.getItem("sprintShop-shippingBilling"));
        if (location.search && type != "EDIT") {
            var search = location.search.substring(1),
                params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/\?/g, '","').replace(/&/g, '","').replace(/=/g, '":"') + '"}'),
                paypalInfo = JSON.parse(appUtil.cusSto.getItem("sprintShop-paypalInfo"));
            if (paypalInfo && params.token == paypalInfo.paypalToken) {
                if (!params.PayerID) {
                    checkoutController.step = 1;
                    if (shippingBilling)
                        checkoutController.data.billingInfo = shippingBilling.billingInfo;
                } else {
                    shippingBilling.paypalToken = params.token;
                    shippingBilling.transactionId = paypalInfo.transactionId;
                    checkoutController.data.billingInfo = shippingBilling.billingInfo;
                    checkoutController.data.shippingInfo = shippingBilling.shippingInfo;
                    checkoutController.data.shippingOption = shippingBilling.shippingOption;
                    checkoutController.data.paymentCardType = 'PAYPAL';
                    checkoutController.saveShippingBilling(shippingBilling);
                }
            }
        } else {
            if (checkoutController.ibCart) {
                checkoutController.step = 0;
            } else {
                checkoutController.step = 1;
            }
            if (shippingBilling)
                checkoutController.data.billingInfo = shippingBilling.billingInfo;
        }
        checkoutController.save();

    };
    this.doComplete = function() {
        var data = {
            billingInfo: angular.copy(this.data.billingInfo),
            shippingInfo: angular.copy(this.data.shippingInfo),
            paymentInfo: this.data.paymentInfo,
            equipments: [],
            orderCodes: angular.copy(this.data.orderCodes),
            transactionId: this.data.transactionId,
            orderId: this.data.orderId
        };
        if(this.ibCart){
            data.subscriberId = this.data.equipments[0].subscriberId.toString();
            data.subscriberContractInfo = angular.copy(this.data.contractInfo);
        }
        this.copyShippingOptionData(data);
        delete data.billingInfo.validateEmail;
        delete data.shippingInfo.validateEmail;

        for (var i = 0; i < this.data.equipments.length; i++) {
            var d = {
                orderLineId: this.data.equipments[i].orderLineId,
                modelId: this.data.equipments[i].sku,
                modelPrice: this.data.equipments[i].modelPrice,
                tax: this.data.equipments[i].tax,
                taxTransactionId: this.data.equipments[i].taxTransactionId,
                invoiceDate: this.data.equipments[i].invoiceDate,
                accessoryInd: this.data.equipments[i].accessoryInd,
                quantity: this.data.equipments[i].quantity,
                subTotalAmt: this.data.equipments[i].subTotalAmt,
                isPreOrder: this.data.equipments[i].isPreOrder,
                promoCodes: angular.copy(this.data.equipments[i].promoCodes)
            }
            if(this.ibCart){
                d.loanInfo = {
                    loanNumber: this.data.loanNumber,
                    loanAmount: this.data.equipments[i].loanAmount,
                    loanDownPayment: this.data.equipments[i].downPaymentAmount,
                    installmentAmount: this.data.equipments[i].ibEmi,
                    lastInstallmentAmount: this.data.equipments[i].lastInstallmentAmount,
                    loanTerm: this.data.equipments[i].loanTerm,
                    stampTaxAmount: this.data.stampTaxAmount,
                    loanFirstInstallmentDueDate: this.data.loanFirstInstallmentDueDate,
                    loanLastInstallmentDueDate: this.data.loanLastInstallmentDueDate,
                };
            }
            if (this.data.equipments[i].discountAmount) {
                d.promoEligibleQuantity = this.data.equipments[i].eligibleQuantity;
                d.promoAmount = this.data.equipments[i].discountAmount;
            }
            data.equipments.push(d);
        }
        if (checkoutController.data.paymentCardType === 'PAYPAL') {
            delete data.paymentInfo;
            data.paypalInfo = {};
            data.paypalInfo.paypalToken = JSON.parse(appUtil.cusSto.getItem("sprintShop-paypalInfo")).paypalToken;
            data.transactionId = JSON.parse(appUtil.cusSto.getItem("sprintShop-paypalInfo")).transactionId;
        }

    appUtil.net.postData($http,"shop_complete_purchase_service",data).
      success(function(data,status,headers,config){
        checkoutController.step=3;                
        if(data.status==0){
              checkoutController.data.errorText="";
              checkoutController.data.error=false;
              checkoutController.finalData=angular.copy(checkoutController.data);
              checkoutController.finalData.confirmationNumber=data.fastOrderKey;
              checkoutController.orderComplete=data.orderComplete;
              checkoutController.finalData.subtotal=checkoutController.data.summary.subtotal();
              checkoutController.finalData.shipping=checkoutController.data.summary.shipping();
              checkoutController.finalData.tax=checkoutController.data.summary.tax();
              checkoutController.finalData.total=checkoutController.data.summary.total();
                var analysisData = {
                    page: {
                        name: "Confirmation",
                        messages: data.description,
                        interaction: {
                            pageEvent: 'transactionComplete',
                            transactionName: 'checkout'

                        }
                    },
                    shop: {
                        cart: {
                            productList: pathMap._checkout._generateAnalysisProductList(checkoutController.data.equipments)
                        },
                        order: {
                            purchase: true,
                            orderId: checkoutController.finalData.confirmationNumber,
                            salesTax: checkoutController.data.summary.tax(),
                            shippingCost: checkoutController.data.shippingOption.shippingFee,
                            shippingMethod: checkoutController.data.shippingOption.label,
                            stateCd: checkoutController.data.billingInfo.state,
                            zipCd: checkoutController.data.billingInfo.zipCode,
                        }
                    }
                };
                if (checkoutController.IB && checkoutController.ibCart) {
                    analysisData.shop.cart.cartStatus = ['ib_dvc_in_cart'];
                    analysisData.shop.order.shippingCd = checkoutController.data.shippingOption.shippingType;
                    delete analysisData.shop.order.shippingMethod;
                }
                checkoutController.emjcdString = "https://www.emjcd.com/tags/c?containerTagId=10033";
                for (var i = 0; i < checkoutController.finalData.equipments.length; i++) {
                    checkoutController.emjcdString += "&ITEM" + (i + 1) + "=" + checkoutController.finalData.equipments[i].sku;
                    checkoutController.emjcdString += "&AMT" + (i + 1) + "=" + checkoutController.finalData.equipments[i].modelPrice;
                    checkoutController.emjcdString += "&QTY" + (i + 1) + "=" + checkoutController.finalData.equipments[i].quantity;
                }
                checkoutController.emjcdString += "&CID=1533898";
                checkoutController.emjcdString += "&OID=" + checkoutController.finalData.confirmationNumber;
                checkoutController.emjcdString += "&TYPE=378585";
                checkoutController.emjcdString += "&CURRENCY=USD";
                if (checkoutController.data.promoCode.status == 0) {
                    checkoutController.emjcdString += "&DISCOUNT=" + checkoutController.data.promoCode.discount;
                }
                if (checkoutController.data.promoCode.status == 0) {
                    analysisData.shop.cart.promoCodes = checkoutController.getAllPromoCodeKeys();
                    analysisData.shop.cart.promoCodeDiscountAmt = checkoutController.data.promoCode.totalDiscount;
                }
                pathMap._checkout._generateAnalysisData(analysisData);
                  localStorage.clear();
                  $scope.cartController.clean();
                  checkoutController.popBlacks="";
                }else{
                  // setting default error message until server backend sends us a better one
                  //checkoutController.data.errorText=data.description;
                  checkoutController.data.errorText = appErrorCheckout3;
                checkoutController.data.error = true;
                $scope.showMessage(checkoutController.data.errorText, "error");
                var analysisData = {
                    page: {
                        name: "Error",
                        messages: {
                            message: checkoutController.data.errorText
                        }
                    }
                };
                if (data.errorCode) {
                    analysisData.page.messages.errorCode = data.errorCode;
                }
                pathMap._checkout._generateAnalysisData(analysisData);
            }
            analysisManager.sendData();
            window.scrollTo(0, 0);
        }).
        error(function(data, status, headers, config) {
            checkoutController.data.errorText = appErrorCheckout3;

            checkoutController.data.error = true;
            $scope.showMessage(checkoutController.data.errorText, "error");

            var analysisData = {
                page: {
                    name: "Error",
                    messages: {
                        message: checkoutController.data.errorText
                    }
                }
            };
            pathMap._checkout._generateAnalysisData(analysisData);
            analysisManager.sendData();
        });
    };

    this.save = function() {
        $scope.cartController.save();
        checkoutController.cleanPromoStatus();
    };
    this.incrementQuantity = function(item) {
        item.quantity++;
        this.save();
    };
    this.decrementQuantity = function(item) {
        item.quantity--;
        this.save();
    };
    this.removeItem = function(data) {
        $scope.cartController.removeItem(data);
        checkoutController.cleanPromoStatus();
        checkoutController.verifyOrderAvailability();
    };
    this.cancelOrder = function() {
        $scope.cartController.clean();
        analysisManager.sendData("_checkout");
        $scope.showMessage("Your order has been cancelled.", "info");
    };
    this.copyBillingInfoToShippingInfo = function() {
        this.data.shippingInfo.firstName = this.data.billingInfo.firstName;
        this.data.shippingInfo.lastName = this.data.billingInfo.lastName;
        this.data.shippingInfo.address1 = this.data.billingInfo.address1;
        this.data.shippingInfo.address2 = this.data.billingInfo.address2;
        this.data.shippingInfo.city = this.data.billingInfo.city;
        this.data.shippingInfo.zipCode = this.data.billingInfo.zipCode;
        this.data.shippingInfo.state = this.data.billingInfo.state;
        this.data.shippingInfo.phoneNumber = this.data.billingInfo.phoneNumber;
        this.data.shippingInfo.email = this.data.billingInfo.email;
        this.data.shippingInfo.validateEmail = this.data.billingInfo.validateEmail;
        appUtil.data.initObjValue(this.data, this.changeStatus, "valueObj", "changed", true);
    };
    this.switchSynBillingShippingInfo = function() {
        if (this.data.shippingInfo == this.data.billingInfo) {
            this.data.shippingInfo = angular.copy(this.data.shippingInfo);
        } else {
            this.data.shippingInfo = this.data.billingInfo;
        }
    }
    this.checkBlackZipcode = function(v) {
        var bBlack = v && (angular.isArray($scope.app.config["zipcodeBlackList"]) ? $scope.app.config["zipcodeBlackList"].indexOf(v) >= 0 : false);
        if(bBlack){
          if(this.popBlacks.indexOf(v)>=0){
            return;
          }
          this.popBlacks+=","+v;
          appUtil.ui.alert({
            title:"We are sorry!",
            description:"This product is not available in your selected area.",
            links:[{
              title:"Return to shop phones",
              url:pathMap._phones._hash
            },
            {
              title:"Continue",
              url:location.hash
            }]
          });
        }  
    }
    this.checkShippingInfo=function(v,idx){
        // /P[O,\. ]*B(O|X|OX)*|P[\. ]O[\. ]|POST OFFICE|POSTOFFICE|POST-OFFICE BOX|CALL BOX|LETTER BOX/g
        var bOk=true;
        if(v){
          var m = v.toUpperCase().match(/P[O,\. ]*B(O|X|OX)*|P[\. ]O[\. ]|POST OFFICE|POSTOFFICE|( BOX [\d]+)/g);
          if(m && m.length>0){
            bOk=false;
            if(this.popShippingAddress[idx]==v){
              return bOk;
            }
            this.popShippingAddress[idx]=v;
            appUtil.ui.alert({
              title:"We are sorry!",
              description:"Oooops, we need to know the real address for delivery!  To ensure this reaches you, we cannot send your purchase to a PO Box!",
              links:[{
                title:"Return to shop phones",
                url:pathMap._phones._hash
              },
              {
                title:"Continue",
                url:location.hash
              }]
            });
          }
        }
        return bOk;
    }
    this.downloadContract = function() {
        console.log("==>downloadPDFContract() ...");
        if (!this.data.billingInfo.address2) {
            this.data.billingInfo.address2 = null;
        }
        if (!checkoutController.IB || !checkoutController.ibCart || this.data.equipments.length != 1) {
            console.log("Error: " + checkoutController.IB + " :: " + checkoutController.ibToken + " :: " + this.data.equipments.length);
            return;
        }
        var storedData = JSON.parse(appUtil.cusSto.getItem("sprintShop-shippingBilling"));
        
        //Get Contract info if stored
        if(storedData && storedData.contractInfo){
           this.data.contractInfo = storedData.contractInfo;
        }        
        var data = {
            "lang": checkoutController.data.contractLanguage,
            "brandId": appName,
            "saveContract": false,
            "initials": "",
            subscriberContractInfo: angular.copy(this.data.contractInfo),
            "itemId": this.data.equipments[0].sku,
            "price": this.data.equipments[0].modelPrice,
            "loanNumber": ""
        };
        if (data.subscriberContractInfo.ibTC) {
            delete data.subscriberContractInfo.ibTC;
        }
        if (data.subscriberContractInfo.agreeEC) {
            delete data.subscriberContractInfo.agreeEC;
        }
        var extraHeaders = {};
        extraHeaders["ibToken"] = checkoutController.ibToken;
        appUtil.net.postData($http, "shop_create_loan_contract", data, extraHeaders).
        success(function(data, status, headers, config) {
            if (data.resultCode == 0 || data.status == 0) {
                checkoutController.data.loanNumber = data.loanNumber;
                checkoutController.data.stampTaxAmount = data.stampTaxAmount;
                checkoutController.data.loanFirstInstallmentDueDate = data.loanFirstInstallmentDueDate;
                checkoutController.data.loanLastInstallmentDueDate = data.loanLastInstallmentDueDate;
                //appUtil.data.base64Array2String(data.outputPdf);
                var pdfUrl = "data:application/pdf;base64," + data.outputPdf;
                $('#pdf-url').attr('href', pdfUrl);
                //window.open();
                checkoutController.data.signatureDisable = false;
                console.log("==> process loan pdf file ...");
            } else {
                checkoutController.data.errorText = "Error occured downloading Installment Billing contract";
                checkoutController.data.error = true;
                $scope.showMessage(checkoutController.data.errorText, "error");
            }
        });
    };

    this.submitContract = function() {
        // same as downloadContract() except setting saveContract flag to true
        console.log("==>submitContract() ...");
        if (!checkoutController.IB || !checkoutController.ibCart || this.data.equipments.length != 1) {
            console.log("Error: " + checkoutController.IB + " :: " + checkoutController.ibToken + " :: " + this.data.equipments.length);
            return;
        }
        var data = {
            "lang": checkoutController.data.contractLanguage,
            "brandId": appName,
            "saveContract": true,
            "initials": checkoutController.data.contractInitials,
            subscriberContractInfo: angular.copy(this.data.contractInfo),
            "itemId": this.data.equipments[0].sku,
            "price": this.data.equipments[0].modelPrice,
            "loanNumber": this.data.loanNumber
        };
        if (data.subscriberContractInfo.ibTC) {
            delete data.subscriberContractInfo.ibTC;
        }
        if (data.subscriberContractInfo.agreeEC) {
            delete data.subscriberContractInfo.agreeEC;
        }
        var extraHeaders = {};
        extraHeaders["ibToken"] = checkoutController.ibToken;
        appUtil.net.postData($http, "shop_create_loan_contract", data, extraHeaders).
        success(function(data, status, headers, config) {
            if (data.resultCode == 0 || data.status == 0) {
                console.log("==> loan successfully completed ...");
                checkoutController.step = 2;
                var pageData = {
                    name: 'Review and Purchase'
                };
                var shopData = {
                    cart: {
                        productList: pathMap._checkout._generateAnalysisProductList(checkoutController.data.equipments),
                        cartStatus: ['ib_dvc_in_cart']
                    },
                    order: {
                        shippingCd: checkoutController.data.shippingOption.shippingType.toString()
                    }
                }
                AnalysisService.setCommonData();
                AnalysisService.setPageData(pageData);
                AnalysisService.setShopData(shopData);
                AnalysisService.sendAnalysisData();
            } else {
                checkoutController.data.errorText = "Error occured submiting Installment Billing contract";
                checkoutController.data.error = true;
                $scope.showMessage(checkoutController.data.errorText, "error");
            }
        });
    };
    this.setContext = function(key, parameters) {
        console.log("setContext() .... ");
        if (parameters.length > 0) {
            // All the different parameter capabilities ... who signed off on this one?
            // "addToCart/sku=s1,s2,s3&quantity=q1,q2,q3&ib=true/"  - all in 2nd, separated by &
            // "addToCart/sku=s1,s2,s3/quantity=q1,q2,q3/ib=true"   - each separated by /
            // "addToCart/sku=s1,s2,s3&quantity=q1,q2,q3/ib=true"   - combination of previous two
            // "addToCart/sku=s1;s2;s3&quantity=q1,q2,q3/ib=true"   - support , and ; sku separator
            var skuList = [];
            var quantityList = [];
            this.ibPayment = false;
            var params = parameters.split('/');
            var command = params.shift();
            if (command == "addToCart") {
                for (var i = 0; i < params.length; i++) {
                    var param = params[i].split('&');
                    for (var j = 0; j < param.length; j++) {
                        var p = param[j].split('=');
                        if (p[0] == "sku") {
                            if (p[1].indexOf(',') >= 0) {
                                skuList = p[1].split(',');
                            } else {
                                skuList = p[1].split(';');
                            }
                        } else if (p[0] == "quantity") {
                            quantityList = p[1].split(',');
                            console.log("==> quantityList = " + quantityList);
                        } else if (p[0] == "ib") {
                            if (p[1] == "true") {
                                this.ibPayment = true;
                                console.log("==>checkout: found ib=" + this.ibPayment);
                            }
                        }
                    }
                }
                this.skuQuantityList = {};
                for (var j = 0; j < skuList.length; j++) {
                    if (typeof quantityList[j] === 'string' || quantityList[j] instanceof String) {
                        quantityList[j] = parseInt(quantityList[j]);
                        if (isNaN(quantityList[j])) {
                            quantityList[j] = 1;
                        }
                    }
                    if (typeof quantityList[j] != 'undefined') {
                        if (this.skuQuantityList[skuList[j]]) {
                            this.skuQuantityList[skuList[j]] += quantityList[j];
                        } else {
                            this.skuQuantityList[skuList[j]] = quantityList[j];
                        }
                    } else {
                        this.skuQuantityList[skuList[j]] = 1;
                    }
                }
                if (skuList.length > 0) {
                    //$scope.phoneController.addToCart(skuList,quantityList);
                    this.addToCart();
                }
            }
        }
        if (!pathMap._checkout._adobeData.shop) {
            var data = {
                page: {
                    interaction: pathMap._checkout._analysisInteractionData
                },
                shop: {
                    cart: {
                        view: "true",
                        viewType: "page"
                    }
                }
            };
            pathMap._checkout._generateAnalysisData(data);
        } else if (pathMap._checkout._adobeData.shop.cart && pathMap._checkout._adobeData.shop.cart.open == "true") {
            this.initData();
        }
        if (this.data.summary.total() > $scope.app.config['maxAmountShipping']) {
            this.data.shippingInfo = this.data.billingInfo;
        }

        if (!this.disableReminder) {
            appUtil.net.getData($http, "get_banner_cart_modal").success(function(data) {
                checkoutController.reminderPhone = data.responses.response[0].$;

                if (checkoutController.reminderPhone) {
                    appUtil.ui.startIdleReminder("#checkout_help_reminder", 60, function() {
                        $("#checkout_help_reminder").modal();
                        appUtil.ui.endIdleReminder("#checkout_help_reminder");
                        checkoutController.disableReminder = true;
                    })
                }
            });

        }
        checkoutController.step = 1;
        checkoutController.data.equipments = $scope.cartController.data.items;
        this.restartCheckout();
        this.initPaymentInfo();
        checkoutController.cleanPromoStatus();
        appUtil.ui.refreshContent();
        checkoutController.verifyOrderAvailability();
        if (checkoutController.IB && checkoutController.ibCart) {
            var data = {
                page: {
                    name: 'Installment Billing Contract Form'
                },
                shop: {
                    cart: {
                        productList: pathMap._checkout._generateAnalysisProductList(checkoutController.data.equipments),
                        cartStatus: ['ib_dvc_in_cart']
                    }
                }
            };
            pathMap._checkout._generateAnalysisData(data);
        }
    };
    this.refreshItemAvailability = function() {
        if (appUtil.$scope.app.isCurrentContext(pathMap._checkout._formatedHash)) {
            checkoutController.verifyOrderAvailability();
        }
    };
    this.getOrderStatus = function() {
        checkoutController.orderStatus.errorText = null;
        var data = {};
        data.email = this.orderStatus.email;
        data.orderNumber = this.orderStatus.orderNumber;
        appUtil.net.getData($http, "shop_get_order_status", "?email=" + data.email + "&orderKey=" + data.orderNumber).success(function(data, status, headers, config) {
            if (data.responses.response[0].orderStatusResponse.orderStatus) {
                checkoutController.orderStatus = appUtil.data.simplifyObject(data.responses.response[0].orderStatusResponse.orderStatus);
                checkoutController.orderStatus.itemsOrdered = appUtil.data.toArray(checkoutController.orderStatus.itemsOrdered);
                checkoutController.orderStatus.address = checkoutController.orderStatus.shippingInfo.firstName + " " +
                    checkoutController.orderStatus.shippingInfo.lastName + ", " +
                    checkoutController.orderStatus.shippingInfo.address1 + ", " +
                    checkoutController.orderStatus.shippingInfo.city + ", " +
                    checkoutController.orderStatus.shippingInfo.state + ", " +
                    checkoutController.orderStatus.shippingInfo.zipCode;
                checkoutController.orderStatus.valid = true;
                delete pathMap._orderStatus._adobeData.messages;
                pathMap._orderStatus._adobeData.page.name = "Order Status";
                pathMap._orderStatus._adobeData.orderStatus = {
                    orderDt: checkoutController.orderStatus.date,
                    orderId: checkoutController.orderStatus.orderNumber,
                    orderStatus: checkoutController.orderStatus.status,
                    orderTrackingNbr: checkoutController.orderStatus.orderNumber
                }
            } else {
                pathMap._orderStatus._adobeData.page.name = "Order Status Error";
                pathMap._orderStatus._adobeData.messages = data.responses.response[0].orderStatusResponse.description.$;
                checkoutController.orderStatus.errorText = "The request order number was not found";
                delete pathMap._orderStatus._adobeData.orderStatus;
            }
            analysisManager.sendData();
            setTimeout("delete pathMap._orderStatus._adobeData.messages;delete pathMap._orderStatus._adobeData.orderStatus;pathMap._orderStatus._adobeData.page.name='Order Status Request';", 1000);
        });
    };
    this.clearOrderStatus = function() {
        this.orderStatus.email = null;
        this.orderStatus.date = null;
        this.orderStatus.orderNumber = null;
        this.orderStatus.total = null;
        this.orderStatus.status = null;
        this.orderStatus.items = null;
        this.orderStatus.address = null;
        this.orderStatus.valid = null;
        this.changeStatus.orderStatus.email.check = false;
        this.changeStatus.orderStatus.orderNumber.check = false;
        analysisManager.sendData();
    };
    this.setStep = function(step) {
        if (step < checkoutController.step && checkoutController.step != 3)
            checkoutController.step = step;
    };
    this.saveShippingBilling = function(data) {
        var extraHeaders = {};
        if (checkoutController.ibCart) {
            extraHeaders["ibToken"] = checkoutController.ibToken;
        }
        console.log("==>saveShippingBilling() extraHeaders=" + JSON.stringify(extraHeaders));
        appUtil.net.postData($http, "shop_shipping_billing_service", data, extraHeaders).
        success(function(data, status, headers, config) {
            if (data.status == 0) {
                for (var i = 0; i < data.equipments.length; i++) {
                    for (var j = 0; j < checkoutController.data.equipments.length; j++) {
                        checkoutController.data.equipments[j].orderLineId = data.equipments[i].orderLineId;
                        checkoutController.data.equipments[j].tax = data.equipments[i].tax;
                        checkoutController.data.equipments[j].taxTransactionId = data.equipments[i].taxTransactionId;
                        checkoutController.data.equipments[j].invoiceDate = data.equipments[i].invoiceDate;
                        checkoutController.data.equipments[j].subTotal = data.equipments[i].subTotalAmt;
                        checkoutController.data.equipments[j].isPreOrder = data.equipments[i].isPreOrder;
                    }
                }
                $scope.cartController.save();
                checkoutController.data.transactionId = data.transactionId;
                checkoutController.data.orderId = data.orderId;
                checkoutController.data.CardType = data.CardType;
                checkoutController.data.paymentCardType = checkoutController.data.paymentCardType || data.paymentCardType;
                checkoutController.data.shippingFee = data.shippingFee;
                checkoutController.data.totalAmt = data.totalAmt;

                window.scrollTo(0, 0);
                var analysisData = {
                    page: {
                        name: "Review and Purchase"
                    },
                    shop: {
                        cart: {
                            action: "checkout",
                            productList: pathMap._checkout._generateAnalysisProductList(checkoutController.data.equipments)
                        },
                        order: {
                            salesTax: checkoutController.data.summary.tax(),
                            shippingCost: checkoutController.data.shippingOption.shippingFee,
                            shippingMethod: checkoutController.data.shippingOption.label
                        }
                    }
                };
                if (checkoutController.ibCart) {
                    checkoutController.step = 4;
                    analysisData.page.name = "Installment Billing Contract Assent";
                    analysisData.shop.cart.cartStatus = ['ib_dvc_in_cart'];
                } else {
                    checkoutController.step = 2;
                }
                if (checkoutController.data.promoCode.status == 0) {
                    analysisData.shop.cart.promoCodes = checkoutController.getAllPromoCodeKeys();
                    analysisData.shop.cart.promoCodeDiscountAmt = checkoutController.data.promoCode.totalDiscount;
                }
                pathMap._checkout._generateAnalysisData(analysisData);
                analysisManager.sendData();
                checkoutController.verifyOrderAvailability();
            } else {
                if (data.paymentValid && data.paymentValid == "false") {
                    checkoutController.data.errorText = "Payment information is not valid";
                } else if ((data.addressValid && data.addressValid == "false") || (data.addressValid === false)) {
                    checkoutController.data.errorText = "Billing City, State, Zip Code combination does not exist";
                } else {
                    checkoutController.data.errorText = "We're sorry, there was a problem processing your order.  Please try placing your order again. Or, call 1-877-602-4907 to order by phone.";
                }
                checkoutController.data.error = true;
                $scope.showMessage(checkoutController.data.errorText, "error");
                var analysisData={
                    page:{
                      name:"Shipping and Billing",
                      messages:{
                        message:checkoutController.data.errorText
                      }
                    }
                };
                if( data.errorCode ) {
                    analysisData.page.messages.errorCode=data.errorCode;
                }
                pathMap._checkout._generateAnalysisData(analysisData);
                analysisManager.sendData();
            }
        }).
        error(function(data, status, headers, config) {
            if (appName == 'bst') {
                checkoutController.data.errorText = "We're sorry, there was a problem processing your order.  Please try placing your order again. Or, call 1-877-602-4907 to order by phone.";
            } else {
                checkoutController.data.errorText = "We're sorry, there was a problem processing your order.  Please try placing your order again. Or, call 1-866-866-7509 to order by phone.";
            }
            checkoutController.data.error = true;
            $scope.showMessage(checkoutController.data.errorText, "error");
            var errorMessage = data.technicalError ? data.technicalError : data.description;
            var pageData = {
                channel: 'eStore',
                subSection: 'Checkout',
                name: 'Error',
                language: "EN",
                app: appName,
                message: {
                    message: errorMessage,
                    errorCode: data.errorCode
                }
            };
            AnalysisService.setCommonData();
            AnalysisService.setPageData(pageData);
            AnalysisService.sendAnalysisData();
        });
    };
    this.checkConsumerCredit = function(data) {
        var extraHeaders = {};
        if (checkoutController.ibCart) {
            extraHeaders["ibToken"] = checkoutController.ibToken;
        }
        console.log("==>checkConsumerCredit() extraHeaders=" + JSON.stringify(extraHeaders));
        appUtil.net.postData($http, "shop_check_consumer_credit", data, extraHeaders).
        success(function(data, status, headers, config) {
            if (data.approved) {
                checkoutController.step = 1;
                window.scrollTo(0, 0);
                var shopData = {
                    cart: {
                        productList: pathMap._checkout._generateAnalysisProductList(checkoutController.data.equipments),
                        cartStatus: ['ib_dvc_in_cart']
                    }
                };
                AnalysisService.setCommonData();
                AnalysisService.setShopData(shopData);
                AnalysisService.sendAnalysisData();
            } else {
                if (101 == data.status) {
                    checkoutController.data.errorText = "Billing City, State, Zip Code combination does not exist";
                }
                else {
                    checkoutController.data.errorText = "We're sorry, there was a problem processing your consumer credit checking.  Please try placing your order again. Or, call 1-866-866-7509 to order by phone.";
                } 
                checkoutController.data.error = true;
                $scope.showMessage(checkoutController.data.errorText, "error");
                var errorMessage = data.msg ? data.msg : data.description;
                var pageData = {
                    channel: 'eStore',
                    subSection: 'Checkout',
                    name: 'Error',
                    language: "EN",
                    app: appName,
                    message: {
                        message: errorMessage
                            //errorCode: data.errorCode
                    }
                };
                AnalysisService.setCommonData();
                AnalysisService.setPageData(pageData);
                AnalysisService.sendAnalysisData();
            }

        }).
        error(function(data, status, headers, config) {
            checkoutController.data.errorText = "We're sorry, there was a problem processing your order.  Please try placing your order again. Or, call 1-866-866-7509 to order by phone.";
            checkoutController.data.error = true;
            $scope.showMessage(checkoutController.data.errorText, "error");
            var errorMessage = data.technicalError ? data.technicalError : data.description;
            var pageData = {
                channel: 'eStore',
                subSection: 'Checkout',
                name: 'Error',
                language: "EN",
                app: appName,
                message: {
                    message: errorMessage,
                    errorCode: data.errorCode
                }
            };
            AnalysisService.setCommonData();
            AnalysisService.setPageData(pageData);
            AnalysisService.sendAnalysisData();
        });
    };

    /*this.showWhatIsPaypal = function () {
        var newWin = window.open("https://www.Paypal.com/cgi-bin/webscr?cmd=xpt/Marketing/popup/OLCWhatIsPayPal-outside", "", "width=650, height=600");
        if (!newWin || newWin.closed || typeof newWin.closed == 'undefined')
            $window.location.href = 'https://www.Paypal.com/cgi-bin/webscr?cmd=xpt/Marketing/popup/OLCWhatIsPayPal-outside';
    };*/

    this.initData();
    this.initShipping();
    $scope.pushAutoRefresh("$scope.checkoutController.refreshItemAvailability()");
}]);