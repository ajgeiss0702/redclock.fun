
var lastQuote = "";
async function updateQuote(quoteId = -1) {
  var url = "/api/quotes/index.php";
  if(quoteId >= 0) {
    url = "/api/quotes/index.php?id="+quoteId;
  }
  var d = await httpGet(url);
  lastQuote = d;
  setQuote(lastQuote);
}
function setQuote(quote) {
  if($('#quote-text').length == 0) return;
  var themeadd = "";
  if(rcf.theme != "light") {
    themeadd = "-white";
  }
  $('#quote-copy').popover('hide');
  $('#quote-reload').popover('hide');
  $('#quote-container').html(`
    <span class="quote-buttons">
      <a id='quote-copy' data-trigger="hover" data-placement="bottom" data-toggle="popover" data-content="Copy this quote to your clipboard"><img class="quote-button" src="/img/icons/copy-content`+themeadd+`.svg" onclick="copyQuote()"></a>
      <a id='quote-reload' data-trigger="hover" data-placement="bottom" data-toggle="popover" data-content="Get a new quote"><img class="quote-button" src="/img/icons/reload`+themeadd+`.svg" onclick="updateQuote()"></a>
    </span><br>
    <span id='quote-text'></span>
    `);
    $('#quote-text').text(quote);
    $('#quote-text').html($('#quote-text').html().replace("—", "<br>—"));
    $(function () {
      $('[data-toggle="popover"]').popover()
    })
}

setInterval(updateQuote, 12*60*60e3);

function copyQuote() {
  var copy = $("#copy-input")[0];
  copy.value = $('#quote-text').html().replace("<br>", " \n");
  //console.log("[copy] value: "+copy.value);
  copy.select();
  copy.setSelectionRange(0, 99999);
  document.execCommand("copy");
  $('#quote-copy').popover('hide');
  $('#quote-copy').attr("data-content", "Copied!");
  $('#quote-copy').popover('show');
  setTimeout(() => {
    $('#quote-copy').popover('hide');
    $('#quote-copy').attr("data-content", "Copy this quote to your clipboard");
    setQuote(lastQuote);
  }, 2e3);
}

rcf.on('pageload', () => {
  setTimeout(updateQuote, 500)
})
