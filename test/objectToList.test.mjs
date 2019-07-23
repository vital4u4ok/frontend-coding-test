test('objectToList', () => {
    expect(
        objectToList({
            foo: 1,
            bar: 2,
            foobar: [{}]
        })
    ).toEqual([
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
    ]);
});

test('objectToList should not copy references', () => {
    const obj = {};
    const result = objectToList({
        foo: obj,
    });

    expect(result[0].value).not.toBe(obj);
});

function objectToList(content) {
    let _content = JSON.parse(JSON.stringify(content));
    return Object.keys(_content)
        .map((key) => {
            return {
                name: key,
                value: _content[key]
            };
        });
}
