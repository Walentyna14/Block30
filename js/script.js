function loadData() {
	var street = $("#street").val();
	var city = $("#city").val();
	var adress= street +","+city;
	// load streetview
	loadStreetView(adress);
	//Load New York Times
	loadNYT(adress); 
	// load wikipedia data
	loadWiki(city);
	return false;
};

$('#form-container').submit(loadData);




function loadStreetView(adress) {
	var mapsURL = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+adress+"&key=AIzaSyBRiOSOEAs1s156dRb9fyO6xiNDQnNwj2U ";
	//$body.append("<img class=\"bgimg\" src=\""+mapsURL+"\">")
	$(".bgimg").attr("src", mapsURL);
	return false;
};

function loadNYT(adress) {
	var $nytHeaderElem = $('#nytimes-header');
	var $nytElem = $('#nytimes-articles');
	$nytElem.text("");
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
		return false;
		}
	}).error(function(e){
		$nytHeaderElem.append("<p>Something is crashed. Try again later.</p>");
		return false;
	});
};

function loadWiki(city) {
	var $wikiElem = $('#wikipedia-links');
	$wikiElem.text("");
	
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&generator=search&search=' + city + '&format=json&callback=?';
	var wikiRequestTimeout = setTimeout(function(){
		$wikiElem.text("failed to get wikipedia resources");
	}, 8000);

	$.getJSON(wikiUrl, function( response ) {
		console.log(response);
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
		});
		return false;
	}