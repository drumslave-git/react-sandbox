import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import ComponentEdit from '../ComponentEdit';

const styles = () => ({
    listItem: {
        // borderBottom: '1px solid',
        borderLeft: '5px solid',
    },
});

class Components extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editingComponent: null,
        };
    }

    showEditor = (component = {}) => {
        this.setState({
            editingComponent: component,
        });
    };

    hideEditor = () => {
        this.setState({
            editingComponent: null,
        });
    };

    render() {
        // eslint-disable-next-line react/prop-types
        const { classes = [] } = this.props;
        const {
            components = [],
            addToRelations,
            removeComponent,
            handleComponentSave,
        } = this.props;
        const { editingComponent } = this.state;
        return (
            <div>
                <ComponentEdit
                    handleComponentSave={handleComponentSave}
                    hideEditor={this.hideEditor}
                    component={editingComponent}
                    show={editingComponent !== null}
                    components={components}
                />
                <List>
                    <ListItem>
                        <IconButton aria-label="Add" onClick={() => this.showEditor()}>
                            <Add />
                        </IconButton>
                    </ListItem>
                    {components.map((component) => {
                        return (
                            <ListItem
                                key={component.id}
                                className={classes.listItem}
                                style={{ borderLeftColor: component.color }}
                            >
                                <ListItemText primary={component.name} />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Add" onClick={() => this.showEditor(component)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton aria-label="Add" onClick={() => addToRelations(component)}>
                                        <Add />
                                    </IconButton>
                                    <IconButton aria-label="Delete" onClick={() => removeComponent(component.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        );
    }
}

Components.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    components: PropTypes.array.isRequired,
    addToRelations: PropTypes.func.isRequired,
    removeComponent: PropTypes.func.isRequired,
    handleComponentSave: PropTypes.func.isRequired,
};

export default withStyles(styles)(Components);
