
//NAVIGATION
$(document).ready(function() {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});
//Custom Triggers

if(window.location.pathname.replace(/\//g, '') === 'demotransfers'){
    $('#transfer-origin').attr('value', $('#locationid span').html());
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
