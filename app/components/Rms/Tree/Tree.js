import React from 'react';
import PropTypes from 'prop-types';
import DraggableWrapper from './DraggableWrapper';

import './Tree.css';

class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        };

        this.pseudoElement = null;
        this.FastTreeRef = React.createRef();
        this.nodesRefs = [];
        this.nodeRef = (ref) => {
            this.nodesRefs.push(ref);
        };
        this.insertAfterId = null;
        this.insertWhatId = null;
        this.insertAsChild = false;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
        });
    }

    toggleNode = (e) => {
        const bullet = e.target;
        const bodyEl = bullet.parentNode;
        const liEl = bodyEl.parentNode;
        const insideUlEl = liEl.getElementsByClassName('nodeUl')[0];
        if (insideUlEl.style.display === 'none') {
            insideUlEl.style.display = 'block';
            bullet.innerHTML = '▼';
        } else {
            insideUlEl.style.display = 'none';
            bullet.innerHTML = '►';
        }
    };

    onDrag = (e, data) => {
        const draggingNodeBody = data.node.getElementsByClassName('body')[0];
        const draggingBox = draggingNodeBody.getBoundingClientRect();
        const draggingBoxHorizontalMiddle = draggingBox.top + (draggingBox.height / 2);
        const draggingBoxVerticalMiddle = draggingBox.left + (draggingBox.width / 2);

        if (e.target === this.pseudoElement) {
            return;
        }

        this.insertAfterId = null;
        this.insertWhatId = null;
        this.insertAsChild = false;

        this.pseudoElement = document.createElement('div');
        this.nodesRefs.forEach((node) => {
            if (node === null) {
                return;
            }
            node.classList.remove('insertAfter', 'asChild');
            const nodeBody = node.getElementsByClassName('body')[0];
            nodeBody.style.paddingBottom = '';
            const box = nodeBody.getBoundingClientRect();
            // const boxHorizontalMiddle = box.top + (box.height / 2);
            const boxVerticalMiddle = box.left + (box.width / 2);
            if (box.width && box.height && nodeBody !== draggingNodeBody) {
                if (draggingBoxHorizontalMiddle >= box.top
                    && draggingBoxHorizontalMiddle <= (box.top + box.height)
                    && draggingBoxVerticalMiddle >= box.left
                    && draggingBoxVerticalMiddle <= (box.left + box.width)
                ) {
                    node.classList.add('insertAfter');
                    this.insertAfterId = node.getAttribute('id');
                    this.insertWhatId = data.node.getAttribute('id');
                    if (draggingBoxVerticalMiddle >= boxVerticalMiddle) {
                        node.classList.add('asChild')
                        this.insertAsChild = true;
                    }
                }
            }
        });
    };

    onStop = () => {
        const { updateData } = this.props;
        this.nodesRefs.forEach((node) => {
            if (node === null) {
                return;
            }
            node.classList.remove('insertAfter', 'asChild');
        });
        if (this.insertAfterId && this.insertWhatId) {
            const newData = this.updateData();
            if (typeof updateData === 'function') {
                updateData(newData);
            } else {
                this.setState({
                    data: newData,
                });
            }
        }
    };

    updateData = () => {
        const { data = [] } = { ...this.state };
        const { nodeChildrenField, nodeIdField, copyNode } = this.props;
        const search = (children, id, parent = null) => {
            const node = children;
            if (node[nodeIdField] && node[nodeIdField].toString() === id) {
                if (copyNode) {
                    return node;
                }
                return parent.splice(
                    parent.findIndex(itm => itm[nodeIdField] === node[nodeIdField]),
                    1,
                )[0];
            }
            if (node[nodeChildrenField]) {
                let i;
                let result = null;
                for (i = 0; result == null && i < node[nodeChildrenField].length; i += 1) {
                    result = search(node[nodeChildrenField][i], id, node[nodeChildrenField]);
                }
                return result;
            }
            return null;
        };
        const walk = (
            children,
            nodeToInsert = null,
        ) => {
            for (let i = 0; i < children.length; i += 1) {
                const node = children[i];
                const nodeId = node[nodeIdField];
                const nodeChildren = node[nodeChildrenField];

                if (`${nodeId}` === this.insertAfterId && nodeToInsert) {
                    let newNode = nodeToInsert;
                    if (copyNode) {
                        newNode = {
                            ...newNode,
                            id: Date.now(),
                        };
                    }
                    if (this.insertAsChild) {
                        if (nodeChildren === undefined) {
                            node[nodeChildrenField] = [newNode];
                        } else {
                            nodeChildren.push(newNode);
                        }
                    } else {
                        const idx = children.findIndex(itm => this.insertAfterId === `${itm[nodeIdField]}`) + 1;
                        children.splice(idx, 0, newNode);
                    }
                } else if (nodeChildren && nodeChildren.length) {
                    walk(nodeChildren, nodeToInsert);
                }
            }
            return children;
        };
        const nodeToInsert = search({ [nodeChildrenField]: data }, this.insertWhatId);
        return walk(data, nodeToInsert);
    };

    listHtml (children, level = 0) {
        const {
            buttons,
            nodeIdField,
            nodeNameField,
            nodeChildrenField,
            nodeColorField,
        } = this.props;

        if (!children) {
            return null;
        }

        return (
            <div
                style={{
                    display: level !== 0 ? 'none' : 'block',
                }}
                className="nodeUl"
            >
                {children.map((node, idx) => {
                    return (
                        <div className="nodeWrapper" key={node[nodeIdField]}>
                            <DraggableWrapper
                                handle={`.body_${node[nodeIdField]} .name`}
                                onDrag={this.onDrag}
                                onStop={this.onStop}
                                nodeRef={this.nodeRef}
                                nodeId={node[nodeIdField]}
                            >
                                <div className={`body body_${node[nodeIdField]}`}>
                                    {node[nodeChildrenField]
                                    && node[nodeChildrenField].length > 0 && (
                                        <button
                                            type="button"
                                            className="bullet"
                                            onClick={this.toggleNode}
                                        >
                                            ►
                                        </button>
                                    )}
                                    <div className="color" style={{ background: node[nodeColorField] }} />
                                    <div className="name">
                                        {node[nodeNameField]}
                                    </div>
                                    {buttons}
                                </div>
                                {node[nodeChildrenField] && node[nodeChildrenField].length > 0
                                && this.listHtml(
                                    node[nodeChildrenField],
                                    level + 1,
                                    idx === children.length - 1,
                                )}
                            </DraggableWrapper>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const { data = [] } = this.state;
        return (
            <div className="FastTree" ref={this.FastTreeRef}>{this.listHtml(data)}</div>
        );
    }
}

Tree.defaultProps = {
    data: [],
    nodeIdField: 'id',
    nodeNameField: 'name',
    nodeChildrenField: 'children',
    nodeColorField: 'color',
    copyNode: false,
    buttons: null,
    updateData: null,
};

Tree.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array,
    // eslint-disable-next-line react/forbid-prop-types
    buttons: PropTypes.any,
    nodeIdField: PropTypes.string,
    nodeNameField: PropTypes.string,
    nodeChildrenField: PropTypes.string,
    nodeColorField: PropTypes.string,
    copyNode: PropTypes.bool,
    updateData: PropTypes.func,
};

export default Tree;
