const urlContainsQueryString = (path: string) => {
    const hasQuery = path.indexOf('?') !== -1;
    return hasQuery;
};

export default urlContainsQueryString;
