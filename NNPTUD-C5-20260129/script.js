// Dữ liệu từ database của bạn
const products = [
    {
        "id": 160,
        "title": "External Hard Drive",
        "price": 890,
        "description": "High-capacity external hard drive offering fast data transfer, reliable storage.",
        "category": { "name": "Clothes" }, // Lưu ý: Data gốc để là Clothes
        "images": ["https://placehold.co/600x400"]
    },
    {
        "id": 187,
        "title": "Fire Red Sport Sneakers",
        "price": 95,
        "description": "Bold red sneakers designed for those who love speed and style.",
        "category": { "name": "Shoes" },
        "images": ["https://i.imgur.com/PgK0RMZ.png"]
    },
    {
        "id": 189,
        "title": "Minimalist White Sport Smartwatch",
        "price": 150,
        "description": "Stay connected and track your fitness with this sleek white smartwatch.",
        "category": { "name": "Electronics" },
        "images": ["https://i.imgur.com/3V4VwdP.png"]
    },
    {
        "id": 192,
        "title": "Vintage Mood Indigo Cap",
        "price": 18,
        "description": "A stylish and adjustable cap in a deep indigo blue.",
        "category": { "name": "Clothes" },
        "images": ["https://i.imgur.com/JLrUweq.png"]
    },
    {
        "id": 198,
        "title": "Ocean Blue Waterproof Gym Bag",
        "price": 40,
        "description": "Keep your gear dry and organized with this durable blue gym bag.",
        "category": { "name": "Clothes" },
        "images": ["https://i.imgur.com/cWXA1TG.png"]
    }
    // ... Bạn có thể copy toàn bộ array JSON vào đây
];

const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.getElementById('filterButtons');

// 1. Hàm hiển thị sản phẩm
function displayProducts(items) {
    productGrid.innerHTML = items.map(item => `
        <div class="col">
            <div class="card product-card shadow-sm">
                <span class="badge bg-info category-badge">${item.category.name}</span>
                <img src="${item.images[0]}" class="card-img-top product-image" alt="${item.title}" 
                     onerror="this.src='https://placehold.co/600x400?text=No+Image'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-truncate">${item.title}</h5>
                    <p class="card-text text-muted small flex-grow-1">
                        ${item.description.substring(0, 80)}...
                    </p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fw-bold text-primary">$${item.price}</span>
                        <button class="btn btn-sm btn-outline-primary">Chi tiết</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 2. Hàm khởi tạo các nút lọc Category tự động
function setupFilters() {
    const categories = ['all', ...new Set(products.map(p => p.category.name))];
    
    // Xóa các nút cũ trừ nút "Tất cả" nếu đã có
    filterButtons.innerHTML = categories.map(cat => `
        <button class="btn btn-outline-secondary btn-sm filter-btn" data-category="${cat}">
            ${cat === 'all' ? 'Tất cả' : cat}
        </button>
    `).join('');

    // Thêm sự kiện click cho nút lọc
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            const filtered = category === 'all' 
                ? products 
                : products.filter(p => p.category.name === category);
            displayProducts(filtered);
        });
    });
}

// 3. Sự kiện tìm kiếm
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
    );
    displayProducts(filtered);
});

// Khởi chạy ban đầu
setupFilters();
displayProducts(products);