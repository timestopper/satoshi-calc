function koef(radio){switch(radio){case"Satoshi":k=1e-8;break;case"micro":k=1e-6;break;case"milli":k=.001;break;case"canti":k=.01;break;default:k=1}return k}function act(){var radio=$("input[name=unit-selector]:checked").val(),curr=$("input[name=currency]:checked").val();k=koef(radio),function(btc){$.ajax({url:"/getbtcchangerate",data:{currency:curr,btc:btc,k:k},success:function(result){var kurs=result.kurs,CHANGE24HOUR=result.CHANGE24HOUR,CHANGEPCT24HOUR=result.CHANGEPCT24HOUR,changeValRaw=result.changeValRaw,result1=result.result1;a=result.a,$("#result").val(accounting.formatMoney(result1,curr,a,",",".","%v %s")),$("#btc_price").html("<strong>"+accounting.formatNumber(kurs,2,",",".")+"</strong> "+curr+"&nbsp"),$("#result_btc").html("<strong>"+(k*btc).toFixed(8)+"</strong>"),0<changeValRaw?($("#change").html("<kbd>"+CHANGE24HOUR+"/ </kbd>"),document.getElementById("change").style.color="green",document.getElementById("percent").style.color="green",document.getElementById("arrow").innerHTML="<img src='images/long-arrow-alt-up-solid.svg' height='15px'>"):($("#change").html("<kbd>"+CHANGE24HOUR+"/ </kbd>"),document.getElementById("change").style.color="red",document.getElementById("percent").style.color="red",document.getElementById("arrow").innerHTML="<img src='images/long-arrow-alt-down-solid.svg' height='15px'>"),$("#percent").html("<kbd>"+CHANGEPCT24HOUR+"</kbd>%")}})}(accounting.unformat(document.getElementById("income").value))}function act2(){var radio=$("input[name=unit-selector]:checked").val(),curr=$("input[name=currency]:checked").val();k=koef(radio);var val,result=accounting.unformat(document.getElementById("result").value);val=result,$.ajax({url:"/getbtcdata",data:{currency:curr,val:val,k:k},success:function(result){result.kurs;var income1=result.income1;b=result.b,$("#income").val(accounting.formatNumber(income1,b,",","."))}})}$("input:radio").change(function(){act()}),$("#income").keyup(function(){act()}),$("#result").keyup(function(){act2()}),act(),window.setInterval("act()",6e4);