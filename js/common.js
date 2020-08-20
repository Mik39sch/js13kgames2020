function rgb(r,g,b)
{
    let c = [r,g,b].map(function(a){
        return ("0" + a.toString(16)).slice(-2)
    }).join("");
    return "#" + c;
}