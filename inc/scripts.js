jQuery.fn.niceReplace = function($el2) {
    let $prev = $(this).children(":first")
    if ($prev) $prev.css('display', 'none')
    $(this).append($el2)
    if ($prev) $prev.remove()
  } 

  const limit = 10 // amount of items per page
  const fields = "id,thumbnail,title,price,category,description"
  const url = (page) => `https://dummyjson.com/products?limit=${limit}&skip=${(page - 1) * limit}&select=${fields}`
  const col = (d, i) => i === 1 ? $("<td/>").addClass("td-img").append($("<img/>").attr("src", d).addClass("img-fluid")) : $("<td/>").text(d)
  const colH = (d) => $("<th/>").text(d)
  const row = (rd) => Object.values(rd).reduce((tr, v, i) => tr.append(col(v, i)), $("<tr/>"))
  const initTable = (d) => $("<table/>").addClass("table table-bordered")
    .append(Object.keys(d).reduce((thead, k) => $(thead).append(colH(k)), $("<tr/>")))
  const table = (data) => data.reduce((tb, rd, i) => tb.append(row(rd)), initTable(data[0]))
  const active = (n) => {
    Array.from($(".page-item")).forEach((li, i) => {
      if (i === n - 1) $(li).addClass("active")
      else $(li).removeClass("active")
    })
  }

  const paging = (n) => {
    const ul = $("<ul/>").addClass("pagination")
    for (let i = 0; i < n; i++) {
      const a = $("<a/>").addClass("page-link").attr("href", "#").text(i + 1).click((e) => getData(i + 1))
      $(ul).append($("<li/>").addClass("page-item").append(a))
    }
    return ul
  }

  const getData = (p) => {
    $(".lds-ellipsis").toggleClass("d-none")
    fetch(url(p))
      .then((d) => d.json())
      .then((data) => {
        const tb = table(data.products)
        $("#app").niceReplace(tb)
        //$("#app").empty().append(tb)

        $(".lds-ellipsis").toggleClass("d-none")
        active(p) // mark active page button
      })
  }

  $(() => {
    getData(1)
    $("#pager").append(paging(10))

    $(document).on('DOMContentLoaded',()=>{
      console.log('loaded')
    })
  })