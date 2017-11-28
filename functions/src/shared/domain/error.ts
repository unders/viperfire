export const errorCollection = "errors";

export const docPath = (id: string): string => {
    return `${errorCollection}/${id}`;
};
