import React from 'react';
import PropTypes from 'prop-types';

export default class TypeaheadSuggestion extends React.Component {
    constructor(props) {
        super();
        this.value = props.value;
    }

    onClick = () => {
        this.props.onClick(this.value);
    };

    highlightSuggestion = () => {
        this.props.highlightSuggestion(this.props.index);
    };

    render() {
        const matchFound = this.value.toLowerCase().indexOf(this.props.match.toLowerCase()) !== -1;

        return (
            <li
                id={this.props.id}
                ref={(node) => { this.node = node; }}
                role="option"
                aria-selected={this.props.active}
                onClick={this.onClick}
                onMouseOver={this.highlightSuggestion}
                onFocus={this.props.avoidBlur}
                onMouseDown={this.props.avoidBlur}
                onKeyDown={this.props.avoidBlur}
            >
                {matchFound ? (
                    <span className={`typetext ${this.props.active && 'active'}`}>
                        {this.value.substring(0, this.props.match.length)}
                        <span className="typeahead-substring">{this.value.substring(this.props.match.length)}</span>
                    </span>
                ) : (
                    <span className={`typetext ${this.props.active && 'active'}`}>
                        {this.value}
                    </span>
                )}
            </li>
        );
    }
}

TypeaheadSuggestion.propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    match: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    highlightSuggestion: PropTypes.func.isRequired,
    avoidBlur: PropTypes.func.isRequired
};
