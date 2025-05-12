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
function IconButton({ children, className, ...props }) {
  const classes = [className, 'button--icon'].filter(v => v).join(' ');
  return <Button className={classes} {...props}>{children}</Button>;
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
    <article className="product-card">
      <header className='product-card__header'>
        <img className={['product-card__image', addedQuantity && 'product-card__image--active'].filter(v => v).join(' ')} src={image.mobile} />
        {
          isAddedInCart
            ? (
              <ButtonGroup className="product-card__button product-card__button--active button--primary">
                <IconButton className='circle' onClick={handleRemoveProduct}>
                  <img src='./assets/images/icon-decrement-quantity.svg' />
                </IconButton>
                <output className='flex--grow'>{addedQuantity}</output>
                <IconButton className='circle' onClick={handleAddProduct}>
                  <img src='./assets/images/icon-increment-quantity.svg' />
                </IconButton>
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
        <div className='product-card__price'>${Number.parseFloat(price).toFixed(2)}</div>
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
  return (<h2 className='cart__title'>Your Cart ({productCount})</h2>);
}
function CartProductListItem({ fullCartProduct, onRemoveCartProduct }) {
  const {
    id,
    name,
    quantity,
    price,
  } = fullCartProduct;
  const formattedPrice = price.toFixed(2);

  function handleRemoveCartProduct() {
    onRemoveCartProduct({ id });
  }

  return (
    <li className='cart-product-list__item'>
      <div className='cart-product-list__item__details'>
        <div>{name}</div>
        <div className='cart-product-list__item__unit-price'>
          <div className='text--accent text--bold'>{quantity}x</div>
          <div className='text--secondary'>@ ${formattedPrice}</div>
          <div className='text--secondary text--bold'>${(formattedPrice * quantity).toFixed(2)}</div>
        </div>
      </div>
      <IconButton type="button" onClick={handleRemoveCartProduct}>
        <img src="./assets/images/icon-remove-item.svg" alt="remove item button icon" />
      </IconButton>
    </li>
  );
}
function CartProductList({ cartProducts, products, onRemoveCartProduct }) {
  return (
    <ul className='cart-product-list'>
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

  return (
    <p className='cart__total-amount'>
      <span>Order Total</span>
      <span className='text--bigger text--bold'>${totalAmount.toFixed(2)}</span>
    </p>
  );
}
function CartDeliveryDisclaimer() {
  return (
    <div className='cart__disclaimer'>
      <img src="./assets/images/icon-carbon-neutral.svg" alt="carbon neutral icon" />
      <p>This is a <span className="text--bold">carbon-neutral</span> delivery</p>
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
    <div className='cart'>
      <CartHeader cartProducts={cart?.products || []} />
      {
        isCartEmpty
          ? (
            <div className='cart__empty-container'>
              <img className='cart__empty-container__image' src='/assets/images/illustration-empty-cart.svg' alt="Empty cart illustration" />
              <p>Your added items will appear here</p>
            </div>
          )
          : (
            <>
              <CartProductList cartProducts={cart?.products || []} products={products} onRemoveCartProduct={onRemoveCartProduct} />
              <CartTotalAmount cart={cart} products={products} />
              <footer className='cart__footer'>
                <CartDeliveryDisclaimer />
                <Button className="button--primary cart__submit-button" type='submit' onClick={handleConfirmCart}>Confirm Order</Button>
              </footer>
            </>
          )
      }
    </div>
  );
}

// Modal
function ConfirmedCartProductList({ fullCartProducts }) {
  return (
    <ul className='cart-product-list cart-product-list--pink'>
      {fullCartProducts.map((fullCartProduct) => {
        const {
          id,
          image,
          name,
          price,
          quantity,
        } = fullCartProduct;
        return (
          // <li key={id}>
          //   <article className='confirmed-cart-product'>
          //     <img className='confirmed-cart-product__image' src={image.thumbnail} />
          //     <div className='confirmed-cart-product__details'>
          //       <div>{name}</div>
          //       <div className='confirmed-cart-product__unit-price'>
          //         <div className='text--accent'>{quantity}x</div>
          //         <div className='text--thin text--secondary'>@ ${price.toFixed(2)}</div>
          //       </div>
          //     </div>
          //     <div className='confirmed-cart-product__total-price text--big'>
          //       ${(price * quantity)?.toFixed(2)}
          //     </div>
          //   </article>
          // </li>
          <li key={id} className='cart-product-list__item'>
            <div className='cart-product-list__item__details'>
              <article className='confirmed-cart-product'>
                <img className='confirmed-cart-product__image' src={image.thumbnail} />
                <div className='confirmed-cart-product__details'>
                  <div>{name}</div>
                  <div className='cart-product-list__item__unit-price'>
                    <div className='text--accent'>{quantity}x</div>
                    <div className='text--secondary'>@ ${price.toFixed(2)}</div>
                  </div>
                </div>
                <div className='confirmed-cart-product__total-price text--big'>
                  ${(price * quantity)?.toFixed(2)}
                </div>
              </article>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const initialCart = {
  products: [],
};
const initialFormData = { cart: initialCart };

// Modal
function Modal({ children, isOpen, onClose, withCloseButton = true }) {
  const dialogRef = useRef(null);

  function handleCloseModal() {
    if (onClose) {
      onClose();
    }
    dialogRef?.current.close();
  }
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };
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
    <dialog className="modal" ref={dialogRef} onKeyDown={handleKeyDown}>
      {children}
      {withCloseButton &&
        <footer>
          <Button
            className="button--primary"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </footer>
      }
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

  const fullCartProducts = formData.cart.products.map((cartProduct) => {
    const product = formProducts.find(({ id }) => id === cartProduct.id) || {};
    console.log({ product });
    return {
      ...cartProduct,
      ...product,
    }
  });
  const totalAmount = formData?.cart?.products.reduce((accumulatedAmount, cartProduct) => {
    const { id, quantity } = cartProduct;
    const { price } = formProducts.find(({ id: productId }) => productId === id) || {};

    if (!price) {
      return accumulatedAmount;
    }

    return (accumulatedAmount + (quantity * price));
  }, 0);

  return (
    <main className="page">
      <form className='product-form'>
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
        withCloseButton={false}
      >
        <div>
          <header className='modal__header'>
            <img className='modal__header__icon' src="./assets/images/icon-order-confirmed.svg" alt="order confirmed success icon" />
            <p className='page__title text--bold'>Order Confirmed</p>
            <p className='text--secondary'>We hope you enjoy your food!</p>
          </header>
          <div className='modal__content'>
            <ConfirmedCartProductList fullCartProducts={fullCartProducts} />
            <div className='modal__order-total'>
              <span>Order Total</span>
              <span className='text--bigger text--bold'>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
          <footer className='modal__footer'>
            <Button className="button--primary button--block" onClick={handleResetForm}>
              Start New Order
            </Button>
          </footer>
        </div>
      </Modal>
    </main>
  );
}

export default App;
