export default () => {
    let apiUrl = ''

    if (window.location.hostname == 'localhost') {
        apiUrl = 'http://localhost:4000'
    }

    return {
        apiUrl: apiUrl
    }
}