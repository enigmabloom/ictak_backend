const http=require ("http");
const server = http.createServer((req,res)=>{
    if (req.url=='/projectboard') {
        res.write("Server is up and running!!")
    res.end();
    } else {
        res.write("path not found");
        res.end()
    }
});
server.listen(4000);
