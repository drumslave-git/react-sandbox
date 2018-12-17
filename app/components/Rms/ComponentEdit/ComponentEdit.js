import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { SketchPicker } from 'react-color';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
    editor: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-${50}%, -${50}%)`,
        padding: theme.spacing.unit * 2,
        // width: 400,
        // height: 300,
    },
});

class ComponentEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorData: {
                show: props.show,
                color: (props.component && props.component.color) || '#000000',
                name: (props.component && props.component.name) || '',
                id: (props.component && props.component.id) || null,
            },
        };
        this.nameInput = React.createRef();
    }

    componentWillReceiveProps(props) {
        this.setState({
            editorData: {
                show: props.show,
                color: (props.component && props.component.color) || '#000000',
                name: (props.component && props.component.name) || '',
                id: (props.component && props.component.id) || null,
            },
        });
    }

    handleComponentSave = () => {
        const { handleComponentSave } = this.props;
        const { editorData } = this.state;
        handleComponentSave({
            name: this.nameInput.current.value,
            color: editorData.color,
        }, editorData.id);
    };

    handleChangeComplete = (color) => {
        const { editorData = {} } = this.state;
        this.setState({
            editorData: {
                ...editorData,
                color: color.hex,
            },
        });
    };

    render() {
        const { components = [], parentComponent, hideEditor } = this.props;
        const { editorData = {} } = this.state;
        return (
            <Dialog
                aria-labelledby="form-dialog-title"
                open={editorData.show}
                onClose={hideEditor}
            >
                <DialogTitle id="form-dialog-title">
                    Component
                    {parentComponent !== null && (
                        <span>
                            {` -> ${parentComponent.name}`}
                        </span>
                    )}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        inputRef={this.nameInput}
                        defaultValue={editorData.name}
                        margin="normal"
                    />
                    <SketchPicker
                        color={editorData.color}
                        disableAlpha
                        presetColors={
                            components
                                .map(component => component.color)
                                .filter((value, index, self) => self.indexOf(value) === index)
                        }
                        onChangeComplete={this.handleChangeComplete}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={hideEditor} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleComponentSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ComponentEdit.defaultProps = {
    component: null,
    parentComponent: null,
};

ComponentEdit.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    component: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    parentComponent: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    components: PropTypes.array.isRequired,
    show: PropTypes.bool.isRequired,
    handleComponentSave: PropTypes.func.isRequired,
    hideEditor: PropTypes.func.isRequired,
};

export default withStyles(styles)(ComponentEdit);
