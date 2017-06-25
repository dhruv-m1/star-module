//Written by Dhruv Malik

var Sidebar = {
    getLocations: function(){
        $.get( "api/stock-locations/count", function(res) {
            $.get( `api/stock-locations/0/${res.count}`, function(locations) {
                //Setting to default
                $("#locationName").html(locations[0].name);
                $("#locationid").html(`ID: ${locations[0].locationId}`);

                locations.forEach(function(element) {
                    let layout = `<li class="list-group-item location-choice" locationid="${element.locationId}">${element.name}</li>`;
                    $( "#location-choice-list" ).append(layout);
                }, this);
            });
        }); 
    },

    setLocation: function(obj) {
        $("#locationName").html($(obj).text());
        $("#locationid").html(`ID: ${$(obj).attr("locationid")}`);

        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("_StarModule_Loc_name", $(this).text());
            localStorage.setItem("_StarModule_Loc_id", $(this).attr("locationid"));
        } else {
            alert("Error: Browser out of date.")
        }
    },
    displayToggle: function() {
        $( "#sidebar" ).toggle("slow");
    },
    displayForceShow: function(){
        if ($(window).width() > 767) {
            $( "#sidebar" ).show("slow");
        }
    }

}