$(document).ready(function() {
	tabFunc();

	var links = $('.left_cp_bar li a');
	/*var parserurl = document.createElement('a');
	parserurl.href = document.URL;

	$.each(links, function (key, va) {
		//document.URL
		
		if (va.pathname + va.search === parserurl.pathname + parserurl.search) {
			$(this).addClass('active');
			//$(this).parents().children(".grand_cp_left_nav_link").addClass('active');
		}
	});*/

	var url = window.location.pathname, 
	hrefurl = window.location.href, 
	parsepathurlsl = url.split('/'),	
	urlRegExp = new RegExp(url.replace(/\/$/,'') + "$"),
	parsurlget = "";

	parsurlget = getUrlParameter("mp");
	
	links.each(function(){
		let curparslinc = this.href.split('/');
		let curparsgetprm = this.href.split('?');
		let curpathurl = this.href.replace(/\/$/,'');

		if(urlRegExp.test(curpathurl) && curparsgetprm[1] == "mp=35"){
			$(this).addClass('active');
			return false;
		}else if(parsurlget == "35" && curparsgetprm[1] == "mp=35"){
			$(this).addClass('active');
			return false;
		}else if(parsepathurlsl[1] == curparslinc[3] && curparslinc[4] && curparslinc[3] !== "ap"){

			if (curparsgetprm[1] !== "mp=35" && parsurlget !== "35") {
				$(this).addClass('active');
				return false;
			}
			
		}else if(hrefurl == curpathurl && curparsgetprm[1] !== "mp=35") {
			$(this).addClass('active');
			return false;
		}
		
	});

	/*$('.cp_header_user_toggler').click(function(){
		if($('#cp_user_header_menubar').is(':hidden')) {
			$('#cp_user_header_menubar').addClass('open_acc_menu');
		}else{
			$('#cp_user_header_menubar').removeClass('open_acc_menu');
		}	
	});*/

	// Prevent submitting a form by hitting Enter in any input
	$('button[type="submit"]').keydown(function (event) {
		if (event.keyCode == 13) {
			event.preventDefault(); 
			return false;
		}
	});
	//
	$(document).on('click', '#lender_download_all_files', function () {
		var queryString = window.location.search;
		var urlParams = new URLSearchParams(queryString);
		var lender_id = urlParams.get('id');
		window.location.href = "/ap/settings/lender/download-all-lender-files?id=" + lender_id;
	});
	$(document).on('focus', '.phone-us', function () {
		$(this).inputmask("999-999-9999");
	});
	$(document).on('focus', '.input_phone', function () {
		$(this).inputmask("(999) 999-9999");
	});
	//
	//$('.phone-extension-number').inputmask("9999");
	//
	$('.opportunity_format_currency').inputmask({
		alias : "currency",
		prefix: '$',
		rightAlign: false,
		max: 9999999999.99
	});
	$('.opportunity_format_email').inputmask({ alias : "email" });
	$('.opportunity_format_phone').inputmask("(999) 999-9999");
	$('.opportunity_format_tax').inputmask("99-9999999");
	$('.opportunity_format_number').inputmask({
		alias: 'numeric',
		allowMinus: false,
		digits: 0,
		rightAlign: false
	});
	$('.opportunity_format_decimal').inputmask({
		alias: 'decimal',
		allowMinus: false,
		digits: 2,
		digitsOptional: false,
		shortcuts: null,
		rightAlign: false,
		max: 9999999999.99
	});
	$(document).on('focus keyup', '.opportunity_format_url', function(){
		if( this.value.indexOf('https://') !== 0 ){
			if (this.value.length <= 8) {
				this.value = 'https://';
			} else {
				this.value = 'https://' + this.value;
			}
		}
	});
	$('.opportunity_format_url').on('blur', function(){
		if (this.value.indexOf('https://') == 0 && this.value.length == 8) {
			this.value = '';
		}
	});
	//select all scheckbox
	//arrInputAllListPage();
	$('#select-all-input').click(function(){
		var checkboxes = $('.table_list_inp_select');
		var checkedstatus;
		for (var checkbox of checkboxes) {
			checkbox.checked = this.checked;
			checkedstatus = this.checked;			
		}
		if (checkedstatus) {
			deleteButtonShowTrue();
		}else{
			deleteButtonShowFalse();
		}
	});
	$('.table_list_inp_select').click(function(){
		arrInputAllListPage();
	});
	//end select all scheckbox
	//
	$(document).on('keyup', '#opportunity_edit_template_field_aliace', function () {
		let message = $(this).val().replace(/[\s_\-]+/g,"_");
		$(this).val(message);
	});

	//page popup msg
	/*if($('.page_popup_msg').is(":hidden")) {
		setTimeout(function() { 
            $('.page_popup_msg').fadeIn();
			setTimeout(function() { 
				$('.page_popup_msg').fadeOut();
			}, 10000);
        }, 1000);
	}*/

	//mark text page search fields
	//var list_res = document.getElementById("the-list");
	//var search_inp = $("input[name=search]").val();

	//if (search_inp && list_res) {
	  	/*search_inp = search_inp.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
	 	 var pattern = new RegExp("("+search_inp+")", "gi");
		list_res = list_res.replace(pattern, "<mark>$1</mark>");
		list_res = list_res.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");

		$("#the-list").html(list_res);*/
		  
		// Highlight all keywords found in the page
		//highlight(list_res, [search_inp], false, 'mark_search');
	//}
	
});

