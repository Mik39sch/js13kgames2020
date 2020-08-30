function rgb(r,g,b)
{
    let c = [r,g,b].map(function(a){
        return ("0" + a.toString(16)).slice(-2)
    }).join("");
    return "#" + c;
}

function getRandomInt(num0, num1) {
    let min = Math.min(num0, num1);
    let max = Math.max(num0, num1);
    return Math.floor(Math.random() * (max - min) + min);
}