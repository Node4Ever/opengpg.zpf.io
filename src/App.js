import React from 'react';
import { Container } from 'reactstrap';
import { Clipboard, ClipboardCheck } from 'react-bootstrap-icons';

import * as openpgp from 'openpgp';


import './App.css';

class App extends React.Component {
    constructor() {
        super();

        // bind `this` to the methods.
        this.handleCopy       = this.handleCopy.bind(this);
        this.handleInputClick = this.handleInputClick.bind(this);
        this.handleDecrypt    = this.handleDecrypt.bind(this);
        this.handleEncrypt    = this.handleEncrypt.bind(this);
        this.handleNewText    = this.handleNewText.bind(this);

        this.symmetricalDecrypt = this.symmetricalDecrypt.bind(this);
        this.symmetricalEncrypt = this.symmetricalEncrypt.bind(this);

        // Set up Field refs.
        this.gpgTextBox   = React.createRef();
        this.passkeyInput = React.createRef();

        this.state = {
            clipboard: [<Clipboard />, " Copy"]
        };

        this.copied = false;
    }

    componentDidMount() {
        this.gpgTextBox.current.value = 'Hello, World!';
        this.passkeyInput.current.value = 'Erica!';
    }

    handleCopy() {
        this.gpgTextBox.current.select();
        document.execCommand('copy');

        this.setState({clipboard: [<ClipboardCheck />, " Copied"]});
        this.copied = true;
    }

    handleInputClick(event) {
        event.target.select();
    }

    handleNewText() {
        if (this.copied === true) {
            this.setState({clipboard: [<Clipboard/>, " Copy"]});
            this.copied = false;
        }
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
                    <h1>Node4Ever GPG Speaker</h1>
                    <div><img src="/logo.png" title="Node4Ever GPG Speaker" alt="Node4Ever GPG Speaker" width="150" height="150" /></div>
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
                                    <button className="btn btn-secondary" onClick={this.handleCopy}>{this.state.clipboard}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Container>
        );
    }
}

export default App;
