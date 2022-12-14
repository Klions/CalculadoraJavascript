$(document).ready(function () {
    $(this).tooltip();
});

setTimeout(limpar, 100);

$("#reu-confesso, #reu-primario, #temporte, #mandado, #fianca-checkbox").change(function () {
    calcular();
});

$("#perito-checkbox").change(function () {
    if ($("#perito-checkbox")[0].checked) {
        $("#perito_rg")[0].style.display = 'block';
        $("#perito_rg")[0].value = '';
        $("#perito_rg")[0].focus();
    }else{
        $("#perito_rg")[0].style.display = 'none';
    }
    calcular();
});



var timeout_copy = 0;

$("#advogado-30").change(function () {
    if ($("#advogado-30")[0].checked === true) {
        $(".advogado-1")[0].style.display = 'block';
        $(".advogado-2")[0].style.display = 'block';
        $(".advogado-3")[0].style.display = 'block';
        $(".fianca-check")[0].style.display = 'block';
        $(".advogado-rg")[0].style.display = 'block';
        document.getElementById("advogado_rg").focus();
    } else {
        $(".advogado-1")[0].style.display = 'none';
        $(".advogado-2")[0].style.display = 'none';
        $(".advogado-3")[0].style.display = 'none';
        $(".fianca-check")[0].style.display = 'none';
        $(".advogado-rg")[0].style.display = 'none';
        $("#reu-confesso")[0].checked = false;
        $("#reu-primario")[0].checked = false;
        $("#fianca-checkbox")[0].checked = false;
        
        $("#delacao-premiada")[0].value = "0";
    }
    calcular();
});

