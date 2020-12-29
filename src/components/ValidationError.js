import React from "react";

class ValidationError extends React.Component {
    render() {
        return (
            <>
                <li className="text-danger">{this.props.message}</li>
            </>
        );
    }
}

export default ValidationError;
