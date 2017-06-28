
//NAVIGATION
$(document).ready(function(){
    sidebar.getLocations(false);
    dashGrid.getSetData();
});

$(document).on('click','.location-choice',function(){
    sidebar.setLocation(this);
});

$(document).on('click','.sidebar-toggle',function(){
   sidebar.displayToggle();
});  