export const errorCollection = "errors";

export const errorPath = (id: string): string => {
    return `${errorCollection}/${id}`;
};
