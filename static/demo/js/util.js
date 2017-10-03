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
    recieptsCount :0,
    recieptsDisplayed: 0,
    transfersCount :0,
    transfersDisplayed: 0,
    getCount: function(dataset){
        $.get( `/api/${dataset}/count`, function(res) {
            if(dataset === "stock-receipt"){
                logs.recieptsCount = res.count;
            }
            else if(dataset === "plants"){
                logs.transfersCount = res.count;
            }
        });
    },
    getAndAppendStockReceipts: function(){
        $.get( `/api/stock-receipt/${logs.recieptsDisplayed}/${logs.recieptsDisplayed+5}`, function(res) {
            $(res).each(function(index, item){
                let html = `<tr>
                    <td scope="row" class="hidden-xs-down">${item._id}</td>
                    <td>${item.productName}</td>
                    <td><span class="">${item.originName}</span></td>
                    <td>${item.quantity}</td>\
                    <td scope="row">${item.timestamp}</td>
                </tr>`;
                $('#receipts-table tbody').append(html);
                logs.recieptsDisplayed += 5;
            });
        });
    },
    getAndAppendTransfers: function(){
        $.get( `/api/stock-transfer/${logs.transfersDisplayed}/${logs.transfersDisplayed+5}`, function(res) {
            $(res).each(function(index, item){
                let html = `<tr>
                    <td scope="row" class="hidden-xs-down">${item._id}</td>
                    <td>${item.productName}</td>
                    <td><span class="">${item.originName}</span></td>
                    <td>${item.quantity}</td>\
                    <td scope="row">${item.timestamp}</td>
                </tr>`;
                $('#transfers-table tbody').append(html);
                logs.transfersDisplayed += 5;
            });
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
    getMore: function(){
        $('.ShowMore').attr('disabled', 'true');
        $('.ShowMore').html("Working on it...");

        let collection = $('.ShowMore').attr('dataset');
        let total = parseInt($('tbody').attr('count'));
        let showing = parseInt($('tbody').attr('showing'));

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
                $('tbody').attr('showing', showing);
                if(total === showing){
                    $('.ShowMore').attr('disabled', 'true');
                    $('.ShowMore').html("That's All :)");
                }else{
                    $('.ShowMore').removeAttr("disabled");
                    $('.ShowMore').html("Show More");
                }
            }
        });
    },
    search: function(additionFactor){
        
        $('.ShowMore').attr('disabled', 'true');
        $('.ShowMore').attr('search', 'true');
        $('.ShowMore').html("Working on it...");

        let selection = $('.search-select').attr('correspondence');
        let keyword = {field: selection, query: $('#search-keyword').val()}
        let collection = $('.ShowMore').attr('dataset');
        
        let showing = 0;
        showing += additionFactor;

        if(additionFactor === 0){
            $('tbody').html('');
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
                    $('.ShowMore').html("Nothing to display :)");
                }else{
                    $('.ShowMore').removeAttr("disabled");
                    $('.ShowMore').html("Show More");
                }
                if(collection === 'Inventory'){
                    inventory.appendToTable(res);
                }
            }
        });

    }
}