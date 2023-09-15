import { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import styled from 'styled-components';

const AutoComplion = styled.div`
  &.text-input {
    background: none;
    border: none !important;
  }

  .customAutoComplete {
    position: relative;
  }

  .react-autosuggest__input {
    color: var(--pallete-text-main);
    background: none;
    outline: none !important;
    box-shadow: none !important;
    border: 1px solid var(--pallete-colors-border);
    border-radius: 5px;

    &:focus {
      border: 1px solid var(--pallete-primary-main);
    }
  }
  .react-autosuggest__inputOpen {
    border: 1px solid var(--pallete-colors-border);
    border-radius: 5px;
  }
  .react-autosuggest__inputFocused {
    outline: none;
  }
  .react-autosuggest__suggestions-container--open {
    border: 1px solid var(--pallete-colors-border);
    margin-top: 2px;
    border-radius: 5px;
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    background: var(--pallete-background-default);
    z-index: 5;
  }
  .react-autosuggest__suggestion--highlighted {
    background: var(--pallete-primary-main);
    color: #fff !important;
  }
  .react-autosuggest__suggestion {
    font-size: 1rem;
    color: var(--pallete-text-main);
    font-weight: 300;
    padding: 10px 20px;
    cursor: pointer;
  }
  .react-autosuggest__suggestions-list {
    margin: 0px;
    padding: 0px;
  }
`;

export default function AutoComplete(props: any) {
  const field = props.fieldType || '';
  const [value, setValue] = useState(props.value || '');

  const [focus, setFocus] = useState(props.value && value.trim().length);

  useEffect(() => {
    if (!Boolean(props.value) && !focus) {
      setFocus(false);
    } else {
      setFocus(true);
      setValue(props.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  const hasIcon = !!props.hasIcon;
  const hasLabel = props.hasLabel || true;
  const hasImageIcon = !!props.hasImageIcon;

  const inputBlurred = (e: any) => {
    setFocus(value && value.trim().length);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  // on change handler
  const onChange = (newValue: any) => {
    if (newValue) {
      if (props.onChange) {
        props.onChange(newValue, field);
      }
    }
  };
  // getting the value when moving up and down with mouse
  function getSuggestionValue(suggestion: any) {
    if (suggestion) {
      return suggestion.description;
    }
  }
  // setting value when someone selects from mouse or keypress
  const selectHandler = (event: any, { suggestion }: any) => {
    setValue(suggestion.description);
    if (props.onSelect) {
      props.onSelect(suggestion.description, field);
    }
  };
  const localOnChange = (event: any) => {
    setValue(event.target.value);
  };
  // props passed to the autofill component
  const inputProps = {
    value,
    placeholder: props?.placeholder,
    onChange: localOnChange,
    onBlur: inputBlurred,
    onFocus: () => {
      setFocus(true);
    },
  };
  // rendering options when they are
  const renderSuggestion = (suggestion: any) => {
    return <span>{suggestion.description}</span>;
  };
  const onSuggestionsFetchRequested = (value: any) => {
    onChange(value.value);
    if (value.reason === 'input-focused') {
      setFocus(true);
    }
  };
  const onSuggestionsClearRequested = () => {
    onChange(null);
  };

  return (
    <AutoComplion
      className={`${props.inputClasses || ''} text-input ${
        hasIcon ? 'ico-input' : ''
      } ${focus ? 'input-active' : ''}`}
    >
      {hasIcon && (
        <div className="icon">
          <span className={`icon-${props.icon}`}></span>
        </div>
      )}
      {hasLabel && <label htmlFor={props.id}>{props.label}</label>}
      <Autosuggest
        suggestions={props.result || []}
        inputProps={inputProps}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={selectHandler}
        getSuggestionValue={getSuggestionValue}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
      />

      {hasImageIcon && (
        <div className="img">
          <img
            src={`/assets/images/${props.imageFileName}`}
            alt="img description"
          />
        </div>
      )}
      {props.touched && props.error && (
        <label id="title-error" className="is-invalid" htmlFor={props.name}>
          {props.error}
        </label>
      )}
    </AutoComplion>
  );
}
