
//NAVIGATION
$(document).ready(function(){
    sidebar.getLocations();
    
});

$(document).on('click','.location-choice',function(){
    if(window.location.pathname.replace(/\//g, '') === 'demo'){
        $.when(sidebar.setLocation(this)).then(dashGrid.getSetSpecificData());
    }
    sidebar.setLocation(this);
});

$(document).on('click','.sidebar-toggle',function(){
   sidebar.displayToggle();
});  

//Custom Triggers

if(window.location.pathname.replace(/\//g, '') === 'demo'){

    let manageSpecificData = setInterval(function(){
        if (typeof sessionStorage != 'undefined'){
            if (sessionStorage['_StarModule_Loc_id']){
                dashGrid.getSetSpecificData();
                clearInterval(manageSpecificData);
            }
        }
    }, 200);

    $.when($(document).ready).then(
        dashGrid.getSetData(),        
    );
}

if(window.location.pathname.replace(/\//g, '') === 'demodirectory'){

    $.when($(document).ready).then(
        $.when(directory.getCount('stock-locations')).then(directory.getAndAppendStockLocations()),
        $.when(directory.getCount('plants')).then(directory.getAndAppendFactories())
    );

}

if(window.location.pathname.replace(/\//g, '') === 'demologs'){

    $.when($(document).ready).then(
        $.when(logs.getCount('stock-receipt')).then(logs.getAndAppendStockReceipts()),
        $.when(logs.getCount('stock-transfer')).then(logs.getAndAppendTransfers())
    );

}
if(window.location.pathname.replace(/\//g, '') === 'demotransfers'){
    $('#transfer-origin').attr('value', sessionStorage.getItem("_StarModule_Loc_id"));
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