//prototypes

String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }//end of for loop
    
    return theString;
};//end of String.format()

//Device functions

//alert dialog dismissed
function alertDismissed() {
}//end of alertDismissed()

// JavaScript Document

//Adds text to any part of the body of a HTML
function addNode(tagParent,strText,boolAddToBack, boolRemoveNode) {
	var strNode = document.createTextNode(strText);//holds the test which will be added

	//gets the properties of the node
	tagParent = getDocID(tagParent);
	
	//checks if the user whats to replace the node in order to start with a clean slate
	//it also checks if there is a chode node to replace
	if (boolRemoveNode === true && tagParent.childNodes.length > 0)
		//replaces the current node with what the user wants
		tagParent.replaceChild(strNode,tagParent.childNodes[0]);
	else {
		//checks if the user whats to added to the back of the id or the front
		if(boolAddToBack === true)
			tagParent.appendChild(strNode);
		else
			//This is a built-in function of Javascript will add text to the beginning of the child
			insertBefore(strNode,tagParent.firstChild);
	}//end of if else
	
	//returns the divParent in order for the user to use it for more uses
	return tagParent;
}//end of addNode()

/**
 * Add To Local Device Calendar 
 * @param {Date}	dateEventArticle 
 * @param {String}	strEventTitle    
 */
function addToCal(dateEventArticle, dateEventDateArticle, strEventTitle) {
	try {
		// add event to the calendar 
		window.plugins.calendar.createEvent(strEventTitle, "", "", new Date(dateEventArticle.getFullYear(), (dateEventArticle.getMonth()), dateEventArticle.getDate(), dateEventArticle.getHours(), dateEventArticle.getMinutes(), 0, 0, 0), new Date(dateEventDateArticle.getFullYear(), (dateEventDateArticle.getMonth()), dateEventDateArticle.getDate(), dateEventDateArticle.getHours(), dateEventDateArticle.getMinutes(), 0, 0, 0),
			function(){
				navigator.notification.alert('Added', null, 'Add ' + strEventTitle + ' event to calendar', 'OK');
			}, 
			function(){
				navigator.notification.alert('Error', null, 'Unable to add event to calendar', 'OK');
		});
	}// end of try
	catch (ex) {
        console.log("Error Adding Calendar: " + ex.message);
    }//end of catch
}// end of addToCal()

//changes the image of a checkbox from
function changeCheckbox(tagImageCheckbox, strImageFile) {
	//sets the values for the fields
	tagImageCheckbox = getDocID(tagImageCheckbox);

	//checks if the there is a text field and clear button
	if (tagImageCheckbox !== null) {
		//checks which value of the checkbox is false if so then set it to true
		//and sets image of tagImageCheckbox
		if(tagImageCheckbox.alt === "0") {
			tagImageCheckbox.alt = "1";	
			tagImageCheckbox.src = "img/Checkmark@2x.png";
		}//end of if
		else {
			tagImageCheckbox.alt = "0";
			tagImageCheckbox.src = "img/CheckmarkBox@2x.png";
		}//end of else
	}//end of if
}//end of changeCheckbox()

//Changes the display to either off or on
function changeDisplay(tagLayer,strDisplay) {
	tagLayer = getDocID(tagLayer);//holds the active Layer
	
	//Checks if there is an active layer
	if (tagLayer !== "")
		tagLayer.style.display = strDisplay;	
}//end of changeDisplay()

//changes the image of tagImage to what is in strImageSrc
function changeImage(tagImage,strImageSrc) {
    //gets the properties of tagImage
    tagImage = getDocID(tagImage);
    
    //checks if there is a properties
    if(tagImage !== null)
        tagImage.src = strImageSrc;
}//end of changeImage()

/**
 * // changes the section to the current section the user want to go to sections
 * @param  {String} strCurrentPage	Section to go to
 * @param  {Int}    intArticlesType	Article type for both the news and events since they share the same details section
 */
