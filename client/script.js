const token = localStorage.getItem('token');

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

async function loadProducts() { 
    try {
        const response = await fetch('/products', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (response.ok) {
            const productList = document.getElementById('productList');
            productList.innerHTML = '';

            data.forEach(product => {
                const div = document.createElement('div');
                div.classList.add('productsDiv');
                div.innerHTML = `<p><span>Name:</span> ${product.productName}</p><p><span>Cost:</span> ${product.cost} cents</p><p><span>Available:</span> ${product.amountAvailable} </p><p><span>ID:</span> ${product._id}</p>`;
                productList.appendChild(div);
            });
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (response.ok) {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';
            usersList.classList.add('productsDiv')
            data.forEach(user => {
                usersList.innerHTML += `<div style="margin-top:1rem;">
                    <p><span>Username:</span> ${user.username}</p>
                    <p><span>Role:</span> ${user.role}</p>
                </div>`;
            });
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}