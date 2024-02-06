// On load site - Get coins API and start func to place theme
window.onload = function () {
  $.ajax({
    method: "GET",
    url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc",
  }).done(function (coins) {
    insertCoinList(coins);
  });
};

$("#chartContainer").hide();
$("#aboutSection").hide();
$("#coinCardsSection").show();

// Nav bar Actions
$("#siteLogo, #homePageNav").click(function () {
  $("#coinCardsSection").show();
  $("#chartContainer").hide();
  $("#aboutSection").hide();
  closeNavMobile();
});

$("#liveReportsLink").click(function () {
  $("#chartContainer").show();
  $("#coinCardsSection").hide();
  $("#aboutSection").hide();
  $("#alertSuccess").hide();
  closeNavMobile();
});

$("#aboutNav").click(function () {
  $("#aboutSection").show();
  $("#coinCardsSection").hide();
  $("#chartContainer").hide();
  $("#alertSuccess").hide();
  closeNavMobile();
});

function closeNavMobile() {
  if (window.innerWidth < 991) {
    setTimeout(() => {
      $(".navbar-toggler").click();
    }, 250);
  }
}

// func to place coins on page

function insertCoinList(coins) {
  const coinList = document.getElementById("coinCardsSection");
  coins.forEach((coin, index) => {
    if (index < 100) {
      coin.tampId = makeTempCoinId(20);
      let spinnerId = makeTempCoinId(20);
      let buttonID = makeTempCoinId(20);
      const coinCard = document.createElement("div");
      coinCard.classList.add("card", "m-2", "coinclass");
      coinCard.setAttribute("style", "width: 18rem");
      coinList.appendChild(coinCard);
      coinCard.innerHTML = `
        <div class="card-body">
          <h5 class="card-title d-flex justify-content-between">
            ${coin.symbol}
            <div class="form-check form-switch">
              <input
                class="form-check-input pointer checkbox"
                type="checkbox"
                id="${coin.symbol}"
                onClick="addCoinsForReport('${coin.id}', '${coin.symbol}')"
              />
            </div>
          </h5>
          <h6 class="card-subtitle mb-2 text-muted"> ${coin.name}</h6>
          <button
            class="btn btn-primary mt-2"
            id="${buttonID}"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#${coin.tampId}"
            aria-expanded="false"
            aria-controls="${coin.tampId}"
            onClick="getMoreInfo('${coin.id}','${coin.tampId}','${spinnerId}','${buttonID}')
            buttonTextChange('${buttonID}')"
          >
            More Info
          </button>
          <span
  id="${spinnerId}"
  style="display: none"
  class="spinner-border text-primary"
  role="status"
>
  <span class="visually-hidden">Loading...</span>
</span>
          <div class="collapse" id="${coin.tampId}">
            <p class="card-text mt-4">          
            </p>
          </div>
        </div>
      `;
    }
  });
}

function buttonTextChange(buttonID) {
  $(`#${buttonID}`).text(function (i, text) {
    return text === "Less Info" ? "More Info" : "Less Info";
  });
}

function makeTempCoinId(length) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// second API to get more info on clicked coin and start func to place info
function getMoreInfo(id, tampId, spinnerId, buttonID) {
  $(`#${spinnerId}`).show();
  $(`#${buttonID}`).hide();
  $.ajax({
    method: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${id}`,
    cache: true,
    cacheExpiration: 120000,
  }).done(function (coinInfo) {
    $(`#${spinnerId}`).hide();
    $(`#${buttonID}`).show();
    insertCoinInfo(coinInfo, tampId);
  });
}

// place info in coin card
function insertCoinInfo(coinInfo, tampId) {
  $(`#${tampId}`).html(`
  <p class="card-text mt-4">
  <img
  class="rounded"
  src="${coinInfo.image.small}"
/>
<br />
<br />
<span>Current Price:</span>
<li>${coinInfo.market_data.current_price.usd} &#36;</li>
<li>${coinInfo.market_data.current_price.eur} &#8364;</li>
<li>${coinInfo.market_data.current_price.ils} &#8362;</li>
<br />
<span>Coin Master Rank: # ${coinInfo.coingecko_rank}</span>
    </p>
  `);
}

