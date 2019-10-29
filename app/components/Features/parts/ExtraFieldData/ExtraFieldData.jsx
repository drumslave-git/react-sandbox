import React, { Component } from 'react';

class ExtraFieldData extends Component {
    state = {possible_values: []};
    formRef = null;


    static getDerivedStateFromProps(nextProps, prevState) {
        const {name = null, possible_values = []} = nextProps.extraFieldInfo;
        if(prevState.possible_values.length !== possible_values.length) {
            return { possible_values };
        }

        return null;
    }

    renderChildren(children){
        return (
            <div ref={r => this.formRef = r} >
                <table>
                    <tbody>
                    {children.map((child, idx) => {
                        return (
                            <tr key={child.value}>
                                <td>{child.value}</td>
                                <td>
                                    <input
                                        name={`custom_field_enumerations[${child.value}][active][]`}
                                        type="text"
                                        value={0}
                                    />
                                    <input
                                        name={`custom_field_enumerations[${child.value}][active][]`}
                                        type="text"
                                        value={1}
                                    />
                                    <input
                                        name={`custom_field_enumerations[${child.value}][position]`}
                                        type="text"
                                        value={idx}
                                    />
                                    <input
                                        name={`custom_field_enumerations[${child.value}][name]`}
                                        type="text"
                                        onChange={({ target: { value } }) => this.changeLabel(idx, value)}
                                        value={child.label}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <button onClick={this.save}>Save</button>
            </div>
        )
    }

    save = () => {
        const data = {};
        if(this.formRef){
            this.formRef.querySelectorAll('input').forEach(inp => {
                data[inp.name] = inp.value;
            });

            this.props.saveExtraFieldValues(data);
        }
    };

    changeLabel = (idx, label) => {
        const possible_values = [...this.state.possible_values];
        possible_values[idx] = {value:  possible_values[idx].value, label};
        this.setState({
            possible_values
        })
    };
    render() {
        const {name = null} = this.props.extraFieldInfo;
        return (
            <div style={{
                width: '50%'
            }}>
                {name}
                {this.renderChildren(this.state.possible_values)}
            </div>
        );
    }
}

export { ExtraFieldData };
