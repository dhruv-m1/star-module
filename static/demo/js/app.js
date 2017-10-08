
//NAVIGATION
$(document).ready(function(){
    //sidebar.getLocations();
});
//Custom Triggers

if(window.location.pathname.replace(/\//g, '') === 'demodirectory'){

    $.when($(document).ready).then(
        //$.when(directory.getCount('stock-locations')).then(directory.getAndAppendStockLocations()),
        //$.when(directory.getCount('plants')).then(directory.getAndAppendFactories())
    );

}

if(window.location.pathname.replace(/\//g, '') === 'demotransfers'){
    $('#transfer-origin').attr('value', $('#locationid span').html());
}


if(window.location.pathname.replace(/\//g, '') === 'demoscan'){
     $('#reader').html5_qrcode(function(data){
 		 console.log(data);
 	},
 	function(error){
		console.log(error);
	}, function(videoError){
		//the video stream could be opened
	}
);
}

$('.ShowMore').click(function(){
    let searchState = $(this).attr('search');
    if(searchState === 'false'){
        universal.getMore(this);
    }else{
        universal.search(10);
    }
})
$('.search-button').click(function(){
    universal.search(0);
})
$('.table-toggle').click(function(){
    $('.search').attr('dataset', $(this).attr('dataset'));
})
