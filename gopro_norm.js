const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

var linha1 = '███████ ██████████';
var linha2 = '███████';
var linha3 = '█████████';
var identificou = false;
var Calls = [];
setTimeout(AtualizarCalls, 100);
setInterval(AtualizarCalls, 60000);
function AtualizarCalls(){
    console.log('AtualizarCalls()');
    var linha1_new = linha1;
    var linha2_new = linha2;
    var linha3_new = linha3;

    var Result = false;
    $.getJSON('https://showmodas.com.br/calls.php', function(data) {
        // JSON result in `data` variable
        Calls = data;
        //console.log(Calls);
        const userid = urlParams.get('id');
        if(userid && userid !== '' && parseInt(userid) > 0){
            var Usuario = getCallUserID(userid);
            if(Usuario){
                linha1_new = Usuario.nome+' ('+Usuario.user_id+')';
                linha2_new = Usuario.patente;
                linha3_new = '🚓 '+Usuario.call;
                Result = true;
            }
        }
    });

    setTimeout(function(){
        if(Result){
            if(linha1 != linha1_new) linha1 = linha1_new;
            if(linha2 != linha2_new) linha2 = linha2_new;
            if(linha3 != linha3_new) linha3 = linha3_new;
        }else{
            linha3 = "NENHUMA";
        }
    }, 5 * 1000);
    //console.log('JSON.stringify(Calls): '+JSON.stringify(Calls));
}

function getCallUserID(user_id){
    if(Calls && Calls.length > 0){
        for (var i = 0; i < Calls.length; i++) {
            if(Calls[i] && Calls[i].nome) {
                for (var i2 = 0; i2 < Calls[i].users.length; i2++) {
                    if(Calls[i].users[i2].user_id && Calls[i].users[i2].user_id == user_id && Calls[i].users[i2].patente){
                        return { call: Calls[i].nome, user_id: user_id, nome: Calls[i].users[i2].nome, patente: Calls[i].users[i2].patente }
                    }
                }
            }
        }
    }
    return false;
}

var d,h,m,s;
const monthNames = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

function init(){
    d=new Date();
    h=(d.getHours());
    m=d.getMinutes();
    s=d.getSeconds();
    t=d.toLocaleString('pt-BR', {timeZone: "America/Sao_Paulo", timeZoneName:'short'}).split(' ').pop();
    clock();
    updateDate();
};

function updateTime(){
    d=new Date();
    h=(d.getHours());
    m=d.getMinutes();
    s=d.getSeconds();
    t=d.toLocaleString('pt-BR', {timeZone: "America/Sao_Paulo", timeZoneName:'short'}).split(' ').pop();
}

function clock(){
    s++;
    if(s==60){
        s=0;
        m++;
        if(m==60){
            m=0;
            h++;
            if(h==24){
                h=0;
                updateDate();
            }
        }
        updateTime();
    }
    Zero('sec', s);
    Zero('min', m);
    Zero('hr', h);
    //$('tz', t);
    Zero('day', day);
    Zero('year', year);
    Zero('month', monthNames[month]);
    Zero('linha1', linha1);
    Zero('linha2', linha2);
    Zero('linha3', linha3+' - CENTRAL');
};
setInterval(clock, 1000);

function updateDate(){
    day=d.getDate();
    month=d.getMonth();
    year=d.getFullYear();
};

function Zero(id,val){
    if(val<10){
        val='0'+val;
    }
    document.getElementById(id).innerHTML=val;
};

window.onload=init;