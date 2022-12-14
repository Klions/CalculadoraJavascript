$(document).ready(function () {
    $(this).tooltip();
});
$("#1 :checkbox").change(function () {
    let textAreaVal = $(".TextoArtigos").val();
    if ($(this).prop("checked") == true) {
        if (!textAreaVal.includes($(this).attr("id"))) {
            textAreaVal += $(this).attr("id") + "\n";
        }
    }
    else {
        if (textAreaVal.includes($(this).attr("id"))) {
            textAreaVal = textAreaVal.replace($(this).attr("id") + "\n", "");
        }
    }


    $(".TextoArtigos").val(textAreaVal);
});


$("#delacao-premiada").focusout(function () {
    var pena_txt = document.getElementById("pena");
    var penaReduzir = 0;
    if ($("#delacao-premiada")[0].value < 0 && $("#delacao-premiada")[0].value > 100) {
        alert("Informe um valor válido entre 0 a 100%")
    }
    if ($("#delacao-premiada")[0].value === "") {
        $("#reu-primario")[0].checked = false;
        $("#reu-confesso")[0].checked = false;
        $("#advogado-30")[0].checked = false;
        $(".advogado-1")[0].style.display = 'none';
        $(".advogado-2")[0].style.display = 'none';
        $(".advogado-3")[0].style.display = 'none';
        recalcularPena();
    }
});

