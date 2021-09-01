$('input:radio').change(function(){act();});
$('#income').keyup(function(){act()});
$('#result').keyup(function(){act2()});

function koef(radio){
switch (radio){
	case 'Satoshi': k=0.00000001;
	break;
	case 'micro': k=0.000001;
	break;
	case 'milli': k=0.001;
	break;
	case 'canti': k=0.01;
	break;
	default: k=1;
}
return k;
}

function act(){
var radio=$('input[name=unit-selector]:checked').val();
var curr=$('input[name=currency]:checked').val();
k=koef(radio);

var btc=accounting.unformat(document.getElementById("income").value);
function ex(btc){
$.ajax({
  url: "/getbtcchangerate",
  data: {currency: curr, btc: btc, k: k},
  success: function( result ) {

    var kurs = result.kurs;
    var CHANGE24HOUR = result.CHANGE24HOUR;
    var CHANGEPCT24HOUR = result.CHANGEPCT24HOUR;
    var changeValRaw = result.changeValRaw;
    var result1 = result.result1;
    a = result.a;


    $( "#result" ).val( accounting.formatMoney(result1, curr, a, ",", ".", "%v %s"));
  	$( "#btc_price" ).html( "<strong>" + accounting.formatNumber( kurs, 2, ",", "." ) + "</strong>" + " " + curr + "&nbsp");
    $( "#result_btc" ).html( "<strong>" + (k*btc).toFixed(8) + "</strong>" );

    if ( changeValRaw > 0 ) {
      $( "#change" ).html( "<kbd>" + CHANGE24HOUR + "/" + " " + "</kbd>");
      document.getElementById("change").style.color = "green";
      document.getElementById("percent").style.color = "green";
      document.getElementById("arrow").innerHTML="<img src='images/long-arrow-alt-up-solid.svg' height='15px'>";


    } else {
      $( "#change" ).html( "<kbd>" + CHANGE24HOUR  + "/" + " " + "</kbd>");
      document.getElementById("change").style.color = "red";
      document.getElementById("percent").style.color = "red";
      document.getElementById("arrow").innerHTML="<img src='images/long-arrow-alt-down-solid.svg' height='15px'>";

   };

    $( "#percent" ).html( "<kbd>" + CHANGEPCT24HOUR + "</kbd>" + "%");
   }
});
};
ex(btc);
};

function act2(){
var radio=$('input[name=unit-selector]:checked').val();
var curr=$('input[name=currency]:checked').val();
k=koef(radio);
var result=accounting.unformat(document.getElementById("result").value);
function ex2(val){
$.ajax({
  url: "/getbtcdata",
  data: {currency: curr, val: val, k: k},
  success: function( result ) {

    var kurs = result.kurs;
    var income1 = result.income1;
    b = result.b;

    $( "#income" ).val( accounting.formatNumber(income1, b, ",", "."));
    // $( "#income" ).val( income1.toFixed(6));
   }
});
};
ex2(result);
};
act()
window.setInterval("act()",60000);