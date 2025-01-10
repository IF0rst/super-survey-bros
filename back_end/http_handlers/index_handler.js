const PUBLIC = (require.main.path + "/front_end/public")

function index_get(request,response){
    response.render(PUBLIC+"/html/index.html")
}

module.exports = {
    index_get,
}