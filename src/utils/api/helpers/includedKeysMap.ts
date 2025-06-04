interface IncludedKeysMapProps {
    included: any[];
    typeMap: Map<string, Map<string, any>>;
}

const includedKeysMap = ({ included, typeMap }: IncludedKeysMapProps): void => {
    included?.forEach((item) => {
        const { type, id, attributes, relationships } = item;

        if (!typeMap.has(type)) {
            typeMap.set(type, new Map<string, any>());
        }

        typeMap.get(type)!.set(id, { ...attributes, relationships });
    });
};

export default includedKeysMap;