// set array for coins for report
let coinsForReport = [];

// add coins to array and start validation for array
function addCoinsForReport(id, symbol) {
  checkBox = document.getElementById(`${symbol}`);
  if (checkBox.checked) {
    coinsForReport.push(symbol);
  } else {
    for (var i = 0; i < coinsForReport.length; i++) {
      if (coinsForReport[i] === symbol) {
        coinsForReport.splice(i, 1);
      }
    }
  }
  checkAlertSixCoinsModal();
  checkLengthOfCoinsForReport();
  checkNumberOfCoinsBadge();
}

function checkNumberOfCoinsBadge() {
  $("#badgeNumberOfCoins").text(coinsForReport.length);
}

function checkAlertSixCoinsModal() {
  if (coinsForReport.length == 6) {
    $("#alertSixCoinsModal")
      .removeClass("fade")
      .css("display", "block")
      .addClass("show");
    modalCoinsToDisplay();
  }
}

function modalCoinsToDisplay() {
  $("#modalCoinsToDisplay").append(`
  <div class="modal-body">If you want to add <b>${coinsForReport[5]}</b> coin,
   remove one coin from the list.
  </div>
    <div class="row card">
<div class="card-body">
  <h5 class="card-title">
  ${coinsForReport[0]}
    <div class="form-check form-switch">
      <input
        class="form-check-input pointer checkbox"
        type="checkbox"
        id="${coinsForReport[0]}Modal" checked
      />
    </div>
  </h5>
</div>
</div>

<div class="row card">
<div class="card-body">
  <h5 class="card-title">
  ${coinsForReport[1]}
    <div class="form-check form-switch">
      <input
        class="form-check-input pointer checkbox"
        type="checkbox"
        id="${coinsForReport[1]}Modal" checked
      />
    </div>
  </h5>
</div>
</div>

<div class="row card">
<div class="card-body">
  <h5 class="card-title">
  ${coinsForReport[2]}
    <div class="form-check form-switch">
      <input
        class="form-check-input pointer checkbox"
        type="checkbox"
        id="${coinsForReport[2]}Modal" checked
      />
    </div>
  </h5>
</div>
</div>

<div class="row card">
<div class="card-body">
  <h5 class="card-title">
  ${coinsForReport[3]}
    <div class="form-check form-switch">
      <input
        class="form-check-input pointer checkbox"
        type="checkbox"
        id="${coinsForReport[3]}Modal" checked
      />
    </div>
  </h5>
</div>
</div>

<div class="row card">
<div class="card-body">
  <h5 class="card-title">
  ${coinsForReport[4]}
    <div class="form-check form-switch">
      <input
        class="form-check-input pointer checkbox"
        type="checkbox"
        id="${coinsForReport[4]}Modal" checked
      />
    </div>
  </h5>
</div>
</div>
      `);
}

function popLastCoinFromArray() {
  $("#alertSixCoinsModal")
    .removeClass("show")
    .css("display", "none")
    .addClass("fade");
  $(`#${coinsForReport[5]}`).removeAttr("checked");
  coinsForReport.pop();
  $("#modalCoinsToDisplay").empty();
  checkNumberOfCoinsBadge();
}
let modalCoins = [];

function renderCoinsInArray() {
  let isChecked = $(`#${coinsForReport[0]}Modal`).is(":checked");
  let isChecked2 = $(`#${coinsForReport[1]}Modal`).is(":checked");
  let isChecked3 = $(`#${coinsForReport[2]}Modal`).is(":checked");
  let isChecked4 = $(`#${coinsForReport[3]}Modal`).is(":checked");
  let isChecked5 = $(`#${coinsForReport[4]}Modal`).is(":checked");

  if (isChecked == true) {
    modalCoins.push(coinsForReport[0]);
  } else {
    $(`#${coinsForReport[0]}`).removeAttr("checked");
  }
  if (isChecked2 == true) {
    modalCoins.push(coinsForReport[1]);
  } else {
    $(`#${coinsForReport[1]}`).removeAttr("checked");
  }
  if (isChecked3 == true) {
    modalCoins.push(coinsForReport[2]);
  } else {
    $(`#${coinsForReport[2]}`).removeAttr("checked");
  }
  if (isChecked4 == true) {
    modalCoins.push(coinsForReport[3]);
  } else {
    $(`#${coinsForReport[3]}`).removeAttr("checked");
  }
  if (isChecked5 == true) {
    modalCoins.push(coinsForReport[4]);
  } else {
    $(`#${coinsForReport[4]}`).removeAttr("checked");
  }

  modalCoins.push(coinsForReport[5]);
  renderCoinsForReport();
  return emptyModal();
}

