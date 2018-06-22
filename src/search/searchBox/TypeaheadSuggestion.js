import React from 'react';
import PropTypes from 'prop-types';
import './TypeaheadSuggestion.less';

export default class TypeaheadSuggestion extends React.Component {
    constructor(props) {
        super();
        this.value = props.value;
    }

    onClick = () => {
        this.props.onClick(this.value);
    };

    onMouseMove = () => {
        this.props.setSuggestionIndex(this.props.index);
    };

    render() {
        const matchFound = this.value.toLowerCase().startsWith(this.props.match.toLowerCase());

        return (
            <li
                id={this.props.id}
                role="option"
                aria-selected={this.props.active}
                onClick={this.onClick}
                onMouseMove={this.onMouseMove}
                onFocus={this.props.avoidBlur}
                onMouseDown={this.props.avoidBlur}
                onKeyDown={this.props.avoidBlur}
                className="TypeaheadSuggestion typo-normal"
            >
                {matchFound ? (
                    <span
                        className={`TypeaheadSuggestion__inner ${this.props.active && 'TypeaheadSuggestion--active'}`}
                    >
                        {this.value.substring(0, this.props.match.length)}
                        <span
                            className="TypeaheadSuggestion__substring"
                        >
                            {this.value.substring(this.props.match.length)}
                        </span>
                    </span>
                ) : (
                    <span
                        className={`TypeaheadSuggestion__inner ${this.props.active && 'TypeaheadSuggestion--active'}`}
                    >
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
    setSuggestionIndex: PropTypes.func.isRequired,
    avoidBlur: PropTypes.func.isRequired
};
