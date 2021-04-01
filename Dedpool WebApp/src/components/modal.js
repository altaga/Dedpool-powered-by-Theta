/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Modals extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal isOpen={this.props.modal}>
                <ModalHeader>{this.props.eventName}</ModalHeader>
                <ModalBody>
                    YOU WIN!
              </ModalBody>
            </Modal>
        );
    }
}

export default Modals;