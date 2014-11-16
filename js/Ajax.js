//checks if there is a connection
function checkConnection()
{
   // console.log("Connection Type: " + navigator.connection.type);
   
   //checks if the app is online
   if(navigator.connection.type === Connection.NONE)
   {
      //turns on the 404 section when there is no 
      classToggleLayer(getDocID("bodyApp"), getDocID("section404"), 'divJustHidden sectionBody', 'section');

      //Set timer to try again automiclly.
      setTimeout(function()
      {
         //reloads the page again
            window.location = 'index.html';
      }, 5000);

      return false;
   }//end of if

   return true;
}//end of checkConnection()

//decodes str to be a normal string in order to read it
function decodeURL(strDecode)
{
     return unescape(strDecode.replace(/\+/g, " "));
}//end of decodeURL()

//encodes str to a URL so it can be sent over the URL address
function encodeURL(strEncode)
{
   var strResult = "";
   
   for (var intIndex = 0; intIndex < strEncode.length; intIndex++)
   {
      if (strEncode.charAt(intIndex) === " ") 
         strResult += "+";
      else 
         strResult += strEncode.charAt(intIndex);
   }//end of for loop
   
   return escape(strResult);
}//end of encodeURL()

//gives the user the message has been sent or not and changes the pop area
function endMessage(strMessageID, tagBody, boolDisplayErrorMessage, strErrorMessage)
{
   //checks if there is a message if so then reset it
   if(strMessageID !== "")
      //resets the message
      displayMessage(strMessageID, "", true, true);
      
   //checks if there is a body if so then display it again
   if(tagBody !== null)
      //turn back on the body
      tagBody.style.display = '';
   
   //checks if the error message should be display 
   if(boolDisplayErrorMessage === true)
   {     
      //checks if there is a message
      if(strMessageID !== "")
         displayMessage(strMessageID, strErrorMessage, true, true);
      else
         navigator.notification.alert('Error has occur.',alertDismissed);
         
      console.log("Error Message: " + strErrorMessage);
   }//end of if
   
   //checks if there is divLoadingGrayBG is one if so then turn it off
   if(getDocID('divLoadingGrayBG').style.display === "block")
      //turns off the Loading screen and tells the user that what want wrong
      toggleLayer('divLoadingScreen', 'divLoadingGrayBG');
}//end of endMessage()

//set up the form to not be used while sending the message
function preSend(strMessageID, strLoadingScreenText) {
   try {
      console.log(strLoadingScreenText);

      // checks if there is a message if so then reset it
      if(strMessageID !== "")
         // resets the message
         displayMessage(strMessageID,"",true,true);
   }// end of try
   catch(ex) {
      console.log("Error: " + ex.message);

      return false;
   }// end of catch
      
   return true;
}// end of preSend()

/**
 * Gets the banners from the server as it is where the uer can tell what will be display to the user
 * @param  {String} strFileName        
 * @param  {String} strMessageID       
 * @param  {Object} tagBannerContainer 
 * @return {Bool}
 */
