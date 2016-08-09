var commonValidator={
  phoneNumberPattern:(function() {
    var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    return {
      test: function(value) {
        return regexp.test(value);
      }
    };
  })(),
  creditNumberPattern:(function() {
    var regexp = /^[0-9]{16}$/;
    return {
      test: function(value) {
        return regexp.test(value.replace(/ /g,""));
      }
    };
  })(),
  creditSecurityCodePattern:(function() {
    var regexp = /^[0-9]{3}$/;
    return {
      test: function(value) {
        return regexp.test(value.replace(/ /g,""));
      }
    };
  })(),
  zipCodePattern:(function() {
    var regexp = /^[0-9]{5}$/;
    return {
      test: function(value) {
        return regexp.test(value.replace(/ /g,""));
      }
    };
  })()
}