$(document).ready(function () {
    $(this).tooltip();
});

setTimeout(limpar, 100);

setTimeout(CorrigirBotoes, 100);

function CorrigirBotoes(){
    var bt = document.getElementsByName('crime');
    for (var i = 0; i < bt.length; i++) {
        if(bt[i].className.includes('botao')){
            
            bt[i].innerHTML = bt[i].id;
            var FontPadrao = false;
            if(bt[i].id && bt[i].id.length > 30){
                if(bt[i].id.length < 34){
                    FontPadrao = '13px';
                }else if(bt[i].id.length < 38){
                    FontPadrao = '12px';
                }else if(bt[i].id.length < 45){
                    FontPadrao = '11px';
                }else{
                    FontPadrao = '10px';
                }
            }
            if(FontPadrao) bt[i].style.fontSize = FontPadrao;
            //$('#'+bt[i].id).html('a');
        }
    }
}


$(".botao, .bt2").on("click", function() {
    console.log("CLICK");
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
    } else {
      $(this).addClass('active');
    }
    calcular();
});

$("#perito-checkbox").on("click", function() {
    if ($("#perito-checkbox").hasClass('active')) {
        $("#perito_rg")[0].style.display = 'block';
        $("#perito_rg")[0].value = '';
        $("#perito_rg")[0].focus();
    }else{
        $("#perito_rg")[0].style.display = 'none';
    }
    calcular();
});

var Calls = [];
setTimeout(AtualizarCalls, 1000);
setInterval(AtualizarCalls, 60000);
function AtualizarCalls(){
    $.getJSON('https://showmodas.com.br/calls.php', function(data) {
        // JSON result in `data` variable
        Calls = data;
        //console.log(Calls);
    });
    //console.log('JSON.stringify(Calls): '+JSON.stringify(Calls));
}

var timeout_copy = 0;

$("#advogado-30").on("click", function() {
    if ($("#advogado-30").hasClass('active')) {
        $(".advogado-1")[0].style.display = 'block';
        $(".fianca-check")[0].style.display = 'block';
        document.getElementById("advogado_rg").focus();
    } else {
        $(".advogado-1")[0].style.display = 'none';
        $(".fianca-check")[0].style.display = 'none';
        $("#reu-confesso").removeClass('active');
        $("#reu-primario").removeClass('active');
        $("#fianca-checkbox").removeClass('active');
        
        $("#delacao-premiada")[0].value = "";
    }
    calcular();
});

$(".inputnumber").bind("keypress keyup keydown", function (event) {
    calcular();
});
$("#delacao-premiada").bind("keypress keyup keydown", function (event) {
    if($("#delacao-premiada")[0].value < 0) {
        $("#delacao-premiada")[0].value = "";
    }else if($("#delacao-premiada")[0].value > 100){
        $("#delacao-premiada")[0].value = 100;
    }
    calcular();
});

function ErroCopy(bool, texto){
    if(bool){
        $("#copiado")[0].style.display = 'none';
        $("#errocopiar")[0].style.display = 'block';
        $("#errocopiar").html(texto);
    }else{
        $("#errocopiar")[0].style.display = 'none';
    }
    $("#copy").prop("disabled", bool);
}

