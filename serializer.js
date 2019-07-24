module.exports = {
    serialize(result) {
        return JSON.stringify(result, (key, value) => {
            if (typeof value === 'object' && value instanceof Set) {
                return {_t: 'set', _v: [...value]};
            }

            if (typeof value === 'function') {
                return {_t: 'func', _v: value.toString()};
            }

            return value;
        });
    },
    deserialize(jsoned) {
        return JSON.parse(jsoned, (key, value) => {
            if (value && value._v) {
                if (value._t === 'set') {
                    return new Set(value._v);
                }

                if (value._t === 'func') {
                    return new Function(`return ${value._v}`);
                }
            }

            return value;
        });
    }
};