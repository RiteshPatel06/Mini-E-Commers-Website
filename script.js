const API = "https://dummyjson.com/products?limit=0"
const CATEGORY_API = "https://dummyjson.com/products/categories"
const productContainer = document.querySelector("#products-container")
const categoriesFilter = document.querySelector("#category-filters")

function formateCategory(category){
    return category.replace("-", " " );
}

// let allProduct = []
// let allCategories = []
// function findCategories(){
//     allProduct.forEach(({category})=>{
//         if(!allCategories.includes(category)){
//             allCategories.push(category)
//         }
//     })
//     console.log()
// }

async function fetchProducts(url) {
    productContainer.innerHTML = "Loding..."

    try {
        const response = await fetch(url);
        const data = await response.json();
        renderProducts(data.products)
    }
    catch (error) {

    }
}
fetchProducts()


function renderProducts(data) {
    productContainer.innerHTML = ""
    data.forEach(p => {
        let article = document.createElement("article")
        article.className = "bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-308 hover:shadow-sm transition"
        let card = `
                    <div class="h-48 w-full flex items-center justify-center p-3 mb-4 bg-white">
                        <img src="${p.thumbnail}"
                            alt=${p.title} class="max-h-full max-w-full object-contain"
                            loading="lazy">
                    </div>
                    <div class="flex-grow flex flex-col">
                        <span class="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                            ${formateCategory(p.category)}
                        </span>
                        <h2 class="font-semibold text-slate-900 text-sm mb-2 line-clamp-2"
                            title=${p.title}>
                            ${p.title}
                        </h2>
                        <div class="mt-auto pt-2">
                            <span class="text-lg font-bold text-slate-900">
                                ${(p.price*96.29).toFixed(2)}
                            </span>
                        </div>
                        <a href="product-details.html"
                            class="mt-4 block w-full text-center bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium py-2 px-4 rounded transition">
                            View Details
                        </a>
                    </div>
                `

        article.innerHTML = card
        productContainer.append(article)
    })

}

async function fetchCategories() {
    try {
        const response = await fetch(CATEGORY_API);
        const categories = await response.json();
        renderCategories(categories)
    }
    catch (error) {

    }
}


function renderCategories(categories) {
    categoriesFilter.innerHTML = "";
    let allCategories = [{ name: "All" ,slug:"All" , url: API}, ...categories]
    allCategories.forEach(c => {
        let button = document.createElement("button")
        button.className = "px-4 py-1.5 rounded-md text-sm font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition"
        button.type = "button"
        button.textContent =`${c.name}`
        button.dataset.category = c.slug
        button.dataset.url = c.url
        categoriesFilter.append(button)
    })

}

fetchProducts(API )
fetchCategories()

categoriesFilter.addEventListener("click",(e)=>{
    e.stopPropagation();
    const element = e.target
    if(element.type){
        const text = element.dataset.category;
        const url = element.dataset.url;
        console.log(text,url)
        fetchProducts(url)
    }
})
function init() {

}