function commNoteparsUrlToLink(iditm) {

    if (!iditm) {
        iditm = "#laoq-comments-con-note";
    }

    $(''+iditm+' .laoq_comment_text_val').html(function(i, text) {
		///\bhttp(s)?:\/\/([\w\.-]+\.)+[a-z]{2,}\/.+\b/gi,
        return text.replace(
            /\s(http(s)?:\/\/[^\s]+)\s/g,
            '<a href="$&" target="_blank" title="Open New Tab" rel="noreferrer nofollow">$&</a>'
        );
    });
}

var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
		}
	}
	return false;
}; 

/*var getUrlParamsLs = window
    .location
    .search
    .replace('?','')
    .split('&')
    .reduce(
        function(p,e){
            var a = e.split('=');
            p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        },
        {}
);*/

function tabFunc() {
	let gettaburl = getUrlParameter("tabopen");
	if (gettaburl.length > 0) {
		if (gettaburl == "note") {
			let getNoteIdurl = getUrlParameter("tabnote");
			let bltab = $('#laoq-comments-con');
			//setTimeout(function() { 
				bltab.addClass('laoq_comments_con_active');
				bltab.fadeIn();
				if (getNoteIdurl.length > 0) {
					$('#laoq-comments-con .laoq_comments_con_main').animate({
						scrollTop: $('#comm-note-'+getNoteIdurl).offset().top-140
					}, 700);
					$('#comm-note-'+getNoteIdurl).addClass('comnoteFocus');
				}
			//}, 500);
		}
	}
}

function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

//select all scheckbox
function arrInputAllListPage() {
	var ststusch = false;
	$('.table_list_inp_select').each(function(index) {
		if ($(this).is(':checked')) {
			ststusch = true;
		}
	});

	if (ststusch) {
		deleteButtonShowTrue();
	}else{
		deleteButtonShowFalse();
		if ($('#select-all-input').is(':checked')) {
			$('#select-all-input').prop("checked", false );
		}
	}
}
function deleteButtonShowTrue() {
	$('#delete-button-list').show();
}
function deleteButtonShowFalse() {
	$('#delete-button-list').hide();
}
//end select all scheckbox

// Send form all list page
/*function sendFormListPage(formId, btnId) {
	if (formId) {
		document.getElementById(btnId).disabled = true;
		//document.getElementById(formId).submit();
		return false;
	}
}*/  

// 
function clickRandomPasswordGeneratorButton() {
	let randomPassword = $.passGen({
		'length' : 10,
		'numeric' : true,
		'lowercase' : true,
		'uppercase' : true, 
		'special' : true
	});
	$(".random-password-field").val(randomPassword);
	$(".random-password-confirm-field").val(randomPassword);
	$("#copy-random-password-button").removeClass("d-none");
}
// 
function clickCopyRandomPasswordButton() {
	switch ($('.random-password-field').prop('type')) {
		case 'password':
			$('input:password.random-password-field').prop('type','text');
			$('.random-password-field').focus().select();
			//document.execCommand("copy");
			$('input:text.random-password-field').prop('type','password');
			break;
		case 'text':
			$('.random-password-field').focus().select();
			//document.execCommand("copy");
			break;
		default:
			break;
	}
}
//
function clickShowOrHidePasswordIcon(element) {
	if ($(element).hasClass("fa-eye")) {
		$(element).removeClass("fa-eye");
		$(element).addClass("fa-eye-slash");
		$(element).next().prop('type','text');
	} else {
		$(element).removeClass("fa-eye-slash");
		$(element).addClass("fa-eye");
		$(element).next().prop('type','password');
	}
}
function clickShowSplr(element, button) {
	if ($(element).hasClass("fade-active")) {
		$(button).fadeIn('50');
		$(element).hide();
		$(element).removeClass("fade-active");
	} else {
		$(button).hide();
		$(element).fadeIn('50');
		$(element).addClass("fade-active");
	}
}

