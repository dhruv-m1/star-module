
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

if(window.location.pathname.replace(/\//g, '') === 'demologs'){

    $.when($(document).ready).then(
        $.when(logs.getCount('stock-receipt')).then(logs.getAndAppendStockReceipts()),
        $.when(logs.getCount('stock-transfer')).then(logs.getAndAppendTransfers())
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
    let searchState = $('.ShowMore').attr('search');
    if(searchState === 'false'){
        universal.getMore();
    }else{
        universal.search(10);
    }
})
$('.search-button').click(function(){
    universal.search(0);
})
