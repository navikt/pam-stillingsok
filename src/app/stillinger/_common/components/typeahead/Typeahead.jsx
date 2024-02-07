/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import TypeaheadSuggestion from "./TypeaheadSuggestion";
import "./Typeahead.css";
import { Search } from "@navikt/ds-react";

export default class Typeahead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSuggestionIndex: -1,
            hasFocus: false,
            shouldShowSuggestions: true,
            setAriaActiveDescendant: false,
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
    onChange = (value) => {
        this.setState({
            activeSuggestionIndex: -1, // Nullstill eventuelt markering av et forslag i listen
            shouldShowSuggestions: true, // Vis forslagslisten igjen. Den kan ha blitt skjult om man trykket Esc
        });
        this.props.onChange(value);
    };

    /**
     * Behandler tastaturnavigasjon i forslagslisten.
     * @param e
     */
    onKeyDown = (e) => {
        let { activeSuggestionIndex } = this.state;
        const hasSelectedSuggestion = this.props.suggestions.length > 0 && activeSuggestionIndex > -1;

        /**
         * It’s important to only set aria-activedescendant after the Down arrow key is used to start traversing the
         * associated Listbox options, and to clear aria-activedescendant by removing the attribute or setting it to “”
         * every time the Left/Right arrow keys are pressed, as with Home/End, Escape, or when typing characters or
         * pasting content into the edit field. Otherwise the accessibility tree will report that focus is within the
         * Listbox and it will be impossible for screen reader users to review the text that has been typed into the
         * edit field.
         * https://www.levelaccess.com/differences-aria-1-0-1-1-changes-rolecombobox/
         */
        this.setState({
            setAriaActiveDescendant: e.keyCode === 38 || e.keyCode === 40,
        });

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
                        shouldShowSuggestions: false,
                    });
                }
                break;
            case 27: // Esc
                // Hvis man trykker Esc, og forslagslisten er synlig, så skal listen skjules.
                // Hvis forslagslisten allerede er skjult, så vil verdien i
                // inputfeltet slettes (hvis dette er standard oppførsel i browseren).
                if (this.state.shouldShowSuggestions && this.props.suggestions.length > 0) {
                    // Unngå at verdi i inputfelt slettes
                    e.stopPropagation();
                    e.preventDefault();
                    this.setState({
                        shouldShowSuggestions: false,
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
                    activeSuggestionIndex =
                        activeSuggestionIndex + 1 === this.props.suggestions.length
                            ? this.props.suggestions.length - 1
                            : activeSuggestionIndex + 1;
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
            activeSuggestionIndex: -1,
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
                    hasFocus: false,
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
            activeSuggestionIndex: index,
        });
        this.clearBlurDelay();
    };

    /**
     * Setter valgt forslag, og skjuler forslagslisten.
     * @param suggestionValue
     */
    setValue = (value) => {
        const isLast = this.state.activeSuggestionIndex === this.props.suggestions.length - 1;
        this.setState(
            {
                shouldShowSuggestions: false,
                activeSuggestionIndex: -1,
            },
            () => {
                this.input.focus();
            },
        );
        this.clearBlurDelay();
        this.props.onSelect(value, isLast);
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
        const { activeSuggestionIndex, setAriaActiveDescendant } = this.state;

        const showSuggestions =
            this.state.hasFocus && this.state.shouldShowSuggestions && this.props.suggestions.length > 0;

        const activeDescendant =
            setAriaActiveDescendant && activeSuggestionIndex > -1
                ? `${this.props.id}-item-${activeSuggestionIndex}`
                : undefined;

        return (
            <div
                className="Typeahead"
                role="combobox"
                aria-expanded={showSuggestions}
                aria-owns={`${this.props.id}-suggestions`}
                aria-haspopup="listbox"
            >
                <Search
                    label="Søkeord"
                    variant="primary"
                    id={this.props.id}
                    type="search"
                    role="textbox"
                    aria-autocomplete="list"
                    aria-controls={`${this.props.id}-suggestions`}
                    aria-activedescendant={activeDescendant}
                    value={this.props.value}
                    autoComplete="off"
                    placeholder="Skriv søkeord, f.eks sykepleier"
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}
                    onFocus={this.onFocus}
                    onClear={() => {
                        this.clearBlurDelay();
                        this.props.onClear();
                    }}
                    onSearchClick={this.props.onSearchButtonClick}
                    ref={(input) => {
                        this.input = input;
                    }}
                    className="Typeahead__input typo-normal"
                />
                <ul
                    id={`${this.props.id}-suggestions`}
                    role="listbox"
                    className={showSuggestions ? "Typeahead__suggestions" : "Typeahead__suggestions--hidden"}
                >
                    {showSuggestions &&
                        this.props.suggestions.map((li, i) => {
                            const isSearchInWholeAdOption = i === this.props.suggestions.length - 1;
                            return (
                                <TypeaheadSuggestion
                                    id={`${this.props.id}-item-${i}`}
                                    key={`${li}${isSearchInWholeAdOption ? "-last" : ""}`}
                                    index={i}
                                    value={li}
                                    isSearchInWholeAdOption={isSearchInWholeAdOption}
                                    match={this.props.value}
                                    active={i === this.state.activeSuggestionIndex}
                                    onClick={this.setValue}
                                    setSuggestionIndex={this.setSuggestionIndex}
                                    avoidBlur={this.avoidBlur}
                                />
                            );
                        })}
                </ul>
            </div>
        );
    }
}

Typeahead.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string,
    id: PropTypes.string.isRequired,
};
