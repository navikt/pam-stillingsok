/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { MagnifyingGlassIcon } from "@navikt/aksel-icons";
import { HStack } from "@navikt/ds-react";

export default class TypeaheadSuggestion extends React.Component {
    constructor(props) {
        super();
        this.value = props.value;
    }

    onClick = () => {
        this.props.onClick(this.props.value);
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
                {this.props.isSearchInWholeAdOption ? (
                    <span
                        className={`TypeaheadSuggestion__inner TypeaheadSuggestion__last ${
                            this.props.active && "TypeaheadSuggestion--active"
                        }`}
                    >
                        <HStack as="span" align="center" gap="1" wrap={false}>
                            <MagnifyingGlassIcon aria-hidden="true" height="1.25em" width="1.25em" />
                            <span className="TypeaheadSuggestion__truncate">
                                Søk på &laquo;{this.value}&raquo; i hele annonsen
                            </span>
                        </HStack>
                    </span>
                ) : (
                    <span
                        className={`TypeaheadSuggestion__inner ${this.props.active && "TypeaheadSuggestion--active"}`}
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
    avoidBlur: PropTypes.func.isRequired,
};
