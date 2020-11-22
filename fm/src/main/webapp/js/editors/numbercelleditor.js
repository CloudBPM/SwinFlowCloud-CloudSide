/**
 * This plugin is used to control positive integer input.
 */
;
(function($, window, document, undefined) {
	var pluginName = "numberCellEditor";
	var defaults = {
		parent : "",
		msg : "",
	};

	var NumberCellEditor = function(element, options) {
		this.element = element;
		this.options = $.extend({
			parent : "",
			msg : "",
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
	};

	NumberCellEditor.prototype.loadEditor = function(tag, entity, prop, isnull,
			owner) {
		var that = this;
		this.owner = owner;
		if ($(tag).attr("type") == "h") {
			return;
		}
		var oldvalue = $(tag).text();
		$(tag).text("");
		var inputObj = $("<input type='number' class='form-control'/>");
		inputObj.val(oldvalue).appendTo($(tag)).get(0).select();
		var nextTR = inputObj.closest('tr').next();
		while (nextTR != undefined) {
			var nextTD = nextTR.find("td")[1];
			if (nextTD != undefined) {
				if (nextTD.getAttribute("type") != "-1") {
					break;
				}
			} else {
				break;
			}
			nextTR = $(nextTR).next();
		}
		inputObj.focus();
		inputObj.click(function() {
			return false;
		}).keydown(
				function(event) {
					var keyvalue = event.which;
					if (keyvalue == 9) { // Tab key
						event.preventDefault();
						if (that.changeValue(tag, entity, prop, oldvalue,
								isnull)) {
							inputObj.remove();
							if (nextTD != undefined) {
								that.options.parent.startToEdit(nextTD);
							}
						} else {
							inputObj.focus();
							return false;
						}
					} else if (keyvalue != 8 && keyvalue != 37
							&& keyvalue != 39 && keyvalue != 46
							&& keyvalue != 36 && keyvalue != 35
							&& !(keyvalue >= 48 && keyvalue <= 57)) {
						return false;
					}
				}).keyup(function(event) {
			var keyvalue = event.which;
			if (keyvalue == 13) {// enter key
				event.preventDefault();
				if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
					inputObj.remove();
					if (nextTD != undefined) {
						that.options.parent.startToEdit(nextTD);
					}
				} else {
					inputObj.focus();
					return false;
				}
			} else if (keyvalue == 27) {
				$(tag).text(oldvalue);
				inputObj.remove();
				inputObj = null;
			}
		}).blur(function() {
			if (that.changeValue(tag, entity, prop, oldvalue, isnull)) {
				inputObj.remove();
			} else {
				inputObj.focus();
				return false;
			}
		})
	};

	NumberCellEditor.prototype.changeValue = function(tag, entity, prop,
			oldvalue, isnull) {
		var newvalue = $(tag).children("input").val();
		if (isnull == "n" && (newvalue == null || newvalue == "")) {
			this.options.msg.show("当前属性不能为空。");
			return false;
		} else {
			if (newvalue != oldvalue) {
				for (x in entity) {
					if (x == prop) {
						map[this.owner.id].stack.execute(new FMValueChangedCmd(
								entity, prop, newvalue, this.owner));
						break;
					}
				}
			} else {
				$(tag).text(oldvalue);
			}
			return true;
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new NumberCellEditor(this, options));
			} else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, pluginName)[options]();
			}
		});
	};

})(jQuery, window, document);