function changeSection(strCurrentPage, intArticlesType) {
	try {
		var strHeaderImageBannerTemplate = "<img src='img/{0}' alt='{1}'>";// holds the image banner template as there is many times this will be used
		var tagHeaderLogo = $('#sectionHeaderLogo');// holds the logo of the app
		var tagHeaderBanner = $('#sectionCurrentSectionHeader');// holds the Banner For each section
		var tagHomeButton = $("#divHomeButton");// holds the Home Button

		console.log("Going to section: " + strCurrentPage);

		// checks which section the user is going to
		switch(strCurrentPage) {
			case "Home":
				// gets the banners from the server
				getBanners(window.localStorage.getItem('strDomainName') + 'ASP/getBanner.aspx', 'divMessageHome', tagHeaderBanner);
			break;
			case "ContactUs":
				// changes the Header witht eh image or changing banners
				tagHeaderBanner.html(String.format(strHeaderImageBannerTemplate, "HeaderContactUs.png", strCurrentPage));
			break;
			case "ArticleDetails":
			case "Events":
			case "News":
				// checks which article types
				if(intArticlesType == 1)
					// changes the Header witht eh image or changing banners
					tagHeaderBanner.html(String.format(strHeaderImageBannerTemplate, "HeaderNews.png", strCurrentPage));
				else
					// changes the Header witht eh image or changing banners
					tagHeaderBanner.html(String.format(strHeaderImageBannerTemplate, "HeaderEvents.png", strCurrentPage));
			break;
			case "SocialMedia":
				// changes the Header witht eh image or changing banners
				tagHeaderBanner.html(String.format(strHeaderImageBannerTemplate, "HeaderSocialMedia.png", strCurrentPage));
			break;
		}// end of switch

		// checks if this is the homepage
		if(strCurrentPage === "Home") {
			//adds the CSS Class to hide the home button
			tagHomeButton.addClass('divJustHidden');

			// adds a class as the homepages is using a roatting banner while the other sections uses a static image
			tagHeaderBanner.removeClass('divOtherSecitonBanner');
			tagHeaderLogo.removeClass('divOtherSecitonBanner');
			tagHeaderBanner.addClass('divHomeHeaderBanner');
			tagHeaderLogo.addClass('divHomeHeaderBanner');
		}// end of if
		else {
			//remove the CSS Class to hide the home button
			tagHomeButton.removeClass('divJustHidden');

			// adds a class as the homepages is using a roatting banner while the other sections uses a static image
			tagHeaderBanner.removeClass('divHomeHeaderBanner');
			tagHeaderLogo.removeClass('divHomeHeaderBanner');
			tagHeaderBanner.addClass('divOtherSecitonBanner');
			tagHeaderLogo.addClass('divOtherSecitonBanner');
		}// end of else
		// changes the section
		classToggleLayer(getDocID('bodyApp'), getDocID('section' + strCurrentPage), 'divJustHidden sectionBody', 'section');
	}//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        console.log("Error: " + ex.message);
    }//end of catch
}//end of changeSection()

//clears the text and removes the clear button
function clearText(tagTextField, tagClearButton, tagErrorIcon, boolClearField) {
	//sets the values for the fields
	tagTextField = getDocID(tagTextField);
	tagClearButton = getDocID(tagClearButton);
	tagErrorIcon = getDocID(tagErrorIcon);

	//checks if the there is a text field and clear button
	if (tagTextField !== null && tagClearButton !== null && tagErrorIcon !== null) {
		//checks if the tagTextField needs to be clear
		if(boolClearField === true)
			tagTextField.value = '';
		
		//checks if the text in the field if so then display the the clear button
		//else remove it
		if(tagTextField.value !== '')
			tagClearButton.style.display = 'block';
		else
			tagClearButton.style.display = '';
			
		//removes the error icon as it is not needed
		tagErrorIcon.style.display = '';
	}//end of if
}//end of clearText()

//removes from view all tags in tagContainer with the expection of tagActive
//It assumes the tagActive and tagContiner already have the properties
function classToggleLayer(tagContainer,tagActive,strClassName,strTAGName) {
	var arrTAG = tagContainer.getElementsByTagName(strTAGName);//holds all strTAGName in tagContainer
	
	//goes around the for each tag that getElementsByTagName found in tagContainter
	for(var intIndex = arrTAG.length - 1; intIndex > -1; intIndex--) {
		//checks if the class name is the same as strClassName and it is not active if it is active then change the dispaly to block
		if(arrTAG[intIndex].className === strClassName && arrTAG[intIndex].id !== tagActive.id)
			arrTAG[intIndex].style.display = arrTAG[intIndex].style.display? "":"";
		else if(arrTAG[intIndex].id === tagActive.id && tagActive.style.display === "")
			arrTAG[intIndex].style.display = arrTAG[intIndex].style.display? "":"block";
	}//end of for loop
}//end of classToggleLayer()

//Changes the tagActive Class to have the an Select only class so that the tagActive will look different from the rest
//It assumes the tagActive and tagContiner already have the properties
function classToggleLayerChangeClass(tagContainer,tagActive,strClassName,strActiveClassName,strTAGName) {
	var arrTAG = tagContainer.getElementsByTagName(strTAGName);//holds all strTAGName in tagContainer
	
	//goes around the for each tag that getElementsByTagName found in tagContainter
	for(var intIndex = arrTAG.length - 1; intIndex > -1; intIndex--) {
		//checks if the class name is the same as strClassName and it is not active if it is active then adds an strActiveClassName
		if(arrTAG[intIndex].id !== tagActive.id)
			arrTAG[intIndex].className = strClassName;
		else if(arrTAG[intIndex].id === tagActive.id)
			arrTAG[intIndex].className = strActiveClassName;
	}//end of for loop
}//end of classToggleLayerChangeClass()

