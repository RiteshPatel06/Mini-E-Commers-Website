
const API = "https://dummyjson.com/products?limit=0";
const CATEGORY_API = "https://dummyjson.com/products/categories";

const productContainer = document.querySelector("#products-container");
const categoriesFilter = document.querySelector("#category-filters");
const searchInput = document.querySelector("#search-input");

const detailContainer = document.querySelector("#product-detail-container");

let allCategories = [];

// Format category name
function formatCategory(category) {
    return category.replaceAll("-", " ");
}


// FETCH PRODUCTS
async function fetchProducts(url) {

    if (!productContainer) return;

    productContainer.innerHTML = "Loading...";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        renderProducts(data.products);
    }
    catch (error) {
        console.error(error);
        productContainer.innerHTML = "Something went wrong!";
    }
}


// RENDER PRODUCTS
function renderProducts(products) {

    productContainer.innerHTML = "";

    if (products.length === 0) {
        productContainer.innerHTML = "Product Not Found";
        return;
    }

    products.forEach(p => {

        let article = document.createElement("article");

        article.className =
            "bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition";

        let card = `
            <div class="h-48 w-full flex items-center justify-center p-3 mb-4 bg-white">
                <img src="${p.thumbnail}"
                    alt="${p.title}"
                    class="max-h-full max-w-full object-contain"
                    loading="lazy">
            </div>

            <div class="flex-grow flex flex-col">

                <span class="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                    ${formatCategory(p.category)}
                </span>

                <h2 class="font-semibold text-slate-900 text-sm mb-2 line-clamp-2"
                    title="${p.title}">
                    ${p.title}
                </h2>

                <div class="mt-auto pt-2">
                    <span class="text-lg font-bold text-slate-900">
                        ₹${(p.price * 96.29).toFixed(2)}
                    </span>
                </div>

                <a href="product-details.html?id=${p.id}"
                    class="mt-4 block w-full text-center bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded transition">
                    View Details
                </a>

            </div>
        `;

        article.innerHTML = card;

        productContainer.append(article);
    });
}


// FETCH CATEGORIES
async function fetchCategories() {

    if (!categoriesFilter) return;

    try {
        const response = await fetch(CATEGORY_API);

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const categories = await response.json();

        allCategories = [
            { name: "All", slug: "all", url: API },
            ...categories
        ];

        renderCategories();
    }
    catch (error) {
        console.error(error);
    }
}


// RENDER CATEGORIES
function renderCategories(currentCategory = "all") {

    categoriesFilter.innerHTML = "";

    allCategories.forEach(({ name, slug, url }) => {

        let button = document.createElement("button");

        button.className = currentCategory === slug
            ? "px-4 py-1.5 rounded-md text-sm font-medium bg-teal-700 text-white capitalize transition"
            : "px-4 py-1.5 rounded-md text-sm font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 capitalize transition";

        button.type = "button";
        button.textContent = name;
        button.dataset.category = slug;
        button.dataset.url = url;

        categoriesFilter.append(button);
    });
}


// CATEGORY CLICK EVENT
if (categoriesFilter) {

    categoriesFilter.addEventListener("click", (e) => {

        const button = e.target.closest("button[data-category]");

        if (!button) return;

        const category = button.dataset.category;
        const url = button.dataset.url;

        renderCategories(category);

        fetchProducts(url);
    });
}


// SEARCH FUNCTIONALITY
if (searchInput) {

    searchInput.addEventListener("input", (e) => {

        const value = e.target.value.trim();

        const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(value)}&limit=0`;

        fetchProducts(value ? url : API);
    });
}


// PRODUCT DETAILS PAGE
async function loadProductPage() {

    if (!detailContainer) return;

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id || !/^\d+$/.test(id)) {
        detailContainer.innerHTML = "Invalid Product ID";
        return;
    }

    const url = `https://dummyjson.com/products/${id}`;

    detailContainer.innerHTML = "Loading Product Details...";

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const product = await response.json();

        renderProductDetails(product);

    }
    catch (error) {

        console.error(error);

        detailContainer.innerHTML = "Product Not Found";

    }
}


// RENDER PRODUCT DETAILS
function renderProductDetails(p) {

    detailContainer.innerHTML = `
        <div class="grid md:grid-cols-2 gap-8">

            <div class="flex items-center justify-center bg-white p-6 rounded-lg">
                <img src="${p.thumbnail}"
                    alt="${p.title}"
                    class="max-h-96 object-contain">
            </div>

            <div>

                <p class="text-teal-700 uppercase font-semibold text-sm">
                    ${formatCategory(p.category)}
                </p>

                <h1 class="text-3xl font-bold mt-2">
                    ${p.title}
                </h1>

                <p class="text-gray-600 mt-4">
                    ${p.description}
                </p>

                <h2 class="text-2xl font-bold mt-5">
                    ₹${(p.price * 96.29).toFixed(2)}
                </h2>

                <p class="mt-3">
                    Rating: ⭐ ${p.rating}
                </p>

                <p class="mt-2">
                    Stock: ${p.stock}
                </p>

                <p class="mt-2">
                    Brand: ${p.brand || "Not available"}
                </p>

            </div>

        </div>
    `;
}


// INITIALIZE APPLICATION
function init() {

    if (productContainer) {
        fetchProducts(API);
        fetchCategories();
    }

    if (detailContainer) {
        loadProductPage();
    }

}

init();
