interface PopulateRelationshipsProps {
    aggData: any[];
    includesMapping: Record<string, string | string[]>;
    dicts: Record<string, Record<string, unknown>>;
}

const populateRelationships = ({ aggData, includesMapping, dicts }: PopulateRelationshipsProps) => {
    // First Pass: Populate top-level relationships
    const responseData = aggData.map((data) => {
        const relationships = data?.relationships;

        if (!relationships) {
            return null;
        }

        const relationshipData = Object.keys(relationships).reduce(
            (acc, relationshipKey) => {
                const mappings = includesMapping[relationshipKey];
                const includesKeys = Array.isArray(mappings) ? mappings : [mappings];
                const relationshipData = relationships[relationshipKey].data;

                // Handle both array and single object relationships
                if (Array.isArray(relationshipData)) {
                    acc[relationshipKey] = relationshipData.map((rel) => {
                        // Collect the base-level data for this relationship
                        const includeObjects = includesKeys.reduce(
                            (objAcc, includesKey) => {
                                const includesSingleData =
                                    dicts?.[includesKey as keyof typeof dicts];
                                const relatedData = includesSingleData?.[
                                    rel.id as keyof typeof includesSingleData
                                ] as Record<string, unknown>;
                                return {
                                    ...objAcc,
                                    ...relatedData,
                                };
                            },
                            {} as Record<string, unknown>,
                        );

                        return {
                            ...rel,
                            ...includeObjects,
                        };
                    });
                } else {
                    includesKeys.forEach((includesKey) => {
                        const relationshipId = relationshipData?.id;
                        const includeKey = includesKey as keyof typeof dicts;
                        const includesSingleData = dicts?.[includeKey];
                        const includesRelationship = includesSingleData?.[relationshipId];

                        acc[relationshipKey] = {
                            ...relationshipData,
                            ...(includesRelationship as Record<string, unknown>),
                        };
                    });
                }

                return acc;
            },
            {} as Record<string, unknown>,
        );

        return {
            ...data,
            relationships: relationshipData,
        };
    });

    // Second Pass: Resolve nested relationships within populated relationships
    const processedData = responseData.map((item) => {
        const relationships = item?.relationships;

        if (!relationships) return item;

        Object.keys(relationships).forEach((relationshipKey) => {
            const relationshipData = relationships[relationshipKey];

            // Only proceed if relationshipData is an array (e.g., multiple revisions)
            if (Array.isArray(relationshipData)) {
                relationshipData.forEach((rel) => {
                    const nestedRelationships = rel?.relationships;

                    // If nested relationships exist (e.g., 'createdByUser' within a revision)
                    if (nestedRelationships) {
                        Object.keys(nestedRelationships).forEach((nestedKey) => {
                            const nestedMapping =
                                includesMapping[`${relationshipKey}.${nestedKey}`];
                            const nestedIncludeKeys = Array.isArray(nestedMapping)
                                ? nestedMapping
                                : [nestedMapping];

                            // Access the ID and type of the nested relationship
                            const nestedId = nestedRelationships[nestedKey]?.data?.id;
                            const nestedType = nestedRelationships[nestedKey]?.data?.type;

                            // Only proceed if nestedType is in the mappings
                            nestedIncludeKeys.forEach((nestedIncludeKey) => {
                                if (nestedType === nestedIncludeKey) {
                                    const nestedDict =
                                        dicts?.[nestedIncludeKey as keyof typeof dicts];
                                    const nestedData =
                                        nestedDict?.[nestedId as keyof typeof nestedDict];

                                    if (nestedData) {
                                        // eslint-disable-next-line no-param-reassign
                                        rel[nestedKey] = {
                                            ...nestedRelationships[nestedKey],
                                            ...nestedData,
                                        };
                                    }
                                }
                            });
                        });
                    }
                });
            }
        });

        return item;
    });

    return processedData;
};

export default populateRelationships;
