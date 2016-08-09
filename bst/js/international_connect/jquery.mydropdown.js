/**
 * @author Paul Chan / KF Software House
 * http://www.kfsoft.info
 * Modified by Aleksey Kuznetsov (AK) at 2011/10/14  
 *
 * Version 0.6
 * Copyright (c) 2011 KF Software House
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function($) {

    var _options = new Array();
	var _optionsMenuLength = new Array();
	var timeoutId = 0;
	
	function arrowNav(direction){
		if($('.advMenuUL li.sel').length != 0){
			var currLi = $('.advMenuUL li.sel').index();
			$('.advMenuUL li').removeClass('sel');
			if(direction == 'up'){
				//arrow up
				$('.advMenuUL li').eq(currLi-1).addClass('sel');
			} else {
				//arrow down
				$('.advMenuUL li').eq(currLi+1).addClass('sel');
			}
		} else {
			$('.advMenuUL li').eq(0).addClass('sel');
		}
	}
	
	jQuery.fn.MyDropdown = function() {
		_options[_options.length]=1
		_optionsMenuLength[_options.length] = 0
		var idx = _options.length-1
		$(this).attr('idx', idx);

		$(this).each(function(){
			var selectmenu = $(this)
			var menuoptions = selectmenu.find("option").not('option[value=""]');
			var defaultOption = selectmenu.find('option:selected').text();
			var val
			var genMenu = ''

			_optionsMenuLength[idx] = menuoptions.length

			for (var i=0;i!=menuoptions.length;i++){
				val = menuoptions[i].value
				txt = menuoptions[i].text
				genMenu+= '<li v="'+val+'">'+txt // AK
			}

			genMenu = menuoptions.length>0? '<ul class="advMenuUL advMenuUL'+idx+'">'+genMenu+'</ul>':''
			var genHeader = '<a class="rounded-3 gradient-grey-lt genHeader genHeader'+idx+'" href="#" onclick="return false;"><span>'+defaultOption+'</span></a>';
			
			
			selectmenu.hide()

			selectmenu.after(genHeader + genMenu)
			var lineHeight = parseInt($('.genHeader').css('height'))

			$('.advMenuUL'+idx).addClass('menuHeader').addClass('menuHeader'+idx)
			$('.genHeader'+idx).click(function(){
				//arrow keys MH --
				$(document).keydown(function(event) {
					event.preventDefault();
				    switch (event.keyCode) {
						//enter key
						case 13: $('.advMenuUL li.sel').trigger('click'); break;
				        case 38: arrowNav('up'); break;
				        case 40: arrowNav('down'); break;
				    }
				});
				// AK --
				var selv = $(selectmenu).val()
				$('.advMenuUL li').each(function(){
					var v = $(this).attr('v')
					if (v==selv){
						this.className = 'sel'
						return false // AK - break
					}
				})

				$('.menuHeader'+idx).css('height', _optionsMenuLength[idx] * lineHeight)

				// AK --
				if ($('.genHeader'+idx).width() + 32 > $('.advMenuUL'+idx).width())
					$('.advMenuUL'+idx).css('width', $('.genHeader'+idx).width())

				$('.menuHeader'+idx).toggle() // AK
			}).mouseleave(function(){
				$(document).unbind('keydown');
				$('.menuHeader'+idx).css('height', lineHeight+'px')
				timeoutId = setTimeout(function(){
					$('.menuHeader'+idx).hide()
				},10)
			})

			$('.menuHeader'+idx).mouseenter(function(){
				$(this).css('height', _optionsMenuLength[idx] * lineHeight)
				clearTimeout(timeoutId)
			}).mouseleave(function(){
				$(this).css("height", lineHeight+'px')
				$(this).hide()
			})

			$('.genHeader'+idx).mouseenter(function(){
				$(this).addClass('genHeaderSel')
			}).mouseleave(function(){
				$(this).removeClass('genHeaderSel')
			}).mousedown(function(){ // AK - disable selection on double click for Mozilla. (For IE it should be disabling of "onstartselect", but it conflicts with jQuery)
				return false
			})

			$('.advMenuUL'+idx+' li').click(function(){
				$('.genHeader'+idx).html('<span>'+$(this).text()+'</span>');
				var v = $(this).attr('v')
				$(selectmenu).children().each(function(){
					if ($(this).val()==v){
						this.selected = true
						selectmenu.trigger('change') // AK -- onChange!
						return false // AK - break
					}
				})
				$('.menuHeader'+idx).hide()
			}).mouseover(function(){ // AK --
				$('.advMenuUL li').each(function(){
					this.className = ''
				})
			});

			$('.advMenuUL').hide()

			//init
			$(selectmenu).children().each(function(){
				if (this.selected){
					var selv = $(this).val()
					var selt = $(this).text()

					$('.advMenuUL li').each(function(){
						var v = $(this).attr('v')
						if (v==selv){
							$('.genHeader'+idx).html('<span>'+selt+'</span>');
							return false // AK - break
						}
					})
				}
			});
			$('.genHeader'+idx).focus(function() {
				$('.genHeader'+idx).trigger('click');
				$("input, a").not(this).focus(function() {
					$('.menuHeader'+idx).css("height", lineHeight+'px');
					$('.menuHeader'+idx).hide();
				});
			});
			
		})
	}
})(jQuery)