
//NAVIGATION
$(document).ready(function(){
    Sidebar.getLocations();
});

$(document).on('click','.location-choice',function(){
    Sidebar.setLocation(this);
});

$(document).on('click','.sidebar-toggle',function(){
   Sidebar.displayToggle();
});  
$(window).resize(function() {
    Sidebar.displayForceShow();
});