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
	return false; //Needed
};

$('#form-container').submit(loadData);

function loadStreetView(adress) {
	var mapsURL = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+adress+"&key=AIzaSyBRiOSOEAs1s156dRb9fyO6xiNDQnNwj2U ";
	$(".bgimg").attr("src", mapsURL);

};

function fetchData(url, successFunction, errorFunction){
	$.getJSON( url, successFunction).errorFunction;
	
}

function loadNYT(adress) {
	var $nytHeaderElem = $('#nytimes-header');
	var $nytElem = $('#nytimes-articles');
	$nytElem.text("");
	var urlNY = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + adress + "&sort=newest&api-key=bf1a1fa67b464a09a809f0d806696f84"
	function success( data ) {
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
	}
	function error(e){
		$nytHeaderElem.append("<p>Something is crashed. Try again later.</p>");
	};
	
	fetchData(urlNY, success, error);
};

function loadWiki(city) {
	var $wikiElem = $('#wikipedia-links');
	$wikiElem.text("");
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&generator=search&search=' + city + '&format=json&callback=?';
	function success ( data ) {
		var articleList = data[1];
		if(articleList.length==0)
			$wikiElem.append("<p>We don't have any aricles about "+city+"</p>");
		else{
			for (var i = 0; i < articleList.length; i++) {
				articleStr = articleList[i];
				var url = 'http://en.wikipedia.org/wiki/' + articleStr;
				$wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
			}
		};
	}
	function error (e){
		$wikiElem.append('<p>Something is wrong. Try again later.</p>');
	};
	fetchData(wikiUrl, success, error);
}