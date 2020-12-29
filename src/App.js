import React from 'react';
import { Container } from 'reactstrap';

import * as openpgp from 'openpgp';

import ClipboardCopier from './components/ClipboardCopier';

import './App.css';

class App extends React.Component {
    constructor() {
        super();

        // bind `this` to the methods.
        this.handleInputClick = this.handleInputClick.bind(this);
        this.handleDecrypt    = this.handleDecrypt.bind(this);
        this.handleEncrypt    = this.handleEncrypt.bind(this);

        this.symmetricalDecrypt = this.symmetricalDecrypt.bind(this);
        this.symmetricalEncrypt = this.symmetricalEncrypt.bind(this);

        // Set up Field refs.
        this.gpgTextBox   = React.createRef();
        this.passkeyInput = React.createRef();
    }

    componentDidMount() {
        this.gpgTextBox.current.value = '';
        this.passkeyInput.current.value = '';
    }

    handleInputClick(event) {
        event.target.select();
    }

    handleDecrypt() {
        this.symmetricalDecrypt(this.gpgTextBox.current.value, this.passkeyInput.current.value);
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

    symmetricalDecrypt(armoredText, passkey) {
        (async () => {
            const { data: decrypted } = await openpgp.decrypt({
                message: await openpgp.message.readArmored(armoredText), // parse encrypted bytes
                passwords: [passkey],                    // decrypt with password
                format: 'utf8'
            });

            this.gpgTextBox.current.value = decrypted;
        })();
    }

    render() {

        return (
        <Container>
            <section className="App">
                <div>
                    <h2>GPG Speaker</h2>
                    <h4>Encrypt/Decrypt GPG Symmetrically</h4>
                    <div>
                        <div><textarea id="gpgTextBox" ref={this.gpgTextBox} onClick={this.handleInputClick} onChange={this.handleNewText} /></div>
                        <div>
                            <label>Passkey: <input type="text" id="passkey" ref={this.passkeyInput} onClick={this.handleInputClick} /></label>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col md-5">
                                    <button className="btn btn-primary" onClick={this.handleEncrypt}>Symmetric Encrypt</button>
                                </div>
                                <div className="col md-7">
                                    <button className="btn btn-success" onClick={this.handleDecrypt}>Symmetric Decrypt</button>
                                    <ClipboardCopier targetText={this.gpgTextBox} />
                                </div>
                            </div>
                        </div>
                        <section id="shoutbox">
                            <p>A <a href="https://www.phpexperts.pro/" target="_blank"><strong>PHP Experts, Inc.</strong></a> project.</p>
                            <div><a href="https://github.com/Node4Ever/opengpg.zpf.io" target="_blank"><strong>GitHub repository</strong></a></div>
                        </section>
                    </div>
                </div>
            </section>
        </Container>
        );
    }
}

export default App;
