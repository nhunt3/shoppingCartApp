"use strict"
import _ from 'lodash';

export function booksReducers(state = {books: []}, action) {

    switch (action.type) {
        case "GET_BOOKS":
                return {...state, books:[...action.payload]};
            break;
        case "POST_BOOK":
            return {
                ...state,
                books:[...state.books, ...action.payload]//,
                //message: 'Saved! Click to continue',
                //style: 'success'
            };
            break;
        // case "POST_BOOK_REJECTED":
        //     return {
        //         ...state,
        //         message: 'Please try again',
        //         style: 'danger'
        //     };
        //     break;
        case "DELETE_BOOK":
            return {books: _.filter(state.books,
                obj => (obj._id != action.payload)
            )};
            break;
        case "UPDATE_BOOK":
            const currentBookToUpdate = [...state.books];
            const indexToUpdate = currentBookToUpdate.findIndex(
                book => book._id === action.payload._id
            );
            const newBookToUpdate = {
                ...currentBookToUpdate[indexToUpdate],
                title: action.payload.title
            };
            return {books: [...currentBookToUpdate.slice(0, indexToUpdate),
                newBookToUpdate,
                ...currentBookToUpdate.slice(indexToUpdate + 1)
            ]};
            break;
    }
    return state;
};