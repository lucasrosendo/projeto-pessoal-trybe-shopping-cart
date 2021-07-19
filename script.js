const cartItems = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
//------------------------------------------------------------------------------
// Requisito 5 \/

function totalPrice() {
  const getTotalPrice = document.querySelector('.total-price'); 
  let price = 0; 
  const allLi = document.querySelectorAll('li'); 
  allLi.forEach((item) => { 
  const computer = item.innerText.split('$');
  price += Number(computer[1]);
  });
  getTotalPrice.innerHTML = `${(Math.round((price * 100)) / 100)}`;
  }

//---------------------------------------------------------------------

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// Listagem de produtos --------------------------------- \/

const appendData = (resultado) => {
  resultado.forEach((result) => {
    const createElement = createProductItemElement(result);
    const section = document.querySelector('.items');
    section.appendChild(createElement);
  });
};

const getProductApi = (nameProduct) => {
  const product = document.querySelector('.loading');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${nameProduct}`).then((response) => {
    response.json().then((data) => {
      appendData(data.results);
      product.remove();
    });
  });
};
//---------------------------------------------------------

const setItemsLocalStorage = () => {
  const ol = document.querySelector(cartItems); 
  const text = ol.innerHTML; 
  localStorage.setItem('cartList', ''); 
  localStorage.setItem('cartList', JSON.stringify(text)); 
};

function cartItemClickListener(event) {
  event.target.remove(); 
  setItemsLocalStorage(); 
  totalPrice(); 
}

const getItemsLocalStorage = () => {
  const getLocalStorage = JSON.parse(localStorage.getItem('cartList')); 
  const ol = document.querySelector(cartItems); 
  ol.innerHTML = getLocalStorage; 
  ol.addEventListener('click', (event) => { 
    if (event.target.className === 'cart__item') { 
      cartItemClickListener(event); 
    }
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getCartComputer = async (id) => { 
  const api = await fetch(`https://api.mercadolibre.com/items/${id}`); 
  const apiJson = await api.json();
  return apiJson;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const buttonAddCart = () => {
  const parent = document.querySelector('.items'); 
  parent.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') { 
      const buttonParent = event.target.parentElement; 
      const buttonId = getSkuFromProductItem(buttonParent);
      const buttonData = await getCartComputer(buttonId);
      const createComputer = createCartItemElement(buttonData); 
      document.querySelector(cartItems).appendChild(createComputer); 
      setItemsLocalStorage(); 
      totalPrice();
    }
  });
};

const buttonRemoveAll = () => {
  const getButtonRemoveAll = document.querySelector('.empty-cart'); 
  getButtonRemoveAll.addEventListener('click', () => { 
    const ol = document.querySelector(cartItems); 
    while (ol.firstChild) { 
      ol.removeChild(ol.firstChild); 
      totalPrice(); 
      setItemsLocalStorage(); 
    }
  });
};

window.onload = () => { 
  getProductApi('computador');
  totalPrice();
  getItemsLocalStorage();
  buttonAddCart();
  buttonRemoveAll();
};
