
function loadData() {
	var $body = $('body');
	var $wikiElem = $('#wikipedia-links');
	var $nytHeaderElem = $('#nytimes-header');
	var $nytElem = $('#nytimes-articles');
	var $greeting = $('#greeting');
	// clear out old data before new request
	$wikiElem.text("");
	$nytElem.text("");
	// Addres
	var street = $("#street").val();
	var city = $("#city").val();
	var adress= street +","+city;
	// load streetview
	var mapsURL = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+adress+"&key=AIzaSyBRiOSOEAs1s156dRb9fyO6xiNDQnNwj2U ";
	//$body.append("<img class=\"bgimg\" src=\""+mapsURL+"\">")
	$(".bgimg").attr("src", mapsURL);
	
	// load NY articles data
	var urlNY = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + adress + "&sort=newest&api-key=bf1a1fa67b464a09a809f0d806696f84"
	$.getJSON( urlNY, function( data ) {
		
		$nytHeaderElem.text("NY Articles about "+ adress);
		articles = data.response.docs;
		if(articles.length==0)
				$nytHeaderElem.append("<p>We don't have any aricles about "+adress+"</p>");
		else{
			for(var i=0;i<articles.length; i++){
			var article = articles[i];
			$nytElem.append('<li class="article"'+'<a href="'+article.web_url+'"><h3>'+article.headline.main+'</h3></a><p>'+article.snippet+'</p></li>');
		}
		}
	}).error(function(e){
		$nytHeaderElem.append("<p>Something is crashed. Try again later.</p>");
	});
	
	// load wikipedia data
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback';
	var wikiRequestTimeout = setTimeout(function(){
		$wikiElem.text("failed to get wikipedia resources");
	}, 8000);

	$.ajax({
		url: wikiUrl,
		dataType: "jsonp",
		jsonp: "callback",
		success: function( response ) {
			var articleList = response[1];
			if(articleList.length==0)
				$wikiElem.append("<p>We don't have any aricles about "+city+"</p>");
			else{
				for (var i = 0; i < articleList.length; i++) {
					articleStr = articleList[i];
					var url = 'http://en.wikipedia.org/wiki/' + articleStr;
					$wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
				}

			};

			clearTimeout(wikiRequestTimeout);
		}
	});

	return false;
};

$('#form-container').submit(loadData);
