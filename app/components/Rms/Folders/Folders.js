import React from 'react';
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

class Folders extends React.PureComponent {
    treeHelper = new TreeHelper(Title, 'relations');

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props) {
    //         Object
    //             .entries(this.props)
    //             .forEach(([key, val]) => prevProps[key] !== val
    //                 && console.log(`Prop '${key}' changed`));
    //     }
    //     if (this.state) {
    //         Object
    //             .entries(this.state)
    //             .forEach(([key, val]) => prevState[key] !== val
    //                 && console.log(`State '${key}' changed`));
    //     }
    // }

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

    searchFinishCallback = (matches) => {
        const { searchFinishCallback } = this.props;
        searchFinishCallback('relations', matches);
    };

    render() {
        const {
            data,
            relations,
            searchFocusIndex,
            searchQuery,
            searchMethod,
        } = this.props;
        return (
            <div style={{ height: '100%' }}>
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
                    searchFocusOffset={searchFocusIndex}
                    searchQuery={searchQuery}
                    searchMethod={searchMethod}
                    searchFinishCallback={this.searchFinishCallback}
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
    searchMethod: PropTypes.func.isRequired,
    searchFinishCallback: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    searchFocusIndex: PropTypes.number.isRequired,
};

export default Folders;