function getBanners(strFileName, strMessageID, tagBannerContainer) {
try {
      var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

      //Abort any currently active request.
      htmlJavaServerObject.abort();

      //checks if there a connection also it sets the page for send to the Server
      if(preSend(strMessageID, "Getting Banners") === false)
         return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(strMessageID, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // console.log("From Server Banners: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) {                     
                      var jsonDataFromServer = $.parseJSON(strFromServerMassage);//hold the json data from the server
                      var strActullyBannerThatWillBeDisplayInHeader = "<div id='divBanner' class='glidecontentwrapper'>\n";

                      // goes around for each item in the json
                      $.each(jsonDataFromServer, function(JSONDataKey, JSONDataValue) {
                        strActullyBannerThatWillBeDisplayInHeader += "<div class='glidecontent'>\n" + 
                          "<a href='javascript:void(0);' onClick='viewWebpage(&quot;" + JSONDataValue. + "&quot;);'>" + 
                            "<img src='" + window.localStorage.getItem("strDomainName") + "images/Banners/" + JSONDataValue. + "' alt='" + JSONDataValue. + "'>\n" +
                          "</a>\n" + 
                        "</div>\n\n";
                      });

                      // displays the banner to the user
                      tagBannerContainer.html(strActullyBannerThatWillBeDisplayInHeader + "<div id='p-select' class='glidecontenttoggler divBannerDescFooter'></div>\n" +
                              "<div class='customFooter'></div>\n" +
                          "</div>\n" +
                      "</div>");
                      
                      // turns on the banner
                      featuredcontentglider.init({
                        gliderid: 'divBanner',
                        contentclass: 'glidecontent',
                        togglerid: 'p-select',
                        remotecontent: '',
                        selected: 0,
                        persiststate: false,
                        speed: 300,
                        direction: 'rightleft',
                        autorotate: true,
                        autorotateconfig: [7000, 9999]
                      });
                    }// end of if
                    else
                        //tells the user that there is an error with the Server
                        endMessage(strMessageID, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(strMessageID, null, true, "Error Banners From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(strMessageID, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send();
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(strMessageID, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}// end of getBanners()

/**
 * gets the either news or events articles from the server
 * @param  {String} strFileName          
 * @param  {String} strMessageID
 * @param  {Object} tagArticlesContainer 
 * @param  {Object} intArticlesType      
 * @return {Bool}
 */
function getArticles(strFileName, strMessageID, tagArticlesContainer, intArticlesType) {
    try {
      var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

      //Abort any currently active request.
      htmlJavaServerObject.abort();

      //checks if there a connection also it sets the page for send to the Server
      if(preSend(strMessageID, "Getting Articles " + intArticlesType) === false)
         return false;

      // resets the container
      tagArticlesContainer.innerHTML = "";

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(strMessageID, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // console.log("From Server Articles: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) {                     
                      var jsonDataFromServer = $.parseJSON(strFromServerMassage);//hold the json data from the server

                      // goes around for each item in the json
                      $.each(jsonDataFromServer, function(JSONDataKey, JSONDataValue) {
                        var datePostArticle = new Date(JSONDataValue.);// holds the post date of the article

                          tagArticlesContainer.innerHTML += "<div class='divNewsFeedEntry'>\n" + 
                          "<div class='divNewsFeedEntryDate'>\n" + 
                                "<time datetime='" + datePostArticle.toISOString() + "'>" + getFullMonth(datePostArticle.getMonth() + 1) + " " + datePostArticle.getDate() + ", " + datePostArticle.getFullYear() + "</time>\n" + 
                            "</div>\n" + 
                            "<div class='divNewsFeedEntryTitle'>\n" + 
                                "<a href='javascript:void(0);' onclick='getArticlesDetails(&quot;" + strFileName + "&quot;, &quot;" + strMessageID + "&quot;, " + intArticlesType + ", " + JSONDataValue. + ", getDocID(&quot;lblArticleTitle&quot;), getDocID(&quot;timeArticleDate&quot;), getDocID(&quot;imgArticleImage&quot;), $(&quot;#divArticleBody&quot;), $(&quot;#aAddToCal&quot;));'>" + JSONDataValue. + "</a>\n" +
                            "</div>\n" + 
                            "<div class='divNewsFeedEntryContent'>\n" + 
                                "<div class='divReadMore'>\n" + 
                                    "<a href='javascript:void(0);' onclick='getArticlesDetails(&quot;" + strFileName + "&quot;, &quot;" + strMessageID + "&quot;, " + intArticlesType + ", " + JSONDataValue. + ", getDocID(&quot;lblArticleTitle&quot;), getDocID(&quot;timeArticleDate&quot;), getDocID(&quot;imgArticleImage&quot;), $(&quot;#divArticleBody&quot;), $(&quot;#aAddToCal&quot;));' class='aGreenButton'>Read More</a>\n" +
                                "</div>\n" + 
                            "</div>\n" + 
                        "</div>\n\n";
                      }); 

                      // checks which type article the function is populoating and go to that section
                      if(intArticlesType === 1) {
                        // goes to the news section
                        changeSection('News', intArticlesType);

                        // set strCurrentArticleType to the article type that is current being used
                        window.localStorage.setItem('strCurrentArticleType', 'News');
                      }//end of if
                      else {
                        // goes to the news section
                        changeSection('Events', intArticlesType);

                        // set strCurrentArticleType to the article type that is current being used
                        window.localStorage.setItem('strCurrentArticleType', 'Events');
                      }//end of else
                    }// end of if
                    else
                        //tells the user that there is an error with the Server
                        endMessage(strMessageID, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(strMessageID, null, true, "Error Articles From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(strMessageID, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("intArticlesType=" + intArticlesType);
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(strMessageID, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getArticles()

/**
 * gets the articles details  
 * @param  {String} strFileName      
 * @param  {String} strMessageID 
 * @param  {Int}    intArticlesType
 * @param  {Int}    intArticlesID
 * @param  {Object} tagArticlesTitle 
 * @param  {Object} tagArticlesDate  
 * @param  {Object} tagArticleImage  
 * @param  {Object} tagArticleBody
 * @param  {Object} tagAddToCal
 * @return {Bool}                  
 */
function getArticlesDetails(strFileName, strMessageID, intArticlesType, intArticlesID, tagArticlesTitle, tagArticlesDate, tagArticleImage, tagArticleBody, tagAddToCal) {
    try {
      var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

      //Abort any currently active request.
      htmlJavaServerObject.abort();

      //checks if there a connection also it sets the page for send to the Server
      if(preSend(strMessageID, "Getting Articles " + intArticlesType) === false)
         return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(strMessageID, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // console.log("From Server Articles Details: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) {                     
                      var jsonDataFromServer = $.parseJSON(strFromServerMassage);//hold the json data from the server
                      var datePostArticle = new Date(jsonDataFromServer[0].);// holds the post date of the article

                      // sets the details of the article
                      tagArticlesTitle.innerHTML = jsonDataFromServer[0].;
                      tagArticlesDate.innerHTML = getFullMonth(datePostArticle.getMonth() + 1) + " " + datePostArticle.getDate() + ", " + datePostArticle.getFullYear();
                      tagArticlesDate.datetime = datePostArticle.toISOString();
                      tagArticleBody.html(tagArticleBody.html(decodeURL(jsonDataFromServer[0].)).text());

                      // checks if the article type is event as it can be add to the calendard
                      if (intArticlesType === 2) {
                          // removes the click event from the last time
                          tagAddToCal.unbind("click");
                          
                          // add to the calendor event
                          tagAddToCal.click(function () {
                              addToCal(datePostArticle, new Date(jsonDataFromServer[0].), jsonDataFromServer[0].);
                          });

                          // adds the link to add to calendard to the view
                          tagAddToCal.removeClass('divJustHidden');
                      }// end of if
                      else
                        // removes the link for adding to calendar because this article type does not requer it
                          tagAddToCal.addClass('divJustHidden');

                      // checks if there is a image 
                      if(jsonDataFromServer[0]. !== "") {
                        tagArticleImage.src = window.localStorage.getItem("strDomainName") + "images/articles/" + jsonDataFromServer[0].;
                        tagArticleImage.alt = jsonDataFromServer[0].;

                        // adds the image to the view
                        $("#" + tagArticleImage.id).removeClass('divJustHidden');
                      }// end of if
                      else
                        // removes the image from view since it is not being sued
                        $("#" + tagArticleImage.id).addClass('divJustHidden');

                      // sets the current article type number because in order to go back to the main section of which other type the user is in
                      window.localStorage.setItem('intCurrentArticleType', parseInt(intArticlesType));

                      // goes to the article details section
                      changeSection('ArticleDetails', intArticlesType);
                    }// end of if
                    else
                        //tells the user that there is an error with the Server
                        endMessage(strMessageID, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(strMessageID, null, true, "Error Article Details From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(strMessageID, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("intArticlesType=" + intArticlesType + "&intArticlesID=" + intArticlesID);
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(strMessageID, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getArticles()