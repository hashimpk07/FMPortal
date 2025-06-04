interface JsMapProps {
    jsMap: Map<string, Map<string, Record<string, string> | any>>;
    mapKey: string;
}

const mapToPlainObject = ({ jsMap, mapKey }: JsMapProps) => {
    const mapEntries = jsMap.get(mapKey)?.entries() || [];

    const entriesWithId = Array.from(mapEntries).map(([id, value]) => ({
        ...Object.fromEntries(Object.entries(value)),
        id,
    }));

    const plainObject = Object.fromEntries(entriesWithId.map((item) => [item.id, item]));

    return plainObject;
};

export default mapToPlainObject;
