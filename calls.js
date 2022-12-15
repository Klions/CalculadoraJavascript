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
function getCallUserDiscord(user_id){
    if(Calls && Calls.length > 0){
        for (var i = 0; i < Calls.length; i++) {
            if(Calls[i] && Calls[i].nome) {
                for (var i2 = 0; i2 < Calls[i].users.length; i2++) {
                    if(Calls[i].users[i2].user_id && Calls[i].users[i2].user_id == user_id){
                        return Calls[i];
                    }
                }
            }
        }
    }
    return false;
}