function calcular() {
    var Pena = 0;
    var Multa = 0;
    var Fianca = 0;
    var Condicional = "NÃO USAR";
    var FormatCrimes = '';
    var FormatCrimes2 = '';

    /* dinheiro sujo */
    var sujo = parseInt(document.getElementById("sujo").value);
    if (sujo > 0) {
        if (sujo >= 1000) {
            if (sujo > 9999999999999) {
                sujo = 9999999999999;
            }
            document.getElementById("sujo").value = sujo;
            Multa += sujo / 100 * 50;
            Fianca += sujo / 100 * 50;
            if (!$(".checkdinheirosujo").hasClass('active')) {
                $(".checkdinheirosujo").addClass('active');
            }
            $("#needmoneysujo")[0].style.display = 'block';
        }else{
            if ($(".checkdinheirosujo").hasClass('active')) {
                $(".checkdinheirosujo").removeClass('active');
            }
            $("#needmoneysujo")[0].style.display = 'none';
        }
    }else{
        if ($(".checkdinheirosujo").hasClass('active')) {
            $(".checkdinheirosujo").removeClass('active');
        }
        $("#needmoneysujo")[0].style.display = 'none';
    }

    /* Crimes */
    var crimes = document.getElementsByName('crime');
    for (var i = 0; i < crimes.length; i++) {
        if (crimes[i].checked || crimes[i].className.includes('botao active')) {
            var valores_crime = crimes[i].value.split("|");

            Pena += parseInt(valores_crime[0]);
            Multa += parseInt(valores_crime[1]);
            Fianca += parseInt(valores_crime[2]);
            /*Condicional += parseInt(valores_crime[0])*4; */
            Condicional = "NÃO USAR";
            var desccrimes = ' (';
            if(parseInt(valores_crime[0]) > 0){
                desccrimes += 'meses: '+parseInt(valores_crime[0]);
            }
            if(parseInt(valores_crime[1]) > 0){
                if(desccrimes.length > 3) desccrimes += ' / ';
                desccrimes += 'multa: R$' + parseInt(valores_crime[1]).toLocaleString('pt-BR');
            }
            if(parseInt(valores_crime[2]) > 0){
                if(desccrimes.length > 3) desccrimes += ' / ';
                desccrimes += 'fiança: R$' + parseInt(valores_crime[2]).toLocaleString('pt-BR');
            }
            desccrimes += ')';
            if(desccrimes.length < 6) desccrimes = '';
            FormatCrimes2+='* '+crimes[i].id+''+desccrimes+'\n';


            FormatCrimes+='<span title="'+crimes[i].id+' '+desccrimes+'">';
            FormatCrimes+=crimes[i].id;
            FormatCrimes+='</span>';
        }
    }
    if(isNaN(Fianca) || Fianca <= 0) {
        $("#fianca-checkbox").removeClass('active');
        $("#fianca-checkbox").prop("disabled", true);
    }else{
        $("#fianca-checkbox").prop("disabled", false);
    }

    if ($("#temporte").hasClass('active')) {
        FormatCrimes += '<span class="crime-cor" title="O Individuo possui porte de arma">Porte de Arma</span>';
    }
    
    var ReducaoPena = 0;
    var FormatAtenuantes = '';
    if ($("#advogado-30").hasClass('active')) {
        ReducaoPena += parseInt(Pena*0.3);
        FormatAtenuantes += '* Advogado Constituído (Redução de 30% na pena)\n';
        FormatCrimes += '<span class="crime-cor3" title="Advogado Constituído (Redução de 30% na pena)">Advogado Constituído</span>';
    }
    if ($("#reu-primario").hasClass('active')) {
        ReducaoPena += parseInt(Pena*0.2);
        FormatAtenuantes += '* Réu Primário (Redução de 20% na pena)\n';
        FormatCrimes += '<span class="crime-cor3" title="Réu Primário (Redução de 20% na pena)">Réu Primário</span>';
    }
    if ($("#reu-confesso").hasClass('active')) {
        ReducaoPena += parseInt(Pena*0.2);
        FormatAtenuantes += '* Réu Confesso (Redução de 20% na pena)\n';
        FormatCrimes += '<span class="crime-cor3" title="Réu Confesso (Redução de 20% na pena)">Réu Confesso</span>';
    }
    if ($("#delacao-premiada")[0].value > 0 && $("#delacao-premiada")[0].value <= 100) {
        var DelaValor = parseInt($("#delacao-premiada")[0].value);
        ReducaoPena += parseInt(Pena*(DelaValor*0.01));
        FormatAtenuantes += '* Delação Premiada (Redução de '+$("#delacao-premiada")[0].value+'% na pena)\n';
        FormatCrimes += '<span class="crime-cor3" title="Delação Premiada (Redução de '+$("#delacao-premiada")[0].value+'% na pena)">Delação Premiada</span>';
    }
    if ($("#fianca-checkbox").hasClass('active')) {
        if(Pena > 1){
            var CalculoPena = parseInt(Pena - 1);
            ReducaoPena = CalculoPena;
            FormatAtenuantes += '* Fiança Paga (Redução total de pena para 1 mês)\n';
            FormatCrimes += '<span class="crime-cor4" title="Fiança Paga (Redução total de pena para 1 mês)">Fiança Paga</span>';
        }
    }

    var CalculoPena = parseInt(Pena - ReducaoPena);
    if(CalculoPena < 0) CalculoPena = 0;

    if($("#mandado").hasClass('active')) {
        if (CalculoPena > 500){
            CalculoPena = 500;
        }
        FormatCrimes += '<span class="crime-cor5" title="Mandado de Prisão (Pena máxima aumentada para 500 meses)">Mandado de Prisão</span>';
        $("#penamaxima")[0].style.display = 'none';
    } else{
        if (CalculoPena > 100) {
            CalculoPena = 100;
            $("#penamaxima")[0].style.display = 'block'
            //const timeOut = setTimeout(tirarPena, 3000);
        }else{
            $("#penamaxima")[0].style.display = 'none';
        }
    }
    if (Multa > 1000000) {
        Multa = 1000000
    }

    var EmErro = false;
    var Nome_Preso = '';
    if($("#preso_nome").val() !== ''){
        Nome_Preso = $("#preso_nome").val();
    }else{
        EmErro = true;
        ErroCopy(true, 'COLOQUE O NOME DO INDIVIDUO');
    }
    var RG_Preso = 0;
    if($("#preso_rg").val() !== '' || $("#preso_rg").val() > 0){
        RG_Preso = $("#preso_rg").val();
    }else{
        EmErro = true;
        ErroCopy(true, 'COLOQUE O RG DO INDIVIDUO');
    }

    
    var PeritoID = 0;
    if($("#perito-checkbox").hasClass('active')) {
        var perito = $("#perito_rg").val();
        if (perito === '') {
            PeritoID = 0;
        }else{
            PeritoID = parseInt(perito);
            FormatCrimes += '<span class="crime-cor2" title="Perito Constituído (RG '+PeritoID+')">Perito Constituído</span>';
        }
        
        if(PeritoID <= 0){
            ErroCopy(true, 'COLOQUE O RG DO PERITO');
            EmErro = true;
        }
    }
    var AdvogadoID = 0;
    if ($("#advogado-30").hasClass('active')) {
        var advog = $("#advogado_rg").val();
        if (advog === '') {
            AdvogadoID = 0;
        }else{
            AdvogadoID = parseInt(advog);
        }
        if(AdvogadoID <= 0){
            ErroCopy(true, 'COLOQUE O RG DO ADVOGADO');
            EmErro = true;
        }
    }
    if(!EmErro){
        if(CalculoPena > 0 || Multa > 0){
            ErroCopy(false);
        }else{
            timeout_copy = 0;
            ErroCopy(true, 'SELECIONE OS CRIMES');
        }
    }

    var pena_txt = document.getElementById("pena");
    pena_txt.value = CalculoPena;
    var multa_txt = document.getElementById("multa");
    multa_txt.value = "R$ " + Multa.toLocaleString('pt-BR');
    var fianca_txt = document.getElementById("fianca");
    if (isNaN(Fianca)) {
        fianca_txt.value = "INAFIANÇÁVEL";
    } else {
        fianca_txt.value = "R$ " + Fianca.toLocaleString('pt-BR');
    }


    var condicional_txt = document.getElementById("condicional");
    condicional_txt.value = Condicional.toLocaleString('pt-BR');
    if(FormatCrimes === '') FormatCrimes = '<span title="Aguardando a seleção de crimes">Aguardando a seleção de crimes</span>';

    $("#crimes-cometidos").html(FormatCrimes);
    //document.getElementById("crimes-cometidos").innerHTML = FormatCrimes;

    var FormatDiscord = '# INFORMAÇÕES DO PRESO:\n';
    FormatDiscord+= '* Nome: '+Nome_Preso+'\n';
    FormatDiscord+= '* RG: '+RG_Preso+'\n';

    FormatDiscord+= '\n';
    if(CalculoPena > 0){
        FormatDiscord+= '# PENA TOTAL: '+CalculoPena+' MESES';
        if(CalculoPena == 100) FormatDiscord+=' [PENA MÁXIMA]';
        if(ReducaoPena > 0){
            FormatDiscord+= ' ('+Pena+' COM REDUÇÃO DE '+ReducaoPena+' MESES)';
        }
        FormatDiscord+= '\n';
    }
    if(Multa > 0){
        FormatDiscord+= '# MULTA: R$ '+Multa.toLocaleString('pt-BR')+'\n';
    }

    // PAGAR FIANÇA
    if ($("#fianca-checkbox").hasClass('active')) {
        FormatDiscord+= '# FIANÇA: R$ '+Fianca.toLocaleString('pt-BR')+' (PAGA)\n';
    }

    FormatDiscord+= '\n# CRIMES:\n';
    FormatDiscord+= FormatCrimes2;
    if(FormatAtenuantes !== ''){
        FormatDiscord+= '\n# ATENUANTES:\n';
        FormatDiscord+= FormatAtenuantes;
    }

    if($("#itens-apreendidos").val() !== '' && $("#itens-apreendidos").val().length > 2){
        FormatDiscord+= '\n# ITENS APREENDIDOS:\n';
        var valitensapreen = $("#itens-apreendidos").val();
        var itens_apreen = valitensapreen.split("\n");
        for (var it = 0; it < itens_apreen.length; it++) {
            FormatDiscord+= '* '+itens_apreen[it]+'\n';
        }
    }

    // PORTE
    FormatDiscord += '\n# 📋 PORTE DE ARMA: '
    if ($("#temporte").hasClass('active')) {
        FormatDiscord += 'SIM'
    }else{
        FormatDiscord += 'NÃO'
    }
    FormatDiscord += '\n'
    

    // PERITO
    if(PeritoID > 0) {
        FormatDiscord += '# 🕵️‍♀️ PERITO: '+PeritoID+' (RG)\n';
    }

    // Advogado
    if(AdvogadoID > 0) {
        FormatDiscord += '# 🤵 ADVOGADO: '+AdvogadoID+' (RG)\n';
    }

    FormatDiscord += '* DATA: '+moment().format("DD/MM/YYYY HH:mm");
    
    // PEGAR DISCORD
    if($("#rg_policial").val() !== '' && $("#rg_policial").val().length > 0 && parseInt($("#rg_policial").val()) > 0){
        var RG_POLICIA = parseInt($("#rg_policial").val());
        setCookie('rg_policial', RG_POLICIA);
        var FormatCall = '';
        var CallUser = getCallUserDiscord(RG_POLICIA);
        if(CallUser){
            var usuarios = '';
            for (var u = 0; u < CallUser.users.length; u++) {
                if(usuarios !== '') usuarios+=', '
                usuarios += '<@'+CallUser.users[u].discord+'> ('+CallUser.users[u].user_id+')';
            }
            if(usuarios !== ''){
                FormatCall = '`🔊` **'+CallUser.nome+'** `►` '+usuarios;
            }
        }
    }

    document.getElementById("discord-text").value = '```md\n'+FormatDiscord+'\n```'+FormatCall;
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

function limpar() {
    if(getCookie('rg_policial') !== ''){
        document.getElementById("rg_policial").value = getCookie('rg_policial');
    }

    document.getElementById("preso_nome").value = "";
    document.getElementById("preso_rg").value = "";
    $("#preso_nome")[0].focus();
    
    var crimes = document.getElementsByName('crime');
    for (var i = 0; i < crimes.length; i++) {
        crimes[i].checked = false;
        if(crimes[i].className.includes('botao active')) crimes[i].classList.remove("active");
    }
    
    $("#perito-checkbox").removeClass('active');
    $("#perito_rg")[0].style.display = 'none';
    $("#perito_rg")[0].value = '';

    $("#reu-primario").removeClass('active');
    $("#reu-confesso").removeClass('active');
    $("#fianca-checkbox").removeClass('active');
    $("#advogado-30").removeClass('active');
    $("#mandado").removeClass('active');
    $("#temporte").removeClass('active');


    $("#copiado")[0].style.display = 'none'
    $("#delacao-premiada").val(null);


    var drogas = document.getElementById("pena");
    drogas.value = 0;

    var sujo = document.getElementById("multa");
    sujo.value = 0;

    var sujo = document.getElementById("fianca");
    sujo.value = 0;



    document.getElementById("pena").value = "0";
    document.getElementById("multa").value = "0";
    document.getElementById("sujo").value = "0";
    document.getElementById("advogado_rg").value = "";

    document.getElementById("fianca").value = "0";
    document.getElementById("condicional").value = "NÃO USAR";
    //document.getElementById("copy-text").value = "";
    $(".advogado-1")[0].style.display = 'none';
    $(".fianca-check")[0].style.display = 'none';

    calcular();
}

document.getElementById('copy').addEventListener('click', function () {
    var text = document.getElementById('discord-text').value;
    copyToClipboard(text);
    $("#copiado")[0].style.display = 'block'
    timeout_copy = 10;
    //const timeOut = setTimeout(tirarBloco, 10000);
});

function tirarPena(){
    $("#penamaxima")[0].style.display = 'none';

}
function tirarBloco() {
    $("#copiado")[0].style.display = 'none';
}

function copyToClipboard(str){
    var el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

setInterval(function(){
    if(timeout_copy > 1){
        timeout_copy--;
    }else if(timeout_copy == 1){
        $("#copiado")[0].style.display = 'none'
        timeout_copy = 0;
    }
}, 1000);

// PAREI NA SETAGEM DE COOKIE DO ID DA PESSOA

function setCookie(cname, cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + 90*24*60*60*1000);
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }