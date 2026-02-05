const API_URL = "https://api.escuelajs.co/api/v1/products";

let allProducts = [];
let filteredProducts = [];

let currentPage = 1;
let pageSize = 10;

let sortTitleAsc = true;
let sortPriceAsc = true;

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const pageSizeSelect = document.getElementById("pageSize");

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");

const pageInfo = document.getElementById("pageInfo");
const countInfo = document.getElementById("countInfo");

const sortTitleBtn = document.getElementById("sortTitleBtn");
const sortPriceBtn = document.getElementById("sortPriceBtn");

const btnExportCSV = document.getElementById("btnExportCSV");
const btnOpenCreate = document.getElementById("btnOpenCreate");

const detailModal = new bootstrap.Modal(document.getElementById("detailModal"));
const createModal = new bootstrap.Modal(document.getElementById("createModal"));

/* ---------------------------
  LOAD DATA
---------------------------- */
async function fetchProducts() {
  try {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">
          <div class="spinner-border"></div>
        </td>
      </tr>
    `;

    const res = await fetch(API_URL);
    const data = await res.json();

    allProducts = data;
    filteredProducts = [...allProducts];

    currentPage = 1;
    renderTable();
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger py-4">
          Load API failed!
        </td>
      </tr>
    `;
  }
}

/* ---------------------------
  FILTER SEARCH
---------------------------- */
function applySearch() {
  const keyword = searchInput.value.trim().toLowerCase();

  filteredProducts = allProducts.filter((p) =>
    (p.title || "").toLowerCase().includes(keyword)
  );

  currentPage = 1;
  renderTable();
}

/* ---------------------------
  SORT
---------------------------- */
function sortByTitle() {
  filteredProducts.sort((a, b) => {
    const t1 = (a.title || "").toLowerCase();
    const t2 = (b.title || "").toLowerCase();

    if (t1 < t2) return sortTitleAsc ? -1 : 1;
    if (t1 > t2) return sortTitleAsc ? 1 : -1;
    return 0;
  });

  sortTitleAsc = !sortTitleAsc;
  currentPage = 1;
  renderTable();
}

function sortByPrice() {
  filteredProducts.sort((a, b) => {
    const p1 = Number(a.price || 0);
    const p2 = Number(b.price || 0);
    return sortPriceAsc ? p1 - p2 : p2 - p1;
  });

  sortPriceAsc = !sortPriceAsc;
  currentPage = 1;
  renderTable();
}

/* ---------------------------
  PAGINATION
---------------------------- */
function getTotalPages() {
  return Math.ceil(filteredProducts.length / pageSize) || 1;
}

function goPrev() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

function goNext() {
  if (currentPage < getTotalPages()) {
    currentPage++;
    renderTable();
  }
}

/* ---------------------------
  RENDER TABLE
---------------------------- */
function renderTable() {
  const totalPages = getTotalPages();

  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const viewData = filteredProducts.slice(start, end);

  countInfo.innerText = `${filteredProducts.length} items`;
  pageInfo.innerText = `Page ${currentPage} / ${totalPages}`;

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  tableBody.innerHTML = "";

  viewData.forEach((p) => {
    const tr = document.createElement("tr");

    // Tooltip description khi hover
    tr.setAttribute("data-bs-toggle", "tooltip");
    tr.setAttribute("data-bs-placement", "top");
    tr.setAttribute("data-bs-custom-class", "desc-tooltip");
    tr.setAttribute("title", p.description || "(No description)");

    tr.innerHTML = `
      <td class="fw-bold">${p.id}</td>
      <td>${escapeHTML(p.title)}</td>
      <td>$${p.price}</td>
      <td>${escapeHTML(p.category?.name || "")}</td>
      <td>${renderImages(p.images)}</td>
    `;

    // Click row -> open detail modal
    tr.addEventListener("click", () => openDetailModal(p.id));

    tableBody.appendChild(tr);
  });

  // bật tooltip bootstrap
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}

/* ---------------------------
  IMAGES RENDER
---------------------------- */
function renderImages(images) {
  if (!images || images.length === 0) return "";

  const img1 = images[0];
  return `
    <div class="d-flex gap-2">
      <img src="${img1}" class="img-thumb" onerror="this.style.display='none'"/>
      <span class="text-muted small">(${images.length})</span>
    </div>
  `;
}

/* ---------------------------
  CSV EXPORT (current view)
---------------------------- */
function exportCSVCurrentView() {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const viewData = filteredProducts.slice(start, end);

  const headers = ["id", "title", "price", "category", "images"];

  const rows = viewData.map((p) => [
    p.id,
    safeCSV(p.title),
    p.price,
    safeCSV(p.category?.name || ""),
    safeCSV(JSON.stringify(p.images || [])),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `products_page_${currentPage}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}

/* ---------------------------
  DETAIL MODAL
---------------------------- */
async function openDetailModal(id) {
  detailModal.show();

  const loading = document.getElementById("detailLoading");
  const form = document.getElementById("detailForm");

  loading.classList.remove("d-none");
  form.classList.add("d-none");

  try {
    const res = await fetch(`${API_URL}/${id}`);
    const p = await res.json();

    document.getElementById("detailId").value = p.id;
    document.getElementById("detailTitle").value = p.title || "";
    document.getElementById("detailPrice").value = p.price || 0;
    document.getElementById("detailCategoryId").value = p.category?.id || 1;
    document.getElementById("detailCategoryName").value = p.category?.name || "";
    document.getElementById("detailDesc").value = p.description || "";
    document.getElementById("detailImages").value = JSON.stringify(p.images || []);

    renderDetailImages(p.images || []);

    loading.classList.add("d-none");
    form.classList.remove("d-none");
  } catch (err) {
    console.error(err);
    loading.classList.add("d-none");
    form.classList.remove("d-none");
    alert("Load detail failed!");
  }
}

function renderDetailImages(images) {
  const wrap = document.getElementById("detailPreviewImages");
  wrap.innerHTML = "";

  images.forEach((img) => {
    const el = document.createElement("img");
    el.src = img;
    el.className = "img-thumb";
    el.onerror = () => el.remove();
    wrap.appendChild(el);
  });
}

/* ---------------------------
  UPDATE PRODUCT (PUT)
---------------------------- */
async function updateProduct() {
  const id = document.getElementById("detailId").value;

  let imagesArr = [];
  try {
    imagesArr = JSON.parse(document.getElementById("detailImages").value);
  } catch {
    alert("Images phải là JSON array hợp lệ!");
    return;
  }

  const payload = {
    title: document.getElementById("detailTitle").value.trim(),
    price: Number(document.getElementById("detailPrice").value),
    description: document.getElementById("detailDesc").value.trim(),
    categoryId: Number(document.getElementById("detailCategoryId").value),
    images: imagesArr,
  };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Update failed");

    alert("Update thành công!");

    detailModal.hide();
    await fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Update thất bại! (API có thể giới hạn)");
  }
}

/* ---------------------------
  CREATE PRODUCT (POST)
---------------------------- */
async function createProduct() {
  let imagesArr = [];
  try {
    imagesArr = JSON.parse(document.getElementById("createImages").value);
  } catch {
    alert("Images phải là JSON array hợp lệ!");
    return;
  }

  const payload = {
    title: document.getElementById("createTitle").value.trim(),
    price: Number(document.getElementById("createPrice").value),
    description: document.getElementById("createDesc").value.trim(),
    categoryId: Number(document.getElementById("createCategoryId").value),
    images: imagesArr,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Create failed");

    alert("Create thành công!");
    createModal.hide();

    document.getElementById("createForm").reset();
    await fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Create thất bại! (API có thể giới hạn)");
  }
}

/* ---------------------------
  HELPERS
---------------------------- */
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeCSV(value) {
  if (value === null || value === undefined) return '""';
  const s = String(value).replaceAll('"', '""');
  return `"${s}"`;
}

/* ---------------------------
  EVENTS
---------------------------- */
searchInput.addEventListener("input", applySearch);

pageSizeSelect.addEventListener("change", () => {
  pageSize = Number(pageSizeSelect.value);
  currentPage = 1;
  renderTable();
});

prevPageBtn.addEventListener("click", goPrev);
nextPageBtn.addEventListener("click", goNext);

sortTitleBtn.addEventListener("click", sortByTitle);
sortPriceBtn.addEventListener("click", sortByPrice);

btnExportCSV.addEventListener("click", exportCSVCurrentView);

btnOpenCreate.addEventListener("click", () => createModal.show());

document.getElementById("btnUpdateProduct").addEventListener("click", updateProduct);
document.getElementById("btnCreateProduct").addEventListener("click", createProduct);

/* ---------------------------
  INIT
---------------------------- */
fetchProducts();
