import { Children, useState, useEffect, useRef } from 'react';

import './App.css';
import products from './data/data.json';


function Button({ children, onClick, className, type, ...props }) {
  return (
    <button
      onClick={onClick}
      className={'button ' + className}
      type={type || 'button'}
      {...props}
    >
      {children}
    </button>
  );
}

function ButtonGroup({ children, className }) {
  return (
    <div className={'button button--group' + ' ' + className}>
      {Children.map(children, (child) => child)}
    </div>
  );
}

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
function ProductCard({ product, addedQuantity, onAddProduct, onRemoveProduct }) {
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
    <article className='product-card'>
      <header className='product-card__header'>
        <img className='product-card__image' src={image.mobile} />
        {
          isAddedInCart
            ? (
              <ButtonGroup className="product-card__button product-card__button--active button--primary">
                <div className='circle' onClick={handleRemoveProduct}>
                  <img src='./assets/images/icon-decrement-quantity.svg' />
                </div>
                <output className='flex--grow'>{addedQuantity}</output>
                <div className='circle' onClick={handleAddProduct}>
                  <img src='./assets/images/icon-increment-quantity.svg' />
                </div>
              </ButtonGroup>
            )
            : (
              <Button className="product-card__button" onClick={handleAddProduct}>
                <img className='button__icon' src='./assets/images/icon-add-to-cart.svg' alt='add to cart icon' />
                Add to cart
              </Button>
            )
        }
      </header >
      <div className='product-card__body'>
        <div className='product-card__category'>{category}</div>
        <div className='product-card__name'>{name}</div>
        <div className='product-card__price'>${price}</div>
      </div>
    </article >
  )
}

function ProductListItem({ product, ...props }) {
  return (
    <li className='product-card-list__item'>
      <ProductCard product={product} {...props} />
    </li>
  );
}
function ProductList({ products, cartProducts = [], onAddProduct, onRemoveProduct }) {
  const isEmpty = !products?.length;
  return isEmpty
    ? (<p>No product available for this category</p>)
    : (
      <ul className='product-card-list'>
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
function CartProductListItem({ fullCartProduct, onRemoveCartProduct }) {
  const {
    id,
    name,
    quantity,
  } = fullCartProduct;
  function handleRemoveCartProduct() {
    onRemoveCartProduct({ id });
  }
  return (
    <li>
      <div>
        <div>{name}</div>
        <div>({quantity})</div>
        <div><button type="button" onClick={handleRemoveCartProduct}>Remove</button></div>
      </div>
    </li>
  );
}
function CartProductList({ cartProducts, products, onRemoveCartProduct }) {
  return (
    <ul>
      {
        cartProducts.map(({ id: productId, quantity }) => {
          const product = products.find(({ id }) => productId === id);
          const { id, name } = product;
          return (<CartProductListItem key={id} fullCartProduct={{ ...product, quantity }} onRemoveCartProduct={onRemoveCartProduct} />);
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
function Cart({ cart = {}, products = [], onConfirm, onRemoveCartProduct }) {
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
          ? (
            <div>
              <img src='/assets/images/illustration-empty-cart.svg' alt="Empty cart illustration" />
              <p>Your added items will appear here</p>
            </div>
          )
          : (
            <>
              <CartProductList cartProducts={cart?.products || []} products={products} onRemoveCartProduct={onRemoveCartProduct} />
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
  function handleRemoveCartProduct({ id }) {
    setFormData({
      ...formData,
      cart: {
        products: formData?.cart?.products.filter(({ id: cartProductId }) => id !== cartProductId),
      }
    });
  }

  return (
    <main className="page">
      <form>
        <section className='products-section'>
          <h1 className='page__title'>Desserts</h1>
          <div>
            <ProductDisplayContainer
              products={formProducts}
              cartProducts={formData?.cart?.products}
              onAddProduct={handleAddProduct}
              onRemoveProduct={handleRemoveProduct}
            />
          </div>
        </section>
        <section className='cart-section'>
          <Cart cart={formData.cart} products={formProducts} onConfirm={handleSubmitForm} onRemoveCartProduct={handleRemoveCartProduct} />
        </section>
      </form>
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
      >
        <div>
          <p>Modal content</p>
          <button type='button' onClick={handleResetForm}>Start New Order</button>
        </div>
      </Modal>
    </main>
  );
}

export default App;