//counts from view all tags in tagContainer
//It assumes the tagContiner already have the properties
function classToggleLayerCounting(tagContainer,strClassName,strTAGName) {
	var arrTAG = tagContainer.getElementsByTagName(strTAGName);//holds all strTAGName in tagContainer
	var intTag = 0;//holds the number of tags that is using the same class name in the tagContainer
	
	//console.log("ToggleLayerCounting\nContainer: " + arrTAG.length + "\nTag Name: " + strTAGName + "\nNumber of Items: " + arrTAG.length);
	
	//goes around the for each tag that getElementsByTagName found in tagContainter
	for(var intIndex = arrTAG.length - 1; intIndex > -1; intIndex--) {
		//console.log("Tag Class Name: " + arrTAG[intIndex].className + "\nSelected: " + strClassName + "\nNumber of Tags: " + intTag + "\n\n");
		
		//checks if the class name is the same as strClassName and if so then count it to the number of tags with the same class name
		if(arrTAG[intIndex].className === strClassName)
			intTag++;
	}//end of for loop
	
	return intTag;
}//end of classToggleLayerCounting()

/**
 * Show/Hide a Layer
 * @param  {String} strLayerID The Layer that will be show or hide
 */
function displayLayer(strLayerID) {
	var tagLayerID = $("#" + strLayerID);//holds the jquery object of the tag which will be either turn on or off

	//checks if there is a tagLayerID found
	if(tagLayerID !== null) {
		//checks if tagLayerID is already hidhen
		if(tagLayerID.hasClass('divJustHidden') === false)
			//adds the CSS Class to hide the element
			tagLayerID.addClass('divJustHidden');
		else
			//remove the CSS Class to hide the element
			tagLayerID.removeClass('divJustHidden');
	}//end of if
}//end of displayLayer()

//does the display the a message in a on the page weather then an alert
function displayMessage(tagMessage,strMessText,boolAddToBack, boolRemoveNode) {
	//gets the message properties and sets the text furthermore it does the display
	tagMessage = addNode(tagMessage,strMessText,boolAddToBack, boolRemoveNode);
	tagMessage.style.display = "block";	
	
	return tagMessage;
}//end of displayMessage()

/**
 * Turns off the non activate layer and turns on the activate one
 * @param {String} strActiveLayerID   Active Layer that will be turn on
 * @param {String} strNonActiveLayerID Non Active Layer that will be turn off
 */
function duelDisplayLayer (strActiveLayerID, strNonActiveLayerID) {
	var tagActivateLayerID = $("#" + strActiveLayerID);//holds the jquery object of the tag which will turn on
	var tagNonActivateLayerID = $("#" + strNonActiveLayerID);//holds the jquery object of the tag which will turn off

	//checks if there is a tagActivateLayerID found
	if(tagActivateLayerID !== null && tagNonActivateLayerID !== null)
	{
		//remove the CSS Class to hide the element in order reset both to have the same classes
		tagActivateLayerID.removeClass('divJustHidden');
		tagNonActivateLayerID.removeClass('divJustHidden');

		//turns off the non activate since it should be display
		tagNonActivateLayerID.addClass('divJustHidden');
	}//end of if
}//end of duelDisplayLayer()

//this is for the duel layers that sometimes is need
function duelToggleLayer(strActiveID, strNonActiveID) {
	var tagActive = "";//holds the active Layer	
	var tagNonActive = "";//holds the non active layer 

	// this is the way the standards work
	if (strActiveID !== ''){tagActive = $("#" + strActiveID);}
	if (strNonActiveID !== ''){tagNonActive = $("#" + strNonActiveID);}

	//Checks if there is an active layer
	if (tagActive !== "")
	{
		//checks if the tagActive is already active and if so then skips code
		//since the layer cannot be turn off and leave a hole in the review layer
		if(tagActive.hasClass('divJustHidden') === true)
		{
			// adds the class to hide the tagNonActive and remove it from the active one
			tagActive.removeClass("divJustHidden");
			tagNonActive.addClass("divJustHidden");
		}//end of if
	}//end of if
}//end of duelToggleLayer()

