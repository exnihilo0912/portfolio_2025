import { useState, useEffect, useRef } from 'react';

import './App.css';
import products from './data/data.json';


// utils functions
function formatProduct(product, productIndex, products) {
  const {
    name,
    ...partialProduct
  } = product;
  return {
    ...product,
    id: name.toLowerCase().replaceAll(' ', '_'),
  }
}

// Product List
function ProductListItem({ product, addedQuantity, onAddProduct, onRemoveProduct }) {
  const isAddedInCart = addedQuantity > 0;
  const {
    id,
    name,
    category,
    price,
    image,
  } = product;

  function handleAddProduct(e) {
    onAddProduct(e, { id });
  }
  function handleRemoveProduct(e) {
    onRemoveProduct(e, { id });
  }

  return (
    <li>
      <div>{image.thumbnail}</div>
      <div>{name}</div>
      <div>{category}</div>
      <div>{price}</div>
      {
        isAddedInCart
          ? (
            <div>
              <button type="button" onClick={handleRemoveProduct}>-</button>
              <output>{addedQuantity}</output>
              <button type="button" onClick={handleAddProduct}>+</button>
            </div>
          )
          : (<button type="button" onClick={handleAddProduct}>Add to cart</button>)
      }
    </li>
  );
}
function ProductList({ products, cartProducts = [], onAddProduct, onRemoveProduct }) {
  const isEmpty = !products?.length;
  return isEmpty
    ? (<p>No product available for this category</p>)
    : (
      <ul>
        {
          products.map(({ id, ...partialProduct }) => {
            const cartProduct = cartProducts.find(({ id: productId }) => productId === id) || {};
            const { quantity = 0 } = cartProduct;

            return (
              <ProductListItem
                key={id}
                product={{ id, ...partialProduct }}
                addedQuantity={quantity}
                onAddProduct={onAddProduct}
                onRemoveProduct={onRemoveProduct}
              />
            );
          })
        }
      </ul>
    );
}
function ProductDisplayContainer({ products, cartProducts, onAddProduct, onRemoveProduct }) {
  return (
    <ProductList
      products={products}
      cartProducts={cartProducts}
      onAddProduct={onAddProduct}
      onRemoveProduct={onRemoveProduct}
    />
  );
}

// Cart
function CartHeader({ cartProducts }) {
  const productCount = cartProducts.reduce((accumulatedCount, cartProduct) => {
    const { quantity = 0 } = cartProduct;

    return accumulatedCount + quantity;
  }, 0);
  return (<h2>Your Cart ({productCount})</h2>);
}
function CartProductListItem({ fullCartProduct }) {
  const {
    id,
    name,
    quantity,
  } = fullCartProduct;
  return (
    <li>
      <div>
        <div>{name}</div>
        <div>({quantity})</div>
        <div><button type="button">Remove</button></div>
      </div>
    </li>
  );
}
function CartProductList({ cartProducts, products }) {
  console.log({ cartProducts });
  return (
    <ul>
      {
        cartProducts.map(({ id: productId, quantity }) => {
          const product = products.find(({ id }) => productId === id);
          const { id, name } = product;
          return (<CartProductListItem key={id} fullCartProduct={{ ...product, quantity }} />);
        })
      }
    </ul>
  );
}
function CartTotalAmount({ cart, products }) {
  const totalAmount = cart?.products.reduce((accumulatedAmount, cartProduct) => {
    const { id, quantity } = cartProduct;
    const { price } = products.find(({ id: productId }) => productId === id) || {};

    if (!price) {
      return accumulatedAmount;
    }

    return (accumulatedAmount + (quantity * price));
  }, 0);

  return (<p>total: USD {totalAmount}</p>);
}
function CartDeliveryDisclaimer() {
  return (
    <div>
      <p>Disclaimer</p>
    </div>
  );
}
function Cart({ cart = {}, products = [], onConfirm }) {
  // States: empty | not empty
  const isCartEmpty = !cart?.products?.length;
  function handleConfirmCart(e) {
    e.preventDefault();

    if (onConfirm) {
      onConfirm();
    }
  }

  return (
    <>
      <CartHeader cartProducts={cart?.products || []} />
      {
        isCartEmpty
          ? (<p>Your added items will appear here</p>)
          : (
            <>
              <CartProductList cartProducts={cart?.products || []} products={products} />
              <CartTotalAmount cart={cart} products={products} />
              <CartDeliveryDisclaimer />
              <button type='submit' onClick={handleConfirmCart}>Confirm</button>
            </>
          )
      }
    </>
  );
}

const initialCart = {
  products: [],
};
const initialFormData = { cart: initialCart };

// Modal
function Modal({ children, isOpen, onClose }) {
  // States: opened, closed
  const dialogRef = useRef(null);

  function handleCloseModal() {
    if (onClose) {
      onClose();
    }
    dialogRef?.current.close();
  }

  useEffect(() => {
    if (dialogRef?.current) {
      const { current: dialogElement } = dialogRef;

      if (isOpen && !dialogElement.open) {
        dialogElement.showModal();
      }

      else if (!isOpen && dialogElement.open) {
        handleCloseModal();
      }
    }
  }, [isOpen])

  return (
    <dialog ref={dialogRef}>
      {children}
      <footer>
        <button type='button' onClick={handleCloseModal}>Close</button>
      </footer>
    </dialog>
  )
}

function App() {
  const formProducts = products.map(formatProduct);
  const [formData, setFormData] = useState(initialFormData);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  function handleAddProduct(e, { id }) {
    const { cart } = formData;
    const { products: cartProdutcs } = cart;
    const cartProduct = cartProdutcs.find(({ id: productId }) => id === productId);

    setFormData({
      ...formData,
      cart: {
        ...cart,
        products: [
          ...cart.products.filter(({ id }) => (!cartProduct?.id || id !== cartProduct?.id)),
          (
            cartProduct
              ? { id, quantity: cartProduct.quantity + 1 }
              : { id, quantity: 1 }
          )
        ]
      }
    });
  }
  function handleRemoveProduct(e, { id }) {
    const { cart } = formData;
    const { products: cartProdutcs } = cart;
    const cartProduct = cartProdutcs.find(({ id: productId }) => id === productId);

    setFormData({
      ...formData,
      cart: {
        ...cart,
        products: [
          ...cart.products.filter(({ id }) => (!cartProduct?.id || id !== cartProduct?.id)),
          (
            (cartProduct && cartProduct.quantity > 1)
              ? { id, quantity: cartProduct.quantity - 1 }
              : undefined
          )
        ].filter(v => v)
      }
    });
  }
  function handleOpenConfirmationModal() {
    setIsConfirmationModalOpen(true);
  }
  function handleSubmitForm() {
    handleOpenConfirmationModal();
  }
  function handleResetForm() {
    setFormData(initialFormData);
    setIsConfirmationModalOpen(false);
  }

  return (
    <div className="App">
      <form>
        <section>
          <h1>Desserts</h1>
          <div>
            <ProductDisplayContainer
              products={formProducts}
              cartProducts={formData?.cart?.products}
              onAddProduct={handleAddProduct}
              onRemoveProduct={handleRemoveProduct}
            />
          </div>
        </section>
        <section>
          <Cart cart={formData.cart} products={formProducts} onConfirm={handleSubmitForm} />
        </section>
      </form>
      {/* modal */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
      >
        <div>
          <p>Modal content</p>
          <button type='button' onClick={handleResetForm}>Start New Order</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
