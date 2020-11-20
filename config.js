let normalaizeUrl = (url) => {
    if (url && url.length && url[url.length - 1] != '/') {
        return url + '/';
    }
    return url;
}

module.exports = {
    rutrackerUrl: normalaizeUrl(process.env.RUTRACKER_URL) || 'https://rutracker.net/',
}