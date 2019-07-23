test('listToObject', () => {
    expect(
        listToObject([
            {
                name: 'foo',
                value: 1,
            },
            {
                name: 'bar',
                value: 2,
            },
            {
                name: 'foobar',
                value: [{}],
            }
        ])
    ).toEqual({
        foo: 1,
        bar: 2,
        foobar: [{}]
    });
});

test('listToObject should not copy references', () => {
    const obj = {};
    const result = listToObject([
        {
            name: 'foo',
            value: obj,
        }
    ]);

    expect(result.foo).not.toBe(obj);
});

function listToObject(list) {
    let newValue;
    return list.reduce((obj, item) => {
        if (item.value instanceof Array) {
            newValue = [...item.value];
        } else if (item.value instanceof Object) {
            newValue = Object.assign({}, item.value);
        } else {
            newValue = item.value;
        }
        obj[item.name] = newValue;
        return obj;
    }, {});
}
