import React from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';

class DraggableWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            dragging: false,
        };

        this.nodeRef = null;
    }

    createNodeRef = (ref) => {
        const { nodeRef } = this.props;
        this.nodeRef = ref;
        nodeRef(ref);
    };

    onStop = (e, data) => {
        const { onStop } = this.props;
        this.setState({
            x: 0,
            y: 0,
            dragging: false,
        }, () => onStop(e, data));
    };

    onStart = () => {
        this.setState({
            x: 0,
            y: 0,
            dragging: true,
        });
    };

    onDrag = (e, data) => {
        const { onDrag } = this.props;
        const { x, y } = this.state;
        this.setState({
            x: x + data.deltaX,
            y: y + data.deltaY,
        });
        onDrag(e, data);
    };

    render() {
        const {
            // eslint-disable-next-line react/prop-types
            children,
            handle,
            nodeId,
        } = this.props;
        const { x, y, dragging } = this.state;

        return (
            <DraggableCore
                onDrag={this.onDrag}
                onStop={this.onStop}
                onStart={this.onStart}
                position={{ x, y }}
                handle={handle}
            >
                <div
                    className={`node ${dragging ? 'dragging' : ''}`}
                    ref={this.createNodeRef}
                    id={nodeId}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                    {children}
                    {dragging && (
                        <div
                            style={{ transform: `translate(${x * -1}px, ${y * -1}px)`, position: 'absolute' }}
                            className="node placeholder"
                        >
                            {children}
                        </div>
                    )}
                </div>
            </DraggableCore>
        );
    }
}

DraggableWrapper.propTypes = {
    handle: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    nodeId: PropTypes.any.isRequired,
    onDrag: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    nodeRef: PropTypes.func.isRequired,
};

export default DraggableWrapper;
