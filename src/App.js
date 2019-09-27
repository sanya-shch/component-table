import React from 'react';

import Table from './Components/Table';

const App = () => {

    const data = {
        columns: [
            {
                type: "string",
                filtering: true,
                sorting: true,
                style: {color:"green",border:"solid 1px"},
            },
            {
                type: "number",
                filtering: true,
                sorting: true,
                style: {border:"solid 1px"},
            }
        ],
        cells: [
            {
                value: "kkk",
                style: {color:"red"},
            },
            {
                value: 21,
                style: {},
            },
            {
                value: "zzz",
                style: {},
            },
            {
                value: 3,
                style: {},
            },
            {
                value: "aaa",
                style: {},
            },
            {
                value: 1,
                style: {},
            }
        ]
    };

    return (
        <Table data={data} />
    );

};

export default App;
