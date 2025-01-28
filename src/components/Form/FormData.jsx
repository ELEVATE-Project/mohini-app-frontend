import React from "react";
import { useTranslation } from "react-i18next";

function FormData({selectOptions, selectClassName, selectName, selectOnChange, selectID, selectValue, inputDivClass, isRequired, inputType, inputName, id,
    inputClass, inputOnChange, inputValue, labelDivClass, labelClass, labelName, layOut, isimportant, isMultiple, showWithinInput=false,
    withinInputType, withinInputName, withinInputOnChange, withinInputValue, withinInputClass, withinInputDisabled, fieldError, showDefaultDropdownText=true
}){
    let optionArr = selectOptions;
    let multipleValue = false;
    if(isMultiple === 'true') multipleValue = true;

    const { t } = useTranslation();
    let defaultText = 'Choose an option'

    if (t('chooseAnOption') && !showDefaultDropdownText) {
        defaultText = t('chooseAnOption')
    }
    
    function showDropDown(){
        if(optionArr === undefined || optionArr === null) optionArr = []; 
        return(
            <>
                <select
                  className={selectClassName}
                  name={selectName}
                  onChange={selectOnChange}
                  required
                  id={selectID}
                  value={selectValue}
                  multiple={multipleValue}
                >
                    <option value="">{defaultText}</option>
                    {(optionArr).map((option) => {
                        return (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        );
                    })}
                </select>
            </>
        );
    }

    function showInput(){
        return(
            <>
                <div className={inputDivClass}>
                    {( isRequired ?
                    <>
                        {(fieldError && fieldError!== '')&& <p className="error-phn-field">{fieldError}</p>}
                        {(showWithinInput)&& <input type={withinInputType} name={withinInputName} id={id} className={withinInputClass} 
                            onChange={withinInputOnChange} value={withinInputValue} required
                            disabled = {withinInputDisabled}
                        />}
                        <input type={inputType} name={inputName} id={id} className={inputClass} 
                            onChange={inputOnChange} value={inputValue} required
                        />
                    </>
                    :
                    <input type={inputType} name={inputName} id={id} className={inputClass} 
                        onChange={inputOnChange} value={inputValue}
                    /> )}
                </div>
            </>
        );
    }

    function showStar(){
        if(isimportant === "true") return (<span style={{color: "red"}}>* </span>);
    }

    function showLabel(){
        return(
            <div className={labelDivClass}>
                <b htmlFor={id} className={labelClass} >{showStar()}{labelName}</b>
            </div>
        )
    }
 
    if(layOut === 1){
        return(
            <>
                {showLabel()}
                {showInput()}
            </>
        );
    } else if(layOut === 2){
        return(
            <>
                {showLabel()}
                {showDropDown()}
                {(fieldError && fieldError!== '')&& <p className="error-phn-field">{fieldError}</p>}
            </>
        );
    } else{
        return(
            <>
            </>
        );
    }
}

export default FormData;
