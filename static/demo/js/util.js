//Written by Dhruv Malik

const sidebar = {
    getLocations: function(dashboard){
        $.get( "/api/stock-locations/count", function(res) {
            $.get( `/api/stock-locations/0/${res.count}`, function(locations) {
                //Setting to default
                $("#locationName").html(locations[0].name);
                $("#locationid").html(`ID: ${locations[0].locationId}`);

                sidebar.saveLocation(locations[0].name, locations[0].locationId, dashboard);

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

        sidebar.saveLocation($(obj).text(), $(obj).attr("locationid"), true);
    },
    saveLocation: function(name, id, dashboard) {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.setItem("_StarModule_Loc_name", name);
            sessionStorage.setItem("_StarModule_Loc_id", id);
        } else {
            alert("Error: Browser out of date.")
        }
        
        if(dashboard === true){dashGrid.getSetSpecificData();} // change to callback
    },
    displayToggle: function() {
        $( "#sidebar" ).toggle("slow");
    }

}

const dashGrid = {
    getSetData: function(){
        $.get( "/api/products/count", function(res) {
            $("#infocards-products .card-title").html(res.count);
        }); 
        $.get( "/api/categories/count", function(res) {
            $("#infocards-categories .card-text span").html(res.count);
        });
        $.get( "/api/stock-locations/count", function(res) {
            $("#dash-grid-depots").html(res.count);
        }); 
        $.get( "/api/plants/count", function(res) {
            $("#dash-grid-factories").html(res.count);
        }); 
    },
    getSetSpecificData: function(){
        let loc_id = parseInt(sessionStorage.getItem("_StarModule_Loc_id"));

        $.ajax({
            url:"/api/inventory/0/1",
            type:"POST",
            data: JSON.stringify({ "locationId": loc_id }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#infocards-inventory .card-text span").html(res.count);
            }
        });

        
        $.ajax({
            url:"/api/stock-transfer/0/1",
            type:"POST",
            data: JSON.stringify({ "destinationId": loc_id }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#dash-grid-transferins").html(res.count);
            }
        });

        $.ajax({
            url:"/api/stock-transfer/0/1",
            type:"POST",
            data: JSON.stringify({ "originId": loc_id }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#dash-grid-transferouts").html(res.count);
            }
        });

        $.ajax({
            url:"/api/stock-receipt/0/1",
            type:"POST",
            data: JSON.stringify({ "destinationId": loc_id }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#dash-grid-receipts").html(res.count);
            }
        });
        $.ajax({
            url:"/api/stock-locations/0/1",
            type:"POST",
            data: JSON.stringify({ "locationId": loc_id.toString() }),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $("#infocards-about .card-block").html(`
                    <h4 class="card-title">${res.results[0].name}</h4>
                    <p class="text">${res.results[0].address}</p>
                    <a href="${res.results[0].map_url}" target="_blank">Show on Map</a>
                    <p class="text">Contact: ${res.results[0].contact} (${res.results[0].phone})</p>
                `);
            }
        });

    }
}