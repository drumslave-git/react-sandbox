import React from 'react';
import PropTypes from 'prop-types';
import SortableTree, { removeNodeAtPath, getNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import Button from '@material-ui/core/Button';
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

class Catalog extends React.PureComponent {
    treeHelper = new TreeHelper(Title, 'catalog', true);

    updateTree = (treeData) => {
        const { updateCatalog, data = [] } = this.props;
        updateCatalog(this.treeHelper.treeToRelations(data, treeData));
    };

    removeTreeNode = (info) => {
        const { data, catalog, removeComponent } = this.props;
        const { path, node, parentNode } = info;
        if (parentNode !== null && parentNode.id === 'backlog') {
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

    searchFinishCallback = (matches) => {
        const { searchFinishCallback } = this.props;
        searchFinishCallback('catalog', matches);
    };

    render() {
        const {
            data,
            catalog,
            showEditor,
            searchFocusIndex,
            searchQuery,
            searchMethod,
        } = this.props;
        return (
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => showEditor()}
                >
                    <AddIcon />
                </Button>
                <div style={{ height: '100%' }}>
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
                                        <IconButton aria-label="Add" onClick={() => showEditor({}, info.node.rid)}>
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
                        searchFocusOffset={searchFocusIndex}
                        searchQuery={searchQuery}
                        searchMethod={searchMethod}
                        searchFinishCallback={this.searchFinishCallback}
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
    searchMethod: PropTypes.func.isRequired,
    searchFinishCallback: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    searchFocusIndex: PropTypes.number.isRequired,
};

export default Catalog;
