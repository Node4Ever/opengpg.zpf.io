import React from "react";
import {Clipboard, ClipboardCheck} from "react-bootstrap-icons";

// @FIXME: Publish this as its own NPM module!!
class ClipboardCopier extends React.Component {
    constructor(props) {
        super(props);

        this.handleEvent = this.handleEvent.bind(this)
        this.performCopy = this.performCopy.bind(this)
        this.state = {
            clipboard: [<Clipboard />, " Copy"]
        };

        this.copied = false;
        this.textArea = null;
    }

    handleEvent() {
        if (this.copied === true) {
            this.setState({
                clipboard: [<Clipboard/>, " Copy"]
            });
            this.copied = false;
        }
    }

    componentDidMount() {
        this.targetText = this.props.targetText.current;
        this.targetText.addEventListener('change', this);
        this.targetText.addEventListener('keyup', this);
    }

    notifyTextChanged() {
        if (this.copied === true) {
            this.setState({clipboard: [<Clipboard/>, " Copy"]});
        }
    }

    performCopy() {
        this.props.targetText.current.select();
        document.execCommand('copy');

        this.setState({clipboard: [<ClipboardCheck />, " Copied"]});
        this.copied = true;
    }


    render() {
        return (
            <button className="btn btn-secondary" onClick={this.performCopy}>{this.state.clipboard}</button>
        );
    }
}

export default ClipboardCopier;
