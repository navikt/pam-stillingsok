/* eslint-disable jsx-a11y/mouse-events-have-key-events,no-trailing-spaces */
import React from 'react';
import PropTypes from 'prop-types';
import TypeaheadSuggestion from './TypeaheadSuggestion';
import './Typeahead.less';

export default class Typeahead extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: props.value,
            activeSuggestionIndex: -1,
            hasFocus: false,
            shouldShowSuggestions: true
        };
        this.shouldBlur = true;
    }

    componentWillUnmount() {
        if (this.blurDelay) {
            clearTimeout(this.blurDelay);
            this.blurDelay = undefined;
        }
    }

    /**
     * Vil skje hver gang man legger til eller fjerner en bokstav fra inputfeltet
     */
    onChange = (e) => {
        const { value } = e.target;
        this.setState({
            value,
            activeSuggestionIndex: -1, // Nullstill eventuelt markering av et forslag i listen
            shouldShowSuggestions: true // Vis forslagslisten igjen. Den kan ha blitt skjult om man trykket Esc
        });
        this.props.onChange(value);
    };

    /**
     * Behandler tastaturnavigasjon i forslagslisten.
     * @param e
     */
    onKeyDown = (e) => {
        let { activeSuggestionIndex } = this.state;
        const hasSelectedSuggestion = activeSuggestionIndex > -1;

        switch (e.keyCode) {
            case 9: // Tab
                if (hasSelectedSuggestion && this.state.shouldShowSuggestions) {
                    this.setValue(this.props.suggestions[activeSuggestionIndex]);
                }
                break;
            case 13: // Enter
                if (hasSelectedSuggestion && this.state.shouldShowSuggestions) {
                    e.preventDefault(); // Unngå form submit når bruker velger et av forslagene
                    this.setValue(this.props.suggestions[activeSuggestionIndex]);
                } else {
                    this.setState({
                        shouldShowSuggestions: false
                    });
                }
                break;
            case 27: // Esc
                // Hvis man trykker Esc, og forslagslisten er synlig, så skal listen skjules.
                // Hvis forslagslisten allerede er skjult, så vil verdien i
                // inputfeltet slettes (hvis dette er standard oppførsel i browseren).
                if (this.state.shouldShowSuggestions && this.props.suggestions.length > 0) {
                    e.preventDefault(); // Unngå at verdi i inputfelt slettes
                    this.setState({
                        shouldShowSuggestions: false
                    });
                }
                break;
            case 38: // Pil opp
                if (this.state.shouldShowSuggestions) {
                    e.preventDefault();

                    // Marker forrige suggestion i listen.
                    // Hvis man er på toppen av listen og trykker pil opp, så skal ingen forslag markeres.
                    activeSuggestionIndex = activeSuggestionIndex - 1 === -2 ? -1 : activeSuggestionIndex - 1;
                    this.setState({ activeSuggestionIndex });
                }
                break;
            case 40: // Pil ned
                if (this.state.shouldShowSuggestions) {
                    e.preventDefault();

                    // Marker neste suggestion i listen, så fremst man ikke er på slutten av listen
                    activeSuggestionIndex = activeSuggestionIndex + 1 === this.props.suggestions.length ?
                        this.props.suggestions.length - 1 :
                        activeSuggestionIndex + 1;
                    this.setState({ activeSuggestionIndex });
                }
                break;
            default:
                break;
        }
    };

    onFocus = () => {
        this.setState({
            hasFocus: true,
            activeSuggestionIndex: -1
        });
    };

    /**
     * Når man trykker med musen på et forslag i listen, så vil dette museklikket
     * forårsake at det også trigges onBlur på input'en. Normalt vil onBlur skjule
     * suggestions-listen. Men når man trykker med musen på et forslag, trenger vi
     * at forslagene ikke skjules, slik at setValue rekker å bli kjørt.
     */
    onBlur = () => {
        this.blurDelay = setTimeout(() => {
            if (this.shouldBlur) {
                this.setState({
                    hasFocus: false
                }, () => {
                    this.props.onBlur();
                });
            }
        }, 10);
    };

    /**
     * Markerer et forslag i listen når bruker trykker pil opp/ned på tastaturet,
     * eller når man man fører musen over et forslag.
     * @param index
     */
    setSuggestionIndex = (index) => {
        this.setState({
            activeSuggestionIndex: index
        });
        this.clearBlurDelay();
    };

    /**
     * Setter valgt forslag, og skjuler forslagslisten.
     * @param suggestionValue
     */
    setValue = (value) => {
        this.setState({
            value,
            shouldShowSuggestions: false,
            activeSuggestionIndex: -1
        }, () => {
            this.input.focus();
        });
        this.clearBlurDelay();
        this.props.onSelect(value);
    };

    avoidBlur = () => {
        this.shouldBlur = false;
    };

    clearBlurDelay = () => {
        if (this.blurDelay) {
            clearTimeout(this.blurDelay);
            this.blurDelay = undefined;
        }
        this.shouldBlur = true;
    };

    render() {
        const showSuggestions = this.state.hasFocus &&
            this.state.shouldShowSuggestions &&
            this.props.suggestions.length > 0;

        return (
            <div className="Typeahead">
                <input
                    id={this.props.id}
                    role="combobox"
                    type="search"
                    aria-autocomplete="list"
                    aria-controls={`${this.props.id}-suggestions`}
                    aria-owns={`${this.props.id}-suggestions`}
                    aria-expanded={showSuggestions}
                    aria-haspopup={showSuggestions}
                    aria-activedescendant={`${this.props.id}-item-${this.state.activeSuggestionIndex}`}
                    placeholder={this.props.placeholder}
                    value={this.state.value}
                    autoComplete="off"
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}
                    onFocus={this.onFocus}
                    ref={(input) => {
                        this.input = input;
                    }}
                    className="Typeahead__input"
                />
                <ul
                    id={`${this.props.id}-suggestions`}
                    role="listbox"
                    className={showSuggestions ? 'Typeahead__suggestions' : 'Typeahead__suggestions--hidden'}
                >
                    {showSuggestions && this.props.suggestions.map((li, i) => (
                        <TypeaheadSuggestion
                            id={`${this.props.id}-item-${i}`}
                            key={li}
                            index={i}
                            value={li}
                            match={this.state.value}
                            active={i === this.state.activeSuggestionIndex}
                            onClick={this.setValue}
                            setSuggestionIndex={this.setSuggestionIndex}
                            avoidBlur={this.avoidBlur}
                        />
                    ))}
                </ul>
            </div>
        );
    }
}

Typeahead.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};
