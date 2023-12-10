document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#data-container");
  const pageUl = document.querySelector(".pagination");
  const itemShow = document.querySelector("#itemperpage");
  let tr = Array.from(document.querySelectorAll(".p_column"));
  let emptyBox = tr.slice();
  let index = 1;
  let itemPerPage = 4;
  let lastPage;

  const searchFilter = document.getElementById("search-filter");
  const categoryFilter = document.getElementById("category-filter");
  const typeFilter = document.getElementById("type-filter");

  itemShow.addEventListener("change", giveTrPerPage);

  function giveTrPerPage() {
    itemPerPage = Number(this.value);
    index = 1;
    displayPage(itemPerPage);
    pageGenerator(itemPerPage);
    getpagElement(itemPerPage);
  }

  function displayPage(page) {
    tbody.innerHTML = "";
    const start = (index - 1) * page;
    const end = start + page;
    const current_page = emptyBox.slice(start, end);
    current_page.forEach((item) => tbody.appendChild(item));
    pageUl.querySelectorAll(".list").forEach((n) => n.remove());
  }

  function pageGenerator(getem) {
    const num_of_tr = emptyBox.length;
    if (num_of_tr <= getem) {
      pageUl.style.display = "none";
    } else {
      pageUl.style.display = "flex";
      const num_Of_Page = Math.ceil(num_of_tr / getem);
      for (let i = 1; i <= num_Of_Page; i++) {
        const li = document.createElement("li");
        li.className = "list";
        const a = document.createElement("a");
        a.href = "#main";
        a.innerText = i;
        a.setAttribute("data-page", i);
        li.appendChild(a);
        pageUl.insertBefore(li, pageUl.querySelector(".next"));
      }
    }
  }

  function getpagElement(val) {
    const pageLink = pageUl.querySelectorAll("a");
    const pageLi = pageUl.querySelectorAll(".list");
    pageLi.forEach((li, i) => {
      li.addEventListener("click", () => {
        index = i + 1;
        pageMaker(index, val, pageLi);
      });
    });
    lastPage = pageLink.length - 2;
    pageLi.forEach((li) => li.classList.remove("active"));
    pageLi[index - 1]?.classList.add("active");
    pageRunner(pageLink, val, pageLi);
  }

  function pageRunner(page, items, active) {
    page.forEach((button, i) => {
      button.onclick = (e) => {
        const page_num = e.target.getAttribute("data-page");
        const page_mover = e.target.getAttribute("id");
        if (page_num != null) {
          index = page_num;
        } else {
          if (page_mover === "next") {
            index++;
            if (index > lastPage) {
              index = lastPage;
            }
          } else {
            index--;
            if (index < 1) {
              index = 1;
            }
          }
        }
        pageMaker(index, items, active);
      };
    });
  }

  function pageMaker(index, item_per_page, activePage) {
    const start = item_per_page * (index - 1);
    const end = start + item_per_page;
    const current_page = emptyBox.slice(
      start,
      end > emptyBox.length ? emptyBox.length : end
    );
    tbody.innerHTML = "";
    current_page.forEach((item) => tbody.appendChild(item));
    activePage.forEach((e) => e.classList.remove("active"));
    if (index > 0 && index <= activePage.length) {
      activePage[index - 1]?.classList.add("active");
    }
  }

  function handleFilter() {
    const searchText = searchFilter.value.toLowerCase();
    const categoryValue = categoryFilter.value.toLowerCase();
    const typeValue = typeFilter.value.toLowerCase();

    const filteredItems = tr.filter((item) => {
      const itemName = item
        .querySelector(".card-title h4")
        .innerText.toLowerCase();
      const itemCategory = item.getAttribute("data-category").toLowerCase();
      const itemType = item.getAttribute("data-type").toLowerCase();

      const matchSearch = itemName.includes(searchText);
      const matchCategory =
        categoryValue === "all" || itemCategory === categoryValue;
      const matchType = typeValue === "all" || itemType === typeValue;

      return matchSearch && matchCategory && matchType;
    });

    emptyBox = filteredItems;
    index = 1;
    displayPage(itemPerPage);
    pageGenerator(itemPerPage);
    getpagElement(itemPerPage);
  }

  // Event listener untuk filter
  searchFilter.addEventListener("input", handleFilter);
  categoryFilter.addEventListener("change", handleFilter);
  typeFilter.addEventListener("change", handleFilter);

  // Initialize on page load
  displayPage(itemPerPage);
  pageGenerator(itemPerPage);
  getpagElement(itemPerPage);
});
