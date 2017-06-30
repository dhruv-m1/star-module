
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
        $.when(directory.getCount()).then(directory.getAndAppendStockLocations())
    );

    


}
