import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SortableTree, { removeNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
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

class Folders extends Component {
    treeHelper = new TreeHelper(Title, 'relations');

    updateTree = (treeData) => {
        const { updateRelations, data = [] } = this.props;
        updateRelations(this.treeHelper.treeToRelations(data, treeData));
    };

    removeTreeNode = (info) => {
        const { data, relations } = this.props;
        const { path } = info;
        this.updateTree(removeNodeAtPath({
            treeData: this.treeHelper.listToTree(data, relations),
            path,
            getNodeKey: ({ treeIndex: number }) => {
                return number;
            },
        }));
    };

    render() {
        const { data, relations } = this.props;
        return (
            <div style={{ height: '80vh' }}>
                <SortableTree
                    treeData={this.treeHelper.listToTree(data, relations)}
                    onChange={this.updateTree}
                    dndType="component"
                    generateNodeProps={info => ({
                        buttons: [
                            <IconButton aria-label="Delete" onClick={() => this.removeTreeNode(info)}>
                                <DeleteIcon />
                            </IconButton>,
                        ],
                    })}
                />
            </div>
        );
    }
}

Folders.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    relations: PropTypes.array.isRequired,
    updateRelations: PropTypes.func.isRequired,
};

export default Folders;