$("#reu-confesso").change(function () {
    var pena_txt = document.getElementById("pena");
    var penaReduzir = 0;

    if ($("#reu-confesso")[0].checked === false) {
        $("#reu-primario")[0].checked = false;
        $("#advogado-30")[0].checked = false;
        $("#delacao-premiada")[0].value = "";
        $(".advogado-1")[0].style.display = 'none';
        $(".advogado-2")[0].style.display = 'none';
        $(".advogado-3")[0].style.display = 'none';
        recalcularPena();
    }

})
$("#reu-primario").change(function () {
    var pena_txt = document.getElementById("pena");
    var penaReduzir = 0;

    if ($("#reu-primario")[0].checked === false) {
        $("#reu-confesso")[0].checked = false;
        $("#advogado-30")[0].checked = false;
        $("#delacao-premiada")[0].value = "";
        $(".advogado-1")[0].style.display = 'none';
        $(".advogado-2")[0].style.display = 'none';
        $(".advogado-3")[0].style.display = 'none';
        recalcularPena();
    }


});
function recalcularPena() {
    var pena_txt = document.getElementById("pena");
    var fianca_txt = document.getElementById("fianca");
    var Fianca = 0;
    var penaRed = $("#pena-reducao")[0].value;
    penaRed = 0;
    var Pena = 0;
    var crimes = document.getElementsByName('crime');
    for (var i = 0; i < crimes.length; i++) {
        if (crimes[i].checked) {
            var valores_crime = crimes[i].value.split("|");
            Pena += parseInt(valores_crime[0]);
            Fianca += parseInt(valores_crime[2]);
            /*Condicional += parseInt(valores_crime[0])*4; */
            Condicional = "NÃO USAR";
        }
    }
    var itens = parseInt(document.getElementById("itens").value);

    if (itens > 0) {
        Pena += 30 * itens;
        Fianca += 65000 * itens;
    }

    /* dinheiro sujo */
    var sujo = parseInt(document.getElementById("sujo").value);
    if (sujo > 0) {
        var unidade_sujo = sujo / 10000;
        if (sujo >= 1000) {
            Fianca += sujo / 100 * 50;

        }
    }
    if($("#mandado")[0].checked == false) {
        if (Pena > 100) {
            Pena = 100;
        }
    } else{
        if (Pena > 500){
            Pena = 500;
        }
    }
    pena_txt.value = Pena;
    if (isNaN(Fianca)) {
        fianca_txt.value = "SEM FIANÇA";
    } else {
        fianca_txt.value = "R$" + Fianca.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
}
$("#advogado-30").change(function () {
    if ($("#advogado-30")[0].checked === true) {
        $(".advogado-1")[0].style.display = 'block';
        $(".advogado-2")[0].style.display = 'block';
        $(".advogado-3")[0].style.display = 'block';
    } else {
        $(".advogado-1")[0].style.display = 'none';
        $(".advogado-2")[0].style.display = 'none';
        $(".advogado-3")[0].style.display = 'none';
        $("#reu-confesso")[0].checked = false;
        $("#reu-primario")[0].checked = false;
        $("#delacao-premiada")[0].value = "";
        recalcularPena();
    }
});

$("#2 :checkbox").change(function () {
    let textAreaVal = $(".TextoArtigos").val();
    if ($(this).prop("checked") == true) {
        if (!textAreaVal.includes($(this).val())) {
            textAreaVal += $(this).attr("id") + "\n";
        }

    }
    else {
        if (textAreaVal.includes($(this).attr("id"))) {
            textAreaVal = textAreaVal.replace($(this).attr("id") + '\n', "");
        }
    }


    $(".TextoArtigos").val(textAreaVal);
});
function calcular() {
    var Pena = 0;
    var Multa = 0;
    var Fianca = 0;
    var Itens = 0;
    var Condicional = "NÃO USAR";

    /* Crimes */
    var crimes = document.getElementsByName('crime');
    for (var i = 0; i < crimes.length; i++) {
        if (crimes[i].checked) {
            var valores_crime = crimes[i].value.split("|");

            Pena += parseInt(valores_crime[0]);
            Multa += parseInt(valores_crime[1]);
            Fianca += parseInt(valores_crime[2]);
            Itens += parseInt(valores_crime[3]);
            /*Condicional += parseInt(valores_crime[0])*4; */
            Condicional = "NÃO USAR";
        }
    }
    var itens = parseInt(document.getElementById("itens").value);

    if (itens > 0) {
        Pena += 35 * itens;
        Multa += 50000 * itens;
        Fianca += 65000 * itens;
    }
    /* dinheiro sujo */
    var sujo = parseInt(document.getElementById("sujo").value);
    if (sujo > 0) {
        var unidade_sujo = sujo / 10000;
        if (sujo >= 1000) {
            Multa += sujo / 100 * 50;
            Fianca += sujo / 100 * 50;

        }
    }if($("#mandado")[0].checked == false) {
        if (Pena > 100) {
            Pena = 100;
            $("#penamaxima")[0].style.display = 'block'
            const timeOut = setTimeout(tirarPena, 3000);
        }
    } else{
        if (Pena > 500){
            Pena = 500;
        }
    }
    
    if (Multa > 1000000) {
        Multa = 1000000
    }
    var pena_txt = document.getElementById("pena");
    pena_txt.value = Pena;
    var multa_txt = document.getElementById("multa");
    multa_txt.value = "R$" + Multa.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    var fianca_txt = document.getElementById("fianca");
    if (isNaN(Fianca)) {
        fianca_txt.value = "SEM FIANÇA";
    } else {
        fianca_txt.value = "R$" + Fianca.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }


    var condicional_txt = document.getElementById("condicional");
    condicional_txt.value = Condicional.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}
function calculoPena() {
    recalcularPena();
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
    var itens = parseInt(document.getElementById("itens").value);
    if (itens > 0) {
        fiancaC += 65000 * itens;
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
        fianca_txt.value = "SEM FIANÇA";}
        else{
            fianca_txt.value = "R$" + fiancaReduzir.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

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
    var crimes = document.getElementsByName('crime');
    for (var i = 0; i < crimes.length; i++) {
        crimes[i].checked = false;
    }
    $("#reu-primario")[0].checked = false
    $("#reu-confesso")[0].checked = false
    $("#advogado-30")[0].checked = false
    $("#mandado")[0].checked = false



    $("#copiado")[0].style.display = 'none'
    $("#delacao-premiada").val(null);


    var drogas = document.getElementById("pena");
    drogas.value = 0;

    var sujo = document.getElementById("multa");
    sujo.value = 0;

    var sujo = document.getElementById("fianca");
    sujo.value = 0;


    var itens = document.getElementById("itens");
    itens.value = "";


    document.getElementById("pena").value = "0";
    document.getElementById("multa").value = "0";
    document.getElementById("sujo").value = "";

    document.getElementById("fianca").value = "0";
    document.getElementById("condicional").value = "NÃO USAR";
    document.getElementById("copy-text").value = "";
    $(".advogado-1")[0].style.display = 'none';
    $(".advogado-2")[0].style.display = 'none';
    $(".advogado-3")[0].style.display = 'none';
    recalcularPena();
}

document.getElementById('copy').addEventListener('click', function () {

    var text = document.getElementById('copy-text');
    text.select();
    document.execCommand('copy');
    $("#copiado")[0].style.display = 'block'
    const timeOut = setTimeout(tirarBloco, 3000);
})
function tirarPena(){
    $("#penamaxima")[0].style.display = 'none';

}
function tirarBloco() {
    $("#copiado")[0].style.display = 'none';
}
