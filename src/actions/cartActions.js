"use strict"
import axios from 'axios';

export function getCart() {
  return function(dispatch) {
      axios.get('/api/cart')
      .then(function(response) {
          dispatch({
              type: 'GET_CART',
              payload: response.data
          });
      })
      .catch(function(err) {
         dispatch({
             type: 'GET_CART_REJECTED',
             message: 'error when getting the cart from session'
         });
      });
  }
};

export function updateCart(item, delta, cart) {
    const copyOfCart = cart;
    const indexToUpdate = copyOfCart.findIndex(
        function(book) {
            return book._id === item._id;
        }
    );

    var updatedCart;

    if (indexToUpdate !== -1) {
        const newBookToUpdate = {
            ...copyOfCart[indexToUpdate],
            quantity: copyOfCart[indexToUpdate].quantity + (!(item.quantity === 1 && delta === -1) ? delta : 0)
        };

        let cartUpdate = [...copyOfCart.slice(0, indexToUpdate),
            newBookToUpdate,
            ...copyOfCart.slice(indexToUpdate + 1)
        ];

        updatedCart = cartUpdate;
    }
    else {
        item.quantity = 1;

        updatedCart = cart.concat(item);
    }

    return function(dispatch) {
      axios.post('/api/cart', updatedCart)
      .then(function(response) {
          dispatch({
              type: 'UPDATE_CART',
              payload: response.data
          });
      })
      .catch(function(err) {
         dispatch({
            type: 'UPDATE_CART_REJECTED',
            message: 'error when adding to the cart'
         });
      });
    };
};

export function deleteFromCart(cart, _id) {
    const updatedCart = _.filter(cart, function(obj) {
        return obj._id !== _id;
    });

    return function(dispatch) {
        axios.post('/api/cart', updatedCart)
        .then(function(response) {
            dispatch({
                type: 'DELETE_FROM_CART',
                payload: response.data
            });
        })
        .catch(function(err) {
            dispatch({
                type: 'DELETE_FROM_CART_REJECTED',
                message: 'error when deleting from cart'
            });
        });
    };
};