function renderCoinsForReport() {
  return (coinsForReport = [...modalCoins]);
}

function emptyModal() {
  if (coinsForReport.length == 6) {
    $(`#${coinsForReport[5]}`).removeAttr("checked");
    coinsForReport.pop();
  }
  modalCoins.length = 0;
  $("#alertSixCoinsModal")
    .removeClass("show")
    .css("display", "none")
    .addClass("fade");
  $("#modalCoinsToDisplay").empty();
  checkNumberOfCoinsBadge();
}

// validate min number of coins in array for report amd max for alert
function checkLengthOfCoinsForReport() {
  if (coinsForReport.length > 0) {
    $("#liveReportsLink")
      .removeClass("disabled")
      .removeAttr("aria-disabled")
      .removeAttr("tabindex")
      .addClass("active");
    $(liveReportsBlinker).show();
    $("#badgeNumberOfCoins").show();
  } else {
    $("#liveReportsLink")
      .addClass("disabled")
      .attr("aria-disabled", "true")
      .attr("tabindex", "-1")
      .removeClass("active");
    $(liveReportsBlinker).hide();
    $("#badgeNumberOfCoins").hide();
  }

  if (coinsForReport.length == 5) {
    $("#alertSuccess").show();
  } else {
    $("#alertSuccess").hide();
  }
}

// search bar
$("#searchBar").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $(".coinclass").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
  var count = $(".coinclass:visible").length;
  if (count == 0) {
    $("#noResults").show();
  } else {
    $("#noResults").hide();
  }
});

$("form").on("submit", function (event) {
  event.preventDefault();
  $("#noResults").hide();
});

$("form").on("click", function (event) {
  var x = $("form").val();
  if (x == "") {
    $(".coinclass").show();
    $("#noResults").hide();
  }
});

// Live Reports page
function generateChart() {
  function getTime() {
    let time = new Date();
    time.setMilliseconds(00);
    return time.getTime();
  }

  function putCoinsIntoReport() {
    $.ajax({
      method: "GET",
      url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsForReport}&tsyms=USD`,
    }).done(function (coinsReported) {
      const time = getTime();
      Object.entries(coinsReported).forEach(([key, value]) => {
        const dataToUpdate = options.data.find(
          (x) => x.name?.toLowerCase() === key?.toLowerCase()
        );
        dataToUpdate.dataPoints.push({
          x: time,
          y: value["USD"],
        });
      });

      $("#chartContainer").CanvasJSChart().render();
    });
  }

  var options = {
    title: {
      text: "Cryptocurrencies",
    },
    axisX: {
      title: "Live Updates",
    },
    axisY: {
      suffix: "$",
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "top",
      fontSize: 22,
      fontColor: "dimGrey",
      itemclick: toggleDataSeries,
    },
    data: coinsForReport.map((coinName) => ({
      type: "line",
      xValueType: "dateTime",
      yValueFormatString: "###.00$",
      xValueFormatString: "hh:mm:ss TT",
      showInLegend: true,
      name: coinName,
      dataPoints: [],
    })),
  };

  const chart = $("#chartContainer").CanvasJSChart(options);

  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }

  const updateInterval = 2000;
  putCoinsIntoReport();
  let refreshIntervalId = setInterval(function () {
    putCoinsIntoReport();
  }, updateInterval);

  $("#siteLogo, #homePageNav").click(function () {
    clearInterval(refreshIntervalId);
  });
}

(function coinBadgeHandle() {
  if (window.innerWidth < 991) {
    $("#badgeNumberOfCoins").removeClass("start-100").addClass("start-0");
  }
})();
