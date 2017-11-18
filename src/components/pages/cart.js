"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {Modal, Panel, Col, Row, Well, Button, ButtonGroup, Label} from 'react-bootstrap';
import {bindActionCreators} from 'redux';

import {deleteFromCart, updateCart, getCart} from '../../actions/cartActions';

class Cart extends React.Component {
    componentDidMount() {
        this.props.getCart();
    }

    constructor() {
        super();

        this.state = {
          showModal: false
        };
    }

    open() {
        this.setState({showModal: true});
    }

    close() {
        this.setState({showModal: false});
    }

    onDelete(_id) {
        this.props.deleteFromCart(this.props.cart, _id);
    }

    onIncrement(item) {
        this.props.updateCart(item, 1, this.props.cart);
    }

    onDecrement(item) {
        this.props.updateCart(item, -1, this.props.cart);
    }

    render() {
        if (this.props.cart[0]) {
            return this.renderCart();
        }
        else {
            return this.renderEmpty();
        }
    }

    renderEmpty() {
        return (<div></div>);
    }

    renderCart() {
        const cartItemsList = this.props.cart.map(function(cartItem) {
            return (
                <Panel key={cartItem._id}>
                    <Row>
                        <Col xs={12} sm={4}>
                            <h6>{cartItem.title}</h6><span>    </span>
                        </Col>
                        <Col xs={12} sm={2}>
                            <h6>usd. {cartItem.price}</h6>
                        </Col>
                        <Col xs={12} sm={2}>
                            <h6>qty. <Label bsStyle='success'>{cartItem.quantity}</Label></h6>
                        </Col>
                        <Col xs={6} sm={4}>
                            <ButtonGroup style={{minWidth: '300px'}}>
                                <Button onClick={this.onDecrement.bind(this, cartItem)} bsStyle='default' bsSize='small'>-</Button>
                                <Button onClick={this.onIncrement.bind(this, cartItem)} bsStyle='default' bsSize='small'>+</Button>
                                <span>     </span>
                                <Button onClick={this.onDelete.bind(this, cartItem._id)} bsStyle='danger' bsSize='small'>DELETE</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Panel>
            )
        }, this);

        return (
            <Panel header='Cart' bsStyle='primary'>
                {cartItemsList}
                <Row>
                    <Col xs={12}>
                        <h6>Total Amount: {this.props.totalAmount}</h6>
                        <Button onClick={this.open.bind(this)} bsStyle='success' bsSize='small'>
                            Proceed To Checkout
                        </Button>
                    </Col>
                </Row>

                <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>ThankYou!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h6>Your order has been saved</h6>
                        <p>You will receive an email confirmation</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Col xs={6}>
                            <h6>Total $: {this.props.totalAmount}</h6>
                        </Col>
                        <Button onClick={this.close.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Panel>
        )
    }
}

function mapStateToProps(state) {
    return {
        cart: state.cart.cart,
        totalAmount: state.cart.totalAmount
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteFromCart: deleteFromCart,
        updateCart: updateCart,
        getCart: getCart
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);