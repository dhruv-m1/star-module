//Written by Dhruv Malik

const directory = {
    stockLocationsCount :0,
    stockLocationsDisplayed: 0,
    factoriesCount :0,
    factoriesDisplayed: 0,
    getCount: function(dataset){
        $.get( `/api/${dataset}/count`, function(res) {
            if(dataset === "stock-locations"){
                directory.stockLocationsCount = res.count;
            }
            else if(dataset === "plants"){
                directory.factoriesCount = res.count;
            }
        });
    },
    getAndAppendStockLocations: function(){
        $.get( `/api/stock-locations/${directory.stockLocationsDisplayed}/${directory.stockLocationsDisplayed+5}`, function(res) {
            $(res).each(function(index, location){
                let html = `<tr>
                    <th scope="row" class="hidden-xs-down">${location._id.match(new RegExp('.{1,5}', 'g')).join(" ")}</th>
                    <td>${location.name}</td>
                    <td><span class="hidden-xs-down">${location.address}<br></span> <a href="${location.map_url}" target="_blank">Show on Map</a></td>
                    <td>${location.contact} (${location.phone})</td>
                </tr>`;
                $('#depots-table tbody').append(html);
                directory.stockLocationsDisplayed += 5;
            });
        });
    },
    getAndAppendFactories: function(){
        $.get( `/api/plants/${directory.factoriesDisplayed}/${directory.factoriesDisplayed+5}`, function(res) {
            $(res).each(function(index, location){
                let html = `<tr>
                    <th scope="row" class="hidden-xs-down">${location._id}</th>
                    <td>${location.name} (${location.owner})</td>
                    <td><span class="hidden-xs-down">${location.address}<br></span> <a href="${location.map_url}" target="_blank">Show on Map</a></td>
                    <td>${location.contact} (${location.phone})</td>
                </tr>`;
                $('#factories-table tbody').append(html);
                directory.factoriesDisplayed += 5;
            });
        });
    }
}

const logs = {
    appendToReceiptsTable: function(res){

        res.forEach(function(item, index){
            $("#tbody-StockReceipt").append(`<tr scope="row">
                <td class="hidden-xs-down">${res[index]._id}</td>
                <td>${ res[index].productName }</td>
                <td>${ res[index].quantity }</td>
                <td>${ res[index].originId }</td>
            </tr>`);
        });
    },
    appendToTransfersTable: function(res){

        res.forEach(function(item, index){
            $("#tbody-StockTransfer").append(`<tr scope="row">
                <td class="hidden-xs-down">${res[index]._id}</td>
                <td>${ res[index].productName }</td>
                <td>${ res[index].quantity }</td>
                <td>${ res[index].originId }</td>
            <td>
                <a href="/demo/transfers/print/packingslip/${ res[index]._id }"><button type="button" class="btn btn-secondary btn-sm">Transfer</button></a>
            </td>
            </tr>`);
        });
    }
}

const inventory = {
    appendToTable: function(res){
        res.forEach(function(item, index){
            $("tbody").append(`<tr scope="row">
                                    <td class="hidden-xs-down">${res[index].productId}</td>
                                    <td>${ res[index].productName }</td>
                                    <td>${ res[index].quantity }</td>
                                <td>
                                    <a href="/demo/transfers/register?origin=${  $('#locationid span').html() }&productid=${res[index].productId}"><button type="button" class="btn btn-secondary btn-sm">Transfer</button></a>
                                </td>
                                </tr>`);
        });
    }
}

const transfers = {

    register: function(){

        if(transfers.getParam('origin') ===  $("#destinationId").val()){
            alert("Cannot Transfer to Origin");
        }else{
            let count = 0;
            let request_batches = [];
            let request_batchQuantity = [];
            let available_batches = $('tbody').attr('batches').split(',');


            while(count < available_batches.length){
                
                if($(`#${available_batches[count]}`).val() != 0){

                    request_batches.push(available_batches[count]);
                    request_batchQuantity.push($(`#${available_batches[count]}`).val());
                }
                count += 1;
            }

            let request = {
                productId: `${transfers.getParam('productid')}`,
                originId: `${transfers.getParam('origin')}`,
                destinationId: $("#destinationId").val(),
                batches: request_batches,
                batchQuantity: request_batchQuantity

            }

            $.ajax({
                url:"/api/send",
                type:"POST",
                data: JSON.stringify(request),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(res){
                    if(res.status === 'Success'){
                        let slip = window.open("/demo/transfers/print/packingslip/"+res.code, '_blank');
                        slip.focus();
                        window.location = "/demo/transfers/";
                    }else{
                        alert(res.status);
                    }
                }
            });
        }

        return false;
            
    },
    getParam: function(name){
        if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
    }

}

const universal = {
    getMore: function(ShowMoreBtn){
        $(ShowMoreBtn).attr('disabled', 'true');
        $(ShowMoreBtn).html("Working on it...");

        let collection = $(ShowMoreBtn).attr('dataset');
        let tableid = `#tbody-${collection}`;
        let total = parseInt($(tableid).attr('count'));
        let showing = parseInt($(tableid).attr('showing'));

         $.ajax({
            url:`/api/${collection}/${showing}/10`,
            type:"GET",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                if(collection === 'Inventory'){
                    inventory.appendToTable(res);
                }

                showing += res.length;
                $(tableid).attr('showing', showing);
                if(total === showing){
                    $(ShowMoreBtn).attr('disabled', 'true');
                    $(ShowMoreBtn).html("That's All :)");
                }else{
                    $(ShowMoreBtn).removeAttr("disabled");
                    $(ShowMoreBtn).html("Show More");
                }
            }
        });
    },
    search: function(additionFactor){

        let collection = $('.search').attr('dataset');
        let ShowMoreBtn = '.ShowMore[dataset='+collection+']';
        let tableid = `#tbody-${collection}`;
        
        $(ShowMoreBtn).attr('disabled', 'true');
        $(ShowMoreBtn).attr('search', 'true');
        $(ShowMoreBtn).html("Working on it...");

        let selection = $('.search-select').attr('correspondence');
        let keyword = {field: selection, query: $('#search-keyword').val()}
        
        let showing = 0;
        showing += additionFactor;

        if(additionFactor === 0){
            $(tableid).html('');
        }

        if(keyword.query === ''){
            window.location.reload(true);
        }

        $.ajax({
            url:`/api/${collection}/${showing}/10`,
            type:"POST",
            data: JSON.stringify(keyword),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                if(res.length === 0){
                    $(ShowMoreBtn).html("Nothing to display :)");
                }else{
                    $(ShowMoreBtn).removeAttr("disabled");
                    $(ShowMoreBtn).html("Show More");
                }
                if(collection === 'Inventory'){
                    inventory.appendToTable(res);
                }else if(collection === 'StockReceipt'){
                    logs.appendToReceiptsTable(res);
                }else if(collection === 'StockTransfer'){
                    logs.appendToTransfersTable(res);
                }
            }
        });

    }
}