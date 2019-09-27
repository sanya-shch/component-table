import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';

import './table.css';

const Table = props => {

    const initStateRows = () => {
        let stateRows = [];
        for (let i = 0; i < props.data.cells.length; i += props.data.columns.length) {
            const sliceArr = props.data.cells.slice(i, i + props.data.columns.length);
            stateRows = [...stateRows, sliceArr];
        }
        return stateRows;
    };
    const [rows/*, setRows*/] = useState(initStateRows);

    const [filter, setFilter] = useState({
        isFilter: false,
        filterData: []
    });
    const { isFilter, filterData } = filter;

    const [sort, setSort] = useState({
        isSort: false,
        columnId: 0,
        isUp: true
    });
    const { isSort, columnId, isUp } = sort;

    const renderTableHeaderFilter = () => {
        let columns = props.data.columns;
        return columns.map((column, index) => {
            return <th key={index} >
                {
                    column.filtering && <div><input type='text' placeholder='Filtering' onChange={e => filterTable(e, index)}/></div>
                }
            </th>
        })
    };

    const renderTableHeaderSort = () => {
        let columns = props.data.columns;
        return columns.map((column, index) => {
            return <th key={index} >
                {
                    column.sorting
                    &&
                    <div>
                        <button className='btnSortUp' onClick={() => setSort({
                            isSort: true,
                            columnId: index,
                            isUp: true
                        })}>↑</button>
                        <button className='btnSortDown' onClick={() => setSort({
                            isSort: true,
                            columnId: index,
                            isUp: false
                        })}>↓</button>
                    </div>
                }
            </th>
        })

    };

    const renderTableData = () => {
        let data;
        if(isFilter){
            if(isSort){
                if(isUp){
                    if(props.data.columns[columnId].type === "string"){
                        data = filterData.sort(compereStringUp);
                    }else{
                        data = filterData.sort(compereNumericUp);
                    }
                }else{
                    if(props.data.columns[columnId].type === "string"){
                        data = filterData.sort(compereStringDown);
                    }else{
                        data = filterData.sort(compereNumericDown);
                    }
                }
            }else{
                data = filterData;
            }
        }else{
            if(isSort){
                if(isUp){
                    if(props.data.columns[columnId].type === "string"){
                        data = rows.sort(compereStringUp);
                    }else{
                        data = rows.sort(compereNumericUp);
                    }
                }else{
                    if(props.data.columns[columnId].type === "string"){
                        data = rows.sort(compereStringDown);
                    }else{
                        data = rows.sort(compereNumericDown);
                    }
                }
            }else{
                data = rows;
            }
        }

        return <Fragment>
            {
                data.map((cells, indexR) => {
                    return (
                        <tr key={indexR}>
                            {
                                cells.map((cell, indexC) => {
                                    const columnStyle = props.data.columns[indexC].style;
                                    const cellStyle = cell.style;
                                    const style = {...columnStyle , ...cellStyle};
                                    return (
                                        <td key={indexC}  style={style}>{cell.value}</td>
                                    )
                                })
                            }
                        </tr>
                    )
                })
            }
        </Fragment>
    };

    const filterTable = (e, id) => {
        if(e.target.value === ''){
            setFilter({
                isFilter: false,
                filterData: []
            });
        } else {
            if (isSort)
            setFilter({
                isFilter: true,
                filterData: rows.filter(row => {
                    const regex = new RegExp(`^${e.target.value}`, 'i');
                    return regex.test(row[id].value);
                })
            });
        }
    };

    const compereStringUp = (a,b) => a[columnId].value.localeCompare(b[columnId].value);
    const compereStringDown = (b,a) => a[columnId].value.localeCompare(b[columnId].value);

    const compereNumericUp = (a,b) => {
        if(a[columnId].value > b[columnId].value)return 1;
        if(a[columnId].value < b[columnId].value)return -1;
    };
    const compereNumericDown = (b,a) => {
        if(a[columnId].value > b[columnId].value)return 1;
        if(a[columnId].value < b[columnId].value)return -1;
    };

    return (
        <div className='table'>
            <table>
                <thead className='tableHead'>
                    <tr className='tableHeadFilter'>{renderTableHeaderFilter()}</tr>
                    <tr className='tableHeadSort'>{renderTableHeaderSort()}</tr>
                </thead>
                <tbody className='tableBody'>
                    {renderTableData()}
                </tbody>
            </table>
        </div>
    );
};

Table.propTypes = {
    data: PropTypes.shape({
        columns: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.oneOf(["string","number"]),
            filtering: PropTypes.bool.isRequired,
            sorting: PropTypes.bool.isRequired,
            style: PropTypes.object,
        })),
        cells: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.any.isRequired,
            style: PropTypes.object,
        }))
    }),
};

Table.defaultProps = {
    data: {
        columns: [
            {
                type: "string",
                filtering: false,
                sorting: false,
                style: {},
            }
        ],
        cells: [
            {
                value: 1,
                style: {},
            }
        ]
    }
};

export default Table;
