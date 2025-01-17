
test('deserialize', () => {
    expect(deserialize({
        row1_name: 'baz',
        row0_name: 'foo',
        row1_value: 6,
        row0_value: 5,
        total: 2,
    })).toEqual({
        row: [
            {
                name: 'foo',
                value: 5,
            },
            {
                name: 'baz',
                value: 6,
            },
        ],
        total: 2,
    });
});

test('deserialize nested', () => {
    expect(deserialize({
        row1_name: 'baz',
        row0_name: 'foo',
        row1_value: 6,
        row0_value: 5,
        row1_hits: {
            hit0_time: 't:1527494940547',
            hit1_time: 't:1527581340547',
        },
        total: 2,
    })).toEqual({
        row: [
            {
                name: 'foo',
                value: 5,
            },
            {
                name: 'baz',
                value: 6,
                hits: {
                    hit: [
                        { time: '28/05/2018' },
                        { time: '29/05/2018' }
                    ]
                }
            },
        ],
        total: 2,
    });
});

const getRandomChar = () => String.fromCharCode(97 + Math.floor(Math.random() * 25 + 1));

test('deserialize rows with any name pattern', () => {
    const rowName = `${getRandomChar()}${getRandomChar()}${getRandomChar()}${getRandomChar()}`;
    const propName = `${getRandomChar()}${getRandomChar()}`;
    expect(deserialize({
        [`${rowName}1_name`]: 'baz',
        [`${rowName}0_name`]: 'foo',
        [`${rowName}1_value`]: 6,
        [`${rowName}0_value`]: 5,
        [propName]: 2,
    })).toEqual({
        [rowName]: [
            {
                name: 'foo',
                value: 5,
            },
            {
                name: 'baz',
                value: 6,
            },
        ],
        [propName]: 2,
    });
});


test('deserialize nested with any name pattern', () => {
    const rowName = `${getRandomChar()}${getRandomChar()}${getRandomChar()}${getRandomChar()}`;
    const row2Name = `${getRandomChar()}${getRandomChar()}${getRandomChar()}`;
    const propName = `${getRandomChar()}${getRandomChar()}`;
    const prop2Name = getRandomChar();
    const nameProp = `${getRandomChar()}${getRandomChar()}`;
    const valueProp = `${getRandomChar()}${getRandomChar()}`;
    const timeProp = `${getRandomChar()}${getRandomChar()}${getRandomChar()}`;
    expect(deserialize({
        [`${rowName}1_${nameProp}`]: 'baz',
        [`${rowName}0_${nameProp}`]: 'foo',
        [`${rowName}1_${valueProp}`]: 6,
        [`${rowName}0_${valueProp}`]: 5,
        [`${rowName}1_${prop2Name}`]: {
            [`${row2Name}0_${timeProp}`]: 't:1527494940547',
            [`${row2Name}1_${timeProp}`]: 't:1527581340547',
        },
        [propName]: 2,
    })).toEqual({
        [rowName]: [
            {
                [nameProp]: 'foo',
                [valueProp]: 5,
            },
            {
                [nameProp]: 'baz',
                [valueProp]: 6,
                [prop2Name]: {
                    [row2Name]: [
                        { [timeProp]: '28/05/2018' },
                        { [timeProp]: '29/05/2018' }
                    ]
                }
            },
        ],
        [propName]: 2,
    });
});

function deserialize(params){
    const result = {};
    for (let key in params) {
        const value = params[key];

        if (key.includes('_')) {
            const data = key.split('_');
            const rowKey = data[0].replace(/\d/, '');
            const rowIndex = parseInt(data[0].match(/\d/, ''));
            const rowProp = data[1];

            // Check if row prop exist
            if (!result[rowKey]) {
                result[rowKey] = [];
            }

            // Check if object is defined
            if (!result[rowKey][rowIndex]) {
                result[rowKey][rowIndex] = {};
            }

            if (typeof value === 'object') {
                result[rowKey][rowIndex][rowProp] = deserialize(value);
            } else {
                result[rowKey][rowIndex][rowProp] = formatValue(value);
            }
        } else {
            result[key] = value;
        }
    }
    return result;
};

function formatValue(value) {
    if (typeof value === 'string' && value.includes('t:')) {
        const d = new Date(parseInt(value.split(':')[1]));
        return `${d.getDate()}/0${d.getMonth() + 1}/${d.getFullYear()}`;
    }
    return value;
}
