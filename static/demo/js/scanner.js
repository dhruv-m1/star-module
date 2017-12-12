let scanner = new Instascan.Scanner({ video: document.getElementById('QR-Scanner') });
scanner.addListener('scan', function (content) {
    content = JSON.parse(content);
    document.getElementById("audio").play();
    $("#all-log tbody").prepend(`<tr><td>${content.id}</td><td id="${content.log}${content.id}-status">Pending</td><td id="${content.log}${content.id}-product">(-)</td><td id="${content.log}${content.id}-qty">(-)</td></tr>`);
    
    content.scanLocationId = $('#locationid span').html();

    $.ajax({
            url:"/api/receive",
            type:"POST",
            data: JSON.stringify(content),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(res){
                $(`#${content.log}${content.id}-status`).html(res.status);

                if(res.status === "Success"){
                    $(`#${content.log}${content.id}-product`).html(res.product);
                    $(`#${content.log}${content.id}-qty`).html(res.quantity);
                }else if(res.status === "Rejected"){
                    $(`#${content.log}${content.id}-status`).addClass("table-danger");
                }else{
                    $(`#${content.log}${content.id}-status`).addClass("table-warning");
                }
            }
    });
    
});
Instascan.Camera.getCameras().then(function (cameras) {
if (cameras.length > 0) {
    scanner.start(cameras[0]);
} else {
    console.error('Could not find a camera.');
}
}).catch(function (e) {
    console.error(e);
});