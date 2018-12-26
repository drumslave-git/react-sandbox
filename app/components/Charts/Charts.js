/* eslint-disable no-return-assign */
import React from 'react';
import echarts from 'echarts';

class Charts extends React.Component {
    chartDom = null;

    state = {
        drawChart: false,
        activeItem: 'group name: 1',
    };

    componentDidMount() {
        if (this.chartDom) {
            const inst = echarts.init(this.chartDom, null);

            const option = {
                color: ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'],
                backgroundColor: '#333',
                textStyle: {
                    color: '#eee', fontFamily: 'Microsoft YaHei', fontSize: 12, fontStyle: 'normal', fontWeight: 'normal',
                },
                timeAxis: {
                    axisLine: { lineStyle: { color: '#eee' } }, axisTick: { lineStyle: { color: '#eee' } }, axisLabel: { textStyle: { color: '#eee' }, color: '#eee' }, splitLine: { lineStyle: { type: 'dashed', color: '#aaa' } }, splitArea: { areaStyle: { color: '#eee' } },
                },
                logAxis: {
                    axisLine: { lineStyle: { color: '#eee' } }, axisTick: { lineStyle: { color: '#eee' } }, axisLabel: { textStyle: { color: '#eee' }, color: '#eee' }, splitLine: { lineStyle: { type: 'dashed', color: '#aaa' } }, splitArea: { areaStyle: { color: '#eee' } },
                },
                valueAxis: {
                    axisLine: { lineStyle: { color: '#eee' } }, axisTick: { lineStyle: { color: '#eee' } }, axisLabel: { textStyle: { color: '#eee' }, color: '#eee' }, splitLine: { lineStyle: { type: 'dashed', color: '#aaa' } }, splitArea: { areaStyle: { color: '#eee' } },
                },
                categoryAxis: {
                    axisLine: { lineStyle: { color: '#eee' } }, axisTick: { lineStyle: { color: '#eee' } }, axisLabel: { textStyle: { color: '#eee' }, color: '#eee' }, splitLine: { lineStyle: { type: 'dashed', color: '#aaa' }, show: false }, splitArea: { areaStyle: { color: '#eee' } },
                },
                line: { symbol: 'circle' },
                graph: { color: ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'] },
                gauge: { title: { textStyle: { color: '#eee' } } },
                animation: 'auto',
                animationDuration: 1000,
                animationDurationUpdate: 300,
                animationEasing: 'exponentialOut',
                animationEasingUpdate: 'cubicOut',
                animationThreshold: 2000,
                progressiveThreshold: 3000,
                progressive: 400,
                hoverLayerThreshold: 3000,
                useUTC: false,
                axisPointer: [{
                    show: 'auto',
                    triggerOn: null,
                    zlevel: 0,
                    z: 50,
                    type: 'line',
                    snap: false,
                    triggerTooltip: true,
                    value: null,
                    status: null,
                    link: [],
                    animation: null,
                    animationDurationUpdate: 200,
                    lineStyle: { color: '#aaa', width: 1, type: 'solid' },
                    shadowStyle: { color: 'rgba(150,150,150,0.3)' },
                    label: {
                        show: true, formatter: null, precision: 'auto', margin: 3, color: '#fff', padding: [5, 7, 5, 7], backgroundColor: 'auto', borderColor: null, borderWidth: 0, shadowBlur: 3, shadowColor: '#aaa',
                    },
                    handle: {
                        show: false, icon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', size: 45, margin: 50, color: '#333', shadowBlur: 3, shadowColor: '#aaa', shadowOffsetX: 0, shadowOffsetY: 2, throttle: 40,
                    },
                }],
                tooltip: [],
                yAxis: [{
                    data: ['testY'],
                    axisLine: {
                        lineStyle: { color: '#eee', width: 1, type: 'solid' }, show: true, onZero: true, onZeroAxisIndex: null, symbol: ['none', 'none'], symbolSize: [10, 15],
                    },
                    axisTick: {
                        lineStyle: { color: '#eee', width: 1 }, alignWithLabel: false, interval: 'auto', show: true, inside: false, length: 5,
                    },
                    axisLabel: {
                        textStyle: { color: '#eee' }, color: '#eee', interval: 'auto', show: true, inside: false, rotate: 0, showMinLabel: null, showMaxLabel: null, margin: 8, fontSize: 12,
                    },
                    splitLine: { lineStyle: { type: 'dashed', color: '#aaa', width: 1 }, show: false },
                    splitArea: { areaStyle: { color: '#eee' }, show: false },
                    boundaryGap: true,
                    show: true,
                    zlevel: 0,
                    z: 0,
                    inverse: false,
                    name: '',
                    nameLocation: 'end',
                    nameRotate: null,
                    nameTruncate: { maxWidth: null, ellipsis: '...', placeholder: '.' },
                    nameTextStyle: {},
                    nameGap: 15,
                    silent: false,
                    triggerEvent: false,
                    tooltip: { show: false },
                    axisPointer: {},
                    offset: 0,
                    type: 'category',
                    rangeEnd: null,
                    rangeStart: null,
                }],
                xAxis: [{
                    data: ['testX'],
                    axisLine: {
                        lineStyle: { color: '#eee', width: 1, type: 'solid' }, show: true, onZero: true, onZeroAxisIndex: null, symbol: ['none', 'none'], symbolSize: [10, 15],
                    },
                    axisTick: {
                        lineStyle: { color: '#eee', width: 1 }, alignWithLabel: false, interval: 'auto', show: true, inside: false, length: 5,
                    },
                    axisLabel: {
                        textStyle: { color: '#eee' }, color: '#eee', interval: 'auto', show: true, inside: false, rotate: 0, showMinLabel: null, showMaxLabel: null, margin: 8, fontSize: 12,
                    },
                    splitLine: { lineStyle: { type: 'dashed', color: '#aaa', width: 1 }, show: false },
                    splitArea: { areaStyle: { color: '#eee' }, show: false },
                    boundaryGap: true,
                    show: true,
                    zlevel: 0,
                    z: 0,
                    inverse: false,
                    name: '',
                    nameLocation: 'end',
                    nameRotate: null,
                    nameTruncate: { maxWidth: null, ellipsis: '...', placeholder: '.' },
                    nameTextStyle: {},
                    nameGap: 15,
                    silent: false,
                    triggerEvent: false,
                    tooltip: { show: false },
                    axisPointer: {},
                    offset: 0,
                    type: 'category',
                    rangeEnd: null,
                    rangeStart: null,
                }],
                grid: [{
                    show: false, zlevel: 0, z: 0, left: '10%', top: 60, right: '10%', bottom: 60, containLabel: false, backgroundColor: 'rgba(0,0,0,0)', borderWidth: 1, borderColor: '#ccc',
                }],
                series: [{
                    type: 'bar', data: [[0, 0]], zlevel: 0, z: 2, coordinateSystem: 'cartesian2d', legendHoverLink: true, barMinHeight: 0, barMinAngle: 0, itemStyle: {},
                }],
                markArea: [{
                    zlevel: 0, z: 1, tooltip: { trigger: 'item' }, animation: false, label: { normal: { show: true, position: 'top' }, emphasis: { show: true, position: 'top' } }, itemStyle: { normal: { borderWidth: 0 } },
                }],
                markLine: [{
                    zlevel: 0, z: 5, symbol: ['circle', 'arrow'], symbolSize: [8, 16], precision: 2, tooltip: { trigger: 'item' }, label: { normal: { show: true, position: 'end' }, emphasis: { show: true } }, lineStyle: { normal: { type: 'dashed' }, emphasis: { width: 3 } }, animationEasing: 'linear',
                }],
                markPoint: [{
                    zlevel: 0, z: 5, symbol: 'pin', symbolSize: 50, tooltip: { trigger: 'item' }, label: { normal: { show: true, position: 'inside' }, emphasis: { show: true } }, itemStyle: { normal: { borderWidth: 2 } },
                }],
                marker: [],
                visualMap: [],
                dataZoom: [],
                brush: [],
                legend: [],
            };
            inst.setOption(option);
        }
    }

    sidebarItems = (count = 50, name = 'group name') => {
        const items = [];
        for (let i = 0; i < count; i += 1) {
            items.push(`${name}: ${i + 1}`);
        }
        return items;
    };

    render() {
        const { drawChart, activeItem } = this.state;
        if (drawChart) {
            return (
                <div
                    ref={r => this.chartDom = r}
                    style={{
                        width: '100vw',
                        height: '100vh',
                    }}
                >
                    Charts
                </div>
            );
        }
        const sidebarItems = this.sidebarItems();
        const headings = this.sidebarItems(20, 'heading');
        const rows = this.sidebarItems(100, 'cell content');
        return (
            <div
                style={{
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <div
                    style={{
                        width: '60vw',
                        height: '50vh',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-${50}%, -${50}%)`,
                        background: '#a4a4a4',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        // boxSizing: 'border-box',
                    }}
                >
                    <div
                        style={{
                            padding: '20px',
                            boxSizing: 'border-box',
                        }}
                    >
                        FULL DATA POPUP DEMO
                    </div>
                    <div style={{
                        display: 'flex',
                    }}
                    >
                        <div style={{
                            width: '30%',
                            background: '#cbcbcb',
                            overflow: 'auto',
                        }}
                        >
                            <ul
                                style={{
                                    listStyle: 'none',
                                    margin: 0,
                                    padding: 0,
                                }}
                            >
                                {sidebarItems.map(item => (
                                    <li
                                        key={item}
                                    >
                                        <button
                                            type="button"
                                            style={{
                                                background: (item === activeItem) ? '#989898' : '#e3e3e3',
                                                margin: '5px',
                                                padding: '5px',
                                                cursor: 'pointer',
                                                border: 'none',
                                                boxSizing: 'border-box',
                                                textAlign: 'left',
                                                width: 'calc(100% - 10px)',
                                            }}
                                            onClick={() => {
                                                this.setState({
                                                    activeItem: item,
                                                });
                                            }}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{
                            background: '#e2e2e2',
                            overflow: 'auto',
                            flex: 1,
                        }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    position: 'sticky',
                                    top: 0,
                                }}
                            >
                                {headings.map(head => (
                                    <div
                                        key={head}
                                        style={{
                                            width: 200,
                                            padding: '5px',
                                            flex: '1 0 200px',
                                            background: '#191919',
                                            color: '#fff',
                                            marginRight: '3px',
                                        }}
                                    >
                                        {activeItem} {head}
                                    </div>
                                ))}
                            </div>
                            <div>
                                {rows.map((row, idx) => (
                                    <div
                                        key={row}
                                        style={{
                                            display: 'flex',
                                        }}
                                    >
                                        {headings.map((head, hidx) => (
                                            <div
                                                key={`${row}=${head}`}
                                                style={{
                                                    width: 200,
                                                    padding: '5px',
                                                    flex: '1 0 200px',
                                                    background: (idx % 2 === 0) ? '#cbcbcb' : '#b4b4b4',
                                                    marginRight: '3px',
                                                }}
                                            >
                                                {activeItem} {row} {hidx}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Charts;
