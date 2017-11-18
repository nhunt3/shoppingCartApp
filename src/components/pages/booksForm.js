"use strict"
import React from 'react';
import {MenuItem, InputGroup, DropdownButton, Image, Col, Row, Well, Panel, FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {findDOMNode} from 'react-dom';
import axios from 'axios';

import {postBooks, deleteBooks, getBooks} from '../../actions/booksActions';

class BooksForm extends React.Component {
    constructor() {
        super();
        this.state = {
          images: [{}],
          image: ''
        };
    }

    componentDidMount() {
        this.props.getBooks();

        // get images from api
        axios.get('/api/images')
        .then(function(response) {
            this.setState({
                images: response.data
            });
        }.bind(this))
        .catch(function(err) {
            this.setState({
                images: 'error loading image files from the server',
                image: ''
            });
        });
    }

    handleSubmit() {
        const book = [{
            title: findDOMNode(this.refs.title).value,
            description: findDOMNode(this.refs.description).value,
            image: findDOMNode(this.refs.image).value,
            price: findDOMNode(this.refs.price).value
        }];

        this.props.postBooks(book);

        // to do: we should be calling resetForm on the success of the post above
        this.resetForm();
    }

    onDelete() {
        let bookId = findDOMNode(this.refs.delete).value;
        this.props.deleteBooks(bookId);
    }

    handleSelect(imageName) {
        this.setState({
            image: '/images/' + imageName
        });
    }

    resetForm() {
        findDOMNode(this.refs.title).value = '';
        findDOMNode(this.refs.description).value = '';
        findDOMNode(this.refs.image).value = '';
        findDOMNode(this.refs.price).value = '';
        this.setState({image: ''});
    };

    render() {
        const booksList = this.props.books.map(function(book) {
           return (
               <option key={book._id}>{book._id}</option>
           );
        });

        const imageList = this.state.images.map(function(image, i) {
            return (
                <MenuItem key={i} eventKey={image.name}
                    onClick={this.handleSelect.bind(this, image.name)}>{image.name}</MenuItem>
            );
        }, this);

        return (
            <Well>
                <Row>
                    <Col xs={12} sm={6}>
                        <Panel>
                            <InputGroup>
                                <FormControl type="text" ref='image' value={this.state.image} />
                                <DropdownButton
                                    componentClass={InputGroup.Button}
                                    id="input-dropdown-addon"
                                    title="Action"
                                    bsStyle='primary'
                                >
                                    {imageList}
                                </DropdownButton>
                            </InputGroup>
                            <Image src={this.state.image} responsive />
                        </Panel>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Panel>
                            <FormGroup controlId='title'>
                                <ControlLabel>Title</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder='Enter Title'
                                    ref='title'
                                />
                            </FormGroup>
                            <FormGroup controlId='description'>
                                <ControlLabel>Description</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder='Enter Description'
                                    ref='description'
                                />
                            </FormGroup>
                            <FormGroup controlId='price'>
                                <ControlLabel>Price</ControlLabel>
                                <FormControl
                                    type='text'
                                    placeholder='Enter Price'
                                    ref='price'
                                />
                            </FormGroup>
                            <Button onClick={this.handleSubmit.bind(this)} bsStyle='primary'>
                                Save Book
                            </Button>
                        </Panel>
                        <Panel style={{marginTop: '25px'}}>
                            <FormGroup controlId="formControlsSelect">
                                <ControlLabel>Select a book id to delete</ControlLabel>
                                <FormControl ref='delete' componentClass="select" placeholder="select">
                                    <option value="select">select</option>
                                    {booksList}
                                </FormControl>
                            </FormGroup>
                            <Button onClick={this.onDelete.bind(this)} bsStyle='danger'>Delete Book</Button>
                        </Panel>
                    </Col>
                </Row>
            </Well>
        );
    }
}

function mapStateToProps(state) {
    return {
        books: state.books.books,
        message: state.books.message,
        style: state.books.style
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postBooks,
        deleteBooks,
        getBooks
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BooksForm);