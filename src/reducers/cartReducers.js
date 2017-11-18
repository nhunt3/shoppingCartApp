"use strict"
import _ from 'lodash';

export function cartReducers(state={cart: []}, action) {
  switch(action.type) {
      case 'GET_CART':
          return {
              ...state,
              cart: action.payload,
              totalAmount: totals(action.payload).amount,
              totalQuantity: totals(action.payload).quantity
          };
          break;

      case "UPDATE_CART":
        return {
            ...state,
            cart: action.payload,
            totalAmount: totals(action.payload).amount,
            totalQuantity: totals(action.payload).quantity
        };
        break;

      case "DELETE_FROM_CART":
        return {
            cart: action.payload,
            totalAmount: totals(action.payload).amount,
            totalQuantity: totals(action.payload).quantity
        };
        break;
  }

  return state;
};

export function totals(payloadArr) {
  const totalAmount = payloadArr.map(function(cartItem) {
      return cartItem.price * cartItem.quantity;
  })
  .reduce(function(a, b) {
    return a + b;
  }, 0);

  const totalQuantity = payloadArr.map(function(cartItem) {
      return cartItem.quantity;
  })
  .reduce(function(a, b) {
      return a + b;
  }, 0);

    return {
        amount: totalAmount.toFixed(2),
        quantity: totalQuantity
    };
};