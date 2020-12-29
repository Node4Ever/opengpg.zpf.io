import React from 'react';
import { Container } from 'reactstrap';

import * as openpgp from 'openpgp';
// import openpgp } from '../node_modules/openpgp/dist/openpgp.min.js';
// Set the relative web worker path
// openpgp.initWorker({ path: 'openpgp.worker.js' });

import './App.css';

class App extends React.Component {
    constructor() {
        super();

        // bind `this` to the methods.
        this.handleEncrypt = this.handleEncrypt.bind(this);

        this.symmetricalDecrypt = this.symmetricalDecrypt.bind(this);
        this.symmetricalEncrypt = this.symmetricalEncrypt.bind(this);

        // Set up Field refs.
        this.gpgTextBox = React.createRef();
        this.passkeyInput = React.createRef();
    }

    componentDidMount() {
        // @FIXME: Remove this scaffold data.
        this.gpgTextBox.current.value = 'Hello, World!';
        this.passkeyInput.current.value = 'Erica!';
    }

    handleEncrypt() {
        this.symmetricalEncrypt(this.gpgTextBox.current.value, this.passkeyInput.current.value);
    }

    // @FIXME: Abstract this out into the GPGSpeaker NPM module.
    symmetricalEncrypt(plainText, passkey) {
        (async () => {
            console.log(openpgp.message.fromText(plainText));

            const encrypted = await openpgp.encrypt({
                message: openpgp.message.fromText(plainText),
                passwords: [passkey],
                armor: true
            });

            if (encrypted.data === undefined) {
                throw Error("Malformed encryption packet.");
            }

            this.gpgTextBox.current.value = encrypted.data;
        })();
    }

    symmetricalDecrypt() {
        (async () => {
            const { message } = await openpgp.encrypt({
                message: openpgp.message.fromBinary(new Uint8Array([0x01, 0x01, 0x01])), // input as Message object
                passwords: ['secret stuff'],                                             // multiple passwords possible
                armor: false                                                             // don't ASCII armor (for Uint8Array output)
            });
            const encrypted = message.packets.write(); // get raw encrypted packets as Uint8Array

            const { data: decrypted } = await openpgp.decrypt({
                message: await openpgp.message.read(encrypted), // parse encrypted bytes
                passwords: ['secret stuff'],                    // decrypt with password
                format: 'binary'                                // output as Uint8Array
            });
            console.log(decrypted); // Uint8Array([0x01, 0x01, 0x01])
        })();
    }

    render() {

        return (
        <Container>
            <section className="App">
                <div>
                    <h1>Node4Ever GPG Speaker</h1>
                    <div><img src="/logo.png" title="Node4Ever GPG Speaker" alt="Node4Ever GPG Speaker" width="150" height="150" /></div>
                    <div>
                        <div><textarea id="gpgTextBox" ref={this.gpgTextBox} /></div>
                        <div>
                            <label>Passkey: <input type="text" id="passkey" ref={this.passkeyInput} /></label>
                        </div>
                        <div>
                            <button className="btn btn-primary" onClick={this.handleEncrypt}>Symmetric Encrypt</button>
                        </div>
                    </div>
                </div>
            </section>
        </Container>
        );
    }
}

export default App;
