const token = localStorage.getItem('token');

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

async function loadProducts() { 
    const response = await fetch('/products', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const products = await response.json();
        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        products.forEach(product => {
            const div = document.createElement('div');
            div.classList.add('productsDiv');
            div.innerHTML = `<p><span>Name:</span> ${product.productName}</p><p><span>Cost:</span> ${product.cost} cents</p><p><span>Available:</span> ${product.amountAvailable} </p><p><span>Product ID:</span> ${product._id}</p>`;
            productList.appendChild(div);
        });
    } else {
        console.error('Failed to load products');
    }
}