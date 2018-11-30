import React from 'react';
import RedmineLine from './parts/RedmineLine';
import { formatLinesFromTicket, saveTempStrings, copyToClipboard } from './helper';
import { defaultVisibleStatuses, legendText } from './consts';
import styles from './styles';

class LangStrings extends React.Component {
    state = {
        toRedmineLines: formatLinesFromTicket(),
        showNotEmpty: true,
        visibleStatuses: [
            ...defaultVisibleStatuses,
        ],
    };

    redmineStringsRef = null;

    renderTextLine = (line) => {
        const { visibleStatuses, showNotEmpty } = this.state;
        if (!visibleStatuses.includes(line.className) || (line.originEn !== '' && !showNotEmpty)) return null;
        return (
            <tr
                key={line.text}
                style={styles[line.className]}
                className={line.className}
            >
                <td>
                    {line.text}
                </td>
                <td>
                    {line.originEn !== '' && (
                        <React.Fragment>
                            en: {line.originEn}
                        </React.Fragment>
                    )}
                    {line.originEn === '' && (
                        <React.Fragment>
                            en:&nbsp;
                            <input
                                style={styles.input}
                                type="text"
                                value={line.en}
                                onChange={
                                    ({ target }) => this.changeLineEn(line.text, target.value)
                                }
                            />
                        </React.Fragment>
                    )}
                </td>
            </tr>
        );
    };

    changeShowNotEmpty = (checked) => {
        this.setState({ showNotEmpty: checked });
    };

    changeLineEn = (line, en) => {
        const { toRedmineLines } = this.state;
        const updatedLines = toRedmineLines.map((item) => {
            if (item.text === line) {
                return { ...item, en };
            // eslint-disable-next-line no-else-return
            } else {
                return item;
            }
        });

        this.setState({
            toRedmineLines: updatedLines,
        }, () => saveTempStrings(line, en));
    };

    getRedmineColor = (className) => {
        let color = '%';
        switch (className) {
        case 'notRelevant':
            color = '%{color:red}';
            break;
        case 'mentionedMissingRelevant':
            color = '%{color:orange}';
            break;
        case 'newMissingRelevant':
            color = '%{color:blue}';
            break;
        case 'addedRelevant':
            color = '%{color:green}';
            break;
        case 'notAdded':
            color = '%{color:grey}';
            break;
        default:
            color = '%';
        }

        return color;
    };

    renderTextRedmineLine = (line) => {
        const { visibleStatuses } = this.state;
        if (!visibleStatuses.includes(line.className)) return null;
        const color = this.getRedmineColor(line.className);
        return (
            <RedmineLine
                key={line.text}
                text={line.text}
                className={line.className}
                en={line.en}
                de={line.de}
                color={color}
            />
        );
    };

    renderLinesForTickets = () => {
        const { toRedmineLines } = this.state;
        const sortedLines = [...toRedmineLines];
        sortedLines.sort();
        const linesTree = {};
        sortedLines.forEach((line) => {
            const parts = line.text.split('.');
            const k = Math.min(4, Math.max(2, parts.length - 1));
            parts.splice(k, parts.length - k);
            let node = linesTree;
            parts.forEach((part) => {
                node[part] = node[part] || {};
                node = node[part];
            });
            node.lines = node.lines || [];
            node.lines.push(line);
            node.lines.sort();
        });
        const rec = (node, sectionTitle = '', out = [], level = 0) => {
            if (Array.isArray(node)) {
                if (sectionTitle !== '') {
                    out.push(
                        <br />,
                        <div key={sectionTitle}>
                            <strong>
                                h{level}. {sectionTitle}
                            </strong>
                        </div>,
                        <br />,
                        <div>|key|EN|DE|</div>,
                    );
                }
                node.forEach((line) => {
                    out.push(this.renderTextRedmineLine(line));
                });
            } else {
                Object.keys(node).forEach((key) => {
                    let nextTitle = sectionTitle;
                    if (key !== 'lines') {
                        nextTitle = `${sectionTitle} ${key}`;
                    }
                    rec(node[key], nextTitle, out, level + 1);
                });
            }

            return out;
        };
        const result = rec(linesTree);
        return result;
    };

    renderLinesFromTicket = () => {
        const { toRedmineLines } = this.state;
        return (
            <table>
                {toRedmineLines.map(line => this.renderTextLine(line))}
            </table>
        );
    };

    changeFilter = (e, part, invert = false) => {
        e.preventDefault();
        const { visibleStatuses } = this.state;
        let updatedStatuses = [...visibleStatuses];
        if (visibleStatuses.includes(part) && visibleStatuses.length > 1) {
            if (!invert) {
                updatedStatuses.splice(updatedStatuses.indexOf(part), 1);
            } else {
                updatedStatuses = [part];
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (!invert) {
                updatedStatuses.push(part);
            } else {
                updatedStatuses = defaultVisibleStatuses.filter(status => status !== part);
            }
        }
        this.setState({
            visibleStatuses: updatedStatuses,
        });
    };

    renderLegendItems() {
        const { visibleStatuses } = this.state;
        return defaultVisibleStatuses.map((status) => {
            let itemStyle = {};
            if (visibleStatuses.includes(status)) {
                itemStyle = styles.legendItemActive;
            } else {
                itemStyle = styles.legendItemNotActive;
            }
            return (
                <button
                    key={status}
                    style={{
                        ...styles.legendItem,
                        ...styles[status],
                        ...itemStyle,
                    }}
                    type="button"
                    onClick={e => this.changeFilter(e, status)}
                    onContextMenu={e => this.changeFilter(e, status, true)}
                    title={legendText[status]}
                >
                    {status}
                </button>
            );
        });
    }

    renderLegendRedmineItems() {
        const { visibleStatuses } = this.state;
        return defaultVisibleStatuses.map((status) => {
            if (visibleStatuses.includes(status)) {
                return (
                    <div
                        key={status}
                        style={{
                            ...styles.legendItem,
                            ...styles[status],
                        }}
                    >
                        {`* ${this.getRedmineColor(status)}${legendText[status]}%`}
                    </div>
                );
            }
            return null;
        });
    }

    render() {
        const { showNotEmpty } = this.state;
        return (
            <div style={styles.root}>
                <div style={styles.mainTable}>
                    <div style={styles.column}>
                        <div style={styles.head}>
                            <h2>
                                From
                            </h2>
                        </div>
                        <div style={styles.body}>
                            {this.renderLinesFromTicket()}
                        </div>
                    </div>
                    <div style={styles.column}>
                        <div style={styles.head}>
                            <h2>To</h2>
                        </div>
                        <div>
                            <React.Fragment>
                                <strong>*legend:*</strong>
                                <br />
                                {this.renderLegendRedmineItems()}
                                <br />
                            </React.Fragment>
                        </div>
                        <div style={styles.body} ref={(r) => { this.redmineStringsRef = r; }}>
                            {this.renderLinesForTickets()}
                        </div>
                    </div>
                </div>
                <div style={styles.legend}>
                    {this.renderLegendItems()}
                    <label style={styles.legendItem} htmlFor="showNotEmpty">
                        <input
                            type="checkbox"
                            style={styles.input}
                            onChange={
                                ({ target }) => this.changeShowNotEmpty(target.checked)
                            }
                            checked={showNotEmpty}
                            id="showNotEmpty"
                        />
                        show not empty
                    </label>
                    <button
                        type="button"
                        onClick={() => copyToClipboard(this.redmineStringsRef.innerText)}
                        style={styles.legendItem}
                    >
                        Copy
                    </button>
                </div>
            </div>
        );
    }
}

export default LangStrings;