$(".inputnumber").bind("keypress keyup keydown", function (event) {
    calcular();
});
$("#delacao-premiada").bind("keypress keyup keydown", function (event) {
    if($("#delacao-premiada")[0].value < 0) {
        $("#delacao-premiada")[0].value = 0;
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
            $(".checkdinheirosujo")[0].checked = true;
            $("#needmoneysujo")[0].style.display = 'block';
        }else{
            $(".checkdinheirosujo")[0].checked = false;
            $("#needmoneysujo")[0].style.display = 'none';
        }
    }else{
        $(".checkdinheirosujo")[0].checked = false;
        $("#needmoneysujo")[0].style.display = 'none';
    }

    /* Crimes */
    var crimes = document.getElementsByName('crime');
    for (var i = 0; i < crimes.length; i++) {
        if (crimes[i].checked) {
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
            FormatCrimes+=crimes[i].id+'\n';
            FormatCrimes2+='* '+crimes[i].id+''+desccrimes+'\n';
        }
    }
    
    var ReducaoPena = 0;
    var FormatAtenuantes = '';
    if ($("#advogado-30")[0].checked) {
        ReducaoPena += parseInt(Pena*0.3);
        FormatAtenuantes += '* Advogado Constituído (Redução de 30% na pena)\n';
    }
    if ($("#reu-primario")[0].checked) {
        ReducaoPena += parseInt(Pena*0.2);
        FormatAtenuantes += '* Réu Primário (Redução de 20% na pena)\n';
    }
    if ($("#reu-confesso")[0].checked) {
        ReducaoPena += parseInt(Pena*0.2);
        FormatAtenuantes += '* Réu Confesso (Redução de 20% na pena)\n';
    }
    if ($("#delacao-premiada")[0].value > 0 && $("#delacao-premiada")[0].value <= 100) {
        var DelaValor = parseInt($("#delacao-premiada")[0].value);
        ReducaoPena += parseInt(Pena*(DelaValor*0.01));
        FormatAtenuantes += '* Delação Premiada (Redução de '+$("#delacao-premiada")[0].value+'% na pena)\n';
    }
    if ($("#fianca-checkbox")[0].checked) {
        if(Pena > 1){
            var CalculoPena = parseInt(Pena - 1);
            ReducaoPena = CalculoPena;
            FormatAtenuantes += '* Fiança Paga (Redução total de pena para 1 mês)\n';
        }
    }

    var CalculoPena = parseInt(Pena - ReducaoPena);
    if(CalculoPena < 0) CalculoPena = 0;

    if($("#mandado")[0].checked == false) {
        if (CalculoPena > 100) {
            CalculoPena = 100;
            $("#penamaxima")[0].style.display = 'block'
            //const timeOut = setTimeout(tirarPena, 3000);
        }else{
            $("#penamaxima")[0].style.display = 'none';
        }
    } else{
        if (CalculoPena > 500){
            CalculoPena = 500;
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
    if($("#perito-checkbox")[0].checked) {
        var perito = $("#perito_rg").val();
        if (perito === '') {
            PeritoID = 0;
        }else{
            PeritoID = parseInt(perito);
        }
        
        if(PeritoID <= 0){
            ErroCopy(true, 'COLOQUE O RG DO PERITO');
            EmErro = true;
        }
    }
    var AdvogadoID = 0;
    if ($("#advogado-30")[0].checked) {
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
    if(FormatCrimes === '') FormatCrimes = "Aguardando a seleção de crimes";
    document.getElementById("copy-text").value = FormatCrimes;

    var FormatDiscord = '# INFORMAÇÕES DO PRESO:\n';
    FormatDiscord+= '* Nome: '+Nome_Preso+'\n';
    FormatDiscord+= '* RG: '+RG_Preso+'\n';

    FormatDiscord+= '\n';
    if(CalculoPena > 0){
        FormatDiscord+= '# PENA TOTAL: '+CalculoPena+' MESES';
        if(ReducaoPena > 0){
            FormatDiscord+= ' ('+Pena+' COM REDUÇÃO DE '+ReducaoPena+' MESES)';
        }
        FormatDiscord+= '\n';
    }
    if(Multa > 0){
        FormatDiscord+= '# MULTA: R$ '+Multa.toLocaleString('pt-BR')+'\n';
    }

    // PAGAR FIANÇA
    if ($("#fianca-checkbox")[0].checked) {
        FormatDiscord+= '# FIANÇA: R$ '+Fianca.toLocaleString('pt-BR')+' (PAGA)\n';
    }

    FormatDiscord+= '\n# CRIMES:\n';
    FormatDiscord+= FormatCrimes2;
    if(FormatAtenuantes !== ''){
        FormatDiscord+= '\n# ATENUANTES:\n';
        FormatDiscord+= FormatAtenuantes;
    }

    // PORTE
    FormatDiscord += '\n# 📋 PORTE DE ARMA: '
    if ($("#temporte")[0].checked) {
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
    

    document.getElementById("discord-text").value = '```md\n'+FormatDiscord+'\n```';
}
function calculoPena() {
    var pena = $("#pena-reducao")[0].value;
    var penaReduzir = 0;
    var fiancaReduzir = 0;
    var fiancaC = 0;
    var pena_txt = document.getElementById("pena");
    var crimes = document.getElementsByName('crime');
    var fianca_txt = document.getElementById("fianca");

    for (var i = 0; i < crimes.length; i++) {
        if (crimes[i].checked) {
            var valores_crime = crimes[i].value.split("|");
            fiancaC += parseInt(valores_crime[2]);
        }
    }

    var sujo = parseInt(document.getElementById("sujo").value);
    if (sujo > 0) {
        var unidade_sujo = sujo / 10000;
        if (sujo >= 1000) {
            fiancaC += sujo / 100 * 50;

        }
    }

    if ($("#advogado-30")[0].checked === true) {
        pena = parseInt(pena) + parseInt(30);


        fiancaReduzir = fiancaC * 30 / 100;
        fiancaReduzir = fiancaC - fiancaReduzir;
        if (isNaN(fiancaReduzir)) {
            fianca_txt.value = "INAFIANÇÁVEL";
        }else{
            fianca_txt.value = "R$ " + fiancaReduzir.toLocaleString('pt-BR');
        }

    }
    if ($("#reu-primario")[0].checked === true) {
        pena = parseInt(pena) + parseInt(20);
    }
    if ($("#reu-confesso")[0].checked === true) {
        pena = parseInt(pena) + parseInt(20);
    }
    if ($("#delacao-premiada")[0].value > 0 && $("#delacao-premiada")[0].value < 100) {
        pena = parseInt(pena) + parseInt($("#delacao-premiada")[0].value);
    }
    if (pena > 70) {
        pena = 70;
    }

    penaReduzir = pena_txt.value * pena / 100;
    pena_txt.value = pena_txt.value - penaReduzir;


}
function limpar() {
    document.getElementById("preso_nome").value = "";
    document.getElementById("preso_rg").value = "";
    $("#preso_nome")[0].focus();
    
    var crimes = document.getElementsByName('crime');
    for (var i = 0; i < crimes.length; i++) {
        crimes[i].checked = false;
    }
    $("#reu-primario")[0].checked = false;
    $("#reu-confesso")[0].checked = false;
    $("#fianca-checkbox")[0].checked = false;
    $("#advogado-30")[0].checked = false;
    $("#mandado")[0].checked = false;
    $("#temporte")[0].checked = false;


    $("#copiado")[0].style.display = 'none'
    $("#delacao-premiada").val(0);


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
    document.getElementById("copy-text").value = "";
    $(".advogado-1")[0].style.display = 'none';
    $(".advogado-2")[0].style.display = 'none';
    $(".advogado-3")[0].style.display = 'none';
    $(".fianca-check")[0].style.display = 'none';
    $(".advogado-rg")[0].style.display = 'none';

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