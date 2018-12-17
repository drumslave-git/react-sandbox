import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SortableTree, { removeNodeAtPath, getNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import TreeHelper from '../treeHelper';

function Title(props) {
    // eslint-disable-next-line react/prop-types
    const { name, color } = props;
    return (
        <span>
            <span
                style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    backgroundColor: color,
                    borderRadius: '100%',
                    verticalAlign: 'middle',
                    marginRight: 10,
                }}
            />
            {name}
        </span>
    );
}

class Catalog extends Component {
    treeHelper = new TreeHelper(Title, 'catalog', true);

    updateTree = (treeData) => {
        const { updateCatalog, data = [] } = this.props;
        updateCatalog(this.treeHelper.treeToRelations(data, treeData));
    };

    removeTreeNode = (info) => {
        const { data, catalog, removeComponent } = this.props;
        const { path, node, parentNode } = info;
        if (parentNode.id === 'backlog') {
            removeComponent(node.id);
        } else {
            this.updateTree(removeNodeAtPath({
                treeData: this.treeHelper.listToTree(data, catalog, true),
                path,
                getNodeKey: ({ treeIndex: number }) => {
                    return number;
                },
            }));
        }
    };

    showEditor = (info) => {
        const { data, showEditor } = this.props;
        const component = data.find(comp => comp.id === info.node.id);
        if (component !== undefined) {
            showEditor(component);
        }
    };

    isBacklogSectionTarget = (info) => {
        const { nextPath } = info;
        const { data, catalog } = this.props;
        const res = getNodeAtPath({
            treeData: this.treeHelper.listToTree(data, catalog, true),
            path: nextPath.slice(0, 1),
            getNodeKey: ({ treeIndex: number }) => {
                return number;
            },
        });

        if (res && res.node && res.node.id === 'backlog' && nextPath.length > 2) {
            return false;
        }
        return true;
    };

    render() {
        const { data, catalog, showEditor } = this.props;
        return (
            <div>
                <IconButton aria-label="Add" onClick={() => showEditor()}>
                    <AddIcon />
                </IconButton>
                <div style={{ height: '80vh' }}>
                    <SortableTree
                        treeData={this.treeHelper.listToTree(data, catalog, true)}
                        onChange={this.updateTree}
                        dndType="component"
                        shouldCopyOnOutsideDrop
                        canDrop={info => info.node.type === 'catalog' && info.node.id !== 'backlog' && this.isBacklogSectionTarget(info)}
                        canDrag={info => info.node.id !== 'backlog'}
                        generateNodeProps={(info) => {
                            const buttons = [];
                            if (info.node.id !== 'backlog') {
                                if (info.parentNode === null || info.parentNode.id !== 'backlog') {
                                    buttons.push(
                                        <IconButton aria-label="Add" onClick={() => showEditor({}, info.node.id)}>
                                            <AddIcon />
                                        </IconButton>,
                                    );
                                }
                                buttons.push(
                                    <IconButton aria-label="Edit" onClick={() => this.showEditor(info)}>
                                        <EditIcon />
                                    </IconButton>,
                                );
                                buttons.push(
                                    <IconButton aria-label="Delete" onClick={() => this.removeTreeNode(info)}>
                                        <DeleteIcon />
                                    </IconButton>,
                                );
                            }
                            return { buttons };
                        }}
                    />
                </div>
            </div>
        );
    }
}

Catalog.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    catalog: PropTypes.array.isRequired,
    updateCatalog: PropTypes.func.isRequired,
    showEditor: PropTypes.func.isRequired,
    removeComponent: PropTypes.func.isRequired,
};

export default Catalog;
