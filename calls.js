var Calls = [];
setTimeout(AtualizarCalls, 1000);
setInterval(AtualizarCalls, 60000);
function AtualizarCalls(){
    $.getJSON('calls.php', function(data) {
        // JSON result in `data` variable
        Calls = data;
        //console.log(Calls);
    });
    //console.log('JSON.stringify(Calls): '+JSON.stringify(Calls));
}