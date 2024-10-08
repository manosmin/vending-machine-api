async function logout(f) {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (f) openModal(data.message);

    } catch (error) {
        console.error('Logout failed:', error);
    }
}

async function loadProducts() { 
    try {
        const response = await fetch('/products', {
            method: 'GET',
            credentials: 'include'
        }); 
        const data = await response.json();

        if (response.ok) {
            const productList = document.getElementById('productList');
            productList.innerHTML = '';

            data.products.forEach(product => {
                const div = document.createElement('div');
                div.classList.add('productsDiv');
                div.innerHTML = `<p><span>Name:</span> ${product.productName}</p><p><span>Cost:</span> ${product.cost}c</p><p><span>Available:</span> ${product.amountAvailable} </p><p><span>ID:</span> ${product._id}</p>`;
                productList.appendChild(div);
            });
        } else {
            openModal(data.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/users', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        if (response.ok) {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';
            usersList.classList.add('productsDiv')
            data.users.forEach(user => {
                usersList.innerHTML += `<div style="margin-top:1rem;">
                    <p><span>Username:</span> ${user.username}</p>
                    <p><span>Role:</span> ${user.role}</p>
                    <p><span>Session:</span> ${user.session}</p>
                </div>`;
            });
        } else {
            openModal(data.message);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadUser() {
    try {
        const response = await fetch('/users/profile', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();

        if (response.ok) {
            const userList = document.getElementById('userList');
            userList.innerHTML = '';
            userList.classList.add('productsDiv')
            userList.innerHTML += `<div style="margin-top:1rem;">
                    <p><span>Username:</span> ${data.user.username}</p>
                    <p><span>Role:</span> ${data.user.role}</p>
                    <p><span>Amount:</span> ${data.user.deposit}</p>
            </div>`; 
        } else {
            openModal(data.message);
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

function openModal(msg) {
    console.log("foo");
    const modal = document.getElementById("modal");
    modal.showModal();
  
    const modalBody = modal.querySelector("p");
    modalBody.innerHTML = msg;
  
    const modalCloseButton = modal.querySelector(".modal-btn");
    modalCloseButton.addEventListener("click", () => {
      modal.close();
    });
  }