import React, { Component } from 'react';
import { childrenOfNode } from 'enzyme/src/RSTTraversal';

class ParentData extends Component {
    renderChildren(children){
        return (
            <ul>
                {children.map(child => {
                    return (
                        <li key={child.id}>
                            <input type="text" readOnly defaultValue={`${child.id}#${child.subject}`}/>
                            {child.children && this.renderChildren(child.children)}
                        </li>
                    )
                })}
            </ul>
        )
    }
    render() {
        const {subject = null, children = []} = this.props.parentInfo;
        return (
            <div style={{
                width: '50%'
            }}>
                {subject}
                {this.renderChildren(children)}
            </div>
        );
    }
}

export { ParentData };