//Edit value field
function editValueFieldId(id) {
	if ($("#"+id).css('display') == 'none') {
        $("#"+id).show();
        $("#"+id).focus();
        $("#field-"+id).hide();
    }
}
//
function addAnotherOpportunityDropdownOption() {
	/*$('#add_another_opportunity_dropdown_options').children('.add_another_opportunity_dropdown_option')
		.first()
		.clone()
		.appendTo("#add_another_opportunity_dropdown_options")
		.find("input[type='text']").val("");*/
	$('#template_opportunity_dropdown_option')
		.children('.add_another_opportunity_dropdown_option')
		.clone()
		.appendTo("#add_another_opportunity_dropdown_options")
		.prop('hidden', false)
		.removeClass('hidden')
		.find(".disabled").prop('disabled', false)
		.removeClass('disabled')
		.val("");

	showOrHideRemoveBtnOpprtunityTemplateDropdownOption();
}
//
function removeOpportunityDropdownOption(option) {
	$(option).closest('.add_another_opportunity_dropdown_option').remove();
	showOrHideRemoveBtnOpprtunityTemplateDropdownOption();
}
// Add another rep for new lender
function addAnotherRepLender() {
	$('#add_another_rep_lender_rows').children('.add-another-rep-lender')
		.first()
		.clone()
		.appendTo("#add_another_rep_lender_rows")
		.find("input[type='text']").val("");

	showOrHideRemoveBtnRepLender();
}
//
function addAdditionalRepLender() {
	$('#add_another_rep_lender_rows').children('.add-another-rep-lender')
		.first()
		.clone()
		.appendTo("#add_another_rep_lender_rows")
		.find(".hidden").prop('hidden', false)
		.removeClass('hidden')
		.find(".disabled").prop('disabled', false)
		.removeClass('disabled');

	showOrHideRemoveBtnRepLender();
}
function removeRepLender(rep) {
	$(rep).closest('.add-another-rep-lender').remove();
	showOrHideRemoveBtnRepLender();
}
// csrf_protection must be enabled, else nothing happing
function postRemoveRepLender(rep, token_name) {

	var removed = confirm("Delete this rep ?");
	if (removed) {

		if (token_name.length < 3) return false;
		let token_code = $( "input[name="+token_name+"]" ).val();
		if (token_code === undefined || token_code.length < 32) return false;
		let lender_id = 0;
		// Get id parameter from uri string
		let searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has('id')) {
			lender_id = searchParams.get('id');
		}
		if (lender_id == 0) return false;
		let rep_id = $(rep).closest('.add-another-rep-lender').find(".lender_rep_id").val();
		if (rep_id === undefined || rep_id < 1) return false;
		let request = {
			[token_name]: token_code,
			lender_id: lender_id,
			rep_id: rep_id
		};

		$.ajax({
			url:'/ap/settings/lender/delete-rep',
			method: 'post',
			data: request,
			dataType: 'json',
			success: function(response){
				// Update csrf token
				$( "input[name="+token_name+"]" ).val(response.new_token_code);
				// Update view if rep was delete
				if(response.deleted === true) {
					removeRepLender(rep);
				}
			},
			error: function(response){
				// Error handler ?
				//console.log(response);
			}
		});

	}
}
// Get current rep count for new lender
// count by number of remove buttons
function currentRepCountForNewLender() {
	return $('.remove-rep-lender-btn').length;
}
//
function currentOpportunityTemplateDropdownOptionCount() {
	return $('.opportunity-templte-dropdown-remove-option-btn').length;
}
//
function showOrHideRemoveBtnOpprtunityTemplateDropdownOption() {
	if (currentOpportunityTemplateDropdownOptionCount() > 1) {
		$('.opportunity-templte-dropdown-remove-option-btn').removeClass('d-none');
	} else {
		$('.opportunity-templte-dropdown-remove-option-btn').addClass('d-none');
	}
}
//
function showOrHideRemoveBtnRepLender() {
	if (currentRepCountForNewLender() > 1) {
		$('.remove-rep-lender-btn').removeClass('d-none');
	} else {
		$('.remove-rep-lender-btn').addClass('d-none');
	}
}
//
function lenderEditFileName(element) {
	let parent = $(element).parent();
	parent.hide();
	let editable_input = parent.next().find('input');
	editable_input.attr('size', editable_input.val().length);
	parent.next().show();
	editable_input.select();
}
//
function lenderRenameFile(element, file_id) {
	let parent = $(element).parent();
	let old_file_name = parent.prev().find('a').html();
	let ext = old_file_name.split(".").pop().toLowerCase();
	let new_file_name_without_ext = parent.find('input').val();
	new_file_name_without_ext = new_file_name_without_ext.trim().replace(/\s+/gi, "_");
	parent.find('input').val(new_file_name_without_ext);
	//new_file_name_without_ext = new_file_name_without_ext.replace(/\s+/gi, "_");
	let filename_pattern = new RegExp(/^[a-zA-Z0-9_.()-]+$/);
	if (!filename_pattern.test( new_file_name_without_ext ) ) {
		alert('"' + new_file_name_without_ext +  '" filename is invalid.');
		return;
	}
	let new_file_name = new_file_name_without_ext + '.' + ext;

	if (new_file_name !== old_file_name) {

		let token_name = $(element).closest('form').children('input').first().attr('name');
		if (token_name.length < 3) return false;
		let token_code = $( "input[name="+token_name+"]" ).val();
		if (token_code === undefined || token_code.length < 32) return false;
		let lender_id = 0;
		// Get id parameter from uri string
		let searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has('id')) {
			lender_id = searchParams.get('id');
		}
		if (lender_id == 0) return false;

		let request = {
			[token_name]: token_code,
			file_id: file_id,
			new_file_name: new_file_name
		};
		$.ajax({
			url:'/ap/settings/lender/rename-lender-file?lender_id='+lender_id,
			method: 'post',
			data: request,
			dataType: 'json',
			success: function(response){
				if(!response.renamed) {
					if(response.error !== undefined) {
						let cleanText = response.error.replace(/<\/?[^>]+(>|$)/g, "");
						alert(cleanText);
					} else {
						alert('Failed to rename file');
					}
				} else {
					// Update view
					parent.prev().find('a').html(new_file_name);
					parent.hide();
					parent.prev().show();
				}
				// Update csrf token
				$( "input[name="+token_name+"]" ).val(response.new_token_code);
			},
			error: function(jqXHR, textStatus, errorThrown){
				// Error handler ?
				var cleanText = jqXHR.responseText.replace(/<\/?[^>]+(>|$)/g, "");
				alert(cleanText);
			}
		});
	}
}
//
function lenderCancelRenameFile(element) {
	let parent = $(element).parent();
	let old_file_name = parent.prev().find('a').html();
	let old_file_name_without_ext = old_file_name.substring(0, old_file_name.lastIndexOf('.'));
	parent.find('input').val(old_file_name_without_ext);
	parent.hide();
	parent.prev().show();
}
//
function change_opportunity_field_type(element) {
	/*alert(element.value);
	let footer = $(element).closest('.opportunity_select_field_type_header').next();
	footer.html('');
	footer.append("" +
		"<div class='form-row'>" +
		"<div class='col'><label>Field name<span>*</span>:</label>" +
		"<input type='text' class='form-control' name='opportunity_edit_template_field_name' value='' placeholder='Field name' maxlength='128' required></div>" +
		"<div class='col'><label>Field aliace:</label>" +
		"<input type='text' class='form-control' name='opportunity_edit_template_field_aliace' value='' placeholder='Field aliace' maxlength='128' required></div>" +
		"</div>"
	);*/
	let footer = $(element).closest('.opportunity_select_field_type_header').next();
	if (element.value == '') {
		footer.find(".field-name-configuration").prop('hidden', true);
		footer.find(".dropdown-configuration").prop('hidden', true);
	} else {
		footer.find(".field-name-configuration").prop('hidden', false);
	}
	if (element.value == 'dropdown') {
		footer.find(".dropdown-configuration").prop('hidden', false);
	} else {
		footer.find(".dropdown-configuration").prop('hidden', true);
		footer.find(".dropdown-configuration")
			.find("#add_another_opportunity_dropdown_options")
			.empty();
	}
}
function toTitleCase(str) {
   return str.split(/\s+/).map( s => s.charAt( 0 ).toUpperCase() + s.substring(1).toLowerCase() ).join( " " );
}