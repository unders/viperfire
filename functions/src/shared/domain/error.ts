export const collectionName = "errors";

export const docPath = (id: string): string => {
    return `${collectionName}/${id}`;
};
