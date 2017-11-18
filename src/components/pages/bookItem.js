"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {updateCart} from '../../actions/cartActions';

class BookItem extends React.Component {
    constructor() {
        super();
        this.state = {
          isClicked: false
        };
    }

    onReadMore() {
        this.setState({isClicked: true});
    }

    addToCart() {
        this.props.updateCart(this.props.book, 1, this.props.cart);
    }

    render() {
        return (
            <Well>
                <Row>
                    <Col xs={12} sm={4}>
                        <Image src={this.props.book.image} responsive />
                    </Col>
                    <Col xs={6} sm={8}>
                        <h6>{this.props.book.title}</h6>
                        <p>{this.props.book.description.length > 50 && this.state.isClicked === false ?
                           this.props.book.description.substring(0, 50) : this.props.book.description}</p>
                        <button className='link' onClick={this.onReadMore.bind(this)}>
                            {this.state.isClicked === false && this.props.book.description !== null
                            && this.props.book.description.length > 50 ? '...read more' : ''}
                        </button>
                        <h6>usd. {this.props.book.price}</h6>
                        <Button onClick={this.addToCart.bind(this)} bsStyle='primary'>Add To Cart</Button>
                    </Col>
                </Row>
            </Well>
        )
    }
}

function mapStateToProps(state) {
    return {
        cart: state.cart.cart
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateCart: updateCart
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BookItem);