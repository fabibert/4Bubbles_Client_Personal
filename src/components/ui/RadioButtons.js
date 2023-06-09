import React from 'react'
import 'styles/ui/RadioButtons.scss';

export default function RadioButtons(props) {
    const { items, name, value, onChange } = props;
    return (
        <div className="radio-buttons-container">
            {items.map((item) => {
                return <div key={item.value} className="radio-buttons__item">
                    <input
                        type="radio"
                        value={item.value}
                        name={name}
                        id={item.value}
                        checked={value === item.value}
                        onChange={onChange} />
                    <label htmlFor={item.value}>{item.name}</label>
                </div>;
            })}

        </div>
    )
}