//gets the document properties in order to use them as there are many types of browers with different versions
function getDocID(tagLayer) {
	var tagProp = "";//holds the proerties of tagLayer
	
	//gets the whichLayer Properties depending of the differnt bowers the user is using
	if (document.getElementById)//this is the way the standards work
		tagProp = document.getElementById(tagLayer);
	else if (document.all)//this is the way old msie versions work
		tagProp = document.all[tagLayer];
	else if (document.layers)//this is the way nn4 works
		tagProp = document.layers[tagLayer];

	return tagProp;			
}//end of getDocID()

//gets the name of the month base on a number
function getFullMonth(strMonth)
{
	//checks which month number and sets the name instead of a number
    switch(strMonth)
    {
		case "Jan":
		case 1:
		case "1":
		case "01":
			strMonth = "January";
		break;
		case "Feb":
		case 2:
		case "2": 
		case "02":
			strMonth = "Februry";
		break;
		case "Mar":
		case 3:
		case "3": 
		case "03":
			strMonth = "March";
		break;
		case "Apr":
		case 4:
		case "4":
		case "04":
			strMonth = "April";
		break;
		case "May":
		case 5:
		case "5":
		case "05":
			strMonth = "May";
		break;
		case "Jun":
		case 6:
		case "6":
		case "06":
			strMonth = "June";
		break;
		case "Jul":
		case 7:
		case "7":
		case "07":
			strMonth = "July";
		break;
		case "Aug":
		case 8:
		case "8":
		case "08":
			strMonth = "August";
		break;
		case "Sep":
		case 9:
		case "9":
		case "09":
			strMonth = "September";
		break;
		case "Oct":
		case 10:
		case "10":
			strMonth = "October";
		break;
		case "Nov":
		case 11:
		case "11":
			strMonth = "November";
		break;
		case "Dec":
		case 12:
		case "12":
			strMonth = "December";
		break;
    }//end of switch

    return strMonth;
}//end of getMonth()

//gets the select option from tagSelect
function getSelectOption(tagSelect)
{
	var arrSelectOption = new Array(2);//holds the select option the user has choosen
	
	//goes around finding the current seleted value from tagSelection
	for (var intIndex = 0;intIndex < tagSelect.options.length; intIndex++) {
		if (tagSelect.options[intIndex].selected === true) {
			arrSelectOption[0] = tagSelect.options[intIndex].value;
			arrSelectOption[1] = tagSelect.options[intIndex].text;
		}//end of if
	}//end of for loop
	
	return arrSelectOption;
}//end of getSelectOption()

//removes all items starting from intStopIndex from tagSelect
function resetSelectOption(tagSelect, intStopIndex) {
	//goes around remvoes all items in the tagSelect
	for (var intIndex = tagSelect.length; intIndex > intStopIndex; intIndex--) {
		//remvoes the option from drop back
		tagSelect.remove(intIndex);
	}//end of for loop
}//end of resetSelectOption()

//gets the select option from tagSelect
function setSelectOption(tagSelect, strValue)
{
	var strSelectOption = "";//holds the select option the user has choosen
	
	//goes around finding the current seleted value from tagSelection
	for (var intIndex = 0;intIndex < tagSelect.options.length; intIndex++) {
		//checks if this is the value that the use wants to selected
		if (tagSelect.options[intIndex].value === strValue)
			strSelectOption = tagSelect.options[intIndex].selected = true;
	}//end of for loop
	
	return strSelectOption;
}//end of setSelectOption()

//shoes and hides a <div> using display:block/none from the CSS
function toggleLayer(tagLayer,tagGrayOut) {
	var tagStyle = '';//holds the style of tagLayer

	//gets the tagLayer and tagGrayOut Properties
	tagStyle = getDocID(tagLayer);
	tagGrayOut = getDocID(tagGrayOut);
		
	if (tagStyle !== null)
	{tagStyle.style.display = tagStyle.style.display? "":"block";}
	
	if (tagGrayOut !== null)
	{tagGrayOut.style.display = tagGrayOut.style.display? "":"block";}
}//end of toggleLayer()

/**
 * Opens the local email client
 * @param  {String} strToEmail 
 */
function viewEmail(strToEmail) {
	try {
		console.log('View Email: ' + strToEmail);
	
		// opens the local email client with strToEmail poperulated
		window.plugin.email.open({
			to: [strToEmail]
		});
	}// end of try 
	catch(ex) {
		console.log("Error Sending Email: " + ex.message);
	}// end of catch
}//end of viewWebpage()

//views the current RX for this user
function viewWebpage(strURL) {
	console.log('View URL: ' + strURL);
	
    //opens a browser window with the site of the strURL
    var ref = window.open(strURL, '_blank', 'location=no,closebuttoncaption=Close');
}//end of viewWebpage()