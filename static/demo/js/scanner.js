let scanner = new Instascan.Scanner({ video: document.getElementById('QR-Scanner') });
scanner.addListener('scan', function (content) {
    content = JSON.parse(content);
    document.getElementById("audio").play();
    $("#all-log tbody").prepend(`<tr><td>${content.id}</td><td>Pending</td></tr>`);
    
    //send the request



    $('#scan-all').css('max-height',$('#QR-Scanner').height());
});
Instascan.Camera.getCameras().then(function (cameras) {
if (cameras.length > 0) {
    scanner.start(cameras[0]);
} else {
    console.error('No cameras found.');
}
}).catch(function (e) {
    console.error(e);
});